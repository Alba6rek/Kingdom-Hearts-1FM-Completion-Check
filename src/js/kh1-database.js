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

const KH1_ARCHIVE = {
  PNG_HEADER_LENGTH: 0x70,

  DIRECTORY_OFFSET,

  ENTRY_COUNT: 200,
  ENTRY_LENGTH: 0x158,
  ENTRY_STRIDE: 0x16C40,

  DATA_OFFSET,

  SAVE_LENGTH: 0x16C00,
  EXPECTED_FILE_SIZE: 0x11EB09D
};

const KH1_SAVE = {
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
   * Jiminy's Journal minigame records.
   *
   * Jungle Slider and Vine Jump store leaderboard times as unsigned
   * little-endian frame counts at 60 fps. Unused entries are 0xFFFFFFFF.
   *
   * Olympus Coliseum stores one time-trial record for each cup using the
   * same 60 fps frame-count format.
   */
  JUNGLE_SLIDER_RECORDS: 0x1728,
  JUNGLE_SLIDER_COURSE_COUNT: 5,
  JUNGLE_SLIDER_RECORDS_PER_COURSE: 5,
  JUNGLE_SLIDER_COURSE_STRIDE: 0x14,

  VINE_JUMP_RECORDS: 0x178C,
  VINE_JUMP_COURSE_COUNT: 4,
  VINE_JUMP_RECORDS_PER_COURSE: 5,
  VINE_JUMP_COURSE_STRIDE: 0x14,

  OLYMPUS_MINIGAME_RECORDS: 0x0F4C,
  OLYMPUS_MINIGAME_RECORD_COUNT: 4,

  /*
   * 100 Acre Wood minigame data discovered through controlled saves.
   */
  ACRE_WOOD_MINIGAME_FLAGS: 0x19D6,

  /*
   * Hundred Acre Wood personal-record structures.
   *
   * The first two were directly confirmed through controlled saves.
   * The remaining three follow the exact +0x14 record spacing and produce
   * plausible values in the known complete save:
   *
   *   0x1804 = 45 yards
   *   0x1818 = 2563 centiseconds = 25.63 seconds
   *   0x182C = 20974 centiseconds = 3:29.74
   */
  HUNNY_HUNT_SCORE: 0x17DC,
  BLOCK_TIGGER_SCORE: 0x17F0,
  POOH_SWING_SCORE: 0x1804,
  TIGGER_GIANT_POT_SCORE: 0x1818,
  POOH_MUDDY_PATH_SCORE: 0x182C,

  WORLD_PROGRESS: 0x1504,
  WORLD_PROGRESS_LENGTH: 12,

  /*
   * Olympus Coliseum controlled-test mappings.
   */
  OLYMPUS_STORY_PROGRESS: 0x1506,
  PHIL_TRAINING_FLAG: 0x0F05,

  EXTRA_TRAVERSE_TOWN_PROGRESS: 0x1512,

  /*
   * Darkside / Awakening completion.
   *
   * Controlled test supplied by the user:
   *   Slot 1 = immediately before Darkside -> 0x00
   *   Slot 2 = immediately after Darkside  -> 0x01
   *
   * The value also remains 0x01 in later populated saves.
   * This is used as the persistent "Darkside defeated" story-completion flag.
   */
  DARKSIDE_COMPLETION: 0x1514,

  /*
   * Controlled boss-completion flags / states.
   *
   * Cave of Wonders Guardian:
   *   Slot 15 before -> 0x1D71 = 0x00
   *   Slot 16 after  -> 0x1D71 = 0x40
   *
   * Lock, Shock, and Barrel:
   *   Slot 22 before -> 0x1DD3 = 0x00
   *   Slot 23 after  -> 0x1DD3 = 0x80
   *
   * Shark:
   *   Slot 19 before -> 0x20E1 = 0x0E
   *   Slot 20 after  -> 0x20E1 = 0x10
   *
   * The 100% Slot 1 save has 0x20E1 = 0x11, so bit 0x10 remains set.
   */
  CAVE_GUARDIAN_COMPLETION: 0x1D71,
  LOCK_SHOCK_BARREL_COMPLETION: 0x1DD3,
  SHARK_COMPLETION_STATE: 0x20E1,

  /*
   * Phantom's persistent completion byte.
   * Complete when >= 0x96.
   */
  PHANTOM_COMPLETION: 0x150D,

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
   *   0x08 = Hades Cup (confirmed)
   */
  OLYMPUS_CUP_COMPLETION_FLAGS: 0x16D0,

  TRINITY_UNLOCKS: 0x1C1B,

  MAGIC_LEVELS: 0x1C1E,
  MAGIC_LEVELS_LENGTH: 7,

  TRINITY_COUNTERS: 0x1C66,
  TRINITY_COUNTERS_LENGTH: 6,

  /*
   * Persistent per-mark Trinity state table discovered from the user's
   * natural save progression.
   *
   * In partial saves, the number of set bits here exactly equals the total
   * Trinity counters. The completed Slot 1 has 45 set bits while its color
   * counters total 46, indicating one exceptional/story-tracked Trinity.
   */
  TRINITY_MARK_FLAGS: 0x1C6C,
  TRINITY_MARK_FLAGS_LENGTH: 0x14,

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
};

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
const KH1_JOURNAL_CHARACTER_STATES = {
  "kairi": [
    { offset: 0x16E3, mask: 0x01 },
  ],
  "riku": [
    { offset: 0x16E3, mask: 0x04 },
  ],
  "sora": [
    { offset: 0x16E3, mask: 0x40 },
  ],
  "pluto": [
    { offset: 0x16E4, mask: 0x01 },
  ],
  "daisy-duck": [
    { offset: 0x16E4, mask: 0x02 },
  ],
  "minnie-mouse": [
    { offset: 0x16E4, mask: 0x04 },
  ],
  "goofy": [
    { offset: 0x16E4, mask: 0x08 },
  ],
  "donald-duck": [
    { offset: 0x16E4, mask: 0x20 },
  ],
  "mickey-mouse": [
    { offset: 0x16E4, mask: 0x80 },
  ],
  "pongo": [
    { offset: 0x16E5, mask: 0x01 },
  ],
  "fairy-godmother": [
    { offset: 0x16E5, mask: 0x02 },
  ],
  "merlin": [
    { offset: 0x16E5, mask: 0x04 },
  ],
  "louie": [
    { offset: 0x16E5, mask: 0x08 },
  ],
  "dewey": [
    { offset: 0x16E5, mask: 0x10 },
  ],
  "huey": [
    { offset: 0x16E5, mask: 0x20 },
  ],
  "dale": [
    { offset: 0x16E5, mask: 0x40 },
  ],
  "chip": [
    { offset: 0x16E5, mask: 0x80 },
  ],
  "ice-titan": [
    { offset: 0x16F7, mask: 0x02 },
  ],
  "sephiroth": [
    { offset: 0x16F7, mask: 0x04 },
  ],
  "unknown": [
    { offset: 0x16F8, mask: 0x40 },
  ],
  "perdita": [
    { globalBit: 7, offset: 0x16E6, mask: 0x80 },
  ],
  "99-puppies": [
    { globalBit: 6, offset: 0x16E6, mask: 0x40 },
  ],
  "brooms": [
    { globalBit: 5, offset: 0x16E6, mask: 0x20 },
  ],
  "leon": [
    { globalBit: 4, offset: 0x16E6, mask: 0x10 },
  ],
  "yuffie": [
    { globalBit: 3, offset: 0x16E6, mask: 0x08 },
  ],
  "aerith": [
    { globalBit: 2, offset: 0x16E6, mask: 0x04 },
  ],
  "cid": [
    { globalBit: 0, offset: 0x16E6, mask: 0x01 },
  ],
  "tidus": [
    { globalBit: 15, offset: 0x16E7, mask: 0x80 },
  ],
  "selphie": [
    { globalBit: 14, offset: 0x16E7, mask: 0x40 },
  ],
  "wakka": [
    { globalBit: 13, offset: 0x16E7, mask: 0x20 },
  ],
  "moogles": [
    { globalBit: 12, offset: 0x16E7, mask: 0x10 },
  ],
  "snow-white": [
    { globalBit: 10, offset: 0x16E7, mask: 0x04 },
  ],
  "cinderella": [
    { globalBit: 9, offset: 0x16E7, mask: 0x02 },
  ],
  "aurora": [
    { globalBit: 8, offset: 0x16E7, mask: 0x01 },
  ],
  "belle": [
    { globalBit: 23, offset: 0x16E8, mask: 0x80 },
  ],
  "beast": [
    { globalBit: 22, offset: 0x16E8, mask: 0x40 },
  ],
  "maleficent": [
    { globalBit: 19, offset: 0x16E8, mask: 0x08 },
    { globalBit: 20, offset: 0x16E8, mask: 0x10 },
    { globalBit: 21, offset: 0x16E8, mask: 0x20 },
  ],
  "dragon": [
    { globalBit: 18, offset: 0x16E8, mask: 0x04 },
  ],
  "ansem": [
    { globalBit: 11, offset: 0x16E7, mask: 0x08 },
    { globalBit: 17, offset: 0x16E8, mask: 0x02 },
  ],
  "cloud": [
    { globalBit: 1, offset: 0x16E6, mask: 0x02 },
  ],
  "mushu": [
    { globalBit: 30, offset: 0x16E9, mask: 0x40 },
  ],
  "simba": [
    { globalBit: 29, offset: 0x16E9, mask: 0x20 },
  ],
  "alice": [
    { globalBit: 27, offset: 0x16E9, mask: 0x08 },
    { globalBit: 28, offset: 0x16E9, mask: 0x10 },
  ],
  "queen-of-hearts": [
    { globalBit: 26, offset: 0x16E9, mask: 0x04 },
  ],
  "cards-hearts": [
    { globalBit: 25, offset: 0x16E9, mask: 0x02 },
  ],
  "cards-spades": [
    { globalBit: 24, offset: 0x16E9, mask: 0x01 },
  ],
  "white-rabbit": [
    { globalBit: 39, offset: 0x16EA, mask: 0x80 },
  ],
  "cheshire-cat": [
    { globalBit: 38, offset: 0x16EA, mask: 0x40 },
  ],
  "doorknob": [
    { globalBit: 37, offset: 0x16EA, mask: 0x20 },
  ],
  "philoctetes": [
    { globalBit: 35, offset: 0x16EA, mask: 0x08 },
  ],
  "tarzan": [
    { globalBit: 46, offset: 0x16EB, mask: 0x40 },
  ],
  "jane-porter": [
    { globalBit: 45, offset: 0x16EB, mask: 0x20 },
  ],
  "clayton": [
    { globalBit: 43, offset: 0x16EB, mask: 0x08 },
    { globalBit: 44, offset: 0x16EB, mask: 0x10 },
  ],
  "terk": [
    { globalBit: 42, offset: 0x16EB, mask: 0x04 },
  ],
  "kerchak": [
    { globalBit: 41, offset: 0x16EB, mask: 0x02 },
  ],
  "kala": [
    { globalBit: 40, offset: 0x16EB, mask: 0x01 },
  ],
  "sabor": [
    { globalBit: 55, offset: 0x16EC, mask: 0x80 },
  ],
  "aladdin": [
    { globalBit: 53, offset: 0x16EC, mask: 0x20 },
    { globalBit: 54, offset: 0x16EC, mask: 0x40 },
  ],
  "genie": [
    { globalBit: 51, offset: 0x16EC, mask: 0x08 },
    { globalBit: 52, offset: 0x16EC, mask: 0x10 },
  ],
  "jasmine": [
    { offset: 0x16F7, mask: 0x01 },
    { globalBit: 50, offset: 0x16EC, mask: 0x04 },
  ],
  "jafar": [
    { globalBit: 48, offset: 0x16EC, mask: 0x01 },
    { globalBit: 49, offset: 0x16EC, mask: 0x02 },
  ],
  "jafar-genie": [
    { globalBit: 63, offset: 0x16ED, mask: 0x80 },
  ],
  "abu": [
    { globalBit: 62, offset: 0x16ED, mask: 0x40 },
  ],
  "iago": [
    { globalBit: 61, offset: 0x16ED, mask: 0x20 },
  ],
  "carpet": [
    { globalBit: 60, offset: 0x16ED, mask: 0x10 },
  ],
  "pinocchio": [
    { globalBit: 58, offset: 0x16ED, mask: 0x04 },
    { globalBit: 59, offset: 0x16ED, mask: 0x08 },
  ],
  "geppetto": [
    { globalBit: 56, offset: 0x16ED, mask: 0x01 },
    { globalBit: 57, offset: 0x16ED, mask: 0x02 },
  ],
  "jiminy-cricket": [
    { globalBit: 71, offset: 0x16EE, mask: 0x80 },
  ],
  "ariel": [
    { globalBit: 69, offset: 0x16EE, mask: 0x20 },
    { globalBit: 70, offset: 0x16EE, mask: 0x40 },
  ],
  "king-triton": [
    { globalBit: 68, offset: 0x16EE, mask: 0x10 },
  ],
  "ursula": [
    { globalBit: 66, offset: 0x16EE, mask: 0x04 },
    { globalBit: 67, offset: 0x16EE, mask: 0x08 },
  ],
  "sebastian": [
    { globalBit: 65, offset: 0x16EE, mask: 0x02 },
  ],
  "flounder": [
    { globalBit: 64, offset: 0x16EE, mask: 0x01 },
  ],
  "jetsam": [
    { globalBit: 79, offset: 0x16EF, mask: 0x80 },
  ],
  "flotsam": [
    { globalBit: 78, offset: 0x16EF, mask: 0x40 },
  ],
  "jack-skellington": [
    { globalBit: 77, offset: 0x16EF, mask: 0x20 },
  ],
  "sally": [
    { globalBit: 76, offset: 0x16EF, mask: 0x10 },
  ],
  "oogie-boogie": [
    { globalBit: 74, offset: 0x16EF, mask: 0x04 },
    { globalBit: 75, offset: 0x16EF, mask: 0x08 },
  ],
  "dr-finkelstein": [
    { globalBit: 73, offset: 0x16EF, mask: 0x02 },
  ],
  "zero": [
    { globalBit: 72, offset: 0x16EF, mask: 0x01 },
  ],
  "lock": [
    { globalBit: 87, offset: 0x16F0, mask: 0x80 },
  ],
  "shock": [
    { globalBit: 86, offset: 0x16F0, mask: 0x40 },
  ],
  "barrel": [
    { globalBit: 85, offset: 0x16F0, mask: 0x20 },
  ],
  "the-mayor": [
    { globalBit: 84, offset: 0x16F0, mask: 0x10 },
  ],
  "peter-pan": [
    { globalBit: 83, offset: 0x16F0, mask: 0x08 },
  ],
  "tinker-bell": [
    { globalBit: 81, offset: 0x16F0, mask: 0x02 },
    { globalBit: 82, offset: 0x16F0, mask: 0x04 },
  ],
  "wendy": [
    { globalBit: 80, offset: 0x16F0, mask: 0x01 },
  ],
  "captain-hook": [
    { globalBit: 94, offset: 0x16F1, mask: 0x40 },
    { globalBit: 95, offset: 0x16F1, mask: 0x80 },
  ],
  "mr-smee": [
    { globalBit: 93, offset: 0x16F1, mask: 0x20 },
  ],
  "the-crocodile": [
    { globalBit: 92, offset: 0x16F1, mask: 0x10 },
  ],
  "dumbo": [
    { globalBit: 16, offset: 0x16E8, mask: 0x01 },
  ],
  "bambi": [
    { globalBit: 31, offset: 0x16E9, mask: 0x80 },
  ],
  "hercules": [
    { globalBit: 36, offset: 0x16EA, mask: 0x10 },
  ],
  "hades": [
    { globalBit: 33, offset: 0x16EA, mask: 0x02 },
    { globalBit: 34, offset: 0x16EA, mask: 0x04 },
  ],
  "cerberus": [
    { globalBit: 32, offset: 0x16EA, mask: 0x01 },
  ],
  "rock-titan": [
    { globalBit: 47, offset: 0x16EB, mask: 0x80 },
  ],
  "winnie-the-pooh": [
    { globalBit: 91, offset: 0x16F1, mask: 0x08 },
  ],
  "piglet": [
    { globalBit: 90, offset: 0x16F1, mask: 0x04 },
  ],
  "tigger": [
    { globalBit: 89, offset: 0x16F1, mask: 0x02 },
  ],
  "owl": [
    { globalBit: 88, offset: 0x16F1, mask: 0x01 },
  ],
  "rabbit": [
    { globalBit: 103, offset: 0x16F2, mask: 0x80 },
  ],
  "eeyore": [
    { globalBit: 102, offset: 0x16F2, mask: 0x40 },
  ],
  "roo": [
    { globalBit: 101, offset: 0x16F2, mask: 0x20 },
  ],
};

const KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS = [
  { globalBit: 96, offset: 0x16F2, mask: 0x01 },
  { globalBit: 97, offset: 0x16F2, mask: 0x02 },
  { globalBit: 98, offset: 0x16F2, mask: 0x04 },
  { globalBit: 99, offset: 0x16F2, mask: 0x08 },
  { globalBit: 100, offset: 0x16F2, mask: 0x10 }
];

/*
 * Tested Journal-related bits that produced no visible character entry.
 * They are intentionally ignored by Journal completion while remaining
 * available in the raw/research data.
 */
const KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS = [
  { offset: 0x16F7, mask: 0x08, label: "No visible character change" },
  { offset: 0x16F8, mask: 0x80, label: "No visible character change" }
];



/*
===============================================================================
MINIGAME COMPLETION / SCORE LOCATIONS
===============================================================================

The database contains binary rules only. Human-readable names and score units
live in kh1-dictionary.js.

Hundred Acre Wood:
- All five completion bits and their score fields are confirmed by testing.
- 0x20 Hunny Hunt, 0x10 Block Tigger, 0x08 Pooh's Swing,
  0x04 Tigger's Giant Pot, and 0x02 Pooh's Muddy Path.
*/
const KH1_MINIGAME_STATES = {
  jungleSlider: {
    type: "leaderboardCourses",
    baseOffset: 0x1728,
    courseCount: 5,
    recordsPerCourse: 5,
    courseStride: 0x14,
    recordStride: 4,
    scoreType: "frames60",
    evidence: "confirmed"
  },

  vineJump: {
    type: "leaderboardCourses",
    baseOffset: 0x178C,
    courseCount: 4,
    recordsPerCourse: 5,
    courseStride: 0x14,
    recordStride: 4,
    scoreType: "frames60",
    evidence: "confirmed"
  },

  poohHunnyHunt: {
    type: "bitScore",
    flagOffset: 0x19D6,
    mask: 0x20,
    scoreOffset: 0x17DC,
    scoreType: "integer",
    evidence: "confirmed"
  },

  blockTigger: {
    type: "bitScore",
    flagOffset: 0x19D6,
    mask: 0x10,
    scoreOffset: 0x17F0,
    scoreType: "integer",
    evidence: "confirmed"
  },

  poohSwing: {
    type: "bitScore",
    flagOffset: 0x19D6,
    mask: 0x08,
    scoreOffset: 0x1804,
    scoreType: "integer",
    evidence: "confirmed"
  },

  tiggerGiantPot: {
    type: "bitScore",
    flagOffset: 0x19D6,
    mask: 0x04,
    scoreOffset: 0x1818,
    scoreType: "centiseconds",
    evidence: "confirmed"
  },

  poohMuddyPath: {
    type: "bitScore",
    flagOffset: 0x19D6,
    mask: 0x02,
    scoreOffset: 0x182C,
    scoreType: "centiseconds",
    evidence: "confirmed"
  },

  olympusColiseum: {
    type: "recordSet",
    baseOffset: 0x0F4C,
    recordCount: 4,
    recordStride: 4,
    scoreType: "frames60",
    evidence: "confirmed"
  }
};

