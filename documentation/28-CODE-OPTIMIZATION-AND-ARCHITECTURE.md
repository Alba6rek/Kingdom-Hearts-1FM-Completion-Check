# Code Optimization and Architecture Cleanup

This pass brings the project back to the same separation of responsibilities used at the beginning of the project.

The goal is **not** to make the code shorter at any cost. The goal is to keep binary structure, decoding, completion rules, interface metadata, and rendering separate so future reverse-engineering work can be added without duplicating logic.

## Project rule

```text
kh1-database.js       = WHERE is the data?
kh1-dictionary.js     = WHAT do numeric IDs mean?
kh1-functions.js      = HOW is binary data decoded?
kh1-content.js        = WHAT should the interface list/show?
LoadSaveFile.js       = BUILD the parsed slot/archive object
KH1CheckCompletion.js = DEFINE completion rules
index.js              = DISPLAY the result
KH1Research.js        = INVESTIGATE unknown data
page-functions.js     = GENERIC browser/page helpers
```

Do not put the same fact in two files unless there is a clear reason.

---

## 1. Trinity mapping cleanup

The independent Trinity binary mapping lives only in:

```javascript
KH1_TRINITY_MARK_STATES
```

inside `kh1-database.js`.

`kh1-content.js` contains only display metadata such as:

```text
name
color
number
hint
URL
```

It no longer duplicates `confirmed` / `pending-action` mapping status for every row.

### Important decoder change

`DecodeTrinity()` now uses the generic helper:

```javascript
DecodeMappedBitStates(save, mappings)
```

The helper reads each confirmed mapping from its **absolute save offset**.

This matters for the remaining action-dependent Trinity locations:

```text
3, 4, 18, 19, 20, 24, 32, 34
```

Their final flags are not required to be inside the normal Trinity table at `0x1C6C..0x1C7F`.

When an environmental/action flag is discovered later, only its mapping needs to be updated, for example:

```javascript
24: Object.freeze({
  offset: 0x????,
  mask: 0x??,
  status: "confirmed"
})
```

The decoder and UI will use it automatically.

The five color counters remain research/statistics data only.

---

## 2. Archive parsing optimization

`ProcessKH1File()` was cleaned up without changing parsed output.

### One archive `DataView`

Previously, `ParseArchiveEntry()` created a new `DataView` for every archive record.

The directory contains 200 records, so the optimized parser creates one `DataView` and reuses it.

### O(1) system entry lookup

Previously, every save slot searched the complete archive list to find:

```text
-NN/system.bin
```

The optimized parser creates:

```javascript
const entryByName = new Map(...)
```

and retrieves the companion entry directly.

### Numeric slot order at the parser boundary

Save entries are converted to `{ entry, slotNumber }`, sorted numerically, and only then parsed.

This guarantees:

```text
1, 2, 3, ... 9, 10, 11, ... 99
```

for every consumer of `parsedSave.slots`.

### Shared character `DataView`

`ParseSave()` already creates a `DataView` for the save block. The same view is now passed to every `ParseCharacter()` call instead of creating ten extra views.

---

## 3. Minigame parsing optimization

The project keeps both:

```javascript
slot.completion.minigames
slot.completion.acreWoodMinigames
```

for compatibility with earlier project code.

Previously, `ParseAcreWoodMinigames()` called `ParseMinigames()` again, so the complete minigame area was decoded twice per slot.

Now `ParseSave()` decodes minigames once and passes that parsed object to the compatibility wrapper.

The JSON result is unchanged.

---

## 4. Completion checker cleanup

`KH1CheckCompletion.js` now uses shared helpers for repeated completion calculations:

```javascript
CalculatePercent(...)
GetTarget(...)
BuildProgress(...)
```

The binary parser still does not decide completion percentages.

The separation remains:

```text
LoadSaveFile.js
    decode raw/save values

KH1CheckCompletion.js
    calculate current / target / percent / missing
```

---

## 5. Trinity renderer cleanup

The UI now builds each Trinity row once with:

```javascript
GetTrinityDisplayState(...)
```

The same decoded rows are then used for:

```text
row status
found count
mapped count
pending count
```

This avoids calculating the same mapping state multiple times and prevents the summary from disagreeing with the visible rows.

---

## 6. Shared content values

The Trinity KHGuides URL is now defined once:

```javascript
KH1_GUIDE_URLS.TRINITIES
```

instead of repeating the same URL in 46 rows.

The Trinity rows still keep their individual location names and hints in `kh1-content.js`.

---

## 7. Validation command

A dependency-free project validation script was added:

```bash
npm run validate
```

It checks the research structure that should not accidentally change:

- exactly 46 Trinity content rows
- test numbers exactly 1 through 46
- exactly 46 mapping definitions
- exactly 38 confirmed mappings
- pending mappings exactly `3, 4, 18, 19, 20, 24, 32, 34`
- confirmed offsets stay inside the `0x16C00` save block
- every confirmed mask contains exactly one bit

This is useful before packaging a new research update.

---

## 8. Regression verification

The optimized parser was tested against the same KH1 save used by the current research project.

The complete parsed object, including `completionAnalysis`, was compared against the previous project version and was **deep-equal**.

So this pass changes implementation/organization, not decoded results.

---

## Recommended rule for future updates

When adding a discovery, start from the data type rather than the UI.

```text
New offset / bit / counter
        |
        v
kh1-database.js
        |
        v
kh1-functions.js or LoadSaveFile.js parser
        |
        v
parsed slot object
        |
        v
KH1CheckCompletion.js (only if it affects completion)
        |
        v
kh1-content.js (name/hint/link)
        |
        v
index.js (display only)
```

For uncertain data, keep it in `KH1_RESEARCH_REGIONS` first rather than adding guessed completion logic.
