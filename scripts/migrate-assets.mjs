import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

const client = new S3Client({
  endpoint: 'http://124.221.15.233:9000',
  region: 'cn-beijing',
  credentials: {
    accessKeyId: 'IYn5raEN1RleeYRQwhnu',
    secretAccessKey: 'WjqCrvxZHTTS1W8Ly6wdDE5QE9zk5C1Scyjq4E43',
  },
  forcePathStyle: true,
});

const BUCKET = 'fuzzsofa';

// Directories to migrate (relative to project root)
const DIRS_TO_MIGRATE = [
  'public/products',
  'public/interiors',
  'public/scenes',
];

// Individual files to migrate
const FILES_TO_MIGRATE = [
  'public/gorilla-sofa-hero.jpg',
  'public/hero-gorilla-v2-aggressive.png',
  'public/hero-gorilla-v2-with-feet.png',
  'public/hero-owl-clean.png',
  'public/hero-owl-extracted.png',
  'public/hero-owl-v2-extracted.png',
  'public/hero-scene-1-empty.jpg',
  'public/hero-scene-1-no-lamp.jpg',
  'public/hero-scene-1.jpg',
  'public/hero-scene-2-empty-b.jpg',
  'public/hero-scene-2-empty.jpg',
  'public/hero-scene-2.jpg',
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

async function uploadFile(filePath, key) {
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(filePath);

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  }));

  return { key, size: fileBuffer.length, contentType };
}

async function migrate() {
  let totalFiles = 0;
  let totalSize = 0;
  const results = [];

  // Collect all files
  const allFiles = [];

  for (const dir of DIRS_TO_MIGRATE) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    const files = getAllFiles(fullPath);
    for (const f of files) {
      const relativePath = path.relative(PROJECT_ROOT, f);
      allFiles.push({ localPath: f, key: relativePath });
    }
  }

  for (const file of FILES_TO_MIGRATE) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      allFiles.push({ localPath: fullPath, key: file });
    }
  }

  console.log(`Found ${allFiles.length} files to migrate\n`);

  // Upload in batches of 5
  const BATCH_SIZE = 5;
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    const promises = batch.map(f => uploadFile(f.localPath, f.key));

    try {
      const batchResults = await Promise.all(promises);
      for (const r of batchResults) {
        totalFiles++;
        totalSize += r.size;
        console.log(`  [${totalFiles}/${allFiles.length}] ${r.key} (${Math.round(r.size / 1024)}KB)`);
      }
    } catch (err) {
      console.error(`  Batch error: ${err.message}`);
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`  Files uploaded: ${totalFiles}`);
  console.log(`  Total size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`  Bucket: ${BUCKET}`);
  console.log(`  Public URL: http://124.221.15.233:9000/${BUCKET}/<key>`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
