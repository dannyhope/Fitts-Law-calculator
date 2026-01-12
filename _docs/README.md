# Documentation

This directory contains project documentation for the Fitts' Law Calculator extension.

## Structure

- **Root files**: Current feature documentation
- **projects/**: Project tracking and completion records
  - `closed--*`: Completed projects
  - `open--*`: Work in progress
  - `[name]`: Project ideas (not yet started)
- **archive/**: Deprecated or superseded documentation

## Current Features

### [Clarify Mode](./clarify-mode.md)
Unified feature combining background dimming and dynamic highlight outlines to make clickable elements more visible. Outlines dynamically change color to match acquisition difficulty.

## Recent Changes

### 2026-01-11
- ✅ **Unified Clarify Features**: Combined "Dim background" and "Highlight clickables" into single "Clarify" toggle
- ✅ **Dynamic Color Matching**: Outline colors now match chip colors and update in real-time
- ✅ **Backward Compatibility**: Automatic migration from old two-toggle system

## Documentation Standards

When documenting features:
1. Explain the "why" before the "how"
2. Include user flows and examples
3. Document edge cases and gotchas
4. Link to related code files with line numbers when relevant
5. Keep technical implementation separate from user-facing behavior

When closing a project:
1. Move project file to `projects/closed--[name].md`
2. Update this README with completion date
3. Archive any superseded documentation
4. Create/update feature docs in root directory
