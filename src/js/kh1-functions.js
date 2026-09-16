/*
===============================================================================
KINGDOM HEARTS FINAL MIX FUNCTIONS
===============================================================================

This file contains reusable parser/helper functions.

It answers:
    "How do I read or convert this data?"

The database file tells us WHERE.
The dictionary file tells us WHAT THE IDs MEAN.
This file performs the work.
*/

import KH1_DICTIONARY from "./kh1-dictionary.js";

const TEXT_DECODERS =
  new Map();

function GetTextDecoder(encoding) {
  const key =
    String(encoding)
      .toLowerCase();

  if (!TEXT_DECODERS.has(key)) {
    TEXT_DECODERS.set(
      key,
      new TextDecoder(encoding)
    );
  }

  return TEXT_DECODERS.get(
    key
  );
}

function CreateDataView(bytes) {
  return new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength
  );
}

function BytesToHex(bytes) {
  return Array.from(
    bytes,
    byte =>
      byte.toString(16).padStart(2, "0")
  ).join("");
}

function ReadCString(
  bytes,
  offset,
  maximumLength,
  encoding = "utf-8"
) {
  const data =
    bytes.slice(
      offset,
      offset + maximumLength
    );

  let end =
    data.indexOf(0);

  if (end < 0) {
    end =
      data.length;
  }

  const stringBytes =
    data.slice(
      0,
      end
    );

  try {
    return GetTextDecoder(
      encoding
    )
      .decode(stringBytes)
      .replace(/\u0090/g, "")
      .normalize("NFKC");
  } catch {
    return GetTextDecoder(
      "utf-8"
    ).decode(
      stringBytes
    );
  }
}

