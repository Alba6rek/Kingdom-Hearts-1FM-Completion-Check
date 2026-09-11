# Tabs, Lists, Hints and External Links

The analyzer interface is now split into six tabs underneath the always-visible
**Game Status** section:

```text
Main
Essentials
Journal
Synthesis
Collectable
Extra
```

The UI lists themselves are defined in:

```text
src/js/kh1-content.js
```

This is the easiest file to edit when you want to:

- add/remove/reorder Keyblades
- add a hint
- add an exact external URL
- add a boss that is not mapped yet
- add a minigame
- add a character under a world
- add a synthesis item
- connect a list entry to a newly discovered completion flag

---

# 1. File responsibility

The project now follows this separation:

```text
kh1-database.js
    WHERE is the binary value?

kh1-dictionary.js
    WHAT does a numeric game ID mean?

kh1-functions.js
    HOW is the binary structure decoded?

LoadSaveFile.js
    BUILD the parsed save object.

KH1CheckCompletion.js
    DEFINE completion rules.

kh1-content.js
    WHAT should the interface list?
    In which order?
    What hint/link belongs to an entry?

index.js
    RENDER the tabs and interface.

KH1Research.js
    INVESTIGATE unknown values.
```

---

# 2. Main tabs

The tab order is controlled by:

```javascript
TABS: [
  { id: "main",        name: "Main" },
  { id: "essentials",  name: "Essentials" },
  { id: "journal",     name: "Journal" },
  { id: "synthesis",   name: "Synthesis" },
  { id: "collectable", name: "Collectable" },
  { id: "extra",       name: "Extra" }
]
```

The actual contents of the tabs are rendered in `index.js`:

```javascript
RenderMainTab(slot)
RenderEssentialsTab(slot)
RenderJournalTab(slot)
RenderSynthesisTab(slot)
RenderCollectableTab(slot)
RenderExtraTab(slot)
```

`RenderGameStatus(slot)` is called before the tabs and is therefore always
visible.

---

# 3. Minimizing a list

Every main list uses an HTML `<details>` element.

For example:

```javascript
return BuildCollapsibleSection({
  title: "Bosses",
  body,
  description: "...",
  open: false
});
```

Use:

```javascript
open: true
```

if the section should start expanded.

Use:

```javascript
open: false
```

if it should start minimized.

The user can always expand/minimize it afterward.

---

# 4. Adding a hint

Most records in `kh1-content.js` have:

```javascript
hint: ""
```

Example:

```javascript
{
  itemId: 81,
  name: "Kingdom Key",
  hint: "",
  url: ""
}
```

Change it to:

```javascript
{
  itemId: 81,
  name: "Kingdom Key",
  hint: "Your hint goes here.",
  url: ""
}
```

The interface automatically displays:

```text
Hint: Your hint goes here.
```

No change to `index.js` is required.

---

# 5. External links

Every content entry supports:

```javascript
url: ""
```

If it is empty, the interface automatically creates a KHGuides
search link based on the entry name.

For example:

```javascript
{
  name: "Ice Titan",
  hint: "",
  url: ""
}
```

will still be clickable.

To force a specific external page:

```javascript
{
  name: "Ice Titan",
  hint: "",
  url: "https://www.khguides.com/kh/combat/bosses/"
}
```

`index.js` renders external links with:

```html
target="_blank"
rel="noopener noreferrer"
```

so they open in a separate tab/window.

---

# 6. Keyblades, Shields and Staves

These lists use item IDs:

```javascript
{
  itemId: 100,
  name: "Ultima Weapon",
  hint: "",
  url: ""
}
```

Ownership is checked against:

```text
slot.inventory
```

and the currently equipped weapon of every parsed character.

This means a starting/equipped weapon can still be recognized even when the
inventory quantity is not the best indicator.

To add another item:

```javascript
KEYBLADES: [
  // existing entries

  {
    itemId: YOUR_ITEM_ID,
    name: "New Keyblade",
    hint: "",
    url: ""
  }
]
```

---

# 7. Magic upgrade sources

Each spell contains:

```javascript
upgradeHints: [
  "",
  "",
  ""
]
```

The positions are:

```text
0 = source/hint for level 1
1 = source/hint for level 2
2 = source/hint for level 3
```

Example:

```javascript
{
  name: "Fire",

  tiers: [
    "Not Obtained",
    "Fire",
    "Fira",
    "Firaga"
  ],

  upgradeHints: [
    "How Fire is obtained",
    "How Fira is obtained",
    "How Firaga is obtained"
  ],

  hint: "",
  url: ""
}
```

The save only tells the current spell level.

`upgradeHints` is where you can record the acquisition source after verifying
where each upgrade comes from.

---

# 8. Adding a boss before its save flag is known

This is supported intentionally.

Add:

```javascript
{
  world: "Agrabah",
  name: "New Boss",
  completionSource: null,
  hint: "",
  url: ""
}
```

The interface displays:

```text
? New Boss                  Mapping needed
```

This is preferable to incorrectly showing it as missing.

---

# 9. Connecting a boss after finding its flag

Suppose you later add this parsed value:

```javascript
slot.completion.newBossDefeated
```

Change the boss record to:

```javascript
{
  world: "Agrabah",
  name: "New Boss",

  completionSource: {
    type: "completionBoolean",
    key: "newBossDefeated"
  },

  hint: "",
  url: ""
}
```

You do not need to rewrite the boss renderer.

`ResolveCompletionSource()` in `index.js` will automatically read:

