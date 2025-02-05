import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Student } from "../types/interfaces";

interface StudentListProps {
  students: Student[];
  editID: string | null;
  editName: string;
  editStudentNumber: string;
  editProgram: string;
  setEditName: (name: string) => void;
  setEditStudentNumber: (number: string) => void;
  setEditProgram: (program: string) => void;
  handleEdit: (id: string) => void;
  handleSave: () => void;
  handleDelete: (id: string) => void;
  exportToCSV: () => void;
  handleAdd: () => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  editID,
  editName,
  editStudentNumber,
  editProgram,
  setEditName,
  setEditStudentNumber,
  setEditProgram,
  handleEdit,
  handleSave,
  handleDelete,
  exportToCSV,
  handleAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = students.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const studentNumberMatch = item.studentNumber
      .toString()
      .includes(searchTerm);
    const programMatch = item.program
      ? item.program.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return nameMatch || studentNumberMatch || programMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Student List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#4896ac] hover:bg-[#326979] text-white rounded-lg transition"
          >
            Add Manually
          </button>

          <button
            onClick={exportToCSV}
            className={`px-4 py-2 bg-[#4896ac] text-white rounded-lg ${
              currentItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#326979] transition"
            }`}
            disabled={currentItems.length === 0}
          >
            Export to CSV
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, ID, or program..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="w-full p-2 mb-4 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4896ac]"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-[#4896ac] text-white">
            <tr>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Student Number</th>
              <th className="py-2 px-4 text-center">Program</th>
              <th className="py-2 px-4 text-center">Timestamp</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">
                    {editID === item.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditName(e.target.value)
                        }
                        className="w-full p-1 border rounded-sm"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editID === item.id ? (
                      <input
                        type="text"
                        value={editStudentNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditStudentNumber(e.target.value)
                        }
                        className="w-full p-1 border rounded-sm"
                      />
                    ) : (
                      item.studentNumber
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editID === item.id ? (
                      <input
                        type="text"
                        value={editProgram}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditProgram(e.target.value)
                        }
                        className="w-full p-1 border rounded-sm"
                      />
                    ) : (
                      item.program
                    )}
                  </td>
                  <td className="py-2 px-4">{item.timestamp}</td>
                  <td className="py-2 px-4 text-center">
                    {editID === item.id ? (
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-800 mx-1"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-800 mx-1"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 mx-1"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-[#4896ac] hover:bg-[#326979] text-white"
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-[#4896ac] hover:bg-[#326979] text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default StudentList;
