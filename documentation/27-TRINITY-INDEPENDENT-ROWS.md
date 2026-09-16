# Trinity Independent Completion Rows

## Change

The Trinity section no longer uses the five color counters to decide the state of a physical Trinity location.

Each Trinity is now rendered as its own independent completion row.

- Confirmed locations read their exact persistent offset + mask.
- Unconfirmed action-dependent locations remain **Unknown**.
- A pending row is never marked Found/Not Found from the Blue/Red/Green/Yellow/White count.
- The raw color counters at `0x1C66..0x1C6B` remain parsed for research/debugging only.

## Current mapping status

- Total physical Trinity locations: **46**
- Independently mapped: **38**
- Pending action/environment mappings: **8**
- Pending test numbers: **3, 4, 18, 19, 20, 24, 32, 34**

## Why

Several Trinity actions also alter persistent environmental state. A color count can prove how many marks of a color were used, but cannot safely identify which unresolved physical mark caused the change. Independent rows prevent false completion assignments while those action flags are still being researched.
