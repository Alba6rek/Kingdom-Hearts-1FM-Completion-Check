# Journal Character and 100 Acre Wood Controlled Tests

## Save sequence

```text
Slot 45
    Main/baseline save.

Slot 46
    Open Watergleam chest.

Slot 47
    Obtain Dumbo.

Slot 48
    Meet Winnie the Pooh.

Slot 49
    Meet Owl.

Slot 50
    Meet Piglet.

Slot 51
    Finish Pooh's Hunny Hunt with 236 licks
    and obtain Naturespark.

Slot 52
    Meet Rabbit.

Slot 53
    Meet Tigger
    and finish Block Tigger with 225 points.
```

---

# Confirmed Journal character flags

| Character | Offset | Mask | Controlled transition |
|---|---|---|---|
| Dumbo | `0x16E8` | `0x01` | Slot 46 -> 47 |
| Winnie the Pooh | `0x16F1` | `0x08` | Slot 47 -> 48 |
| Owl | `0x16F1` | `0x01` | Slot 48 -> 49 |
| Piglet | `0x16F1` | `0x04` | Slot 49 -> 50 |
| Rabbit | `0x16F2` | `0x80` | Slot 51 -> 52 |
| Tigger | `0x16F1` | `0x02` | Slot 52 -> 53 |

Observed bytes:

```text
0x16E8
Slot 46: CE
Slot 47: CF
         +01 = Dumbo

0x16F1
Slot 47: 70
Slot 48: 78  +08 = Winnie the Pooh
Slot 49: 79  +01 = Owl
Slot 50: 7D  +04 = Piglet
Slot 53: 7F  +02 = Tigger

0x16F2
Slot 51: 00
Slot 52: 80
         +80 = Rabbit
```

After Slot 53:

```text
0x16F1 = 0x7F
```

which exactly matches the known complete Slot 1.

At `0x16F2`:

```text
Slot 53 = 0x80
Slot 1  = 0xE0
```

The remaining bits:

```text
0x40
0x20
```

are strong candidates for Eeyore and Roo, because those are the remaining
100 Acre Wood Journal characters not yet met in this test sequence.

Do not assign which is Eeyore and which is Roo until separate controlled
saves identify them.

---

# 100 Acre Wood minigame completion flags

A one-byte minigame bitfield was identified at:

```text
0x19D6
```

Controlled transitions:

```text
Slot 50 -> 51
Pooh's Hunny Hunt finished

0x19D6
00 -> 20

Therefore:
Pooh's Hunny Hunt = mask 0x20
```

```text
Slot 52 -> 53
Block Tigger finished

0x19D6
20 -> 30

Therefore:
Block Tigger = mask 0x10
```

Known complete Slot 1:

```text
0x19D6 = 0x3E
```

Binary:

```text
00111110
```

This contains exactly **five set bits**, matching the five 100 Acre Wood
minigames.

The unresolved masks are:

```text
0x08
0x04
0x02
```

They are expected to belong to the remaining three minigames, but should not
be assigned by name until individually tested.

---

# Minigame score fields

## Pooh's Hunny Hunt

```text
Offset: 0x17DC
Type: uint32 little-endian
Unused value: 0xFFFFFFFF
```

Controlled result:

```text
Slot 50:
FF FF FF FF

Slot 51:
EC 00 00 00

0xEC = 236
```

This exactly matches the reported:

```text
236 licks
```

So:

```text
0x17DC = Pooh's Hunny Hunt score
```

## Block Tigger

```text
Offset: 0x17F0
Type: uint32 little-endian
Unused value: 0xFFFFFFFF
```

Controlled result:

```text
Slot 52:
FF FF FF FF

Slot 53:
E1 00 00 00

0xE1 = 225
```

This exactly matches the reported:

```text
225 points
```

So:

```text
0x17F0 = Block Tigger score
```

---

# Watergleam chest

Slot 45 -> 46 opened only the Watergleam chest.

Inside the existing chest/static block:

```text
0x0740
00 -> 02
```

Therefore:

```text
Watergleam Chest
offset = 0x0740
mask   = 0x02
```

This is now an individually confirmed chest mapping.

---

# Project implementation

The parsed save now contains:

```javascript
slot.completion.journalCharacters
slot.completion.acreWoodMinigames
slot.completion.knownChests
```

The Journal UI uses the confirmed character bits for:

```text
Dumbo
Winnie the Pooh
Owl
Piglet
Rabbit
Tigger
```

The Minigames UI uses the confirmed completion flags and displays the saved
score for:

```text
Pooh's Hunny Hunt
Block Tigger
```

The Chests UI now lists the Watergleam chest individually.
