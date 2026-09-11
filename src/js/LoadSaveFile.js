/*
===============================================================================
LOAD KINGDOM HEARTS SAVE FILE
===============================================================================

This file plays the same role as LoadSaveFile.js in your Silksong project.

Silksong:
    File -> C# header removal -> Base64 -> AES -> JSON

Kingdom Hearts Final Mix:
    File -> binary archive -> XOR directory -> archive records ->
    0x16C00 save block -> parsed JavaScript object

There is no JSON inside KHFM_WW.png.
We CREATE the JSON after interpreting the binary structure.
*/

import {
  KH1_ARCHIVE,
  KH1_SAVE,
  KH1_RESEARCH_REGIONS,
  KH1_JOURNAL_CHARACTER_STATES,
  KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS,
  KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS,
  KH1_ACRE_WOOD_MINIGAMES,
  KH1_KNOWN_CHESTS,
  KH1_OLYMPUS
} from "./kh1-database.js";

import KH1_DICTIONARY from "./kh1-dictionary.js";

import {
  CreateDataView,
  ReadCString,
  SafeUnixDate,
  DecodeArchiveDirectory,
  DecodePuppies,
  DecodeReports,
  DecodeSummons,
  DecodeTrinity,
  DecodeEnemyCounters,
  DecodeSynthesisFlags,
  DecodeGummiBlueprints,
  ItemName,
  AbilityName,
  BytesToHex,
  CountBitsInBytes,
  ReadRawRegion
} from "./kh1-functions.js";

import {
  KH1CheckCompletion
} from "./KH1CheckCompletion.js";

function ParseArchiveEntry(
  directory,
  archiveIndex
) {
  const base =
    archiveIndex *
    KH1_ARCHIVE.ENTRY_LENGTH;

  const view =
    CreateDataView(directory);

  const created =
    view.getInt32(
      base + 0x40,
      true
    );

  const modified =
    view.getInt32(
      base + 0x48,
      true
    );

  return {
    archiveIndex,

    name:
      ReadCString(
        directory,
        base,
        0x40
      ),

    createdUnix:
      created,

    createdIso:
      SafeUnixDate(created),

    modifiedUnix:
      modified,

    modifiedIso:
      SafeUnixDate(modified),

    length:
      view.getInt32(
        base + 0x50,
        true
      )
  };
}

function ParseCharacter(
  save,
  characterIndex
) {
  const base =
    KH1_SAVE.CHARACTER_START +
    characterIndex *
    KH1_SAVE.CHARACTER_SIZE;

  const view =
    CreateDataView(save);

  const accessoryIds =
    Array.from(
      save.slice(
        base + 0x19,
        base + 0x21
      )
    );

  const itemIds =
    Array.from(
      save.slice(
        base + 0x22,
        base + 0x2E
      )
    );

  const rawAbilities =
    Array.from(
      save.slice(
        base + 0x40,
        base + 0x70
      )
    );

  return {
    name:
      KH1_DICTIONARY.CHARACTER_NAMES[
        characterIndex
      ],

    level:
      save[base],

    hpCurrent:
      save[base + 0x01],

    hpMax:
      save[base + 0x02],

    mpCurrent:
      save[base + 0x03],

    mpMax:
      save[base + 0x04],

    ap:
      save[base + 0x05],

    strength:
      save[base + 0x06],

    defense:
      save[base + 0x07],

    accessories:
      accessoryIds
        .filter(Boolean)
        .map(
          id => ({
            id,
            name:
              ItemName(id)
          })
        ),

    items:
      itemIds
        .filter(Boolean)
        .map(
          id => ({
            id,
            name:
              ItemName(id)
          })
        ),

    weapon: {
      id:
        save[base + 0x32],

      name:
        ItemName(
          save[base + 0x32]
        )
    },

    experience:
      view.getInt32(
        base + 0x3C,
        true
      ),

    abilities:
      rawAbilities
        .map(
          (raw, position) => {
            const id =
              raw & 0x7F;

            if (!id) {
              return null;
            }

            return {
              position,
              raw,
              id,
              name:
                AbilityName(id),

              enabled:
                raw < 0x80
            };
          }
        )
        .filter(Boolean)
  };
}

