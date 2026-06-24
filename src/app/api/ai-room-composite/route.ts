import { NextRequest, NextResponse } from "next/server";
import { ImageGenerationClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import { S3Storage } from "coze-coding-dev-sdk";

const productDescriptions: Record<string, string> = {
  "owl-sofa":
    "a pink fluffy owl-shaped armchair with shaggy fur texture, large round eyes, and a pointed beak, dusty pink bouclé fabric, sculptural animal furniture",
  "gorilla-sofa":
    "a large gorilla-shaped sofa with plush fur, broad shoulders, and commanding presence, gray-brown luxury fabric, sculptural animal furniture",
};

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Request must be multipart/form-data with a roomImage file and productSlug field" },
        { status: 400 }
      );
    }
    const roomImage = formData.get("roomImage") as File | null;
    const productSlug = formData.get("productSlug") as string | null;

    if (!roomImage || !productSlug) {
      return NextResponse.json(
        { error: "roomImage and productSlug are required" },
        { status: 400 }
      );
    }

    const productDesc =
      productDescriptions[productSlug] ||
      "a sculptural animal-shaped furniture piece with plush fur texture";

    // Step 1: Upload room image to object storage
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: "",
      secretKey: "",
      bucketName: process.env.COZE_BUCKET_NAME,
      region: "cn-beijing",
    });

    const imageBuffer = Buffer.from(await roomImage.arrayBuffer());
    const fileKey = await storage.uploadFile({
      fileContent: imageBuffer,
      fileName: `ai-room-uploads/${Date.now()}-${roomImage.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      contentType: roomImage.type || "image/jpeg",
    });

    const roomImageUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 3600,
    });

    // Step 2: Use image-to-image generation to composite product into room
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new ImageGenerationClient(config, customHeaders);

    const prompt = `Professional interior design photograph. Place ${productDesc} naturally into this room. The furniture should look like it belongs in the space - matching the room's lighting, perspective, and color temperature. The furniture should be positioned on the floor, centered or slightly off-center, as if it was always part of the room's design. Photorealistic quality, maintaining the room's original style and atmosphere.`;

    const response = await client.generate({
      prompt,
      image: roomImageUrl,
      size: "2K",
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      // The returned URL is already in object storage with valid expiration
      return NextResponse.json({
        success: true,
        imageUrl: helper.imageUrls[0],
      });
    } else {
      return NextResponse.json(
        { error: "Image generation failed", details: helper.errorMessages },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI room composite error:", message);
    return NextResponse.json(
      { error: "Failed to generate composite image", details: message },
      { status: 500 }
    );
  }
}