```javascript
slot.completion.newBossDefeated
```

and show:

```text
✓ Defeated
```

or:

```text
✕ Not Defeated
```

---

# 10. Characters and minigames

They work the same way.

An unmapped character:

```javascript
{
  name: "Alice",
  statusSource: null,
  hint: "",
  url: ""
}
```

An unmapped minigame:

```javascript
{
  world: "Deep Jungle",
  name: "Jungle Slider",
  statusSource: null,
  hint: "",
  url: ""
}
```

Both appear as:

```text
? Mapping needed
```

When you identify a boolean save flag, change to:

```javascript
statusSource: {
  type: "completionBoolean",
  key: "jungleSliderFinished"
}
```

provided `LoadSaveFile.js` already exposes:

```javascript
slot.completion.jungleSliderFinished
```

---

# 11. Synthesis

All 33 Kingdom Hearts Final Mix synthesis entries are already listed in:

```javascript
SYNTHESIS_SETS
```

Each entry has:

```javascript
craftedSource: null
```

because current inventory ownership is not proof that an item was synthesized
at least once.

The UI therefore shows both concepts separately:

```text
Crafted: Mapping needed
Owned now
```

When you find the true crafted-at-least-once flag, change the record to point
to the parsed boolean value.

Example:

```javascript
{
  itemId: 100,
  name: "Ultima Weapon",

  craftedSource: {
    type: "completionBoolean",
    key: "synthUltimaWeapon"
  },

  hint: "",
  url: ""
}
```

---

# 12. Adding a completely new list to a tab

Example: add a "Special Items" list to Main.

Create a list in `kh1-content.js`:

```javascript
SPECIAL_ITEMS: [
  {
    itemId: 200,
    name: "Example",
    hint: "",
    url: ""
  }
]
```

Create a renderer in `index.js`:

```javascript
function RenderSpecialItems(slot) {
  return RenderEquipmentList(
    slot,
    "Special Items",
    KH1_CONTENT.SPECIAL_ITEMS,
    false
  );
}
```

Then add it to:

```javascript
function RenderMainTab(slot) {
  return [
    RenderWorlds(slot),
    RenderEquipmentList(...),
    RenderSpecialItems(slot)
  ].join("");
}
```

---

# 13. Unknown versus missing

Use the states carefully:

```text
complete
    We know the mapping and it is complete.

missing
    We know the mapping and it is not complete.

partial
    We know the numeric progress and it is partially complete.

unknown
    The entry exists, but its save mapping is not known yet.

info
    Informational/statistical row.
```

Do not show an unmapped boss or minigame as `missing`.

Use:

```javascript
state: "unknown"
```

until its save data is identified.

This is important for reverse-engineering accuracy.


---

# Hover to reveal hidden items

When **Spoilers** is disabled, missing/spoiler item names remain hidden.

The user can temporarily reveal a hidden name by hovering the mouse over it.

```text
Hidden normally
    ↓ hover
Visible while hovering
    ↓ mouse leaves
Hidden again
```

This behavior is controlled in `src/css/style.css` by:

```css
.spoiler-text.blurred:hover {
  color: inherit;
  background-color: transparent;
  text-shadow: inherit;
  user-select: text;
}
```

The global Spoilers checkbox still permanently reveals all spoiler names.


---

# Hidden hints

A hint is rendered only when its `hint` field in `kh1-content.js` is non-empty.

For example:

```javascript
{
  itemId: 100,
  name: "Ultima Weapon",
  hint: "Example hint text.",
  url: ""
}
```

The interface initially shows the hint as a hidden placeholder:

```text
████████████
```

Hover over the placeholder:

```text
Hint: Example hint text.
```

Move the mouse away and it becomes hidden again.

The complete hint line is hidden, including the `Hint:` label.

Keyboard users can also focus the hidden hint to reveal it.

## Important

The project currently intentionally contains many entries like:

```javascript
hint: ""
```

An empty hint is not rendered at all, because there is no text to reveal.

Therefore, to test the feature, temporarily put text into one of the `hint`
fields in:

```text
src/js/kh1-content.js
```

For example:

```javascript
hint: "TEST HINT"
```

Then rebuild the project.



---

# KHGuides link policy

All game-guide links in the analyzer now use:

```text
https://www.khguides.com/
```

The project uses relevant KHGuides category pages where possible:

```text
Keyblades / Staves / Shields
    https://www.khguides.com/kh/inventory/weapons/

Magic
    https://www.khguides.com/kh/combat/magic/

Summons
    https://www.khguides.com/kh/combat/summons/

Journal Characters
    https://www.khguides.com/kh/inventory/journal/

Heartless
    https://www.khguides.com/kh/combat/enemies/

Bosses
    https://www.khguides.com/kh/combat/bosses/

Synthesis
    https://www.khguides.com/kh/inventory/synthesis/

Postcards
    https://www.khguides.com/kh/side-quests/postcards/

Trinities
    https://www.khguides.com/kh/collectibles/trinities/

Puppies
    https://www.khguides.com/kh/collectibles/puppies/

Chests / Treasures
    https://www.khguides.com/kh/collectibles/treasures/

Minigames / Coliseum
    https://www.khguides.com/kh/side-quests/

Atlantica Clams
    https://www.khguides.com/kh/atlantica/
```

If an entry has no specific URL, `ResolveUrl()` falls back to:

```text
https://www.khguides.com/kh/
```

The Google Fonts URLs and the project's own GitHub/footer links are not game
guide links and are intentionally left unchanged.