function SafeUnixDate(seconds) {
  if (!seconds) {
    return null;
  }

  const date =
    new Date(seconds * 1000);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function CountBits(value) {
  let count = 0;
  let current = value;

  while (current) {
    current &= current - 1;
    count++;
  }

  return count;
}

function CountBitsInBytes(bytes) {
  return Array.from(bytes)
    .reduce(
      (total, byte) =>
        total + CountBits(byte),
      0
    );
}

/*
 * Decode a table of independent bit flags.
 *
 * Each mapping entry may point anywhere inside the save block. This is
 * important for features such as Trinity marks: most confirmed locations use
 * the normal persistent Trinity table, but action-dependent locations may be
 * stored in separate environment/event flags elsewhere in the save.
 *
 * Unknown mappings deliberately return `found: null`; we never guess from a
 * counter or from a neighboring bit.
 */
function DecodeMappedBitStates(
  save,
  mappings
) {
  return Object.fromEntries(
    Object.entries(mappings)
      .map(
        ([key, mapping]) => {
          const hasExactFlag =
            Number.isInteger(
              mapping.offset
            ) &&
            Number.isInteger(
              mapping.mask
            );

          const inRange =
            hasExactFlag &&
            mapping.offset >= 0 &&
            mapping.offset < save.length;

          return [
            key,
            {
              ...mapping,
              found:
                inRange
                  ? Boolean(
                      save[mapping.offset] &
                      mapping.mask
                    )
                  : null
            }
          ];
        }
      )
  );
}

function ItemName(itemId) {
  return (
    KH1_DICTIONARY.ITEM_NAMES[itemId] ??
    `Unknown Item ${itemId}`
  );
}

function AbilityName(abilityId) {
  return (
    KH1_DICTIONARY.ABILITY_NAMES[abilityId] ??
    `Unknown Ability ${abilityId}`
  );
}

/*
 * Archive-directory XOR decoding.
 *
 * The 16-byte key is stored at 0xE0..0xEF.
 * The first 0xF0 bytes repeat that key.
 */
function DecodeArchiveDirectory(directoryBytes) {
  const decoded =
    directoryBytes.slice();

  const key =
    decoded.slice(
      0xE0,
      0xF0
    );

  for (
    let index = 0;
    index < 0xF0;
    index++
  ) {
    decoded[index] ^=
      key[index % 16];
  }

  return {
    decoded,
    key
  };
}

/*
 * Decode 99 Puppies.
 *
 * 99 booleans are packed into 13 bytes.
 * Mapping used here is MSB-first.
 */
function DecodePuppies(save, KH1_SAVE) {
  const raw =
    save.slice(
      KH1_SAVE.PUPPIES,
      KH1_SAVE.PUPPIES +
      KH1_SAVE.PUPPIES_LENGTH
    );

  const found =
    [];

  for (
    let puppy = 1;
    puppy <= 99;
    puppy++
  ) {
    const byteIndex =
      Math.floor((puppy - 1) / 8);

    const bitIndex =
      (puppy - 1) % 8;

    const mask =
      0x80 >> bitIndex;

    if (raw[byteIndex] & mask) {
      found.push(puppy);
    }
  }

  return {
    foundCount:
      found.length,
    foundIds:
      found,
    rawHex:
      BytesToHex(raw)
  };
}

function DecodeReports(save, KH1_SAVE) {
  const raw =
    save.slice(
      KH1_SAVE.ANSEM_REPORTS,
      KH1_SAVE.ANSEM_REPORTS + 2
    );

  const reports =
    [];

  for (
    let index = 0;
    index < 8;
    index++
  ) {
    if (raw[0] & (0x80 >> index)) {
      reports.push(index + 1);
    }
  }

  for (
    let index = 0;
    index < 5;
    index++
  ) {
    if (raw[1] & (0x80 >> index)) {
      reports.push(index + 9);
    }
  }

  return {
    count:
      reports.length,
    reports,
    rawHex:
      BytesToHex(raw)
  };
}

function DecodeSummons(save, KH1_SAVE) {
  const raw =
    Array.from(
      save.slice(
        KH1_SAVE.SUMMONS,
        KH1_SAVE.SUMMONS + 6
      )
    );

  const unlocked =
    raw
      .filter(
        summonId =>
          KH1_DICTIONARY.SUMMON_NAMES[summonId] !== undefined
      )
      .map(
        summonId =>
          KH1_DICTIONARY.SUMMON_NAMES[summonId]
      );

  return {
    raw,
    unlocked,
    count:
      unlocked.length
  };
}

function DecodeTrinity(save, KH1_SAVE, KH1_TRINITY_MARK_STATES = {}) {
  const unlockByte =
    save[
      KH1_SAVE.TRINITY_UNLOCKS
    ];

  const unlocked =
    KH1_DICTIONARY.TRINITY_NAMES
      .filter(
        (name, index) =>
          unlockByte &
          (1 << index)
      );

  const rawCounters =
    Array.from(
      save.slice(
        KH1_SAVE.TRINITY_COUNTERS,
        KH1_SAVE.TRINITY_COUNTERS +
        KH1_SAVE.TRINITY_COUNTERS_LENGTH
      )
    );

  const counts = {
    Blue:
      rawCounters[0],

    Red:
      rawCounters[2],

    Green:
      rawCounters[3],

    Yellow:
      rawCounters[4],

    White:
      rawCounters[5]
  };

  const rawMarkFlags =
    Array.from(
      save.slice(
        KH1_SAVE.TRINITY_MARK_FLAGS,
        KH1_SAVE.TRINITY_MARK_FLAGS +
        KH1_SAVE.TRINITY_MARK_FLAGS_LENGTH
      )
    );

  const persistentMarkedTotal =
    CountBitsInBytes(
      rawMarkFlags
    );

  const foundTotal =
    Object.values(counts)
      .reduce(
        (total, value) =>
          total + value,
        0
      );

  /*
   * Decode each physical Trinity independently.
   *
   * Do not limit mappings to 0x1C6C..0x1C7F. The eight action-dependent
   * Trinities may eventually resolve to environment/event flags elsewhere in
   * the save, so each mapping reads its absolute save offset directly.
   */
  const markStates =
    DecodeMappedBitStates(
      save,
      KH1_TRINITY_MARK_STATES
    );

  return {
    unlockByte,
    unlocked,
    rawCounters,
    counts,
    foundTotal,
    rawMarkFlags,
    markStates,
    markFlagsOffset:
      KH1_SAVE.TRINITY_MARK_FLAGS,
    markFlagsLength:
      KH1_SAVE.TRINITY_MARK_FLAGS_LENGTH,
    persistentMarkedTotal,
    exceptionalCount:
      Math.max(
        0,
        foundTotal -
        persistentMarkedTotal
      )
  };
}


/*
===============================================================================
RAW / RESEARCH HELPERS
===============================================================================
These helpers are intentionally generic so you can inspect unknown regions
without changing the binary parser each time.

Example:
    ReadRawRegion(save, 0x7DA, 96)

returns:
    rawBytes
    rawHex
    uint16LE
    uint32LE
    setBits

This makes it much easier to compare two save slots and discover what changed.
*/

function ReadUInt16ArrayLE(bytes) {
  const view =
    CreateDataView(bytes);

  const result =
    [];

  for (
    let offset = 0;
    offset + 1 < bytes.length;
    offset += 2
  ) {
    result.push(
      view.getUint16(
        offset,
        true
      )
    );
  }

  return result;
}

function ReadUInt32ArrayLE(bytes) {
  const view =
    CreateDataView(bytes);

  const result =
    [];

  for (
    let offset = 0;
    offset + 3 < bytes.length;
    offset += 4
  ) {
    result.push(
      view.getUint32(
        offset,
        true
      )
    );
  }

  return result;
}

function GetSetBitIndexes(bytes) {
  const result =
    [];

  for (
    let byteIndex = 0;
    byteIndex < bytes.length;
    byteIndex++
  ) {
    const value =
      bytes[byteIndex];

    for (
      let bit = 0;
      bit < 8;
      bit++
    ) {
      if (
        value &
        (1 << bit)
      ) {
        result.push(
          byteIndex * 8 + bit
        );
      }
    }
  }

  return result;
}

function ReadRawRegion(
  saveBytes,
  offset,
  length
) {
  const raw =
    saveBytes.slice(
      offset,
      offset + length
    );

  return {
    offset,
    offsetHex:
      `0x${offset.toString(16).toUpperCase()}`,

    length,

    rawBytes:
      Array.from(raw),

    rawHex:
      BytesToHex(raw),

    uint16LE:
      ReadUInt16ArrayLE(raw),

    uint32LE:
      ReadUInt32ArrayLE(raw),

    setBitIndexes:
      GetSetBitIndexes(raw)
  };
}

/*
 * Compare two save blocks byte-by-byte.
 *
 * This is one of the most useful reverse-engineering tools.
 * If you perform ONE action in-game, save again, then compare the two slots,
 * this function shows every changed byte offset.
 */
function CompareSaveBytes(
  beforeBytes,
  afterBytes
) {
  const maxLength =
    Math.min(
      beforeBytes.length,
      afterBytes.length
    );

  const changes =
    [];

  for (
    let offset = 0;
    offset < maxLength;
    offset++
  ) {
    const before =
      beforeBytes[offset];

    const after =
      afterBytes[offset];

    if (
      before !== after
    ) {
      changes.push({
        offset,
        offsetHex:
          `0x${offset.toString(16).toUpperCase()}`,
        before,
        after,
        beforeHex:
          before.toString(16).padStart(2, "0").toUpperCase(),
        afterHex:
          after.toString(16).padStart(2, "0").toUpperCase(),
        xor:
          before ^ after,
        xorHex:
          (before ^ after)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()
      });
    }
  }

  return {
    changedByteCount:
      changes.length,
    changes
  };
}



/*
===============================================================================
ENEMY DEFEAT COUNTERS
===============================================================================

Working table layout:

    start  : 0x07D8
    count  : 50
    type   : uint16 little-endian
    stride : 2 bytes

Formula for enemy counter index N:

    saveOffset = KH1_SAVE.ENEMY_COUNTERS + (N * 2)

The function decodes ALL 50 counters so unidentified indexes are never lost.

For display, journalGroups uses KH1_DICTIONARY.ENEMY_JOURNAL_GROUPS to keep
the exact in-game Journal order supplied by the reverse-engineering mapping.
*/
function DecodeEnemyCounters(
  save,
  KH1_SAVE
) {
  const raw =
    save.slice(
      KH1_SAVE.ENEMY_COUNTERS,
      KH1_SAVE.ENEMY_COUNTERS +
      KH1_SAVE.ENEMY_COUNTERS_LENGTH
    );

  const view =
    CreateDataView(
      raw
    );

  const counters =
    [];

  for (
    let index = 0;
    index < KH1_SAVE.ENEMY_COUNTERS_COUNT;
    index++
  ) {
    const relativeOffset =
      index * 2;

    const saveOffset =
      KH1_SAVE.ENEMY_COUNTERS +
      relativeOffset;

    const defeated =
      view.getUint16(
        relativeOffset,
        true
      );

    const name =
      KH1_DICTIONARY.ENEMY_NAMES[
        index
      ] ?? null;

    counters.push({
      index,

      name,

      identified:
        name !== null,

      offset:
        saveOffset,

      offsetHex:
        `0x${saveOffset
          .toString(16)
          .toUpperCase()}`,

      defeated
    });
  }

  /*
   * Convert the user's Journal index order into decoded counter objects.
   *
   * We use counters[index] rather than sorting anything. That guarantees
   * the visual order stays exactly the same as ENEMY_JOURNAL_GROUPS.
   */
  const journalGroups =
    KH1_DICTIONARY.ENEMY_JOURNAL_GROUPS
      .map(
        group =>
          group.map(
            index =>
              counters[index]
          )
      );

  return {
    offset:
      KH1_SAVE.ENEMY_COUNTERS,

    offsetHex:
      `0x${KH1_SAVE.ENEMY_COUNTERS
        .toString(16)
        .toUpperCase()}`,

    length:
      KH1_SAVE.ENEMY_COUNTERS_LENGTH,

    /*
     * There are 50 physical uint16 counter positions in this save area,
     * but only 46 of them are normal Heartless Journal entries.
     *
     * Indexes 36, 37, 38 and 46 are not normal enemy entries.
     */
    rawCounterCount:
      KH1_SAVE.ENEMY_COUNTERS_COUNT,

    journalEnemyCount:
      KH1_DICTIONARY.ENEMY_JOURNAL_GROUPS
        .reduce(
          (total, group) =>
            total + group.length,
          0
        ),

    nonJournalCounterIndexes: [
      36,
      37,
      38,
      46
    ],

    rawBytes:
      Array.from(
        raw
      ),

    rawHex:
      BytesToHex(
        raw
      ),

    /*
     * All 50 entries in counter-index order.
     * Useful for reverse engineering.
     */
    counters,

    /*
     * Identified entries in the exact in-game Journal order.
     * Useful for the normal interface.
     */
    journalGroups
  };
}


/*
===============================================================================
SYNTHESIS COMPLETION
===============================================================================

The synthesis completion state is stored at:

    0x19C8 .. 0x19CC
    5 bytes
    33 meaningful bits

Bit order is MSB-first:

    recipe 0  -> 0x19C8 bit 7 (0x80)
    recipe 1  -> 0x19C8 bit 6 (0x40)
    ...
    recipe 7  -> 0x19C8 bit 0 (0x01)
    recipe 8  -> 0x19C9 bit 7
    ...
    recipe 31 -> 0x19CB bit 0
    recipe 32 -> 0x19CC bit 7

Evidence from sequential controlled saves:
    Slot 9  (nothing):
        00 00 00 00 00

    Slot 10 (+ Mega-Potion):
        80 00 00 00 00

    Slot 11 (+ Cottage):
        C0 00 00 00 00

    Slot 12 (+ Energy Bangle):
        E0 00 00 00 00

    Slot 13 (+ Power Chain):
        F0 00 00 00 00

    Slot 14:
        F0 00 00 00 00
        Same synthesis state as Slot 13 even though inventory quantities
        were raised to 80. This confirms inventory ownership is separate
        from the synthesized-at-least-once flags.

    Slot 15 (+ Magic Armlet):
        F8 00 00 00 00

    Slot 16 (+ EXP Earring):
        FC 00 00 00 00

    Slot 17 (+ Mega-Ether):
        FE 00 00 00 00

    Slot 18 (+ Guard Earring):
        FF 00 00 00 00

    Slot 19 (+ Angel Bangle):
        FF 80 00 00 00

    Slot 20 (+ Golem Chain):
        FF C0 00 00 00

    Slot 21 (+ Rune Armlet):
        FF E0 00 00 00

    Slot 22 (+ Moogle Badge):
        FF F0 00 00 00

    Slot 23 (+ AP Up):
        FF F8 00 00 00

    Slot 24 (+ Dark Ring):
        FF FC 00 00 00

    Slot 25 (+ Master Earring):
        FF FE 00 00 00

    Slot 26 (+ Gaia Bangle):
        FF FF 00 00 00

    Slot 27 (+ Titan Chain):
        FF FF 80 00 00

    Slot 28 (+ Mythril):
        FF FF C0 00 00

    Slot 29 (+ Elixir):
        FF FF E0 00 00

    Slot 30 (+ Defense Up):
        FF FF F0 00 00

    Slot 31 (+ Heartguard):
        FF FF F8 00 00

    Slot 32 (+ Three Stars):
        FF FF FC 00 00

    Slot 33 (+ Atlas Armlet):
        FF FF FE 00 00

    Slot 34 (+ Crystal Crown):
        FF FF FF 00 00

    Slot 35 (+ Megalixir):
        FF FF FF 80 00

    Slot 36 (+ Power Up):
        FF FF FF C0 00

    Slot 37 (+ Cosmic Arts):
        FF FF FF E0 00

    Slot 38 (+ EXP Bracelet):
        FF FF FF F0 00

    Slot 39 (+ Ribbon):
        FF FF FF F8 00

    Slot 40 (+ Dark Matter):
        FF FF FF FC 00

    Slot 41 (+ Fantasista):
        FF FF FF FE 00

    Slot 42 (+ Seven Elements):
        FF FF FF FF 00

    Slot 43 (+ Ultima Weapon):
        FF FF FF FF 80

All 33 synthesis recipe indexes are now directly confirmed by sequential
controlled saves.

The complete mapping is:
    index  0 = Mega-Potion    = 0x19C8 mask 0x80
    index  1 = Cottage        = 0x19C8 mask 0x40
    index  2 = Energy Bangle  = 0x19C8 mask 0x20
    index  3 = Power Chain    = 0x19C8 mask 0x10
    index  4 = Magic Armlet   = 0x19C8 mask 0x08
    index  5 = EXP Earring    = 0x19C8 mask 0x04
    index  6 = Mega-Ether     = 0x19C8 mask 0x02
    index  7 = Guard Earring  = 0x19C8 mask 0x01

    index  8 = Angel Bangle   = 0x19C9 mask 0x80
    index  9 = Golem Chain    = 0x19C9 mask 0x40
    index 10 = Rune Armlet    = 0x19C9 mask 0x20
    index 11 = Moogle Badge   = 0x19C9 mask 0x10
    index 12 = AP Up          = 0x19C9 mask 0x08
    index 13 = Dark Ring      = 0x19C9 mask 0x04
    index 14 = Master Earring = 0x19C9 mask 0x02
    index 15 = Gaia Bangle    = 0x19C9 mask 0x01

    index 16 = Titan Chain    = 0x19CA mask 0x80
    index 17 = Mythril        = 0x19CA mask 0x40
    index 18 = Elixir         = 0x19CA mask 0x20
    index 19 = Defense Up     = 0x19CA mask 0x10
    index 20 = Heartguard     = 0x19CA mask 0x08
    index 21 = Three Stars    = 0x19CA mask 0x04
    index 22 = Atlas Armlet   = 0x19CA mask 0x02
    index 23 = Crystal Crown  = 0x19CA mask 0x01

    index 24 = Megalixir      = 0x19CB mask 0x80
    index 25 = Power Up       = 0x19CB mask 0x40
    index 26 = Cosmic Arts    = 0x19CB mask 0x20
    index 27 = EXP Bracelet   = 0x19CB mask 0x10
    index 28 = Ribbon         = 0x19CB mask 0x08
    index 29 = Dark Matter    = 0x19CB mask 0x04
    index 30 = Fantasista     = 0x19CB mask 0x02
    index 31 = Seven Elements = 0x19CB mask 0x01

    index 32 = Ultima Weapon  = 0x19CC mask 0x80

All byte-boundary transitions are directly confirmed:
    index 7  -> 8  : 0x19C8 -> 0x19C9
    index 15 -> 16 : 0x19C9 -> 0x19CA
    index 23 -> 24 : 0x19CA -> 0x19CB
    index 31 -> 32 : 0x19CB -> 0x19CC
*/
function DecodeSynthesisFlags(
  save,
  KH1_SAVE
) {
  const raw =
    save.slice(
      KH1_SAVE.SYNTHESIS_FLAGS,
      KH1_SAVE.SYNTHESIS_FLAGS +
      KH1_SAVE.SYNTHESIS_FLAGS_LENGTH
    );

  const items =
    [];

  for (
    let index = 0;
    index < KH1_SAVE.SYNTHESIS_ITEM_COUNT;
    index++
  ) {
    const byteIndex =
      Math.floor(
        index / 8
      );

    const bitIndex =
      index % 8;

    const mask =
      0x80 >> bitIndex;

    const completed =
      Boolean(
        raw[byteIndex] &
        mask
      );

    items.push({
      index,

      byteIndex,

      saveOffset:
        KH1_SAVE.SYNTHESIS_FLAGS +
        byteIndex,

      saveOffsetHex:
        `0x${(
          KH1_SAVE.SYNTHESIS_FLAGS +
          byteIndex
        )
          .toString(16)
          .toUpperCase()}`,

      bitIndex,

      mask,

      maskHex:
        `0x${mask
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()}`,

      completed,

      /*
       * All indexes 0..32 have now been individually verified by
       * sequential controlled synthesis tests.
       */
      mappingConfidence:
        "confirmed"
    });
  }

  const completedIndexes =
    items
      .filter(
        item =>
          item.completed
      )
      .map(
        item =>
          item.index
      );

  const listProgressRaw =
    save[
      KH1_SAVE.SYNTHESIS_LIST_PROGRESS
    ];

  const listProgressLabels = {
    0: "List I / no synthesis-list milestone",
    1: "List II unlocked",
    2: "List III unlocked",
    3: "List IV unlocked",
    4: "List V unlocked",
    5: "List VI unlocked",
    6: "Final synthesis stage / all 33 on known complete save"
  };

  return {
    offset:
      KH1_SAVE.SYNTHESIS_FLAGS,

    offsetHex:
      `0x${KH1_SAVE.SYNTHESIS_FLAGS
        .toString(16)
        .toUpperCase()}`,

    length:
      KH1_SAVE.SYNTHESIS_FLAGS_LENGTH,

    target:
      KH1_SAVE.SYNTHESIS_ITEM_COUNT,

    completedCount:
      completedIndexes.length,

    completedIndexes,

    listProgress: {
      offset:
        KH1_SAVE.SYNTHESIS_LIST_PROGRESS,

      offsetHex:
        `0x${KH1_SAVE.SYNTHESIS_LIST_PROGRESS
          .toString(16)
          .toUpperCase()}`,

      raw:
        listProgressRaw,

      label:
        listProgressLabels[
          listProgressRaw
        ] ??
        `Unknown stage (${listProgressRaw})`,

      /*
       * Directly observed controlled transitions:
       *   3 unique recipes  -> stage 1
       *   9 unique recipes  -> stage 2
       *   15 unique recipes -> stage 3
       *   21 unique recipes -> stage 4
       *   30 unique recipes -> stage 5
       *   33 unique recipes -> stage 6
       *
       * Stages 0..6 are now all observed in controlled sequential saves.
       */
      confidence:
        (
          listProgressRaw >= 0 &&
          listProgressRaw <= 6
        )
          ? "confirmed by controlled tests"
          : "unknown stage"
    },

    rawBytes:
      Array.from(raw),

    rawHex:
      BytesToHex(raw),

    items
  };
}


/*
 * Decode Gummi Ship blueprint ownership.
 *
 * The Final Mix save uses one byte per blueprint at 0xBEBF..0xBEEE.
 * 0 means missing; any non-zero value is treated as owned.
 */
function DecodeGummiBlueprints(
  save,
  KH1_SAVE,
  blueprintNames
) {
  const raw =
    save.slice(
      KH1_SAVE.GUMMI_BLUEPRINTS,
      KH1_SAVE.GUMMI_BLUEPRINTS +
      KH1_SAVE.GUMMI_BLUEPRINTS_LENGTH
    );

  const entries =
    Array.from(
      raw,
      (value, index) => ({
        index,

        name:
          blueprintNames?.[index] ??
          `Blueprint ${index + 1}`,

        offset:
          KH1_SAVE.GUMMI_BLUEPRINTS +
          index,

        offsetHex:
          `0x${(
            KH1_SAVE.GUMMI_BLUEPRINTS +
            index
          )
            .toString(16)
            .toUpperCase()}`,

        raw:
          value,

        owned:
          value !== 0
      })
    );

  const owned =
    entries.filter(
      entry =>
        entry.owned
    );

  return {
    offset:
      KH1_SAVE.GUMMI_BLUEPRINTS,

    offsetHex:
      `0x${KH1_SAVE.GUMMI_BLUEPRINTS
        .toString(16)
        .toUpperCase()}`,

    length:
      KH1_SAVE.GUMMI_BLUEPRINTS_LENGTH,

    ownedCount:
      owned.length,

    ownedIndexes:
      owned.map(
        entry =>
          entry.index
      ),

    entries,

    rawBytes:
      Array.from(raw),

    rawHex:
      BytesToHex(raw)
  };
}

export {
  CreateDataView,
  BytesToHex,
  ReadCString,
  SafeUnixDate,
  CountBits,
  CountBitsInBytes,
  DecodeMappedBitStates,
  ItemName,
  AbilityName,
  DecodeArchiveDirectory,
  DecodePuppies,
  DecodeReports,
  DecodeSummons,
  DecodeTrinity,
  DecodeEnemyCounters,
  DecodeSynthesisFlags,
  DecodeGummiBlueprints,
  ReadUInt16ArrayLE,
  ReadUInt32ArrayLE,
  GetSetBitIndexes,
  ReadRawRegion,
  CompareSaveBytes
};
