import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { IDInfo } from "../types/interfaces";
import { NavLink } from "react-router";

interface StudentListProps {
  idList: IDInfo[];
  editIndex: number | null;
  editName: string;
  editStudentNumber: string;
  editMajor: string;
  setEditName: (name: string) => void;
  setEditStudentNumber: (number: string) => void;
  setEditMajor: (major: string) => void;
  handleEdit: (index: number) => void;
  handleSave: () => void;
  handleDelete: (index: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  exportToCSV: () => void;
}

const StudentList: React.FC<StudentListProps> = ({
  idList,
  editIndex,
  editName,
  editStudentNumber,
  editMajor,
  setEditName,
  setEditStudentNumber,
  setEditMajor,
  handleEdit,
  handleSave,
  handleDelete,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  exportToCSV,
}) => {
  const itemsPerPage = 13;

  const filteredItems = idList.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const studentNumberMatch = item.studentNumber
      .toString()
      .includes(searchTerm);
    const majorMatch = item.major
      ? item.major.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return nameMatch || studentNumberMatch || majorMatch;
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
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-[#4896ac] hover:bg-[#326979] text-white rounded-lg transition"
        >
          Export to CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, ID, or major..."
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
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Student Number</th>
              <th className="py-2 px-4 text-left">Major/Program</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">
                  {editIndex === index ? (
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
                  {editIndex === index ? (
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
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditMajor(e.target.value)
                      }
                      className="w-full p-1 border rounded-sm"
                    />
                  ) : (
                    item.major
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  {editIndex === index ? (
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-800 mx-1"
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800 mx-1"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800 mx-1"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
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
      <div className="flex justify-center mt-4">
        <NavLink to="/idlist">
          <button className="bg-[#4896ac] hover:bg-[#326979] text-white px-4 py-2 rounded-lg">
            View all students
          </button>
        </NavLink>
      </div>
    </>
  );
};

export default StudentList; 