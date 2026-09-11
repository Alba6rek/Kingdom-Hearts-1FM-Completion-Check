# How to Add a Newly Discovered Save Variable or New UI Section

This guide is for a different situation from adding completion.

Use it when you discover a new value in the save, for example:

```text
a new counter
a flag
a boss state
a timer
a Journal value
a minigame score
a synthesis field
a world variable
a statistics field
an unknown byte block
```

The variable does not have to be a completion target.

---

# 1. First classify the discovery

Before changing code, write down:

```text
Name:
Offset:
Length:
Type:
Endian:
Meaning:
Confidence:
How it was verified:
```

Example format:

```text
Name: Example Counter
Offset: 0x1234
Length: 2
Type: uint16
Endian: little-endian
Meaning: number of ...
Confidence: confirmed
Verification:
  Save A = 10
  perform one action
  Save B = 11
```

Do not skip the verification information.

---

# 2. Decide if the value is confirmed

There are two paths.

---

## Path A: You are still investigating it

Add it to:

```javascript
KH1_RESEARCH_REGIONS
```

in `kh1-database.js`.

Example:

```javascript
exampleUnknown: {
  offset:
    0x1234,

  length:
    4,

  label:
    "Possible Example Counter",

  confidence:
    "research - meaning not confirmed"
}
```

You do **not** need to add custom parsing immediately.

`ParseResearchData()` already loops through `KH1_RESEARCH_REGIONS`:

```javascript
Object.entries(
  KH1_RESEARCH_REGIONS
).forEach(
  ([key, definition]) => {
    regions[key] = {
      label:
        definition.label,

      confidence:
        definition.confidence,

      ...ReadRawRegion(
        save,
        definition.offset,
        definition.length
      )
    };
  }
);
```

So the JSON will automatically contain:

```javascript
slot.research.regions.exampleUnknown
```

with:

```text
offset
offsetHex
length
rawBytes
rawHex
uint16LE
uint32LE
setBitIndexes
```

This is the safest first step for uncertain data.

---

## Path B: You have confirmed what it means

Then add it as a proper parsed variable.

Continue with the following steps.

---

# 3. Add the offset to `kh1-database.js`

Example:

```javascript
const KH1_SAVE = Object.freeze({
  // ...

  NEW_VARIABLE:
    0x1234
});
```

If it is a block:

```javascript
NEW_VARIABLE:
  0x1234,

NEW_VARIABLE_LENGTH:
  16
```

If it is a table:

```javascript
NEW_TABLE:
  0x1234,

NEW_TABLE_LENGTH:
  40,

NEW_TABLE_COUNT:
  20
```

Keep the database focused on structure.

Do not decode the value in this file.

---

# 4. Determine the binary type

## `uint8`

One byte:

```javascript
const value =
  save[
    KH1_SAVE.NEW_VARIABLE
  ];
```

---

## `uint16` little-endian

```javascript
const view =
  CreateDataView(save);

const value =
  view.getUint16(
    KH1_SAVE.NEW_VARIABLE,
    true
  );
```

---

## `uint32` little-endian

```javascript
const value =
  view.getUint32(
    KH1_SAVE.NEW_VARIABLE,
    true
  );
```

---

## signed `int32`

```javascript
const value =
  view.getInt32(
    KH1_SAVE.NEW_VARIABLE,
    true
  );
```

---

## boolean byte

If the entire byte represents false/true:

```javascript
const value =
  Boolean(
    save[
      KH1_SAVE.NEW_VARIABLE
    ]
  );
```

But only use this when you know any non-zero value means true.

---

## single bit

If only one bit matters:

```javascript
const value =
  Boolean(
    save[
      KH1_SAVE.NEW_VARIABLE
    ] &
    0x04
  );
```

For example:

```text
0x01 = bit 0
0x02 = bit 1
0x04 = bit 2
0x08 = bit 3
0x10 = bit 4
0x20 = bit 5
0x40 = bit 6
0x80 = bit 7
```

---

## byte array

```javascript
const raw =
  save.slice(
    KH1_SAVE.NEW_VARIABLE,
    KH1_SAVE.NEW_VARIABLE +
    KH1_SAVE.NEW_VARIABLE_LENGTH
  );
```

---

