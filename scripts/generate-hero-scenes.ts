import { S3Storage, ImageGenerationClient, Config } from 'coze-coding-dev-sdk';
import fs from 'fs';
import https from 'https';
import http from 'http';

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // Step 1: Initialize storage
  const storage = new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: '',
    secretKey: '',
    bucketName: process.env.COZE_BUCKET_NAME,
    region: 'cn-beijing',
  });

  // Step 2: Upload product images
  console.log('Uploading gorilla product image...');
  const gorillaBuffer = fs.readFileSync('public/products/gorilla-sofa/gray.jpg');
  const gorillaKey = await storage.uploadFile({
    fileContent: gorillaBuffer,
    fileName: 'hero/gorilla-gray.jpg',
    contentType: 'image/png',
  });
  const gorillaUrl = await storage.generatePresignedUrl({ key: gorillaKey, expireTime: 3600 });
  console.log('Gorilla URL ready');

  console.log('Uploading owl product image...');
  const owlBuffer = fs.readFileSync('public/products/owl/snowy-white.png');
  const owlKey = await storage.uploadFile({
    fileContent: owlBuffer,
    fileName: 'hero/owl-snowy-white.png',
    contentType: 'image/png',
  });
  const owlUrl = await storage.generatePresignedUrl({ key: owlKey, expireTime: 3600 });
  console.log('Owl URL ready');

  // Step 3: Generate hero scenes with product reference images
  const config = new Config();
  const client = new ImageGenerationClient(config);

  // Scene 1: Gorilla sofa in luxury living room - same cinematic quality as before
  console.log('\nGenerating gorilla hero scene...');
  const gorillaResponse = await client.generate({
    prompt: 'Ultra-luxury modern living room interior photography. This exact gorilla-shaped plush sofa from the reference image sits as the centerpiece of a grand penthouse living room, facing the camera directly. The room has floor-to-ceiling windows showing a breathtaking city skyline at golden hour dusk, warm ambient lighting throughout, dark polished marble floor reflecting light, a minimal marble coffee table, a tall leafy potted plant, and a designer arc floor lamp casting warm glow. The atmosphere is sophisticated and gallery-like, the sofa appears as a sculptural art piece in a collector home. Cinematic lighting, warm golden hour tones, shot with Hasselblad H6D-100c, interior design magazine cover quality, 8K resolution, photorealistic',
    image: gorillaUrl,
    size: '2K',
  });

  const gorillaHelper = client.getResponseHelper(gorillaResponse);
  if (gorillaHelper.success && gorillaHelper.imageUrls[0]) {
    console.log('Downloading gorilla scene...');
    const imgData = await downloadFile(gorillaHelper.imageUrls[0]);
    fs.writeFileSync('public/hero-scene-1.jpg', imgData);
    console.log('Gorilla hero scene saved:', imgData.length, 'bytes');
  } else {
    console.error('Gorilla scene failed:', gorillaHelper.errorMessages);
  }

  // Scene 2: Owl chair in luxury penthouse at night
  console.log('\nGenerating owl hero scene...');
  const owlResponse = await client.generate({
    prompt: 'Luxury penthouse living space at night, this exact owl-shaped plush chair from the reference image is positioned prominently by a floor-to-ceiling window overlooking a glittering city skyline. Soft warm lighting from a designer brass floor lamp, dark moody walls with contemporary art, a plush wool rug on polished concrete floor, a side table with art books and a ceramic vase. The owl chair faces slightly toward the window, as if gazing at the city lights. Intimate gallery atmosphere, interior photography, warm golden tones, shot with Phase One IQ4, magazine cover quality, photorealistic, 8K',
    image: owlUrl,
    size: '2K',
  });

  const owlHelper = client.getResponseHelper(owlResponse);
  if (owlHelper.success && owlHelper.imageUrls[0]) {
    console.log('Downloading owl scene...');
    const imgData = await downloadFile(owlHelper.imageUrls[0]);
    fs.writeFileSync('public/hero-scene-2.jpg', imgData);
    console.log('Owl hero scene saved:', imgData.length, 'bytes');
  } else {
    console.error('Owl scene failed:', owlHelper.errorMessages);
  }

  console.log('\nDone!');
}

main().catch(e => { console.error(e); process.exit(1); });
