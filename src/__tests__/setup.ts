import { vi, beforeEach } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
process.env.OCR_SERVICE_URL = "http://localhost:5500";

// Reset all mocks automatically between tests
beforeEach(() => {
  vi.clearAllMocks();
});
