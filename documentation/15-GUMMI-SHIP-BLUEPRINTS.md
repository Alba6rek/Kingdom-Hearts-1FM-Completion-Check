# Gummi Ship Blueprints

## Save locations

Two different Gummi Ship structures must not be confused.

```text
0x241C
10 custom/player-created Gummi Ship records
```

The completion checker does **not** use the custom-ship records. Blueprint
ownership is stored in the Gummi inventory area:

```text
0xBE78  combined Gummi inventory start
0xBEB8  seven Gummi upgrade bytes
0xBEBF  first Blueprint ownership byte
0xBEEE  last Blueprint ownership byte

length = 48 bytes
```

Each byte corresponds to one blueprint. `0x00` means missing and a non-zero
value means owned.

The location was cross-checked in the user's PC saves: the 48 bytes form a
clean 0/1 ownership table, and the first byte is the Kingdom model.

## Blueprint order — accepted

The checker uses the in-game menu order:

```text
0  Kingdom
1  Hyperion
2  Geppetto
3  Cid
4  Leon
5  Yuffie
6  Aerith
7  Cactuar
8  Chocobo
9..36  Enemy Models
37..47 Final Mix Mission Models
```

Original-model ordering is supported by legacy individual blueprint addresses,
and a 48-slot one-blueprint-per-slot PC save was generated for direct Steam
verification. The user spot-checked multiple generated slots and reported that
the tested blueprint names matched the expected order. The project therefore
accepts the complete 48-entry index-to-name mapping.

## Completion object

`LoadSaveFile.js` exposes:

```javascript
slot.completion.gummiBlueprints
```

with:

```text
ownedCount
ownedIndexes
entries[]
rawBytes
rawHex
```

`KH1CheckCompletion.js` exposes:

```javascript
slot.completionAnalysis.gummiBlueprints
```

with a target of 48, percentage, complete state, and missing blueprint list.

## UI

The Collectable tab now contains **Gummi Ship Blueprints**, grouped into:

- Special Models
- Enemy Models
- Mission Models

Each group has its own count, and the outer section shows total completion
count and percentage.

## Research sources

- KHGuides Gummi Guide: https://www.khguides.com/kh/collectibles/gummis/
- Kingdom Save Editor PR #120 (custom Gummi ship structure): https://github.com/Xeeynamo/KingdomSaveEditor/pull/120/files
- PS4 Cheat List (combined Gummi block/blueprint inventory): https://jdsnyke.github.io/PS4-Cheat-List/
- Legacy blueprint address ordering: https://deconstruction.fandom.com/wiki/Kingdom_Hearts
