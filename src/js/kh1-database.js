/*
===============================================================================
KINGDOM HEARTS FINAL MIX DATABASE
===============================================================================

This file contains DATA LOCATIONS and structural constants.

It answers:
    "Where is the value?"

It should not contain UI code and should not contain the human-readable
dictionary names.

There are two offset levels:

1. Outer KHFM_WW.png archive offsets.
2. Inner 0x16C00 KH1 save-block offsets.
*/

const DIRECTORY_OFFSET = 0x70;

const DATA_OFFSET =
  DIRECTORY_OFFSET +
  200 * 0x158;

const KH1_ARCHIVE = Object.freeze({
  PNG_HEADER_LENGTH: 0x70,

  DIRECTORY_OFFSET,

  ENTRY_COUNT: 200,
  ENTRY_LENGTH: 0x158,
  ENTRY_STRIDE: 0x16C40,

  DATA_OFFSET,

  SAVE_LENGTH: 0x16C00,
  EXPECTED_FILE_SIZE: 0x11EB09D
});

const KH1_SAVE = Object.freeze({
  CHARACTER_START: 0x0004,
  CHARACTER_SIZE: 0x74,
  CHARACTER_COUNT: 10,

  PARTY: 0x048E,

  INVENTORY: 0x0499,
  INVENTORY_LENGTH: 256,

  SHARED_ABILITIES: 0x0599,

  CHEST_FLAGS: 0x05CC,
  CHEST_FLAGS_LENGTH: 509,

  SUMMONS: 0x07D0,

  /*
   * Full enemy counter table currently mapped as:
   *
   *   0x07D8 .. 0x083B
   *   100 bytes
   *   50 x uint16 little-endian counters
   *
   * Index 0 starts at 0x07D8.
   * Index N is located at:
   *
   *   ENEMY_COUNTERS + (N * 2)
   */
  ENEMY_COUNTERS: 0x07D8,
  ENEMY_COUNTERS_LENGTH: 100,
  ENEMY_COUNTERS_COUNT: 50,

  DESTINY_BEHEMOTH: 0x0838,
  ARCH_BEHEMOTH: 0x083A,

  SHORTCUTS: 0x0844,

  PUPPY_REWARDS: 0x0E3C,

  ICE_TITAN: 0x0F69,
  SEPHIROTH: 0x0F6A,

  TORN_PAGES: 0x1400,
  ACRE_WOOD_PAGES: 0x1410,
  ACRE_WOOD_PAGES_LENGTH: 5,

  /*
   * 100 Acre Wood minigame data discovered through controlled saves.
   */
  ACRE_WOOD_MINIGAME_FLAGS: 0x19D6,
  HUNNY_HUNT_SCORE: 0x17DC,
  BLOCK_TIGGER_SCORE: 0x17F0,

  WORLD_PROGRESS: 0x1504,
  WORLD_PROGRESS_LENGTH: 12,

  /*
   * Olympus Coliseum controlled-test mappings.
   */
  OLYMPUS_STORY_PROGRESS: 0x1506,
  PHIL_TRAINING_FLAG: 0x0F05,

  EXTRA_TRAVERSE_TOWN_PROGRESS: 0x1512,

  RED_ARMOR_JOURNAL: 0x16F9,

  PUPPIES: 0x1703,
  PUPPIES_LENGTH: 13,

  ANSEM_REPORTS: 0x19C0,

  /*
   * Synthesis completion bitfield.
   *
   * Controlled test:
   *   Slot 9  = no synthesis completed
   *   Slot 10 = synthesized Mega-Potion only
   *
   * Result:
   *   0x19C8 changed 0x00 -> 0x80.
   *
   * A known complete save has:
   *   FF FF FF FF 80
   *
   * That is exactly 33 MSB-first bits, matching the 33 Final Mix
   * synthesis recipes.
   */
  SYNTHESIS_FLAGS: 0x19C8,
  SYNTHESIS_FLAGS_LENGTH: 5,
  SYNTHESIS_ITEM_COUNT: 33,

  /*
   * Synthesis shop/list progression stage.
   *
   * Controlled observations:
   *
   *   0 recipes  -> 0
   *   1 recipe   -> 0
   *   2 recipes  -> 0
   *   3 recipes  -> 1   // List II milestone
   *   ...
   *   8 recipes  -> 1
   *   9 recipes  -> 2   // List III milestone
   *   ...
   *   14 recipes -> 2
   *   15 recipes -> 3   // List IV milestone
   *   16 recipes -> 3
   *   17 recipes -> 3
   *   18 recipes -> 3
   *
   * Known complete save:
   *
   *   33 recipes -> 6
   *
   * All observed stage transitions are now directly confirmed:
   *
   *   3 recipes  -> 1
   *   9 recipes  -> 2
   *   15 recipes -> 3
   *   21 recipes -> 4
   *   30 recipes -> 5
   *   33 recipes -> 6
   *
   * This exactly follows the synthesis-list progression and final
   * all-recipes-completed state.
   */
  SYNTHESIS_LIST_PROGRESS: 0x19D0,

  /*
   * Cup completion bitfield:
   *   0x01 = Phil Cup
   *   0x02 = Pegasus Cup
   *   0x04 = Hercules Cup
   *   0x08 = Hades Cup (pattern + complete-save observation)
   */
  OLYMPUS_CUP_COMPLETION_FLAGS: 0x16D0,

  TRINITY_UNLOCKS: 0x1C1B,

  MAGIC_LEVELS: 0x1C1E,
  MAGIC_LEVELS_LENGTH: 7,

  TRINITY_COUNTERS: 0x1C66,
  TRINITY_COUNTERS_LENGTH: 6,

  POSTCARDS_MAILED: 0x1CBF,
  POSTCARDS_TOTAL: 10,

  ATLANTICA_CLAMS: 0x1DA9,
  ATLANTICA_CLAMS_LENGTH: 2,
  ATLANTICA_CLAMS_COUNT: 16,

  /*
   * Four cup state bytes:
   *   +0 Phil Cup
   *   +1 Pegasus Cup
   *   +2 Hercules Cup
   *   +3 Hades Cup
   *
   * Observed:
   *   0x00 = locked / unavailable
   *   0x0A = available / not completed
   *   0x01 = completed
   */
  OLYMPUS_CUPS: 0x1E00,
  OLYMPUS_CUPS_LENGTH: 4,

  WORLD_STATUS: 0x1EF0,
  WORLD_STATUS_LENGTH: 11,

  /*
   * Gummi data.
   *
   * Custom player-created ship records are a separate structure at 0x241C.
   * Blueprint ownership is stored much later in the Gummi inventory region.
   *
   * Gummi inventory layout identified for KH1 Final Mix:
   *   0xBE78..0xBEB7 = 64 primary Gummi-part quantity bytes
   *   0xBEB8..0xBEBE = 7 Gummi upgrade bytes
   *   0xBEBF..0xBEEE = 48 blueprint ownership bytes
   *
   * Each blueprint byte is 0 when missing and non-zero when owned.
   */
  GUMMI_CUSTOM_SHIPS: 0x241C,
  GUMMI_CUSTOM_SHIP_COUNT: 10,

  GUMMI_INVENTORY: 0xBE78,
  GUMMI_BLUEPRINTS: 0xBEBF,
  GUMMI_BLUEPRINTS_LENGTH: 48,

  CURRENT_WORLD: 0x2040,
  CURRENT_ROOM: 0x2044,
  SPAWN_LOCATION: 0x2048,

  SETTINGS: 0x16400,

  MUNNY: 0x1641C,

  DIFFICULTY: 0x1642C
});