# 5. Does it need a decoder function?

For a simple value:

```javascript
uint8
uint16
uint32
simple boolean
```

you can read it directly in `ParseSave()`.

For a complex value:

```text
bitfield
table
list
indexed records
multiple values
encoded IDs
```

create a decoder in:

```text
kh1-functions.js
```

---

# 6. Example of a complex decoder

Suppose you discover a table of ten `uint16` values.

In `kh1-database.js`:

```javascript
NEW_COUNTERS:
  0x1234,

NEW_COUNTERS_COUNT:
  10,

NEW_COUNTERS_LENGTH:
  20
```

In `kh1-functions.js`:

```javascript
function DecodeNewCounters(
  save,
  KH1_SAVE
) {
  const raw =
    save.slice(
      KH1_SAVE.NEW_COUNTERS,
      KH1_SAVE.NEW_COUNTERS +
      KH1_SAVE.NEW_COUNTERS_LENGTH
    );

  const view =
    CreateDataView(
      raw
    );

  const counters =
    [];

  for (
    let index = 0;
    index < KH1_SAVE.NEW_COUNTERS_COUNT;
    index++
  ) {
    const relativeOffset =
      index * 2;

    const saveOffset =
      KH1_SAVE.NEW_COUNTERS +
      relativeOffset;

    counters.push({
      index,

      offset:
        saveOffset,

      offsetHex:
        `0x${saveOffset
          .toString(16)
          .toUpperCase()}`,

      value:
        view.getUint16(
          relativeOffset,
          true
        )
    });
  }

  return {
    rawBytes:
      Array.from(raw),

    rawHex:
      BytesToHex(raw),

    counters
  };
}
```

Export it:

```javascript
export {
  // ...

  DecodeNewCounters
};
```

Then import it into `LoadSaveFile.js`.

---

# 7. Add dictionary data when needed

Suppose the table stores IDs:

```text
0 = Something
1 = Something Else
2 = Another Value
```

Add the names to `kh1-dictionary.js`:

```javascript
"NEW_VARIABLE_NAMES": {
  "0": "Something",
  "1": "Something Else",
  "2": "Another Value"
}
```

Then the decoder can return both:

```javascript
{
  id: 1,
  name: "Something Else"
}
```

Keep both the number and the human-readable value.

Do not throw the original numeric ID away.

---

# 8. Add the variable to `ParseSave()`

The next question is:

> Where should the decoded value live in the parsed JSON?

The current main groups are:

```text
core
characters
inventory
completion
research
```

---

## Use `core` when it is basic save state

Examples:

```text
difficulty
current world
room
spawn
munny
```

Example:

```javascript
core: {
  // ...

  newVariable:
    view.getUint16(
      KH1_SAVE.NEW_VARIABLE,
      true
    )
}
```

---

## Use `completion` when it can contribute to completion

Examples:

```text
puppies
reports
summons
Heartless Journal
chests
boss flags
synthesis
```

Example:

```javascript
completion: {
  // ...

  newVariable:
    DecodeNewVariable(
      save,
      KH1_SAVE
    )
}
```

After this, if it has a target, follow:

```text
02-ADDING-A-COMPLETION.md
```

---

## Use a new `statistics` group for non-completion statistics

If you start finding many statistics, it is cleaner to create:

```javascript
statistics: {
  ...
}
```

inside `ParseSave()`.

For example:

```javascript
statistics: {
  exampleCounter:
    view.getUint16(
      KH1_SAVE.EXAMPLE_COUNTER,
      true
    ),

  enemyDefeatCounters:
    DecodeEnemyCounters(
      save,
      KH1_SAVE
    )
}
```

Then your UI can have a dedicated:

```text
Game Statistics
```

section.

You do not have to move existing fields immediately. This is useful as the project grows.

---

# 9. Preserve the raw value

Even after you understand a variable, keeping its raw form is useful.

For a complex decoder:

```javascript
return {
  rawBytes:
    Array.from(raw),

  rawHex:
    BytesToHex(raw),

  decodedValue:
    ...
};
```

This makes future correction easier.

Example:

Today you think:

```text
byte 0 = flags
```

Later you discover:

```text
bits 0-3 = state
bits 4-7 = another field
```

If raw data was preserved, you can re-analyze old exported JSON.

