import {
  Excalidraw,
  WelcomeScreen,
  useHandleLibrary,
} from "@excalidraw/excalidraw";
import { socket } from "../../config/socket";
import "../../styles/tutor.css";
import CommonLayout from "../../layouts/CommonLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TutorAside from "../../components/tutor/Collab/TutorCollabAside";
import Switch from "../../components/common/Switch";
import Tooltip from "../../components/common/ToolTip";
import _ from "lodash";
import { toast } from "react-toastify";
import {
  get_tutor_rates,
  get_tutor_setup,
  getSessionDetail,
} from "../../axios/tutor";
import { get_my_data } from "../../axios/student";
import logo from "../../assets/images/tutoring Logo.png";
import Loading from "../../components/common/Loading";
import { FaInfoCircle } from "react-icons/fa";

const TutorClass = () => {
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state) => state.student);
  const { tutor } = useSelector((state) => state.tutor);
  const { shortlist } = useSelector((state) => state.shortlist);
  const { currentSession } = useSelector((state) => state.studentSessions);
  const { currentSession: tutorCurrentSession } = useSelector(
    (state) => state.tutorSessions
  );

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [elements, setElements] = useState([]);
  // const [collaborators, setCollaborators] = useState(new Map());
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const [openedSessionFetching, setOpenedSessionFetching] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("sessionId");
  const [openedSession, setOpenedSession] = useState({});
  const [sessionTime, setSessionTime] = useState("");
  const [
    openedSessionTimeRemainingToStart,
    setOpenedSessionTimeRemainingToStart,
  ] = useState(null);

  const [
    timeRemainingToEndCurrentSession,
    setTimeRemainingToEndCurrentSession,
  ] = useState(null);

  const [tutorVideoConsent, setTutorVideoConsent] = useState(null);
  const [studentVideoConsent, setStudentVideoConsent] = useState(null);

  const setCollboratorsInState = (tutorId, studentId) => {
    const collaborators = new Map();

    if (user.role === "student") {
      const tutorPicture = shortlist.find(
        (list) => list.AcademyId[0] === tutorId
      )?.Photo;

      collaborators.set(studentId, {
        username: student.ScreenName,
        isCurrentUser: true,
        isSpeaking: true,
        avatarUrl: student.Photo,
      });
      collaborators.set(tutorId, {
        username: tutor.AcademyId,
        isCurrentUser: true,
        isSpeaking: true,
        avatarUrl: tutorPicture,
      });
    } else if (user.role === "tutor") {
      const tutorPicture = tutor.Photo;
      // todo: get student photo and name from api
      const studentPicture = student.Photo;
      collaborators.set(studentId, {
        username: studentId,
        isCurrentUser: true,
        isSpeaking: true,
        avatarUrl: studentPicture,
      });
      collaborators.set(tutorId, {
        username: tutor.AcademyId,
        isCurrentUser: true,
        isSpeaking: true,
        avatarUrl: tutorPicture,
      });
    }
    excalidrawAPI &&
      excalidrawAPI.updateScene({
        collaborators: collaborators,
      });
  };

  //added currentSession.id, SO that it calls when sesion is live
  useEffect(() => {
    if (sessionId && (student.timeZone || tutor.timeZone)) {
      setOpenedSessionFetching(true);
      getSessionDetail(
        sessionId,
        user.role === "student" ? student.timeZone : tutor.timeZone
      ).then((res) => {
        setOpenedSessionFetching(false);

        if (!res?.response?.data) {
          setCollboratorsInState(res.session.tutorId, res.session.studentId);
          setOpenedSession(res.session);
          setSessionTime(res.time);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionId,
    student,
    tutor,
    user,
    currentSession.id,
    tutorCurrentSession.id,
  ]);

  useEffect(() => {
    if (
      timeRemainingToEndCurrentSession &&
      timeRemainingToEndCurrentSession < 600 &&
      (currentSession?.id || tutorCurrentSession?.id)
    ) {
      navigate(`/${user.role}/feedback`);
    }
  }, [
    timeRemainingToEndCurrentSession,
    currentSession,
    tutorCurrentSession,
    navigate,
    user,
  ]);

  useEffect(() => {
    if (openedSession.start) {
      const timer = setInterval(() => {
        const currentTime = new Date();
        const sessionStartTime = new Date(openedSession.start);
        const timeDiff = sessionStartTime.getTime() - currentTime.getTime();
        setOpenedSessionTimeRemainingToStart(
          Math.max(0, Math.floor(timeDiff / 1000))
        );
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [openedSession.start]);

  // Calculate time remaining
  useEffect(() => {
    if (openedSession.end && sessionTime === "current") {
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const remainingTime = Math.max(
          0,
          Math.floor(
            (new Date(openedSession.end).getTime() - currentTime) / 1000
          )
        );
        setTimeRemainingToEndCurrentSession(remainingTime);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [openedSession.end, sessionTime]);

  useHandleLibrary({ excalidrawAPI });
  const [isChecked, setIsChecked] = useState(false);
  const [hasAuth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(user.role === "tutor");
  }, [user]);

  useEffect(() => {
    if (
      timeRemainingToEndCurrentSession <= 620 &&
      timeRemainingToEndCurrentSession
    )
      excalidrawAPI && excalidrawAPI.resetScene();
  }, [timeRemainingToEndCurrentSession, excalidrawAPI]);

  function getUniqueIdsWithHigherVersion(arr) {
    const groupedById = _.groupBy(arr, "id");
    const uniqueIdsWithHigherVersion = _.map(groupedById, (group) =>
      _.maxBy(group, "version")
    );
    return uniqueIdsWithHigherVersion;
  }

  useEffect(() => {
    if (
      socket &&
      excalidrawAPI &&
      sessionTime === "current" &&
      timeRemainingToEndCurrentSession > 620
    ) {
      sessionId && socket.emit("join-session", sessionId);
      socket.on("canvas-change-recieve", (change) => {
        setCollboratorsInState(openedSession.tutorId, openedSession.studentId);
        // const collaborators = new Map();
        // collaborators.set("231", {
        //   username: "dummy",
        //   isCurrentUser: true,
        //   isSpeaking: true,
        //   avatarUrl: "dede",
        // });
        // collaborators.set("23", {
        //   username: "dede",
        //   isCurrentUser: true,
        //   isSpeaking: true,
        //   avatarUrl: "zF",
        // });

        const mergedArray = getUniqueIdsWithHigherVersion(
          excalidrawAPI.getSceneElements().concat(change.elements),
          "id"
        );
        setElements(mergedArray);
        // excalidrawAPI.updateScene({collaborators: collaborators})
        // setCollaborators(
        //   new Map([...collaborators, ...JSON.parse(change.collaborators)])
        // );
        const allDetails = Object.values(change.files).map((entry) => entry);

        setFiles(allDetails);
      });
      socket.on("active-tool-change", (change) => {
        // console.log(change)
      });
      socket.on("recieve-authorization", (data) => {
        if (user.role !== "tutor") {
          hasAuth !== data.hasAuthorization && setAuth(data.hasAuthorization);

          hasAuth !== data.hasAuthorization &&
            setIsChecked(data.hasAuthorization);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionId,
    excalidrawAPI,
    sessionTime,
    timeRemainingToEndCurrentSession,
    user,
    openedSession,
    hasAuth,
  ]);

  useEffect(() => {
    if (user.role === "student") {
      hasAuth &&
        sessionId &&
        toast.success("Tutor has given you access to access the canvas tools.");

      !hasAuth &&
        sessionId &&
        toast.warning("Tutor has removed your access to the canvas tools!");
    }
  }, [hasAuth, user, sessionId]);

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ elements });
    }
  }, [elements, excalidrawAPI]);

  useEffect(() => {
    excalidrawAPI &&
      !_.isEqual(
        _.sortBy(files.map((file) => file.id)),
        _.sortBy(Object.keys(excalidrawAPI.getFiles()))
      ) &&
      excalidrawAPI.addFiles(files);
  }, [files, excalidrawAPI]);

  const handleExcalidrawChange = (newElements, appState, files) => {
    sessionId &&
      newElements.length &&
      sessionTime === "current" &&
      timeRemainingToEndCurrentSession > 620 &&
      timeRemainingToEndCurrentSession &&
      socket.emit("canvas-change", {
        elements: getUniqueIdsWithHigherVersion(
          excalidrawAPI.getSceneElements().concat(newElements),
          "id"
        ),
        sessionId: sessionId,
        // collaborator: { username: tutor.TutorScreenname, AcademyId: tutor.AcademyId },
        files,
      });
  };

  const handlePointerDown = (activeTool, pointerDownState, event) => {
    // console.log(activeTool, pointerDownState, event)
  };

  const handlePointerUpEvent = (activeTool, pointerDownState, event) => {
    sessionTime === "current" &&
      socket.emit("activeTool", {
        sessionId: sessionId,
        activeTool,
      });
  };

  useEffect(() => {
    if (
      socket &&
      sessionId &&
      sessionTime === "current" &&
      timeRemainingToEndCurrentSession > 620
    ) {
      socket.emit("authorize-student", {
        userId: student?.AcademyId,
        sessionId: sessionId,
        hasAuthorization: isChecked,
      });
    }
  }, [
    isChecked,
    sessionId,
    sessionTime,
    timeRemainingToEndCurrentSession,
    student,
  ]);

  useEffect(() => {
    excalidrawAPI &&
      sessionId &&
      elements.length &&
      sessionTime === "current" &&
      localStorage.setItem(sessionId, JSON.stringify(elements));
  }, [elements, sessionId, excalidrawAPI, sessionTime]);

  useEffect(() => {
    if (excalidrawAPI && sessionId && sessionTime === "current") {
      const elements = localStorage.getItem(sessionId);
      const parsedElems = JSON.parse(elements);
      excalidrawAPI.updateScene({ elements: parsedElems });
    }
  }, [excalidrawAPI, sessionId, sessionTime]);

  useEffect(() => {
    console.log(
      openedSession.studentId,
      openedSession.tutorId,
      student.AcademyId,
      tutor.AcademyId
    );
    if (!student.AcademyId) {
      get_tutor_rates("Daniel. G. D7206af").then((result) => {
        setTutorVideoConsent(result?.[0]?.ConsentRecordingLesson === "true");
      });
      get_my_data("Naomi. C. M8bc074").then((result) => {
        setStudentVideoConsent(result?.[1]?.[0]?.[0]?.ParentConsent === "true");
      });
    }
    if (!tutor.AcademyId) {
      setStudentVideoConsent(student.ParentConsent === "true");
      get_tutor_rates("Daniel. G. D7206af").then((result) => {
        setTutorVideoConsent(result?.[0]?.ConsentRecordingLesson === "true");
      });
    }
  }, [student.AcademyId, tutor.AcademyId, openedSession]);

  if (openedSessionFetching)
    return <Loading loadingText={"Fetching Session!"} />;
  return (
    <CommonLayout role={user.role}>
      {openedSession.subject && (
        <div
          style={{ width: "70%" }}
          className={`d-flex ${
            openedSession.subject
              ? "justify-content-between"
              : "justify-content-center"
          }`}
        >
          <div>
            {sessionTime === "past" && (
              <p className="text-danger">Session already Pass</p>
            )}
          </div>
        </div>
      )}

      <div className="d-flex" style={{ gap: "2%" }}>
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: 0,
            marginTop: "70px",
            width: "80%",
            border: "2px solid lightgray",
          }}
          className="rounded"
        >
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            isCollaborating={user.role === "tutor"}
            onPointerDown={handlePointerDown}
            onPointerUpdate={handlePointerUpEvent}
            viewModeEnabled={!hasAuth}
            onChange={handleExcalidrawChange}
            name={openedSession.subject || "testing"}
          >
            <WelcomeScreen>
              <WelcomeScreen.Center>
                {
                  <WelcomeScreen.Center.Heading>
                    {timeRemainingToEndCurrentSession <= 620 &&
                      !!timeRemainingToEndCurrentSession && (
                        <div className="fs-2 text-dark">
                          Session is going to end in 10 seconds, Redirecting you
                          to Feedback Screen.
                        </div>
                      )}

                    {!!openedSessionTimeRemainingToStart &&
                      openedSessionTimeRemainingToStart < 180 && (
                        <div className="fs-1 text-dark">
                          {openedSession.subject} will start in 3 minutes
                        </div>
                      )}
                  </WelcomeScreen.Center.Heading>
                }
                <img src={logo} alt="logo" width={400} height={130} />

                <WelcomeScreen.Center.Heading>
                  {user.role === "tutor" &&
                    ((timeRemainingToEndCurrentSession > 620 &&
                      !!timeRemainingToEndCurrentSession) ||
                      (!!openedSessionTimeRemainingToStart &&
                        openedSessionTimeRemainingToStart < 180)) && (
                      <div className="fs-3 text-dark">
                        You can start using the canvas tools now.
                      </div>
                    )}
                </WelcomeScreen.Center.Heading>

                <WelcomeScreen.Center.Menu>
                  {/* <WelcomeScreen.Center.MenuItemLink href={``}>
                    Excalidraw GitHub
                  </WelcomeScreen.Center.MenuItemLink> */}
                  {/* <WelcomeScreen.Center.MenuItemHelp /> */}
                </WelcomeScreen.Center.Menu>
              </WelcomeScreen.Center>
            </WelcomeScreen>
          </Excalidraw>
        </div>
        {
          <div
            className="bg-light rounded shadow-lg"
            style={{ width: "20%", position: "fixed", right: 0 }}
          >
            {/* <div onClick={() => setIsChatOpen(false)} className="cursor-pointer">
           <MdCancel size={24} /> </div> */}
            <TutorAside
              openedSession={openedSession}
              sessionTime={sessionTime}
              timeRemainingToEndCurrentSession={
                timeRemainingToEndCurrentSession
              }
              openedSessionTimeRemainingToStart={
                openedSessionTimeRemainingToStart
              }
            />
            {sessionTime === "current" &&
              timeRemainingToEndCurrentSession > 620 && (
                <>
                  <div className="d-flex align-items-center justify-content-center">
                    <Tooltip text={"switch text goes here"} iconSize="25" />
                    <Switch
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      authorized={
                        user.role === "tutor" && sessionTime === "current"
                      }
                    />
                  </div>
                  <div>
                    <div
                      className="form-check form-switch d-flex gap-3"
                      style={{ fontSize: "16px " }}
                    >
                      <input
                        className="form-check-input m-1"
                        disabled={true}
                        type="checkbox"
                        role="switch"
                        style={{
                          width: "30px",
                          height: "15px",
                        }}
                        checked={true}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        video recording consent
                      </label>
                      <Tooltip
                        text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
                        width="200px"
                      >
                        <FaInfoCircle size={18} color="#0096ff" />
                      </Tooltip>
                    </div>
                    <div
                      className="form-check form-switch d-flex gap-3"
                      style={{ fontSize: "16px " }}
                    >
                      <input
                        className="form-check-input m-1"
                        disabled={true}
                        type="checkbox"
                        role="switch"
                        style={{
                          width: "30px",
                          height: "15px",
                        }}
                        checked={false}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        video recording consent
                      </label>
                      <Tooltip
                        text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
                        width="200px"
                      >
                        <FaInfoCircle size={18} color="#0096ff" />
                      </Tooltip>
                    </div>
                  </div>
                </>
              )}
          </div>
        }
        <div
          className="form-check form-switch d-flex gap-3"
          style={{ fontSize: "16px " }}
        >
          <input
            className="form-check-input m-1"
            disabled={true}
            type="checkbox"
            role="switch"
            style={{
              width: "30px",
              height: "15px",
            }}
            checked={tutorVideoConsent}
          />
          <label
            className="form-check-label mr-3"
            htmlFor="flexSwitchCheckChecked"
          >
            tutor video recording consent
          </label>
          <Tooltip
            text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
            width="200px"
          >
            <FaInfoCircle size={18} color="#0096ff" />
          </Tooltip>
        </div>
        <div
          className="form-check form-switch d-flex gap-3"
          style={{ fontSize: "16px " }}
        >
          <input
            className="form-check-input m-1"
            disabled={true}
            type="checkbox"
            role="switch"
            style={{
              width: "30px",
              height: "15px",
            }}
            checked={studentVideoConsent}
          />
          <label
            className="form-check-label mr-3"
            htmlFor="flexSwitchCheckChecked"
          >
            student video recording consent
          </label>
          <Tooltip
            text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
            width="200px"
          >
            <FaInfoCircle size={18} color="#0096ff" />
          </Tooltip>
        </div>
        {/* <div style={{ position: "fixed", bottom: "10%", right: "3%" }}>
          <div onClick={() => setIsChatOpen(!isChatOpen)}>
            <BiChat size={32} />
          </div>
        </div> */}
      </div>
    </CommonLayout>
  );
};

export default TutorClass;
