# Complete Journal One-Bit Mapping

## Test scope

Every candidate bit from `0x16E6` through `0x16F2` was tested individually.

```text
104 candidate bits
global bit 0 -> 0x16E6 / 0x01
global bit 103 -> 0x16F2 / 0x80
```

Result:

```text
83 unique Journal characters directly identified
20 expected Journal characters not identified by a single bit in this region
5 candidate bits produced no visible Journal change
```

## Full bit results

| Global bit | Offset | Mask | Result | Normalized character |
|---:|---|---|---|---|
| 0 | `0x16E6` | `0x01` | Cid | Cid |
| 1 | `0x16E6` | `0x02` | Cloud | Cloud |
| 2 | `0x16E6` | `0x04` | Aerith | Aerith |
| 3 | `0x16E6` | `0x08` | Yuffie | Yuffie |
| 4 | `0x16E6` | `0x10` | Leon | Leon |
| 5 | `0x16E6` | `0x20` | Brooms | Brooms |
| 6 | `0x16E6` | `0x40` | 99 Puppies | 99 Puppies |
| 7 | `0x16E6` | `0x80` | Perdita | Perdita |
| 8 | `0x16E7` | `0x01` | Aurora | Aurora |
| 9 | `0x16E7` | `0x02` | Cinderella | Cinderella |
| 10 | `0x16E7` | `0x04` | Snow White | Snow White |
| 11 | `0x16E7` | `0x08` | Ansem without face picture | Ansem |
| 12 | `0x16E7` | `0x10` | Moogles | Moogles |
| 13 | `0x16E7` | `0x20` | Wakka | Wakka |
| 14 | `0x16E7` | `0x40` | Selphie | Selphie |
| 15 | `0x16E7` | `0x80` | Tidus | Tidus |
| 16 | `0x16E8` | `0x01` | Dumbo | Dumbo |
| 17 | `0x16E8` | `0x02` | Ansem with face picture and more journal details | Ansem |
| 18 | `0x16E8` | `0x04` | Dragon | Dragon |
| 19 | `0x16E8` | `0x08` | Maleficent information | Maleficent |
| 20 | `0x16E8` | `0x10` | Maleficent Different information | Maleficent |
| 21 | `0x16E8` | `0x20` | Maleficent Different information | Maleficent |
| 22 | `0x16E8` | `0x40` | Beast | Beast |
| 23 | `0x16E8` | `0x80` | Belle | Belle |
| 24 | `0x16E9` | `0x01` | Card (Spades) | Cards (Spades) |
| 25 | `0x16E9` | `0x02` | Card (Hearts) | Cards (Hearts) |
| 26 | `0x16E9` | `0x04` | Queen of Hearts | Queen of Hearts |
| 27 | `0x16E9` | `0x08` | Alice | Alice |
| 28 | `0x16E9` | `0x10` | Alice Different information | Alice |
| 29 | `0x16E9` | `0x20` | Simba | Simba |
| 30 | `0x16E9` | `0x40` | Mushu | Mushu |
| 31 | `0x16E9` | `0x80` | Bambi | Bambi |
| 32 | `0x16EA` | `0x01` | Cerberus | Cerberus |
| 33 | `0x16EA` | `0x02` | Hades | Hades |
| 34 | `0x16EA` | `0x04` | Hades Different information | Hades |
| 35 | `0x16EA` | `0x08` | Philoctetes | Philoctetes |
| 36 | `0x16EA` | `0x10` | Hercules | Hercules |
| 37 | `0x16EA` | `0x20` | Doorknob | Doorknob |
| 38 | `0x16EA` | `0x40` | Cheshire Cat | Cheshire Cat |
| 39 | `0x16EA` | `0x80` | White Rabbit | White Rabbit |
| 40 | `0x16EB` | `0x01` | Kala | Kala |
| 41 | `0x16EB` | `0x02` | Kerchak | Kerchak |
| 42 | `0x16EB` | `0x04` | Terk | Terk |
| 43 | `0x16EB` | `0x08` | Clayton | Clayton |
| 44 | `0x16EB` | `0x10` | Clayton Different information | Clayton |
| 45 | `0x16EB` | `0x20` | Jane Porter | Jane Porter |
| 46 | `0x16EB` | `0x40` | Tarzan | Tarzan |
| 47 | `0x16EB` | `0x80` | Rock Titan | Rock Titan |
| 48 | `0x16EC` | `0x01` | Jafar | Jafar |
| 49 | `0x16EC` | `0x02` | Jafar Different information | Jafar |
| 50 | `0x16EC` | `0x04` | Jasmine | Jasmine |
| 51 | `0x16EC` | `0x08` | Genie | Genie |
| 52 | `0x16EC` | `0x10` | Genie Different information | Genie |
| 53 | `0x16EC` | `0x20` | Aladdin | Aladdin |
| 54 | `0x16EC` | `0x40` | Aladdin Different information | Aladdin |
| 55 | `0x16EC` | `0x80` | Sabor | Sabor |
| 56 | `0x16ED` | `0x01` | Geppetto | Geppetto |
| 57 | `0x16ED` | `0x02` | Geppetto Different information | Geppetto |
| 58 | `0x16ED` | `0x04` | Pinocchio | Pinocchio |
| 59 | `0x16ED` | `0x08` | Pinocchio Different information | Pinocchio |
| 60 | `0x16ED` | `0x10` | Carpet | Carpet |
| 61 | `0x16ED` | `0x20` | Lagom | Iago |
| 62 | `0x16ED` | `0x40` | Abu | Abu |
| 63 | `0x16ED` | `0x80` | Jafar Genie | Jafar–Genie |
| 64 | `0x16EE` | `0x01` | Flounder | Flounder |
| 65 | `0x16EE` | `0x02` | Sebastian | Sebastian |
| 66 | `0x16EE` | `0x04` | Ursula | Ursula |
| 67 | `0x16EE` | `0x08` | Ursula Different information | Ursula |
| 68 | `0x16EE` | `0x10` | King Triton | King Triton |
| 69 | `0x16EE` | `0x20` | Ariel | Ariel |
| 70 | `0x16EE` | `0x40` | Ariel Different information | Ariel |
| 71 | `0x16EE` | `0x80` | Jiminy Cricket | Jiminy Cricket |
| 72 | `0x16EF` | `0x01` | Zero | Zero |
| 73 | `0x16EF` | `0x02` | Dr. Frinkelstein | Dr. Finkelstein |
| 74 | `0x16EF` | `0x04` | Oogie Boogie | Oogie Boogie |
| 75 | `0x16EF` | `0x08` | Oogie Boogie Different information | Oogie Boogie |
| 76 | `0x16EF` | `0x10` | Sally | Sally |
| 77 | `0x16EF` | `0x20` | Jack Skellington | Jack Skellington |
| 78 | `0x16EF` | `0x40` | Flotsam | Flotsam |
| 79 | `0x16EF` | `0x80` | Jetsam | Jetsam |
| 80 | `0x16F0` | `0x01` | Wendy | Wendy |
| 81 | `0x16F0` | `0x02` | Tinker Bell | Tinker Bell |
| 82 | `0x16F0` | `0x04` | Tinker Bell Different information | Tinker Bell |
| 83 | `0x16F0` | `0x08` | Peter Pan | Peter Pan |
| 84 | `0x16F0` | `0x10` | The Mayor | The Mayor |
| 85 | `0x16F0` | `0x20` | Barrel | Barrel |
| 86 | `0x16F0` | `0x40` | Shock | Shock |
| 87 | `0x16F0` | `0x80` | Lock | Lock |
| 88 | `0x16F1` | `0x01` | Owl | Owl |
| 89 | `0x16F1` | `0x02` | Tigger | Tigger |
| 90 | `0x16F1` | `0x04` | Piglet | Piglet |
| 91 | `0x16F1` | `0x08` | Winnie the Pooh | Winnie the Pooh |
| 92 | `0x16F1` | `0x10` | The Crocodile | The Crocodile |
| 93 | `0x16F1` | `0x20` | Mr. Smee | Mr. Smee |
| 94 | `0x16F1` | `0x40` | Captain Hook | Captain Hook |
| 95 | `0x16F1` | `0x80` | Captain Hook Different information | Captain Hook |
| 96 | `0x16F2` | `0x01` | Nothing Found | No visible change |
| 97 | `0x16F2` | `0x02` | Nothing Found | No visible change |
| 98 | `0x16F2` | `0x04` | Nothing Found | No visible change |
| 99 | `0x16F2` | `0x08` | Nothing Found | No visible change |
| 100 | `0x16F2` | `0x10` | Nothing Found | No visible change |
| 101 | `0x16F2` | `0x20` | Roo | Roo |
| 102 | `0x16F2` | `0x40` | Eyeore | Eeyore |
| 103 | `0x16F2` | `0x80` | Rabbit | Rabbit |

