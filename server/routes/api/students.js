const express = require("express");
const router = express.Router();
const Student = require("../../models/student");

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.send(student);
});

router.post("/", async (req, res) => {
  const { id, name, studentNumber, program, timestamp } = req.body;
  const student = new Student({
    _id: id,
    name,
    studentNumber,
    program,
    createdAt: new Date(timestamp),
  });
  await student.save();
  res.send(student);
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
  res.send(student);
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send({ message: "Student deleted" });
});

module.exports = router;
