import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Student } from "@/lib/models/Student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await connectDB();

    let query = {};

    if (startDate || endDate) {
      query = {
        createdAt: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) }),
        },
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ students });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, studentNumber, program, timestamp } = await request.json();
    await connectDB();

    const student = await Student.create({
      name,
      studentNumber,
      program,
      createdAt: timestamp,
    });

    return NextResponse.json({ student });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error creating student" },
      { status: 500 }
    );
  }
}
