# How to Add a New Completion

This guide explains how to add a new completion category to the project.

A **completion** is something that has a measurable goal, for example:

```text
Puppies             33 / 99
Ansem Reports        9 / 13
Summons              4 / 6
Heartless Defeated  43 / 46
Postcards            7 / 10
```

The main principle is:

```text
Binary parser
    |
    | gives us the current value
    v
KH1CheckCompletion.js
    |
    | compares current value with target
    v
UI
```

---

# 1. Before adding a completion

Ask these questions:

### Question 1: Do I already know where the value is stored?

If no, first use the reverse-engineering workflow in:

```text
03-ADDING-A-NEW-VARIABLE.md
```

### Question 2: Is the value already parsed?

For example, postcards are already parsed in `LoadSaveFile.js`:

```javascript
postcardsMailed:
  save[
    KH1_SAVE.POSTCARDS_MAILED
  ],
```

That means you do not need to touch the binary parser to turn Postcards into a completion category.

### Question 3: What is the completion rule?

Examples:

```text
Postcards:
    current >= 10

Heartless:
    every one of the 46 enemies must have defeated > 0

Reports:
    13 report bits must be set

Boss:
    a specific boolean flag must be true
```

Write the rule clearly before coding it.

---

# 2. Files normally involved

Adding a completion usually touches:

```text
src/js/kh1-database.js
src/js/KH1CheckCompletion.js
src/js/index.js
```

It may also touch:

```text
src/js/LoadSaveFile.js
src/js/kh1-functions.js
src/js/kh1-dictionary.js
```

if the underlying save value is not parsed yet.

---

# 3. Simple example: Postcards

The project already knows:

```javascript
KH1_SAVE.POSTCARDS_MAILED
```

and `ParseSave()` already creates:

```javascript
slot.completion.postcardsMailed
```

The target is also already in `KH1_COMPLETION_DATABASE`:

```javascript
postcards: {
  name: "Postcards",
  target: 10
}
```

So to make Postcards a full completion-analysis category:

---

## Step 1: Read the current value in `KH1CheckCompletion.js`

Inside `BuildSlotCompletion(slot)`:

```javascript
const postcardCurrent =
  slot.completion.postcardsMailed;
```

For consistency with the existing project style:

```javascript
function BuildSlotCompletion(slot) {
  const puppyCurrent =
    slot.completion.puppies.foundCount;

  const reportCurrent =
    slot.completion.reports.count;

  const postcardCurrent =
    slot.completion.postcardsMailed;

  // ...
}
```

---

## Step 2: Add the analysis object

Inside the object returned by `BuildSlotCompletion()`:

```javascript
postcards: {
  current:
    postcardCurrent,

  target:
    KH1_COMPLETION_DATABASE
      .postcards
      .target,

  percent:
    CalculatePercent(
      postcardCurrent,
      KH1_COMPLETION_DATABASE
        .postcards
        .target
    ),

  complete:
    postcardCurrent >=
    KH1_COMPLETION_DATABASE
      .postcards
      .target
}
```

Now the parsed slot contains:

```javascript
slot.completionAnalysis.postcards
```

Example:

```json
{
  "current": 7,
  "target": 10,
  "percent": 70,
  "complete": false
}
```

---

# 4. Render the completion in `index.js`

There are two common UI types.

---

## Type A: One simple row

For something like Postcards:

```javascript
function RenderPostcards(slot) {
  const analysis =
    slot.completionAnalysis
      ?.postcards;

  if (!analysis) {
    return "";
  }

  const body =
    BuildEntry({
      name:
        "Postcards Mailed",

      value:
        `${analysis.current}/${analysis.target}`,

      state:
        EntryState(
          analysis.current,
          analysis.target
        )
    });

  return BuildProgressSection(
    "Postcards",
    analysis.current,
    analysis.target,
    body
  );
}
```

Then add it to `RenderAnalyzer()`:

