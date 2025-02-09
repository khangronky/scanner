import mongoose from "mongoose";

export interface IStudent {
  id: string;
  name: string;
  studentNumber: string;
  program: string;
  timestamp: string;
}

const studentSchema = new mongoose.Schema<IStudent>(
  {
    name: String,
    studentNumber: String,
    program: String,
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
