import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: "Fitts' Law Overlay",
    version: '1.0.0',
    description:
      "Visualise Fitts' Law acquisition times for all clickable elements on any webpage using Shannon's formulation",
    permissions: ['activeTab', 'storage'],
    author: 'Danny Hope <danny.hope@gmail.com>',
    homepage_url: 'https://github.com/dannyhope/fitts-law-calculator',
    icons: {
      16: '/icons/icon16.png',
      48: '/icons/icon48.png',
      128: '/icons/icon128.png',
    },
    browser_specific_settings: {
      gecko: {
        id: 'fitts-law-overlay@dannyhope.github.io',
      },
    },
  },
  browser: 'chrome',
  manifestVersion: 3,
  runner: {
    disabled: true,
  },
});
