# Olympus Coliseum Controlled Save Mappings

## Controlled saves

```text
Slot 54
    Main/baseline save.

Slot 55
    Phil's Training completed.

Slot 56
    Preliminary Tournament completed.
    Cloud, Hercules, and Hades met / Journal entries acquired.

Slot 57
    Cerberus met and defeated.

Slot 58
    New cup-test baseline.
    All four normal cups available, none completed.

Slot 59
    Phil Cup completed.

Slot 60
    Pegasus Cup completed.

Slot 61
    Hercules Cup completed.
    Yellow Trinity learned.
    Olympia opened/acquired.
```

## Olympus story progress

The Olympus story-progress byte is:

```text
0x1506
```

Observed values:

```text
Slot 54  0x07
Slot 55  0x13  Phil's Training complete
Slot 56  0x22  Preliminaries complete
Slot 57  0x28  Cerberus defeated
Slot 58  0x32  later Olympus story state
```

The project now uses these persistent thresholds:

```text
Phil's Training       >= 0x13
Preliminary Tournament >= 0x22
Cerberus story state  >= 0x28
```

Phil's Training also produced a dedicated persistent change:

```text
0x0F05
00 -> 01
```

between Slots 54 and 55.

## Journal characters

### Cloud

Slot 55 -> 56 added Cloud, Hercules, and Hades.

At:

```text
0x16E6
FD -> FF
```

the new mask is:

```text
0x02
```

Cloud is the only new Characters 1 entry from that controlled transition, so:

```text
Cloud = 0x16E6 / 0x02
```

is treated as confirmed.

### Hercules / Hades

At:

```text
0x16EA
E8 -> FC
```

the newly introduced state is:

```text
0x10 + 0x04
```

After Cerberus:

```text
FC -> FD
```

so Cerberus is clearly:

```text
0x01
```

The complete Slot 1 contains:

```text
0x16EA = FB
```

The best fitting interpretation is:

```text
Hercules
    mask 0x10

Hades
    state mask 0x06

    0x00 = not encountered
    0x04 = initial Journal entry
    0x02 = later updated Journal state

Cerberus
    mask 0x01
```

Hades is known to receive another Journal update after the Hades Cup, which
explains why the complete save changes the Hades field rather than simply
keeping `0x04`.

Because Hercules and Hades were first acquired in the same save step, their
exact assignment is marked **strong** rather than absolute until a more isolated
test is available.

### Cerberus

Controlled transition:

```text
Slot 56 -> 57

0x16EA
FC -> FD
```

Only `0x01` is newly set, so:

```text
Cerberus = 0x16EA / 0x01
```

is directly confirmed.

## Cup completion bitfield

A compact cup-completion bitfield exists at:

```text
0x16D0
```

Observed:

```text
Slot 58  00
Slot 59  01   Phil Cup
Slot 60  03   Phil + Pegasus
Slot 61  07   Phil + Pegasus + Hercules

Complete Slot 1:
0F
```

Therefore:

```text
0x01 = Phil Cup      confirmed
0x02 = Pegasus Cup   confirmed
0x04 = Hercules Cup  confirmed
0x08 = Hades Cup     strong pattern / complete-save observation
```

## Individual cup state bytes

Four cup state bytes begin at:

```text
0x1E00
```

Layout:

```text
0x1E00 Phil Cup
0x1E01 Pegasus Cup
0x1E02 Hercules Cup
0x1E03 Hades Cup
```

Observed:

```text
Slot 58  0A 0A 0A 0A
Slot 59  01 0A 0A 0A
Slot 60  01 01 0A 0A
Slot 61  01 01 01 0A

Complete Slot 1:
01 01 01 01
```

Current state interpretation:

```text
0x00 = locked / unavailable
0x0A = available / not completed
0x01 = completed
```

The project preserves both this table and the compact bitfield at `0x16D0`.

## Phil Cup -> Red Armor Journal

Slot 58 -> 59 also changed:

```text
0x16F9
00 -> 02
```

That is the already mapped Red Armor Heartless-Journal flag.

This controlled test independently confirms that clearing the Phil Cup sets
the Red Armor Journal completion state.

## Yellow Trinity

Slot 60 -> 61:

```text
0x1C1B
17 -> 1F
```

Difference:

```text
0x08
```

This reconfirms:

```text
Yellow Trinity unlock mask = 0x08
```

## Hercules Cup rewards / Olympia

Slot 60 -> 61 added:

```text
0x04F6
item ID 93
Olympia
0 -> 1

0x04F8
item ID 95
Metal Chocobo
0 -> 1

0x0519
item ID 128
Herc's Shield
0 -> 1
```

No bit changed in the already mapped `0x05CC` chest/static region during this
step.

Because Hercules Cup completion, Yellow Trinity, multiple rewards, and Olympia
acquisition occurred in one save transition, the other changed event bytes
cannot be assigned individually yet. The analyzer therefore continues to
determine Olympia ownership from the inventory/equipped-weapon data.
