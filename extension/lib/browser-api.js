/**
 * Small WebExtensions compatibility layer.
 *
 * Firefox and Safari expose the Promise-based `browser` namespace while
 * Chromium exposes the callback-based `chrome` namespace. This extension only
 * needs the shared API surface below, so product code can use one namespace.
 */
(function (root) {
    'use strict';

    if (root.browser) {
        root.FittsBrowser = root.browser;
        return;
    }

    if (root.chrome) {
        root.FittsBrowser = root.chrome;
        return;
    }

    throw new Error('Fitts’ Law Overlay requires a WebExtensions API');
})(typeof globalThis === 'object' ? globalThis : window);
