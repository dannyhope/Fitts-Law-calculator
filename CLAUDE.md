# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive Fitts' Law demonstration built as a single-file HTML application. It visualises Shannon's formulation of Fitts' Law in real-time as users move their cursor.

**Shannon's formulation:** MT = a + b × log₂(D/W + 1)
Where:

- MT = Movement Time (predicted acquisition time)
- D = Distance from pointer to button entry point
- W = Width (overlap length through button along approach path)
- a = 0 ms, b = 150 ms/bit (empirically determined constants)

## Architecture

**Single-file application:** `index.html` contains all HTML, CSS, and JavaScript with no external dependencies.

### Key Implementation Details

**Path-based width calculation (Shannon's formulation):**

- A line is drawn from the cursor position to the button centre
- **D (Distance):** Length from cursor to where the line enters the button boundary
- **W (Effective Width):** Length of the line segment that overlaps the button (entry point to centre)
- When cursor is inside the button: D = 0 (target already acquired)

**Line-rectangle intersection (`lineRectangleIntersection`):**

- Calculates parametric intersection (t-value) for all four rectangle edges
- Returns intersection points sorted by distance along the approach vector
- Entry point = first intersection, exit point = button centre

**Real-time visualisation:**

- Red line: Full path from cursor to button centre
- Green line: The overlap portion (W) from entry point to centre
- Labels show D and W values directly on the visualisation
- Formula panel displays all calculated values (D, W, D/W ratio, ID, MT)

### Why This Approach

This path-based interpretation aligns with Shannon's information-theoretic formulation:

- W represents tolerance/spread along the specific trajectory path
- Approaching from the side → longer overlap → larger W → easier acquisition
- Approaching from a corner → shorter overlap → smaller W → harder acquisition
- This models the 1D movement along a path (Shannon) rather than 2D perpendicular width

## Documentation Structure

Main `_docs/` directory with:

- `architecture.md` – Architecture Decision Records
- `standards.md` – Coding standards
- `expertise.md` – Learnings, gotchas, edge cases, debugging tips
- `projects/` – Project subfolders
- `bugs/` – Issue files with screenshots

## Project Lifecycle Prefixes

- `[project-name]` – An idea (not started)
- `open--[project-name]` – Work has begun
- `closed--[project-name]` – Done or paused (can be reopened)

## Issue/Bug Workflow

- Each file represents one or more issues
- When fixed, move to the `done/` subfolder
- If a "bug" is actually a project, promote it to `projects/`

## Update Triggers

When starting a project or finishing a task that affects how things work, create or update the appropriate page in `_docs/`:

- Document architectural decisions in `architecture.md`
- Record coding standards and patterns in `standards.md`
- Capture learnings, gotchas, and debugging tips in `expertise.md`

## General Principles

- Prefer editing existing files over creating new ones
- Keep documentation alongside the code (not separate)
- Track state through naming conventions rather than metadata
- Move completed items to `done/` subfolders rather than deleting them

## Standard Project Requirements

- Include a feedback link in the application that opens an email to danny.hope@gmail.com
- Use British English throughout the codebase and documentation
- Ensure accessibility for interactive elements
- Consider adding visual demonstrations or interactive examples to illustrate the principle
