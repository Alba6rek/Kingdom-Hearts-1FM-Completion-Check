/*
===============================================================================
KH1 COMPLETION CHECKER
===============================================================================

This is the equivalent of your Silksong HKCheckCompletion.js.

IMPORTANT:
LoadSaveFile.js should only READ/PARSE the binary format.
This file should ANALYZE the parsed data.

That makes it possible later to add:
  - completion %
  - missing puppies
  - missing Reports
  - missing Trinity marks
  - Journal status
  - synthesis progress
  - achievements
  - hints
without changing the binary parser.
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

function BuildSlotCompletion(slot) {
  const puppyCurrent =
    slot.completion.puppies.foundCount;

  const reportCurrent =
    slot.completion.reports.count;

  const summonCurrent =
    slot.completion.summons.count;

  const trinityCurrent =
    slot.completion.trinity.foundTotal;

  const postcardCurrent =
    slot.completion.postcardsMailed ?? 0;

  const clamCurrent =
    slot.completion
      .atlanticaClams
      ?.openedCount ?? 0;

  const synthesisCurrent =
    slot.completion
      .synthesis
      ?.completedCount ?? 0;

  const gummiBlueprintEntries =
    slot.completion
      .gummiBlueprints
      ?.entries ??
    [];

  const gummiBlueprintCurrent =
    gummiBlueprintEntries
      .filter(
        entry =>
          entry.owned
      )
      .length;

  const missingGummiBlueprints =
    gummiBlueprintEntries
      .filter(
        entry =>
          !entry.owned
      );

  const journalCharacterEntries =
    Object.values(
      slot.completion
        .journalCharacters
        ?.entries ??
      {}
    );

  const journalCharacterCurrent =
    journalCharacterEntries
      .filter(
        entry =>
          entry.found === true
      )
      .length;

  const missingJournalCharacters =
    journalCharacterEntries
      .filter(
        entry =>
          entry.found !== true
      );

  /*
   * Heartless completion is NOT based on the total number of kills.
   *
   * Each of the 46 Journal enemies contributes exactly one completion entry:
   *
   *   defeated === 0  -> incomplete
   *   defeated >= 1   -> complete
   *
   * Example:
   *   Shadow = 1051 kills -> still counts as 1 completed Journal enemy.
   *   Soldier = 169 kills -> still counts as 1 completed Journal enemy.
   */
  const journalEnemies =
    slot.completion
      .enemyDefeatCounters
      .journalGroups
      .reduce(
        (allEnemies, group) =>
          allEnemies.concat(group),
        []
      );

  const heartlessCurrent =
    journalEnemies.filter(
      enemy =>
        enemy.defeated > 0
    ).length;

  const missingHeartless =
    journalEnemies.filter(
      enemy =>
        enemy.defeated === 0
    );

  return {
    journalCharacters: {
      current:
        journalCharacterCurrent,

      target:
        KH1_COMPLETION_DATABASE
          .journalCharacters
          .target,

      percent:
        CalculatePercent(
          journalCharacterCurrent,
          KH1_COMPLETION_DATABASE
            .journalCharacters
            .target
        ),

      complete:
        journalCharacterCurrent >=
        KH1_COMPLETION_DATABASE
          .journalCharacters
          .target,

      missingCount:
        missingJournalCharacters
          .length,

      missing:
        missingJournalCharacters
          .map(
            entry => ({
              key:
                entry.key,

              name:
                entry.name
            })
          )
    },

    heartlessDefeated: {
      current:
        heartlessCurrent,

      target:
        KH1_COMPLETION_DATABASE
          .heartlessDefeated
          .target,

      percent:
        CalculatePercent(
          heartlessCurrent,
          KH1_COMPLETION_DATABASE
            .heartlessDefeated
            .target
        ),

      complete:
        heartlessCurrent >=
        KH1_COMPLETION_DATABASE
          .heartlessDefeated
          .target,

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

    puppies: {
      current:
        puppyCurrent,

      target:
        KH1_COMPLETION_DATABASE.puppies.target,

      percent:
        CalculatePercent(
          puppyCurrent,
          KH1_COMPLETION_DATABASE.puppies.target
        )
    },

    reports: {
      current:
        reportCurrent,

      target:
        KH1_COMPLETION_DATABASE.ansemReports.target,

      percent:
        CalculatePercent(
          reportCurrent,
          KH1_COMPLETION_DATABASE.ansemReports.target
        )
    },

    summons: {
      current:
        summonCurrent,

      target:
        KH1_COMPLETION_DATABASE.summons.target,

      percent:
        CalculatePercent(
          summonCurrent,
          KH1_COMPLETION_DATABASE.summons.target
        )
    },

    trinity: {
      current:
        trinityCurrent,

      target:
        KH1_COMPLETION_DATABASE.trinities.target,

      percent:
        CalculatePercent(
          trinityCurrent,
          KH1_COMPLETION_DATABASE.trinities.target
        )
    },

    postcards: {
      current:
        postcardCurrent,

      target:
        KH1_COMPLETION_DATABASE.postcards.target,

      percent:
        CalculatePercent(
          postcardCurrent,
          KH1_COMPLETION_DATABASE.postcards.target
        ),

      complete:
        postcardCurrent >=
        KH1_COMPLETION_DATABASE.postcards.target
    },

    atlanticaClams: {
      current:
        clamCurrent,

      target:
        KH1_COMPLETION_DATABASE.atlanticaClams.target,

      percent:
        CalculatePercent(
          clamCurrent,
          KH1_COMPLETION_DATABASE.atlanticaClams.target
        ),

      complete:
        clamCurrent >=
        KH1_COMPLETION_DATABASE.atlanticaClams.target
    },

    gummiBlueprints: {
      current:
        gummiBlueprintCurrent,

      target:
        KH1_COMPLETION_DATABASE
          .gummiBlueprints
          .target,

      percent:
        CalculatePercent(
          gummiBlueprintCurrent,
          KH1_COMPLETION_DATABASE
            .gummiBlueprints
            .target
        ),

      complete:
        gummiBlueprintCurrent >=
        KH1_COMPLETION_DATABASE
          .gummiBlueprints
          .target,

      missingCount:
        missingGummiBlueprints
          .length,

      missing:
        missingGummiBlueprints
          .map(
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

    synthesis: {
      current:
        synthesisCurrent,

      target:
        KH1_COMPLETION_DATABASE.synthesis.target,

      percent:
        CalculatePercent(
          synthesisCurrent,
          KH1_COMPLETION_DATABASE.synthesis.target
        ),

      complete:
        synthesisCurrent >=
        KH1_COMPLETION_DATABASE.synthesis.target
    }
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
  BuildSlotCompletion,
  KH1CheckCompletion
};
