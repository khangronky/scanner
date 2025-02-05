const express = require("express");
const router = express.Router();
const Student = require("../../models/student");

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json({ students });
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json({ student });
});

router.post("/", async (req, res) => {
  const { name, studentNumber, program, timestamp } = req.body;
  const student = new Student({
    name,
    studentNumber,
    program,
    createdAt: new Date(timestamp),
  });
  await student.save();
  res.json({ student });
});

router.put("/:id", async (req, res) => {
  const { name, studentNumber, program, timestamp } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name,
      studentNumber,
      program,
      updatedAt: new Date(timestamp),
    },
    { new: true }
  );
  res.json({ student });
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

module.exports = router;
