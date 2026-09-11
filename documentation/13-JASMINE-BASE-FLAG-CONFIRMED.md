# Jasmine Base Journal Flag — Confirmed

Focused test:

```text
Slot 1 -> 0x16F7 / 0x01
Slot 2 -> 0x16F7 / 0x10
Slot 3 -> 0x16F7 / 0x20
Slot 4 -> 0x16F7 / 0x40
Slot 5 -> 0x16F7 / 0x80
```

Observed result:

```text
Jasmine exists in Slot 1.
```

Therefore:

```text
BASE CHARACTER ENTRY
0x16F7 / 0x01 = Jasmine
```

Previously confirmed:

```text
ADDITIONAL JOURNAL INFORMATION / UPDATE
0x16EC / 0x04 = Jasmine update
```

Final mapping:

| State | Offset | Mask | Confidence |
|---|---:|---:|---|
| Jasmine base entry | `0x16F7` | `0x01` | Confirmed |
| Jasmine information/update | `0x16EC` | `0x04` | Confirmed |

This completes the previously unresolved Jasmine mapping.
