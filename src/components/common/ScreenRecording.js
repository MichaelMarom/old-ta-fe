import React, { useState, useRef } from 'react';

const ScreenRecording = () => {
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const downloadRecording = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'screen-recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
    };

    return (
        <div>
            {!recording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={downloadRecording}>Download Recording</button>
            )}
        </div>
    );
};

export default ScreenRecording;