function ParseInventory(save) {
  const inventoryBytes =
    save.slice(
      KH1_SAVE.INVENTORY,
      KH1_SAVE.INVENTORY +
      KH1_SAVE.INVENTORY_LENGTH
    );

  const inventory =
    [];

  inventoryBytes.forEach(
    (quantity, itemId) => {
      if (quantity > 0) {
        inventory.push({
          itemId,
          name:
            ItemName(itemId),
          quantity
        });
      }
    }
  );

  return inventory;
}

function ParseSystem(systemBytes) {
  if (!systemBytes) {
    return null;
  }

  const view =
    CreateDataView(systemBytes);

  const difficulty =
    view.getUint32(
      0x38,
      true
    );

  const worldId =
    view.getUint16(
      0x3C,
      true
    );

  return {
    soraLevel:
      view.getUint32(
        0x08,
        true
      ),

    munny:
      view.getUint32(
        0x0C,
        true
      ),

    timerRaw:
      view.getUint32(
        0x10,
        true
      ),

    location:
      ReadCString(
        systemBytes,
        0x14,
        0x20,
        "shift-jis"
      ),

    difficulty,

    difficultyName:
      KH1_DICTIONARY.DIFFICULTY_NAMES[
        difficulty
      ],

    worldId,

    world:
      KH1_DICTIONARY.WORLD_NAMES[
        worldId
      ],

    room:
      view.getUint16(
        0x3E,
        true
      )
  };
}


function ParseResearchData(save) {
  const regions =
    {};

  Object.entries(
    KH1_RESEARCH_REGIONS
  ).forEach(
    ([key, definition]) => {
      regions[key] = {
        label:
          definition.label,

        confidence:
          definition.confidence,

        ...ReadRawRegion(
          save,
          definition.offset,
          definition.length
        )
      };
    }
  );

  return {
    /*
     * COMPLETE RAW SAVE BLOCK.
     *
     * This guarantees that no unknown byte is lost.
     * You can always return later and investigate a new offset.
     */
    fullSave: {
      length:
        save.length,

      rawHex:
        BytesToHex(save)
    },

    regions
  };
}



/*
===============================================================================
KNOWN JOURNAL CHARACTER ENTRIES
===============================================================================
*/
function ParseKnownJournalCharacters(save) {
  const entries = {};

  Object.entries(
    KH1_JOURNAL_CHARACTER_STATES
  ).forEach(
    ([key, stateDefinitions]) => {
      const name =
        KH1_DICTIONARY
          .JOURNAL_CHARACTER_NAMES
          ?.[key] ??
        key;

      const stateLabels =
        KH1_DICTIONARY
          .JOURNAL_CHARACTER_STATE_LABELS
          ?.[key] ??
        [];

      const variants =
        stateDefinitions
          .map(
            (definition, index) => {
              const raw =
                save[
                  definition.offset
                ];

              const active =
                Boolean(
                  raw &
                  definition.mask
                );

              const label =
                stateLabels[index] ??
                (
                  index === 0
                    ? name
                    : `${name} update ${index}`
                );

              return {
                globalBit:
                  definition.globalBit ??
                  null,

                offset:
                  definition.offset,

                offsetHex:
                  `0x${definition.offset
                    .toString(16)
                    .toUpperCase()}`,

                mask:
                  definition.mask,

                maskHex:
                  `0x${definition.mask
                    .toString(16)
                    .padStart(2, "0")
                    .toUpperCase()}`,

                raw,

                rawHex:
                  `0x${raw
                    .toString(16)
                    .padStart(2, "0")
                    .toUpperCase()}`,

                label,

                active
              };
            }
          );

      const activeVariants =
        variants.filter(
          variant =>
            variant.active
        );

      const found =
        activeVariants.length >
        0;

      entries[key] = {
        key,
        name,

        found,

        mappingComplete:
          true,

        confidence:
          "confirmed",

        variants,

        activeVariants,

        variantCount:
          variants.length,

        activeVariantCount:
          activeVariants.length,

        mappingText:
          variants
            .map(
              variant =>
                `${variant.offsetHex}/${variant.maskHex}`
            )
            .join(" · "),

        stateLabel:
          found
            ? activeVariants
                .map(
                  variant =>
                    variant.label
                )
                .join(" + ")
            : "Journal entry missing",

        note:
          KH1_DICTIONARY
            .JOURNAL_CHARACTER_NOTES
            ?.[key] ??
          ""
      };
    }
  );

  const foundEntries =
    Object.values(
      entries
    )
      .filter(
        entry =>
          entry.found
      );

  return {
    entries,

    mappedCharacterCount:
      Object.keys(
        KH1_JOURNAL_CHARACTER_STATES
      ).length,

    fullyResolvedCharacterCount:
      Object.keys(
        KH1_JOURNAL_CHARACTER_STATES
      ).length,

    foundCharacterCount:
      foundEntries.length,

    missingCharacterCount:
      Object.keys(entries).length -
      foundEntries.length,

    originalOneBitRegion: {
      startOffset:
        0x16E6,

      endOffset:
        0x16F2,

      bitCount:
        104,

      noVisibleChangeBits:
        KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS
          .map(
            item => ({
              ...item,

              offsetHex:
                `0x${item.offset
                  .toString(16)
                  .toUpperCase()}`,

              maskHex:
                `0x${item.mask
                  .toString(16)
                  .padStart(2, "0")
                  .toUpperCase()}`
            })
          )
    },

    extendedJournalResearch: {
      beforeRegion: {
        startOffset: 0x16E3,
        endOffset: 0x16E5,
        mappedCharacters: 17
      },

      afterRegion: {
        startOffset: 0x16F7,
        endOffset: 0x16F8,
        mappedCharacters: 3,

        noVisibleChangeBits:
          KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS
      },

      jasmineBaseFlag: {
        offset: 0x16F7,
        offsetHex: "0x16F7",
        mask: 0x01,
        maskHex: "0x01",
        confidence: "confirmed by focused one-bit test"
      }
    }
  };
}


