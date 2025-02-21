import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Student } from "@/lib/models/Student";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, studentNumber, program } = await request.json();
    await connectDB();

    const { id } = await params;
    const student = await Student.findByIdAndUpdate(
      id,
      {
        name,
        studentNumber,
        program,
      },
      { new: true }
    );

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error updating student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Student deleted" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error deleting student" },
      { status: 500 }
    );
  }
}
