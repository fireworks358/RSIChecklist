const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const nhsBlue = '#005EB8';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // NHS Blue background
  ctx.fillStyle = nhsBlue;
  ctx.fillRect(0, 0, size, size);

  // White text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  const titleFontSize = Math.floor(size / 8);
  ctx.font = `bold ${titleFontSize}px Arial`;
  ctx.fillText('NHS', size / 2, size / 2 - titleFontSize / 2);

  // Subtitle
  const subtitleFontSize = Math.floor(size / 16);
  ctx.font = `${subtitleFontSize}px Arial`;
  ctx.fillText('Airway', size / 2, size / 2 + subtitleFontSize);
  ctx.fillText('Portal', size / 2, size / 2 + subtitleFontSize * 2);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(__dirname, 'public', 'icons', `icon-${size}.png`);
  fs.writeFileSync(filePath, buffer);

  console.log(`Created: icon-${size}.png`);
}

// Generate all icon sizes
sizes.forEach(size => generateIcon(size));

console.log('All placeholder icons generated successfully!');
