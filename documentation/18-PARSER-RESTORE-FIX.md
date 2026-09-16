# Parser restore fix

The Bosses/Minigames Phase 1 refactor accidentally replaced a source block that also contained two existing parsers:

```text
ParseKnownChests()
ParseOlympusColiseum()
```

Both functions were still called from `ParseSaveBlock()` but their definitions had been removed, causing:

```text
ReferenceError: ParseKnownChests is not defined
```

`ParseOlympusColiseum()` would have produced the same error immediately afterward.

This build restores both functions unchanged from the previous working project and retains the new boss/minigame parsers.
