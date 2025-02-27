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
  const [autoCapture, setAutoCapture] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleCamera = async () => {
    if (!cameraOn) {
      try {
        const devices = navigator.mediaDevices;
        if (!devices) {
          throw new Error("No media devices found");
        }

        const stream = await devices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }

        setCameraOn(true);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
        setError("Can not access the webcam.");
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraOn(false);
    }
  };

  const toggleAutoCapture = () => {
    if (cameraOn) {
      setAutoCapture((prev) => !prev);
    } else {
      setAutoCapture(false);
    }
  };

  const captureFrame = useCallback(async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = 640;
        canvasRef.current.height = 360;

        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageData = canvasRef.current.toDataURL("image/webp");
        try {
          const { data } = await axios.post(`/api/capture`, { imageData });

          if (data.name && data.studentNumber) {
            handleNewStudent(data.name, data.studentNumber);
            setError(null);
          }
        } catch {
          setError("Could not detect student information from the ID card.");
        }
      }
    }
  }, [handleNewStudent, setError]);

  useEffect(() => {
    if (!cameraOn) {
      setAutoCapture(false);
    }
  }, [cameraOn]);

  useEffect(() => {
    if (autoCapture) {
      const intervalId = setInterval(() => {
        captureFrame();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [autoCapture, captureFrame]);

  return (
    <>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg shadow-md border border-gray-300"
        ></video>

        {cameraOn && (
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
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="flex justify-center gap-2 my-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg font-medium ${
            cameraOn
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button
          onClick={toggleAutoCapture}
          className={`px-4 py-2 rounded-lg font-medium ${
            !cameraOn && "opacity-50 cursor-not-allowed"
          } ${
            autoCapture
              ? `bg-red-500 ${cameraOn && "hover:bg-red-600"} text-white`
              : `bg-[#4896ac] ${cameraOn && "hover:bg-[#326979]"} text-white`
          } `}
          disabled={!cameraOn}
        >
          {autoCapture ? "Stop Auto Capture" : "Start Auto Capture"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 font-medium">{error}</div>
      )}
    </>
  );
};

export default VideoCapture;
