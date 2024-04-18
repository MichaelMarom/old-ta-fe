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
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FaCamera, FaMicrophone } from "react-icons/fa";
import { RiCameraOffFill } from "react-icons/ri";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import _ from "lodash";

const TutorAside = ({
  openedSession,
  sessionTime,
  openedSessionTimeRemainingToStart,
  timeRemainingToEndCurrentSession,
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
      let room_id = "1234567890asdfghjkl";
      let peer = new Peer(undefined, {});

      peer && peer.on("open", (id) => {
        socket.emit("join-room", room_id, id);
      });

      const peers = {};
      navigator.mediaDevices
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

      peer && peer.on("open", (id) => {
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
    [visuals]
  );

  useEffect(() => {
    initStreamAndSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const children = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div>
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
      <div>
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
    <div className="shadow-sm" style={{ width: "100%", height: "78vh" }}>
      {openedSession.subject &&
        sessionTime === "current" &&
        // timeRemainingToEndCurrentSession < 3420 &&
        !!timeRemainingToEndCurrentSession &&
        !_.isNaN(timeRemainingToEndCurrentSession) && (
          <div className="text-center countdown p-1 m-0">
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
          </div>
        )}

      {openedSessionTimeRemainingToStart < 180 &&
        !!openedSessionTimeRemainingToStart &&
        !_.isNaN(openedSessionTimeRemainingToStart) && (
          <div className="text-center countdown p-1 m-0">
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
          </div>
        )}
      {!sessionId &&
        <div className="text-center countdown p-1 m-0">
          <CountdownCircleTimer
            isPlaying
            initialRemainingTime={openedSessionTimeRemainingToStart}
            duration={0}
            colors="#ddd"
            size={90}
            isSmoothColorTransition={false}
            strokeWidth={13}
          >
            {() => '00:00'}
          </CountdownCircleTimer>
        </div>
      }

      {/* {!sessionId ||
        (openedSessionTimeRemainingToStart > 180 &&
          !_.isNaN(openedSessionTimeRemainingToStart)) && (
          <div className="text-center countdown p-1 m-0">
            <CountdownCircleTimer
              isPlaying
              initialRemainingTime={openedSessionTimeRemainingToStart}
              duration={0}
              colors="#FFA500"
              size={90}
              isSmoothColorTransition={false}
              strokeWidth={13}
            >
              00:00
            </CountdownCircleTimer>
          </div>
        )} */}

      <div className="TutorAsideVideoCnt">
        {videoLoader}

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
              style={{ height: "20px", width: "20px" }}
              alt="..."
            />
          </li>
          <li
            onClick={(e) => handleVidActions(e)}
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
              opacity: "0.7",
            }}
          >
            {videoEnabled ? <FaCamera color="black" /> : <RiCameraOffFill />}
          </li>

          <li
            onClick={(e) => handleAudioActions(e)}
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
              opacity: "0.7",
            }}
          >
            {audioEnabled ? (
              <FaMicrophone color="black" />
            ) : (
              <PiMicrophoneSlashFill />
            )}
          </li>
        </ul>
      </div>
      {/* Can update design later :) */}
      <div>
        <label htmlFor="volume-slider">Volume:</label>
        <input
          type="range"
          id="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div
        className="TutorAsideChatCnt"
        style={{ background: "rgb(225 238 242)", height: "53%" }}
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
    </div>
  );
};

export default TutorAside;
