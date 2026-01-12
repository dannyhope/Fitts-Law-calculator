# Fitts' Law Overlay - Chrome Extension

A Chrome extension that visualizes Fitts' Law acquisition times for every clickable element on any webpage.

## Installation

### From Source (Developer Mode)

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension/` directory

## Usage

1. Click the extension icon in your browser toolbar
2. Toggle "Enable Overlay" to activate
3. Move your mouse around the page
4. See predicted acquisition times (in milliseconds) next to every clickable element

**Color coding:**

- 🟡 **Yellow** = Easy to acquire (≤ 400ms)
- 🔴 **Red** = Difficult to acquire (> 400ms)
- 🟢 **Green** = Already acquired (cursor inside element)

## Features

- **Real-time calculations** using Shannon's formulation of Fitts' Law
- **Visual feedback**: Red labels (not acquired) turn green (acquired) when cursor enters
- **Works on any website** - automatically detects all clickable elements
- **Performance optimized** - throttled updates at 60fps
- **Accessible** - respects user motion preferences and high contrast mode

## How It Works

The extension:

1. Detects all clickable elements (links, buttons, inputs, etc.)
2. Tracks your mouse position
3. Calculates the predicted acquisition time for each element using:
    - **D** = Distance from cursor to element entry point
    - **W** = Effective width (overlap through element along approach path)
    - **MT** = a + b × log₂(D/W + 1) where a=0, b=150ms/bit

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab`, `storage`
- **Content Script**: Injected into all pages
- **Update Rate**: ~60fps (requestAnimationFrame)

## Privacy

- No data collection
- No external network requests
- All calculations performed locally
- State saved only in local browser storage

## Development

### File Structure

```
extension/
├── manifest.json          # Extension manifest
├── popup/                 # Extension popup UI
│   ├── popup.html
│   └── popup.js
├── content/              # Content scripts
│   ├── content.js        # Main overlay logic
│   └── content.css       # Overlay styles
├── lib/                  # Shared libraries
│   └── fitts-law.js     # Fitts' Law calculations
└── icons/               # Extension icons
```

### Building Icons

Replace the placeholder icons in `icons/` with properly sized PNG files:

- `icon16.png` - 16×16px
- `icon48.png` - 48×48px
- `icon128.png` - 128×128px

## Feedback

Report issues or suggestions to [danny.hope@gmail.com](mailto:danny.hope@gmail.com)

## License

MIT License - see [LICENSE.md](../LICENSE.md)
