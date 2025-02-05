import React, { useEffect, useState } from "react";
import { Student } from "../types/interfaces";
import { v4 as uuidv4 } from "uuid";
import VideoCapture from "../components/VideoCapture";
import StudentList from "../components/StudentList";
import { NavLink } from "react-router";
import AddStudentModal from "../components/AddStudentModal";

const IDFetch: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    return storedStudents;
  });

  const [captureError, setCaptureError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
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

  const handleNewStudent = (newStudent: Student) => {
    const existingEntryIndex = students.findIndex(
      (item) => item.studentNumber.trim() === newStudent.studentNumber.trim()
    );

    if (existingEntryIndex !== -1) {
      if (
        students[existingEntryIndex].name.trim().toLowerCase() !==
        newStudent.name.trim().toLowerCase()
      ) {
        const updatedList = [...students];
        updatedList[existingEntryIndex] = createStudentRecord({
          name: newStudent.name,
          studentNumber: newStudent.studentNumber,
          program: newStudent.program,
        });
        setStudents(updatedList);
        setCaptureError(null);
      } else {
        setCaptureError("This record already exists in the list.");
      }
    } else {
      setStudents([...students, createStudentRecord(newStudent)]);
      setCaptureError(null);
    }
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
    a.setAttribute("download", "CapturedStudents.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 md:w-1/2 p-2">
        <VideoCapture
          error={captureError}
          setError={setCaptureError}
          handleNewStudent={handleNewStudent}
        />
      </div>

      <div className="flex-1 md:w-1/2 p-2">
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
        <div className="flex justify-center mt-4 gap-4">
          <button
            className={`px-4 py-2 bg-red-600 text-white rounded-lg ${
              students.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700 transition"
            }`}
            disabled={students.length === 0}
          >
            Clear History
          </button>
          <button
            className={`px-4 py-2 bg-green-600 text-white rounded-lg ${
              students.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700 transition"
            }`}
            disabled={students.length === 0}
          >
            Sync to Database
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <NavLink to="/idlist">
            <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
              View all students
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default IDFetch;
