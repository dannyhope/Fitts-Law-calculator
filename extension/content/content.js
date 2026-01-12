/**
 * Content script for Fitts' Law Overlay Chrome Extension
 * Injects acquisition time overlays for all clickable elements
 * Version: 1.1 (with separate dim overlay layer)
 */

(function () {
    'use strict';

    // Debug mode - set to false for production
    const DEBUG = false;

    /**
     * Conditional debug logging
     * @param {...any} args - Arguments to log
     */
    function debug(...args) {
        if (DEBUG) {
            console.log('[Fitts Debug]', ...args);
        }
    }

    debug('Content script loaded - Version 1.1');

    // Clean up old dim mode class if present (from previous version)
    if (document.body.classList.contains('fitts-law-dim-mode')) {
        debug('Removing old dim mode class from body');
        document.body.classList.remove('fitts-law-dim-mode');
    }

    // State management
    let isEnabled = false;
    let isClarifyModeEnabled = false; // Combined dim + highlight mode
    let clickableElements = [];
    let overlayElements = new Map();
    let dimOverlay = null;
    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId = null;

    // Configuration
    const OVERLAY_UPDATE_THROTTLE = 16; // ~60fps
    const DIFFICULTY_THRESHOLD_MS = 400; // Targets > 400ms are marked as "difficult" (red)
    let lastUpdateTime = 0;

    /**
     * Find all clickable elements on the page
     * @returns {Array<HTMLElement>} Array of clickable elements
     */
    function findClickableElements() {
        const selectors = [
            'a[href]',
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            'input[type="reset"]',
            '[onclick]',
            '[role="button"]',
            '[role="link"]',
            '[tabindex]:not([tabindex="-1"])',
            'select',
            'textarea',
            'input[type="checkbox"]',
            'input[type="radio"]'
        ];

        const elements = Array.from(document.querySelectorAll(selectors.join(',')));

        // Filter out hidden or zero-size elements
        return elements.filter((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0'
            );
        });
    }

    /**
     * Create overlay label element for displaying acquisition time
     * @param {HTMLElement} element - The target element
     * @returns {HTMLElement} Overlay label element
     */
    function createOverlay(element) {
        const overlay = document.createElement('div');
        overlay.className = 'fitts-law-overlay';
        overlay.setAttribute('data-fitts-overlay', 'true');
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-live', 'polite');
        document.body.appendChild(overlay);

        // Debug: Log first chip creation
        if (overlayElements.size === 0) {
            debug('First chip created, z-index:', window.getComputedStyle(overlay).zIndex);
        }

        return overlay;
    }

    /**
     * Position overlay next to its target element
     * @param {HTMLElement} overlay - The overlay element
     * @param {DOMRect} rect - Bounding rect of target element
     */
    function positionOverlay(overlay, rect) {
        // Position at top-right corner of element
        overlay.style.left = `${rect.right + 5}px`;
        overlay.style.top = `${rect.top}px`;
    }

    /**
     * Update all overlay labels with current acquisition times
     */
    function updateOverlays() {
        const now = Date.now();
        if (now - lastUpdateTime < OVERLAY_UPDATE_THROTTLE) {
            return;
        }
        lastUpdateTime = now;

        clickableElements.forEach((element) => {
            try {
                const rect = element.getBoundingClientRect();

                // Skip elements that are off-screen or hidden
                if (rect.width === 0 || rect.height === 0) {
                    const overlay = overlayElements.get(element);
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    // Also hide highlight if enabled
                    if (isClarifyModeEnabled) {
                        element.removeAttribute('data-fitts-highlight');
                        element.style.removeProperty('outline-color');
                    }
                    return;
                }

                // Calculate Fitts' Law metrics
                const metrics = window.FittsLaw.calculateMetrics(mouseX, mouseY, rect);

                if (!metrics) {
                    return;
                }

                // Get or create overlay
                let overlay = overlayElements.get(element);
                if (!overlay) {
                    overlay = createOverlay(element);
                    overlayElements.set(element, overlay);
                }

                // Update overlay content and position
                overlay.style.display = 'block';
                overlay.textContent = `${Math.round(metrics.time)}ms`;
                positionOverlay(overlay, rect);

                // Reset all state classes
                overlay.classList.remove('inside', 'difficult');

                // Determine color based on state
                let outlineColor;
                if (metrics.isInside) {
                    overlay.classList.add('inside');
                    outlineColor = 'rgba(76, 175, 80, 0.9)'; // Green
                } else if (metrics.time > DIFFICULTY_THRESHOLD_MS) {
                    overlay.classList.add('difficult');
                    outlineColor = 'rgba(244, 67, 54, 0.9)'; // Red
                } else {
                    outlineColor = 'rgba(139, 149, 165, 0.9)'; // Grey
                }

                // Update outline color if clarify mode is enabled, remove if disabled
                if (isClarifyModeEnabled) {
                    element.setAttribute('data-fitts-highlight', 'true');
                    element.style.setProperty('outline-color', outlineColor, 'important');
                } else {
                    // Remove highlight if clarify mode was turned off
                    element.removeAttribute('data-fitts-highlight');
                    element.style.removeProperty('outline-color');
                }
            } catch (error) {
                console.error('Error updating overlay:', error);
            }
        });
    }

    /**
     * Handle mouse movement with throttled updates
     */
    function handleMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (isEnabled && !animationFrameId) {
            animationFrameId = requestAnimationFrame(() => {
                updateOverlays();
                animationFrameId = null;
            });
        }
    }

    /**
     * Enable the Fitts' Law overlay
     */
    function enable() {
        if (isEnabled) {
            return;
        }

        isEnabled = true;
        clickableElements = findClickableElements();

        console.log(`Fitts' Law Overlay: Found ${clickableElements.length} clickable elements`);
        debug('isClarifyModeEnabled on enable:', isClarifyModeEnabled);

        // Add mouse move listener
        document.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Initial update (this will apply highlights if clarify mode is on)
        updateOverlays();

        // Re-apply clarify mode if the preference is enabled
        if (isClarifyModeEnabled) {
            debug('Re-applying clarify mode on overlay enable');
            // Create dim overlay element if it doesn't exist
            if (!dimOverlay) {
                dimOverlay = document.createElement('div');
                dimOverlay.className = 'fitts-law-dim-overlay';
                dimOverlay.setAttribute('data-fitts-dim', 'true');
                document.body.appendChild(dimOverlay);
                debug('Dim overlay created in enable()');
            }
            // Highlights will be applied by updateOverlays() above
        }
    }

    /**
     * Disable the Fitts' Law overlay and clean up
     */
    function disable() {
        if (!isEnabled) {
            return;
        }

        debug('Disabling overlay, preserving isClarifyModeEnabled:', isClarifyModeEnabled);
        isEnabled = false;

        // Remove dim overlay visually, but keep the preference
        if (dimOverlay) {
            debug('Removing dim overlay element');
            dimOverlay.remove();
            dimOverlay = null;
        }

        // Remove highlight attributes and outline colors from all clickable elements
        clickableElements.forEach((element) => {
            element.removeAttribute('data-fitts-highlight');
            element.style.removeProperty('outline-color');
        });
        debug('Removed clarify visual effects (keeping preference)');

        // Remove mouse listener
        document.removeEventListener('mousemove', handleMouseMove);

        // Cancel any pending animation frame
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        // Remove all overlays
        overlayElements.forEach((overlay) => {
            overlay.remove();
        });
        overlayElements.clear();
        clickableElements = [];

        console.log("Fitts' Law Overlay: Disabled");
    }

    /**
     * Toggle the overlay on/off
     */
    function toggle() {
        if (isEnabled) {
            disable();
        } else {
            enable();
        }
    }

    /**
     * Enable clarify mode - dim background and highlight clickables
     */
    function enableClarifyMode() {
        if (isClarifyModeEnabled) {
            debug('Clarify mode already enabled');
            return;
        }
        isClarifyModeEnabled = true;

        // Only apply visual effects if overlay is enabled
        if (!isEnabled) {
            debug('Clarify mode preference saved (overlay off, will apply when overlay enabled)');
            return;
        }

        // Create dim overlay element
        if (!dimOverlay) {
            dimOverlay = document.createElement('div');
            dimOverlay.className = 'fitts-law-dim-overlay';
            dimOverlay.setAttribute('data-fitts-dim', 'true');
            document.body.appendChild(dimOverlay);
            debug('Dim overlay created');
        }

        debug('Clarify mode enabled (dim + dynamic highlight)');
        // Trigger an update to apply highlights with current colors
        updateOverlays();
    }

    /**
     * Disable clarify mode - restore normal page appearance
     */
    function disableClarifyMode() {
        if (!isClarifyModeEnabled) {
            debug('Clarify mode already disabled');
            return;
        }
        isClarifyModeEnabled = false;

        // Remove dim overlay element
        if (dimOverlay) {
            debug('Removing dim overlay');
            dimOverlay.remove();
            dimOverlay = null;
        }

        // Remove all highlight attributes and outline colors from clickable elements
        clickableElements.forEach((element) => {
            element.removeAttribute('data-fitts-highlight');
            element.style.removeProperty('outline-color');
        });

        debug('Clarify mode disabled (removed dim + highlights)');
    }

    /**
     * Toggle clarify mode (dim + highlight)
     */
    function toggleClarifyMode() {
        debug('toggleClarifyMode called, current isClarifyModeEnabled:', isClarifyModeEnabled);
        if (isClarifyModeEnabled) {
            disableClarifyMode();
        } else {
            enableClarifyMode();
        }
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'toggle') {
            toggle();
            sendResponse({
                enabled: isEnabled,
                clarifyMode: isClarifyModeEnabled
            });
        } else if (request.action === 'toggleClarifyMode') {
            toggleClarifyMode();
            sendResponse({
                enabled: isEnabled,
                clarifyMode: isClarifyModeEnabled
            });
        } else if (request.action === 'getStatus') {
            sendResponse({
                enabled: isEnabled,
                clarifyMode: isClarifyModeEnabled
            });
        }
        return true;
    });

    // Handle page updates (new elements added via AJAX, etc.)
    const observer = new MutationObserver(() => {
        if (isEnabled) {
            clickableElements = findClickableElements();
            // Remove overlays for elements that no longer exist
            overlayElements.forEach((overlay, element) => {
                if (!document.contains(element)) {
                    overlay.remove();
                    overlayElements.delete(element);
                }
            });
        }
    });

    // Start observing DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Check initial state from storage
    chrome.storage.local.get(
        ['fittsLawEnabled', 'fittsLawClarifyMode', 'fittsLawDimMode', 'fittsLawHighlightMode'],
        (result) => {
            debug('Initial load from storage:', result);

            // Migration: Convert old separate settings to new unified clarify mode
            if (result.fittsLawDimMode !== undefined || result.fittsLawHighlightMode !== undefined) {
                // If either old setting was enabled, enable clarify mode
                const shouldEnableClarify = result.fittsLawDimMode || result.fittsLawHighlightMode;
                if (shouldEnableClarify) {
                    isClarifyModeEnabled = true;
                    chrome.storage.local.set({ fittsLawClarifyMode: true });
                    debug('Migrated old settings to clarify mode');
                }
                // Clean up old keys
                chrome.storage.local.remove(['fittsLawDimMode', 'fittsLawHighlightMode']);
            } else if (result.fittsLawClarifyMode) {
                // Load clarify mode preference from new setting
                isClarifyModeEnabled = true;
                debug('Loaded isClarifyModeEnabled = true from storage');
            }

            if (result.fittsLawEnabled) {
                debug('Enabling overlay on initial load');
                enable();
                // Clarify mode (dim + highlight) will be applied by enable() if isClarifyModeEnabled is true
            }
        }
    );
})();
