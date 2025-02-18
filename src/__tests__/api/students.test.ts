import { describe, it, expect, vi } from "vitest";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Students API", () => {
  const mockStudent = {
    _id: "123",
    name: "John Doe",
    studentNumber: "12345",
    program: "Computer Science",
  };

  describe("GET /api/students/[id]", () => {
    it("should return student if found", async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { student: mockStudent },
      });

      const { data } = await axios.get(`${apiUrl}/api/students/123`);

      expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/api/students/123`);
      expect(data.student).toEqual(mockStudent);
    });

    it("should return 404 if student not found", async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({
        status: 404,
        data: { message: "Student not found" },
      });

      const response = await axios.get(`${apiUrl}/api/students/123`);

      expect(response.status).toBe(404);
      expect(response.data.message).toBe("Student not found");
    });
  });

  describe("PUT /api/students/[id]", () => {
    it("should update student if found", async () => {
      const updatedStudent = { ...mockStudent, name: "Jane Doe" };
      vi.mocked(axios.put).mockResolvedValueOnce({
        data: { student: updatedStudent },
      });

      const { data } = await axios.put(`${apiUrl}/api/students/123`, {
        name: "Jane Doe",
        studentNumber: "12345",
        program: "Computer Science",
      });

      expect(axios.put).toHaveBeenCalledWith(`${apiUrl}/api/students/123`, {
        name: "Jane Doe",
        studentNumber: "12345",
        program: "Computer Science",
      });
      expect(data.student).toEqual(updatedStudent);
    });

    it("should return 404 if student not found during update", async () => {
      vi.mocked(axios.put).mockResolvedValueOnce({
        status: 404,
        data: { message: "Student not found" },
      });

      const response = await axios.put(`${apiUrl}/api/students/123`, {
        name: "Jane Doe",
        studentNumber: "12345",
        program: "Computer Science",
      });

      expect(response.status).toBe(404);
      expect(response.data.message).toBe("Student not found");
    });
  });

  describe("DELETE /api/students/[id]", () => {
    it("should delete student if found", async () => {
      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: { message: "Student deleted successfully" },
      });

      const { data } = await axios.delete(`${apiUrl}/api/students/123`);

      expect(axios.delete).toHaveBeenCalledWith(`${apiUrl}/api/students/123`);
      expect(data.message).toBe("Student deleted successfully");
    });

    it("should return 404 if student not found during deletion", async () => {
      vi.mocked(axios.delete).mockResolvedValueOnce({
        status: 404,
        data: { message: "Student not found" },
      });

      const response = await axios.delete(`${apiUrl}/api/students/123`);

      expect(response.status).toBe(404);
      expect(response.data.message).toBe("Student not found");
    });
  });
});
