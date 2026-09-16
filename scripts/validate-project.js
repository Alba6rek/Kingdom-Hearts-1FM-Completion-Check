import KH1_CONTENT from "../src/js/kh1-content.js";

import {
  KH1_ARCHIVE,
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

const expectedPending =
  [3, 4, 18, 19, 20, 24, 32, 34];

Assert(
  mapped.length === 38,
  `Expected 38 mapped Trinity rows, found ${mapped.length}.`
);

Assert(
  JSON.stringify(
    pending.sort((a, b) => a - b)
  ) ===
  JSON.stringify(expectedPending),
  `Unexpected pending Trinity rows: ${pending.join(", ")}.`
);

console.log(
  "Project validation passed."
);

console.log(
  `Trinity mappings: ${mapped.length} confirmed, ${pending.length} pending.`
);
