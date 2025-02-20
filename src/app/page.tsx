"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import VideoCapture from "@/components/VideoCapture";
import StudentList from "@/components/StudentList";
import AddStudentModal from "@/components/AddStudentModal";
import { IStudent } from "@/lib/models/Student";
import Link from "next/link";

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [editID, setEditID] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStudentNumber, setEditStudentNumber] = useState<string>("");
  const [editProgram, setEditProgram] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      try {
        const parsedStudents = JSON.parse(storedStudents).map(
          (student: {
            id: string;
            name: string;
            studentNumber: string;
            program: string;
            timestamp: string;
          }) => ({
            ...student,
            timestamp: new Date(student.timestamp),
          })
        );
        if (parsedStudents.length > 0) {
          setStudents(parsedStudents);
        }
      } catch (error) {
        console.error("Error parsing stored students:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
    setFilteredStudents(students);
  }, [students]);

  const handleDateRangeApply = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate && !endDate) return;

    const filtered = students.filter((student) => {
      const studentDate = new Date(student.timestamp);
      if (startDate && endDate) {
        return studentDate >= startDate && studentDate <= endDate;
      } else if (startDate) {
        return studentDate >= startDate;
      } else if (endDate) {
        return studentDate <= endDate;
      }
      return true;
    });

    setFilteredStudents(filtered);
  };

  const createStudentRecord = (studentData: {
    name: string;
    studentNumber: string;
    program: string;
  }): IStudent => {
    return {
      id: uuidv4(),
      name: studentData.name.trim(),
      studentNumber: studentData.studentNumber.trim(),
      program: studentData.program ? studentData.program.trim() : "",
      timestamp: new Date(),
    };
  };

  const handleNewStudent = (name: string, studentNumber: string) => {
    const oldStudent = students.find(
      (item) => item.studentNumber.trim() === studentNumber.trim()
    );

    if (oldStudent) {
      const updatedStudent = {
        ...oldStudent,
        name: name,
        studentNumber: studentNumber,
      };
      setStudents(
        students.map((student) =>
          student.id === oldStudent.id ? updatedStudent : student
        )
      );

      setCaptureError("");
    } else {
      const newStudent = createStudentRecord({
        name,
        studentNumber,
        program: "",
      });
      setStudents([...students, newStudent]);

      setCaptureError("");
    }
  };

  const handleAdd = (name: string, studentNumber: string, program: string) => {
    if (!name || !studentNumber) {
      setAddError("Please enter name and student number");
      return;
    }

    const newStudent = createStudentRecord({ name, studentNumber, program });
    setStudents([...students, newStudent]);

    setAddError("");
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

    const oldStudent = students.find((s) => s.id === editID);
    if (!oldStudent) return;

    const updatedStudent = {
      ...oldStudent,
      name: editName,
      studentNumber: editStudentNumber,
      program: editProgram,
    };

    const updatedStudents = students.map((student) =>
      student.id === editID ? updatedStudent : student
    );
    setStudents(updatedStudents);

    setEditID(null);
    setEditName("");
    setEditStudentNumber("");
    setEditProgram("");
  };

  const handleDelete = (id: string) => {
    const updatedStudents = students.filter((s) => s.id !== id);
    setStudents(updatedStudents);
  };

  const handleClear = () => {
    setStudents([]);
  };

  const handleUpload = async () => {
    setUploadError("");
    setUploadSuccess("");

    const uploadPromises = students.map((student) =>
      axios.post(`${apiUrl}/api/students`, {
        name: student.name,
        studentNumber: student.studentNumber,
        program: student.program,
        timestamp: student.timestamp,
      })
    );

    try {
      const results = await Promise.allSettled(uploadPromises);

      const successfulUploads = results.filter(
        (result) => result.status === "fulfilled"
      );

      if (successfulUploads.length > 0) {
        const remainingStudents = students.filter((_, index) => {
          const result = results[index];
          return result.status === "rejected";
        });
        setStudents(remainingStudents);
        setUploadSuccess(
          `Successfully uploaded ${successfulUploads.length} student(s)`
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setUploadError("Failed to upload students to database");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 md:w-1/2 p-2">
        <VideoCapture
          error={captureError}
          setError={setCaptureError}
          handleNewStudent={handleNewStudent}
        />
      </div>

      <div className="flex-1 md:w-1/2 p-2">
        <StudentList
          students={filteredStudents}
          editID={editID}
          editStudentNumber={editStudentNumber}
          editName={editName}
          editProgram={editProgram}
          setEditName={setEditName}
          setEditStudentNumber={setEditStudentNumber}
          setEditProgram={setEditProgram}
          handleAdd={() => setIsModalOpen(true)}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleDateRangeApply={handleDateRangeApply}
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
            onClick={handleClear}
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
            onClick={handleUpload}
          >
            Upload to Database
          </button>
        </div>
        {uploadError && (
          <div className="p-4 text-center text-red-500">{uploadError}</div>
        )}
        {uploadSuccess && (
          <div className="p-4 text-center text-green-500">{uploadSuccess}</div>
        )}
        <div className="flex justify-center mt-4">
          <Link href="/idlist">
            <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
              View all students
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
