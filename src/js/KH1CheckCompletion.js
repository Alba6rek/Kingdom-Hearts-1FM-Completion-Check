/*
===============================================================================
KH1 COMPLETION CHECKER
===============================================================================

This is the equivalent of your Silksong HKCheckCompletion.js.

IMPORTANT:
LoadSaveFile.js should only READ/PARSE the binary format.
This file should ANALYZE the parsed data.

The parser tells us what the save contains.
This file decides whether those decoded values satisfy completion rules.
*/

import {
  KH1_COMPLETION_DATABASE
} from "./kh1-database.js";

function CalculatePercent(
  current,
  target
) {
  if (!target) {
    return 0;
  }

  return Math.min(
    100,
    current / target * 100
  );
}

function GetTarget(key) {
  return (
    KH1_COMPLETION_DATABASE[key]
      ?.target ??
    0
  );
}

/*
 * Build the common current / target / percent shape used by most completion
 * categories. `complete` is optional so existing JSON output stays compatible
 * with categories that historically exposed only progress values.
 */
function BuildProgress(
  current,
  target,
  includeComplete = false
) {
  const progress = {
    current,
    target,
    percent:
      CalculatePercent(
        current,
        target
      )
  };

  if (includeComplete) {
    progress.complete =
      current >= target;
  }

  return progress;
}

function FlattenJournalEnemies(slot) {
  return (
    slot.completion
      .enemyDefeatCounters
      .journalGroups ??
    []
  ).flat();
}

function GetMappedTrinityStates(slot) {
  return Object.values(
    slot.completion
      .trinity
      ?.markStates ??
    {}
  ).filter(
    entry =>
      Number.isInteger(
        entry?.offset
      ) &&
      Number.isInteger(
        entry?.mask
      ) &&
      typeof entry?.found ===
        "boolean"
  );
}

