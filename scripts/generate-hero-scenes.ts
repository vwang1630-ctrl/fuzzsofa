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

  // Scene 1: Gorilla sofa in luxury living room
  console.log('\nGenerating gorilla hero scene...');
  const gorillaResponse = await client.generate({
    prompt: 'Place this exact gorilla-shaped plush sofa into a luxury modern penthouse living room. The room has dark walls, polished dark marble floor, large floor-to-ceiling windows with a city night skyline, warm golden ambient lighting from a designer arc floor lamp, a low marble coffee table, and a tall potted plant. The gorilla sofa is the centerpiece, positioned facing the camera in the center of the room. Interior design magazine quality, cinematic, professional architecture photography, warm tones',
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

  // Scene 2: Owl chair in elegant reading room
  console.log('\nGenerating owl hero scene...');
  const owlResponse = await client.generate({
    prompt: 'Place this exact owl-shaped plush chair into an elegant luxury reading nook. The room has dark walls with built-in bookshelves filled with art books, a warm Persian rug on the dark wooden floor, a brass floor lamp casting golden light beside the chair, a marble side table with a coffee cup and books. The owl chair is positioned prominently near a tall window with sheer curtains and soft natural light coming through. Interior design magazine quality, cinematic, professional photography, warm golden tones',
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
