# Product specification

## Local development

The standalone demonstration is served locally at `http://fitts-law-calculator.local/`.
The development server reads the committed preferred port from `.dev-port`, binds
only to `127.0.0.1`, and serves `index.html` and the extension assets. Run
`npm run dev` for the normal development workflow. The shared Bombay port-80
proxy should route `fitts-law-calculator.local` to port `5238`.
