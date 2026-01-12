#!/usr/bin/env node

/**
 * Create simple placeholder PNG icons without dependencies
 * Creates solid green squares that Chrome will accept
 */

const fs = require('fs');
const zlib = require('zlib');

function createSimplePNG(size) {
    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0); // Width
    ihdr.writeUInt32BE(size, 4); // Height
    ihdr.writeUInt8(8, 8); // Bit depth
    ihdr.writeUInt8(2, 9); // Color type (RGB)
    ihdr.writeUInt8(0, 10); // Compression
    ihdr.writeUInt8(0, 11); // Filter
    ihdr.writeUInt8(0, 12); // Interlace

    // Image data - solid green (#9de0ad)
    const scanlines = [];
    for (let y = 0; y < size; y++) {
        const scanline = Buffer.alloc(1 + size * 3);
        scanline.writeUInt8(0, 0); // Filter type (none)
        for (let x = 0; x < size; x++) {
            const offset = 1 + x * 3;
            scanline.writeUInt8(0x9d, offset); // R
            scanline.writeUInt8(0xe0, offset + 1); // G
            scanline.writeUInt8(0xad, offset + 2); // B
        }
        scanlines.push(scanline);
    }

    const imageData = Buffer.concat(scanlines);
    const compressedData = zlib.deflateSync(imageData);

    // Create chunks
    function createChunk(type, data) {
        const length = Buffer.alloc(4);
        length.writeUInt32BE(data.length, 0);

        const typeBuffer = Buffer.from(type, 'ascii');
        const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
        const crcBuffer = Buffer.alloc(4);
        crcBuffer.writeUInt32BE(crc, 0);

        return Buffer.concat([length, typeBuffer, data, crcBuffer]);
    }

    function calculateCRC(buffer) {
        let crc = 0xffffffff;
        for (let i = 0; i < buffer.length; i++) {
            crc = crc ^ buffer[i];
            for (let j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >>> 1) ^ 0xedb88320;
                } else {
                    crc = crc >>> 1;
                }
            }
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    const ihdrChunk = createChunk('IHDR', ihdr);
    const idatChunk = createChunk('IDAT', compressedData);
    const iendChunk = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Create all required sizes
const sizes = [
    { size: 16, name: 'icon16.png' },
    { size: 48, name: 'icon48.png' },
    { size: 128, name: 'icon128.png' }
];

const dir = __dirname;

sizes.forEach(({ size, name }) => {
    const png = createSimplePNG(size);
    const filepath = `${dir}/${name}`;
    fs.writeFileSync(filepath, png);
    console.log(`✓ Created ${name} (${size}x${size}) - ${png.length} bytes`);
});

console.log('\n✅ All icons created successfully!');
console.log('The extension should now load without errors.');
