# Project: Unify Clarify Features

**Status**: ✅ Closed (Completed)
**Date Completed**: 2026-01-11
**Version**: 1.1.0

## Goal

Combine the separate "Dim background" and "Highlight clickables" toggles into a single unified "Clarify" feature that enhances the visibility of clickable elements.

## Problem Statement

The extension had two separate toggles:
1. "Dim background" - reduced page contrast to make chips more visible
2. "Highlight clickables" - added green outlines around clickable elements

These features were:
- Conceptually related but artificially separated
- Confusing to users (two technical controls instead of one purpose-driven feature)
- Required complex dependency logic (highlight only worked when dim was enabled)
- Static highlight color (always green) didn't relate to acquisition difficulty

## Solution

### 1. Unified Toggle
- Combined both features into single "Clarify" toggle
- Renamed from technical descriptions to purpose-driven name
- Simplified UI from 3 toggles to 2 toggles ("On" and "Clarify")

### 2. Dynamic Color Matching
- Outlines now match their associated chip colors
- Updates in real-time as cursor moves (~60fps)
- Color indicates acquisition difficulty:
  - Grey: Easy (≤ 400ms)
  - Red: Difficult (> 400ms)
  - Green: Acquired (inside element)

### 3. Backward Compatibility
- Automatic migration from old settings (`fittsLawDimMode`, `fittsLawHighlightMode`)
- Seamless upgrade for existing users
- Old storage keys automatically cleaned up

## Implementation Details

### Files Changed

1. **extension/popup/popup.html**
   - Removed separate dim and highlight containers
   - Added single clarify mode container
   - Updated labels and aria descriptions

2. **extension/popup/popup.js**
   - Unified state management to single `clarifyMode` parameter
   - Combined handlers into `handleClarifyModeToggle()`
   - Added migration logic in `getStatus()`

3. **extension/content/content.js**
   - Replaced `isDimModeEnabled` and `isHighlightModeEnabled` with `isClarifyModeEnabled`
   - Unified `enableClarifyMode()` and `disableClarifyMode()` functions
   - Added dynamic color calculation in `updateOverlays()`
   - Implemented inline style application for outline colors
   - Added cleanup logic for highlight attributes

4. **extension/content/content.css**
   - Removed static body.fitts-law-highlight-mode rules
   - Added `[data-fitts-highlight]` attribute selector
   - Added outline color transition for smooth updates

### Storage Schema

**Before:**
```javascript
{
  fittsLawEnabled: boolean,
  fittsLawDimMode: boolean,
  fittsLawHighlightMode: boolean
}
```

**After:**
```javascript
{
  fittsLawEnabled: boolean,
  fittsLawClarifyMode: boolean  // Unified
}
```

## Testing Performed

- ✅ Migration from old settings works correctly
- ✅ Clarify toggle only available when "On" is enabled
- ✅ Preference persists across page reloads
- ✅ Dynamic colors update smoothly
- ✅ Cleanup removes all outline styles on disable
- ✅ Off-screen elements don't get highlights
- ✅ Performance remains ~60fps with clarify mode enabled

## User Benefits

1. **Simpler interface**: One toggle instead of two
2. **Clearer purpose**: "Clarify" communicates intent better than technical controls
3. **Better visual feedback**: Color-matched outlines reinforce difficulty information
4. **More cohesive feature**: Dim and highlight work together as designed
5. **Smooth upgrade**: Existing users' preferences automatically migrate

## Metrics

- Lines of code removed: ~45 (simplified state management)
- Lines of code added: ~35 (dynamic color logic)
- Net reduction: ~10 lines
- Complexity reduction: 2 boolean states → 1 boolean state
- UI elements: 3 toggles → 2 toggles

## Documentation Updated

- Created: `_docs/clarify-mode.md` - Complete feature documentation
- Archived: `_docs/dim-background-behavior.md` - Old separate feature docs

## Follow-up Tasks

None required. Feature is complete and working as intended.

## Lessons Learned

1. **User-centric naming matters**: "Clarify" is more intuitive than "Dim background + Highlight clickables"
2. **Unified features are simpler**: Combining related controls reduces cognitive load
3. **Dynamic feedback is powerful**: Color-matched outlines create strong visual connection
4. **Migration is critical**: Automatic upgrade ensures no users left behind
5. **Performance is achievable**: 60fps updates possible with efficient inline style manipulation
