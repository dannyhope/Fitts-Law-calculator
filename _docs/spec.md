# Product specification

## Local development

The standalone demonstration is served locally at `http://fitts-law-calculator.local/`.
The development server reads the committed preferred port from `.dev-port`, binds
only to `127.0.0.1`, and serves `index.html` and the extension assets. Run
`npm run dev` for the normal development workflow. The shared Bombay port-80
proxy should route `fitts-law-calculator.local` to port `5238`.

## Browser extension

The Fitts' Law Overlay is a public WebExtension for the latest stable
Chromium-based browsers, Firefox, and Safari. It detects interactive page
elements, calculates Shannon-formulation acquisition times, and displays the
results locally without collecting data or making external requests.

Popup controls and content-script behaviour must remain consistent across
supported browsers. Shared browser APIs are accessed through a compatibility
layer. Firefox is packaged as a signed WebExtension; Safari is packaged as a
Safari Web Extension App in Xcode and distributed through the Apple App Store.
