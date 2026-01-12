# Extension Icons

This directory should contain the following PNG icon files:

- `icon16.png` - 16×16 pixels (toolbar icon)
- `icon48.png` - 48×48 pixels (extension management page)
- `icon128.png` - 128×128 pixels (Chrome Web Store)

## Creating Icons

The icons should represent the concept of Fitts' Law - perhaps:

- A target/bullseye
- Cursor with distance lines
- Letter "F" with a cursor
- Graph showing the logarithmic relationship

## Temporary Solution

Until proper icons are created, you can use simple placeholder PNG files:

1. Create square PNG images at the required sizes
2. Use a solid color background (e.g., #9de0ad - the button color from the demo)
3. Add white text "FL" or "F" in the center

## Tools

- [Figma](https://figma.com) - Design icons
- [GIMP](https://www.gimp.org/) - Create/export PNG files
- [ImageMagick](https://imagemagick.org/) - Convert/resize via command line:

```bash
# Example: create simple placeholder
convert -size 128x128 xc:'#9de0ad' -pointsize 72 -fill white -gravity center -annotate +0+0 'FL' icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## Current Status

⚠️ **Placeholder icons needed** - The extension manifest references these icons but they don't exist yet. Create them before loading the extension.