/*
===============================================================================
BOSS COMPLETION LOCATIONS / RULES
===============================================================================

This contains only technical completion rules.

worldProgress index order:
  0 Traverse Town
  1 Deep Jungle
  2 Olympus Coliseum
  3 Wonderland
  4 Agrabah
  5 Monstro
  6 Atlantica
  7 unused
  8 Halloween Town
  9 Neverland
 10 Hollow Bastion
 11 End of the World

Some rules are direct flags/reports. Others use the persistent story-progress
threshold reached immediately after a boss battle.

All boss entries currently exposed by the tracker have an accepted completion
rule. The final battle sequence uses the maximum saveable End of the World
state because KH1 cannot create a normal post-final-boss save.
*/
const KH1_BOSS_COMPLETION_STATES = {
  darkside: {
    type: "byteNonZero",
    offset: 0x1514,
    evidence: "confirmed"
  },

  guardArmor: {
    type: "worldProgress",
    index: 0,
    threshold: 0x31,
    evidence: "confirmed"
  },

  oppositeArmor: {
    type: "extraTraverseProgress",
    threshold: 0x14,
    evidence: "confirmed"
  },

  redArmor: {
    type: "bit",
    offset: 0x16F9,
    mask: 0x02,
    evidence: "confirmed"
  },

  trickmaster: {
    type: "worldProgress",
    index: 3,
    threshold: 0x2E,
    evidence: "confirmed"
  },

  /*
   * Project completion rule requested by the user:
   * count Cloud as defeated once the Preliminary Tournament is finished.
   *
   * Olympus progress >= 0x22 was directly confirmed by the controlled
   * Slot 55 -> 56 Preliminary Tournament test.
   */
  cloud: {
    type: "worldProgress",
    index: 2,
    threshold: 0x22,
    evidence: "confirmed"
  },

  cerberus: {
    type: "worldProgress",
    index: 2,
    threshold: 0x28,
    evidence: "confirmed"
  },

  hercules: {
    type: "olympusCup",
    mask: 0x04,
    evidence: "confirmed"
  },

  hades: {
    type: "report",
    report: 8,
    evidence: "direct defeat reward"
  },

  rockTitan: {
    type: "olympusCup",
    mask: 0x08,
    evidence: "confirmed"
  },

  iceTitan: {
    type: "byteNonZero",
    offset: 0x0F69,
    evidence: "confirmed"
  },

  sephiroth: {
    type: "byteNonZero",
    offset: 0x0F6A,
    evidence: "confirmed"
  },

  sabor: {
    type: "worldProgress",
    index: 1,
    threshold: 0x42,
    evidence: "confirmed"
  },

  clayton: {
    type: "worldProgress",
    index: 1,
    threshold: 0x56,
    evidence: "confirmed"
  },

  stealthSneak: {
    type: "worldProgress",
    index: 1,
    threshold: 0x56,
    evidence: "battle-clear proxy"
  },

  potCentipede: {
    type: "worldProgress",
    index: 4,
    threshold: 0x35,
    evidence: "confirmed"
  },

  /*
   * Controlled pair:
   *   Slot 15 before: 0x1D71 = 0x00, Agrabah progress 0x35
   *   Slot 16 after:  0x1D71 = 0x40, Agrabah progress 0x3F
   *
   * The direct bit is used rather than only relying on story progress.
   */
  caveGuardian: {
    type: "bit",
    offset: 0x1D71,
    mask: 0x40,
    evidence: "confirmed"
  },

  jafar: {
    type: "worldProgress",
    index: 4,
    threshold: 0x49,
    evidence: "confirmed"
  },

  genieJafar: {
    type: "worldProgress",
    index: 4,
    threshold: 0x5A,
    evidence: "confirmed"
  },

  kurtZisa: {
    type: "report",
    report: 11,
    evidence: "direct defeat reward"
  },

  parasiteCage1: {
    type: "worldProgress",
    index: 5,
    threshold: 0x2E,
    evidence: "confirmed"
  },

  parasiteCage2: {
    type: "worldProgress",
    index: 5,
    threshold: 0x46,
    evidence: "confirmed"
  },

  /*
   * Controlled pair:
   *   Slot 19 before: 0x20E1 = 0x0E
   *   Slot 20 after:  0x20E1 = 0x10
   *
   * Atlantica story progress stays 0x32 across this battle, so the normal
   * world-progress byte cannot detect the immediate Shark defeat.
   *
   * The controlled transition sets bit 0x10, and the user's known 100%
   * Slot 1 later contains 0x11 at this byte, preserving that bit.
   */
  shark: {
    type: "bit",
    offset: 0x20E1,
    mask: 0x10,
    evidence: "confirmed"
  },

  ursula1: {
    type: "worldProgress",
    index: 6,
    threshold: 0x53,
    evidence: "confirmed"
  },

  ursulaFinal: {
    type: "worldProgress",
    index: 6,
    threshold: 0x5D,
    evidence: "confirmed"
  },

  /*
   * Controlled pair:
   *   Slot 22 before: 0x1DD3 = 0x00, Halloween progress 0x46
   *   Slot 23 after:  0x1DD3 = 0x80, Halloween progress 0x53
   *
   * The direct event bit is used for the defeated state.
   */
  lockShockBarrel: {
    type: "bit",
    offset: 0x1DD3,
    mask: 0x80,
    evidence: "confirmed"
  },

  oogieBoogie: {
    type: "worldProgress",
    index: 8,
    threshold: 0x62,
    evidence: "confirmed"
  },

  oogieManor: {
    type: "worldProgress",
    index: 8,
    threshold: 0x6A,
    evidence: "confirmed"
  },

  antiSora: {
    type: "worldProgress",
    index: 9,
    threshold: 0x35,
    evidence: "confirmed"
  },

  captainHook: {
    type: "report",
    report: 9,
    evidence: "direct defeat reward"
  },

  phantom: {
    type: "byteAtLeast",
    offset: 0x150D,
    threshold: 0x96,
    evidence: "confirmed external save mapping"
  },

  riku: {
    type: "worldProgress",
    index: 10,
    threshold: 0x32,
    evidence: "confirmed"
  },

  maleficent: {
    type: "worldProgress",
    index: 10,
    threshold: 0x5A,
    evidence: "confirmed"
  },

  dragonMaleficent: {
    type: "worldProgress",
    index: 10,
    threshold: 0x6E,
    evidence: "confirmed"
  },

  rikuAnsem: {
    type: "worldProgress",
    index: 10,
    threshold: 0x82,
    evidence: "confirmed"
  },

  behemoth: {
    type: "worldProgress",
    index: 10,
    threshold: 0xB9,
    evidence: "confirmed"
  },

  unknown: {
    type: "report",
    report: 13,
    evidence: "direct defeat reward"
  },

  chernabog: {
    type: "worldProgress",
    index: 11,
    threshold: 0x33,
    evidence: "confirmed"
  },

  /*
   * Final battle sequence special case.
   *
   * This intentionally follows the same completion policy used by the
   * End of the World world-progress entry. KH1 does not create a normal
   * post-final-boss clear save, so progress >= 0x33 is the maximum
   * persistent/saveable completion state.
   *
   * These entries are therefore considered complete for the tracker at the
   * maximum saveable End of the World state, while the UI clearly labels
   * them as "Complete (max saveable progress)" rather than claiming that a
   * post-battle defeated flag exists.
   */
  ansem: {
    type: "worldProgress",
    index: 11,
    threshold: 0x33,
    evidence: "max saveable progress",
    maxSaveable: true
  },

  darksideFinal: {
    type: "worldProgress",
    index: 11,
    threshold: 0x33,
    evidence: "max saveable progress",
    maxSaveable: true
  },

  worldOfChaos: {
    type: "worldProgress",
    index: 11,
    threshold: 0x33,
    evidence: "max saveable progress",
    maxSaveable: true
  }
};

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
const KH1_KNOWN_CHESTS = {
  watergleam: {
    name: "Watergleam Chest",
    offset: 0x0740,
    mask: 0x02,
    confidence: "confirmed"
  }
};


