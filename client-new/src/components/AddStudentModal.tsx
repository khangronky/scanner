import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  setNewName: (name: string) => void;
  newStudentNumber: string;
  setNewStudentNumber: (number: string) => void;
  newMajor: string;
  setNewMajor: (major: string) => void;
  handleAdd: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  newName,
  setNewName,
  newStudentNumber,
  setNewStudentNumber,
  newMajor,
  setNewMajor,
  handleAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Student</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewName(e.target.value)
          }
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        <input
          type="text"
          placeholder="Student Number"
          value={newStudentNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewStudentNumber(e.target.value)
          }
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        <input
          type="text"
          placeholder="Major/Program"
          value={newMajor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewMajor(e.target.value)
          }
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
        />
        <button
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