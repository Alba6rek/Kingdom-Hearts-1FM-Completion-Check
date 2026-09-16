# Olympus Coliseum Minigame Display

The previous Minigames renderer grouped entries by world and then rendered
Olympus Coliseum as another nested minigame group. Because both names were
"Olympus Coliseum", the UI looked like a table inside another table.

The renderer now detects a world that contains exactly one nested minigame
with the same name as the world and renders that minigame directly.

Olympus Coliseum now appears once, with the four cup records immediately
under it:

```text
Olympus Coliseum  2/4 · 50%
  Phil Cup        00:57.06
  Pegasus Cup     No record
  Hercules Cup    No record
  Hades Cup       04:12.50
```

Deep Jungle still keeps its world wrapper because it contains two different
minigame groups: Jungle Slider and Vine Jump.
