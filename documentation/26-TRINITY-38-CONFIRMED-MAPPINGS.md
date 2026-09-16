# Trinity Physical-Location Mapping — 38 Confirmed

Controlled tests were performed from clean **Slot 99**. Each confirmed test changed exactly one Trinity color counter and exactly one bit in the persistent mark table `0x1C6C..0x1C7F`.

The project now uses the exact physical-location flags for **38/46** Trinity marks instead of treating all rows as count-based placeholders.

## Confirmed mappings

| Test | Trinity | World | Area | Offset | Mask |
|---:|---|---|---|---:|---:|
| 1 | Blue #1 | Traverse Town | First District | `0x1C6C` | `0x40` |
| 2 | Blue #2 | Traverse Town | First District | `0x1C6C` | `0x20` |
| 5 | Blue #5 | Wonderland | Lotus Forest | `0x1C6E` | `0x20` |
| 6 | Blue #6 | Wonderland | Lotus Forest | `0x1C6E` | `0x40` |
| 7 | Blue #7 | Olympus Coliseum | Gates | `0x1C70` | `0x40` |
| 8 | Blue #8 | Olympus Coliseum | Gates | `0x1C70` | `0x20` |
| 9 | Blue #9 | Deep Jungle | Camp | `0x1C72` | `0x20` |
| 10 | Blue #10 | Deep Jungle | Climbing Trees | `0x1C72` | `0x10` |
| 11 | Blue #11 | Agrabah | Bazaar | `0x1C74` | `0x40` |
| 12 | Blue #12 | Agrabah | Cave of Wonders: Silent Chamber | `0x1C74` | `0x04` |
| 13 | Blue #13 | Monstro | Mouth | `0x1C76` | `0x20` |
| 14 | Blue #14 | Monstro | Chamber 5 | `0x1C76` | `0x08` |
| 15 | Blue #15 | Monstro | Throat | `0x1C76` | `0x10` |
| 16 | Blue #16 | Hollow Bastion | Waterway: Dungeon | `0x1C7B` | `0x20` |
| 17 | Blue #17 | Hollow Bastion | Great Crest | `0x1C7B` | `0x40` |
| 21 | Red #4 | Agrabah | Treasure Room | `0x1C74` | `0x08` |
| 22 | Red #5 | Halloween Town | Oogie's Manor | `0x1C78` | `0x40` |
| 23 | Red #6 | Hollow Bastion | Entrance Hall | `0x1C7C` | `0x80` |
| 25 | Green #2 | Wonderland | Bizarre Room | `0x1C6E` | `0x08` |
| 26 | Green #3 | Wonderland | Rabbit Hole | `0x1C6E` | `0x10` |
| 27 | Green #4 | Olympus Coliseum | Gates | `0x1C70` | `0x08` |
| 28 | Green #5 | Deep Jungle | Treetops | `0x1C72` | `0x08` |
| 29 | Green #6 | Agrabah | Storage Room | `0x1C74` | `0x20` |
| 30 | Green #7 | Monstro | Mouth | `0x1C76` | `0x40` |
| 31 | Green #8 | Neverland | Cabin | `0x1C7A` | `0x01` |
| 33 | Yellow #1 | Traverse Town | Mystical House | `0x1C6D` | `0x40` |
| 35 | Yellow #3 | Agrabah | Cave of Wonders: Hall | `0x1C74` | `0x10` |
| 36 | Yellow #4 | Neverland | Hold | `0x1C7A` | `0x02` |
| 37 | White #1 | Traverse Town | Waterway | `0x1C6C` | `0x80` |
| 38 | White #2 | Wonderland | Lotus Forest | `0x1C6E` | `0x80` |
| 39 | White #3 | Olympus Coliseum | Gates | `0x1C70` | `0x04` |
| 40 | White #4 | Deep Jungle | Cavern of Hearts | `0x1C72` | `0x80` |
| 41 | White #5 | Agrabah | Cave of Wonders: Entrance | `0x1C74` | `0x80` |
| 42 | White #6 | Monstro | Chamber 6 | `0x1C76` | `0x80` |
| 43 | White #7 | Atlantica | Triton's Palace | `0x1C7F` | `0x80` |
| 44 | White #8 | Halloween Town | Moonlight Hill | `0x1C78` | `0x80` |
| 45 | White #9 | Neverland | Ship | `0x1C7A` | `0x80` |
| 46 | White #10 | Hollow Bastion | Rising Falls | `0x1C7B` | `0x80` |

## Action-dependent mappings still pending

These eight locations could not be tested from the reset baseline because another persistent action/environment state prevents the normal Trinity interaction from appearing. No bit is guessed for them.

| Test | Trinity | World | Area | Physical location |
|---:|---|---|---|---|
| 3 | Blue #3 | Traverse Town | Third District | Behind the Lady & the Tramp fountain |
| 4 | Blue #4 | Traverse Town | Magician's Study | Near the save station |
| 18 | Red #1 | Traverse Town | First District | Wooden fence in alley behind Item Shop |
| 19 | Red #2 | Traverse Town | Alleyway | Metal grate blocking the Waterway |
| 20 | Red #3 | Traverse Town | Second District | Wooden planks in front of bell tower |
| 24 | Green #1 | Traverse Town | First District: Accessory Shop | In front of the center table |
| 32 | Green #9 | Hollow Bastion | Library | Second floor near bookcase/table/balcony |
| 34 | Yellow #2 | Olympus Coliseum | Lobby | In front of the large pedestal |

Pending test numbers: **3, 4, 18, 19, 20, 24, 32, 34**.

### UI behavior for pending rows

Every Trinity row is now independent. The project does **not** use the Blue/Red/Green/Yellow/White counters to decide any physical Trinity row. Confirmed rows use their exact offset + mask. The eight action-dependent rows remain `Unknown` until their own environmental/action flags are mapped.

### Important reset note

Resetting only `0x1C66..0x1C6B` and `0x1C6C..0x1C7F` is not sufficient for the eight action-dependent locations. Their environmental/action flags must be identified separately before a complete "all Trinity interactions restored" Slot 99 reset can be claimed.