function BuildSlotCompletion(slot) {
  const journalCharacterEntries =
    Object.values(
      slot.completion
        .journalCharacters
        ?.entries ??
      {}
    );

  const missingJournalCharacters =
    journalCharacterEntries.filter(
      entry =>
        entry.found !== true
    );

  const journalCharacterCurrent =
    journalCharacterEntries.length -
    missingJournalCharacters.length;

  /*
   * Heartless completion is one completion point per Journal enemy, not the
   * total number of kills. A counter greater than zero means that enemy has
   * been encountered/defeated for completion purposes.
   */
  const journalEnemies =
    FlattenJournalEnemies(
      slot
    );

  const missingHeartless =
    journalEnemies.filter(
      enemy =>
        enemy.defeated === 0
    );

  const heartlessCurrent =
    journalEnemies.length -
    missingHeartless.length;

  /*
   * Trinity completion is based only on independently mapped physical flags.
   * Color counters are statistics/research data and never identify a location.
   */
  const trinityMappedStates =
    GetMappedTrinityStates(
      slot
    );

  const trinityCurrent =
    trinityMappedStates.filter(
      entry =>
        entry.found === true
    ).length;

  const trinityMappedTarget =
    trinityMappedStates.length;

  const trinityTarget =
    GetTarget(
      "trinities"
    );

  const bossEntries =
    Object.values(
      slot.completion
        .bosses
        ?.entries ??
      {}
    );

  const defeatedBosses =
    bossEntries.filter(
      entry =>
        entry.complete
    );

  const missingMappedBosses =
    bossEntries.filter(
      entry =>
        !entry.complete
    );

  const minigameEntries =
    Object.values(
      slot.completion
        .minigames
        ?.entries ??
      {}
    );

  const completedMinigames =
    minigameEntries.filter(
      entry =>
        entry.complete
    );

  const missingMappedMinigames =
    minigameEntries.filter(
      entry =>
        !entry.complete
    );

  const gummiBlueprintEntries =
    slot.completion
      .gummiBlueprints
      ?.entries ??
    [];

  const missingGummiBlueprints =
    gummiBlueprintEntries.filter(
      entry =>
        !entry.owned
    );

  const gummiBlueprintCurrent =
    gummiBlueprintEntries.length -
    missingGummiBlueprints.length;

  const journalCharacterTarget =
    GetTarget(
      "journalCharacters"
    );

  const heartlessTarget =
    GetTarget(
      "heartlessDefeated"
    );

  const bossesTarget =
    GetTarget(
      "bosses"
    );

  const minigamesTarget =
    GetTarget(
      "minigames"
    );

  return {
    journalCharacters: {
      ...BuildProgress(
        journalCharacterCurrent,
        journalCharacterTarget,
        true
      ),

      missingCount:
        missingJournalCharacters.length,

      missing:
        missingJournalCharacters.map(
          entry => ({
            key:
              entry.key,

            name:
              entry.name
          })
        )
    },

    heartlessDefeated: {
      ...BuildProgress(
        heartlessCurrent,
        heartlessTarget,
        true
      ),

      missingCount:
        missingHeartless.length,

      missing:
        missingHeartless.map(
          enemy => ({
            index:
              enemy.index,

            name:
              enemy.name,

            defeated:
              enemy.defeated
          })
        )
    },

    puppies:
      BuildProgress(
        slot.completion
          .puppies
          .foundCount,
        GetTarget("puppies")
      ),

    reports:
      BuildProgress(
        slot.completion
          .reports
          .count,
        GetTarget("ansemReports")
      ),

    summons:
      BuildProgress(
        slot.completion
          .summons
          .count,
        GetTarget("summons")
      ),

    trinity: {
      current:
        trinityCurrent,

      mappedTarget:
        trinityMappedTarget,

      target:
        trinityTarget,

      unknownCount:
        Math.max(
          0,
          trinityTarget -
          trinityMappedTarget
        ),

      /*
       * Until all 46 rows have independent mappings, the percentage describes
       * only the mapped rows and a full completion verdict is not claimed.
       */
      percent:
        CalculatePercent(
          trinityCurrent,
          trinityMappedTarget
        ),

      complete:
        trinityMappedTarget ===
          trinityTarget &&
        trinityCurrent >=
          trinityTarget
    },

    postcards:
      BuildProgress(
        slot.completion
          .postcardsMailed ??
        0,
        GetTarget("postcards"),
        true
      ),

    atlanticaClams:
      BuildProgress(
        slot.completion
          .atlanticaClams
          ?.openedCount ??
        0,
        GetTarget("atlanticaClams"),
        true
      ),

    bosses: {
      current:
        defeatedBosses.length,

      mappedTarget:
        bossEntries.length,

      target:
        bossesTarget,

      percent:
        CalculatePercent(
          defeatedBosses.length,
          bossEntries.length
        ),

      mappingCoveragePercent:
        CalculatePercent(
          bossEntries.length,
          bossesTarget
        ),

      unknownCount:
        Math.max(
          0,
          bossesTarget -
          bossEntries.length
        ),

      missingMappedCount:
        missingMappedBosses.length,

      missingMapped:
        missingMappedBosses.map(
          entry => ({
            key:
              entry.key,

            name:
              entry.name
          })
        )
    },

    minigames: {
      current:
        completedMinigames.length,

      mappedTarget:
        minigameEntries.length,

      target:
        minigamesTarget,

      percent:
        CalculatePercent(
          completedMinigames.length,
          minigameEntries.length
        ),

      mappingCoveragePercent:
        CalculatePercent(
          minigameEntries.length,
          minigamesTarget
        ),

      unknownCount:
        Math.max(
          0,
          minigamesTarget -
          minigameEntries.length
        ),

      missingMappedCount:
        missingMappedMinigames.length,

      missingMapped:
        missingMappedMinigames.map(
          entry => ({
            key:
              entry.key,

            name:
              entry.name
          })
        )
    },

    gummiBlueprints: {
      ...BuildProgress(
        gummiBlueprintCurrent,
        GetTarget("gummiBlueprints"),
        true
      ),

      missingCount:
        missingGummiBlueprints.length,

      missing:
        missingGummiBlueprints.map(
          entry => ({
            index:
              entry.index,

            name:
              entry.name,

            offset:
              entry.offset,

            offsetHex:
              entry.offsetHex
          })
        )
    },

    synthesis:
      BuildProgress(
        slot.completion
          .synthesis
          ?.completedCount ??
        0,
        GetTarget("synthesis"),
        true
      )
  };
}

function KH1CheckCompletion(parsedSave) {
  parsedSave.slots =
    parsedSave.slots.map(
      slot => ({
        ...slot,

        completionAnalysis:
          BuildSlotCompletion(
            slot
          )
      })
    );

  return parsedSave;
}

export {
  CalculatePercent,
  BuildProgress,
  BuildSlotCompletion,
  KH1CheckCompletion
};