/*
 * This is the beginning of the future completion-check database.
 *
 * Later, KH1CheckCompletion.js can iterate over these records instead of
 * hard-coding the page display logic.
 */

/*
===============================================================================
RESEARCH / UNKNOWN REGIONS
===============================================================================

These regions are intentionally exposed even when we do not yet know the full
meaning of every byte.

Reason:
    reverse engineering is much easier when raw data is preserved.

Each region is exported with:
    - offset
    - length
    - raw byte array
    - hex
    - optional uint16 LE interpretation
    - optional uint32 LE interpretation

The labels below are descriptive/research labels only where the meaning is not
fully confirmed.
*/

/*
===============================================================================
CONFIRMED JOURNAL CHARACTER FLAGS
===============================================================================

Controlled save sequence:

46 -> 47 : obtain Dumbo
47 -> 48 : meet Winnie the Pooh
48 -> 49 : meet Owl
49 -> 50 : meet Piglet
51 -> 52 : meet Rabbit
52 -> 53 : meet Tigger

These mappings are directly confirmed by one-action save comparisons.
*/
/*
===============================================================================
JOURNAL CHARACTER BINARY STATE MAP
===============================================================================

This file answers WHERE the data is stored.

For Journal characters it intentionally stores only:
    - semantic key
    - save offset
    - bit mask
    - original global test bit when available

Display names and state labels belong in kh1-dictionary.js.
World grouping, hints, order, and URLs belong in kh1-content.js.

A character may have more than one persistent state. Completion is true when
ANY confirmed state for that character is active.
*/
const KH1_JOURNAL_CHARACTER_STATES = Object.freeze({
  "kairi": Object.freeze([
    Object.freeze({ offset: 0x16E3, mask: 0x01 }),
  ]),
  "riku": Object.freeze([
    Object.freeze({ offset: 0x16E3, mask: 0x04 }),
  ]),
  "sora": Object.freeze([
    Object.freeze({ offset: 0x16E3, mask: 0x40 }),
  ]),
  "pluto": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x01 }),
  ]),
  "daisy-duck": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x02 }),
  ]),
  "minnie-mouse": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x04 }),
  ]),
  "goofy": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x08 }),
  ]),
  "donald-duck": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x20 }),
  ]),
  "mickey-mouse": Object.freeze([
    Object.freeze({ offset: 0x16E4, mask: 0x80 }),
  ]),
  "pongo": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x01 }),
  ]),
  "fairy-godmother": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x02 }),
  ]),
  "merlin": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x04 }),
  ]),
  "louie": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x08 }),
  ]),
  "dewey": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x10 }),
  ]),
  "huey": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x20 }),
  ]),
  "dale": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x40 }),
  ]),
  "chip": Object.freeze([
    Object.freeze({ offset: 0x16E5, mask: 0x80 }),
  ]),
  "ice-titan": Object.freeze([
    Object.freeze({ offset: 0x16F7, mask: 0x02 }),
  ]),
  "sephiroth": Object.freeze([
    Object.freeze({ offset: 0x16F7, mask: 0x04 }),
  ]),
  "unknown": Object.freeze([
    Object.freeze({ offset: 0x16F8, mask: 0x40 }),
  ]),
  "perdita": Object.freeze([
    Object.freeze({ globalBit: 7, offset: 0x16E6, mask: 0x80 }),
  ]),
  "99-puppies": Object.freeze([
    Object.freeze({ globalBit: 6, offset: 0x16E6, mask: 0x40 }),
  ]),
  "brooms": Object.freeze([
    Object.freeze({ globalBit: 5, offset: 0x16E6, mask: 0x20 }),
  ]),
  "leon": Object.freeze([
    Object.freeze({ globalBit: 4, offset: 0x16E6, mask: 0x10 }),
  ]),
  "yuffie": Object.freeze([
    Object.freeze({ globalBit: 3, offset: 0x16E6, mask: 0x08 }),
  ]),
  "aerith": Object.freeze([
    Object.freeze({ globalBit: 2, offset: 0x16E6, mask: 0x04 }),
  ]),
  "cid": Object.freeze([
    Object.freeze({ globalBit: 0, offset: 0x16E6, mask: 0x01 }),
  ]),
  "tidus": Object.freeze([
    Object.freeze({ globalBit: 15, offset: 0x16E7, mask: 0x80 }),
  ]),
  "selphie": Object.freeze([
    Object.freeze({ globalBit: 14, offset: 0x16E7, mask: 0x40 }),
  ]),
  "wakka": Object.freeze([
    Object.freeze({ globalBit: 13, offset: 0x16E7, mask: 0x20 }),
  ]),
  "moogles": Object.freeze([
    Object.freeze({ globalBit: 12, offset: 0x16E7, mask: 0x10 }),
  ]),
  "snow-white": Object.freeze([
    Object.freeze({ globalBit: 10, offset: 0x16E7, mask: 0x04 }),
  ]),
  "cinderella": Object.freeze([
    Object.freeze({ globalBit: 9, offset: 0x16E7, mask: 0x02 }),
  ]),
  "aurora": Object.freeze([
    Object.freeze({ globalBit: 8, offset: 0x16E7, mask: 0x01 }),
  ]),
  "belle": Object.freeze([
    Object.freeze({ globalBit: 23, offset: 0x16E8, mask: 0x80 }),
  ]),
  "beast": Object.freeze([
    Object.freeze({ globalBit: 22, offset: 0x16E8, mask: 0x40 }),
  ]),
  "maleficent": Object.freeze([
    Object.freeze({ globalBit: 19, offset: 0x16E8, mask: 0x08 }),
    Object.freeze({ globalBit: 20, offset: 0x16E8, mask: 0x10 }),
    Object.freeze({ globalBit: 21, offset: 0x16E8, mask: 0x20 }),
  ]),
  "dragon": Object.freeze([
    Object.freeze({ globalBit: 18, offset: 0x16E8, mask: 0x04 }),
  ]),
  "ansem": Object.freeze([
    Object.freeze({ globalBit: 11, offset: 0x16E7, mask: 0x08 }),
    Object.freeze({ globalBit: 17, offset: 0x16E8, mask: 0x02 }),
  ]),
  "cloud": Object.freeze([
    Object.freeze({ globalBit: 1, offset: 0x16E6, mask: 0x02 }),
  ]),
  "mushu": Object.freeze([
    Object.freeze({ globalBit: 30, offset: 0x16E9, mask: 0x40 }),
  ]),
  "simba": Object.freeze([
    Object.freeze({ globalBit: 29, offset: 0x16E9, mask: 0x20 }),
  ]),
  "alice": Object.freeze([
    Object.freeze({ globalBit: 27, offset: 0x16E9, mask: 0x08 }),
    Object.freeze({ globalBit: 28, offset: 0x16E9, mask: 0x10 }),
  ]),
  "queen-of-hearts": Object.freeze([
    Object.freeze({ globalBit: 26, offset: 0x16E9, mask: 0x04 }),
  ]),
  "cards-hearts": Object.freeze([
    Object.freeze({ globalBit: 25, offset: 0x16E9, mask: 0x02 }),
  ]),
  "cards-spades": Object.freeze([
    Object.freeze({ globalBit: 24, offset: 0x16E9, mask: 0x01 }),
  ]),
  "white-rabbit": Object.freeze([
    Object.freeze({ globalBit: 39, offset: 0x16EA, mask: 0x80 }),
  ]),
  "cheshire-cat": Object.freeze([
    Object.freeze({ globalBit: 38, offset: 0x16EA, mask: 0x40 }),
  ]),
  "doorknob": Object.freeze([
    Object.freeze({ globalBit: 37, offset: 0x16EA, mask: 0x20 }),
  ]),
  "philoctetes": Object.freeze([
    Object.freeze({ globalBit: 35, offset: 0x16EA, mask: 0x08 }),
  ]),
  "tarzan": Object.freeze([
    Object.freeze({ globalBit: 46, offset: 0x16EB, mask: 0x40 }),
  ]),
  "jane-porter": Object.freeze([
    Object.freeze({ globalBit: 45, offset: 0x16EB, mask: 0x20 }),
  ]),
  "clayton": Object.freeze([
    Object.freeze({ globalBit: 43, offset: 0x16EB, mask: 0x08 }),
    Object.freeze({ globalBit: 44, offset: 0x16EB, mask: 0x10 }),
  ]),
  "terk": Object.freeze([
    Object.freeze({ globalBit: 42, offset: 0x16EB, mask: 0x04 }),
  ]),
  "kerchak": Object.freeze([
    Object.freeze({ globalBit: 41, offset: 0x16EB, mask: 0x02 }),
  ]),
  "kala": Object.freeze([
    Object.freeze({ globalBit: 40, offset: 0x16EB, mask: 0x01 }),
  ]),
  "sabor": Object.freeze([
    Object.freeze({ globalBit: 55, offset: 0x16EC, mask: 0x80 }),
  ]),
  "aladdin": Object.freeze([
    Object.freeze({ globalBit: 53, offset: 0x16EC, mask: 0x20 }),
    Object.freeze({ globalBit: 54, offset: 0x16EC, mask: 0x40 }),
  ]),
  "genie": Object.freeze([
    Object.freeze({ globalBit: 51, offset: 0x16EC, mask: 0x08 }),
    Object.freeze({ globalBit: 52, offset: 0x16EC, mask: 0x10 }),
  ]),
  "jasmine": Object.freeze([
    Object.freeze({ offset: 0x16F7, mask: 0x01 }),
    Object.freeze({ globalBit: 50, offset: 0x16EC, mask: 0x04 }),
  ]),
  "jafar": Object.freeze([
    Object.freeze({ globalBit: 48, offset: 0x16EC, mask: 0x01 }),
    Object.freeze({ globalBit: 49, offset: 0x16EC, mask: 0x02 }),
  ]),
  "jafar-genie": Object.freeze([
    Object.freeze({ globalBit: 63, offset: 0x16ED, mask: 0x80 }),
  ]),
  "abu": Object.freeze([
    Object.freeze({ globalBit: 62, offset: 0x16ED, mask: 0x40 }),
  ]),
  "iago": Object.freeze([
    Object.freeze({ globalBit: 61, offset: 0x16ED, mask: 0x20 }),
  ]),
  "carpet": Object.freeze([
    Object.freeze({ globalBit: 60, offset: 0x16ED, mask: 0x10 }),
  ]),
  "pinocchio": Object.freeze([
    Object.freeze({ globalBit: 58, offset: 0x16ED, mask: 0x04 }),
    Object.freeze({ globalBit: 59, offset: 0x16ED, mask: 0x08 }),
  ]),
  "geppetto": Object.freeze([
    Object.freeze({ globalBit: 56, offset: 0x16ED, mask: 0x01 }),
    Object.freeze({ globalBit: 57, offset: 0x16ED, mask: 0x02 }),
  ]),
  "jiminy-cricket": Object.freeze([
    Object.freeze({ globalBit: 71, offset: 0x16EE, mask: 0x80 }),
  ]),
  "ariel": Object.freeze([
    Object.freeze({ globalBit: 69, offset: 0x16EE, mask: 0x20 }),
    Object.freeze({ globalBit: 70, offset: 0x16EE, mask: 0x40 }),
  ]),
  "king-triton": Object.freeze([
    Object.freeze({ globalBit: 68, offset: 0x16EE, mask: 0x10 }),
  ]),
  "ursula": Object.freeze([
    Object.freeze({ globalBit: 66, offset: 0x16EE, mask: 0x04 }),
    Object.freeze({ globalBit: 67, offset: 0x16EE, mask: 0x08 }),
  ]),
  "sebastian": Object.freeze([
    Object.freeze({ globalBit: 65, offset: 0x16EE, mask: 0x02 }),
  ]),
  "flounder": Object.freeze([
    Object.freeze({ globalBit: 64, offset: 0x16EE, mask: 0x01 }),
  ]),
  "jetsam": Object.freeze([
    Object.freeze({ globalBit: 79, offset: 0x16EF, mask: 0x80 }),
  ]),
  "flotsam": Object.freeze([
    Object.freeze({ globalBit: 78, offset: 0x16EF, mask: 0x40 }),
  ]),
  "jack-skellington": Object.freeze([
    Object.freeze({ globalBit: 77, offset: 0x16EF, mask: 0x20 }),
  ]),
  "sally": Object.freeze([
    Object.freeze({ globalBit: 76, offset: 0x16EF, mask: 0x10 }),
  ]),
  "oogie-boogie": Object.freeze([
    Object.freeze({ globalBit: 74, offset: 0x16EF, mask: 0x04 }),
    Object.freeze({ globalBit: 75, offset: 0x16EF, mask: 0x08 }),
  ]),
  "dr-finkelstein": Object.freeze([
    Object.freeze({ globalBit: 73, offset: 0x16EF, mask: 0x02 }),
  ]),
  "zero": Object.freeze([
    Object.freeze({ globalBit: 72, offset: 0x16EF, mask: 0x01 }),
  ]),
  "lock": Object.freeze([
    Object.freeze({ globalBit: 87, offset: 0x16F0, mask: 0x80 }),
  ]),
  "shock": Object.freeze([
    Object.freeze({ globalBit: 86, offset: 0x16F0, mask: 0x40 }),
  ]),
  "barrel": Object.freeze([
    Object.freeze({ globalBit: 85, offset: 0x16F0, mask: 0x20 }),
  ]),
  "the-mayor": Object.freeze([
    Object.freeze({ globalBit: 84, offset: 0x16F0, mask: 0x10 }),
  ]),
  "peter-pan": Object.freeze([
    Object.freeze({ globalBit: 83, offset: 0x16F0, mask: 0x08 }),
  ]),
  "tinker-bell": Object.freeze([
    Object.freeze({ globalBit: 81, offset: 0x16F0, mask: 0x02 }),
    Object.freeze({ globalBit: 82, offset: 0x16F0, mask: 0x04 }),
  ]),
  "wendy": Object.freeze([
    Object.freeze({ globalBit: 80, offset: 0x16F0, mask: 0x01 }),
  ]),
  "captain-hook": Object.freeze([
    Object.freeze({ globalBit: 94, offset: 0x16F1, mask: 0x40 }),
    Object.freeze({ globalBit: 95, offset: 0x16F1, mask: 0x80 }),
  ]),
  "mr-smee": Object.freeze([
    Object.freeze({ globalBit: 93, offset: 0x16F1, mask: 0x20 }),
  ]),
  "the-crocodile": Object.freeze([
    Object.freeze({ globalBit: 92, offset: 0x16F1, mask: 0x10 }),
  ]),
  "dumbo": Object.freeze([
    Object.freeze({ globalBit: 16, offset: 0x16E8, mask: 0x01 }),
  ]),
  "bambi": Object.freeze([
    Object.freeze({ globalBit: 31, offset: 0x16E9, mask: 0x80 }),
  ]),
  "hercules": Object.freeze([
    Object.freeze({ globalBit: 36, offset: 0x16EA, mask: 0x10 }),
  ]),
  "hades": Object.freeze([
    Object.freeze({ globalBit: 33, offset: 0x16EA, mask: 0x02 }),
    Object.freeze({ globalBit: 34, offset: 0x16EA, mask: 0x04 }),
  ]),
  "cerberus": Object.freeze([
    Object.freeze({ globalBit: 32, offset: 0x16EA, mask: 0x01 }),
  ]),
  "rock-titan": Object.freeze([
    Object.freeze({ globalBit: 47, offset: 0x16EB, mask: 0x80 }),
  ]),
  "winnie-the-pooh": Object.freeze([
    Object.freeze({ globalBit: 91, offset: 0x16F1, mask: 0x08 }),
  ]),
  "piglet": Object.freeze([
    Object.freeze({ globalBit: 90, offset: 0x16F1, mask: 0x04 }),
  ]),
  "tigger": Object.freeze([
    Object.freeze({ globalBit: 89, offset: 0x16F1, mask: 0x02 }),
  ]),
  "owl": Object.freeze([
    Object.freeze({ globalBit: 88, offset: 0x16F1, mask: 0x01 }),
  ]),
  "rabbit": Object.freeze([
    Object.freeze({ globalBit: 103, offset: 0x16F2, mask: 0x80 }),
  ]),
  "eeyore": Object.freeze([
    Object.freeze({ globalBit: 102, offset: 0x16F2, mask: 0x40 }),
  ]),
  "roo": Object.freeze([
    Object.freeze({ globalBit: 101, offset: 0x16F2, mask: 0x20 }),
  ]),
});

const KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS = Object.freeze([
  { globalBit: 96, offset: 0x16F2, mask: 0x01 },
  { globalBit: 97, offset: 0x16F2, mask: 0x02 },
  { globalBit: 98, offset: 0x16F2, mask: 0x04 },
  { globalBit: 99, offset: 0x16F2, mask: 0x08 },
  { globalBit: 100, offset: 0x16F2, mask: 0x10 }
]);

/*
 * Missing-20 post-region candidate bits that produced no visible character
 * entry in both baseline-add / isolated tests where applicable.
 */
const KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS = Object.freeze([
  { offset: 0x16F7, mask: 0x08, label: "No visible character change" },
  { offset: 0x16F8, mask: 0x80, label: "No visible character change" }
]);



/*
===============================================================================
CONFIRMED 100 ACRE WOOD MINIGAME FLAGS
===============================================================================

The complete save contains 0x3E at 0x19D6:
    0011 1110

That is exactly five set bits, matching the five 100 Acre Wood minigames.

Directly confirmed:
    0x20 = Pooh's Hunny Hunt
    0x10 = Block Tigger

The remaining 0x08 / 0x04 / 0x02 bits are preserved but are not assigned
to specific minigames until individually tested.
*/
const KH1_ACRE_WOOD_MINIGAMES = Object.freeze({
  poohHunnyHunt: {
    name: "Pooh's Hunny Hunt",
    mask: 0x20,
    scoreOffset: 0x17DC,
    confidence: "confirmed"
  },

  blockTigger: {
    name: "Block Tigger",
    mask: 0x10,
    scoreOffset: 0x17F0,
    confidence: "confirmed"
  }
});