```javascript
generated.innerHTML = [
  '<div class="horizontal-line"></div>',

  RenderGameStatus(slot),
  RenderPuppies(slot),
  RenderReports(slot),

  RenderPostcards(slot),

  RenderSummons(slot),
  RenderTrinity(slot),

  // ...
].join("");
```

The position in this array controls the position on the page.

---

## Type B: A category containing many entries

Heartless is a good example.

The category target is:

```text
46
```

but each enemy also has its own state.

The completion rule is:

```javascript
const completed =
  enemy.defeated > 0;
```

The row can show both state and statistic:

```javascript
BuildEntry({
  name:
    enemy.name,

  value:
    `${enemy.defeated} kills`,

  state:
    completed
      ? "complete"
      : "missing"
});
```

The section percentage still uses:

```javascript
BuildProgressSection(
  "Heartless Defeated",
  analysis.current,
  analysis.target,
  body
);
```

This is useful for:

- Journal entries
- synthesis recipes
- treasure chests
- minigames
- bosses
- weapons
- magic
- collectibles

---

# 5. Completion states

The UI currently understands:

```text
complete
partial
missing
info
```

You can manually choose:

```javascript
state: "complete"
```

or calculate it:

```javascript
state:
  EntryState(
    current,
    target
  )
```

`EntryState()` behaves like:

```text
current >= target
    -> complete

current > 0
    -> partial

current == 0
    -> missing
```

---

# 6. Boolean completion

Sometimes there is no numeric target.

Example:

```javascript
slot.completion.someBossDefeated
```

is either:

```text
true
false
```

You can analyze it as:

```javascript
someBoss: {
  current:
    slot.completion.someBossDefeated
      ? 1
      : 0,

  target:
    1,

  percent:
    slot.completion.someBossDefeated
      ? 100
      : 0,

  complete:
    slot.completion.someBossDefeated
}
```

Or, if you have many bosses:

```javascript
const bosses = [
  slot.completion.bossA,
  slot.completion.bossB,
  slot.completion.bossC
];

const bossCurrent =
  bosses.filter(Boolean).length;
```

Then:

```javascript
bosses: {
  current:
    bossCurrent,

  target:
    bosses.length,

  percent:
    CalculatePercent(
      bossCurrent,
      bosses.length
    )
}
```

---

# 7. Bitfield completion

Suppose you discover 20 completion flags packed into 3 bytes.

Do not calculate the percentage directly in the UI.

Recommended flow:

```text
kh1-functions.js
    DecodeSomething()
        |
        v
LoadSaveFile.js
    slot.completion.something
        |
        v
KH1CheckCompletion.js
    current / target
        |
        v
index.js
```

Example decoder:

```javascript
function DecodeExampleFlags(
  save,
  KH1_SAVE
) {
  const raw =
    save.slice(
      KH1_SAVE.EXAMPLE_FLAGS,
      KH1_SAVE.EXAMPLE_FLAGS +
      KH1_SAVE.EXAMPLE_FLAGS_LENGTH
    );

  const found =
    [];

  for (
    let index = 0;
    index < 20;
    index++
  ) {
    const byteIndex =
      Math.floor(
        index / 8
      );

    const bitIndex =
      index % 8;

    const mask =
      1 << bitIndex;

    if (
      raw[byteIndex] &
      mask
    ) {
      found.push(index);
    }
  }

  return {
    foundCount:
      found.length,

    found,

    rawHex:
      BytesToHex(raw)
  };
}
```

Then `KH1CheckCompletion.js` uses:

```javascript
const current =
  slot.completion
    .exampleFlags
    .foundCount;
```

---

# 8. Missing-item support

A good completion section should not only say:

```text
43 / 46
```

It should also tell the UI what is missing when possible.

Heartless currently does this:

```javascript
const missingHeartless =
  journalEnemies.filter(
    enemy =>
      enemy.defeated === 0
  );
```

and:

