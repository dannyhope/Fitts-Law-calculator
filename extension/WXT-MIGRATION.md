# WXT Migration Complete

This extension has been successfully migrated to WXT framework with Manifest V3 and native browser.* API.

## Quick Start

```bash
cd extension/
npm install
npm run build         # Build Chrome MV3
npm run build:firefox # Build Firefox MV3
```

## Build Commands

| Command | Description | Output |
|---------|-------------|--------|
| `npm run build` | Build Chrome extension (MV3) | `.output/chrome-mv3/` |
| `npm run build:firefox` | Build Firefox extension (MV3) | `.output/firefox-mv3/` |
| `npm run zip` | Package Chrome extension | `.output/extension-1.0.0-chrome.zip` |
| `npm run zip:firefox` | Package Firefox extension | `.output/extension-1.0.0-firefox.zip` |
| `npm run dev` | Development mode (Chrome) | Hot reload enabled |
| `npm run dev:firefox` | Development mode (Firefox) | Hot reload enabled |

## Distribution Files

After running the zip commands, you'll have:

- **extension-1.0.0-chrome.zip** - Ready for Chrome Web Store (MV3)
- **extension-1.0.0-firefox.zip** - Ready for Firefox Add-ons (MV3)
- **extension-1.0.0-sources.zip** - Source code for Firefox review

## What Changed

### ✅ Completed
- [x] Converted to WXT framework
- [x] Migrated to TypeScript
- [x] Updated to Manifest V3 (both browsers)
- [x] Switched to browser.* API (via webextension-polyfill)
- [x] Preserved all existing behaviour
- [x] Maintained Firefox gecko ID
- [x] Added build/packaging scripts

### 🎯 Behaviour Parity
All original features preserved:
- ✓ Real-time overlay display
- ✓ Toggle on/off functionality
- ✓ Clarify mode (dim + highlight)
- ✓ State persistence
- ✓ Colour coding (green/yellow/red)
- ✓ Accessibility features

### 📦 Project Structure
```
extension/
├── entrypoints/          # WXT entry points
│   ├── content.ts       # Content script
│   └── popup/           # Popup UI
├── utils/               # Shared utilities
│   └── fitts-law.ts    # Core calculations
├── styles/              # CSS files
├── public/              # Static assets
├── wxt.config.ts        # WXT configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies + scripts
```

## Testing Locally

### Chrome
1. Run `npm run build`
2. Open Chrome → `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `.output/chrome-mv3/`

### Firefox
1. Run `npm run build:firefox`
2. Open Firefox → `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `.output/firefox-mv3/manifest.json`

## Notes

- Both builds use Manifest V3
- WXT automatically includes webextension-polyfill for browser.* API compatibility
- No FittsBrowser shim needed (never existed in current codebase)
- British English maintained throughout
- Build output is gitignored (.output/, node_modules/)
