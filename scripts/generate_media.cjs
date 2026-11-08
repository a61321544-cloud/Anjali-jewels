const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const storePath = path.join(__dirname, '../data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const outDir = path.join(__dirname, '../public/assets/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting media processing for ${store.products.length} products...`);

store.products.forEach((product, idx) => {
  const origRelPath = product.image.replace(/^\//, '');
  const inputImg = path.join(__dirname, '../public', origRelPath);

  if (!fs.existsSync(inputImg)) {
    console.warn(`Input image not found: ${inputImg}`);
    return;
  }

  const angleImg = path.join(outDir, `${product.id}_angle.jpg`);
  const detailImg = path.join(outDir, `${product.id}_detail.jpg`);
  const videoMp4 = path.join(outDir, `${product.id}_preview.mp4`);

  // 1. Generate Alternate Three-Quarter Angle
  if (!fs.existsSync(angleImg)) {
    try {
      execSync(
        `convert "${inputImg}" -filter Lanczos -distort Perspective "0,0 20,15  0,1280 15,1265  853,0 838,30  853,1280 838,1250" -modulate 103,106,100 -quality 92 "${angleImg}"`
      );
    } catch (e) {
      console.error(`Error generating angle for ${product.id}:`, e.message);
    }
  }

  // 2. Generate Close-Up Macro Detail
  if (!fs.existsSync(detailImg)) {
    try {
      execSync(
        `convert "${inputImg}" -gravity center -crop 62%x62%+0+0 +repage -unsharp 0x1+1.2+0.05 -quality 92 "${detailImg}"`
      );
    } catch (e) {
      console.error(`Error generating detail for ${product.id}:`, e.message);
    }
  }

  // 3. Generate 4-Second H.264 Playable Video
  if (!fs.existsSync(videoMp4)) {
    try {
      execSync(
        `ffmpeg -y -loop 1 -i "${inputImg}" -c:v libx264 -t 4 -pix_fmt yuv420p -vf "scale=720:960:force_original_aspect_ratio=decrease,pad=720:960:(ow-iw)/2:(oh-ih)/2:color=#1A0A10,zoompan=z='min(zoom+0.0015,1.1)':d=100:s=720x960:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" -r 25 -movflags +faststart "${videoMp4}" 2>/dev/null`
      );
    } catch (e) {
      console.error(`Error generating video for ${product.id}:`, e.message);
    }
  }

  // Update product data structure
  product.images = [
    product.image,
    `/assets/products/${product.id}_angle.jpg`,
    `/assets/products/${product.id}_detail.jpg`
  ];
  product.video = `/assets/products/${product.id}_preview.mp4`;
  product.videoPoster = product.image;

  process.stdout.write(`Processed [${idx + 1}/${store.products.length}] ${product.code}: ${product.name}\n`);
});

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('Successfully completed media generation and updated data/store.json!');
