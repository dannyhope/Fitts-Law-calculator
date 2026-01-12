# Debug Instructions

## How to Reload the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Find "Fitts' Law Overlay"
3. Click the refresh/reload icon (circular arrow)
4. Refresh the webpage you're testing on

## Check Debug Output

1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to the Console tab
3. Look for messages starting with `[Fitts Debug]`

## What to Check

You should see:

- `[Fitts Debug] Content script loaded - Version 1.1` - Confirms new code is loaded
- `[Fitts Debug] First chip created, z-index: 2147483647` - When overlay is enabled
- `[Fitts Debug] Dim overlay created: <div>` - When dim mode is toggled on
- `[Fitts Debug] Dim overlay z-index: 2147483646` - Should be one less than chips
- `[Fitts Debug] Sample chip z-index: 2147483647` - Should be highest

## Expected Behaviour

- Chips should have z-index: **2147483647** (highest)
- Dim overlay should have z-index: **2147483646** (below chips)
- Chips should remain fully coloured (grey/red/green)
- Page content behind dim overlay should appear greyscale

## If Chips Still Appear Dimmed

1. Check console for z-index values
2. Inspect a chip element and check computed styles
3. Look for any `filter` property on the chip or its parents
4. Check if old `fitts-law-dim-mode` class is still on `<body>`
