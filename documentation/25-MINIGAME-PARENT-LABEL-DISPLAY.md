# Minigame Parent Label Display

The three nested Journal minigame categories:

```text
Jungle Slider
Vine Jump
Olympus Coliseum
```

are now treated as **always-visible parent/navigation labels**.

They are not spoiler-hidden when incomplete.

Only their individual child records are hidden when missing, for example:

```text
Jungle Slider                <- always visible
  Green Serpent              <- visible if completed, hidden if missing
  Splash Tunnel
  Jade Spiral
  Panic Fall
  Shadow Cavern
```

The parent label text size is also explicitly set to `1rem`, matching the
normal completion-entry text size used by entries such as the 100 Acre Wood
minigames.

The URLs remain clickable directly on the parent names.
