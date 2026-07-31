# Architecture

## Decisions

### Single-File Application (2025-01)

**Decision:** Keep the core demonstration as a single HTML file with embedded CSS and JavaScript.

**Rationale:**
- Zero dependencies makes it highly portable and accessible
- Easy to understand and modify for educational purposes
- Fast loading with no build step required
- All code visible in one place for learning

**Trade-offs:**
- Larger single file vs modular structure
- Limited code reuse between demo and extension
- No TypeScript type checking in the demo itself

### Path-Based Width Calculation (Shannon's Formulation)

**Decision:** Use line-rectangle intersection to calculate effective width along the approach path.

**Rationale:**
- Aligns with Shannon's information-theoretic formulation
- Models 1D movement along a path rather than 2D perpendicular width
- More accurately represents how approach angle affects acquisition difficulty
- Intuitively demonstrates why corner approaches are harder than side approaches

**Implementation:**
- `lineRectangleIntersection()` calculates parametric t-values for all four rectangle edges
- Entry point = first intersection along the approach vector
- W = distance from entry point to button centre (along the approach path)
- D = distance from cursor to entry point

### Chrome Extension Architecture

**Decision:** Separate extension implementation in `/extension` directory with content script injection.

**Rationale:**
- Real-world application of Fitts' Law to actual web interfaces
- Demonstrates the principle on live websites
- Requires different architecture (overlay vs embedded) from the demo

**Structure:**
- `manifest.json` - Extension configuration
- `content.js` - Main calculation and overlay logic
- `popup.html/js` - Toggle interface
- `background.js` - State persistence
