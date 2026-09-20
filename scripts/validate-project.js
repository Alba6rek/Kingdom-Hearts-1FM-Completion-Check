import fs from "node:fs";
import KH1_CONTENT from "../src/js/kh1-content.js";

import {
  KH1_ARCHIVE,
  KH1_JOURNAL_CHARACTER_STATES,
  KH1_MINIGAME_STATES,
  KH1_BOSS_COMPLETION_STATES,
  KH1_OLYMPUS,
  KH1_TRINITY_MARK_STATES
} from "../src/js/kh1-database.js";

function Assert(
  condition,
  message
) {
  if (!condition) {
    throw new Error(message);
  }
}

function IsSingleBit(mask) {
  return (
    Number.isInteger(mask) &&
    mask > 0 &&
    (mask & (mask - 1)) === 0
  );
}

const trinityMarks =
  KH1_CONTENT.TRINITY_MARKS
    .flatMap(
      group =>
        group.marks.map(
          mark => ({
            ...mark,
            color:
              group.color
          })
        )
    );

const testNumbers =
  trinityMarks.map(
    mark =>
      mark.testNumber
  );

const mappingNumbers =
  Object.keys(
    KH1_TRINITY_MARK_STATES
  ).map(Number);

Assert(
  trinityMarks.length === 46,
  `Expected 46 Trinity content rows, found ${trinityMarks.length}.`
);

Assert(
  new Set(testNumbers).size === 46,
  "Trinity content contains duplicate test numbers."
);

Assert(
  testNumbers
    .slice()
    .sort((a, b) => a - b)
    .every(
      (value, index) =>
        value === index + 1
    ),
  "Trinity content test numbers must be exactly 1..46."
);

Assert(
  mappingNumbers.length === 46,
  `Expected 46 Trinity mapping rows, found ${mappingNumbers.length}.`
);

Assert(
  mappingNumbers
    .slice()
    .sort((a, b) => a - b)
    .every(
      (value, index) =>
        value === index + 1
    ),
  "Trinity mapping test numbers must be exactly 1..46."
);

const mapped = [];
const pending = [];

Object.entries(
  KH1_TRINITY_MARK_STATES
).forEach(
  ([testNumber, mapping]) => {
    const hasOffset =
      Number.isInteger(
        mapping.offset
      );

    const hasMask =
      Number.isInteger(
        mapping.mask
      );

    if (!hasOffset || !hasMask) {
      Assert(
        mapping.offset === null &&
        mapping.mask === null,
        `Trinity ${testNumber} must define both offset and mask, or neither.`
      );

      pending.push(
        Number(testNumber)
      );

      return;
    }

    Assert(
      mapping.offset >= 0 &&
      mapping.offset <
        KH1_ARCHIVE.SAVE_LENGTH,
      `Trinity ${testNumber} offset is outside the 0x16C00 save block.`
    );

    Assert(
      IsSingleBit(
        mapping.mask
      ),
      `Trinity ${testNumber} mask must contain exactly one bit.`
    );

    mapped.push(
      Number(testNumber)
    );
  }
);

Assert(
  mapped.length === 46,
  `Expected 46 mapped Trinity rows, found ${mapped.length}.`
);

Assert(
  pending.length === 0,
  `Expected no pending Trinity rows, found: ${pending.join(", ")}.`
);



/*
 * Project data files intentionally use plain JavaScript objects/arrays.
 * Research confidence is represented by data fields, not Object.freeze().
 */
[
  "src/js/kh1-database.js",
  "src/js/kh1-dictionary.js",
  "src/js/kh1-content.js"
].forEach(file => {
  const source = fs.readFileSync(file, "utf8");
  Assert(
    !source.includes("Object.freeze("),
    `${file} must use plain data objects/arrays rather than Object.freeze().`
  );
});

Assert(
  Object.keys(KH1_JOURNAL_CHARACTER_STATES).length === 103,
  "Expected 103 Journal character entries."
);

Assert(
  Object.keys(KH1_MINIGAME_STATES).length === 8,
  "Expected 8 Journal minigame entries."
);

["poohHunnyHunt", "blockTigger", "poohSwing", "tiggerGiantPot", "poohMuddyPath"].forEach(key => {
  Assert(
    KH1_MINIGAME_STATES[key]?.evidence === "confirmed",
    `100 Acre Wood minigame ${key} must be marked confirmed.`
  );
});

Assert(
  KH1_OLYMPUS.cups.hadesCup.confidence === "confirmed",
  "Hades Cup must be marked confirmed."
);

Assert(
  Object.keys(KH1_BOSS_COMPLETION_STATES).length === 41,
  "Expected 41 boss tracker entries."
);

Assert(
  !Object.values(KH1_BOSS_COMPLETION_STATES).some(definition => definition.evidence === "strong"),
  "Boss database still contains a strong/unconfirmed mapping."
);

Assert(
  KH1_CONTENT.ANSEM_REPORTS?.length === 13,
  "Expected 13 editable Ansem Report metadata rows."
);

Assert(
  KH1_CONTENT.PUPPY_GROUPS?.length === 33,
  "Expected 33 editable puppy-triplet metadata rows."
);

[
  ["jungleSlider", 5],
  ["vineJump", 4],
  ["olympusColiseum", 4]
].forEach(([key, expected]) => {
  const definition =
    KH1_CONTENT.MINIGAMES.find(
      item => item.key === key
    );

  Assert(
    definition?.subrecords?.length === expected,
    `Minigame ${key} must expose ${expected} editable child metadata rows.`
  );
});

const indexSource =
  fs.readFileSync(
    "src/js/index.js",
    "utf8"
  );

Assert(
  !indexSource.includes("found · ${mappedCount} mapped"),
  "Trinity summary still exposes mapped/pending counters."
);

Assert(
  !indexSource.includes("mapped · ${overallPercent}%"),
  "Minigame summary still uses mapped wording."
);

console.log(
  "Project validation passed."
);

console.log(
  `Trinity mappings: ${mapped.length} confirmed, ${pending.length} pending.`
);