/*
===============================================================================
100 ACRE WOOD MINIGAMES
===============================================================================

0x19D6 is a completion bitfield.

Known complete save:
    0x3E = 00111110

This contains exactly five set bits, matching the five 100 Acre Wood
minigames.

Directly confirmed:
    0x20 = Pooh's Hunny Hunt
    0x10 = Block Tigger
*/
function ParseAcreWoodMinigames(save) {
  const flagsRaw =
    save[
      KH1_SAVE.ACRE_WOOD_MINIGAME_FLAGS
    ];

  const view =
    CreateDataView(
      save
    );

  const minigames = {};

  Object.entries(
    KH1_ACRE_WOOD_MINIGAMES
  ).forEach(
    ([key, definition]) => {
      const scoreRaw =
        view.getUint32(
          definition.scoreOffset,
          true
        );

      minigames[key] = {
        name:
          definition.name,

        completionOffset:
          KH1_SAVE.ACRE_WOOD_MINIGAME_FLAGS,

        completionOffsetHex:
          `0x${KH1_SAVE.ACRE_WOOD_MINIGAME_FLAGS
            .toString(16)
            .toUpperCase()}`,

        mask:
          definition.mask,

        maskHex:
          `0x${definition.mask
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        complete:
          Boolean(
            flagsRaw &
            definition.mask
          ),

        scoreOffset:
          definition.scoreOffset,

        scoreOffsetHex:
          `0x${definition.scoreOffset
            .toString(16)
            .toUpperCase()}`,

        /*
         * An untouched score field uses 0xFFFFFFFF.
         */
        score:
          scoreRaw ===
          0xFFFFFFFF
            ? null
            : scoreRaw,

        scoreRaw,

        confidence:
          definition.confidence
      };
    }
  );

  return {
    raw:
      flagsRaw,

    rawHex:
      `0x${flagsRaw
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`,

    knownCompleteCount:
      Object.values(
        minigames
      ).filter(
        minigame =>
          minigame.complete
      ).length,

    minigames,

    /*
     * These bits are set in the known complete save but still need
     * individual controlled tests before assigning their minigame names.
     */
    unresolvedMasks: [
      0x08,
      0x04,
      0x02
    ]
  };
}

/*
===============================================================================
KNOWN CHESTS
===============================================================================
*/
function ParseKnownChests(save) {
  const entries = {};

  Object.entries(
    KH1_KNOWN_CHESTS
  ).forEach(
    ([key, definition]) => {
      const raw =
        save[
          definition.offset
        ];

      entries[key] = {
        name:
          definition.name,

        offset:
          definition.offset,

        offsetHex:
          `0x${definition.offset
            .toString(16)
            .toUpperCase()}`,

        mask:
          definition.mask,

        maskHex:
          `0x${definition.mask
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        opened:
          Boolean(
            raw &
            definition.mask
          ),

        raw,

        confidence:
          definition.confidence
      };
    }
  );

  return entries;
}


/*
===============================================================================
OLYMPUS COLISEUM
===============================================================================

Controlled saves:

54 baseline
55 Phil's Training complete
56 Preliminaries complete
57 Cerberus defeated

58 cup baseline
59 Phil Cup complete
60 Pegasus Cup complete
61 Hercules Cup complete

The parser preserves both the compact cup-completion bitfield and the four
individual cup state bytes.
*/
function ParseOlympusColiseum(save) {
  const storyProgress =
    save[
      KH1_SAVE.OLYMPUS_STORY_PROGRESS
    ];

  const philTrainingFlagRaw =
    save[
      KH1_SAVE.PHIL_TRAINING_FLAG
    ];

  const cupCompletionRaw =
    save[
      KH1_SAVE.OLYMPUS_CUP_COMPLETION_FLAGS
    ];

  const cupStateBytes =
    Array.from(
      save.slice(
        KH1_SAVE.OLYMPUS_CUPS,
        KH1_SAVE.OLYMPUS_CUPS +
        KH1_SAVE.OLYMPUS_CUPS_LENGTH
      )
    );

  const cupStateLabel =
    raw => {
      if (raw === 0x00) {
        return "Locked / Unavailable";
      }

      if (raw === 0x0A) {
        return "Available / Not Completed";
      }

      if (raw === 0x01) {
        return "Completed";
      }

      return `Unknown state 0x${raw
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`;
    };

  const milestones = {};

  Object.entries(
    KH1_OLYMPUS.milestones
  ).forEach(
    ([key, definition]) => {
      const progressComplete =
        storyProgress >=
        definition.progressThreshold;

      let flagComplete =
        null;

      if (
        definition.flagOffset !==
        undefined
      ) {
        flagComplete =
          Boolean(
            save[
              definition.flagOffset
            ] &
            definition.flagMask
          );
      }

      milestones[key] = {
        name:
          definition.name,

        storyProgress,

        storyProgressHex:
          `0x${storyProgress
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        threshold:
          definition.progressThreshold,

        thresholdHex:
          `0x${definition.progressThreshold
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        flagOffset:
          definition.flagOffset ??
          null,

        flagOffsetHex:
          definition.flagOffset !==
          undefined
            ? `0x${definition.flagOffset
                .toString(16)
                .toUpperCase()}`
            : null,

        flagMask:
          definition.flagMask ??
          null,

        flagComplete,

        complete:
          flagComplete ===
          null
            ? progressComplete
            : (
                flagComplete ||
                progressComplete
              ),

        confidence:
          definition.confidence
      };
    }
  );

  const cups = {};

  Object.entries(
    KH1_OLYMPUS.cups
  ).forEach(
    ([key, definition]) => {
      const statusRaw =
        cupStateBytes[
          definition.statusIndex
        ];

      const bitComplete =
        Boolean(
          cupCompletionRaw &
          definition.completionMask
        );

      const statusComplete =
        statusRaw ===
        0x01;

      cups[key] = {
        name:
          definition.name,

        statusIndex:
          definition.statusIndex,

        statusOffset:
          KH1_SAVE.OLYMPUS_CUPS +
          definition.statusIndex,

        statusOffsetHex:
          `0x${(
            KH1_SAVE.OLYMPUS_CUPS +
            definition.statusIndex
          )
            .toString(16)
            .toUpperCase()}`,

        statusRaw,

        statusRawHex:
          `0x${statusRaw
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        statusLabel:
          cupStateLabel(
            statusRaw
          ),

        completionOffset:
          KH1_SAVE.OLYMPUS_CUP_COMPLETION_FLAGS,

        completionOffsetHex:
          `0x${KH1_SAVE.OLYMPUS_CUP_COMPLETION_FLAGS
            .toString(16)
            .toUpperCase()}`,

        completionMask:
          definition.completionMask,

        completionMaskHex:
          `0x${definition.completionMask
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        bitComplete,

        complete:
          bitComplete ||
          statusComplete,

        available:
          statusRaw === 0x0A ||
          statusComplete,

        confidence:
          definition.confidence
      };
    }
  );

  return {
    storyProgress,

    storyProgressHex:
      `0x${storyProgress
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`,

    philTrainingFlag: {
      offset:
        KH1_SAVE.PHIL_TRAINING_FLAG,

      offsetHex:
        `0x${KH1_SAVE.PHIL_TRAINING_FLAG
          .toString(16)
          .toUpperCase()}`,

      raw:
        philTrainingFlagRaw,

      complete:
        Boolean(
          philTrainingFlagRaw &
          0x01
        )
    },

    cupCompletion: {
      offset:
        KH1_SAVE.OLYMPUS_CUP_COMPLETION_FLAGS,

      offsetHex:
        `0x${KH1_SAVE.OLYMPUS_CUP_COMPLETION_FLAGS
          .toString(16)
          .toUpperCase()}`,

      raw:
        cupCompletionRaw,

      rawHex:
        `0x${cupCompletionRaw
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()}`
    },

    cupStateBytes,

    milestones,

    cups
  };
}

function ParseAtlanticaClams(save) {
  /*
   * 16 individual clam flags stored in two bytes starting at 0x1DA9.
   *
   * Current mapping uses LSB-first bit order:
   *
   *   flag 0 -> byte 0, mask 0x01
   *   flag 1 -> byte 0, mask 0x02
   *   ...
   *   flag 7 -> byte 0, mask 0x80
   *   flag 8 -> byte 1, mask 0x01
   *   ...
   *   flag15 -> byte 1, mask 0x80
   *
   * We preserve every bit so the UI can show each clam on its own line.
   */
  const raw =
    save.slice(
      KH1_SAVE.ATLANTICA_CLAMS,
      KH1_SAVE.ATLANTICA_CLAMS +
      KH1_SAVE.ATLANTICA_CLAMS_LENGTH
    );

  const flags =
    [];

  for (
    let index = 0;
    index < KH1_SAVE.ATLANTICA_CLAMS_COUNT;
    index++
  ) {
    const byteIndex =
      Math.floor(
        index / 8
      );

    const bitIndex =
      index % 8;

    const mask =
      1 << bitIndex;

    flags.push({
      index,

      byteIndex,

      bitIndex,

      mask,

      maskHex:
        `0x${mask
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()}`,

      saveOffset:
        KH1_SAVE.ATLANTICA_CLAMS +
        byteIndex,

      saveOffsetHex:
        `0x${(
          KH1_SAVE.ATLANTICA_CLAMS +
          byteIndex
        )
          .toString(16)
          .toUpperCase()}`,

      opened:
        Boolean(
          raw[byteIndex] &
          mask
        )
    });
  }

  const openedCount =
    flags.filter(
      flag =>
        flag.opened
    ).length;

  return {
    openedCount,

    target:
      KH1_SAVE.ATLANTICA_CLAMS_COUNT,

    flags,

    openedIndexes:
      flags
        .filter(
          flag =>
            flag.opened
        )
        .map(
          flag =>
            flag.index
        ),

    rawBytes:
      Array.from(raw),

    rawHex:
      BytesToHex(raw)
  };
}

function ParseMagicLevels(save) {
  const spellNames =
    KH1_DICTIONARY.SPELL_NAMES;

  const values =
    Array.from(
      save.slice(
        KH1_SAVE.MAGIC_LEVELS,
        KH1_SAVE.MAGIC_LEVELS +
        KH1_SAVE.MAGIC_LEVELS_LENGTH
      )
    );

  return spellNames.map(
    (name, index) => ({
      name,
      level:
        values[index]
    })
  );
}


function ParseAcreWoodPages(save) {
  const raw =
    save.slice(
      KH1_SAVE.ACRE_WOOD_PAGES,
      KH1_SAVE.ACRE_WOOD_PAGES +
      KH1_SAVE.ACRE_WOOD_PAGES_LENGTH
    );

  const flags =
    Array.from(raw)
      .map(
        (value, index) => ({
          page:
            index + 1,

          raw:
            value,

          converted:
            value !== 0
        })
      );

  return {
    convertedCount:
      flags.filter(
        flag =>
          flag.converted
      ).length,

    target:
      KH1_SAVE.ACRE_WOOD_PAGES_LENGTH,

    flags,

    rawHex:
      BytesToHex(raw)
  };
}


/*
===============================================================================
WORLD STORY PROGRESS
===============================================================================

This is different from WORLD_STATUS.

WORLD_STATUS (0x1EF0) is primarily a world-map state:
    0 = invisible
    1 = visible / unvisited
    2 = selectable / unvisited
    3 = incomplete
    4 = complete

That works well for most worlds, but NOT for every world.

Two important special cases:

MONSTRO
-------
Monstro does not reliably reach world-map status 4.
The story-progress byte reaches 0x46 (70) at its final mapped story reward.

END OF THE WORLD
----------------
End of the World normally remains world-map status 3.
Kingdom Hearts 1 has no persistent clear-save after defeating the final boss,
so there is no normal post-final-boss save state that changes the map byte to 4.

The highest persistent End of the World story-progress value we currently use
is 0x33 (51), corresponding to the final mapped persistent progression point.

For the completion analyzer:
    Monstro complete          -> progress >= 0x46
    End of the World complete -> progress >= 0x33

The original world-map status byte is still preserved.
*/

function ParseWorldProgress(save) {
  const progressNames = [
    "Traverse Town",
    "Deep Jungle",
    "Olympus Coliseum",
    "Wonderland",
    "Agrabah",
    "Monstro",
    "Atlantica",
    "Unused",
    "Halloween Town",
    "Neverland",
    "Hollow Bastion",
    "End of the World"
  ];

  const values =
    Array.from(
      save.slice(
        KH1_SAVE.WORLD_PROGRESS,
        KH1_SAVE.WORLD_PROGRESS +
        KH1_SAVE.WORLD_PROGRESS_LENGTH
      )
    );

  return progressNames.map(
    (name, index) => ({
      name,

      raw:
        values[index],

      rawHex:
        `0x${values[index]
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()}`
    })
  );
}

function ParseWorldStatus(
  save,
  worldProgress
) {
  const statusNames = [
    "Traverse Town",
    "Wonderland",
    "Olympus Coliseum",
    "Deep Jungle",
    "Agrabah",
    "Atlantica",
    "Halloween Town",
    "Neverland",
    "Hollow Bastion",
    "End of the World",
    "Monstro"
  ];

  const statusLabels = {
    0: "Invisible",
    1: "Visible / Unvisited",
    2: "Selectable / Unvisited",
    3: "Incomplete",
    4: "Complete"
  };

  const values =
    Array.from(
      save.slice(
        KH1_SAVE.WORLD_STATUS,
        KH1_SAVE.WORLD_STATUS +
        KH1_SAVE.WORLD_STATUS_LENGTH
      )
    );

  const progressByName =
    Object.fromEntries(
      worldProgress.map(
        world => [
          world.name,
          world
        ]
      )
    );

  return statusNames.map(
    (name, index) => {
      const raw =
        values[index];

      const worldMapStatus =
        statusLabels[raw] ??
        `Unknown (${raw})`;

      const progress =
        progressByName[name] ??
        null;

      /*
       * Default behavior for ordinary worlds:
       * world-map status 4 means complete.
       */
      let complete =
        raw === 4;

      let status =
        worldMapStatus;

      let completionRule =
        "world-map status == 4";

      let completionNote =
        "";

      /*
       * Monstro is special.
       *
       * Its world-map state does not behave like normal sealed-Keyhole worlds.
       * Use the final mapped Monstro story progress value instead.
       */
      if (
        name === "Monstro"
      ) {
        complete =
          Boolean(
            progress &&
            progress.raw >= 0x46
          );

        completionRule =
          "story progress >= 0x46";

        completionNote =
          "Monstro uses its story-progress byte because its world-map status does not reliably reach 4.";

        if (
          complete
        ) {
          status =
            "Complete";
        }
      }

      /*
       * End of the World is also special.
       *
       * KH1 does not create a persistent clear-save after the final boss.
       * Therefore the analyzer treats the highest persistent story progress
       * (0x33) as the world's maximum saveable completion state.
       */
      if (
        name === "End of the World"
      ) {
        complete =
          Boolean(
            progress &&
            progress.raw >= 0x33
          );

        completionRule =
          "story progress >= 0x33";

        completionNote =
          "Maximum saveable End of the World progress. KH1 does not preserve a post-final-boss clear state.";

        if (
          complete
        ) {
          status =
            "Complete (max saveable progress)";
        }
      }

      return {
        name,

        raw,

        /*
         * Keep the original map-state interpretation for research.
         */
        worldMapStatus,

        /*
         * Story progress is a separate byte/table.
         */
        progress:
          progress
            ? progress.raw
            : null,

        progressHex:
          progress
            ? progress.rawHex
            : null,

        /*
         * This is the value the completion UI should use.
         */
        complete,

        status,

        completionRule,

        completionNote
      };
    }
  );
}

function ParseSave(
  save,
  slotNumber,
  archiveEntry,
  system
) {
  const view =
    CreateDataView(save);

  const difficulty =
    save[
      KH1_SAVE.DIFFICULTY
    ];

  const worldId =
    view.getUint32(
      KH1_SAVE.CURRENT_WORLD,
      true
    );

  const inventory =
    ParseInventory(save);

  const chestFlags =
    save.slice(
      KH1_SAVE.CHEST_FLAGS,
      KH1_SAVE.CHEST_FLAGS +
      KH1_SAVE.CHEST_FLAGS_LENGTH
    );

  /*
   * World story progress and world-map status are separate structures.
   * Parse story progress first because ParseWorldStatus() uses it for
   * Monstro and End of the World.
   */
  const worldProgress =
    ParseWorldProgress(
      save
    );

  return {
    slot:
      slotNumber,

    archiveEntry,

    system,

    core: {
      difficulty,

      difficultyName:
        KH1_DICTIONARY.DIFFICULTY_NAMES[
          difficulty
        ],

      munny:
        view.getUint32(
          KH1_SAVE.MUNNY,
          true
        ),

      worldId,

      world:
        KH1_DICTIONARY.WORLD_NAMES[
          worldId
        ],

      room:
        view.getUint32(
          KH1_SAVE.CURRENT_ROOM,
          true
        ),

      spawn:
        view.getUint32(
          KH1_SAVE.SPAWN_LOCATION,
          true
        )
    },

    characters:
      Array.from(
        {
          length:
            KH1_SAVE.CHARACTER_COUNT
        },
        (value, index) =>
          ParseCharacter(
            save,
            index
          )
      ),

    inventory,

    completion: {
      puppies:
        DecodePuppies(
          save,
          KH1_SAVE
        ),

      reports:
        DecodeReports(
          save,
          KH1_SAVE
        ),

      summons:
        DecodeSummons(
          save,
          KH1_SAVE
        ),

      trinity:
        DecodeTrinity(
          save,
          KH1_SAVE
        ),

      enemyDefeatCounters:
        DecodeEnemyCounters(
          save,
          KH1_SAVE
        ),

      synthesis:
        DecodeSynthesisFlags(
          save,
          KH1_SAVE
        ),

      gummiBlueprints:
        DecodeGummiBlueprints(
          save,
          KH1_SAVE,
          KH1_DICTIONARY.GUMMI_BLUEPRINT_NAMES
        ),

      postcardsMailed:
        save[
          KH1_SAVE.POSTCARDS_MAILED
        ],

      atlanticaClams:
        ParseAtlanticaClams(
          save
        ),

      journalCharacters:
        ParseKnownJournalCharacters(
          save
        ),

      acreWoodMinigames:
        ParseAcreWoodMinigames(
          save
        ),

      knownChests:
        ParseKnownChests(
          save
        ),

      olympusColiseum:
        ParseOlympusColiseum(
          save
        ),

      magicLevels:
        ParseMagicLevels(
          save
        ),

      worldProgress,

      worldStatus:
        ParseWorldStatus(
          save,
          worldProgress
        ),

      acreWoodPages:
        ParseAcreWoodPages(
          save
        ),

      olympusCupUnlocks:
        Array.from(
          save.slice(
            KH1_SAVE.OLYMPUS_CUPS,
            KH1_SAVE.OLYMPUS_CUPS +
            KH1_SAVE.OLYMPUS_CUPS_LENGTH
          )
        ),

      iceTitanDefeated:
        Boolean(
          save[
            KH1_SAVE.ICE_TITAN
          ]
        ),

      sephirothDefeated:
        Boolean(
          save[
            KH1_SAVE.SEPHIROTH
          ]
        ),

      redArmorJournal:
        Boolean(
          save[
            KH1_SAVE.RED_ARMOR_JOURNAL
          ] & 0x02
        ),

      chestStaticFlags: {
        setBitCount:
          CountBitsInBytes(
            chestFlags
          ),

        rawHex:
          BytesToHex(
            chestFlags
          )
      }
    },

    /*
     * Research/raw output.
     *
     * Keep this even if some fields are "unknown".
     * It is specifically for reverse engineering and differential analysis.
     */
    research:
      ParseResearchData(
        save
      )
  };
}

async function ProcessKH1File(file) {
  const arrayBuffer =
    await file.arrayBuffer();

  const fileBytes =
    new Uint8Array(
      arrayBuffer
    );

  if (
    fileBytes.length <
    KH1_ARCHIVE.DATA_OFFSET
  ) {
    throw new Error(
      "File is too small to be a KH1 Steam save container."
    );
  }

  const encryptedDirectory =
    fileBytes.slice(
      KH1_ARCHIVE.DIRECTORY_OFFSET,
      KH1_ARCHIVE.DATA_OFFSET
    );

  const {
    decoded,
    key
  } =
    DecodeArchiveDirectory(
      encryptedDirectory
    );

  const entries =
    Array.from(
      {
        length:
          KH1_ARCHIVE.ENTRY_COUNT
      },

      (value, index) =>
        ParseArchiveEntry(
          decoded,
          index
        )
    );

  const nonemptyEntries =
    entries.filter(
      entry =>
        entry.name ||
        entry.length
    );

  const saveEntries =
    nonemptyEntries.filter(
      entry =>
        /^BISLPS-25198-\d+$/i
          .test(entry.name) &&
        entry.length >=
          KH1_ARCHIVE.SAVE_LENGTH
    );

  const slots =
    [];

  for (
    const archiveEntry
    of saveEntries
  ) {
    const match =
      archiveEntry.name.match(
        /-(\d+)$/
      );

    const slotNumber =
      Number(match[1]);

    const saveOffset =
      KH1_ARCHIVE.DATA_OFFSET +
      archiveEntry.archiveIndex *
      KH1_ARCHIVE.ENTRY_STRIDE;

    const save =
      fileBytes.slice(
        saveOffset,
        saveOffset +
        KH1_ARCHIVE.SAVE_LENGTH
      );

    const systemName =
      `-${String(slotNumber).padStart(2, "0")}/system.bin`;

    const systemEntry =
      nonemptyEntries.find(
        entry =>
          entry.name === systemName
      );

    let system =
      null;

    if (systemEntry) {
      const systemOffset =
        KH1_ARCHIVE.DATA_OFFSET +
        systemEntry.archiveIndex *
        KH1_ARCHIVE.ENTRY_STRIDE;

      const systemBytes =
        fileBytes.slice(
          systemOffset,
          systemOffset +
          systemEntry.length
        );

      system =
        ParseSystem(
          systemBytes
        );
    }

    slots.push(
      ParseSave(
        save,
        slotNumber,
        archiveEntry,
        system
      )
    );
  }

  return {
    format:
      "Kingdom Hearts Final Mix Steam",

    sourceFile: {
      name:
        file.name,

      size:
        fileBytes.length,

      expectedSize:
        KH1_ARCHIVE.EXPECTED_FILE_SIZE
    },

    archive: {
      directoryKeyHex:
        BytesToHex(key),

      nonemptyEntries
    },

    slots
  };
}

/*
 * Main <input type="file"> function.
 *
 * This intentionally keeps the same general idea/name as your existing
 * Silksong LoadSaveFile.js.
 */
async function LoadSaveFile(input) {
  const inputFileList =
    input.files;

  if (
    !inputFileList ||
    inputFileList.length < 1
  ) {
    return false;
  }

  const file =
    inputFileList[0];

  try {
    const parsed =
      await ProcessKH1File(
        file
      );

    KH1CheckCompletion(
      parsed
    );

    return parsed;
  } catch (error) {
    console.error(
      "The KH1 save cannot be decoded.",
      error
    );

    throw error;
  }
}

export {
  LoadSaveFile,
  ProcessKH1File,
  ParseSave,
  ParseCharacter,
  ParseResearchData
};
