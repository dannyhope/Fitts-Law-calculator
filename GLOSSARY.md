# Glossary

## Project Terminology

### Chips

The small coloured boxes that display acquisition times next to clickable elements in the Chrome extension. Chips change colour based on the difficulty of acquiring the target:

- **Grey chips**: Easy to acquire (≤ 400ms)
- **Red chips**: Difficult to acquire (> 400ms)
- **Green chips**: Already acquired (cursor inside element)

**Technical name:** Overlay labels
**CSS class:** `.fitts-law-overlay`

### Dim Mode

An optional visual mode that makes the webpage greyscale and reduces its contrast, making the coloured chips stand out more prominently. Only works when the overlay is enabled. Useful when analysing pages with busy or colourful designs.

**Implementation:**
Creates a full-viewport overlay positioned above page content but below chips (z-index: 2147483646).

**Effects applied:**

- `backdrop-filter: grayscale(100%)` - Removes all colour from the page
- `backdrop-filter: contrast(0.6)` - Reduces contrast by 40%
- `backdrop-filter: brightness(0.9)` - Slightly darkens the page
- `background: rgba(0, 0, 0, 0.3)` - Additional darkening

**CSS class:** `.fitts-law-dim-overlay`
**Storage key:** `fittsLawDimMode`

### Clickable Elements

Any interactive element on a webpage that the extension detects and analyses. Includes:

- Links (`<a>`)
- Buttons (`<button>`)
- Form inputs and controls
- Elements with `onclick` handlers
- Elements with ARIA roles like `button` or `link`

### Acquisition Time (MT)

The predicted time (in milliseconds) it would take a user to move their cursor from its current position to successfully click a target element. Calculated using Shannon's formulation of Fitts' Law.

## Fitts' Law Terms

### D (Distance)

The straight-line distance from the current cursor position to the **entry point** of the target element (where the line from cursor to centre first intersects the target boundary). Measured in pixels.

**When cursor is inside target:** D = 0 (target already acquired)

### W (Effective Width)

The length of the line segment that **overlaps** the target along the approach path. Specifically, the distance from the entry point to the target's centre. Measured in pixels.

**Path-based interpretation:** W represents the "tolerance" or "margin for error" along your specific trajectory towards the target.

### MT (Movement Time)

The predicted time to acquire the target, calculated using Shannon's formulation:

```
MT = a + b × log₂(D/W + 1)
```

Where a = 0ms and b = 150ms/bit.

### ID (Index of Difficulty)

A measure of how difficult a target is to acquire, measured in "bits" of information. Calculated as:

```
ID = log₂(D/W + 1)
```

Higher ID = more difficult task = longer movement time.

### D/W Ratio

The ratio of distance to effective width. A larger ratio means:

- Target is far away relative to its size (along approach path)
- Higher difficulty
- Longer acquisition time

## Shannon's Formulation

The information-theoretic version of Fitts' Law used throughout this project:

```
MT = a + b × log₂(D/W + 1)
```

**Why Shannon's version?**

- Treats target acquisition as an information transmission problem
- The "+1" prevents log(0) when D = 0
- More mathematically sound than Fitts' original formulation
- Better handles small D/W ratios

**Constants:**

- **a** = Starting time constant (0ms in this implementation)
- **b** = Slope constant (150ms/bit, empirically determined for screen-based pointing)

## Technical Terms

### Path-Based Width Calculation

The method used in this project to calculate effective width (W). Rather than using perpendicular width, we calculate the overlap of the approach path through the target:

1. Draw a line from cursor to target centre
2. Find where it **enters** the target boundary (entry point)
3. W = distance from entry point to centre

**Advantage:** Accurately models how approach angle affects difficulty.

### Entry Point

The point where the line from cursor to target centre first intersects the target's boundary. Used to calculate D (distance outside target).

### Exit Point

For this implementation, always the target's centre point. Used to calculate W (overlap through target).

### Line-Rectangle Intersection

The geometric algorithm used to find where the approach line intersects the target's rectangular boundary. Uses parametric line equations.

### Acquisition Threshold

The 400ms threshold used to determine chip colour:

- ≤ 400ms: Yellow (easy to acquire)
- > 400ms: Red (difficult to acquire)

**Rationale:** 400ms represents a good user experience boundary in HCI research.

## Chrome Extension Terms

### Content Script

JavaScript that runs in the context of web pages. In this extension, `content.js` detects clickable elements and creates chips.

### Popup

The small UI that appears when clicking the extension icon. Contains the toggle switch and information about Fitts' Law.

### Manifest V3

The current version of Chrome's extension platform. Defines permissions, scripts, and metadata for the extension.

### Observer Pattern

The `MutationObserver` used to detect when new clickable elements are added to the page (via AJAX, dynamic content, etc.).

## UX/HCI Terms

### Target Acquisition

The process of moving a cursor to a target and successfully clicking it. What Fitts' Law models.

### Speed-Accuracy Tradeoff

The fundamental principle behind Fitts' Law: you can move quickly but imprecisely, or slowly but accurately. The logarithmic relationship captures this tradeoff.

### Motor Control

The neuromuscular system controlling cursor movement. Fitts' Law models the time required for the motor system to process spatial information and execute movement.

## Abbreviations

- **MT**: Movement Time
- **D**: Distance
- **W**: Width (Effective Width)
- **ID**: Index of Difficulty
- **HCI**: Human-Computer Interaction
- **DOM**: Document Object Model
- **CSP**: Content Security Policy
- **ARIA**: Accessible Rich Internet Applications
