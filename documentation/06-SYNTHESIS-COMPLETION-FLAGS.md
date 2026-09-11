# Synthesis Completion Bitfield — Fully Confirmed

The synthesis reverse engineering is now complete for all **33 recipes**.

Sequential controlled saves from Slot 9 through Slot 43 confirm:

```text
all 33 recipe bits
all five bytes
all byte boundaries
all synthesis list/rank thresholds
```

---

# 1. Synthesis completion bitfield

```text
Offset: 0x19C8
Length: 5 bytes
Meaningful bits: 33
Bit order: MSB-first
```

The formula is:

```javascript
const byteIndex =
  Math.floor(
    index / 8
  );

const bitIndex =
  index % 8;

const mask =
  0x80 >> bitIndex;

const completed =
  Boolean(
    raw[byteIndex] &
    mask
  );
```

---

# 2. Complete sequential flag progression

```text
 0 recipes: 00 00 00 00 00

 1: 80 00 00 00 00
 2: C0 00 00 00 00
 3: E0 00 00 00 00
 4: F0 00 00 00 00
 5: F8 00 00 00 00
 6: FC 00 00 00 00
 7: FE 00 00 00 00
 8: FF 00 00 00 00

 9: FF 80 00 00 00
10: FF C0 00 00 00
11: FF E0 00 00 00
12: FF F0 00 00 00
13: FF F8 00 00 00
14: FF FC 00 00 00
15: FF FE 00 00 00
16: FF FF 00 00 00

17: FF FF 80 00 00
18: FF FF C0 00 00
19: FF FF E0 00 00
20: FF FF F0 00 00
21: FF FF F8 00 00
22: FF FF FC 00 00
23: FF FF FE 00 00
24: FF FF FF 00 00

25: FF FF FF 80 00
26: FF FF FF C0 00
27: FF FF FF E0 00
28: FF FF FF F0 00
29: FF FF FF F8 00
30: FF FF FF FC 00
31: FF FF FF FE 00
32: FF FF FF FF 00

33: FF FF FF FF 80
```

---

# 3. Fully confirmed recipe mapping

| Index | Recipe | Offset | Mask |
|---:|---|---|---|
| 0 | Mega-Potion | `0x19C8` | `0x80` |
| 1 | Cottage | `0x19C8` | `0x40` |
| 2 | Energy Bangle | `0x19C8` | `0x20` |
| 3 | Power Chain | `0x19C8` | `0x10` |
| 4 | Magic Armlet | `0x19C8` | `0x08` |
| 5 | EXP Earring | `0x19C8` | `0x04` |
| 6 | Mega-Ether | `0x19C8` | `0x02` |
| 7 | Guard Earring | `0x19C8` | `0x01` |
| 8 | Angel Bangle | `0x19C9` | `0x80` |
| 9 | Golem Chain | `0x19C9` | `0x40` |
| 10 | Rune Armlet | `0x19C9` | `0x20` |
| 11 | Moogle Badge | `0x19C9` | `0x10` |
| 12 | AP Up | `0x19C9` | `0x08` |
| 13 | Dark Ring | `0x19C9` | `0x04` |
| 14 | Master Earring | `0x19C9` | `0x02` |
| 15 | Gaia Bangle | `0x19C9` | `0x01` |
| 16 | Titan Chain | `0x19CA` | `0x80` |
| 17 | Mythril | `0x19CA` | `0x40` |
| 18 | Elixir | `0x19CA` | `0x20` |
| 19 | Defense Up | `0x19CA` | `0x10` |
| 20 | Heartguard | `0x19CA` | `0x08` |
| 21 | Three Stars | `0x19CA` | `0x04` |
| 22 | Atlas Armlet | `0x19CA` | `0x02` |
| 23 | Crystal Crown | `0x19CA` | `0x01` |
| 24 | Megalixir | `0x19CB` | `0x80` |
| 25 | Power Up | `0x19CB` | `0x40` |
| 26 | Cosmic Arts | `0x19CB` | `0x20` |
| 27 | EXP Bracelet | `0x19CB` | `0x10` |
| 28 | Ribbon | `0x19CB` | `0x08` |
| 29 | Dark Matter | `0x19CB` | `0x04` |
| 30 | Fantasista | `0x19CB` | `0x02` |
| 31 | Seven Elements | `0x19CB` | `0x01` |
| 32 | Ultima Weapon | `0x19CC` | `0x80` |

