import { NextResponse } from "next/server";
import axios from "axios";

const ocrServiceUrl = process.env.OCR_SERVICE_URL || "http://localhost:5500";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageData } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Forward the request to the OCR service
    const response = await axios.post(ocrServiceUrl + "/capture", {
      imageData,
    });

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 400 }
    );
  }
}
