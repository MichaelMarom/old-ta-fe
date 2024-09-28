import React, { useEffect, useState } from "react";
import Header from "../layouts/student/Header";
import { useSelector } from "react-redux";
import SmallSideBar from "../components/common/SmallSideBar";
import { generateUpcomingSessionMessage } from "../utils/common";
import { Outlet, useNavigate } from "react-router-dom";
import _ from "lodash";
import MobileScreen from "../pages/MobileScreen";
import { widthResolutionAllowed } from "../constants/constants";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setResolution({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { user } = useSelector((state) => state.user);
  const { student, isLoading } = useSelector((state) => state.student);
  const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } =
    useSelector((state) => state.studentSessions);

  const [remainingTime, setTimeRemaining] = useState(0);

  useEffect(() => {
    const extractRemainingtimeInInteger = parseInt(
      upcomingSessionFromNow.split(" ")[0]
    );
    if (
      inMins &&
      upcomingSession?.id &&
      extractRemainingtimeInInteger < 4 &&
      !_.isNaN(extractRemainingtimeInInteger)
    ) {
      // navigate(`/collab?sessionId=${upcomingSession.id}`);
    } else if (currentSession?.id && remainingTime > 10 * 60) {
      // navigate(`/collab?sessionId=${currentSession.id}`);
    }
  }, [
    currentSession.id,
    navigate,
    inMins,
    upcomingSession.id,
    remainingTime,
    upcomingSessionFromNow,
  ]);

  useEffect(() => {
    if (currentSession.end) {
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const remainingTime = Math.max(
          0,
          Math.floor(
            (new Date(currentSession.end).getTime() - currentTime) / 1000
          )
        );
        setTimeRemaining(remainingTime);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [currentSession.end]);


  if (user.role === "admin" && !localStorage.getItem("student_user_id"))
    return (
      <div className="text-danger">
        Please Select Student from Student-Table to view tutor records
      </div>
    );
  return resolution.width < widthResolutionAllowed ? (
    <MobileScreen />
  ) : (
    <>
      <Header />
      <SmallSideBar
        inMins={inMins}
        message={generateUpcomingSessionMessage(
          upcomingSession,
          upcomingSessionFromNow
        )}
      />{" "}
      <Outlet />
      {/* {children} */}
    </>
  );
};

export default StudentLayout;
