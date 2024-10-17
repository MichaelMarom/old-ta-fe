import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const ScreenRecording = ({ excalidrawWrapperRef }) => {
    const videoRef = useRef(null);
    const recorderRef = useRef(null);

    useEffect(() => {
        const startRecording = async () => {
         try{   if (excalidrawWrapperRef.current) {
                const canvas = excalidrawWrapperRef.current.querySelector('canvas.excalidraw__canvas.interactive');
                if (canvas) {
                    // Capture the canvas stream
                    const canvasStream = canvas.captureStream();
                    
                    // Get audio stream from user's microphone
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    
                    // Combine the canvas and audio streams
                    const combinedStream = new MediaStream([
                        ...canvasStream.getTracks(),
                        ...audioStream.getTracks()
                    ]);

                    const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
                    recorderRef.current = recorder;

                    // Start recording
                    recorder.start();

                    // Stop the recording after 10 seconds
                    setTimeout(() => {
                        recorder.stop();
                    }, 10000);

                    // Set video source when data is available
                    recorder.addEventListener('dataavailable', (evt) => {
                        const url = URL.createObjectURL(evt.data);
                        if (videoRef.current) {
                            videoRef.current.src = url;
                        }
                    });
                }
            }}
            catch(err){
                toast.error(err.message)
            }
        };

        startRecording();
    }, [excalidrawWrapperRef.current]);

    return (
        <div style={{ position: "absolute", zIndex: "999" }}>
            <video ref={videoRef} controls style={{ marginTop: '20px', height: "300px" }}></video>
        </div>
    );
};

export default ScreenRecording;
