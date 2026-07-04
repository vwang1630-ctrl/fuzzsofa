import { NextRequest, NextResponse } from "next/server";
import {
  ImageGenerationClient,
  Config,
  HeaderUtils,
} from "coze-coding-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl } = (await request.json()) as {
      prompt?: string;
      imageUrl?: string;
    };

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new ImageGenerationClient(config, customHeaders);

    const generateRequest: {
      prompt: string;
      size: string;
      image?: string;
    } = {
      prompt,
      size: "2K",
    };

    // If user provided a room photo, use it as reference for image-to-image
    if (imageUrl) {
      generateRequest.image = imageUrl;
    }

    const response = await client.generate(generateRequest);
    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return NextResponse.json({
        success: true,
        imageUrl: helper.imageUrls[0],
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: helper.errorMessages.join("; ") || "Image generation failed",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
