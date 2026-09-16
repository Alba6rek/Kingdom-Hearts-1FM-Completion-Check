# World URLs, Hint Label, and Gummi Mapping Acceptance

## World Progress URLs

Every World Progress row now links to the matching KHGuides walkthrough.
The URL mapping lives in `kh1-content.js` as `WORLD_PROGRESS_URLS`, because
external links are interface metadata rather than binary save structure.

Mapped worlds:

- Traverse Town
- Wonderland
- Olympus Coliseum
- Deep Jungle
- Agrabah
- Atlantica
- Halloween Town
- Neverland
- Hollow Bastion
- End of the World
- Monstro
- 100 Acre Wood / Hundred Acre Wood

## Hint display

The `Hint:` label is always visible. The actual hint text remains hidden until
hover or keyboard focus.

## Gummi Ship Blueprint order

The 48-byte ownership table remains `0xBEBF..0xBEEE`. The project now accepts
the complete 48-entry index-to-name order after the user's one-hot save
spot-checks matched the expected blueprint names.