---

# 10. Add a new UI section

Assume you added:

```javascript
slot.statistics.newCounter
```

Now create a renderer in `index.js`.

Simple example:

```javascript
function RenderStatistics(slot) {
  const statistics =
    slot.statistics;

  if (!statistics) {
    return "";
  }

  const body = [
    BuildEntry({
      name:
        "New Counter",

      value:
        String(
          statistics.newCounter
        ),

      state:
        "info"
    })
  ].join("");

  return `
    <section class="analyzer-section">
      <h2>Game Statistics</h2>

      <div class="section-block">
        ${body}
      </div>
    </section>
  `;
}
```

Then add it to:

```javascript
RenderAnalyzer()
```

Example:

```javascript
generated.innerHTML = [
  '<div class="horizontal-line"></div>',

  RenderGameStatus(slot),
  RenderPuppies(slot),
  RenderReports(slot),

  RenderStatistics(slot),

  RenderCharacters(slot)
].join("");
```

Again, the array position controls the UI order.

---

# 11. Add a section containing multiple discovered variables

You do not need one section per variable.

For example:

```javascript
function RenderStatistics(slot) {
  const body = [
    BuildEntry({
      name:
        "Enemy Battles",

      value:
        slot.statistics.enemyBattles,

      state:
        "info"
    }),

    BuildEntry({
      name:
        "Some Counter",

      value:
        slot.statistics.someCounter,

      state:
        "info"
    }),

    BuildEntry({
      name:
        "Some Flag",

      value:
        slot.statistics.someFlag
          ? "Yes"
          : "No",

      state:
        "info"
    })
  ].join("");

  return `
    <section class="analyzer-section">
      <h2>Game Statistics</h2>

      <div class="section-block">
        ${body}
      </div>
    </section>
  `;
}
```

This is better than creating many tiny page sections.

---

# 12. If the value is a completion and a statistic

Heartless defeat counters are a good model.

One raw value can have two purposes:

```text
statistic:
    Shadow = 1051 kills

completion:
    Shadow has been defeated at least once = complete
```

The decoder should keep:

```javascript
defeated: 1051
```

Then `KH1CheckCompletion.js` interprets:

```javascript
enemy.defeated > 0
```

The UI can show:

```text
✓ Shadow     1,051 kills
```

This prevents the parser from mixing the raw statistic with the completion rule.

---

# 13. New variable with a display mapping

Suppose the save contains:

```text
0 = Locked
1 = Available
2 = Complete
```

Add:

```javascript
"NEW_STATE_NAMES": {
  "0": "Locked",
  "1": "Available",
  "2": "Complete"
}
```

Then:

```javascript
const raw =
  save[
    KH1_SAVE.NEW_STATE
  ];

return {
  raw,

  name:
    KH1_DICTIONARY
      .NEW_STATE_NAMES[raw] ??
    `Unknown (${raw})`
};
```

Always preserve:

```javascript
raw
```

even when you also return the translated name.

---

# 14. New variable with a bit mask

Suppose offset `0x1234` contains:

```text
bit 0 = A
bit 1 = B
bit 2 = C
```

A clean decoder is:

```javascript
function DecodeNewFlags(
  save,
  KH1_SAVE
) {
  const raw =
    save[
      KH1_SAVE.NEW_FLAGS
    ];

  return {
    raw,

    flagA:
      Boolean(
        raw & 0x01
      ),

    flagB:
      Boolean(
        raw & 0x02
      ),

    flagC:
      Boolean(
        raw & 0x04
      )
  };
}
```

This is easier to understand than repeatedly reading the byte in `index.js`.

---

# 15. Reverse-engineering workflow for a newly discovered variable

Recommended method:

```text
1. Create Save A.
2. Record the current game state.
3. Perform exactly one controlled action.
4. Create Save B.
5. Compare the two saves.
6. Record every changed offset.
7. Repeat the same experiment.
8. Test another save slot.
9. Test the opposite transition if possible.
10. Only then assign a semantic name.
```

Example:

```text
Save A
    Soldier defeated = 168

Defeat exactly one Soldier

Save B
    Soldier defeated = 169
```

If:

```text
0x07D8:
    A8 00 -> A9 00
```

