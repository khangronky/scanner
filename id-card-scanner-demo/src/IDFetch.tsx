import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface IDInfo {
  name: string;
  studentNumber: string;
}

const IDFetch: React.FC = () => {
  const [idList, setIdList] = useState<IDInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editStudentNumber, setEditStudentNumber] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newStudentNumber, setNewStudentNumber] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
        setError("Could not access the webcam.");
      });
  }, []);

  const captureFrame = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/png');

        try {
          const response = await axios.post('http://localhost:5000/capture', { imageData });
          if (response.data.error) {
            setError(response.data.error);
          } else {
            const newIDInfo = response.data;
            setIdList((prevList) => [...prevList, newIDInfo]);
            setError(null);
          }
        } catch (err) {
          console.error("Error sending data to server: ", err);
          setError('Failed to fetch data');
        }
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditName(idList[index].name);
    setEditStudentNumber(idList[index].studentNumber);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedList = idList.map((item, index) => (
        index === editIndex ? { name: editName, studentNumber: editStudentNumber } : item
      ));
      setIdList(updatedList);
      setEditIndex(null);
      setEditName('');
      setEditStudentNumber('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedList = idList.filter((_, i) => i !== index);
    setIdList(updatedList);
  };

  const handleAdd = () => {
    if (newName && newStudentNumber) {
      setIdList([...idList, { name: newName, studentNumber: newStudentNumber }]);
      setNewName('');
      setNewStudentNumber('');
    } else {
      setError("Please enter both name and student number.");
    }
  };

  // Calculate the number of pages
  const totalPages = Math.ceil(idList.length / itemsPerPage);

  // Get current items based on the current page
  const currentItems = idList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination controls
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

  // CSV Export function
  const exportToCSV = () => {
    const headers = ["Name", "Student Number"];
    const csvRows = [
      headers.join(','), // Add headers
      ...idList.map(item => `${item.name},${item.studentNumber}`) // Map ID info to CSV format
    ];

    const csvString = csvRows.join('\n'); // Join rows with newline
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Student_Info_List.csv');
    a.click();
    URL.revokeObjectURL(url); // Clean up URL object
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">NEO Culture Technology ID Scanner</h1>
        <div className="flex flex-col md:flex-row">
          {/* Scanner Display */}
          <div className="flex-1 md:w-1/2 p-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Scanner Display</h2>
            <video ref={videoRef} autoPlay className="w-full h-auto rounded-lg shadow-md border border-gray-300"></video>
            <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
            <div className="text-center mt-4">
              <button onClick={captureFrame} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Capture and Display ID
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* ID Information Table */}
          <div className="flex-1 md:w-1/2 p-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Captured ID Information</h2>
            {idList.length > 0 && (
              <div className="mt-2">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="py-2 px-4 border">Name</th>
                      <th className="py-2 px-4 border">Student Number</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((idInfo, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border">
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            idInfo.name
                          )}
                        </td>
                        <td className="py-2 px-4 border">
                          {editIndex === index ? (
                            <input
                              type="text"
                              value={editStudentNumber}
                              onChange={(e) => setEditStudentNumber(e.target.value)}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            idInfo.studentNumber
                          )}
                        </td>
                        <td className="py-2 px-4 border">
                          {editIndex === index ? (
                            <>
                              <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">Save</button>
                              <button onClick={() => setEditIndex(null)} className="ml-2 px-2 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(index)} className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                              <button onClick={() => handleDelete(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50">Previous</button>
                  <span className="text-lg">Page {currentPage} of {totalPages}</span>
                  <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {/* Manually Input New ID */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Add New ID Information</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name"
                  className="flex-1 p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  placeholder="Student Number"
                  className="flex-1 p-2 border rounded-lg"
                />
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add</button>
              </div>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 text-center">
          <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDFetch;
