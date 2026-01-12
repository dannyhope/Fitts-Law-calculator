# Dim Background Feature Behavior

## Expected Behavior

The "Dim background" setting should persist independently of the "Show acquisition times" toggle state.

### User Flow

1. **Turn "Show acquisition times" on** → Chips appear as they should
2. **Select "Dim background"** → Background dims as it should
3. **Turn "Show acquisition times" off** → Chips disappear, page returns to normal
4. **Turn "Show acquisition times" back on** → Chips appear AND background is dimmed (because the preference was saved)

### Technical Implementation

- **`isDimModeEnabled` state variable**: Stores the user's preference (true/false)
- **`dimOverlay` DOM element**: The actual visual overlay element (only exists when overlay is enabled AND dim mode is enabled)

The key is that `isDimModeEnabled` must remain `true` even when the overlay is disabled, so that when the overlay is re-enabled, the dim mode is automatically reapplied.

### State Persistence

- Both settings are saved to `chrome.storage.local`:
    - `fittsLawEnabled`: Whether the overlay is currently showing
    - `fittsLawDimMode`: Whether dim background should be applied (when overlay is enabled)

- On page load, both preferences are restored from storage
- The dim overlay is only created if BOTH conditions are true:
    1. Overlay is enabled (`isEnabled === true`)
    2. Dim mode preference is enabled (`isDimModeEnabled === true`)

## Shannon's Formulation

The extension uses Shannon's formulation of Fitts' Law:

**MT = a + b × log₂(D/W + 1)**

Where:

- **MT** = Movement Time (predicted acquisition time in milliseconds)
- **D** = Distance from cursor to target entry point
- **W** = Effective width (overlap through element along approach path)
- **a** = 0 ms (starting time constant)
- **b** = 150 ms/bit (slope constant)

### Color Coding

The extension uses color to indicate acquisition difficulty:

- **⚪ Grey (default)**: Easy to acquire (≤ 400ms)
- **🔴 Red**: Difficult to acquire (> 400ms)
- **🟢 Green**: Already acquired (cursor inside element)
