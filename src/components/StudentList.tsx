import React, { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import { IStudent } from "@/lib/models/Student";
import { DatePicker } from "./DatePicker";
import { Button } from "./ui/button";

interface StudentListProps {
  students: IStudent[];
  editID: string | null;
  editName: string;
  editStudentNumber: string;
  editProgram: string;
  setEditName: (name: string) => void;
  setEditStudentNumber: (number: string) => void;
  setEditProgram: (program: string) => void;
  handleAdd: () => void;
  handleEdit: (id: string) => void;
  handleSave: () => void;
  handleDelete: (id: string) => void;
  handleDateRangeApply?: (startDate: Date | null, endDate: Date | null) => void;
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
  handleAdd,
  handleEdit,
  handleSave,
  handleDelete,
  handleDateRangeApply,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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

  const exportToCSV = () => {
    const headers = ["Name", "Student Number", "Program", "Timestamp"];

    const formatDate = (date: Date | null) => {
      return date ? date.toISOString().split("T")[0] : "";
    };

    const csvRows = [
      `Date Range: ${startDate ? formatDate(startDate) : "Previous"} 
      to ${endDate ? formatDate(endDate) : "Now"}`,
      headers.join(","),
      ...students.map(
        (item) =>
          `${item.name},${item.studentNumber},${
            item.program
          },"${item.timestamp.toLocaleString()}"`
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const filename = `students-${timestamp}.csv`;
    const a = document.createElement("a");

    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
    URL.revokeObjectURL(url);
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

      <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Start Date:</span>
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder="Select start date"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">End Date:</span>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Select end date"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              if (handleDateRangeApply) {
                handleDateRangeApply(null, null);
              }
            }}
            variant="outline"
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              if (handleDateRangeApply) {
                handleDateRangeApply(startDate, endDate);
              }
            }}
            className="bg-[#4896ac] hover:bg-[#326979] text-white"
            disabled={!startDate && !endDate}
          >
            Apply
          </Button>
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
                  <td className="py-2 px-4">
                    {item.timestamp.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {editID === item.id ? (
                      <button
                        onClick={handleSave}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
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
