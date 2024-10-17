import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ScreenRecording = ({ excalidrawWrapperRef }) => {
  const videoRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const frames = useRef([]);

  useEffect(() => {
    if (recorder) {
      recorder.ondataavailable = (event) => {
        frames.current.push(event.data);
      };

      recorder.onstop = () => {
        const stream = recorder.stream; // Reference to the stream
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(frames.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        if (videoRef.current) {
          videoRef.current.src = url;
        }
      };
    }
  }, [recorder]);

  const startRecording = async () => {
    if (excalidrawWrapperRef.current) {
      const canvas = excalidrawWrapperRef.current.querySelector(
        ".excalidraw__canvas"
      );
      console.log("start recording", canvas);
      if (canvas) {
        const stream = canvas.captureStream(30); // Capture at 30 FPS
        const newRecorder = new MediaRecorder(stream);
        setRecorder(newRecorder); // Set the recorder

        frames.current = []; // Clear frames for new recording

        newRecorder.start();
        setRecording(true); // Update recording state

        // Stop recording after 5 seconds
        setTimeout(() => {
          newRecorder.stop();
          setRecording(false); // Update recording state
        }, 20000);
      } else {
        toast.error("Canvas not found");
      }
    }
  };

  return (
    <div style={{ position: "absolute", zIndex: "999", top: "150px" }}>
      <button onClick={startRecording} disabled={recording}>
        {recording ? "Recording..." : "Start Recording"}
      </button>
      {!recording && <video
        ref={videoRef}
        controls
        style={{ marginTop: "20px", height: "300px", width: "100%" }}
      />}
    </div>
  );
};

export default ScreenRecording;
