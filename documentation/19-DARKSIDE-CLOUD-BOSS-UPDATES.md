# Darkside and Cloud Boss Completion Update

## Darkside

The user supplied a controlled two-slot archive:

```text
Slot 1 = immediately before Darkside
Slot 2 = immediately after Darkside
```

The save blocks differ in many expected gameplay fields because the battle
grants EXP/items and moves the player from Dive to the Heart to Destiny
Islands.

The clean persistent story-completion byte is:

```text
0x1514

Slot 1: 0x00
Slot 2: 0x01
```

The same byte remains `0x01` in later populated saves, including known late
and complete saves.

Therefore the analyzer uses:

```text
Darkside complete when:
save[0x1514] != 0
```

This should be understood as a persistent post-Darkside / Awakening-complete
story flag, which is exactly what the completion tracker needs.

## Cloud

For this project, Cloud is counted as defeated once the player finishes the
Olympus Coliseum Preliminary Tournament.

The controlled Olympus test already established:

```text
Olympus story progress >= 0x22
= Preliminary Tournament complete
```

Therefore:

```text
Cloud complete when:
Olympus progress >= 0x22
```

This intentionally does not try to distinguish whether the player won or lost
the individual Cloud fight.

## Sneak Army

Sneak Army was removed from the Boss completion list because it is not being
treated as a main boss in this project.

Boss target:

```text
42 -> 41
```
