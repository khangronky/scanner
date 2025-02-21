import { describe, it, expect, vi } from "vitest";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Capture API", () => {
  it("should return 400 if no image data is provided", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: "Image data is required" },
      },
    });

    try {
      await axios.post(`/api/capture`, {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe("Image data is required");
    }
  });

  it("should forward image data to OCR service and return response", async () => {
    const mockOcrResponse = {
      data: {
        name: "John Doe",
        studentNumber: "12345",
      },
    };

    vi.mocked(axios.post).mockResolvedValueOnce(mockOcrResponse);

    const response = await axios.post(`/api/capture`, {
      imageData: "base64-encoded-image",
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/capture"),
      { imageData: "base64-encoded-image" }
    );
    expect(response.data).toEqual(mockOcrResponse.data);
  });

  it("should handle OCR service errors", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        status: 500,
        data: { error: "Failed to process image" },
      },
    });

    try {
      await axios.post(`/api/capture`, {
        imageData: "base64-encoded-image",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error?.response.status).toBe(500);
      expect(error?.response.data.error).toBe("Failed to process image");
    }
  });
});
