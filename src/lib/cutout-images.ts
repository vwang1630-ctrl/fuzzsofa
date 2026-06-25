/**
 * Cutout image mapping for room visualization compositing.
 * These transparent-background product images are used exclusively by the
 * AI room preview feature — they are never shown on product pages.
 *
 * Only map files that ACTUALLY EXIST in /public/products/cutout/.
 * Non-existent files will cause the canvas to fail silently.
 */

export const cutoutImages: Record<string, string> = {
  // Owl Sofa — cutout images that exist
  // color index matches materialOptions[].colors order in products.ts
  "owl-sofa/1": "/products/cutout/owl-sofa-rose-pink.png",        // Rose Pink Velvet
  "owl-sofa/2": "/products/cutout/owl-sofa-forest-green.png",     // Forest Green Velvet
  "owl-sofa/3": "/products/cutout/owl-sofa-dark-brown.png",       // Dark Brown Leather

  // Note: owl-sofa/0 (Snow White Bouclé) cutout not yet uploaded
  // Note: gorilla-sofa, silverback-sofa, meteorite-ring-sofa, muscle-gorilla-sofa
  //       cutouts not yet uploaded — will fall back to dark bg removal
};

/**
 * Color name → index mapping for products with multiple cutout variants.
 * Keys are lowercase, trimmed color names.
 */
const colorNameToIndex: Record<string, Record<string, number>> = {
  "owl-sofa": {
    "snow white bouclé": 0,
    "snow white boucle": 0,
    "rose pink velvet": 1,
    "rose pink": 1,
    "forest green velvet": 2,
    "forest green": 2,
    "warm gray linen": 3,
    "warm gray": 3,
    "dark brown leather": 3,
    "dark brown": 3,
  },
};

/**
 * Get the cutout image path for a product + color selection.
 * Returns null if no cutout exists for this product/color combo —
 * the caller should fall back to the original product image.
 */
export function getCutoutImage(productSlug: string, colorIndexOrName: number | string = 0): string | null {
  let colorIndex: number;

  if (typeof colorIndexOrName === "number") {
    colorIndex = colorIndexOrName;
  } else {
    // Resolve color name to index
    const nameMap = colorNameToIndex[productSlug];
    const normalizedName = colorIndexOrName.toLowerCase().trim();
    colorIndex = nameMap?.[normalizedName] ?? 0;
  }

  const key = `${productSlug}/${colorIndex}`;
  if (cutoutImages[key]) return cutoutImages[key];

  // Fallback: try index 0 for this product
  const fallbackKey = `${productSlug}/0`;
  if (cutoutImages[fallbackKey]) return cutoutImages[fallbackKey];

  return null;
}
