# Kingdom Hearts Final Mix Completion Analyzer
## Project Architecture and How It Works

This document explains the structure of the project, the purpose of each JavaScript file, and the full flow from selecting `KHFM_WW.png` to displaying completion information.

---

## 1. Main idea

The project has two different jobs:

1. **Read the Kingdom Hearts save format**
2. **Analyze the decoded data and show completion information**

These jobs are intentionally kept separate.

The overall flow is:

```text
KHFM_WW.png
    |
    v
LoadSaveFile.js
    |
    |  reads binary archive
    |  extracts each 0x16C00 save slot
    |  converts binary values into JavaScript objects
    v
Parsed slot object
    |
    +------------------------------+
    |                              |
    v                              v
KH1CheckCompletion.js          Research data
    |                              |
    | calculates completion         | preserves raw/unknown bytes
    v                              |
completionAnalysis                 |
    |                              |
    +---------------+--------------+
                    |
                    v
                 index.js
                    |
                    | creates the HTML interface
                    v
               Browser page
```

There is **no JSON stored inside the game save**.

The project reads the binary data and creates its own JavaScript object, which can then be displayed or exported as JSON.

---

# 2. Project structure

```text
kingdom-hearts-final-mix-completion-check/
│
├── package.json
│
├── webpack.dev.js
├── webpack.stage.js
├── webpack.prod.js
│
├── README.md
│
├── documentation/
│   ├── 01-PROJECT-OVERVIEW.md
│   ├── 02-ADDING-A-COMPLETION.md
│   └── 03-ADDING-A-NEW-VARIABLE.md
│
└── src/
    ├── index.html
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── index.js
        ├── LoadSaveFile.js
        ├── KH1CheckCompletion.js
        ├── KH1Research.js
        ├── kh1-database.js
        ├── kh1-dictionary.js
        ├── kh1-content.js
        ├── kh1-functions.js
        └── page-functions.js
```

---

# 3. Responsibility of each JavaScript file

## `kh1-database.js`

This file answers:

> **Where is the data?**

It contains offsets, lengths, counts, archive constants, and completion targets.

Examples:

```javascript
const KH1_SAVE = Object.freeze({
  PUPPIES: 0x1703,
  PUPPIES_LENGTH: 13,

  ANSEM_REPORTS: 0x19C0,

  ENEMY_COUNTERS: 0x07D8,
  ENEMY_COUNTERS_LENGTH: 100,
  ENEMY_COUNTERS_COUNT: 50,

  POSTCARDS_MAILED: 0x1CBF
});
```

It also contains completion targets:

```javascript
const KH1_COMPLETION_DATABASE = Object.freeze({
  heartlessDefeated: {
    name: "Heartless Defeated",
    target: 46
  },

  puppies: {
    name: "99 Puppies",
    target: 99
  },

  ansemReports: {
    name: "Ansem Reports",
    target: 13
  }
});
```

### What should go here?

Use this file for:

- save offsets
- block lengths
- number of records
- structure sizes
- completion targets
- research-region definitions

Do **not** put HTML or UI code here.

---

## `kh1-dictionary.js`

This file answers:

> **What does an ID mean?**

The save often stores numbers instead of names.

For example:

```javascript
"DIFFICULTY_NAMES": {
  "0": "Final Mix: Beginner Mode",
  "1": "Final Mix Mode",
  "2": "Final Mix: Proud Mode"
}
```

Enemy counters are another example:

```javascript
"ENEMY_NAMES": {
  "0": "Soldier",
  "1": "Shadow",
  "42": "Gigas Shadow"
}
```

The enemy Journal uses a separate order:

```javascript
"ENEMY_JOURNAL_GROUPS": [
  [1, 42, 0, 41, 4, 10, 11, 12],
  ...
]
```

This is important because JavaScript integer-like object keys are normally enumerated in numeric order.

### What should go here?

Use this file for:

- item ID -> item name
- ability ID -> ability name
- enemy index -> enemy name
- world ID -> world name
- enum values
- display order arrays

Do **not** put binary-reading logic here.

---


## `kh1-content.js`

This file answers:

> **What should the interface list, and how should the list be presented?**

It contains user-editable metadata for:

- tabs
- Keyblades
- Magic
- Summons
- Shields
- Staves
- Coliseum entries
- Journal characters
- bosses
- minigames
- synthesis items
- hints
- external links

An entry can exist before its save flag is identified:

```javascript
{
  name: "Example Boss",
  completionSource: null,
  hint: "",
  url: ""
}
```

This allows the interface to show `Mapping needed` rather than pretending the
entry is incomplete.

See `04-TABS-HINTS-AND-LINKS.md` for full instructions.

---

## `kh1-functions.js`