/*
===============================================================================
CONFIRMED CHEST FLAGS
===============================================================================

Slot 45 -> 46:
    open the Watergleam chest only

Inside the known chest/static region, 0x0740 changed:
    0x00 -> 0x02

So this chest is directly mapped to bit 0x02 at 0x0740.
*/
const KH1_KNOWN_CHESTS = Object.freeze({
  watergleam: {
    name: "Watergleam Chest",
    offset: 0x0740,
    mask: 0x02,
    confidence: "confirmed"
  }
});


/*
===============================================================================
OLYMPUS COLISEUM COMPLETION MAPPINGS
===============================================================================
*/
const KH1_OLYMPUS = Object.freeze({
  milestones: {
    philTraining: {
      name: "Phil's Training",
      progressThreshold: 0x13,
      flagOffset: 0x0F05,
      flagMask: 0x01,
      confidence: "confirmed"
    },

    preliminaryTournament: {
      name: "Preliminary Tournament",
      progressThreshold: 0x22,
      confidence: "confirmed by controlled story progression"
    },

    cerberusStory: {
      name: "Cerberus",
      progressThreshold: 0x28,
      confidence: "confirmed by controlled Cerberus defeat"
    }
  },

  cups: {
    philCup: {
      name: "Phil Cup",
      statusIndex: 0,
      completionMask: 0x01,
      confidence: "confirmed"
    },

    pegasusCup: {
      name: "Pegasus Cup",
      statusIndex: 1,
      completionMask: 0x02,
      confidence: "confirmed"
    },

    herculesCup: {
      name: "Hercules Cup",
      statusIndex: 2,
      completionMask: 0x04,
      confidence: "confirmed"
    },

    hadesCup: {
      name: "Hades Cup",
      statusIndex: 3,
      completionMask: 0x08,
      confidence: "strong pattern; complete-save state observed, controlled Hades Cup test still recommended"
    }
  }
});

