# Fitts' Law Overlay - Browser Extension

A WebExtension that visualises Fitts' Law acquisition times for every clickable element on any webpage.

Supported browsers are the latest stable releases of Chromium-based browsers,
Firefox, and Safari. The shared source is packaged as a Chromium/Firefox
extension; Safari requires the companion Safari Web Extension project described
below.

## Installation

### Chromium from Source (Developer Mode)

1. Clone this repository
2. Open the browser's extensions page (for Chrome, `chrome://extensions/`)
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension/` directory

### Firefox from Source

1. Open `about:debugging#/runtime/this-firefox`
2. Select **Load Temporary Add-on…**
3. Select `extension/manifest.json`

Temporary Firefox installations are removed when Firefox closes. Public
distribution uses Firefox Add-ons and requires a signed `.xpi` upload.

### Safari

Safari Web Extensions are distributed through a macOS app container. Create an
Xcode **Safari Web Extension App** project, use the `extension/` directory as
the web extension source, and select the Safari target when converting the
Chrome manifest. Run the generated app to install locally in Safari. Public
distribution requires an Apple Developer account, signing, notarisation where
applicable, and App Store submission.

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

- **Manifest Version**: 3 (with Firefox `browser_specific_settings`)
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
├── lib/browser-api.js     # Shared browser API compatibility layer
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
