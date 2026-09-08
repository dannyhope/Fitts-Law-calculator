/**
 * Content script for Fitts' Law Overlay Browser Extension
 * Injects acquisition time overlays for all clickable elements
 * Version: 2.0 (WXT + MV3 + browser.* API)
 */

import '../styles/content.css';
import { calculateMetrics, type FittsMetrics } from '../utils/fitts-law';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    // Debug mode - set to false for production
    const DEBUG = false;

    /**
     * Conditional debug logging
     */
    function debug(...args: unknown[]) {
      if (DEBUG) {
        console.log('[Fitts Debug]', ...args);
      }
    }

    debug('Content script loaded - Version 2.0');

    // Clean up old dim mode class if present (from previous version)
    if (document.body.classList.contains('fitts-law-dim-mode')) {
      debug('Removing old dim mode class from body');
      document.body.classList.remove('fitts-law-dim-mode');
    }

    // State management
    let isEnabled = false;
    let isClarifyModeEnabled = false; // Combined dim + highlight mode
    let clickableElements: HTMLElement[] = [];
    const overlayElements = new Map<HTMLElement, HTMLElement>();
    let dimOverlay: HTMLElement | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId: number | null = null;

    // Configuration
    const OVERLAY_UPDATE_THROTTLE = 16; // ~60fps
    const DIFFICULTY_THRESHOLD_MS = 400; // Targets > 400ms are marked as "difficult" (red)
    let lastUpdateTime = 0;

    /**
     * Find all clickable elements on the page
     */
    function findClickableElements(): HTMLElement[] {
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
        'input[type="radio"]',
      ];

      const elements = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];

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
     */
    function createOverlay(element: HTMLElement): HTMLElement {
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
     */
    function positionOverlay(overlay: HTMLElement, rect: DOMRect): void {
      // Position at top-right corner of element
      overlay.style.left = `${rect.right + 5}px`;
      overlay.style.top = `${rect.top}px`;
    }

    /**
     * Update all overlay labels with current acquisition times
     */
    function updateOverlays(): void {
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
          const metrics = calculateMetrics(mouseX, mouseY, rect);

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

          // Determine colour based on state
          let outlineColor: string;
          if (metrics.isInside) {
            overlay.classList.add('inside');
            outlineColor = 'rgba(76, 175, 80, 0.9)'; // Green
          } else if (metrics.time > DIFFICULTY_THRESHOLD_MS) {
            overlay.classList.add('difficult');
            outlineColor = 'rgba(244, 67, 54, 0.9)'; // Red
          } else {
            outlineColor = 'rgba(139, 149, 165, 0.9)'; // Grey
          }

          // Update outline colour if clarify mode is enabled, remove if disabled
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
    function handleMouseMove(event: MouseEvent): void {
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
    function enable(): void {
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
    function disable(): void {
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

      // Remove highlight attributes and outline colours from all clickable elements
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
    function toggle(): void {
      if (isEnabled) {
        disable();
      } else {
        enable();
      }
    }

    /**
     * Enable clarify mode - dim background and highlight clickables
     */
    function enableClarifyMode(): void {
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
      // Trigger an update to apply highlights with current colours
      updateOverlays();
    }

    /**
     * Disable clarify mode - restore normal page appearance
     */
    function disableClarifyMode(): void {
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

      // Remove all highlight attributes and outline colours from clickable elements
      clickableElements.forEach((element) => {
        element.removeAttribute('data-fitts-highlight');
        element.style.removeProperty('outline-color');
      });

      debug('Clarify mode disabled (removed dim + highlights)');
    }

    /**
     * Toggle clarify mode (dim + highlight)
     */
    function toggleClarifyMode(): void {
      debug('toggleClarifyMode called, current isClarifyModeEnabled:', isClarifyModeEnabled);
      if (isClarifyModeEnabled) {
        disableClarifyMode();
      } else {
        enableClarifyMode();
      }
    }

    // Listen for messages from popup
    browser.runtime.onMessage.addListener(
      (
        request: { action: string },
        sender: browser.Runtime.MessageSender
      ): Promise<{ enabled: boolean; clarifyMode: boolean }> | boolean => {
        if (request.action === 'toggle') {
          toggle();
          return Promise.resolve({
            enabled: isEnabled,
            clarifyMode: isClarifyModeEnabled,
          });
        } else if (request.action === 'toggleClarifyMode') {
          toggleClarifyMode();
          return Promise.resolve({
            enabled: isEnabled,
            clarifyMode: isClarifyModeEnabled,
          });
        } else if (request.action === 'getStatus') {
          return Promise.resolve({
            enabled: isEnabled,
            clarifyMode: isClarifyModeEnabled,
          });
        }
        return false;
      }
    );

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
      subtree: true,
    });

    // Check initial state from storage
    browser.storage.local
      .get(['fittsLawEnabled', 'fittsLawClarifyMode', 'fittsLawDimMode', 'fittsLawHighlightMode'])
      .then((result) => {
        debug('Initial load from storage:', result);

        // Migration: Convert old separate settings to new unified clarify mode
        if (result.fittsLawDimMode !== undefined || result.fittsLawHighlightMode !== undefined) {
          // If either old setting was enabled, enable clarify mode
          const shouldEnableClarify = result.fittsLawDimMode || result.fittsLawHighlightMode;
          if (shouldEnableClarify) {
            isClarifyModeEnabled = true;
            browser.storage.local.set({ fittsLawClarifyMode: true });
            debug('Migrated old settings to clarify mode');
          }
          // Clean up old keys
          browser.storage.local.remove(['fittsLawDimMode', 'fittsLawHighlightMode']);
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
      });
  },
});
