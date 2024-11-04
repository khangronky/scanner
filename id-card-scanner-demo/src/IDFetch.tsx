import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faSave, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface IDInfo {
  name: string;
  studentNumber: string;
  major: string;
}

const IDFetch: React.FC = () => {
  const [idList, setIdList] = useState<IDInfo[]>(() => {
    const storedList = localStorage.getItem('idList');
    return storedList ? JSON.parse(storedList) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editStudentNumber, setEditStudentNumber] = useState<string>('');
  const [editMajor, setEditMajor] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newStudentNumber, setNewStudentNumber] = useState<string>('');
  const [newMajor, setNewMajor] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAutoCapture, setIsAutoCapture] = useState<boolean>(false); // New state for auto-capture toggle
  const itemsPerPage = 13;

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

  useEffect(() => {
    localStorage.setItem('idList', JSON.stringify(idList));
  }, [idList]);

  useEffect(() => {
    if (isAutoCapture) {
      const intervalId = setInterval(() => {
        captureFrame();
      }, 1000); // Capture every 1 second

      return () => clearInterval(intervalId); // Cleanup interval on component unmount or when stopped
    }
  }, [isAutoCapture]);

  const toggleAutoCapture = () => {
    setIsAutoCapture(prevState => !prevState); // Toggle the auto-capture status
  };

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
  
            // Get the current list from localStorage
            const storedList = JSON.parse(localStorage.getItem('idList') || '[]');
            
            // Check for duplicates in the stored list
            const isDuplicate = storedList.some((item: IDInfo) =>
              item.studentNumber.trim() === newIDInfo.studentNumber.trim()
            );
  
            if (isDuplicate) {
              setError("This ID already exists in the list.");
            } else {
              const updatedList = [...storedList, newIDInfo];
              setIdList(updatedList);
              localStorage.setItem('idList', JSON.stringify(updatedList)); // Update localStorage immediately
              setError(null);
            }
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
    setEditMajor(idList[index].major);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedList = idList.map((item, index) => (
        index === editIndex ? { name: editName, studentNumber: editStudentNumber, major: editMajor } : item
      ));
      setIdList(updatedList);
      setEditIndex(null);
      setEditName('');
      setEditStudentNumber('');
      setEditMajor('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedList = idList.filter((_, i) => i !== index);
    setIdList(updatedList);
  };

  const handleAdd = () => {
    if (newName && newStudentNumber && newMajor) {
      // Ensure the new student number is trimmed for consistency
      const isDuplicate = idList.some(item =>
        item.studentNumber.trim() === newStudentNumber.trim()
      );
  
      if (isDuplicate) {
        setError("This ID already exists in the list.");
      } else {
        setIdList([...idList, { name: newName, studentNumber: newStudentNumber.trim(), major: newMajor }]);
        setNewName('');
        setNewStudentNumber('');
        setNewMajor('');
        setIsModalOpen(false);
        setError(null);
      }
    } else {
      setError("Please enter name, student number, and major.");
    }
  };  

  // Filter logic for search
  const filteredItems = idList.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const studentNumberMatch = item.studentNumber.toString().includes(searchTerm);
    const majorMatch = item.major ? item.major.toLowerCase().includes(searchTerm.toLowerCase()) : false; // Ensure item.major exists
    return nameMatch || studentNumberMatch || majorMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    const headers = ["Name", "Student Number", "Major/Program"];
    const csvRows = [
      headers.join(','),
      ...idList.map(item => `${item.name},${item.studentNumber},${item.major}`)
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Student_Info_List.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2fafc]">
      <div className="container mx-auto p-6 bg-[#e8f5fc] bg-opacity-80 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">NEO Culture Technology ID Scanner</h1>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:w-1/2 p-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Student ID Here</h2>
            <video ref={videoRef} autoPlay className="w-full h-auto rounded-lg shadow-md border border-gray-300"></video>
            <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
            <div className="flex flex-col sm:flex-row justify-center mt-4">
              <button 
                onClick={toggleAutoCapture} 
                className={`mb-2 sm:mb-0 sm:mr-4 px-4 py-2 rounded-lg text-white transition ${
                  isAutoCapture ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4896ac] hover:bg-[#326979]'
                }`}
              >
                {isAutoCapture ? 'Stop Auto Capture' : 'Start Auto Capture'}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="mb-2 sm:mb-0 sm:mr-4 px-8 py-2 bg-[#4896ac] text-white rounded-lg hover:bg-[#326979] transition">
                Add New ID Manually
              </button>
              <button 
                onClick={exportToCSV} 
                className="mb-2 sm:mb-0 px-4 py-2 bg-[#4896ac] text-white rounded-lg hover:bg-[#326979] transition">
                Export to CSV
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          <div className="flex-1 md:w-1/2 p-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Student List</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            />
            {filteredItems.length > 0 && (
              <div className="mt-2 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-[#4896ac] text-white">
                    <th className="py-2 px-4 border">Full Name</th>
                    <th className="py-2 px-4 border">Student Number</th>
                    <th className="py-2 px-4 border">Major/Program</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((idInfo, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-1 px-4 border table-cell">
                        {editIndex === (currentPage - 1) * itemsPerPage + index ? (
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
                      <td className="py-1 px-4 border table-cell">
                        {editIndex === (currentPage - 1) * itemsPerPage + index ? (
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
                      <td className="py-1 px-4 border table-cell">
                        {editIndex === (currentPage - 1) * itemsPerPage + index ? (
                          <input
                            type="text"
                            value={editMajor}
                            onChange={(e) => setEditMajor(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                        ) : (
                          idInfo.major
                        )}
                      </td>
                      <td className="py-1 px-4 border">
                        {editIndex === (currentPage - 1) * itemsPerPage + index ? (
                          <>
                            <button onClick={handleSave} className="text-green-500/80">
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button onClick={() => setEditIndex(null)} className="text-red-500/80 ml-2">
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit((currentPage - 1) * itemsPerPage + index)} className="text-blue-500/80">
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                            <button onClick={() => handleDelete((currentPage - 1) * itemsPerPage + index)} className="text-red-500/80 ml-2">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>            
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">Add New Student</h2>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name"
                className="p-2 border border-gray-300 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                value={newStudentNumber}
                onChange={(e) => setNewStudentNumber(e.target.value)}
                placeholder="Student Number"
                className="p-2 border border-gray-300 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                value={newMajor}
                onChange={(e) => setNewMajor(e.target.value)}
                placeholder="Major/Program"
                className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-end">
                <button onClick={handleAdd} className="px-4 py-2 bg-[#4896ac] text-white rounded-lg hover:bg-[#326979]">
                  Add Student
                </button>
                <button onClick={() => setIsModalOpen(false)} className="ml-2 px-4 py-2 bg-gray-300 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDFetch;
