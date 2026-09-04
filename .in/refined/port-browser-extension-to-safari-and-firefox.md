# Port browser extension to Safari and Firefox
**Readiness:** refined
**Partially refined:** 2026-09-04
**Roadmap:** now

Port the existing browser extension to Safari and Firefox.

## Scope

- Audit the current extension APIs, manifest, permissions, content scripts, popup, and packaging.
- Identify and isolate browser-specific APIs behind a compatibility layer where practical.
- Produce Safari and Firefox manifests/build outputs.
- Verify the extension's core Fitts' Law behaviour and accessibility in both browsers.
- Document installation, development, and release steps for each browser.

## Acceptance criteria

- The extension installs and runs in supported Safari and Firefox versions.
- Existing browser-extension behaviour remains consistent across Chromium, Safari, and Firefox.

## Auto-investigation
**Investigated:** 2026-09-03

### Findings
- The extension is currently a Chromium Manifest V3 package at `extension/manifest.json`.
- The popup and content script call `chrome.tabs`, `chrome.runtime`, and `chrome.storage` directly; there is no compatibility layer.
- The package uses `activeTab`, `storage`, and `<all_urls>`, injects `lib/fitts-law.js` and `content/content.js`, and supplies a popup at `extension/popup/popup.html`.
- Safari Web Extensions generally require a Safari extension project/container and platform-specific packaging/signing; a manifest-only output is not sufficient for a distributable Safari extension.
- Firefox supports WebExtensions but has browser-specific manifest and permission/release considerations. The task does not yet specify minimum Safari/Firefox versions, Safari distribution route, or whether store-ready signing is required.
- Existing documentation is primarily Chrome-oriented (`extension/README.md`, `extension/DEBUG.md`) and product docs only describe the local standalone app (`_docs/spec.md`, `_docs/design.md`).

### Scope
- Likely changes: compatibility wrapper used by popup/content code; browser-specific manifests/build directories; packaging scripts; extension README and release documentation; automated or manual cross-browser smoke checks.
- The Safari container/project, signing, and release path may require Xcode/macOS tooling and Apple Developer access.
- Estimated complexity: large.
- Docs impact: update `_docs/spec.md` and likely `_docs/architecture.md` to record supported browsers, packaging boundaries, and limitations; expand `extension/README.md` with per-browser development/install/release instructions.

### Proposed implementation
1. Establish supported browser versions and distribution targets, then audit every extension API and permission.
2. Introduce a small WebExtension compatibility module using `browser` where available and `chrome` as the Chromium fallback, preserving callback/Promise behaviour deliberately.
3. Define reproducible per-browser build outputs and manifests, keeping shared popup/content/lib assets in one source tree.
4. Add lint/build validation for each manifest and browser smoke checks for installation, popup toggles, storage persistence, content overlays, dynamic DOM updates, and keyboard/accessibility behaviour.
5. Create the Safari Web Extension project/container and document signing, local installation, and release requirements; document unsupported APIs or features explicitly.
6. Update product and architecture docs alongside the implementation.

### Questions for refinement
1. **Which Safari and Firefox minimum versions should be supported?** Older versions can constrain manifest features and API choices.

   **Answer:** just the latest ones

2. **What does “produce Safari build outputs” mean for Safari?** Choose a local unsigned Safari Web Extension project for development, an Xcode archive ready for signing, or a fully distributable App Store package.

   **Answer:** Safari web extension

3. **Which distribution channels are required?** Choose Firefox Add-ons plus Apple App Store, direct/private distribution, or development-only loading.

   **Answer:** These things should be made public.

4. **Should the compatibility layer support only this extension’s current APIs, or also normalise future WebExtension differences?** A narrow wrapper is smaller; a broader abstraction increases portability but adds maintenance.

   **Answer:** Broader abstraction.

5. **What testing evidence is required before calling this complete?** For example, manual smoke tests on installed Safari and Firefox builds, automated unit tests for Fitts’ Law calculations, or both.

   **Answer:** People can, when told the name of the thing, install it on any of the browsers mentioned above

### Documentation impact
- Update `_docs/spec.md` with supported browsers, extension behaviour, and browser-specific limitations.
- Update `_docs/architecture.md` with the compatibility layer and per-browser packaging approach.
- Update `extension/README.md` with development, installation, signing, and release steps for Chromium, Firefox, and Safari.
- Update `_docs/usability-issues.md` if cross-browser changes introduce or expose user-facing workflow risks.

### Related items
- _(parent will fill)_
- Browser-specific limitations and any deliberately unsupported features are documented.
