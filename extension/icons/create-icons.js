#!/usr/bin/env node

/**
 * Create placeholder PNG icons for Chrome extension
 * Uses Canvas API to generate simple "FL" icons
 */

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background - green from demo
    ctx.fillStyle = '#9de0ad';
    ctx.fillRect(0, 0, size, size);

    // Draw "FL" text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FL', size / 2, size / 2);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Created ${filename} (${size}x${size})`);
}

// Create all required sizes
createIcon(16, 'icon16.png');
createIcon(48, 'icon48.png');
createIcon(128, 'icon128.png');

console.log('\n✓ All icons created successfully!');