/*
===============================================================================
OLYMPUS COLISEUM COMPLETION MAPPINGS
===============================================================================
*/
const KH1_OLYMPUS = {
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
      confidence: "confirmed"
    }
  }
};

const KH1_RESEARCH_REGIONS = {
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
    confidence: "complete Journal character mapping; Unknown is valid and no-visible bits are intentionally ignored for completion"
  },

  acreWoodMinigameFlags: {
    offset: 0x19D6,
    length: 1,
    label: "100 Acre Wood Minigame Completion Flags",
    confidence: "all five 100 Acre Wood completion bits confirmed; complete save = 0x3E"
  },

  acreWoodMinigameScores: {
    offset: 0x17DC,
    length: 0x18,
    label: "100 Acre Wood Minigame Score Area",
    confidence: "all five 100 Acre Wood score fields confirmed"
  },

  darksideCompletion: {
    offset: 0x1514,
    length: 1,
    label: "Darkside / Awakening Completion",
    confidence: "controlled before/after test: Slot 1 0x00 -> Slot 2 0x01"
  },

  caveGuardianCompletion: {
    offset: 0x1D71,
    length: 1,
    label: "Cave of Wonders Guardian Completion",
    confidence: "controlled before/after test: Slot 15 0x00 -> Slot 16 0x40"
  },

  lockShockBarrelCompletion: {
    offset: 0x1DD3,
    length: 1,
    label: "Lock, Shock, and Barrel Completion",
    confidence: "controlled before/after test: Slot 22 0x00 -> Slot 23 0x80"
  },

  sharkCompletionState: {
    offset: 0x20E1,
    length: 1,
    label: "Shark Completion State",
    confidence: "controlled before/after test: Slot 19 0x0E -> Slot 20 0x10; known 100% Slot 1 = 0x11"
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
    confidence: "Journal character mapping completed"
  },

  olympusCupCompletion: {
    offset: 0x16D0,
    length: 1,
    label: "Olympus Cup Completion Bitfield",
    confidence: "all four normal cup completion bits confirmed"
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
    confidence: "48-byte ownership array confirmed; 48-entry PC name order accepted after user one-hot spot-checks matched expected blueprints"
  }
};


