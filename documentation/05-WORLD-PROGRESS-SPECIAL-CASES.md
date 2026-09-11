# World Progress Special Cases

The Kingdom Hearts save contains at least two different world-related concepts:

```text
WORLD_STATUS
    offset 0x1EF0
    11 bytes
    mostly describes world-map state

WORLD_PROGRESS
    offset 0x1504
    12 bytes
    describes story/event progress inside worlds
```

The external reverse-engineering source documents the world-map values as:

```text
0 = invisible
1 = visible / unvisited
2 = selectable / unvisited
3 = incomplete
4 = complete
```

However, the normal rule:

```javascript
world.raw === 4
```

cannot be used for every world.

---

## Monstro

On the tested 100% save:

```text
WORLD_STATUS:
    Monstro = 3

WORLD_PROGRESS:
    Monstro = 0x46 / 70
```

The mapped Monstro story progression reaches `0x46` for the final mapped
Monstro progression/reward.

Therefore the analyzer uses:

```javascript
Monstro complete =
  progress >= 0x46
```

while still preserving the original world-map byte.

---

## End of the World

On the tested 100% save:

```text
WORLD_STATUS:
    End of the World = 3

WORLD_PROGRESS:
    End of the World = 0x33 / 51
```

Kingdom Hearts 1 does not produce a persistent clear-save after defeating the
final boss. The player normally reloads the last save from before the final
battle.

Therefore there is no normal post-final-boss save state that can be relied on
to change End of the World's map byte to 4.

The analyzer uses the highest mapped persistent End of the World progress:

```javascript
End of the World complete =
  progress >= 0x33
```

The UI labels this:

```text
Complete (max saveable progress)
```

This means:

> the save has reached the maximum persistent End of the World story state,

not:

> the save file proves the final boss was defeated.

Those are not equivalent because the game does not save the post-final-boss
state.

---

## Why keep both values?

Do not replace or delete `WORLD_STATUS`.

The parsed object keeps:

```javascript
{
  name,
  raw,
  worldMapStatus,
  progress,
  progressHex,
  complete,
  status,
  completionRule,
  completionNote
}
```

This lets future reverse engineering correct the completion logic without
losing the original bytes.
