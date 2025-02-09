"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import axios from "axios";

interface VideoCaptureProps {
  error: string | null;
  setError: (error: string | null) => void;
  handleNewStudent: (name: string, studentNumber: string) => void;
}

const VideoCapture: React.FC<VideoCaptureProps> = ({
  error,
  setError,
  handleNewStudent,
}) => {
  const [isAutoCapture, setIsAutoCapture] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const captureFrame = useCallback(async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current.toDataURL("image/png");

        try {
          const response = await axios.post(
            "http://localhost:3000/api/capture",
            {
              imageData,
            }
          );

          if (response.data.error) {
            setError(response.data.error);
          } else if (response.data.name && response.data.studentNumber) {
            handleNewStudent(response.data.name, response.data.studentNumber);
            setError(null);
          } else {
            setError("Could not detect student information from the ID");
          }
        } catch (err) {
          console.error("Error processing image:", err);
          setError("Failed to process image. Please try again.");
        }
      }
    }
  }, [handleNewStudent, setError]);

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
          setError("Can not access the webcam.");
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
  }, [setError, isCameraOn]);

  useEffect(() => {
    if (isAutoCapture) {
      const intervalId = setInterval(() => {
        captureFrame();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isAutoCapture, captureFrame]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    if (isAutoCapture) {
      setIsAutoCapture(false);
    }
  };

  const toggleAutoCapture = () => {
    setIsAutoCapture((prevState) => !prevState);
  };

  return (
    <>
      <h2 className="text-xl text-center font-semibold text-gray-800 mb-2">
        Student ID Here
      </h2>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg shadow-md border border-gray-300"
        ></video>

        {isCameraOn && (
          <div
            className="absolute border-4 border-red-500"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "75%",
              height: "65%",
              pointerEvents: "none",
            }}
          ></div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width="1280"
        height="720"
        className="hidden"
      ></canvas>

      <div className="flex justify-center gap-2 my-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg font-medium ${
            isCameraOn
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button
          onClick={toggleAutoCapture}
          className={`px-4 py-2 rounded-lg font-medium ${
            isAutoCapture
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-[#4896ac] hover:bg-[#326979] text-white"
          }`}
          disabled={!isCameraOn}
        >
          {isAutoCapture ? "Stop Auto Capture" : "Start Auto Capture"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 font-medium">{error}</div>
      )}
    </>
  );
};

export default VideoCapture;
