# Journal Missing-20 Follow-Up and Jasmine Discovery

## Test result

The follow-up test mapped all 20 previously missing character entries.

### Before the original region

The 17 core characters are stored immediately before `0x16E6`:

| Character | Offset | Mask |
|---|---|---|
| Kairi | `0x16E3` | `0x01` |
| Riku | `0x16E3` | `0x04` |
| Sora | `0x16E3` | `0x40` |
| Pluto | `0x16E4` | `0x01` |
| Daisy Duck | `0x16E4` | `0x02` |
| Minnie Mouse | `0x16E4` | `0x04` |
| Goofy | `0x16E4` | `0x08` |
| Donald Duck | `0x16E4` | `0x20` |
| Mickey Mouse | `0x16E4` | `0x80` |
| Pongo | `0x16E5` | `0x01` |
| Fairy Godmother | `0x16E5` | `0x02` |
| Merlin | `0x16E5` | `0x04` |
| Louie | `0x16E5` | `0x08` |
| Dewey | `0x16E5` | `0x10` |
| Huey | `0x16E5` | `0x20` |
| Dale | `0x16E5` | `0x40` |
| Chip | `0x16E5` | `0x80` |

The complete-save bytes `45 AF FF` contain exactly these 17 active bits.

### After the original region

| Character | Offset | Mask | Confirmation |
|---|---|---|---|
| Ice Titan | `0x16F7` | `0x02` | baseline-add + isolated |
| Sephiroth | `0x16F7` | `0x04` | baseline-add + isolated |
| Unknown | `0x16F8` | `0x40` | baseline-add + isolated |

The two tested late candidates that produced no visible character entry were:

```text
0x16F7 / 0x08
0x16F8 / 0x80
```

They remain preserved as unknown Journal-related state rather than being
silently discarded.

---

# Jasmine: final confirmed mapping

The earlier one-bit experiment mapped:

```text
0x16EC / 0x04
```

to a Jasmine information/update state.

The Missing-20 experiment then showed that Jasmine disappeared when the
baseline bits in `0x16F7` were cleared, proving that her base visibility flag
was separate from the update bit.

A focused five-slot test isolated the five bits that made up the relevant
baseline value:

```text
Slot 1 -> 0x16F7 / 0x01
Slot 2 -> 0x16F7 / 0x10
Slot 3 -> 0x16F7 / 0x20
Slot 4 -> 0x16F7 / 0x40
Slot 5 -> 0x16F7 / 0x80
```

Result:

```text
Jasmine appears in Slot 1.
```

Therefore the final mapping is:

```text
Jasmine base Journal entry
    offset = 0x16F7
    mask   = 0x01
    confidence = confirmed

Jasmine information/update
    offset = 0x16EC
    mask   = 0x04
    confidence = confirmed
```

The analyzer now considers Jasmine found when either confirmed Jasmine state
is active, and her mapping is no longer treated as incomplete.

---

# Final Journal character mapping status

All **103 expected Journal characters** now have identified persistent
character-state locations.

The remaining tested bits that caused no visible character entry remain
preserved as unknown Journal-related state rather than being discarded.

