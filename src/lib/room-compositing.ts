/**
 * Room Compositing Engine
 * 
 * Places the EXACT product image into a room photo using Canvas compositing.
 * No AI generation — the product is pixel-perfect, zero deformation.
 * 
 * Process:
 * 1. Remove dark background from product image (luminance keying)
 * 2. Overlay the product cutout onto the room image
 * 3. Add realistic shadow
 * 4. Export composited result
 */

/**
 * Remove dark background from a product image using luminance keying.
 * Since product photos are shot on near-black backgrounds (#0A0A0A),
 * we can reliably separate product from background by luminance threshold.
 */
export function removeDarkBackground(
  sourceCanvas: HTMLCanvasElement,
  threshold: number = 25,
  featherRadius: number = 15,
): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Cannot get canvas context");

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Pass 1: Compute luminance and create alpha mask
  const alphaMask = new Float32Array(w * h);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const idx = i / 4;
    
    if (luminance < threshold) {
      alphaMask[idx] = 0;
    } else if (luminance < threshold + featherRadius) {
      // Feather the edges for smooth transition
      alphaMask[idx] = (luminance - threshold) / featherRadius;
    } else {
      alphaMask[idx] = 1;
    }
  }

  // Pass 2: Apply alpha mask with edge refinement
  // Detect edges (where alpha changes significantly) and apply extra feathering
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const current = alphaMask[idx];
      
      // If this pixel is near an edge (alpha transition)
      const neighbors = [
        alphaMask[(y - 1) * w + x],
        alphaMask[(y + 1) * w + x],
        alphaMask[y * w + (x - 1)],
        alphaMask[y * w + (x + 1)],
      ];
      
      const maxNeighbor = Math.max(...neighbors);
      const minNeighbor = Math.min(...neighbors);
      
      if (maxNeighbor - minNeighbor > 0.3 && current > 0 && current < 1) {
        // Smooth edge: average with neighbors
        alphaMask[idx] = (current + neighbors.reduce((a, b) => a + b, 0) / 4) / 2;
      }
    }
  }

  // Pass 3: Write alpha back to image data
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    data[i + 3] = Math.round(alphaMask[idx] * 255);
    
    // Slightly boost color saturation for pixels near the edge
    // to compensate for dark background bleed
    const alpha = alphaMask[idx];
    if (alpha > 0 && alpha < 1) {
      const boost = 1 + (1 - alpha) * 0.3;
      data[i] = Math.min(255, Math.round(data[i] * boost));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * boost));
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * boost));
    }
  }

  const resultCanvas = document.createElement("canvas");
  resultCanvas.width = w;
  resultCanvas.height = h;
  const resultCtx = resultCanvas.getContext("2d")!;
  resultCtx.putImageData(imageData, 0, 0);
  
  return resultCanvas;
}

/**
 * Load an image from URL into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw an image onto a canvas, returning the canvas
 */
export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export interface CompositeOptions {
  /** Room image as data URL */
  roomImage: string;
  /** Product image URL (original with dark background — used as fallback) */
  productImageUrl: string;
  /** Pre-cutout product image URL (transparent background — preferred if available) */
  cutoutImageUrl?: string;
  /** Product position X (0-1, relative to room width) */
  positionX: number;
  /** Product position Y (0-1, relative to room height) */
  positionY: number;
  /** Product scale (0.1-1.0, relative to room height) */
  scale: number;
  /** Shadow opacity (0-1) */
  shadowOpacity: number;
  /** Shadow blur radius in pixels */
  shadowBlur: number;
  /** Shadow offset X */
  shadowOffsetX: number;
  /** Shadow offset Y */
  shadowOffsetY: number;
}

/**
 * Composite the product cutout onto the room image.
 * If a pre-cutout image (transparent background) is available, it's used directly.
 * Otherwise, falls back to luminance-based background removal from the product photo.
 * Returns a data URL of the final composited image.
 */
export async function compositeRoomImage(
  options: CompositeOptions,
): Promise<string> {
  const roomImg = await loadImage(options.roomImage);

  // Determine the product source: prefer pre-cutout, fallback to original + bg removal
  let cutoutCanvas: HTMLCanvasElement;
  let productNaturalW: number;
  let productNaturalH: number;

  if (options.cutoutImageUrl) {
    // Use pre-cutout image directly — pixel-perfect, zero deformation
    const cutoutImg = await loadImage(options.cutoutImageUrl);
    cutoutCanvas = imageToCanvas(cutoutImg);
    productNaturalW = cutoutImg.naturalWidth;
    productNaturalH = cutoutImg.naturalHeight;
  } else {
    // Fallback: load original product photo and remove dark background
    const productImg = await loadImage(options.productImageUrl);
    const productCanvas = imageToCanvas(productImg);
    cutoutCanvas = removeDarkBackground(productCanvas);
    productNaturalW = productImg.naturalWidth;
    productNaturalH = productImg.naturalHeight;
  }

  // Create canvas at room image size
  const canvas = document.createElement("canvas");
  canvas.width = roomImg.naturalWidth;
  canvas.height = roomImg.naturalHeight;
  const ctx = canvas.getContext("2d")!;

  // Draw room as base
  ctx.drawImage(roomImg, 0, 0);

  // Calculate product placement
  const roomW = canvas.width;
  const roomH = canvas.height;
  
  // Product should fit within the room, scaled by options
  const productDisplayH = roomH * options.scale;
  const aspectRatio = productNaturalW / productNaturalH;
  const productDisplayW = productDisplayH * aspectRatio;
  
  const posX = roomW * options.positionX - productDisplayW / 2;
  const posY = roomH * options.positionY - productDisplayH / 2;

  // Draw shadow first (beneath the product)
  if (options.shadowOpacity > 0) {
    ctx.save();
    ctx.shadowColor = `rgba(0, 0, 0, ${options.shadowOpacity})`;
    ctx.shadowBlur = options.shadowBlur * (roomH / 800); // Scale blur with room size
    ctx.shadowOffsetX = options.shadowOffsetX * (roomH / 800);
    ctx.shadowOffsetY = options.shadowOffsetY * (roomH / 800);
    
    // Draw the cutout as the shadow source
    ctx.drawImage(cutoutCanvas, posX, posY, productDisplayW, productDisplayH);
    ctx.restore();
  }

  // Draw the product cutout on top
  ctx.drawImage(cutoutCanvas, posX, posY, productDisplayW, productDisplayH);

  return canvas.toDataURL("image/png");
}

/**
 * Get a product cutout (background removed) as a data URL.
 * Useful for previewing the cutout before compositing.
 */
export async function getProductCutout(
  productImageUrl: string,
): Promise<string> {
  const productImg = await loadImage(productImageUrl);
  const productCanvas = imageToCanvas(productImg);
  const cutoutCanvas = removeDarkBackground(productCanvas);
  return cutoutCanvas.toDataURL("image/png");
}
