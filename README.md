# Fitts' Law Interactive Demonstration

An interactive visualisation of **Shannon's formulation** of Fitts' Law, demonstrating how target acquisition time varies based on distance and approach angle.

**Two versions available:**

1. **Standalone Demo** (`index.html`) - Interactive single-page demonstration
2. **Chrome Extension** (`extension/`) - Overlay acquisition times on any webpage

## What is Fitts' Law?

Fitts' Law is a predictive model in human-computer interaction that describes the time required to rapidly move to a target area. This demonstration uses **Shannon's formulation**:

```
MT = a + b × log₂(D/W + 1)
```

Where:

- **MT** = Movement Time (predicted acquisition time in milliseconds)
- **D** = Distance from pointer to button entry point
- **W** = Effective Width (overlap length through button along approach path)
- **a** = 0 ms (starting time constant)
- **b** = 150 ms/bit (slope constant)
- **ID** = Index of Difficulty = log₂(D/W + 1) (measured in "bits")

## How It Works

### Path-Based Width Calculation

This implementation uses a **path-based interpretation** aligned with Shannon's information-theoretic formulation:

1. A line is drawn from the cursor position to the button centre
2. **D (Distance)**: Length from cursor to where the line **enters** the button boundary
3. **W (Effective Width)**: Length of the line segment that **overlaps** the button (entry point to centre)
4. When cursor is inside the button: **D = 0** (target already acquired)

### Why This Approach?

This models **1D movement along a path** (Shannon) rather than 2D perpendicular width:

- **Approaching from the side** → longer overlap → larger W → easier acquisition
- **Approaching from a corner** → shorter overlap → smaller W → harder acquisition
- W represents tolerance/spread along the specific trajectory path

## Features

- **Real-time visualisation** with red line (full path) and green line (overlap)
- **Live calculations** showing D, W, D/W ratio, ID, and MT
- **Interactive demonstration** - move your mouse to see how approach angle affects acquisition time
- **Responsive design** with accessible controls
- **Zero dependencies** - single HTML file

## Usage

### Standalone Demo

Simply open `index.html` in a modern web browser. Move your cursor around the button to see how:

- Distance to the button affects acquisition time
- Approach angle changes the effective width
- The D/W ratio determines difficulty

### Chrome Extension

1. Load the extension in Chrome (see [extension/README.md](extension/README.md) for details)
2. Navigate to any website
3. Click the extension icon and toggle "Enable Overlay"
4. Move your mouse around to see acquisition times for all clickable elements

**Color-coded labels:**

- 🟡 Yellow = Easy targets (≤ 400ms)
- 🔴 Red = Difficult targets (> 400ms)
- 🟢 Green = Already acquired (cursor inside)

The extension automatically:

- Detects all clickable elements (links, buttons, inputs, etc.)
- Calculates real-time acquisition times using Shannon's formulation
- Updates overlays as you move your mouse
- Persists your on/off preference

## Technical Implementation

### Key Functions

- `lineRectangleIntersection()` - Calculates parametric intersection using line equation P(t) = P1 + t(P2 - P1)
- `calculateFittsLawMetrics()` - Implements Shannon's formulation with path-based width
- `updateDisplay()` - Real-time visualisation updates

### Performance

- Throttled mouse events (~60fps) for smooth performance
- Debounced resize events to optimize recalculation
- Cached button geometry to avoid redundant DOM queries
- GPU-optimized with CSS `will-change` properties

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Educational Use

This tool is designed for:

- **UX/UI designers** learning about interface ergonomics
- **Students** studying human-computer interaction
- **Developers** implementing accessible, user-friendly interfaces
- **Researchers** exploring Fitts' Law applications

## Mathematical Background

Shannon's formulation treats target acquisition as an **information transmission problem**:

- **Index of Difficulty (ID)** represents the "bits" of information that must be processed
- Higher ID = more difficult task = longer movement time
- The logarithmic relationship reflects the speed-accuracy tradeoff in motor control

## License

MIT License - see [LICENSE.md](LICENSE.md)

## Feedback

For questions, suggestions, or issues, please contact [danny.hope@gmail.com](mailto:danny.hope@gmail.com)

## References

- Shannon, C. E., & Weaver, W. (1949). _The Mathematical Theory of Communication_
- MacKenzie, I. S. (1992). _Fitts' law as a research and design tool in human-computer interaction_
- Soukoreff, R. W., & MacKenzie, I. S. (2004). _Towards a standard for pointing device evaluation_
