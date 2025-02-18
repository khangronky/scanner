"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, studentNumber: string, program: string) => void;
  error: string | null;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  error,
}) => {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [program, setProgram] = useState("");

  const handleAdd = () => {
    onAdd(name, studentNumber, program);
    setName("");
    setStudentNumber("");
    setProgram("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Student</h2>
          <button
            role="button"
            aria-label="Close"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Name"
          role="textbox"
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        <input
          type="text"
          placeholder="Student Number"
          role="textbox"
          aria-label="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        <input
          type="text"
          placeholder="Program"
          role="textbox"
          aria-label="Program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        {error && (
          <div className="mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <button
          role="button"
          aria-label="Add Student"
          onClick={handleAdd}
          className="w-full py-2 bg-[#4896ac] hover:bg-[#326979] text-white rounded-lg transition"
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default AddStudentModal;