then interpreting it as `uint16 LE` gives:

```text
168 -> 169
```

That is strong evidence.

---

# 16. Avoid false mappings

A single save comparison may contain unrelated changes:

```text
play time
position
room state
RNG
autosave metadata
HP/MP
party state
event state
```

So when identifying a new variable:

- perform one action
- repeat the experiment
- compare more than one save
- verify that the value moves exactly as expected

Do not label a region as confirmed only because its value "looks reasonable".

---

# 17. Record confidence

For research entries, use values such as:

```text
confirmed
strong
research
tentative
unknown
```

Example:

```javascript
example: {
  offset:
    0x1234,

  length:
    2,

  label:
    "Possible Example Counter",

  confidence:
    "strong - increments by one in three controlled tests"
}
```

This helps prevent a temporary assumption from later looking like a confirmed fact.

---

# 18. Recommended comments for new offsets

When you add an important discovered value, document the reason near the constant:

```javascript
/*
 * EXAMPLE_COUNTER
 *
 * Offset:
 *   0x1234
 *
 * Type:
 *   uint16 little-endian
 *
 * Verification:
 *   Save A = 15
 *   action performed once
 *   Save B = 16
 *
 * Confidence:
 *   confirmed
 */
EXAMPLE_COUNTER:
  0x1234,
```

For complex reverse engineering, comments like this are valuable months later.

---

# 19. Full template for a new confirmed variable

## `kh1-database.js`

```javascript
NEW_VARIABLE:
  0x1234,
```

## `LoadSaveFile.js`

Simple direct value:

```javascript
newVariable:
  view.getUint16(
    KH1_SAVE.NEW_VARIABLE,
    true
  ),
```

or complex decoder:

```javascript
newVariable:
  DecodeNewVariable(
    save,
    KH1_SAVE
  ),
```

## `index.js`

```javascript
function RenderNewVariable(slot) {
  const value =
    slot.core
      .newVariable;

  const body =
    BuildEntry({
      name:
        "New Variable",

      value:
        String(value),

      state:
        "info"
    });

  return `
    <section class="analyzer-section">
      <h2>New Section</h2>

      <div class="section-block">
        ${body}
      </div>
    </section>
  `;
}
```

Then:

```javascript
RenderNewVariable(slot),
```

inside `RenderAnalyzer()`.

---

# 20. Full template for a new research-only variable

You only need `kh1-database.js`:

```javascript
const KH1_RESEARCH_REGIONS =
  Object.freeze({
    // ...

    possibleNewVariable: {
      offset:
        0x1234,

      length:
        4,

      label:
        "Possible New Variable",

      confidence:
        "research"
    }
  });
```

It will automatically appear under:

```javascript
slot.research.regions
  .possibleNewVariable
```

and in the Research Data interface.

This is the recommended starting point when you are still discovering what a variable means.

---

# 21. Decision table

| Situation | Database | Dictionary | Decoder | ParseSave | Completion Checker | UI |
|---|---|---|---|---|---|---|
| Unknown raw region | `KH1_RESEARCH_REGIONS` | No | Automatic `ReadRawRegion` | Automatic | No | Research view |
| Simple confirmed byte | `KH1_SAVE` | Maybe | Usually no | Yes | Only if completion | Yes |
| `uint16`/`uint32` confirmed value | `KH1_SAVE` | Maybe | Usually no | Yes | Only if completion | Yes |
| Complex bitfield/table | `KH1_SAVE` | Often | Yes | Yes | Only if completion | Yes |
| New completion from already parsed value | Completion target | No | No | No | Yes | Yes |
| ID -> name mapping | Maybe | Yes | Maybe | Yes | Maybe | Yes |

---

# 22. Final rule

When adding newly discovered data, keep this separation:

```text
kh1-database.js
    WHERE is it?

kh1-dictionary.js
    WHAT do numeric IDs mean?

kh1-functions.js
    HOW is the binary structure decoded?

LoadSaveFile.js
    WHAT decoded data belongs to this save slot?

KH1CheckCompletion.js
    WHEN is that data considered complete?

index.js
    HOW should it look to the user?

KH1Research.js
    HOW do I investigate unknown data?
```

If you maintain this separation, the project can grow substantially without becoming difficult to maintain.
