import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const sourceImage = path.resolve(publicDir, "images/profile/nikhil-upload-hero.png");

// Pack multiple PNG buffers into a valid ICO format
function createIcoFile(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // number of icons

  let offset = 6 + (16 * count);
  const dirEntries = [];

  for (const { width, height, buffer } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // file offset to image data
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map(i => i.buffer)]);
}

async function run() {
  console.log("Generating profile avatar favicons...");
  console.log("Source image:", sourceImage);

  const MASTER_SIZE = 512;
  const strokeWidth = 14;
  const radius = MASTER_SIZE / 2;
  const innerRadius = radius - strokeWidth;

  // 1. Crop face/headshot from 1000x1000 source
  const croppedFaceBuffer = await sharp(sourceImage)
    .extract({ left: 140, top: 40, width: 720, height: 720 })
    .resize(MASTER_SIZE, MASTER_SIZE, { fit: "cover" })
    .toBuffer();

  // 2. Circular mask for the photo
  const photoMaskSvg = Buffer.from(`
    <svg width="${MASTER_SIZE}" height="${MASTER_SIZE}">
      <circle cx="${radius}" cy="${radius}" r="${innerRadius}" fill="white" />
    </svg>
  `);

  const maskedPhoto = await sharp(croppedFaceBuffer)
    .composite([{ input: photoMaskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  // 3. Subtle gradient border ring
  const ringSvg = Buffer.from(`
    <svg width="${MASTER_SIZE}" height="${MASTER_SIZE}">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a3e635" />
          <stop offset="50%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth / 2}" fill="none" stroke="url(#ringGrad)" stroke-width="${strokeWidth}" />
    </svg>
  `);

  // 4. Assemble the master 512x512 circular avatar on a transparent canvas
  const masterAvatarBuffer = await sharp({
    create: {
      width: MASTER_SIZE,
      height: MASTER_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: maskedPhoto, top: 0, left: 0 },
      { input: ringSvg, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  // 5. Generate all required PNG sizes
  const sizes = [
    { name: "icon-512.png", size: 512 },
    { name: "icon-192.png", size: 192 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "favicon-48x48.png", size: 48 }, // Google Search recommended size
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-16x16.png", size: 16 },
  ];

  const pngBuffers = {};
  for (const { name, size } of sizes) {
    const resized = await sharp(masterAvatarBuffer)
      .resize(size, size, { fit: "contain" })
      .png()
      .toBuffer();

    pngBuffers[size] = resized;
    await fs.writeFile(path.resolve(publicDir, name), resized);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // 6. Generate favicon.ico containing 16x16, 32x32, 48x48
  const icoImages = [
    { width: 16, height: 16, buffer: pngBuffers[16] },
    { width: 32, height: 32, buffer: pngBuffers[32] },
    { width: 48, height: 48, buffer: pngBuffers[48] },
  ];
  const icoBuffer = createIcoFile(icoImages);
  await fs.writeFile(path.resolve(publicDir, "favicon.ico"), icoBuffer);
  console.log("✓ Generated favicon.ico (16, 32, 48)");

  // 7. Generate favicon.svg embedding the high-res circular photo + gradient ring
  const base64Photo = pngBuffers[512].toString("base64");
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="248" />
    </clipPath>
  </defs>
  <image
    href="data:image/png;base64,${base64Photo}"
    x="0"
    y="0"
    width="512"
    height="512"
    clip-path="url(#circleClip)"
    preserveAspectRatio="xMidYMid slice"
  />
</svg>
`;
  await fs.writeFile(path.resolve(publicDir, "favicon.svg"), svgContent);
  console.log("✓ Generated favicon.svg with embedded high-res circular avatar");

  // 8. Create site.webmanifest for PWA & Google Search Console
  const manifest = {
    name: "Nikhil Agrahari Portfolio",
    short_name: "Nikhil",
    description: "Nikhil Agrahari - Full Stack Developer & MERN Stack Engineer Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#030d07",
    theme_color: "#a3e635",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
  await fs.writeFile(
    path.resolve(publicDir, "site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("✓ Generated site.webmanifest");

  console.log("🎉 All favicons generated successfully!");
}

run().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
