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

const KH1_GUIDE_URLS = Object.freeze({
  TRINITIES:
    "https://www.khguides.com/kh/collectibles/trinities/"
});

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
   * World Progress external guide links.
   *
   * Keep these in interface metadata rather than the binary database: the
   * save parser only needs world names/status values, while this file decides
   * where a displayed world name should link.
   */
  WORLD_PROGRESS_URLS: Object.freeze({
    "Traverse Town": "https://www.khguides.com/kh/traverse-town/",
    "Wonderland": "https://www.khguides.com/kh/wonderland/",
    "Olympus Coliseum": "https://www.khguides.com/kh/olympus-coliseum/",
    "Deep Jungle": "https://www.khguides.com/kh/deep-jungle/",
    "Agrabah": "https://www.khguides.com/kh/agrabah/",
    "Atlantica": "https://www.khguides.com/kh/atlantica/",
    "Halloween Town": "https://www.khguides.com/kh/halloween-town/",
    "Neverland": "https://www.khguides.com/kh/neverland/",
    "Hollow Bastion": "https://www.khguides.com/kh/hollow-bastion/",
    "End of the World": "https://www.khguides.com/kh/end-of-the-world/",
    "Monstro": "https://www.khguides.com/kh/monstro/",
    "100 Acre Wood": "https://www.khguides.com/kh/hundred-acre-wood/"
  }),

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
   * 38 of the 46 physical locations now have confirmed persistent bits from
   * controlled Slot 99 testing. The remaining eight are action-dependent:
   * tests 3, 4, 18, 19, 20, 24, 32 and 34.
   *
   * For confirmed rows the interface uses the exact per-location flag.
   * Pending rows are not assigned guessed bits and remain Unknown. The color
   * counters are deliberately NOT used to infer any physical Trinity row.
   */
  TRINITY_MARKS: [
    {
      color: "Blue",
      marks: [
        { testNumber: 1, number: 1, name: "Traverse Town — First District", hint: "Near the world exit, across from the Accessory Shop", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 2, number: 2, name: "Traverse Town — First District", hint: "In front of the café near the Item Shop", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 3, number: 3, name: "Traverse Town — Third District", hint: "Behind the Lady & the Tramp fountain", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 4, number: 4, name: "Traverse Town — Magician's Study", hint: "Near the save station", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 5, number: 5, name: "Wonderland — Lotus Forest", hint: "Yellow-flowers alcove", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 6, number: 6, name: "Wonderland — Lotus Forest", hint: "Yellow-mushrooms alcove", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 7, number: 7, name: "Olympus Coliseum — Gates", hint: "Left gladiator statue", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 8, number: 8, name: "Olympus Coliseum — Gates", hint: "Right gladiator statue", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 9, number: 9, name: "Deep Jungle — Camp", hint: "Near lab equipment / Hippo Lagoon passage", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 10, number: 10, name: "Deep Jungle — Climbing Trees", hint: "Raised platform near Tree House passage", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 11, number: 11, name: "Agrabah — Bazaar", hint: "Ground level, center of area", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 12, number: 12, name: "Agrabah — Cave of Wonders: Silent Chamber", hint: "Center platform near Hall passage", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 13, number: 13, name: "Monstro — Mouth", hint: "Wooden platform near front of mouth", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 14, number: 14, name: "Monstro — Chamber 5", hint: "Ground level across from Chamber 6 passage", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 15, number: 15, name: "Monstro — Throat", hint: "Lowest level, center", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 16, number: 16, name: "Hollow Bastion — Waterway: Dungeon", hint: "Near center, left of Lift Stop platform", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 17, number: 17, name: "Hollow Bastion — Great Crest", hint: "Center after riding floating platform", url: KH1_GUIDE_URLS.TRINITIES }
      ]
    },
    {
      color: "Red",
      marks: [
        { testNumber: 18, number: 1, name: "Traverse Town — First District", hint: "Wooden fence in alley behind Item Shop", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 19, number: 2, name: "Traverse Town — Alleyway", hint: "Metal grate blocking the Waterway", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 20, number: 3, name: "Traverse Town — Second District", hint: "Wooden planks in front of bell tower", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 21, number: 4, name: "Agrabah — Treasure Room", hint: "In front of sphinx statue", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 22, number: 5, name: "Halloween Town — Oogie's Manor", hint: "Ground-level archway near the stream", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 23, number: 6, name: "Hollow Bastion — Entrance Hall", hint: "Second-floor balcony near horned statue", url: KH1_GUIDE_URLS.TRINITIES }
      ]
    },
    {
      color: "Green",
      marks: [
        { testNumber: 24, number: 1, name: "Traverse Town — First District: Accessory Shop", hint: "In front of the center table", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 25, number: 2, name: "Wonderland — Bizarre Room", hint: "At ground level inside the furnace", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 26, number: 3, name: "Wonderland — Rabbit Hole", hint: "Along the wall near the save station", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 27, number: 4, name: "Olympus Coliseum — Gates", hint: "Between two braziers near world-map passage", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 28, number: 5, name: "Deep Jungle — Treetops", hint: "Center of the area", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 29, number: 6, name: "Agrabah — Storage Room", hint: "Near shelving across from save station", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 30, number: 7, name: "Monstro — Mouth", hint: "Top of Geppetto's ship", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 31, number: 8, name: "Neverland — Cabin", hint: "Center of room", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 32, number: 9, name: "Hollow Bastion — Library", hint: "Second floor near bookcase/table/balcony", url: KH1_GUIDE_URLS.TRINITIES }
      ]
    },
    {
      color: "Yellow",
      marks: [
        { testNumber: 33, number: 1, name: "Traverse Town — Mystical House", hint: "Behind Merlin's house near large crates", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 34, number: 2, name: "Olympus Coliseum — Lobby", hint: "In front of the large pedestal", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 35, number: 3, name: "Agrabah — Cave of Wonders: Hall", hint: "Stone statue near boulder path", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 36, number: 4, name: "Neverland — Hold", hint: "Locked door after climbing ladder", url: KH1_GUIDE_URLS.TRINITIES }
      ]
    },
    {
      color: "White",
      marks: [
        { testNumber: 37, number: 1, name: "Traverse Town — Waterway", hint: "Across from the mural", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 38, number: 2, name: "Wonderland — Lotus Forest", hint: "Alcove through painting in sideways Bizarre Room", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 39, number: 3, name: "Olympus Coliseum — Gates", hint: "Center of the area", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 40, number: 4, name: "Deep Jungle — Cavern of Hearts", hint: "Center of the area", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 41, number: 5, name: "Agrabah — Cave of Wonders: Entrance", hint: "Left of entrance when facing Hall", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 42, number: 6, name: "Monstro — Chamber 6", hint: "Ground level, center", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 43, number: 7, name: "Atlantica — Triton's Palace", hint: "Inside large purple shell structure", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 44, number: 8, name: "Halloween Town — Moonlight Hill", hint: "In front of hill near pumpkin patch", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 45, number: 9, name: "Neverland — Ship", hint: "Near ship's wheel above deck", url: KH1_GUIDE_URLS.TRINITIES },
        { testNumber: 46, number: 10, name: "Hollow Bastion — Rising Falls", hint: "Shallow pool about halfway up falls", url: KH1_GUIDE_URLS.TRINITIES }
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
   * Boss display/grouping metadata.
   *
   * Binary completion rules live in KH1_BOSS_COMPLETION_STATES inside
   * kh1-database.js. Names are also available through kh1-dictionary.js.
   *
   * Entries without a binary rule remain visible as "Mapping needed".
   */
  BOSSES: [
    { key: "darkside", world: "Dive to the Heart", name: "Darkside", hint: "", url: "https://www.khguides.com/kh/awakening/#darkside" },

    { key: "guardArmor", world: "Traverse Town", name: "Guard Armor", hint: "", url: "https://www.khguides.com/kh/traverse-town/#guard-armor" },
    { key: "oppositeArmor", world: "Traverse Town", name: "Opposite Armor", hint: "", url: "https://www.khguides.com/kh/traverse-town/#opposite-armor" },
    { key: "redArmor", world: "Traverse Town", name: "Red Armor", hint: "", url: "https://www.khguides.com/kh/combat/bosses/" },

    { key: "trickmaster", world: "Wonderland", name: "Trickmaster", hint: "", url: "https://www.khguides.com/kh/wonderland/#trickmaster" },

    { key: "cloud", world: "Olympus Coliseum", name: "Cloud", hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#cloud" },
    { key: "cerberus", world: "Olympus Coliseum", name: "Cerberus", hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#cerberus" },
    { key: "hercules", world: "Olympus Coliseum", name: "Hercules", hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#hercules" },
    { key: "hades", world: "Olympus Coliseum", name: "Hades", hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#hades" },
    { key: "rockTitan", world: "Olympus Coliseum", name: "Rock Titan", hint: "", url: "https://www.khguides.com/kh/olympus-coliseum/#rock-titan" },
    { key: "iceTitan", world: "Olympus Coliseum", name: "Ice Titan", hint: "", url: "https://www.khguides.com/kh/combat/bosses/ice-titan/" },
    { key: "sephiroth", world: "Olympus Coliseum", name: "Sephiroth", hint: "", url: "https://www.khguides.com/kh/combat/bosses/sephiroth/" },

    { key: "sabor", world: "Deep Jungle", name: "Sabor", hint: "", url: "https://www.khguides.com/kh/deep-jungle/#sabor" },
    { key: "clayton", world: "Deep Jungle", name: "Clayton", hint: "", url: "https://www.khguides.com/kh/deep-jungle/#stealth-sneak" },
    { key: "stealthSneak", world: "Deep Jungle", name: "Stealth Sneak", hint: "", url: "https://www.khguides.com/kh/deep-jungle/#stealth-sneak" },

    { key: "potCentipede", world: "Agrabah", name: "Pot Centipede", hint: "", url: "https://www.khguides.com/kh/agrabah/#pot-centipede" },
    { key: "caveGuardian", world: "Agrabah", name: "Cave of Wonders Guardian", hint: "", url: "https://www.khguides.com/kh/agrabah/#cave-of-wonders" },
    { key: "jafar", world: "Agrabah", name: "Jafar", hint: "", url: "https://www.khguides.com/kh/agrabah/#jafar" },
    { key: "genieJafar", world: "Agrabah", name: "Genie Jafar", hint: "", url: "https://www.khguides.com/kh/agrabah/#jafar-genie" },
    { key: "kurtZisa", world: "Agrabah", name: "Kurt Zisa", hint: "", url: "https://www.khguides.com/kh/combat/bosses/kurt-zisa/" },

    { key: "parasiteCage1", world: "Monstro", name: "Parasite Cage - First Battle", hint: "", url: "https://www.khguides.com/kh/monstro/#parasite-cage" },
    { key: "parasiteCage2", world: "Monstro", name: "Parasite Cage - Second Battle", hint: "", url: "https://www.khguides.com/kh/monstro/#parasite-cage2" },

    { key: "shark", world: "Atlantica", name: "The Shark", hint: "", url: "https://www.khguides.com/kh/atlantica/#shark" },
    { key: "ursula1", world: "Atlantica", name: "Ursula - First Battle", hint: "", url: "https://www.khguides.com/kh/atlantica/#ursula" },
    { key: "ursulaFinal", world: "Atlantica", name: "Ursula - Final Battle", hint: "", url: "https://www.khguides.com/kh/atlantica/#giant-ursula" },

    { key: "lockShockBarrel", world: "Halloween Town", name: "Lock, Shock, and Barrel", hint: "", url: "https://www.khguides.com/kh/halloween-town/#lock-shock-barrel" },
    { key: "oogieBoogie", world: "Halloween Town", name: "Oogie Boogie", hint: "", url: "https://www.khguides.com/kh/halloween-town/#oogie-boogie" },
    { key: "oogieManor", world: "Halloween Town", name: "Oogie's Manor", hint: "", url: "https://www.khguides.com/kh/halloween-town/#oogies-manor" },

    { key: "antiSora", world: "Neverland", name: "AntiSora", hint: "", url: "https://www.khguides.com/kh/neverland/#anti-sora" },
    { key: "captainHook", world: "Neverland", name: "Captain Hook", hint: "", url: "https://www.khguides.com/kh/neverland/#captain-hook" },
    { key: "phantom", world: "Neverland", name: "Phantom", hint: "", url: "https://www.khguides.com/kh/combat/bosses/phantom/" },

    { key: "riku", world: "Hollow Bastion", name: "Riku", hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#riku" },
    { key: "maleficent", world: "Hollow Bastion", name: "Maleficent", hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#maleficent" },
    { key: "dragonMaleficent", world: "Hollow Bastion", name: "Dragon Maleficent", hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#maleficent-dragon" },
    { key: "rikuAnsem", world: "Hollow Bastion", name: "Riku-Ansem", hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#ansem-riku" },
    { key: "behemoth", world: "Hollow Bastion", name: "Behemoth", hint: "", url: "https://www.khguides.com/kh/hollow-bastion/#behemoth" },
    { key: "unknown", world: "Hollow Bastion", name: "Unknown", hint: "", url: "https://www.khguides.com/kh/combat/bosses/unknown/" },

    { key: "chernabog", world: "End of the World", name: "Chernabog", hint: "", url: "https://www.khguides.com/kh/end-of-the-world/#chernabog" },
    {
      key: "ansem",
      world: "End of the World",
      name: "Ansem, Seeker of Darkness",
      hint: "",
      url: "https://www.khguides.com/kh/end-of-the-world/#ansem",
      trackingNote: "Uses End of the World's maximum saveable progress because KH1 does not preserve a normal post-final-boss clear save."
    },
    {
      key: "darksideFinal",
      world: "End of the World",
      name: "Darkside - Final",
      hint: "",
      url: "https://www.khguides.com/kh/end-of-the-world/#ansem-solo",
      trackingNote: "Uses End of the World's maximum saveable progress because KH1 does not preserve a normal post-final-boss clear save."
    },
    {
      key: "worldOfChaos",
      world: "End of the World",
      name: "World of Chaos",
      hint: "",
      url: "https://www.khguides.com/kh/end-of-the-world/#world-of-chaos",
      trackingNote: "Uses End of the World's maximum saveable progress because KH1 does not preserve a normal post-final-boss clear save."
    }
  ],

  /*
   * Jiminy's Journal Mini Games.
   *
   * This is the actual 8-entry Journal list. Destiny Islands duels/race were
   * removed because they are not part of the Journal Mini Games section.
   *
   * Binary completion/score mappings live in KH1_MINIGAME_STATES.
   */
  MINIGAMES: [
    { key: "jungleSlider", world: "Deep Jungle", name: "Jungle Slider", hint: "", url: "https://www.khguides.com/kh/deep-jungle/#jungle-slider" },
    { key: "vineJump", world: "Deep Jungle", name: "Vine Jump", hint: "", url: "https://www.khguides.com/kh/deep-jungle/#vine-jump" },

    { key: "poohHunnyHunt", world: "100 Acre Wood", name: "Pooh's Hunny Hunt", hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page1" },
    { key: "blockTigger", world: "100 Acre Wood", name: "Block Tigger", hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page2" },
    { key: "poohSwing", world: "100 Acre Wood", name: "Pooh's Swing", hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page3" },
    { key: "tiggerGiantPot", world: "100 Acre Wood", name: "Tigger's Giant Pot", hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page4" },
    { key: "poohMuddyPath", world: "100 Acre Wood", name: "Pooh's Muddy Path", hint: "", url: "https://www.khguides.com/kh/hundred-acre-wood/#page5" },

    {
      key: "olympusColiseum",
      world: "Olympus Coliseum",
      name: "Olympus Coliseum",
      hint: "",
      url: "https://www.khguides.com/kh/olympus-coliseum/",
      trackingNote: "The Journal entry contains four confirmed time-trial record fields for the Phil, Pegasus, Hercules, and Hades Cups."
    }
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
   * The 48-entry PC order is accepted for the project after user spot-checks
   * confirmed the tested one-hot blueprint slots matched the expected names.
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
