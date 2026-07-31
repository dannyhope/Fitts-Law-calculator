# Expertise

## Gotchas

### Line-Rectangle Intersection Edge Cases

**Cursor inside button:**
- D should be 0 (target already acquired)
- W is distance from cursor to centre
- Handle this case separately before calculating intersections

**Parallel lines:**
- When cursor and button are aligned along an axis
- Denominator in parametric equation becomes 0
- Check for division by zero before calculating t-values

**Multiple intersections:**
- Rectangle has 4 edges, so up to 4 intersection points possible
- Must sort by distance along the approach vector
- Entry point = first intersection (smallest t-value > 0)
- Exit point = button centre (not second intersection)

**Cursor very close to button edge:**
- Floating point precision can cause instability
- Consider using a small epsilon for comparisons

### Performance Considerations

**Mouse event throttling:**
- `mousemove` events fire very frequently (potentially hundreds per second)
- Use `requestAnimationFrame` to throttle to ~60fps
- Prevents unnecessary recalculations and layout thrashing

**DOM geometry caching:**
- `getBoundingClientRect()` forces layout recalculation
- Cache button bounds and only recalculate on resize
- Debounce resize events to avoid excessive updates

**Canvas vs SVG vs DOM:**
- Canvas is fastest for high-frequency updates
- SVG is more accessible and easier to style
- DOM elements are simplest but can cause layout issues
- Current implementation uses SVG for visualisation lines

## Debugging

### Visualisation Issues

**Lines not appearing:**
- Check z-index of SVG overlay
- Verify SVG viewBox matches viewport size
- Ensure line coordinates are within SVG bounds

**Incorrect intersection points:**
- Log the parametric t-values for all edges
- Visualise which edges are being intersected
- Check that rectangle bounds are correctly calculated

**Jumpy calculations:**
- Usually caused by cached geometry being stale
- Force recalculation on window resize
- Consider adding a manual "recalibrate" button for debugging

### Mathematical Validation

**Sanity checks:**
- D should never be negative
- W should be positive when cursor is outside button
- ID should increase as D/W ratio increases
- MT should increase with ID

**Edge case testing:**
- Cursor at button edge (D ≈ 0)
- Cursor very far from button (large D)
- Approaching from each cardinal direction
- Approaching from corners (minimum W)
- Approaching from sides (maximum W)

### Extension-Specific Issues

**Elements not detected:**
- Check CSS selector in `querySelectorAll()`
- Some elements may be hidden or have zero dimensions
- Verify `getBoundingClientRect()` returns valid bounds

**Performance degradation:**
- Too many clickable elements on page
- Consider throttling more aggressively
- Add visibility culling (only calculate for on-screen elements)
- Use Intersection Observer API for large pages

**Overlay positioning issues:**
- Fixed vs absolute positioning
- Transform and scroll offsets
- iframe boundaries
- Shadow DOM elements

## Testing Strategies

### Manual Testing

1. **Approach angles:** Move cursor from all directions (N, S, E, W, NE, NW, SE, SW)
2. **Distances:** Test at various distances (very close, medium, far)
3. **Inside button:** Verify D = 0 and appropriate MT when cursor is inside
4. **Edge cases:** Test at button corners and edges

### Visual Regression

- Take screenshots of visualisation at key positions
- Compare D, W, ID, and MT values against expected calculations
- Verify line rendering matches calculated intersection points

### Cross-Browser Testing

- Chrome/Edge (Chromium)
- Firefox (Gecko)
- Safari (WebKit)
- Check for differences in `getBoundingClientRect()` behaviour
- Verify SVG rendering consistency

## Known Limitations

### Simplifications

**Constant coefficients:**
- Uses fixed a = 0, b = 150 (typical desktop values)
- Real-world values vary by input device, user, and task
- Could make these configurable in future

**2D movement vs 1D model:**
- Fitts' Law models 1D movement
- Mouse movement is 2D with ballistic and corrective phases
- Path-based calculation is an approximation

**No speed-accuracy tradeoff:**
- Model assumes user moves as fast as possible while maintaining accuracy
- Real users may move slower or faster than predicted
- MT is a prediction, not a measurement

### Browser Limitations

**Frame rate:**
- Limited to display refresh rate (typically 60Hz)
- High-refresh displays may behave differently

**Input device variations:**
- Trackpad vs mouse vs trackball
- Different gain settings and acceleration curves
- Touch input not supported in current implementation

## References

### Key Papers

- Shannon, C. E., & Weaver, W. (1949). _The Mathematical Theory of Communication_
- MacKenzie, I. S. (1992). _Fitts' law as a research and design tool in human-computer interaction_
- Soukoreff, R. W., & MacKenzie, I. S. (2004). _Towards a standard for pointing device evaluation_

### Useful Resources

- [Wikipedia: Fitts's law](https://en.wikipedia.org/wiki/Fitts%27s_law)
- [ISO 9241-9:2000](https://www.iso.org/standard/30030.html) - Ergonomic requirements for office work with VDTs
