import React, {
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import axios from "axios";
import { IDInfo } from "../types/interfaces";

interface VideoCaptureProps {
  error: string | null;
  setError: (error: string | null) => void;
  isAutoCapture: boolean;
  setIsAutoCapture: Dispatch<SetStateAction<boolean>>;
  handleNewID: (newIDInfo: IDInfo) => void;
}

const VideoCapture: React.FC<VideoCaptureProps> = ({
  error,
  setError,
  isAutoCapture,
  setIsAutoCapture,
  handleNewID,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
          const response = await axios.post("http://localhost:5000/capture", {
            imageData,
          });
          if (response.data.error) {
            setError(response.data.error);
          } else {
            handleNewID(response.data);
          }
        } catch (err) {
          console.error("Error sending data to server: ", err);
          setError("Failed to fetch data");
        }
      }
    }
  }, [handleNewID, setError]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
        setError("Could not access the webcam.");
      });
  }, [setError]);

  useEffect(() => {
    if (isAutoCapture) {
      const intervalId = setInterval(() => {
        captureFrame();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isAutoCapture, captureFrame]);

  const toggleAutoCapture = () => {
    setIsAutoCapture((prevState) => !prevState);
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Student ID Here
      </h2>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto rounded-lg shadow-md border border-gray-300"
        ></video>

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

        {error && (
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40"
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width="1280"
        height="720"
        className="hidden"
      ></canvas>
      <div className="flex justify-center mt-4">
        <button
          onClick={toggleAutoCapture}
          className={`px-4 py-2 rounded-lg text-white transition ${
            isAutoCapture
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#4896ac] hover:bg-[#326979]"
          }`}
        >
          {isAutoCapture ? "Stop Auto Capture" : "Start Auto Capture"}
        </button>
      </div>
    </>
  );
};

export default VideoCapture;