const KH1_RESEARCH_REGIONS = Object.freeze({
  collectedItems1: {
    offset: 0x04A2,
    length: 8,
    label: "Collected Items Block 1",
    confidence: "research"
  },

  equipsRaw: {
    offset: 0x04D3,
    length: 42,
    label: "Equipment / Collected State Raw Block",
    confidence: "research"
  },

  collectedItems2: {
    offset: 0x0531,
    length: 102,
    label: "Collected Items Block 2",
    confidence: "research"
  },

  enemyDefeatCounters: {
    offset: 0x07D8,
    length: 100,
    label: "Enemy Defeat Counters",
    confidence: "50 x uint16 LE working mapping; names supplied from save analysis"
  },

  destinyBehemothCounter: {
    offset: 0x0838,
    length: 1,
    label: "Destiny Behemoth Counter",
    confidence: "research/runtime mapping"
  },

  archBehemothCounter: {
    offset: 0x083A,
    length: 1,
    label: "Arch Behemoth Counter",
    confidence: "research/runtime mapping"
  },

  tornPageCount: {
    offset: 0x1400,
    length: 1,
    label: "Torn Page Count",
    confidence: "research/runtime mapping"
  },

  redArmorJournalByte: {
    offset: 0x16F9,
    length: 1,
    label: "Red Armor Journal Byte",
    confidence: "community documented"
  },

  reportsMask: {
    offset: 0x19C0,
    length: 2,
    label: "Reports / Journal Mask",
    confidence: "community documented"
  },

  magicLevels: {
    offset: 0x1C1E,
    length: 7,
    label: "Magic Level Bytes",
    confidence: "research/runtime mapping"
  },

  journalCharacterFlags: {
    offset: 0x16E0,
    length: 0x18,
    label: "Journal Character Flag Area",
    confidence: "partial mapping; Dumbo and five 100 Acre Wood characters directly confirmed"
  },

  acreWoodMinigameFlags: {
    offset: 0x19D6,
    length: 1,
    label: "100 Acre Wood Minigame Completion Flags",
    confidence: "0x20 Hunny Hunt and 0x10 Block Tigger directly confirmed; complete save = 0x3E"
  },

  acreWoodMinigameScores: {
    offset: 0x17DC,
    length: 0x18,
    label: "100 Acre Wood Minigame Score Area",
    confidence: "0x17DC Hunny Hunt and 0x17F0 Block Tigger directly confirmed"
  },

  olympusStoryAndEventFlags: {
    offset: 0x0F00,
    length: 0x70,
    label: "Olympus Story / Event Flag Area",
    confidence: "partial mapping; Phil Training flag at 0x0F05 confirmed"
  },

  olympusJournalCharacters: {
    offset: 0x16E6,
    length: 0x0D,
    label: "Journal Character State Area",
    confidence: "Cloud and Cerberus directly confirmed; Hercules/Hades assignment strong"
  },

  olympusCupCompletion: {
    offset: 0x16D0,
    length: 1,
    label: "Olympus Cup Completion Bitfield",
    confidence: "Phil/Pegasus/Hercules directly confirmed; Hades pattern supported by complete save"
  },

  olympusCupStates: {
    offset: 0x1E00,
    length: 4,
    label: "Olympus Cup State Bytes",
    confidence: "0x00 locked, 0x0A available, 0x01 completed observed in controlled saves"
  },

  synthesisFlags: {
    offset: 0x19C8,
    length: 5,
    label: "Synthesis Completion Flags",
    confidence: "confirmed for all indexes 0-32 by controlled sequential tests through Slot 43"
  },

  synthesisListProgress: {
    offset: 0x19D0,
    length: 1,
    label: "Synthesis List / Rank Progress",
    confidence: "confirmed transitions at 3, 9, 15, 21, 30 and 33 unique recipes; stages 0-6 fully observed"
  },

  trinityCounters: {
    offset: 0x1C66,
    length: 6,
    label: "Trinity Counter Bytes",
    confidence: "research/community mapping"
  },

  gummiBlueprints: {
    offset: 0xBEBF,
    length: 48,
    label: "Gummi Ship Blueprint Ownership",
    confidence: "48-byte ownership array confirmed; exact name order prepared for one-blueprint-per-slot PC verification"
  }
});

