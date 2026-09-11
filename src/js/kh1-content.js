/*
===============================================================================
KINGDOM HEARTS FINAL MIX - INTERFACE CONTENT METADATA
===============================================================================

This file contains the lists that are DISPLAYED by the completion analyzer.

It answers questions such as:

    - Which Keyblades should be listed?
    - In what order should they be shown?
    - Which characters belong under each world?
    - Which bosses/minigames/synthesis items should appear?
    - What hint should be displayed?
    - Which external URL should open when the user clicks an entry?

IMPORTANT
---------
This is intentionally separate from:

    kh1-database.js
        WHERE binary data is stored.

    kh1-dictionary.js
        WHAT numeric IDs mean.

    kh1-functions.js
        HOW binary data is decoded.

Many fields below contain:

    hint: ""
    url: ""

You can fill them later without touching the save parser.

When a Journal character has no custom URL override, the shared KHGuides
Journal URL is used. Other sections may define their own category URL.
*/

const KH1_CONTENT = Object.freeze({
  TABS: [
    {
      id: "main",
      name: "Main"
    },
    {
      id: "essentials",
      name: "Essentials"
    },
    {
      id: "journal",
      name: "Journal"
    },
    {
      id: "synthesis",
      name: "Synthesis"
    },
    {
      id: "collectable",
      name: "Collectable"
    },
    {
      id: "extra",
      name: "Extra"
    }
  ],

  /*
   * Sora weapons.
   *
   * Ownership is checked from:
   *   1. the 256-byte inventory table
   *   2. Sora's currently equipped weapon
   */
  KEYBLADES: [
    { itemId: 81,  name: "Kingdom Key",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#kingdom-key" },
    { itemId: 86,  name: "Jungle King",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#jungle-king" },
    { itemId: 87,  name: "Three Wishes",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#three-wishes" },
    { itemId: 88,  name: "Fairy Harp",        hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#fairy-harp" },
    { itemId: 89,  name: "Pumpkinhead",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#pumpkinhead" },
    { itemId: 90,  name: "Crabclaw",          hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#crabclaw" },
    { itemId: 91,  name: "Divine Rose",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#divine-rose" },
    { itemId: 92,  name: "Spellbinder",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#spellbinder" },
    { itemId: 93,  name: "Olympia",           hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#olympia" },
    { itemId: 94,  name: "Lionheart",         hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#lionheart" },
    { itemId: 95,  name: "Metal Chocobo",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#metal-chocobo" },
    { itemId: 96,  name: "Oathkeeper",        hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#oathkeeper" },
    { itemId: 97,  name: "Oblivion",          hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#oblivion" },
    { itemId: 98,  name: "Lady Luck",         hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#lady-luck" },
    { itemId: 99,  name: "Wishing Star",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#wishing-star" },
    { itemId: 100, name: "Ultima Weapon",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#ultima-weapon" },
    { itemId: 101, name: "Diamond Dust",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#diamond-dust" },
    { itemId: 102, name: "One-Winged Angel",  hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#one-winged-angel" }
  ],

  /*
   * Donald's staves.
   */
  STAVES: [
    { itemId: 103, name: "Mage's Staff",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#mages-staff" },
    { itemId: 104, name: "Morning Star",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#morning-star" },
    { itemId: 105, name: "Shooting Star",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#shooting-star" },
    { itemId: 106, name: "Magus Staff",        hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#magus-staff" },
    { itemId: 107, name: "Wisdom Staff",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#wisdom-staff" },
    { itemId: 108, name: "Warhammer",          hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#warhammer" },
    { itemId: 109, name: "Silver Mallet",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#silver-mallet" },
    { itemId: 110, name: "Grand Mallet",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#grand-mallet" },
    { itemId: 111, name: "Lord Fortune",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#lord-fortune" },
    { itemId: 112, name: "Violetta",           hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#violetta" },
    { itemId: 113, name: "Dream Rod",          hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#dream-rod" },
    { itemId: 114, name: "Save the Queen",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#save-the-queen" },
    { itemId: 115, name: "Wizard's Relic",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#wizards-relic" },
    { itemId: 116, name: "Meteor Strike",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#meteor-strike" },
    { itemId: 117, name: "Fantasista",         hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#fantasista" }
  ],

  /*
   * Goofy's shields.
   */
  SHIELDS: [
    { itemId: 119, name: "Knight's Shield",    hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#knights-shield" },
    { itemId: 120, name: "Mythril Shield",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#mythril-shield" },
    { itemId: 121, name: "Onyx Shield",        hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#onyx-shield" },
    { itemId: 122, name: "Stout Shield",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#stout-shield" },
    { itemId: 123, name: "Golem Shield",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#golem-shield" },
    { itemId: 124, name: "Adamant Shield",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#adamant-shield" },
    { itemId: 125, name: "Smasher",            hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#smasher" },
    { itemId: 126, name: "Gigas Fist",         hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#gigas-fist" },
    { itemId: 127, name: "Genji Shield",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#genji-shield" },
    { itemId: 128, name: "Herc's Shield",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#hercs-shield" },
    { itemId: 129, name: "Dream Shield",       hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#dream-shield" },
    { itemId: 130, name: "Save the King",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#save-the-king" },
    { itemId: 131, name: "Defender",           hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#defender" },
    { itemId: 132, name: "Mighty Shield",      hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#mighty-shield" },
    { itemId: 133, name: "Seven Elements",     hint: "", url: "https://www.khguides.com/kh/inventory/weapons/#seven-elements" }
  ],

  /*
   * The save currently gives the magic level as:
   *
   *   0 = unavailable
   *   1 = base spell
   *   2 = second tier
   *   3 = third tier
   *
   * upgradeHints is deliberately left editable.
   * When you verify where a specific upgrade comes from, write it here.
   *
   * Example:
   *
   * upgradeHints: [
   *   "First Fire source",
   *   "Fira source",
   *   "Firaga source"
   * ]
   */
  MAGIC: [
    {
      name: "Fire",
      tiers: ["Not Obtained", "Fire", "Fira", "Firaga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#fire"
    },
    {
      name: "Blizzard",
      tiers: ["Not Obtained", "Blizzard", "Blizzara", "Blizzaga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#blizzard"
    },
    {
      name: "Thunder",
      tiers: ["Not Obtained", "Thunder", "Thundara", "Thundaga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#thunder"
    },
    {
      name: "Cure",
      tiers: ["Not Obtained", "Cure", "Cura", "Curaga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#cure"
    },
    {
      name: "Gravity",
      tiers: ["Not Obtained", "Gravity", "Gravira", "Graviga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#gravity"
    },
    {
      name: "Stop",
      tiers: ["Not Obtained", "Stop", "Stopra", "Stopga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#stop"
    },
    {
      name: "Aero",
      tiers: ["Not Obtained", "Aero", "Aerora", "Aeroga"],
      upgradeHints: ["", "", ""],
      hint: "",
      url: "https://www.khguides.com/kh/combat/magic/#aero"
    }
  ],

  SUMMONS: [
    { name: "Simba",        hint: "", url: "https://www.khguides.com/kh/combat/summons/#simba" },
    { name: "Genie",        hint: "", url: "https://www.khguides.com/kh/combat/summons/#genie" },
    { name: "Dumbo",        hint: "", url: "https://www.khguides.com/kh/combat/summons/#dumbo" },
    { name: "Tinker Bell",  hint: "", url: "https://www.khguides.com/kh/combat/summons/#tinker-bell" },
    { name: "Bambi",        hint: "", url: "https://www.khguides.com/kh/combat/summons/#bambi" },
    { name: "Mushu",        hint: "", url: "https://www.khguides.com/kh/combat/summons/#mushu" }
  ],


  /*
   * -------------------------------------------------------------------------
   * GRANULAR ESSENTIALS LISTS
   * -------------------------------------------------------------------------
   *
   * These lists control the individual rows shown in the Essentials tab.
   *
   * You can rename an entry later, add a location hint, or replace its URL
   * without touching the binary parser.
   *
   * POSTCARDS
   * ---------
   * The save currently gives us the NUMBER OF POSTCARDS MAILED, not a unique
   * identity for ten different physical postcard items.
   *
   * Therefore "Postcard Mail #1" means the first mailed-count/reward step,
   * "Postcard Mail #2" means the second, etc.
   */
  POSTCARDS: [
    { sequence: 1, name: "Postcard Mail #1", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 2, name: "Postcard Mail #2", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 3, name: "Postcard Mail #3", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 4, name: "Postcard Mail #4", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 5, name: "Postcard Mail #5", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 6, name: "Postcard Mail #6", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 7, name: "Postcard Mail #7", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 8, name: "Postcard Mail #8", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 9, name: "Postcard Mail #9", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" },
    { sequence: 10, name: "Postcard Mail #10", hint: "", url: "https://www.khguides.com/kh/side-quests/postcards/" }
  ],

  /*
   * TRINITY MARKS
   * -------------
   * The currently decoded save data gives a FOUND COUNT for each Trinity
   * color, but we have not yet mapped a unique persistent flag for every
   * physical Trinity location.
   *
   * These numbered marks are therefore COUNT-BASED progress rows.
   *
   * Example:
   *   Blue count = 5
   *   Blue Trinity #1..#5  -> Found
   *   Blue Trinity #6..#17 -> Not Found
   *
   * This does NOT yet tell us exactly WHICH five world locations were used.
   * When the individual location flags are reverse engineered, these rows can
   * be renamed to their real locations and connected to the true flags.
   */
  TRINITY_MARKS: [
    {
      color: "Blue",
      marks: [
        { number: 1, name: "Blue Trinity #1", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 2, name: "Blue Trinity #2", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 3, name: "Blue Trinity #3", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 4, name: "Blue Trinity #4", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 5, name: "Blue Trinity #5", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 6, name: "Blue Trinity #6", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 7, name: "Blue Trinity #7", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 8, name: "Blue Trinity #8", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 9, name: "Blue Trinity #9", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 10, name: "Blue Trinity #10", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 11, name: "Blue Trinity #11", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 12, name: "Blue Trinity #12", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 13, name: "Blue Trinity #13", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 14, name: "Blue Trinity #14", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 15, name: "Blue Trinity #15", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 16, name: "Blue Trinity #16", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 17, name: "Blue Trinity #17", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" }
      ]
    },
    {
      color: "Red",
      marks: [
        { number: 1, name: "Red Trinity #1", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 2, name: "Red Trinity #2", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 3, name: "Red Trinity #3", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 4, name: "Red Trinity #4", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 5, name: "Red Trinity #5", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 6, name: "Red Trinity #6", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" }
      ]
    },
    {
      color: "Green",
      marks: [
        { number: 1, name: "Green Trinity #1", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 2, name: "Green Trinity #2", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 3, name: "Green Trinity #3", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 4, name: "Green Trinity #4", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 5, name: "Green Trinity #5", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 6, name: "Green Trinity #6", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 7, name: "Green Trinity #7", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 8, name: "Green Trinity #8", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 9, name: "Green Trinity #9", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" }
      ]
    },
    {
      color: "Yellow",
      marks: [
        { number: 1, name: "Yellow Trinity #1", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 2, name: "Yellow Trinity #2", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 3, name: "Yellow Trinity #3", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 4, name: "Yellow Trinity #4", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" }
      ]
    },
    {
      color: "White",
      marks: [
        { number: 1, name: "White Trinity #1", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 2, name: "White Trinity #2", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 3, name: "White Trinity #3", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 4, name: "White Trinity #4", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 5, name: "White Trinity #5", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 6, name: "White Trinity #6", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 7, name: "White Trinity #7", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 8, name: "White Trinity #8", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 9, name: "White Trinity #9", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" },
        { number: 10, name: "White Trinity #10", hint: "", url: "https://www.khguides.com/kh/collectibles/trinities/" }
      ]
    }
  ],

  /*
   * ATLANTICA CLAMS
   * ---------------
   * Unlike Trinity, Atlantica currently has 16 individual flag bits.
   *
   * flagIndex 0..15 maps directly to the LSB-first two-byte bitfield starting
   * at save offset 0x1DA9.
   *
   * Names/hints are intentionally generic until the exact in-world location
   * of every flag is named.
   */
  ATLANTICA_CLAMS: [
    { flagIndex: 0, name: "Atlantica Clam #1", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 1, name: "Atlantica Clam #2", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 2, name: "Atlantica Clam #3", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 3, name: "Atlantica Clam #4", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 4, name: "Atlantica Clam #5", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 5, name: "Atlantica Clam #6", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 6, name: "Atlantica Clam #7", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 7, name: "Atlantica Clam #8", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 8, name: "Atlantica Clam #9", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 9, name: "Atlantica Clam #10", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 10, name: "Atlantica Clam #11", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 11, name: "Atlantica Clam #12", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 12, name: "Atlantica Clam #13", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 13, name: "Atlantica Clam #14", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 14, name: "Atlantica Clam #15", hint: "", url: "https://www.khguides.com/kh/atlantica/" },
    { flagIndex: 15, name: "Atlantica Clam #16", hint: "", url: "https://www.khguides.com/kh/atlantica/" }
  ],

  /*
   * We currently have four raw Coliseum bytes at 0x1E00-0x1E03.
   * They should NOT be treated as "finished" until their exact semantics
   * are verified.
   *
   * completionSource is used only when we have a currently decoded,
   * persistent completion source.
   */
  COLISEUM: [
    {
      name: "Phil's Training",
      unlockIndex: null,
      completionSource: {
        type: "olympusMilestone",
        key: "philTraining"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/"
    },
    {
      name: "Preliminary Tournament",
      unlockIndex: null,
      completionSource: {
        type: "olympusMilestone",
        key: "preliminaryTournament"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/"
    },
    {
      name: "Phil Cup",
      unlockIndex: 0,
      completionSource: {
        type: "olympusCup",
        key: "philCup"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/#phil-cup"
    },
    {
      name: "Pegasus Cup",
      unlockIndex: 1,
      completionSource: {
        type: "olympusCup",
        key: "pegasusCup"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/#pegasus-cup"
    },
    {
      name: "Hercules Cup",
      unlockIndex: 2,
      completionSource: {
        type: "olympusCup",
        key: "herculesCup"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/#hercules-cup"
    },
    {
      name: "Hades Cup",
      unlockIndex: 3,
      completionSource: {
        type: "olympusCup",
        key: "hadesCup"
      },
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/#hades-cup"
    },
    {
      name: "Gold Match",
      unlockIndex: null,
      completionSource: {
        type: "completionBoolean",
        key: "iceTitanDefeated"
      },
      hint: "",
      url: "https://www.khguides.com/kh/combat/bosses/ice-titan/"
    },
    {
      name: "Platinum Match",
      unlockIndex: null,
      completionSource: {
        type: "completionBoolean",
        key: "sephirothDefeated"
      },
      hint: "",
      url: "https://www.khguides.com/kh/combat/bosses/sephiroth/"
    }
  ],

  /*
   * Character Journal list.
   *
   * The complete one-bit + missing-20 + focused Jasmine experiments now
   * identify all 103 expected character entries.
   *
   * Jasmine:
   *   base entry = 0x16F7 / 0x01
   *   update     = 0x16EC / 0x04
   */
  JOURNAL_CHARACTER_URL: "https://www.khguides.com/kh/inventory/journal/",

  /*
   * Optional per-character UI overrides.
   *
   * Add only characters that need a custom hint or URL. Names do not
   * belong here; they are resolved from kh1-dictionary.js.
   */
  JOURNAL_CHARACTER_OVERRIDES: {},

  /*
   * Journal UI grouping/order only.
   *
   * Binary locations -> kh1-database.js
   * Character names  -> kh1-dictionary.js
   */
  JOURNAL_CHARACTERS: [
    {
      world: "Destiny Islands",
      characters: [
        "sora",
        "riku",
        "kairi",
        "tidus",
        "selphie",
        "wakka",
      ]
    },
    {
      world: "Disney Castle / Main Cast",
      characters: [
        "mickey-mouse",
        "donald-duck",
        "goofy",
        "minnie-mouse",
        "daisy-duck",
        "pluto",
        "chip",
        "dale",
        "huey",
        "dewey",
        "louie",
        "brooms",
      ]
    },
    {
      world: "Traverse Town",
      characters: [
        "merlin",
        "fairy-godmother",
        "pongo",
        "perdita",
        "99-puppies",
        "leon",
        "yuffie",
        "aerith",
        "cid",
        "moogles",
      ]
    },
    {
      world: "Princesses / Hollow Bastion",
      characters: [
        "snow-white",
        "cinderella",
        "aurora",
        "belle",
        "beast",
        "maleficent",
        "dragon",
        "ansem",
        "unknown",
      ]
    },
    {
      world: "Olympus Coliseum",
      characters: [
        "cloud",
        "sephiroth",
        "philoctetes",
        "hercules",
        "hades",
        "cerberus",
        "rock-titan",
        "ice-titan",
      ]
    },
    {
      world: "Summons / Other",
      characters: [
        "dumbo",
        "bambi",
        "mushu",
        "simba",
      ]
    },
    {
      world: "Wonderland",
      characters: [
        "alice",
        "queen-of-hearts",
        "cards-hearts",
        "cards-spades",
        "white-rabbit",
        "cheshire-cat",
        "doorknob",
      ]
    },
    {
      world: "Deep Jungle",
      characters: [
        "tarzan",
        "jane-porter",
        "clayton",
        "terk",
        "kerchak",
        "kala",
        "sabor",
      ]
    },
    {
      world: "Agrabah",
      characters: [
        "aladdin",
        "genie",
        "jasmine",
        "jafar",
        "jafar-genie",
        "abu",
        "iago",
        "carpet",
      ]
    },
    {
      world: "Monstro",
      characters: [
        "pinocchio",
        "geppetto",
        "jiminy-cricket",
      ]
    },
    {
      world: "Atlantica",
      characters: [
        "ariel",
        "king-triton",
        "ursula",
        "sebastian",
        "flounder",
        "jetsam",
        "flotsam",
      ]
    },
    {
      world: "Halloween Town",
      characters: [
        "jack-skellington",
        "sally",
        "oogie-boogie",
        "dr-finkelstein",
        "zero",
        "lock",
        "shock",
        "barrel",
        "the-mayor",
      ]
    },
    {
      world: "Neverland",
      characters: [
        "peter-pan",
        "tinker-bell",
        "wendy",
        "captain-hook",
        "mr-smee",
        "the-crocodile",
      ]
    },
    {
      world: "100 Acre Wood",
      characters: [
        "winnie-the-pooh",
        "piglet",
        "tigger",
        "owl",
        "rabbit",
        "eeyore",
        "roo",
      ]
    },
  ],

  /*
   * Boss list.
   *
   * Add/replace completionSource as you identify persistent boss flags.
   *
   * Known direct mappings currently used:
   *   Ice Titan  -> completion.iceTitanDefeated
   *   Sephiroth -> completion.sephirothDefeated
   *   Red Armor -> completion.redArmorJournal
   */
  BOSSES: [
    { world: "Dive to the Heart", name: "Darkside", completionSource: null, hint: "", url: "https://www.khguides.com/kh/awakening/#darkside" },

    { world: "Traverse Town", name: "Guard Armor",    completionSource: null, hint: "", url: "https://www.khguides.com/kh/traverse-town/#guard-armor" },
    { world: "Traverse Town", name: "Opposite Armor", completionSource: null, hint: "", url: "https://www.khguides.com/kh/traverse-town/#opposite-armor" },
    {
      world: "Traverse Town",
      name: "Red Armor",
      completionSource: {
        type: "completionBoolean",
        key: "redArmorJournal"
      },
      hint: "",
      url: "https://www.khguides.com/kh/combat/bosses/"
    },

    { world: "Wonderland", name: "Trickmaster", completionSource: null, hint: "", url: "https://www.khguides.com/kh/wonderland/#trickmaster" },

    { world: "Olympus Coliseum", name: "Cloud",       completionSource: null, hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#cloud" },
    { world: "Olympus Coliseum", name: "Cerberus",    completionSource: { type: "journalCharacter", key: "cerberus" }, hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#cerberus" },
    { world: "Olympus Coliseum", name: "Hercules",    completionSource: null, hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#hercules" },
    { world: "Olympus Coliseum", name: "Hades",       completionSource: null, hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#hades" },
    { world: "Olympus Coliseum", name: "Rock Titan",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#rock-titan" },
    {
      world: "Olympus Coliseum",
      name: "Ice Titan",
      completionSource: {
        type: "completionBoolean",
        key: "iceTitanDefeated"
      },
      hint: "",
      url: "https://www.khguides.com/kh/combat/bosses/ice-titan/"
    },
    {
      world: "Olympus Coliseum",
      name: "Sephiroth",
      completionSource: {
        type: "completionBoolean",
        key: "sephirothDefeated"
      },
      hint: "",
      url: "https://www.khguides.com/kh/combat/bosses/sephiroth/"
    },

    { world: "Deep Jungle", name: "Sabor",         completionSource: null, hint: "", url: "https://www.khguides.com/kh/deep-jungle/#sabor" },
    { world: "Deep Jungle", name: "Clayton",       completionSource: null, hint: "", url: "https://www.khguides.com/kh/deep-jungle/#stealth-sneak" },
    { world: "Deep Jungle", name: "Stealth Sneak", completionSource: null, hint: "", url: "https://www.khguides.com/kh/deep-jungle/#stealth-sneak" },
    { world: "Deep Jungle", name: "Sneak Army",    completionSource: null, hint: "", url: "https://www.khguides.com/kh/combat/bosses/" },

    { world: "Agrabah", name: "Pot Centipede",             completionSource: null, hint: "", url: "https://www.khguides.com/kh/agrabah/#pot-centipede" },
    { world: "Agrabah", name: "Cave of Wonders Guardian",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/agrabah/#cave-of-wonders" },
    { world: "Agrabah", name: "Jafar",                     completionSource: null, hint: "", url: "https://www.khguides.com/kh/agrabah/#jafar" },
    { world: "Agrabah", name: "Genie Jafar",               completionSource: null, hint: "", url: "https://www.khguides.com/kh/agrabah/#jafar-genie" },
    { world: "Agrabah", name: "Kurt Zisa",                 completionSource: null, hint: "", url: "https://www.khguides.com/kh/combat/bosses/kurt-zisa/" },

    { world: "Monstro", name: "Parasite Cage - First Battle",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/monstro/#parasite-cage" },
    { world: "Monstro", name: "Parasite Cage - Second Battle", completionSource: null, hint: "", url: "https://www.khguides.com/kh/monstro/#parasite-cage2" },

    { world: "Atlantica", name: "The Shark",       completionSource: null, hint: "", url: "https://www.khguides.com/kh/atlantica/#shark" },
    { world: "Atlantica", name: "Ursula - First Battle",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/atlantica/#ursula" },
    { world: "Atlantica", name: "Ursula - Final Battle",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/atlantica/#giant-ursula" },

    { world: "Halloween Town", name: "Lock, Shock, and Barrel", completionSource: null, hint: "", url: "https://www.khguides.com/kh/halloween-town/#lock-shock-barrel" },
    { world: "Halloween Town", name: "Oogie Boogie",            completionSource: null, hint: "", url: "https://www.khguides.com/kh/halloween-town/#oogie-boogie" },
    { world: "Halloween Town", name: "Oogie's Manor",           completionSource: null, hint: "", url: "https://www.khguides.com/kh/halloween-town/#oogies-manor" },

    { world: "Neverland", name: "AntiSora",      completionSource: null, hint: "", url: "https://www.khguides.com/kh/neverland/#anti-sora" },
    { world: "Neverland", name: "Captain Hook",  completionSource: null, hint: "", url: "https://www.khguides.com/kh/neverland/#captain-hook" },
    { world: "Neverland", name: "Phantom",       completionSource: null, hint: "", url: "https://www.khguides.com/kh/combat/bosses/phantom/" },

    { world: "Hollow Bastion", name: "Riku",                  completionSource: null, hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#riku" },
    { world: "Hollow Bastion", name: "Maleficent",            completionSource: null, hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#maleficent" },
    { world: "Hollow Bastion", name: "Dragon Maleficent",     completionSource: null, hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#maleficent-dragon" },
    { world: "Hollow Bastion", name: "Riku-Ansem",            completionSource: null, hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#ansem-riku" },
    { world: "Hollow Bastion", name: "Behemoth",              completionSource: null, hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#behemoth" },
    { world: "Hollow Bastion", name: "Unknown",               completionSource: null, hint: "", url: "https://www.khguides.com/kh/combat/bosses/unknown/" },

    { world: "End of the World", name: "Chernabog",                completionSource: null, hint: "", url: "https://www.khguides.com/kh/end-of-the-world/#chernabog" },
    { world: "End of the World", name: "Ansem, Seeker of Darkness", completionSource: null, hint: "", url: "https://www.khguides.com/kh/end-of-the-world/#ansem" },
    { world: "End of the World", name: "Darkside - Final",         completionSource: null, hint: "", url: "https://www.khguides.com/kh/end-of-the-world/#ansem-solo" },
    { world: "End of the World", name: "World of Chaos",           completionSource: null, hint: "", url: "https://www.khguides.com/kh/end-of-the-world/#world-of-chaos" }
  ],

  /*
   * Minigames outside the Coliseum.
   *
   * Their persistent "finished" save flags are not mapped yet.
   * Add statusSource when discovered.
   */
  MINIGAMES: [
    { world: "Destiny Islands", name: "Dueling Tidus, Selphie, and Wakka", statusSource: null, hint: "", url: "https://www.khguides.com/kh/side-quests/" },
    { world: "Destiny Islands", name: "Dueling Riku",                     statusSource: null, hint: "", url: "https://www.khguides.com/kh/side-quests/" },
    { world: "Destiny Islands", name: "Racing Riku",                      statusSource: null, hint: "", url: "https://www.khguides.com/kh/side-quests/" },

    { world: "Deep Jungle", name: "Jungle Slider", statusSource: null, hint: "", url: "https://www.khguides.com/kh/deep-jungle/#jungle-slider" },
    { world: "Deep Jungle", name: "Vine Swinging", statusSource: null, hint: "", url: "https://www.khguides.com/kh/deep-jungle/#vine-jump" },

    {
      world: "100 Acre Wood",
      name: "Pooh's Hunny Hunt",
      statusSource: {
        type: "acreWoodMinigame",
        key: "poohHunnyHunt"
      },
      hint: "",
      url: "https://www.khguides.com/kh/hundred-acre-wood/#page1"
    },
    {
      world: "100 Acre Wood",
      name: "Block Tigger",
      statusSource: {
        type: "acreWoodMinigame",
        key: "blockTigger"
      },
      hint: "",
      url: "https://www.khguides.com/kh/hundred-acre-wood/#page2"
    },
    { world: "100 Acre Wood", name: "Pooh's Swing",        statusSource: null, hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page3" },
    { world: "100 Acre Wood", name: "Tigger's Giant Pot",  statusSource: null, hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page4" },
    { world: "100 Acre Wood", name: "Pooh's Muddy Path",   statusSource: null, hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page5" }
  ],

  /*
   * Individually confirmed chest mappings.
   */
  KNOWN_CHESTS: [
    {
      key: "watergleam",
      name: "Watergleam Chest",
      hint: "",
      url: "https://www.khguides.com/kh/collectibles/treasures/"
    }
  ],


  /*
   * Gummi Ship Blueprint completion.
   * Names come from kh1-dictionary.js; this file only controls UI grouping.
   */
  GUMMI_BLUEPRINT_URL: "https://www.khguides.com/kh/collectibles/gummis/",

  GUMMI_BLUEPRINT_GROUPS: [
    {
      name: "Special Models",
      startIndex: 0,
      endIndex: 8,
      url: "https://www.khguides.com/kh/collectibles/gummis/#special-models"
    },
    {
      name: "Enemy Models",
      startIndex: 9,
      endIndex: 36,
      url: "https://www.khguides.com/kh/collectibles/gummis/#enemy-models"
    },
    {
      name: "Mission Models",
      startIndex: 37,
      endIndex: 47,
      url: "https://www.khguides.com/kh/collectibles/gummis/#mission-models"
    }
  ],

  /*
   * Kingdom Hearts Final Mix synthesis:
   * 33 craftable entries in six lists.
   *
   * synthesisIndex maps each recipe to the newly identified 33-bit
   * synthesis-completion bitfield at 0x19C8.
   *
   * Directly confirmed by sequential controlled tests:
   *
   *   synthesisIndex 0 = Mega-Potion
   *   synthesisIndex 1 = Cottage
   *   synthesisIndex 2 = Energy Bangle
   *   synthesisIndex 3 = Power Chain
   *   synthesisIndex 4 = Magic Armlet
   *   synthesisIndex 5 = EXP Earring
   *   synthesisIndex 6 = Mega-Ether
   *   synthesisIndex 7 = Guard Earring
   *   synthesisIndex 8  = Angel Bangle
   *   synthesisIndex 9  = Golem Chain
   *   synthesisIndex 10 = Rune Armlet
   *   synthesisIndex 11 = Moogle Badge
   *   synthesisIndex 12 = AP Up
   *   synthesisIndex 13 = Dark Ring
   *   synthesisIndex 14 = Master Earring
   *   synthesisIndex 15 = Gaia Bangle
   *   synthesisIndex 16 = Titan Chain
   *   synthesisIndex 17 = Mythril
   *   synthesisIndex 18 = Elixir
   *   synthesisIndex 19 = Defense Up
   *   synthesisIndex 20 = Heartguard
   *   synthesisIndex 21 = Three Stars
   *   synthesisIndex 22 = Atlas Armlet
   *   synthesisIndex 23 = Crystal Crown
   *   synthesisIndex 24 = Megalixir
   *   synthesisIndex 25 = Power Up
   *   synthesisIndex 26 = Cosmic Arts
   *   synthesisIndex 27 = EXP Bracelet
   *   synthesisIndex 28 = Ribbon
   *   synthesisIndex 29 = Dark Matter
   *   synthesisIndex 30 = Fantasista
   *   synthesisIndex 31 = Seven Elements
   *   synthesisIndex 32 = Ultima Weapon
   *
   * All 33 recipe indexes and every byte boundary are now directly
   * confirmed by sequential controlled saves through Slot 43.
   *
   * Current ownership is still shown separately because owning an item
   * and having synthesized it are different concepts.
   */
  SYNTHESIS_SETS: [
    {
      name: "List I",
      unlockHint: "Available when the Item Workshop is accessible.",
      items: [
        { itemId: 6, name: "Mega-Potion", synthesisIndex: 0, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" },
        { itemId: 144, name: "Cottage", synthesisIndex: 1, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" },
        { itemId: 39, name: "Energy Bangle", synthesisIndex: 2, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" },
        { itemId: 36, name: "Power Chain", synthesisIndex: 3, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" },
        { itemId: 42, name: "Magic Armlet", synthesisIndex: 4, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" },
        { itemId: 56, name: "EXP Earring", synthesisIndex: 5, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group1" }
      ]
    },
    {
      name: "List II",
      unlockHint: "Unlocked after synthesizing 3 unique items.",
      items: [
        { itemId: 7, name: "Mega-Ether", synthesisIndex: 6, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" },
        { itemId: 30, name: "Guard Earring", synthesisIndex: 7, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" },
        { itemId: 40, name: "Angel Bangle", synthesisIndex: 8, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" },
        { itemId: 37, name: "Golem Chain", synthesisIndex: 9, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" },
        { itemId: 43, name: "Rune Armlet", synthesisIndex: 10, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" },
        { itemId: 67, name: "Moogle Badge", synthesisIndex: 11, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group2" }
      ]
    },
    {
      name: "List III",
      unlockHint: "Unlocked after synthesizing 9 unique items.",
      items: [
        { itemId: 154, name: "AP Up", synthesisIndex: 12, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" },
        { itemId: 33, name: "Dark Ring", synthesisIndex: 13, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" },
        { itemId: 31, name: "Master Earring", synthesisIndex: 14, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" },
        { itemId: 41, name: "Gaia Bangle", synthesisIndex: 15, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" },
        { itemId: 38, name: "Titan Chain", synthesisIndex: 16, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" },
        { itemId: 254, name: "Mythril", synthesisIndex: 17, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group3" }
      ]
    },
    {
      name: "List IV",
      unlockHint: "Unlocked after synthesizing 15 unique items.",
      items: [
        { itemId: 4, name: "Elixir", synthesisIndex: 18, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" },
        { itemId: 153, name: "Defense Up", synthesisIndex: 19, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" },
        { itemId: 45, name: "Heartguard", synthesisIndex: 20, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" },
        { itemId: 35, name: "Three Stars", synthesisIndex: 21, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" },
        { itemId: 44, name: "Atlas Armlet", synthesisIndex: 22, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" },
        { itemId: 47, name: "Crystal Crown", synthesisIndex: 23, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group4" }
      ]
    },
    {
      name: "List V",
      unlockHint: "Unlocked after synthesizing 21 unique items.",
      items: [
        { itemId: 8, name: "Megalixir", synthesisIndex: 24, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" },
        { itemId: 152, name: "Power Up", synthesisIndex: 25, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" },
        { itemId: 68, name: "Cosmic Arts", synthesisIndex: 26, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" },
        { itemId: 59, name: "EXP Bracelet", synthesisIndex: 27, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" },
        { itemId: 46, name: "Ribbon", synthesisIndex: 28, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" },
        { itemId: 156, name: "Dark Matter", synthesisIndex: 29, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group5" }
      ]
    },
    {
      name: "List VI",
      unlockHint: "Unlocked after synthesizing all 30 items in Lists I-V.",
      items: [
        { itemId: 117, name: "Fantasista", synthesisIndex: 30, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group6" },
        { itemId: 133, name: "Seven Elements", synthesisIndex: 31, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group6" },
        { itemId: 100, name: "Ultima Weapon", synthesisIndex: 32, craftedSource: null, hint: "", url: "https://www.khguides.com/kh/inventory/synthesis/#group6" }
      ]
    }
  ]
});

export default KH1_CONTENT;
