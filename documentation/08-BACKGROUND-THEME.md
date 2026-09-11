# Background Theme

The page now uses the user-provided chalk-wall image as the main background.

## Asset location

```text
src/assets/destiny-island-wall.jpg
```

## Main styling file

```text
src/css/style.css
```

Look for the section:

```text
DESTINY ISLAND WALL THEME
```

## What changed

- Added the uploaded image as the page background.
- Added a dark glass-like overlay so text stays readable.
- Shifted the palette toward:
  - slate / stone blue
  - silver white
  - misty light blue
- Restyled:
  - background
  - content container
  - tabs
  - buttons
  - collapsible sections
  - section blocks
  - progress bars

## If you want to replace the background later

Replace:

```text
src/assets/destiny-island-wall.jpg
```

with another image of the same file name, or change the path inside
`src/css/style.css`.

The important rule is this background declaration:

```css
#background {
  background:
    ...,
    url("../assets/destiny-island-wall.jpg");
}
```

## Design note

The new theme is meant to match the uploaded image:
- soft chalk white highlights
- cool blue-gray shadow tones
- subtle glow, not overly saturated
- readable UI panels above a detailed image background
