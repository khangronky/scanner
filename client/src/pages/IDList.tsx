import React, { useEffect, useState } from "react";
import { Student } from "../types/interfaces";
import { v4 as uuidv4 } from "uuid";
import StudentList from "../components/StudentList";
import { NavLink } from "react-router";
import AddStudentModal from "../components/AddStudentModal";

const IDList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    return storedStudents;
  });

  const [addError, setAddError] = useState<string | null>(null);
  const [editID, setEditID] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStudentNumber, setEditStudentNumber] = useState<string>("");
  const [editProgram, setEditProgram] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const createStudentRecord = (studentData: {
    name: string;
    studentNumber: string;
    program: string;
  }) => {
    return {
      id: uuidv4(),
      name: studentData.name.trim(),
      studentNumber: studentData.studentNumber.trim(),
      program: studentData.program ? studentData.program.trim() : "",
      timestamp: new Date().toLocaleString(),
    };
  };

  const handleAdd = (name: string, studentNumber: string, program: string) => {
    if (!name || !studentNumber) {
      setAddError("Please enter name and student number");
      return;
    }

    const existingEntry = students.find(
      (item) => item.studentNumber.trim() === studentNumber.trim()
    );

    if (existingEntry) {
      setAddError("This record already exists in the list.");
      return;
    }

    setStudents([
      ...students,
      createStudentRecord({
        name,
        studentNumber,
        program,
      }),
    ]);

    setAddError(null);
    setIsModalOpen(false);
  };

  const handleEdit = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    setEditID(id);
    setEditName(student.name);
    setEditStudentNumber(student.studentNumber);
    setEditProgram(student.program);
  };

  const handleSave = () => {
    if (editID === null) return;

    const updatedList = students.map((student) =>
      student.id === editID
        ? createStudentRecord({
            name: editName,
            studentNumber: editStudentNumber,
            program: editProgram,
          })
        : student
    );

    setStudents(updatedList);
    setEditID(null);
    setEditName("");
    setEditStudentNumber("");
    setEditProgram("");
  };

  const handleDelete = (id: string) => {
    const updatedList = students.filter((s) => s.id !== id);
    setStudents(updatedList);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Student Number", "Program", "Timestamp"];
    const csvRows = [
      headers.join(","),
      ...students.map(
        (item) =>
          `${item.name},${item.studentNumber},${item.program},${item.timestamp}`
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "AllStudents.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-2">
      <StudentList
        students={students}
        editID={editID}
        editName={editName}
        editStudentNumber={editStudentNumber}
        editProgram={editProgram}
        setEditName={setEditName}
        setEditStudentNumber={setEditStudentNumber}
        setEditProgram={setEditProgram}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleDelete={handleDelete}
        exportToCSV={exportToCSV}
        handleAdd={() => setIsModalOpen(true)}
      />
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAddError(null);
        }}
        onAdd={handleAdd}
        error={addError}
      />
      <div className="flex justify-center mt-4">
        <NavLink to="/">
          <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
            Back to ID Fetch
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default IDList;
