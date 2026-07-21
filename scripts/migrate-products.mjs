import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const conn = await mysql.createConnection({
    host: '124.221.15.233',
    port: 3311,
    user: 'fuzzsofa',
    password: 'WjqCrvxZ@8',
    database: 'fuzzsofa',
  });

  // Read products JSON
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Found ${products.length} products to migrate`);

  for (const p of products) {
    console.log(`  Migrating: ${p.slug} - ${p.name}`);

    await conn.execute(
      `INSERT INTO products (
        slug, name, animal, tagline, description, concept, interior_context,
        price_range, specifications, materials, material_options, images,
        faq, related_products, related_interiors, meta_description,
        hidden_in_regions, trending_geo, mobile_short_key,
        mobile_features, mobile_story, mobile_crafts, mobile_scenes,
        status, stock_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.slug,
        p.name,
        p.animal || null,
        p.tagline || null,
        p.description || null,
        p.concept || null,
        p.interiorContext || null,
        JSON.stringify(p.priceRange || {}),
        JSON.stringify(p.specifications || {}),
        JSON.stringify(p.materials || []),
        JSON.stringify(p.materialOptions || []),
        JSON.stringify(p.images || []),
        JSON.stringify(p.faq || []),
        JSON.stringify(p.relatedProducts || []),
        JSON.stringify(p.relatedInteriors || []),
        p.metaDescription || null,
        JSON.stringify(p.hiddenInRegions || []),
        JSON.stringify(p.trendingGeo || []),
        p.mobileShortKey || null,
        JSON.stringify(p.mobileFeatures || []),
        JSON.stringify(p.mobileStory || null),
        JSON.stringify(p.mobileCrafts || []),
        JSON.stringify(p.mobileScenes || []),
        'active',
        'in_stock',
      ]
    );
  }

  // Verify
  const [rows] = await conn.execute('SELECT COUNT(*) as count FROM products');
  console.log(`\nMigration complete. Products in DB: ${rows[0].count}`);

  // Show slugs
  const [slugs] = await conn.execute('SELECT slug, name FROM products ORDER BY id');
  for (const s of slugs) {
    console.log(`  - ${s.slug}: ${s.name}`);
  }

  await conn.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
