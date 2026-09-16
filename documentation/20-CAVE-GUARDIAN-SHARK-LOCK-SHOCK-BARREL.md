# Cave Guardian, Shark, and Lock/Shock/Barrel — Controlled Boss Tests

The user supplied one archive with three controlled before/after boss pairs.

## Cave of Wonders Guardian

```text
Slot 15 = before defeat
Slot 16 = after defeat
```

Important changes:

```text
Agrabah story progress
0x1508: 0x35 -> 0x3F

Direct persistent event bit
0x1D71: 0x00 -> 0x40
```

Known 100% Slot 1 also contains:

```text
0x1D71 = 0x40
```

Final tracker rule:

```text
Cave of Wonders Guardian defeated
    offset = 0x1D71
    mask   = 0x40
```

Confidence: **confirmed**.

---

## The Shark

```text
Slot 19 = before defeat
Slot 20 = after defeat
```

Atlantica's main story-progress byte does **not** change during this test:

```text
0x150A: 0x32 -> 0x32
```

The clean controlled state change used by the tracker is:

```text
0x20E1: 0x0E -> 0x10
```

The known 100% Slot 1 contains:

```text
0x20E1 = 0x11
```

so bit `0x10` remains present there.

Final tracker rule:

```text
The Shark defeated
    offset = 0x20E1
    mask   = 0x10
```

Confidence: **confirmed from the controlled before/after pair and 100% save
corroboration**.

Other bytes changed in the pair, including item quantities from Shark drops
and volatile save-position/state data. Those are intentionally not used.

---

## Lock, Shock, and Barrel

```text
Slot 22 = before defeat
Slot 23 = after defeat
```

Important changes:

```text
Halloween Town story progress
0x150C: 0x46 -> 0x53

Direct persistent event bit
0x1DD3: 0x00 -> 0x80
```

Known 100% Slot 1 also contains:

```text
0x1DD3 = 0x80
```

Final tracker rule:

```text
Lock, Shock, and Barrel defeated
    offset = 0x1DD3
    mask   = 0x80
```

Confidence: **confirmed**.

---

## Boss mapping status

After these three controlled tests:

```text
Boss entries listed:          41
Persistent boss rules:        38
Ordinary/main bosses pending: 0
Final non-saveable sequence:  3
```

The remaining three are:

```text
Ansem, Seeker of Darkness
Darkside - Final
World of Chaos
```

Those remain special because the normal game does not produce an ordinary
post-final-battle save.
