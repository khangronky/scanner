import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddStudentDialog from "@/components/AddStudentDialog";

describe("AddStudentDialog", () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    cleanup();
  });

  it("should not render when isOpen is false", () => {
    render(
      <AddStudentDialog
        isOpen={false}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        error={null}
      />
    );
    expect(screen.queryByText("Add New Student")).toBeNull();
  });

  it("should render when isOpen is true", () => {
    render(
      <AddStudentDialog
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        error={null}
      />
    );
    expect(screen.getByText("Add New Student")).toBeTruthy();
  });

  it("should call onAdd with form data when add button is clicked", () => {
    render(
      <AddStudentDialog
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        error={null}
      />
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Student Number" }), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Program" }), {
      target: { value: "Computer Science" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Student" }));

    expect(mockOnAdd).toHaveBeenCalledWith(
      "John Doe",
      "12345",
      "Computer Science"
    );
  });

  it("should display error message when provided", () => {
    const errorMessage = "Error adding student";
    render(
      <AddStudentDialog
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <AddStudentDialog
        isOpen={true}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        error={null}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
