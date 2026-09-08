/**
 * Popup script for Fitts' Law Overlay Browser Extension
 * Handles toggle UI and communication with content script
 */

const toggleCheckbox = document.getElementById('toggleCheckbox') as HTMLInputElement;
const clarifyModeCheckbox = document.getElementById('clarifyModeCheckbox') as HTMLInputElement;
const clarifyModeContainer = document.getElementById('clarifyModeContainer') as HTMLElement;

/**
 * Update UI based on current overlay state
 */
function updateUI(enabled: boolean, clarifyMode: boolean): void {
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
 */
async function sendMessageToCurrentTab(message: {
  action: string;
}): Promise<{ enabled: boolean; clarifyMode: boolean }> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]?.id) {
    throw new Error('No active tab found');
  }
  return browser.tabs.sendMessage(tabs[0].id, message);
}

/**
 * Toggle the overlay on/off
 */
async function handleToggle(): Promise<void> {
  try {
    const response = await sendMessageToCurrentTab({ action: 'toggle' });
    updateUI(response.enabled, response.clarifyMode);

    // Save state to storage
    await browser.storage.local.set({ fittsLawEnabled: response.enabled });
  } catch (error) {
    console.error('Error toggling overlay:', error);
    // Content script may not be loaded - user should refresh page
  }
}

/**
 * Toggle clarify mode on/off (dim background + highlight clickables)
 */
async function handleClarifyModeToggle(): Promise<void> {
  try {
    const response = await sendMessageToCurrentTab({ action: 'toggleClarifyMode' });
    updateUI(response.enabled, response.clarifyMode);

    // Save state to storage
    await browser.storage.local.set({ fittsLawClarifyMode: response.clarifyMode });
  } catch (error) {
    console.error('Error toggling clarify mode:', error);
    // Content script may not be loaded - user should refresh page
  }
}

/**
 * Get current overlay status
 */
async function getStatus(): Promise<void> {
  try {
    const response = await sendMessageToCurrentTab({ action: 'getStatus' });
    updateUI(response.enabled, response.clarifyMode);
  } catch (error) {
    // Content script may not be loaded yet - try to get from storage
    console.log('Content script not ready:', error);
    const result = await browser.storage.local.get([
      'fittsLawEnabled',
      'fittsLawClarifyMode',
      'fittsLawDimMode',
      'fittsLawHighlightMode',
    ]);

    // Migration: Convert old settings to new clarify mode
    let clarifyMode = result.fittsLawClarifyMode || false;
    if (result.fittsLawDimMode !== undefined || result.fittsLawHighlightMode !== undefined) {
      clarifyMode = result.fittsLawDimMode || result.fittsLawHighlightMode;
      if (clarifyMode) {
        await browser.storage.local.set({ fittsLawClarifyMode: true });
      }
      await browser.storage.local.remove(['fittsLawDimMode', 'fittsLawHighlightMode']);
    }
    updateUI(result.fittsLawEnabled || false, clarifyMode);
  }
}

// Event listeners
toggleCheckbox.addEventListener('change', handleToggle);
clarifyModeCheckbox.addEventListener('change', handleClarifyModeToggle);

// Initialise on popup open
getStatus();
