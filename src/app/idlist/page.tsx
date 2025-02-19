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

  const fetchStudents = useCallback(
    async (startDate?: Date | null, endDate?: Date | null) => {
      try {
        const params = new URLSearchParams();
        if (startDate) {
          params.append("startDate", startDate.toISOString());
        }
        if (endDate) {
          params.append("endDate", endDate.toISOString());
        }

        const { data } = await axios.get(
          `${apiUrl}/api/students${
            params.toString() ? `?${params.toString()}` : ""
          }`
        );
        const students: IStudent[] = data.students.map(
          (student: {
            _id: string;
            name: string;
            studentNumber: string;
            program: string;
            createdAt: Date;
          }) => ({
            id: student._id,
            name: student.name,
            studentNumber: student.studentNumber,
            program: student.program,
            timestamp: new Date(student.createdAt),
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
    },
    [apiUrl]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDateRangeApply = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    fetchStudents(startDate, endDate);
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

      setStudents([...students, newStudent]);

      setAddError(null);
      setIsModalOpen(false);
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

    const oldStudent = students.find((s) => s.id === editID);
    if (!oldStudent) return;

    const updatedStudent = {
      ...oldStudent,
      name: editName,
      studentNumber: editStudentNumber,
      program: editProgram,
    };

    try {
      await axios.put(`${apiUrl}/api/students/${editID}`, updatedStudent);

      const updatedStudents = students.map((student) =>
        student.id === editID ? updatedStudent : student
      );
      setStudents(updatedStudents);

      setEditID(null);
      setEditName("");
      setEditStudentNumber("");
      setEditProgram("");
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

      const updatedStudents = students.filter((student) => student.id !== id);
      setStudents(updatedStudents);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      setError("Failed to delete student");
    }
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
      <div className="flex justify-center mt-4">
        <Link href="/">
          <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
            Back to Capture Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IDList;
