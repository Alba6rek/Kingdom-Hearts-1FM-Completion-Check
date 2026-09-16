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
  KH1_MINIGAME_STATES,
  KH1_BOSS_COMPLETION_STATES,
  KH1_KNOWN_CHESTS,
  KH1_OLYMPUS,
  KH1_TRINITY_MARK_STATES
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
  directoryView,
  archiveIndex
) {
  const base =
    archiveIndex *
    KH1_ARCHIVE.ENTRY_LENGTH;

  const created =
    directoryView.getInt32(
      base + 0x40,
      true
    );

  const modified =
    directoryView.getInt32(
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
      directoryView.getInt32(
        base + 0x50,
        true
      )
  };
}

function ParseCharacter(
  save,
  characterIndex,
  saveView = CreateDataView(save)
) {
  const base =
    KH1_SAVE.CHARACTER_START +
    characterIndex *
    KH1_SAVE.CHARACTER_SIZE;

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
      saveView.getInt32(
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
BOSS COMPLETION
===============================================================================
*/

function ReportOwned(
  save,
  reportNumber
) {
  const index =
    reportNumber - 1;

  const byteIndex =
    Math.floor(
      index / 8
    );

  const bitIndex =
    index % 8;

  const mask =
    0x80 >> bitIndex;

  return Boolean(
    save[
      KH1_SAVE.ANSEM_REPORTS +
      byteIndex
    ] &
    mask
  );
}

function ParseBossCompletion(
  save,
  worldProgress
) {
  const entries =
    {};

  Object.entries(
    KH1_BOSS_COMPLETION_STATES
  ).forEach(
    ([key, definition]) => {
      let complete =
        false;

      let raw =
        null;

      let offset =
        null;

      let mask =
        definition.mask ??
        null;

      let threshold =
        definition.threshold ??
        null;

      if (
        definition.type ===
        "worldProgress"
      ) {
        raw =
          worldProgress[
            definition.index
          ]?.raw ?? 0;

        offset =
          KH1_SAVE.WORLD_PROGRESS +
          definition.index;

        complete =
          raw >=
          definition.threshold;
      } else if (
        definition.type ===
        "extraTraverseProgress"
      ) {
        offset =
          KH1_SAVE.EXTRA_TRAVERSE_TOWN_PROGRESS;

        raw =
          save[offset];

        complete =
          raw >=
          definition.threshold;
      } else if (
        definition.type ===
        "bit"
      ) {
        offset =
          definition.offset;

        raw =
          save[offset];

        complete =
          Boolean(
            raw &
            definition.mask
          );
      } else if (
        definition.type ===
        "byteNonZero"
      ) {
        offset =
          definition.offset;

        raw =
          save[offset];

        complete =
          raw > 0;
      } else if (
        definition.type ===
        "byteAtLeast"
      ) {
        offset =
          definition.offset;

        raw =
          save[offset];

        complete =
          raw >=
          definition.threshold;
      } else if (
        definition.type ===
        "report"
      ) {
        const reportIndex =
          definition.report - 1;

        const reportByteIndex =
          Math.floor(
            reportIndex / 8
          );

        const reportBitIndex =
          reportIndex % 8;

        offset =
          KH1_SAVE.ANSEM_REPORTS +
          reportByteIndex;

        mask =
          0x80 >>
          reportBitIndex;

        raw =
          save[offset];

        complete =
          ReportOwned(
            save,
            definition.report
          );
      } else if (
        definition.type ===
        "olympusCup"
      ) {
        offset =
          KH1_SAVE
            .OLYMPUS_CUP_COMPLETION_FLAGS;

        raw =
          save[offset];

        complete =
          Boolean(
            raw &
            definition.mask
          );
      }

      entries[key] = {
        key,

        name:
          KH1_DICTIONARY
            .BOSS_NAMES[
              key
            ] ??
          key,

        known:
          true,

        complete,

        ruleType:
          definition.type,

        evidence:
          definition.evidence,

        /*
         * Used by the three final-battle entries. Their completion is based
         * on KH1's maximum persistent End of the World save state, not a
         * literal post-battle defeated flag.
         */
        maxSaveable:
          Boolean(
            definition.maxSaveable
          ),

        offset,

        offsetHex:
          offset === null
            ? null
            : `0x${offset
                .toString(16)
                .toUpperCase()}`,

        raw,

        rawHex:
          raw === null
            ? null
            : `0x${raw
                .toString(16)
                .padStart(2, "0")
                .toUpperCase()}`,

        mask,

        maskHex:
          mask === null
            ? null
            : `0x${mask
                .toString(16)
                .padStart(2, "0")
                .toUpperCase()}`,

        threshold,

        thresholdHex:
          threshold === null
            ? null
            : `0x${threshold
                .toString(16)
                .padStart(2, "0")
                .toUpperCase()}`,

        report:
          definition.report ??
          null
      };
    }
  );

  return {
    entries,

    mappedCount:
      Object.keys(
        entries
      ).length,

    defeatedCount:
      Object.values(
        entries
      ).filter(
        entry =>
          entry.complete
      ).length
  };
}

/*
===============================================================================
MINIGAME COMPLETION / SCORES
===============================================================================
*/

function FormatCentiseconds(
  centiseconds
) {
  const totalSeconds =
    Math.floor(
      centiseconds / 100
    );

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const seconds =
    totalSeconds % 60;

  const remainder =
    centiseconds % 100;

  return (
    `${minutes}:` +
    `${seconds
      .toString()
      .padStart(2, "0")}.` +
    `${remainder
      .toString()
      .padStart(2, "0")}`
  );
}

/*
 * KH1's Jungle Slider, Vine Jump and Olympus Coliseum Journal records use
 * frame counts at 60 fps. The Journal truncates the hundredths portion rather
 * than rounding it.
 *
 * Example:
 *   1880 frames -> 00:31.33
 *   5431 frames -> 01:30.51
 */
function FormatFrames60(frames) {
  const minutes =
    Math.floor(
      frames / 3600
    );

  const framesInMinute =
    frames % 3600;

  const seconds =
    Math.floor(
      framesInMinute / 60
    );

  const remainingFrames =
    framesInMinute % 60;

  const hundredths =
    Math.floor(
      remainingFrames *
      100 /
      60
    );

  return (
    `${minutes
      .toString()
      .padStart(2, "0")}:` +
    `${seconds
      .toString()
      .padStart(2, "0")}.` +
    `${hundredths
      .toString()
      .padStart(2, "0")}`
  );
}

function ParseFrameRecord(
  view,
  offset
) {
  const raw =
    view.getUint32(
      offset,
      true
    );

  const available =
    raw !==
    0xFFFFFFFF;

  return {
    offset,

    offsetHex:
      `0x${offset
        .toString(16)
        .toUpperCase()}`,

    raw,

    available,

    display:
      available
        ? FormatFrames60(raw)
        : null
  };
}

function ParseMinigames(save) {
  const view =
    CreateDataView(
      save
    );

  const entries =
    {};

  Object.entries(
    KH1_MINIGAME_STATES
  ).forEach(
    ([key, definition]) => {
      const metadata =
        KH1_DICTIONARY
          .MINIGAME_SCORE_METADATA[
            key
          ] ??
        {};

      const subrecordNames =
        KH1_DICTIONARY
          .MINIGAME_SUBRECORD_NAMES[
            key
          ] ??
        [];

      if (
        definition.type ===
        "leaderboardCourses"
      ) {
        const courses = [];

        for (
          let courseIndex = 0;
          courseIndex <
          definition.courseCount;
          courseIndex++
        ) {
          const courseOffset =
            definition.baseOffset +
            courseIndex *
            definition.courseStride;

          const records = [];

          for (
            let recordIndex = 0;
            recordIndex <
            definition.recordsPerCourse;
            recordIndex++
          ) {
            records.push(
              ParseFrameRecord(
                view,
                courseOffset +
                recordIndex *
                definition.recordStride
              )
            );
          }

          const availableRecords =
            records.filter(
              record =>
                record.available
            );

          courses.push({
            index:
              courseIndex,

            name:
              subrecordNames[
                courseIndex
              ] ??
              `Course ${courseIndex + 1}`,

            offset:
              courseOffset,

            offsetHex:
              `0x${courseOffset
                .toString(16)
                .toUpperCase()}`,

            complete:
              availableRecords.length > 0,

            records,

            availableRecords,

            bestRecord:
              availableRecords[0] ??
              null
          });
        }

        const completedSubcount =
          courses.filter(
            course =>
              course.complete
          ).length;

        entries[key] = {
          key,

          name:
            KH1_DICTIONARY
              .MINIGAME_NAMES[key] ??
            key,

          known:
            true,

          complete:
            completedSubcount >=
            definition.courseCount,

          type:
            definition.type,

          evidence:
            definition.evidence,

          baseOffset:
            definition.baseOffset,

          baseOffsetHex:
            `0x${definition.baseOffset
              .toString(16)
              .toUpperCase()}`,

          scoreType:
            definition.scoreType,

          scoreLabel:
            metadata.label ??
            "Courses",

          subrecordUnit:
            "courses",

          subrecordCount:
            definition.courseCount,

          completedSubcount,

          scoreDisplay:
            `${completedSubcount}/${definition.courseCount} courses`,

          subrecords:
            courses
        };

        return;
      }

      if (
        definition.type ===
        "recordSet"
      ) {
        const records = [];

        for (
          let recordIndex = 0;
          recordIndex <
          definition.recordCount;
          recordIndex++
        ) {
          const record =
            ParseFrameRecord(
              view,
              definition.baseOffset +
              recordIndex *
              definition.recordStride
            );

          records.push({
            ...record,

            index:
              recordIndex,

            name:
              subrecordNames[
                recordIndex
              ] ??
              `Record ${recordIndex + 1}`,

            complete:
              record.available,

            records:
              record.available
                ? [record]
                : [],

            availableRecords:
              record.available
                ? [record]
                : [],

            bestRecord:
              record.available
                ? record
                : null
          });
        }

        const completedSubcount =
          records.filter(
            record =>
              record.complete
          ).length;

        entries[key] = {
          key,

          name:
            KH1_DICTIONARY
              .MINIGAME_NAMES[key] ??
            key,

          known:
            true,

          complete:
            completedSubcount >=
            definition.recordCount,

          type:
            definition.type,

          evidence:
            definition.evidence,

          baseOffset:
            definition.baseOffset,

          baseOffsetHex:
            `0x${definition.baseOffset
              .toString(16)
              .toUpperCase()}`,

          scoreType:
            definition.scoreType,

          scoreLabel:
            metadata.label ??
            "Cup records",

          subrecordUnit:
            "cups",

          subrecordCount:
            definition.recordCount,

          completedSubcount,

          scoreDisplay:
            `${completedSubcount}/${definition.recordCount} cups`,

          subrecords:
            records
        };

        return;
      }

      const flagRaw =
        save[
          definition.flagOffset
        ];

      const scoreRaw =
        view.getUint32(
          definition.scoreOffset,
          true
        );

      const hasScore =
        scoreRaw !==
        0xFFFFFFFF;

      let scoreDisplay =
        null;

      if (hasScore) {
        if (
          definition.scoreType ===
          "centiseconds"
        ) {
          scoreDisplay =
            FormatCentiseconds(
              scoreRaw
            );
        } else {
          scoreDisplay =
            Number(
              scoreRaw
            ).toLocaleString();
        }

        if (
          metadata.unit &&
          metadata.unit !==
          "time"
        ) {
          scoreDisplay +=
            ` ${metadata.unit}`;
        }
      }

      entries[key] = {
        key,

        name:
          KH1_DICTIONARY
            .MINIGAME_NAMES[
              key
            ] ??
          key,

        known:
          true,

        complete:
          Boolean(
            flagRaw &
            definition.mask
          ),

        type:
          definition.type,

        completionOffset:
          definition.flagOffset,

        completionOffsetHex:
          `0x${definition.flagOffset
            .toString(16)
            .toUpperCase()}`,

        mask:
          definition.mask,

        maskHex:
          `0x${definition.mask
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}`,

        scoreOffset:
          definition.scoreOffset,

        scoreOffsetHex:
          `0x${definition.scoreOffset
            .toString(16)
            .toUpperCase()}`,

        score:
          hasScore
            ? scoreRaw
            : null,

        scoreRaw,

        scoreDisplay,

        scoreLabel:
          metadata.label ??
          "Record",

        scoreUnit:
          metadata.unit ??
          null,

        scoreType:
          definition.scoreType,

        evidence:
          definition.evidence
      };
    }
  );

  return {
    entries,

    rawFlags:
      save[
        KH1_SAVE
          .ACRE_WOOD_MINIGAME_FLAGS
      ],

    rawFlagsHex:
      `0x${save[
        KH1_SAVE
          .ACRE_WOOD_MINIGAME_FLAGS
      ]
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()}`,

    mappedCount:
      Object.keys(
        entries
      ).length,

    completedCount:
      Object.values(
        entries
      ).filter(
        entry =>
          entry.complete
      ).length
  };
}

/*
 * Compatibility wrapper for older code/research JSON.
 */
function ParseAcreWoodMinigames(
  save,
  parsedMinigames = null
) {
  const all =
    parsedMinigames ??
    ParseMinigames(
      save
    );

  return {
    raw:
      all.rawFlags,

    rawHex:
      all.rawFlagsHex,

    knownCompleteCount:
      all.completedCount,

    minigames:
      all.entries,

    unresolvedMasks:
      []
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

  /*
   * Parse minigame records once. The legacy acreWoodMinigames object is built
   * from the same decoded result instead of reading the complete minigame
   * block a second time.
   */
  const minigames =
    ParseMinigames(
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
            index,
            view
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
          KH1_SAVE,
          KH1_TRINITY_MARK_STATES
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
          save,
          minigames
        ),

      minigames,

      bosses:
        ParseBossCompletion(
          save,
          worldProgress
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

/*
 * Return the absolute payload offset for one archive-directory entry.
 *
 * Archive payloads use a fixed stride; they are not packed by file length.
 */
function GetArchivePayloadOffset(archiveIndex) {
  return (
    KH1_ARCHIVE.DATA_OFFSET +
    archiveIndex *
    KH1_ARCHIVE.ENTRY_STRIDE
  );
}

function ReadArchiveEntryBytes(
  fileBytes,
  archiveEntry,
  requestedLength = archiveEntry.length
) {
  const start =
    GetArchivePayloadOffset(
      archiveEntry.archiveIndex
    );

  const length =
    Math.min(
      requestedLength,
      archiveEntry.length
    );

  const end =
    start + length;

  if (
    start < 0 ||
    end > fileBytes.length
  ) {
    throw new Error(
      `Archive entry is outside the save container: ${archiveEntry.name || archiveEntry.archiveIndex}`
    );
  }

  return fileBytes.slice(
    start,
    end
  );
}

function GetSaveSlotNumber(archiveEntry) {
  const match =
    archiveEntry.name.match(
      /-(\d+)$/
    );

  return match
    ? Number(match[1])
    : null;
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

  /*
   * Create one DataView for the directory instead of rebuilding it for every
   * one of the 200 archive records.
   */
  const directoryView =
    CreateDataView(
      decoded
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
          directoryView,
          index
        )
    );

  const nonemptyEntries =
    entries.filter(
      entry =>
        entry.name ||
        entry.length
    );

  /*
   * A name lookup avoids repeatedly scanning the complete archive directory
   * to find each slot's companion system.bin entry.
   */
  const entryByName =
    new Map(
      nonemptyEntries.map(
        entry => [
          entry.name,
          entry
        ]
      )
    );

  const saveEntries =
    nonemptyEntries
      .filter(
        entry =>
          /^BISLPS-25198-\d+$/i
            .test(entry.name) &&
          entry.length >=
            KH1_ARCHIVE.SAVE_LENGTH
      )
      .map(
        entry => ({
          entry,
          slotNumber:
            GetSaveSlotNumber(
              entry
            )
        })
      )
      .filter(
        item =>
          Number.isInteger(
            item.slotNumber
          )
      )
      .sort(
        (a, b) =>
          a.slotNumber -
          b.slotNumber
      );

  const slots =
    saveEntries.map(
      ({
        entry: archiveEntry,
        slotNumber
      }) => {
        const save =
          ReadArchiveEntryBytes(
            fileBytes,
            archiveEntry,
            KH1_ARCHIVE.SAVE_LENGTH
          );

        const systemName =
          `-${String(slotNumber).padStart(2, "0")}/system.bin`;

        const systemEntry =
          entryByName.get(
            systemName
          );

        const system =
          systemEntry
            ? ParseSystem(
                ReadArchiveEntryBytes(
                  fileBytes,
                  systemEntry
                )
              )
            : null;

        return ParseSave(
          save,
          slotNumber,
          archiveEntry,
          system
        );
      }
    );

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