```javascript
missing:
  missingHeartless.map(
    enemy => ({
      index:
        enemy.index,

      name:
        enemy.name,

      defeated:
        enemy.defeated
    })
  )
```

For a new completion, use the same idea where useful:

```javascript
missing:
  allItems.filter(
    item =>
      !item.obtained
  )
```

That allows:

- spoiler hiding
- "missing" lists
- hints
- future search/filter features

---

# 9. Where should the target live?

Prefer:

```javascript
KH1_COMPLETION_DATABASE
```

instead of repeating:

```javascript
10
```

in many different files.

Good:

```javascript
postcards: {
  name: "Postcards",
  target: 10
}
```

Then:

```javascript
KH1_COMPLETION_DATABASE
  .postcards
  .target
```

Why?

If the target changes or your understanding improves, there is one main place to update it.

---

# 10. Keep parsing and completion separate

Avoid doing this inside `LoadSaveFile.js`:

```javascript
postcardsComplete:
  save[OFFSET] >= 10
```

Prefer:

```javascript
postcardsMailed:
  save[OFFSET]
```

Then in `KH1CheckCompletion.js`:

```javascript
complete:
  postcardCurrent >= 10
```

The parser should describe what the save contains.

The completion checker should describe what "complete" means.

---

# 11. Recommended completion object format

For a basic numeric completion:

```javascript
example: {
  current: 7,
  target: 10,
  percent: 70,
  complete: false
}
```

For a category with individual entries:

```javascript
example: {
  current: 7,
  target: 10,
  percent: 70,
  complete: false,

  missingCount: 3,

  missing: [
    {...},
    {...},
    {...}
  ]
}
```

This keeps different completion sections predictable.

---

# 12. Checklist for adding a completion

Use this checklist every time:

```text
[ ] The underlying save variable has been confirmed.
[ ] The raw value is decoded in LoadSaveFile.js.
[ ] The completion target is in KH1_COMPLETION_DATABASE.
[ ] BuildSlotCompletion() calculates current.
[ ] BuildSlotCompletion() calculates target.
[ ] BuildSlotCompletion() calculates percent.
[ ] BuildSlotCompletion() sets complete.
[ ] Missing entries are included when useful.
[ ] A Render...() function exists in index.js.
[ ] The Render...() function is added to RenderAnalyzer().
[ ] Spoilers work correctly if the section can reveal unseen content.
[ ] Raw/research data has not been removed.
[ ] Tested with an incomplete save.
[ ] Tested with a partially complete save.
[ ] Tested with a complete save when possible.
```

---

# 13. Full mini-template

## `kh1-database.js`

```javascript
const KH1_COMPLETION_DATABASE =
  Object.freeze({
    // ...

    newCompletion: {
      name:
        "New Completion",

      target:
        10
    }
  });
```

## `KH1CheckCompletion.js`

```javascript
const newCurrent =
  slot.completion
    .newCompletion
    .count;
```

Then inside `return`:

```javascript
newCompletion: {
  current:
    newCurrent,

  target:
    KH1_COMPLETION_DATABASE
      .newCompletion
      .target,

  percent:
    CalculatePercent(
      newCurrent,
      KH1_COMPLETION_DATABASE
        .newCompletion
        .target
    ),

  complete:
    newCurrent >=
    KH1_COMPLETION_DATABASE
      .newCompletion
      .target
}
```

## `index.js`

```javascript
function RenderNewCompletion(slot) {
  const analysis =
    slot.completionAnalysis
      ?.newCompletion;

  if (!analysis) {
    return "";
  }

  const body =
    BuildEntry({
      name:
        "New Completion",

      value:
        `${analysis.current}/${analysis.target}`,

      state:
        EntryState(
          analysis.current,
          analysis.target
        )
    });

  return BuildProgressSection(
    "New Completion",
    analysis.current,
    analysis.target,
    body
  );
}
```

Finally:

```javascript
RenderNewCompletion(slot),
```

inside `RenderAnalyzer()`.

That is the standard pattern for a new completion category.
