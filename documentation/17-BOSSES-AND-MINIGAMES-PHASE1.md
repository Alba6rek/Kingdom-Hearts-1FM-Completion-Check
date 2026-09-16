# Bosses and Minigames — Phase 1

## Boss completion

The project now parses persistent boss completion centrally.

Architecture:

```text
kh1-database.js
    KH1_BOSS_COMPLETION_STATES
    technical offsets / masks / thresholds only

kh1-dictionary.js
    BOSS_NAMES

LoadSaveFile.js
    ParseBossCompletion()

KH1CheckCompletion.js
    defeated / mapped target / percentage / unknown count

kh1-content.js
    world grouping, hints, URLs

index.js
    UI only
```

### Currently mapped bosses

The following use persistent story progress, direct save flags, Ansem Report
defeat rewards, or Coliseum cup completion.

Darkside is now directly covered by the user's controlled before/after save:

```text
Slot 1 before Darkside: 0x1514 = 0x00
Slot 2 after Darkside:  0x1514 = 0x01
```

Cloud uses the project rule that completing the Preliminary Tournament counts
him as defeated. Olympus story progress `>= 0x22` is therefore the Cloud
completion condition.

```text
Darkside

Guard Armor
Opposite Armor
Red Armor
Trickmaster

Cloud
Cerberus
Hercules
Hades
Rock Titan
Ice Titan
Sephiroth

Sabor
Clayton
Stealth Sneak

Pot Centipede
Cave of Wonders Guardian
Jafar
Genie Jafar
Kurt Zisa

Parasite Cage - First Battle
Parasite Cage - Second Battle

The Shark
Ursula - First Battle
Ursula - Final Battle

Lock, Shock, and Barrel
Oogie Boogie
Oogie's Manor

AntiSora
Captain Hook
Phantom

Riku
Maleficent
Dragon Maleficent
Riku-Ansem
Behemoth
Unknown

Chernabog
```

### Still requiring controlled mapping

```text
No ordinary/main boss entries remain from the current research list.
```

The final sequence:

```text
Ansem, Seeker of Darkness
Darkside - Final
World of Chaos
```

does not have a normal post-final-boss save. The UI keeps those entries visible
and explicitly notes this persistence problem rather than pretending they are
ordinary missing mappings.

---

# Journal Mini Games

The Journal list has eight entries:

```text
Jungle Slider
Vine Jump

Pooh's Hunny Hunt
Block Tigger
Pooh's Swing
Tigger's Giant Pot
Pooh's Muddy Path

Olympus Coliseum
```

Destiny Islands duels and the Riku race were removed from this section because
they are not part of Jiminy's Journal Mini Games list.

## Hundred Acre Wood

Completion flags:

```text
0x19D6

0x20  Pooh's Hunny Hunt      CONFIRMED
0x10  Block Tigger           CONFIRMED
0x08  Pooh's Swing           STRONG
0x04  Tigger's Giant Pot     STRONG
0x02  Pooh's Muddy Path      STRONG
```

Known complete save:

```text
0x19D6 = 0x3E
```

which is exactly five set bits.

### Personal records

```text
0x17DC  Pooh's Hunny Hunt
0x17F0  Block Tigger
0x1804  Pooh's Swing
0x1818  Tigger's Giant Pot
0x182C  Pooh's Muddy Path
```

The record structures are exactly `0x14` bytes apart.

Direct controlled tests already confirmed:

```text
0x17DC = Hunny Hunt score
0x17F0 = Block Tigger score
```

The complete save provides:

```text
0x1804 = 45
    -> plausible Pooh's Swing record = 45 yards

0x1818 = 2563
    -> 25.63 seconds for Tigger's Giant Pot

0x182C = 20974
    -> 3:29.74 for Pooh's Muddy Path
```

These match the expected units and are classified as **strongly inferred**
until separately controlled.

Untouched score fields use:

```text
0xFFFFFFFF
```

The parser displays time records in `M:SS.cc` format.

---

# Research still needed

## Minigames

Need controlled before/after saves for:

```text
Jungle Slider
Vine Jump
Olympus Coliseum time-trial records
```

The Olympus Journal entry contains the time-trial records for:

```text
Phil Cup
Pegasus Cup
Hercules Cup
Hades Cup
```

A research spreadsheet is provided with the project release.
