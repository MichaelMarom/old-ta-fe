import React, { useEffect, useState } from 'react';

const ScreenRecording = ({ onSessionEnd }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const [status, setStatus] = useState('idle');

    const getSelectedOption = (mediaStream) => {
        const isFirefox = typeof InstallTrigger !== 'undefined';
        const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        const videoTrack = mediaStream.getVideoTracks()[0];
        if (isFirefox) {
            if (videoTrack.label === "Primary Monitor") {
                return true;
            } else {
                return false;
            }
        } else if (isChrome) {
            const videoSetting = videoTrack.getSettings();

            if (videoSetting && videoSetting.displaySurface !== "monitor") {
                return false;
            } else {
                return true;
            }
        }
        else return true
    }
    useEffect(() => {
        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: 'always' },
                    audio: false,
                });

                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const chunks = [];
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    setMediaBlobUrl(url);
                    if (onSessionEnd) {
                        onSessionEnd(blob); // pass the blob to the onSessionEnd handler for saving
                    }
                };

                recorder.start();
                setStatus('recording');
            } catch (err) {
                console.error('Error: ', err);
            }
        };

        const stopRecording = () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                setStatus('stopped');
            }
        };

        startRecording();

        return () => {
            stopRecording();
        };
    }, [onSessionEnd, mediaRecorder]);

    return (
        <div>
            <p>{status}</p>
            {mediaBlobUrl && <video  controlsList="nodownload noremoteplayback"  style={{ width: "200px", height: "200px" }} src={mediaBlobUrl} controls autoPlay loop />}
        </div>
    );
};

export default ScreenRecording;
