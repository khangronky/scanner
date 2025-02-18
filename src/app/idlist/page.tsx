"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IStudent } from "@/lib/models/Student";
import { v4 as uuidv4 } from "uuid";
import StudentList from "@/components/StudentList";
import AddStudentModal from "@/components/AddStudentModal";
import Link from "next/link";

const IDList: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editID, setEditID] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStudentNumber, setEditStudentNumber] = useState<string>("");
  const [editProgram, setEditProgram] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/students`);
      const students: IStudent[] = data.students.map(
        (student: {
          _id: string;
          name: string;
          studentNumber: string;
          program: string;
          createdAt: string;
        }) => ({
          id: student._id,
          name: student.name,
          studentNumber: student.studentNumber,
          program: student.program,
          timestamp: student.createdAt,
        })
      );
      setStudents(students);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  const handleAdd = async (
    name: string,
    studentNumber: string,
    program: string
  ) => {
    if (!name || !studentNumber) {
      setAddError("Please enter name and student number");
      return;
    }

    const newStudent = createStudentRecord({
      name,
      studentNumber,
      program,
    });

    try {
      await axios.post(`${apiUrl}/api/students`, newStudent);
      setAddError(null);
      setIsModalOpen(false);
      await fetchStudents();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setAddError("Failed to add student");
    }
  };

  const handleEdit = (id: string) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    setEditID(id);
    setEditName(student.name);
    setEditStudentNumber(student.studentNumber);
    setEditProgram(student.program);
  };

  const handleSave = async () => {
    if (editID === null) return;

    const updatedStudent = createStudentRecord({
      name: editName,
      studentNumber: editStudentNumber,
      program: editProgram,
    });

    try {
      await axios.put(`${apiUrl}/api/students/${editID}`, updatedStudent);
      setEditID(null);
      setEditName("");
      setEditStudentNumber("");
      setEditProgram("");
      await fetchStudents();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setError("Failed to update student");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/api/students/${id}`);
      await fetchStudents();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setError("Failed to delete student");
    }
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

  if (loading) {
    return <div className="p-4 text-center">Loading students...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

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
        <Link href="/">
          <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
            Back to ID Fetch
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IDList;
