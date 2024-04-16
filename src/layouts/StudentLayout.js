import React, { useEffect, useState } from "react";
import Header from "../layouts/student/Header";
import { useSelector } from "react-redux";
import SmallSideBar from "../components/common/SmallSideBar";
import { generateUpcomingSessionMessage } from "../helperFunctions/generalHelperFunctions";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state) => state.student);
  const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } =
    useSelector((state) => state.studentSessions);

  const [remainingTime, setTimeRemaining] = useState(0);

  //todo
  //when currentsession timeRemaing is 7 minutes then move to feedback
  //have to remove inMins, because, it will effect when time is in seconds
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
      navigate(`/collab?sessionId=${upcomingSession.id}`);
    } else if (currentSession?.id && remainingTime > 10 * 60) {
      navigate(`/collab?sessionId=${currentSession.id}`);
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

  if (user.role === "admin" && !student?.AcademyId)
    return (
      <div className="text-danger">
        Please Select Student from Student-Table to view tutor records
      </div>
    );
  return (
    <div>
      <Header />
      <SmallSideBar
        inMins={inMins}
        message={generateUpcomingSessionMessage(
          upcomingSession,
          upcomingSessionFromNow
        )}
      />
      {children}
    </div>
  );
};

export default StudentLayout;
