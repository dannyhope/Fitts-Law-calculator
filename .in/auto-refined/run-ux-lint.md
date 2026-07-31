# run /ux-lint
**Broadcast:** 3a499bf4-960b-45e2-b295-2276d69f13bb
**Readiness:** auto-refined
**Roadmap:** now

## Auto-investigation
**Investigated:** 2026-07-31

### Findings
- Broadcast prompt to run `/ux-lint` skill against this project's interface
- Project `fitts-law-calculator` has UI files (HTML/JS/CSS/components) suitable for UX linting
- Skill location: `~/.claude/skills/ux-lint/SKILL.md` — standard mode checks 24 rules, thorough mode checks 120+ principles
- This item was broadcast to multiple projects via Bombay (Broadcast ID in frontmatter)

### Scope
- Execution only: invoke `/ux-lint` with appropriate input (local HTML, dev server URL, or screenshot)
- No code changes unless lint findings warrant fixes
- Estimated complexity: small (execution task)

### Questions for refinement
1. Should findings be logged to a file in the project or just reported in chat?
2. Use standard or thorough mode for this project?

### Documentation impact
- _(none — audit/execution task)_

### Related items
- Duplicate broadcast across ~16 projects — same prompt, project-specific UI context

