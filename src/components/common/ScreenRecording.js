import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { uploadVideoToAzure } from "../../utils/uploadVideo";
import { updateFieldUsingIdColumn } from "../../axios/common";

const ScreenRecording = ({
  excalidrawWrapperRef,
  tutorId,
}) => {
  const videoRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const frames = useRef([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    tutorId && excalidrawWrapperRef.current && startRecording(); // Automatically start recording on mount
  }, [excalidrawWrapperRef.current, tutorId]);

  useEffect(() => {
    if (recorder) {
      recorder.ondataavailable = (event) => {
        frames.current.push(event.data);
      };

      recorder.onstop = () => {
        const stream = recorder.stream;
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(frames.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        setDownloadUrl(url); // Set the download URL

        if (videoRef.current) {
          videoRef.current.src = url;
        }

        // After the recording stops, upload the video to Azure
        uploadToAzure(blob);
      };
    }
  }, [recorder]);

  const startRecording = async () => {
    try {
      const canvas = excalidrawWrapperRef.current.querySelector(
        ".excalidraw__canvas"
      );
      if (canvas) {
        const videoStream = canvas.captureStream(30); // Capture video from the canvas

        // Capture audio from the microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Add audio track to the video stream
        audioStream.getAudioTracks().forEach((track) => {
          videoStream.addTrack(track);
        });

        const newRecorder = new MediaRecorder(videoStream, {
          type: "video/webm",
        });
        setRecorder(newRecorder);
        frames.current = [];

        newRecorder.start();
        setRecording(true);

        setTimeout(() => {
          newRecorder.stop();
          setRecording(false);
        }, 44 * 60 * 1000); //total 50: last 6 min will be used to capture video or indicating end of lecture
      }
    } catch (error) {
      toast.error("Failed to access microphone or start recording.");
    }
  };

  const uploadToAzure = async (blob) => {
    try {
      const response = await uploadVideoToAzure(
        blob,
        tutorId,
        "tutoring-academy-lesson-videos"
      );

      if (response?.data) {
        await updateFieldUsingIdColumn({ id: tutorId }, "Lessons", {
          Recording: response.data.url,
        });
        toast.success("Video uploaded to Azure successfully!");
      } else {
        toast.error("Failed to upload video");
      }
    } catch (error) {
      toast.error(error.messgae);
    }
  };

  return (
    <div style={{ zIndex: "999", top: "50px" }}>
      {recording && (
        <div className="d-flex border justify-content-center align-items-center">
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "5px solid white",
              backgroundColor: "red",
              borderRadius: "50%",
              animation: "blinking 1s infinite",
            }}
          />
          <div>Recording</div>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        style={{ display: "none" }} // Hide video element until recording stops
      />

      <style>
        {`
          @keyframes blinking {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ScreenRecording;
