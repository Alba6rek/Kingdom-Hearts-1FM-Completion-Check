/*
===============================================================================
KH1 RESEARCH / DIFFERENTIAL ANALYSIS
===============================================================================

Use this file when you want to discover an unknown save offset.

Best workflow:

1. Make Save A.
2. Perform exactly ONE action in the game.
3. Make Save B.
4. Compare the raw 0x16C00 save blocks.
5. Investigate the changed offsets.

Examples of one-action tests:
  - defeat one specific Heartless
  - open one chest
  - collect one puppy triplet
  - equip one item
  - synthesize one recipe
  - use one Trinity
  - complete one minigame

The fewer things that change between saves, the easier the mapping is.
*/

import {
  CompareSaveBytes
} from "./kh1-functions.js";

function HexToBytes(hex) {
  const clean =
    hex.replace(
      /\s+/g,
      ""
    );

  if (
    clean.length % 2 !== 0
  ) {
    throw new Error(
      "Invalid hex string length."
    );
  }

  const result =
    new Uint8Array(
      clean.length / 2
    );

  for (
    let index = 0;
    index < result.length;
    index++
  ) {
    result[index] =
      parseInt(
        clean.substr(
          index * 2,
          2
        ),
        16
      );
  }

  return result;
}

/*
 * Compare two parsed slot objects.
 *
 * Because ParseSave() stores the complete raw save as hex under:
 *
 *     slot.research.fullSave.rawHex
 *
 * we can reconstruct the bytes and run a byte-by-byte diff.
 */
function CompareParsedSlots(
  beforeSlot,
  afterSlot
) {
  const before =
    HexToBytes(
      beforeSlot
        .research
        .fullSave
        .rawHex
    );

  const after =
    HexToBytes(
      afterSlot
        .research
        .fullSave
        .rawHex
    );

  return CompareSaveBytes(
    before,
    after
  );
}

export {
  HexToBytes,
  CompareParsedSlots
};
