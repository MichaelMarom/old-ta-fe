import VideoRecorder from "react-video-recorder";

export default function ProfileVideoRecord({handleVideoBlob}) {
  return (
    <div style={{ height: "90%" }}>
      <VideoRecorder
        isOnInitially
        isFliped
        showReplayControls
        countdownTime="3000"
        timeLimit="60000"
        onRecordingComplete={(videoBlob) => {
          // Do something with the video...
          console.log("videoBlob", videoBlob);
          handleVideoBlob(videoBlob);
        }}
      />
    </div>
  );
}