This file answers:

> **How do I decode the data?**

It contains reusable binary helper functions and feature-specific decoders.

Generic examples:

```javascript
CreateDataView(bytes)
BytesToHex(bytes)
CountBits(value)
ReadUInt16ArrayLE(bytes)
ReadRawRegion(saveBytes, offset, length)
```

Completion decoder examples:

```javascript
DecodePuppies(save, KH1_SAVE)
DecodeReports(save, KH1_SAVE)
DecodeSummons(save, KH1_SAVE)
DecodeTrinity(save, KH1_SAVE)
DecodeEnemyCounters(save, KH1_SAVE)
```

For example:

```javascript
const defeated =
  view.getUint16(
    relativeOffset,
    true
  );
```

The `true` means **little-endian**.

### What should go here?

Use this file when decoding needs reusable logic, such as:

- bit fields
- arrays
- 16-bit/32-bit values
- indexed tables
- flags
- complex structures

A very simple one-byte value does not always need a separate decoder.

---

## `LoadSaveFile.js`

This file answers:

> **How do I turn the complete KHFM_WW.png file into a usable JavaScript object?**

This is the main binary parser.

Its pipeline is:

```text
File
 |
 v
ArrayBuffer
 |
 v
Uint8Array
 |
 v
Read / decode archive directory
 |
 v
Find save-slot archive records
 |
 v
Extract one 0x16C00 save block
 |
 v
ParseSave()
 |
 v
JavaScript slot object
```

### Important functions

#### `ParseArchiveEntry()`

Reads one archive directory record.

#### `ParseCharacter()`

Reads Sora, Donald, Goofy, and guest-character data.

#### `ParseInventory()`

Reads item quantities.

#### `ParseSystem()`

Reads the small `system.bin` associated with a slot.

#### `ParseSave()`

This is where all decoded information for one slot is assembled.

The result currently looks conceptually like:

```javascript
{
  slot: 1,

  archiveEntry: {...},

  system: {...},

  core: {
    difficulty: 0,
    munny: 1069,
    worldId: 16,
    ...
  },

  characters: [
    {...},
    {...}
  ],

  inventory: [
    {...}
  ],

  completion: {
    puppies: {...},
    reports: {...},
    summons: {...},
    trinity: {...},
    enemyDefeatCounters: {...},
    postcardsMailed: 1,
    ...
  },

  research: {
    fullSave: {...},
    regions: {...}
  }
}
```

`completion` here means:

> decoded values that are useful to completion analysis.

It does **not** mean the completion percentage has already been calculated.

That happens in `KH1CheckCompletion.js`.

---

## `KH1CheckCompletion.js`

This file answers:

> **Is this decoded value complete, incomplete, or partially complete?**

This file should not care where a value is stored in the binary save.

For example, `LoadSaveFile.js` already tells it:

```javascript
slot.completion.puppies.foundCount
```

The checker only calculates:

```javascript
current
target
percent
complete
missing
```

Example:

```javascript
heartlessDefeated: {
  current: 43,
  target: 46,
  percent: 93.47,
  complete: false,
  missingCount: 3,
  missing: [...]
}
```

This separation is important:

```text
LoadSaveFile.js
    knows binary format

KH1CheckCompletion.js
    knows completion rules
```

If a completion rule changes, the binary parser should normally not need to change.

---

## `index.js`

This file answers:

> **How should the decoded/analyzed data appear on the page?**

It controls:

- file selection
- slot selection
- spoilers
- research-data visibility
- generated completion sections
- progress bars
- raw JSON
- copy/download actions

Examples of rendering functions:

```javascript
RenderGameStatus(slot)
RenderPuppies(slot)
RenderReports(slot)
RenderSummons(slot)
RenderTrinity(slot)
RenderEnemyJournal(slot)
RenderCharacters(slot)
RenderResearch()
```

Reusable UI helpers include:

```javascript
BuildEntry(...)
BuildProgressSection(...)
EntryState(...)
Percent(...)
```

A completion section normally ends with:

```javascript
return BuildProgressSection(
  "Section Name",
  current,
  target,
  body
);
```

---

## `KH1Research.js`

This file is for reverse engineering.

The recommended process is:

```text
Save A
 |
 | perform exactly one action
 v
Save B
 |
 v
CompareParsedSlots()
 |
 v
List of changed offsets
```

Examples of useful one-action tests:

- defeat exactly one specific enemy
- open exactly one chest
- synthesize exactly one item
- use exactly one Trinity
- obtain exactly one collectible
- complete exactly one minigame

The fewer changes between Save A and Save B, the easier it is to identify the related offset.

---

## `page-functions.js`

Contains simple page helpers that are not Kingdom Hearts binary logic.

For example:

