# Clarify Mode Feature

## Overview

The "Clarify" feature combines background dimming and dynamic highlight outlines into a single unified toggle, making clickable elements more visible and easier to identify.

## Current Implementation (v1.1.0)

### User Interface

- **"On" toggle**: Enables/disables the Fitts' Law overlay with acquisition time chips
- **"Clarify" toggle**: Simultaneously enables/disables both:
  - Background dimming (reduces page contrast)
  - Dynamic highlight outlines around clickable elements

### User Flow

1. **Enable "On"** → Acquisition time chips appear for all clickable elements
2. **Enable "Clarify"** → Background dims AND outlines appear around clickable elements
3. **Disable "On"** → Everything disappears
4. **Re-enable "On"** → If "Clarify" preference was saved, both dim and highlights automatically reappear

### Technical Implementation

#### State Management

- **`isEnabled`**: Whether the overlay is currently showing
- **`isClarifyModeEnabled`**: User's preference for clarify mode (persisted to storage)
- **`dimOverlay`**: DOM element for the dim overlay (only exists when both flags are true)
- **Dynamic outline colors**: Applied via inline styles on each clickable element

#### Storage Keys

- `fittsLawEnabled`: Boolean - overlay enabled state
- `fittsLawClarifyMode`: Boolean - clarify mode preference

#### Migration from Old Settings

The code automatically migrates from the old separate settings:
- Old: `fittsLawDimMode` and `fittsLawHighlightMode`
- New: `fittsLawClarifyMode` (unified)

If either old setting was enabled, clarify mode is enabled and old keys are removed.

### Dynamic Color Matching

Outline colors dynamically match their associated acquisition time chip colors:

- **⚪ Grey** `rgba(139, 149, 165, 0.9)`: Easy targets (≤ 400ms)
- **🔴 Red** `rgba(244, 67, 54, 0.9)`: Difficult targets (> 400ms)
- **🟢 Green** `rgba(76, 175, 80, 0.9)`: Target acquired (cursor inside element)

Colors update in real-time as the cursor moves, synchronized with chip color changes at ~60fps.

#### Implementation Details

**CSS** (`content.css`):
```css
[data-fitts-highlight] {
    outline-width: 3px !important;
    outline-style: solid !important;
    outline-offset: 4px !important;
    transition: outline-color 0.2s ease !important;
}
```

**JavaScript** (`content.js`):
- During `updateOverlays()`, calculate appropriate color based on metrics
- Apply `data-fitts-highlight` attribute to element
- Set `outline-color` inline style with calculated color
- Remove attributes when clarify mode is disabled or element is off-screen

### Shannon's Formulation

The extension uses Shannon's formulation of Fitts' Law:

**MT = a + b × log₂(D/W + 1)**

Where:
- **MT** = Movement Time (predicted acquisition time in milliseconds)
- **D** = Distance from cursor to target entry point
- **W** = Effective width (overlap through element along approach path)
- **a** = 0 ms (starting time constant)
- **b** = 150 ms/bit (slope constant)

### Benefits of Unified Clarify Mode

1. **Simpler UI**: One toggle instead of two
2. **Better UX**: Dim and highlight work together as a cohesive feature
3. **Clearer intent**: "Clarify" communicates the purpose better than separate technical controls
4. **Visual coherence**: Dynamic color matching creates clear visual relationship between chips and outlines
5. **Performance**: Single preference to save/restore

### Edge Cases Handled

- **Off-screen elements**: Highlights removed to avoid unnecessary DOM operations
- **Hidden elements**: No highlights applied (width/height = 0)
- **Migration**: Automatically upgrades users from old two-toggle system
- **State preservation**: Clarify preference remembered even when overlay is toggled off
- **Memory cleanup**: All outline styles and attributes removed on disable

## Future Enhancements

Potential improvements for future versions:

- [ ] Adjustable outline thickness
- [ ] Custom color schemes
- [ ] Per-domain clarify preferences
- [ ] Accessibility: Ensure outlines meet WCAG contrast requirements
- [ ] Performance: Consider CSS custom properties instead of inline styles
