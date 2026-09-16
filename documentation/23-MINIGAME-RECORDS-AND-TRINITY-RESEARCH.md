# Minigame Records and Trinity Research

## Jungle Slider

The user's Slot 1 and Journal screenshots confirm five course leaderboard blocks.
Each course stores five `uint32 LE` frame counts, with a stride of `0x14` bytes.
Unused entries are `0xFFFFFFFF`. Times are 60 fps frame counts and the game
**truncates** hundredths rather than rounding.

```text
Green Serpent  0x1728..0x1738
Splash Tunnel  0x173C..0x174C
Jade Spiral    0x1750..0x1760
Panic Fall     0x1764..0x1774
Shadow Cavern  0x1778..0x1788
```

Slot 1 currently has: 

```text
Green Serpent  00:31.33, 00:32.65, 00:33.38, 00:34.08
Splash Tunnel  01:30.51
Jade Spiral    02:00.08
Panic Fall     no record
Shadow Cavern  no record
```

Overall Jungle Slider completion is 3/5 courses.

## Vine Jump

Four courses, five records each, same 0x14-byte stride:

```text
Jump Course       0x178C..0x179C
Trap Course       0x17A0..0x17B0
Acrobatic Course  0x17B4..0x17C4
Expert Course     0x17C8..0x17D8
```

Slot 1 currently has Jump Course `00:51.11`; the other three are blank.
Overall Vine Jump completion is 1/4 courses.

## Olympus Coliseum Journal records

Four consecutive 60 fps frame-count records:

```text
Phil Cup      0x0F4C
Pegasus Cup   0x0F50
Hercules Cup  0x0F54
Hades Cup     0x0F58
```

Slot 1 currently decodes to:

```text
Phil Cup      00:57.06
Pegasus Cup   no record
Hercules Cup  no record
Hades Cup     04:12.50
```

Overall Olympus Coliseum Journal minigame completion is 2/4 cup records.

## Trinity persistent state

Natural Slot 4-8 progression reveals a 20-byte persistent mark table:

```text
Counters:    0x1C66..0x1C6B
Mark flags:  0x1C6C..0x1C7F
Unlocks:     0x1C1B
```

For Slots 4-8, the popcount of `0x1C6C..0x1C7F` exactly equals the sum of
the color counters. The completed Slot 1 has 46 in its counters but 45 set bits
in the persistent table, so one Trinity is exceptional / story-tracked.

The supplied research save clears the counters and 20-byte mark table while
leaving `0x1C1B = 0x1F`, so all Trinity abilities remain unlocked.
