import { NextResponse } from "next/server";
import axios from "axios";

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || "";

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
    const response = await axios.post(OCR_SERVICE_URL, { imageData });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
