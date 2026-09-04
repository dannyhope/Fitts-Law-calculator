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

### Cross-browser WebExtension Packaging (2026-09)

**Decision:** Keep one shared WebExtension source tree and isolate the browser
API namespace behind `extension/lib/browser-api.js`.

**Rationale:**
- Chromium, Firefox, and Safari share the WebExtensions model but expose
  different global namespaces and packaging workflows.
- A narrow shared API boundary avoids duplicating popup and content-script
  behaviour while leaving browser-specific packaging explicit.
- Firefox receives a WebExtension manifest with a stable add-on ID. Safari is
  packaged as an Xcode Safari Web Extension App because Safari distribution
  requires an app container and Apple signing.

**Release boundary:**
- Chromium: load unpacked for development; publish a signed package through
  the relevant browser store.
- Firefox: temporary installation for development; publish a signed `.xpi`
  through Firefox Add-ons.
- Safari: generate and sign the Safari Web Extension App in Xcode; publish
  through the Apple App Store.
