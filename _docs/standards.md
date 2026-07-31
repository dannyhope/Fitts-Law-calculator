# Standards

## Code Style

### JavaScript

- Use `const` and `let` (no `var`)
- Descriptive function and variable names
- Comments explain "why" not "what"
- Keep functions focused and single-purpose

### Mathematical Constants

**Fitts' Law Parameters:**
- `a = 0` ms (starting time constant)
- `b = 150` ms/bit (slope constant)

These are empirically determined constants from human-computer interaction research. Different contexts may use different values, but these are suitable defaults for typical desktop interaction.

### Performance Optimizations

- Throttle mouse events to ~60fps (`requestAnimationFrame`)
- Debounce resize events (250ms)
- Cache DOM queries and geometry calculations
- Use CSS `will-change` for animated elements
- Avoid layout thrashing (batch DOM reads/writes)

## File Organization

### Directory Structure

```
/
├── index.html              # Standalone demo
├── extension/              # Chrome extension
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html/js
│   └── background.js
├── _docs/                  # Documentation
│   ├── architecture.md
│   ├── standards.md
│   ├── expertise.md
│   ├── projects/          # Project planning docs
│   └── bugs/              # Issue tracking
│       └── done/          # Fixed issues
├── _vibing/               # Conversation logs (git-ignored)
└── .in/                   # Task inbox
    └── done/              # Completed tasks
```

### Naming Conventions

- **Files:** kebab-case (`architecture.md`, `line-intersection.js`)
- **Functions:** camelCase (`calculateFittsLawMetrics`, `updateDisplay`)
- **Constants:** UPPER_SNAKE_CASE or descriptive camelCase for mathematical constants
- **CSS classes:** kebab-case (`fitts-overlay`, `acquisition-label`)

## Documentation

### Code Comments

- Use JSDoc-style comments for functions
- Explain mathematical formulas with references
- Document edge cases and assumptions
- Include units in variable names or comments (e.g., `distanceInPixels`, `timeInMs`)

### Mathematical Notation

When documenting formulas, use:
- Clear variable definitions
- Units of measurement
- References to source papers/formulas

Example:
```javascript
/**
 * Calculate Index of Difficulty using Shannon's formulation
 * ID = log₂(D/W + 1)
 *
 * @param {number} D - Distance to target in pixels
 * @param {number} W - Effective width in pixels
 * @returns {number} Index of Difficulty in bits
 */
```

## Accessibility

- Provide text alternatives for visual demonstrations
- Ensure keyboard navigation for interactive elements
- Use semantic HTML
- Maintain sufficient colour contrast
- Test with screen readers where appropriate

## British English

All user-facing text, documentation, and code comments use British English spelling:
- colour (not color)
- centre (not center)
- visualisation (not visualization)
- optimise (not optimize)
