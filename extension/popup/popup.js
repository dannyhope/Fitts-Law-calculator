/**
 * Popup script for Fitts' Law Overlay Chrome Extension
 * Handles toggle UI and communication with content script
 */

(function () {
    'use strict';

    const toggleCheckbox = document.getElementById('toggleCheckbox');
    const clarifyModeCheckbox = document.getElementById('clarifyModeCheckbox');
    const clarifyModeContainer = document.getElementById('clarifyModeContainer');

    /**
     * Update UI based on current overlay state
     * @param {boolean} enabled - Whether overlay is enabled
     * @param {boolean} clarifyMode - Whether clarify mode is enabled (dim + highlight)
     */
    function updateUI(enabled, clarifyMode) {
        toggleCheckbox.checked = enabled;
        clarifyModeCheckbox.checked = clarifyMode || false;

        // Disable clarify option when overlay is off
        if (enabled) {
            clarifyModeContainer.classList.remove('disabled');
        } else {
            clarifyModeContainer.classList.add('disabled');
        }
    }

    /**
     * Get current tab and send message to content script
     * @param {Object} message - Message to send
     * @returns {Promise} Promise resolving with response
     */
    function sendMessageToCurrentTab(message) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(response);
                        }
                    });
                } else {
                    reject(new Error('No active tab found'));
                }
            });
        });
    }

    /**
     * Toggle the overlay on/off
     */
    async function handleToggle() {
        try {
            const response = await sendMessageToCurrentTab({ action: 'toggle' });
            updateUI(response.enabled, response.clarifyMode);

            // Save state to storage
            chrome.storage.local.set({ fittsLawEnabled: response.enabled });
        } catch (error) {
            console.error('Error toggling overlay:', error);
            // Content script may not be loaded - user should refresh page
        }
    }

    /**
     * Toggle clarify mode on/off (dim background + highlight clickables)
     */
    async function handleClarifyModeToggle() {
        try {
            const response = await sendMessageToCurrentTab({ action: 'toggleClarifyMode' });
            updateUI(response.enabled, response.clarifyMode);

            // Save state to storage
            chrome.storage.local.set({ fittsLawClarifyMode: response.clarifyMode });
        } catch (error) {
            console.error('Error toggling clarify mode:', error);
            // Content script may not be loaded - user should refresh page
        }
    }

    /**
     * Get current overlay status
     */
    async function getStatus() {
        try {
            const response = await sendMessageToCurrentTab({ action: 'getStatus' });
            updateUI(response.enabled, response.clarifyMode);
        } catch (error) {
            // Content script may not be loaded yet - try to get from storage
            console.log('Content script not ready:', error);
            chrome.storage.local.get(
                ['fittsLawEnabled', 'fittsLawClarifyMode', 'fittsLawDimMode', 'fittsLawHighlightMode'],
                (result) => {
                    // Migration: Convert old settings to new clarify mode
                    let clarifyMode = result.fittsLawClarifyMode || false;
                    if (
                        result.fittsLawDimMode !== undefined ||
                        result.fittsLawHighlightMode !== undefined
                    ) {
                        clarifyMode = result.fittsLawDimMode || result.fittsLawHighlightMode;
                        if (clarifyMode) {
                            chrome.storage.local.set({ fittsLawClarifyMode: true });
                        }
                        chrome.storage.local.remove(['fittsLawDimMode', 'fittsLawHighlightMode']);
                    }
                    updateUI(result.fittsLawEnabled || false, clarifyMode);
                }
            );
        }
    }

    // Event listeners
    toggleCheckbox.addEventListener('change', handleToggle);
    clarifyModeCheckbox.addEventListener('change', handleClarifyModeToggle);

    // Initialize on popup open
    getStatus();
})();