## No-visible-change bits

These five bits did not produce a visible Journal character/change when tested alone:

- Global bit 96: `0x16F2 / 0x01`
- Global bit 97: `0x16F2 / 0x02`
- Global bit 98: `0x16F2 / 0x04`
- Global bit 99: `0x16F2 / 0x08`
- Global bit 100: `0x16F2 / 0x10`

Do not assume these are unused. They may require another story bit, another Journal bit, or a prerequisite state.

## Characters still not individually mapped

- Sora
- Riku
- Kairi
- Mickey Mouse
- Donald Duck
- Goofy
- Minnie Mouse
- Daisy Duck
- Pluto
- Chip
- Dale
- Huey
- Dewey
- Louie
- Merlin
- Fairy Godmother
- Pongo
- Sephiroth
- Unknown
- Ice Titan

### Existing external proxies

- Sephiroth already has a known defeat flag at `0x0F6A` in the project.
- Ice Titan already has a known defeat flag at `0x0F69` in the project.

Those boss flags can be useful completion proxies, but the one-bit experiment did not identify a dedicated character-state bit for them inside `0x16E6..0x16F2`.

## Normalization note

The workbook result for global bit 61 (`0x16ED / 0x20`) says **"Lagom"**. Because Iago is the remaining Agrabah Journal character and the bit sits in the Agrabah sequence, the project normalizes this result to **Iago**. The raw user result is preserved in the variant label and the mapping is marked as interpreted rather than silently treated as exact.