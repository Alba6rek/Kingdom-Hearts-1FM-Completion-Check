# Journal Character Architecture Refactor

The Journal character implementation now follows the same project separation
used by the rest of the analyzer.

## `kh1-database.js` — WHERE

Contains only the binary state map:

```javascript
KH1_JOURNAL_CHARACTER_STATES
```

Each semantic character key maps to one or more confirmed binary states:

```javascript
"jasmine": [
  { offset: 0x16F7, mask: 0x01 },
  { globalBit: 50, offset: 0x16EC, mask: 0x04 }
]
```

The database no longer contains character display names, world grouping,
URLs, hints, or verbose per-character confidence text.

## `kh1-dictionary.js` — WHAT

Contains:

```javascript
JOURNAL_CHARACTER_NAMES
JOURNAL_CHARACTER_STATE_LABELS
JOURNAL_CHARACTER_NOTES
```

Example:

```javascript
JOURNAL_CHARACTER_NAMES["jasmine"] = "Jasmine"
```

Multi-state labels are also defined here when they carry a distinct meaning.
Simple one-state characters automatically use their character name.

## `kh1-content.js` — DISPLAY / ORDER

`JOURNAL_CHARACTERS` now stores only the world grouping and semantic keys:

```javascript
{
  world: "Destiny Islands",
  characters: [
    "sora",
    "riku",
    "kairi",
    "tidus",
    "selphie",
    "wakka"
  ]
}
```

The shared external URL is:

```javascript
JOURNAL_CHARACTER_URL
```

Optional per-character hints or URLs can be added to:

```javascript
JOURNAL_CHARACTER_OVERRIDES
```

without touching the binary parser.

## `LoadSaveFile.js` — DECODE

`ParseKnownJournalCharacters()` combines the binary state definitions with
the dictionary. A character is found when any confirmed state for that
character is active.

## `KH1CheckCompletion.js` — ANALYZE

Journal characters now have the same completion-analysis structure as other
categories:

```javascript
completionAnalysis.journalCharacters = {
  current,
  target: 103,
  percent,
  complete,
  missingCount,
  missing
}
```

## Journal UI progress

`Characters by World` now displays an overall progress summary such as:

```text
Characters by World      87/103 · 84.47%
```

Each world also displays its own count and percentage:

```text
Destiny Islands          5/6 · 83.33%
Traverse Town            10/10 · 100%
Agrabah                   6/8 · 75%
```

Each world has its own progress bar in addition to the overall Journal
character progress bar.
