const express = require("express");
const router = express.Router();
const Student = require("../../models/student");

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, studentNumber, program, timestamp } = req.body;
    const student = new Student({
      name,
      studentNumber,
      program,
      createdAt: new Date(timestamp),
    });
    await student.save();
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error creating student" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, studentNumber, program } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        studentNumber,
        program,
      },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

module.exports = router;
