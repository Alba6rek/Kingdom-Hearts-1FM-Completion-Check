# Granular Essentials Lists

The Essentials tab now displays **Postcards, Trinity Marks, and Atlantica
Clams one entry per line**.

---

# Postcards

The save currently contains:

```text
0x1CBF
postcards mailed count
```

This is a count from `0` to `10`.

It is not currently a set of ten unique postcard identity flags.

Therefore the UI displays:

```text
Postcard Mail #1    Mailed
Postcard Mail #2    Mailed
Postcard Mail #3    Mailed
Postcard Mail #4    Not Mailed
...
```

when:

```text
postcardsMailed = 3
```

These lines represent the sequential mailing/reward steps.

Editable metadata is in:

```text
src/js/kh1-content.js
KH1_CONTENT.POSTCARDS
```

You can add a hint or custom URL to every row.

---

# Trinity Marks

Known decoded data:

```text
Blue   0..17
Red    0..6
Green  0..9
Yellow 0..4
White  0..10
```

Total:

```text
46
```

The save region we currently use gives **counts**, not individual persistent
location flags.

Therefore the UI can correctly show 46 separate progress rows, but the row
numbers are count slots rather than confirmed world-location identities.

Example:

```text
Blue count = 3

Blue Trinity #1   Found
Blue Trinity #2   Found
Blue Trinity #3   Found
Blue Trinity #4   Not Found
...
```

This does **not** yet mean we know which three Blue Trinity locations the
player actually activated.

For that reason every row includes the development note:

```text
Count-based progress row. Exact physical Trinity location flag is not mapped yet.
```

When the per-location flags are discovered, the metadata structure is already
ready to rename entries to things like:

```text
Blue Trinity - Traverse Town ...
Blue Trinity - Wonderland ...
```

and attach individual hints/links.

Editable list metadata:

```text
src/js/kh1-content.js
KH1_CONTENT.TRINITY_MARKS
```

---

# Atlantica Clams

Atlantica is different from Trinity.

The save contains 16 individual bits beginning at:

```text
0x1DA9
```

Length:

```text
2 bytes
16 flags
```

Current bit order:

```text
LSB-first
```

So:

```text
Clam flag 0  -> 0x1DA9 / 0x01
Clam flag 1  -> 0x1DA9 / 0x02
...
Clam flag 7  -> 0x1DA9 / 0x80

Clam flag 8  -> 0x1DAA / 0x01
...
Clam flag 15 -> 0x1DAA / 0x80
```

`ParseAtlanticaClams()` now returns:

```javascript
{
  openedCount,
  target,
  flags,
  openedIndexes,
  rawBytes,
  rawHex
}
```

Each item in `flags` contains:

```javascript
{
  index,
  byteIndex,
  bitIndex,
  mask,
  maskHex,
  saveOffset,
  saveOffsetHex,
  opened
}
```

The Essentials UI therefore displays each one independently:

```text
Atlantica Clam #1    Opened
Atlantica Clam #2    Not Opened
...
```

Editable metadata:

```text
src/js/kh1-content.js
KH1_CONTENT.ATLANTICA_CLAMS
```

Once the exact in-game location belonging to every bit is identified, simply
replace:

```javascript
name: "Atlantica Clam #1",
hint: ""
```

with the actual location and hint. The parser does not need to change.
