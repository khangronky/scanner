"use client";

import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, studentNumber: string, program: string) => void;
  error: string | null;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogHeader className="flex relative justify-between items-center">
          <DialogTitle className="text-xl font-semibold">
            Add New Student
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
          />
          <input
            type="text"
            placeholder="Student Number"
            value={studentNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStudentNumber(e.target.value)
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
          />
          <input
            type="text"
            placeholder="Program"
            value={program}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProgram(e.target.value)
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4896ac]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <Button
          onClick={handleAdd}
          className="w-full py-2 bg-[#4896ac] hover:bg-[#326979] text-white rounded-lg transition"
        >
          Add Student
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
