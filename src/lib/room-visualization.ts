import type { Product } from "@/lib/products";

interface RoomVisualizationResult {
  originalImage: string;
  resultImage: string;
}

/**
 * Placeholder AI room visualization function.
 * Simulates a 3-second processing delay and returns the original image
 * with a subtle overlay indicating AI preview is coming soon.
 *
 * In production, this will call POST /api/visualize with:
 *   { image: base64, product: slug }
 * and return the AI-generated room visualization.
 */
export async function generateRoomVisualization(
  roomImage: string,
  product: Product
): Promise<RoomVisualizationResult> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // For now, return the original image as both before and after
  // with the after being the same image (placeholder behavior)
  // In production, the after image will be the AI-generated result
  return {
    originalImage: roomImage,
    resultImage: roomImage,
  };
}

/**
 * Creates a canvas-based placeholder result image
 * that overlays "AI Preview - Coming Soon" text on the original room image
 */
export function createPlaceholderResult(
  imageSrc: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Subtle dark overlay at bottom
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      gradient.addColorStop(0, "rgba(10, 10, 10, 0)");
      gradient.addColorStop(1, "rgba(10, 10, 10, 0.7)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text overlay
      ctx.fillStyle = "rgba(232, 180, 184, 0.8)";
      ctx.font = `300 ${Math.max(16, canvas.width * 0.025)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(
        "AI Preview — Coming Soon",
        canvas.width / 2,
        canvas.height * 0.88
      );

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
