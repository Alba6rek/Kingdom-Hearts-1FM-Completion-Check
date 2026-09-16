# Spoiler Consistency Fix

This update fixes completion rows whose names were still visible while their
progress was incomplete.

## Root cause

`BuildEntry()` previously defaulted to:

```js
spoiler = false
```

That meant any completion renderer which forgot to explicitly pass a
`spoiler` property leaked the entry name even when its state was `missing` or
`partial`.

## Global behavior

`BuildEntry()` now treats these states as spoilers by default:

```text
missing
partial
```

A renderer can still explicitly use:

```js
spoiler: false
```

for a label which should always be visible. Postcard sequence labels continue
to do this intentionally.

## Specific fixes

### World Progress / 100 Acre Wood

`100 Acre Wood` now:

- hides its name until all five page flags are complete;
- reveals on hover like the other spoiler names;
- is included in the World Progress overall numerator and denominator.

World Progress therefore contains 12 rows when the 100 Acre Wood page data is
available, rather than showing 12 rows while calculating only 11.

### Olympus Coliseum essentials

Phil's Training / Preliminary / Cup rows now hide their names whenever their
completion state is not complete.

### Journal characters

Missing Journal character names are hidden consistently.

### Journal minigames

Unfinished minigames are hidden. Entries whose persistent mapping is still
unknown are also hidden, which fixes the visible `Olympus Coliseum` Journal
minigame name.

## Existing behavior preserved

- Completed entries remain visible.
- Hovering a hidden name temporarily reveals it.
- The global Spoilers checkbox reveals all hidden names.
- The visible `Hint:` label behavior is unchanged.
- External links remain clickable and no external-link arrow marker is added.