const KH1_COMPLETION_DATABASE = Object.freeze({
  /*
   * The Heartless Journal has 46 normal enemy entries in the mapping.
   *
   * Completion rule:
   * an enemy is complete once its defeat counter is greater than 0.
   *
   * Kill count is still kept separately as a statistic.
   */
  heartlessDefeated: {
    name: "Heartless Defeated",
    target: 46
  },

  journalCharacters: {
    name: "Journal Characters",
    target: 103
  },

  puppies: {
    name: "99 Puppies",
    target: 99
  },

  ansemReports: {
    name: "Ansem Reports",
    target: 13
  },

  summons: {
    name: "Summons",
    target: 6
  },

  trinities: {
    name: "Trinity Marks",
    target: 46
  },

  atlanticaClams: {
    name: "Atlantica Clams",
    target: 16
  },

  postcards: {
    name: "Postcards",
    target: 10
  },

  synthesis: {
    name: "Synthesis",
    target: 33
  },

  gummiBlueprints: {
    name: "Gummi Ship Blueprints",
    target: 48
  }
});

export {
  KH1_ARCHIVE,
  KH1_SAVE,
  KH1_RESEARCH_REGIONS,
  KH1_COMPLETION_DATABASE,
  KH1_JOURNAL_CHARACTER_STATES,
  KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS,
  KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS,
  KH1_ACRE_WOOD_MINIGAMES,
  KH1_KNOWN_CHESTS,
  KH1_OLYMPUS
};
