import React, { useEffect, useState } from "react";
import { Student } from "../types/interfaces";
import { v4 as uuidv4 } from "uuid";
import StudentList from "../components/StudentList";
import { NavLink } from "react-router";

const IDList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    return storedStudents;
  });

  const [addError, setAddError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStudentNumber, setEditStudentNumber] = useState<string>("");
  const [editProgram, setEditProgram] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newStudentNumber, setNewStudentNumber] = useState<string>("");
  const [newProgram, setNewProgram] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const handleAdd = () => {
    if (!newName || !newStudentNumber) {
      setAddError("Please enter name and student number");
      return;
    }

    const existingEntry = students.find(
      (item) => item.studentNumber.trim() === newStudentNumber.trim()
    );

    if (existingEntry) {
      setAddError("This record already exists in the list.");
      return;
    }

    setStudents([
      ...students,
      createStudentRecord({
        name: newName,
        studentNumber: newStudentNumber,
        program: newProgram,
      }),
    ]);

    setNewName("");
    setNewStudentNumber("");
    setNewProgram("");
    setAddError(null);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditName(students[index].name);
    setEditStudentNumber(students[index].studentNumber);
    setEditProgram(students[index].program);
  };

  const handleSave = () => {
    if (editIndex === null) return;

    const updatedList = [...students];
    updatedList[editIndex] = createStudentRecord({
      name: editName,
      studentNumber: editStudentNumber,
      program: editProgram,
    });

    setStudents(updatedList);
    setEditIndex(null);
    setEditName("");
    setEditStudentNumber("");
    setEditProgram("");
  };

  const handleDelete = (index: number) => {
    const updatedList = students.filter((_, i) => i !== index);
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
        editIndex={editIndex}
        editName={editName}
        editStudentNumber={editStudentNumber}
        editProgram={editProgram}
        setEditName={setEditName}
        setEditStudentNumber={setEditStudentNumber}
        setEditProgram={setEditProgram}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleDelete={handleDelete}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        exportToCSV={exportToCSV}
        handleAdd={handleAdd}
        newName={newName}
        setNewName={setNewName}
        newStudentNumber={newStudentNumber}
        setNewStudentNumber={setNewStudentNumber}
        newProgram={newProgram}
        setNewProgram={setNewProgram}
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
