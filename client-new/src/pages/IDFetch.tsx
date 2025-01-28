import React, { useEffect, useState } from "react";
import { IDInfo } from "../types/interfaces";
import VideoCapture from "../components/VideoCapture";
import StudentList from "../components/StudentList";
import AddStudentModal from "../components/AddStudentModal";

const IDFetch: React.FC = () => {
  const [idList, setIdList] = useState<IDInfo[]>(() => {
    const storedList = localStorage.getItem("idList");
    return storedList ? JSON.parse(storedList) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editStudentNumber, setEditStudentNumber] = useState<string>("");
  const [editMajor, setEditMajor] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newStudentNumber, setNewStudentNumber] = useState<string>("");
  const [newMajor, setNewMajor] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem("idList", JSON.stringify(idList));
  }, [idList]);

  const handleNewID = (newIDInfo: IDInfo) => {
    const storedList = JSON.parse(localStorage.getItem("idList") || "[]");

    const existingEntryIndex = storedList.findIndex(
      (item: IDInfo) =>
        item.studentNumber.trim() === newIDInfo.studentNumber.trim()
    );

    if (existingEntryIndex !== -1) {
      if (
        storedList[existingEntryIndex].name.trim().toLowerCase() !==
        newIDInfo.name.trim().toLowerCase()
      ) {
        storedList[existingEntryIndex].name = newIDInfo.name;
        setIdList([...storedList]);
        localStorage.setItem("idList", JSON.stringify(storedList));
        setError(null);
      } else {
        setError("This ID and name already exist in the list.");
      }
    } else {
      const updatedList = [...storedList, newIDInfo];
      setIdList(updatedList);
      localStorage.setItem("idList", JSON.stringify(updatedList));
      setError(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditName(idList[index].name);
    setEditStudentNumber(idList[index].studentNumber);
    setEditMajor(idList[index].major);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedList = idList.map((item, index) =>
        index === editIndex
          ? {
              name: editName,
              studentNumber: editStudentNumber,
              major: editMajor,
            }
          : item
      );
      setIdList(updatedList);
      setEditIndex(null);
      setEditName("");
      setEditStudentNumber("");
      setEditMajor("");
    }
  };

  const handleDelete = (index: number) => {
    const updatedList = idList.filter((_, i) => i !== index);
    setIdList(updatedList);
  };

  const handleAdd = () => {
    if (newName && newStudentNumber && newMajor) {
      const isDuplicate = idList.some(
        (item) => item.studentNumber.trim() === newStudentNumber.trim()
      );

      if (isDuplicate) {
        setError("This ID already exists in the list.");
      } else {
        setIdList([
          ...idList,
          {
            name: newName,
            studentNumber: newStudentNumber.trim(),
            major: newMajor,
          },
        ]);
        setNewName("");
        setNewStudentNumber("");
        setNewMajor("");
        setIsModalOpen(false);
        setError(null);
      }
    } else {
      setError("Please enter name, student number, and major.");
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Student Number", "Major/Program"];
    const csvRows = [
      headers.join(","),
      ...idList.map(
        (item) => `${item.name},${item.studentNumber},${item.major}`
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "Student_Info_List.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#f2fafc]">
      <div className="w-full md:w-4/5 p-4 bg-[#e8f5fc]/80 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          NEO Culture Technology ID Scanner
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 md:w-1/2 p-2">
            <VideoCapture
              error={error}
              setError={setError}
              handleNewID={handleNewID}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#4896ac] hover:bg-[#326979] text-white rounded-lg transition"
              >
                Add Manually
              </button>
            </div>
          </div>

          <div className="flex-1 md:w-1/2 p-2">
            <StudentList
              idList={idList}
              editIndex={editIndex}
              editName={editName}
              editStudentNumber={editStudentNumber}
              editMajor={editMajor}
              setEditName={setEditName}
              setEditStudentNumber={setEditStudentNumber}
              setEditMajor={setEditMajor}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleDelete={handleDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              exportToCSV={exportToCSV}
            />
          </div>
        </div>

        <AddStudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newName={newName}
          setNewName={setNewName}
          newStudentNumber={newStudentNumber}
          setNewStudentNumber={setNewStudentNumber}
          newMajor={newMajor}
          setNewMajor={setNewMajor}
          handleAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default IDFetch; 