All entries are now classified:

```text
mappingConfidence = confirmed
```

---

# 4. All byte boundaries confirmed

```text
index 7  -> 8
0x19C8 -> 0x19C9

index 15 -> 16
0x19C9 -> 0x19CA

index 23 -> 24
0x19CA -> 0x19CB

index 31 -> 32
0x19CB -> 0x19CC
```

The final recipe occupies only the MSB of the fifth byte:

```text
Ultima Weapon
index 32
0x19CC
mask 0x80
```

That explains the fully complete value:

```text
FF FF FF FF 80
```

---

# 5. Synthesis list/rank progression

A separate byte exists at:

```text
Offset: 0x19D0
Length: 1 byte
```

All stages are now observed:

```text
0-2 unique recipes:
    stage 0

3-8 unique recipes:
    stage 1

9-14 unique recipes:
    stage 2

15-20 unique recipes:
    stage 3

21-29 unique recipes:
    stage 4

30-32 unique recipes:
    stage 5

33 unique recipes:
    stage 6
```

The exact controlled transitions are:

```text
3 recipes:
0 -> 1

9 recipes:
1 -> 2

15 recipes:
2 -> 3

21 recipes:
3 -> 4

30 recipes:
4 -> 5

33 recipes:
5 -> 6
```

So `0x19D0` is now treated as a confirmed **synthesis progression stage**.

---

# 6. Slots 29 through 43

The newly verified sequence is:

| Slot | Total Recipes | Newly Synthesized | Flags | Stage |
|---:|---:|---|---|---:|
| 29 | 19 | Elixir | `FF FF E0 00 00` | 3 |
| 30 | 20 | Defense Up | `FF FF F0 00 00` | 3 |
| 31 | 21 | Heartguard | `FF FF F8 00 00` | 4 |
| 32 | 22 | Three Stars | `FF FF FC 00 00` | 4 |
| 33 | 23 | Atlas Armlet | `FF FF FE 00 00` | 4 |
| 34 | 24 | Crystal Crown | `FF FF FF 00 00` | 4 |
| 35 | 25 | Megalixir | `FF FF FF 80 00` | 4 |
| 36 | 26 | Power Up | `FF FF FF C0 00` | 4 |
| 37 | 27 | Cosmic Arts | `FF FF FF E0 00` | 4 |
| 38 | 28 | EXP Bracelet | `FF FF FF F0 00` | 4 |
| 39 | 29 | Ribbon | `FF FF FF F8 00` | 4 |
| 40 | 30 | Dark Matter | `FF FF FF FC 00` | 5 |
| 41 | 31 | Fantasista | `FF FF FF FE 00` | 5 |
| 42 | 32 | Seven Elements | `FF FF FF FF 00` | 5 |
| 43 | 33 | Ultima Weapon | `FF FF FF FF 80` | 6 |

---

# 7. Inventory control note

Earlier Slot 14 deliberately changed inventory quantities without adding a new
synthesis recipe.

The synthesis bitfield did not change.

This confirms that:

```text
owning an item
```

is different from:

```text
having synthesized the recipe at least once
```

The analyzer intentionally keeps these as separate values.

For some later test slots, manually raised item quantities also mean the
crafted output quantity is not always a useful differential signal. The
synthesis bitfield itself remains the authoritative persistent history.

---

# 8. Final implementation status

The project can now safely use:

```javascript
slot.completion.synthesis.completedIndexes
```

for all 33 recipes without marking any mapping as inferred.

Completion is:

```text
completed synthesis flags / 33
```

and:

```text
33 / 33
```

corresponds to:

```text
FF FF FF FF 80
```

at `0x19C8`.
