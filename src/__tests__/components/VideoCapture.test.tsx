import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import VideoCapture from "@/components/VideoCapture";

// Mock axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock getUserMedia
const mockGetUserMedia = vi.fn();
Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: mockGetUserMedia,
  },
});

// Mock MediaStream
const mockMediaStream = {
  getTracks: () => [{ stop: vi.fn() }],
};

describe("VideoCapture", () => {
  const mockProps = {
    error: null,
    setError: vi.fn(),
    handleNewStudent: vi.fn(),
  };

  beforeEach(() => {
    cleanup();
    mockGetUserMedia.mockResolvedValue(mockMediaStream);
  });

  it("renders correctly with initial state", () => {
    render(<VideoCapture {...mockProps} />);

    expect(screen.getByText("Turn On Camera")).toBeDefined();
    expect(screen.getByText("Start Auto Capture")).toBeDefined();
    expect(
      screen.getByText("Start Auto Capture").hasAttribute("disabled")
    ).toBe(true);
  });

  it("toggles camera on and off", async () => {
    render(<VideoCapture {...mockProps} />);

    // Turn camera on
    await act(async () => {
      fireEvent.click(screen.getByText("Turn On Camera"));
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: "environment" },
    });
    expect(screen.getByText("Turn Off Camera")).toBeDefined();
    expect(
      screen.getByText("Start Auto Capture").hasAttribute("disabled")
    ).toBe(false);

    // Turn camera off
    await act(async () => {
      fireEvent.click(screen.getByText("Turn Off Camera"));
    });

    expect(screen.getByText("Turn On Camera")).toBeDefined();
    expect(
      screen.getByText("Start Auto Capture").hasAttribute("disabled")
    ).toBe(true);
  });

  it("handles camera access error", async () => {
    mockGetUserMedia.mockRejectedValueOnce(new Error("Camera access denied"));

    render(<VideoCapture {...mockProps} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Turn On Camera"));
    });

    expect(mockProps.setError).toHaveBeenCalledWith(
      "Can not access the webcam."
    );
  });
});