/*
 * Exact per-Trinity mappings from the user's controlled save tests.
 *
 * All 46 physical Trinity locations are now independently mapped.
 * 45 use the normal persistent mark table at 0x1C6C..0x1C7F.
 * Yellow Trinity #2 (test #34, Olympus Coliseum Lobby) is the one
 * exceptional Trinity and uses 0x1E10 bit 0x01 instead.
 *
 * This is intentionally a plain data object, matching the project's data-driven style. The decoder owns the logic; the database only
 * describes where each Trinity state is stored.
 */
const KH1_TRINITY_MARK_STATES = {
  1: { offset: 0x1C6C, mask: 0x40, status: "confirmed" },
  2: { offset: 0x1C6C, mask: 0x20, status: "confirmed" },
  3: { offset: 0x1C6C, mask: 0x08, status: "confirmed" },
  4: { offset: 0x1C6C, mask: 0x04, status: "confirmed" },
  5: { offset: 0x1C6E, mask: 0x20, status: "confirmed" },
  6: { offset: 0x1C6E, mask: 0x40, status: "confirmed" },
  7: { offset: 0x1C70, mask: 0x40, status: "confirmed" },
  8: { offset: 0x1C70, mask: 0x20, status: "confirmed" },
  9: { offset: 0x1C72, mask: 0x20, status: "confirmed" },
  10: { offset: 0x1C72, mask: 0x10, status: "confirmed" },
  11: { offset: 0x1C74, mask: 0x40, status: "confirmed" },
  12: { offset: 0x1C74, mask: 0x04, status: "confirmed" },
  13: { offset: 0x1C76, mask: 0x20, status: "confirmed" },
  14: { offset: 0x1C76, mask: 0x08, status: "confirmed" },
  15: { offset: 0x1C76, mask: 0x10, status: "confirmed" },
  16: { offset: 0x1C7B, mask: 0x20, status: "confirmed" },
  17: { offset: 0x1C7B, mask: 0x40, status: "confirmed" },
  18: { offset: 0x1C6C, mask: 0x10, status: "confirmed" },
  19: { offset: 0x1C6D, mask: 0x80, status: "confirmed" },
  20: { offset: 0x1C6C, mask: 0x01, status: "confirmed" },
  21: { offset: 0x1C74, mask: 0x08, status: "confirmed" },
  22: { offset: 0x1C78, mask: 0x40, status: "confirmed" },
  23: { offset: 0x1C7C, mask: 0x80, status: "confirmed" },
  24: { offset: 0x1C6C, mask: 0x02, status: "confirmed" },
  25: { offset: 0x1C6E, mask: 0x08, status: "confirmed" },
  26: { offset: 0x1C6E, mask: 0x10, status: "confirmed" },
  27: { offset: 0x1C70, mask: 0x08, status: "confirmed" },
  28: { offset: 0x1C72, mask: 0x08, status: "confirmed" },
  29: { offset: 0x1C74, mask: 0x20, status: "confirmed" },
  30: { offset: 0x1C76, mask: 0x40, status: "confirmed" },
  31: { offset: 0x1C7A, mask: 0x01, status: "confirmed" },
  32: { offset: 0x1C7C, mask: 0x40, status: "confirmed" },
  33: { offset: 0x1C6D, mask: 0x40, status: "confirmed" },

  // Yellow Trinity #2 is the exceptional 46th Trinity. It does not set a
  // bit in the normal 0x1C6C..0x1C7F mark table. Controlled Slot 85 -> 86
  // testing shows its persistent state at 0x1E10 bit 0x01.
  34: { offset: 0x1E10, mask: 0x01, status: "confirmed", source: "exceptional-action-state" },

  35: { offset: 0x1C74, mask: 0x10, status: "confirmed" },
  36: { offset: 0x1C7A, mask: 0x02, status: "confirmed" },
  37: { offset: 0x1C6C, mask: 0x80, status: "confirmed" },
  38: { offset: 0x1C6E, mask: 0x80, status: "confirmed" },
  39: { offset: 0x1C70, mask: 0x04, status: "confirmed" },
  40: { offset: 0x1C72, mask: 0x80, status: "confirmed" },
  41: { offset: 0x1C74, mask: 0x80, status: "confirmed" },
  42: { offset: 0x1C76, mask: 0x80, status: "confirmed" },
  43: { offset: 0x1C7F, mask: 0x80, status: "confirmed" },
  44: { offset: 0x1C78, mask: 0x80, status: "confirmed" },
  45: { offset: 0x1C7A, mask: 0x80, status: "confirmed" },
  46: { offset: 0x1C7B, mask: 0x80, status: "confirmed" }
};

const KH1_COMPLETION_DATABASE = {
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
  },

  bosses: {
    name: "Bosses",
    target: 41
  },

  minigames: {
    name: "Journal Mini Games",
    target: 8
  }
};

export {
  KH1_ARCHIVE,
  KH1_SAVE,
  KH1_RESEARCH_REGIONS,
  KH1_COMPLETION_DATABASE,
  KH1_JOURNAL_CHARACTER_STATES,
  KH1_JOURNAL_NO_VISIBLE_CHANGE_BITS,
  KH1_JOURNAL_POST_REGION_NO_VISIBLE_BITS,
  KH1_MINIGAME_STATES,
  KH1_BOSS_COMPLETION_STATES,
  KH1_KNOWN_CHESTS,
  KH1_OLYMPUS,
  KH1_TRINITY_MARK_STATES
};
