const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    studentNumber: String,
    program: String,
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
