import { useCallback, useEffect, useRef, useState } from "react";
import screenLarge from "../../../assets/images/screen-full-svgrepo-com.svg";
import screenNormal from "../../../assets/images/screen-normal-svgrepo-com.svg";
import {
  useLocation,
} from "react-router-dom";
import { socket } from "../../../config/socket";
import { Peer } from "peerjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CameraOn from '../../../assets/images/videoallowed.jpeg'
import AudioOn from '../../../assets/images/microphoneallowed.jpeg'
import CameraOff from '../../../assets/images/videoblock.jpeg'
import AudioOff from '../../../assets/images/microphoneblock.jpeg'
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import _ from "lodash";
import { FaPaperclip } from "react-icons/fa";
import Tooltip from "../../common/ToolTip";
import Switch from '../../common/Switch'

const CollabSidebar = ({
  openedSession,
  sessionTime,
  openedSessionTimeRemainingToStart,
  timeRemainingToEndCurrentSession,
  studentRecordingConsent,
  tutorRecordingConsent,
  isChecked,
  setIsChecked
}) => {

  // const {
  //   upcomingSessionFromNow: tutorUpcomingFromNow,
  //   upcomingSession: tutorUpcoming,
  //   inMins: isTutorUpcomgLessonInMins,
  //   currentSession: tutorCurrentSession,
  // } = useSelector((state) => state.tutorSessions);
  // const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } =
  //   useSelector((state) => state.studentSessions);

  // console.log(
  //   openedSessionTimeRemainingToStart,
  //   parseInt(openedSessionTimeRemainingToStart / 60),
  //   "time to start!"
  // );
  // console.log(
  //   timeRemainingToEndCurrentSession,
  //   parseInt(timeRemainingToEndCurrentSession / 60),
  //   "time to end!"
  // );

  const [messages, setMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const { student } = useSelector((state) => state.student);

  let [mssg, setMssg] = useState("");
  let location = useLocation();
  let [videoLoader, setVideoLoader] = useState("");
  let [screenType, setScreenType] = useState(screenLarge);
  const chatContainer = useRef(null);
  let [visuals, setVisuals] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const { tutor } = useSelector((state) => state.tutor);
  const { user } = useSelector((state) => state.user);
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("sessionId");
  const [volume, setVolume] = useState(50);
  const [allowStreaming, setAllowStreaming] = useState(false)

  const handleVolumeChange = (event) => {
    if (!event) return;
    const { value } = event.target;
    setVolume(value);
  }

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("session-msg-recieve", (msgObj) => {
        setArrivalMsg(msgObj);
      });
    }
  }, []);

  useEffect(() => {
    sessionTime === "current" &&
      arrivalMsg &&
      arrivalMsg.sessionId === sessionId &&
      setMessages((prev) => [...prev, { ...arrivalMsg }]);
  }, [arrivalMsg, sessionId, sessionTime]);

  useEffect(() => {
    sessionTime === "current" &&
      sessionId &&
      tutor.AcademyId &&
      socket.emit("session-add-user", sessionId);
  }, [tutor, sessionId, sessionTime]);

  const sendMessage = async () => {
    if (!sessionId || sessionTime !== "current")
      return toast.info("Session need to be live to send messages!");
    let text = mssg;
    setMssg("");
    if (text.trim() !== "") {
      const newMessage = {
        sessionId,
        userId: tutor.AcademyId || student.AcademyId,
        date: new Date(),
        text,
        name: tutor.TutorScreenname || student.ScreenName,
        isStudent: user.role === "student",
      };
      setMessages([...messages, newMessage]);
      // const body = {
      //     Text: text,
      //     Date: new Date(),
      //     Sender: loggedInUserDetail.AcademyId,
      //     ChatID: selectedChat.id
      // };

      // await post_message(body)
      // delete newMessage.photo;
      socket.emit("session-send-msg", newMessage);
    }
  };

  let handleVideoResize = (e) => {
    let element = document.querySelector(".TutorAsideVideoCnt");
    if (element.hasAttribute("id")) {
      element?.removeAttribute("id");
      setScreenType(screenLarge);
    } else {
      element?.setAttribute("id", "TutorAsideVideoCnt");
      setScreenType(screenNormal);
    }
  };

  let handleVidActions = (e) => {
    if (typeof visuals.getVideoTracks === "function") {
      visuals.getVideoTracks()[0].enabled =
        !visuals.getVideoTracks()[0].enabled;
      setVideoEnabled(!videoEnabled);
    } else toast.info("Please Enable Camera from Browser Settings!");
  };

  let handleAudioActions = (e) => {
    if (typeof visuals.getAudioTracks === "function") {
      visuals.getAudioTracks()[0].enabled =
        !visuals.getAudioTracks()[0].enabled;

      setAudioEnabled(!audioEnabled);
    } else toast.info("Please Enable MicroPhone from Browser Settings!");
  };

  const initStreamAndSocket = useCallback(
    (retryOnFail = true) => {
      let myVideo = document.querySelector(".tutor-video-tab");
      let room_id = sessionId;
      let peer = new Peer(undefined, {});

      room_id && sessionTime === 'current' && peer && peer.on("open", (id) => {
        socket.emit("join-room", room_id, id);
      });
      console.log(allowStreaming, 'iommedl')
      const peers = {};
      allowStreaming && navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: {
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then((stream) => {
          setVisuals(stream);
          addVideoStream(myVideo, stream);
          peer && peer.on("call", (call) => {
            let file = visuals ? stream : "";
            setVideoLoader("Connecting...");
            call.answer(file);
            call && call.on("stream", (userVideoStream) => {
              setVideoLoader("");
              addVideoStream(myVideo, userVideoStream);
            });
          });

          socket && socket.on("user-connected", (user_id) => {
            connectToNewUser(user_id, stream);
            peer && peer.on("call", (call) => {
              let file = visuals ? stream : "";
              setVideoLoader("Connecting...");
              call.answer(file);
              call && call.on("stream", (userVideoStream) => {
                addVideoStream(myVideo, userVideoStream);
              });
            });
          });
        })
        .catch((e) => {
          console.log(e);
          if (retryOnFail) {
            console.log("Retrying...");
            setTimeout(() => initStreamAndSocket(false), 500);
          } else {
            // toast.warning(e.message);
          }
        });

      socket &&
        socket.on("user-disconnected", (user_id) => {
          if (peers[user_id]) peers[user_id].close();
        });

      room_id && sessionTime === 'current' && peer && peer.on("open", (id) => {
        socket.emit("join-room", room_id, id);
      });
      function connectToNewUser(userId, stream) {
        const call = peer.call(userId, stream);
        setVideoLoader("Connecting...");
        call && call.on("stream", (userVideoStream) => {
          // playSound();
          addVideoStream(myVideo, userVideoStream);
        });

        call && call.on("close", () => {
          myVideo.src = "";
        });

        peers[userId] = call;
      }

      function addVideoStream(video, stream) {
        //TODO:
        // We should set the video instances to global variables so that we can modify things like volume.
        // something like this, can use ref for the video el. this way it can be modified from any function
        // const [userVideo, setUserVideo] = useState()
        // const myVideo = useRef("videoEl")
        // in volumeChangeFunction myVideo.current.volume = value...
        video.srcObject = stream;
        setVideoLoader("Connecting...");
        video.addEventListener("loadedmetadata", () => {
          // playSound();
          video.play();
          setVideoLoader("");
        });
      }

      //cleanup
      return () => {
        peer.destroy();
        if (visuals) {
          visuals.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };
    },
    [visuals, allowStreaming]);

  useEffect(() => {
    initStreamAndSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [allowStreaming]);

  const children = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="text-light">
        {minutes <= 49 && (
          <p className="m-0" style={{ fontSize: "12px" }}>
            Lesson
          </p>
        )}
        {minutes}:{seconds}
        {minutes <= 49 && minutes > 2 && (
          <p className="m-0" style={{ fontSize: "12px" }}>
            Started
          </p>
        )}
        {minutes <= 2 && seconds !== 0 && (
          <p
            className="m-0 blinking-button text-danger"
            style={{ fontSize: "12px" }}
          >
            Ending
          </p>
        )}
        {minutes < 1 && seconds < 1 && (
          <p className="m-0 text-danger" style={{ fontSize: "12px" }}>
            Ended
          </p>
        )}
      </div>
    );
  };

  const startingClockChildren = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="text-light">
        {minutes <= 49 && (
          <p className="m-0" style={{ fontSize: "12px" }}>
            Lesson
          </p>
        )}
        {minutes}:{seconds}
        <p
          className="m-0 blinking-button text-danger"
          style={{ fontSize: "12px" }}
        >
          Starting
        </p>
      </div>
    );
  };

  return (
    <div className="shadow-sm text-bg-dark" style={{ width: "100%", height: "65vh" }}>

      <div className="text-center countdown p-1 m-0 d-flex">
        <div>
          <h6 className="text-start">Recording Consent</h6>
          <div className="d-flex align-items-center">
            <div className="rounded-circle"
              style={{ height: "10px", width: "10px", background: tutorRecordingConsent ? "limegreen" : "#eb4b4b", marginRight: "10px" }}></div>
            <p className="m-0">Tutor
            </p>
          </div>
          <div className="d-flex align-items-center">
            <div className="rounded-circle"
              style={{ height: "10px", width: "10px", background: studentRecordingConsent ? "limegreen" : "#eb4b4b", marginRight: "10px" }}></div>
            <p className="m-0">Student
            </p>
          </div>

        </div>
        {openedSession.subject &&
          sessionTime === "current" &&
          // timeRemainingToEndCurrentSession < 3420 &&
          !!timeRemainingToEndCurrentSession &&
          !_.isNaN(timeRemainingToEndCurrentSession) && (
            <CountdownCircleTimer
              isPlaying
              initialRemainingTime={timeRemainingToEndCurrentSession - 10 * 60}
              duration={50 * 60}
              size={90}
              isSmoothColorTransition={false}
              strokeWidth={13}
              colors={["#32CD32", "#ff0000", "#ff0000"]}
              colorsTime={[50 * 60, 3 * 60, 0]}
            >
              {children}
            </CountdownCircleTimer>
          )}

        {openedSessionTimeRemainingToStart < 180 &&
          !!openedSessionTimeRemainingToStart &&
          !_.isNaN(openedSessionTimeRemainingToStart) && (
            <CountdownCircleTimer
              isPlaying
              initialRemainingTime={openedSessionTimeRemainingToStart}
              duration={3 * 60}
              colors="#FFA500"
              size={90}
              isSmoothColorTransition={false}
              strokeWidth={13}
            >
              {startingClockChildren}
            </CountdownCircleTimer>
          )}
        {!sessionId &&
          <CountdownCircleTimer
            isPlaying
            initialRemainingTime={openedSessionTimeRemainingToStart}
            duration={0}
            colors="#ddd"
            size={90}
            isSmoothColorTransition={false}
            strokeWidth={13}
          >
            {() => <div className="text-bg-dark  rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "80%", height: "80%" }}>00:00</div>}
          </CountdownCircleTimer>
        }
      </div>

      <div className="TutorAsideVideoCnt">
        {videoLoader}

        {allowStreaming ?
          <>
            <video className="tutor-video-tab"></video>
            <ul>
              <li
                className="video-size"
                style={{
                  background: "#efefef",
                  opacity: ".4",
                  padding: "5px",
                  borderRadius: "8px",
                }}
                onClick={handleVideoResize}
              >
                <img
                  src={screenType}
                  width={20}
                  height={20}
                  alt="..."
                />
              </li>
              <li
                onClick={(e) => handleVidActions(e)}
                style={{
                  padding: "4px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  opacity: "0.7",
                }}
              >
                {/* {videoEnabled ? <FaCamera color="black" /> : <RiCameraOffFill />} */}
                {videoEnabled ? <img src={CameraOn} width={27} height={27} /> : <img src={CameraOff} width={27} height={27} />}

              </li>

              <li
                onClick={(e) => handleAudioActions(e)}
                style={{
                  padding: "4px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  opacity: "0.7",
                }}
              >
                {/* {audioEnabled ? (
              <FaMicrophone color="black" />
            ) : (
              <PiMicrophoneSlashFill />
            )} */}
                {audioEnabled ? (
                  <img src={AudioOn} width={27} height={27} />
                ) : (
                  <img src={AudioOff} width={27} height={27} />
                )}
              </li>
            </ul>
          </> :
          <div>
            <div>
              Allow User to access camera and microphone
            </div>
            <div>
              <button className="btn btn-primary btn-sm"
                onClick={() => {
                  setAllowStreaming(true)
                }}>Allow</button>
            </div>
          </div>
        }
      </div>
      {/* Can update design later :) */}
      <div>
        <label htmlFor="volume-slider text-light" style={{ color: "lightgray" }}>Volume:</label>
        <input
          type="range"
          id="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      <div className="d-flex" style={{ gap: "10px" }}>
        <FaPaperclip color="white" size="30" />
        <p>
          Use "Message Board" tab to send Images and Pdfs related to lecture.
        </p>
      </div>

      <div
        className="TutorAsideChatCnt"
        style={{ background: "rgb(225 238 242)", height: sessionTime==="current"?"200px":"65%" }}
      >
        <div
          className="TutorAsideChatBox"
          ref={chatContainer}
          style={{ background: "rgb(225 238 242)" }}
        >
          {messages.map((msg) => (
            <div
              className=""
              style={{
                width: "100%",
                height: "fit-content",
                display: "flex",
                justifyContent: "right",
                position: "relative",
                margin: "0 0 8px 0",
              }}
            >
              <div
                className="d-flex flex-column"
                style={{
                  maxWidth: "80%",
                  textAlign: "left",
                  float: "right",
                  position: "relative",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  borderBottomRightRadius: "1.15px",
                  borderBottomLeftRadius: "15px",
                  backgroundColor: msg.isStudent ? "green" : "#0062ff",
                  color: "#fff",
                  padding: "4px",
                  // height: "200px"
                }}
              >
                <div style={{ fontSize: "13px", color: "lightgray" }}>
                  {/* {msg.name} */}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="TutorAsideChatControl"
          style={{ background: "rgb(225 238 242)" }}
        >
          <span
            style={{
              width: "80%",
              height: "80%",
              float: "left",
              background: "#fff",
            }}
          >
            <textarea
              type="text"
              id="TutorChatTextarea"
              style={{
                width: "100%",
                borderRadius: "5px",
                border: "none",
                display: "flex",
                alignItems: "center",
                background: "#f9f9f9",
                height: "40px",
                padding: "10px 5px 5px 5px",
                fontFamily: "serif",
                fontSize: "medium",
                outline: "none",
                resize: "none",
              }}
              onInput={(e) => setMssg(e.target.value)}
              value={mssg}
              placeholder="Type Your Message Here"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // Check if Enter key was pressed without Shift
                  e.preventDefault(); // Prevent default behavior (new line)
                  sendMessage(); // Call sendMessage function
                }
              }}
            ></textarea>
          </span>
          <span
            style={{
              width: "20%",
              height: "70%",
              float: "right",
              background: "#fff",
            }}
          >
            <button
              className="btn btn-success p-0 m-0"
              style={{ height: "40px", width: "90%" }}
              onClick={sendMessage}
            >
              send
            </button>
          </span>
        </div>
      </div>
        {
            sessionTime === "current" &&
              timeRemainingToEndCurrentSession > 620 && 
              (
                <>
                  <div className="d-flex align-items-center justify-content-center m-2">
                    <Tooltip text={"You can transfer the canvas tools to the student by moving the switch to the right"} 
                    iconSize="25" />
                    <Switch
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      authorized={
                        user.role === "tutor" && sessionTime === "current"
                      }
                    />
                  </div>
                </>
              )}
    </div>
  );
};

export default CollabSidebar;