```javascript
SetStatus(...)
DownloadJSON(...)
```

---

# 4. Archive structure

The Steam `KHFM_WW.png` is not treated as a normal picture by the project.

The important archive constants are:

```javascript
DIRECTORY_OFFSET = 0x70
ENTRY_COUNT      = 200
ENTRY_LENGTH     = 0x158
DATA_OFFSET      = 0x10D30
ENTRY_STRIDE     = 0x16C40
SAVE_LENGTH      = 0x16C00
```

The basic archive calculation is:

```javascript
saveOffset =
  KH1_ARCHIVE.DATA_OFFSET +
  archiveEntry.archiveIndex *
  KH1_ARCHIVE.ENTRY_STRIDE;
```

Then one save is extracted:

```javascript
const save =
  fileBytes.slice(
    saveOffset,
    saveOffset +
    KH1_ARCHIVE.SAVE_LENGTH
  );
```

After this point, most offsets in `KH1_SAVE` are **relative to this extracted save block**.

For example:

```javascript
MUNNY: 0x1641C
```

means:

> byte offset `0x1641C` inside the extracted `0x16C00` save slot.

It does not mean absolute offset `0x1641C` inside the complete `KHFM_WW.png`.

---

# 5. Reading binary values

## One byte

```javascript
const value =
  save[
    KH1_SAVE.SOME_OFFSET
  ];
```

Range:

```text
0 - 255
```

---

## Unsigned 16-bit little-endian

```javascript
const view =
  CreateDataView(save);

const value =
  view.getUint16(
    KH1_SAVE.SOME_OFFSET,
    true
  );
```

Example bytes:

```text
A9 00
```

become:

```text
0x00A9 = 169
```

---

## Unsigned 32-bit little-endian

```javascript
const value =
  view.getUint32(
    KH1_SAVE.SOME_OFFSET,
    true
  );
```

---

## Signed 32-bit little-endian

```javascript
const value =
  view.getInt32(
    KH1_SAVE.SOME_OFFSET,
    true
  );
```

---

## A bit flag

Example: bit 1 (`0x02`):

```javascript
const completed =
  Boolean(
    save[OFFSET] & 0x02
  );
```

---

## A byte range

```javascript
const raw =
  save.slice(
    OFFSET,
    OFFSET + LENGTH
  );
```

---

# 6. Three different kinds of project data

When you discover a new value, first decide which kind it is.

## A. Confirmed normal game variable

Example:

```text
Munny
Difficulty
Current World
```

Put its offset in `KH1_SAVE` and parse it normally.

---

## B. Confirmed completion-related variable

Example:

```text
Puppies
Reports
Heartless defeat counters
```

Put it in:

```text
KH1_SAVE
      |
      v
decoder/parser
      |
      v
slot.completion
      |
      v
KH1CheckCompletion.js
```

---

## C. Unknown or partially understood variable

Do not guess its meaning.

Add it first to:

```javascript
KH1_RESEARCH_REGIONS
```

Example:

```javascript
newUnknownBlock: {
  offset: 0x1234,
  length: 8,
  label: "Unknown Block Near X",
  confidence: "research"
}
```

It will automatically be preserved by `ParseResearchData()`.

Once you confirm what it means, you can promote it to a normal parsed field.

---

# 7. Raw data should not be discarded

The project intentionally stores:

```javascript
slot.research.fullSave.rawHex
```

This is the entire `0x16C00` save block.

It also stores research regions with:

```javascript
rawBytes
rawHex
uint16LE
uint32LE
setBitIndexes
```

This is important because today a value may be unknown, but later you may discover what it represents.

---

# 8. Development commands

Install packages:

```bash
npm install
```

Start development mode:

```bash
npm start
```

Production build:

```bash
npm run prod
```

Equivalent direct command:

```bash
npx webpack --config webpack.prod.js --mode production
```

Production output is written to:

```text
docs/
```

That matches the GitHub Pages style used by your existing project.

Stage build:

```bash
npm run stage
```

---

# 9. Recommended development workflow

For a new discovery:

```text
1. Find/verify the offset.
2. Decide whether the information is confirmed or still research.
3. Add the offset to kh1-database.js.
4. Add names/IDs to kh1-dictionary.js when needed.
5. Add decoding logic to kh1-functions.js when needed.
6. Add the decoded result to ParseSave() in LoadSaveFile.js.
7. If it affects completion:
       add the rule to KH1CheckCompletion.js.
8. Add/render the interface section in index.js.
9. Keep raw information available.
10. Compare several different save slots before considering the mapping confirmed.
```

The following two documents contain full examples:

- `02-ADDING-A-COMPLETION.md`
- `03-ADDING-A-NEW-VARIABLE.md`
