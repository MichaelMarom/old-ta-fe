import React, { useState, useEffect } from "react";
import moment from "moment";
import StarRating from "../StarRating";
import { useDispatch, useSelector } from "react-redux";
import { convertToDate } from "./Calendar";
import { convertTutorIdToName } from "../../../utils/common";
import { deleteStudentLesson } from "../../../redux/student/studentBookings";

function CustomEvent({
  event,
  isStudentLoggedIn,
  handleEventClick = () => { },
  sessions = []
}) {
  const dispatch = useDispatch();
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(event.createdAt)
  );
  const [extraFiveMinStart, setExtraFiveMinStart] = useState(false);
  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    let intervalId;
    const checkIfOlderThan65Minutes = () => {
      const newRemainingTime = calculateRemainingTime(event.createdAt);
      setRemainingTime(newRemainingTime);

      if (
        (newRemainingTime.minutes === 0 && newRemainingTime.seconds === 1) ||
        newRemainingTime.minutes >= 30
      ) {
        clearInterval(intervalId);
        setExtraFiveMinStart(true);
      }
    };
    if (event.type === "reserved") {
      checkIfOlderThan65Minutes();
      intervalId = setInterval(checkIfOlderThan65Minutes, 1000);
    }

    return () => clearInterval(intervalId);
  }, [event]);

  useEffect(() => {
    let intervalId;
    const checkIfOlderThan65Minutes = async () => {
      const currentTime = moment();
      const inputTime = moment(event.createdAt);
      const diffInMinutes = currentTime.diff(inputTime, "minutes");
      //5 min extra after expire
      if (diffInMinutes >= 30 && event.type === "reserved") {
        // await delete_student_lesson(event.id)
        dispatch(deleteStudentLesson(event))
        setExtraFiveMinStart(false);
      }
    };

    if (extraFiveMinStart) {
      event.type === "reserved" && checkIfOlderThan65Minutes();
      intervalId =
        event.type === "reserved" &&
        setInterval(checkIfOlderThan65Minutes, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, extraFiveMinStart, sessions]);

  function calculateRemainingTime(createdAt) {
    const createdAtMoment = moment(createdAt);
    const now = moment();
    const duration = moment.duration(now.diff(createdAtMoment));

    if (
      duration.hours() > 2 ||
      duration.days() > 1 ||
      now.diff(createdAtMoment, "minutes") > 29
    ) {
      return {
        minutes: 0,
        seconds: 1,
      };
    }
    const remainingMinutes = 30 - duration.minutes() - 1;
    const remainingSeconds = 60 - duration.seconds() - 1;

    return {
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    };
  }

  return (
    <div
      className={`text-center h-100 ${event.request === "postpone" ? "blinking-button" : ""
        } `}
      style={{ fontSize: "12px" }}
      onClick={() => handleEventClick(event)}
    >
      {event.type === "reserved" && extraFiveMinStart ? (
        <div>
          Marked For Booking - expired
        </div>
      ) : (
        <div>
          Marked For Booking
          {(isStudentLoggedIn && student.FirstName !== event.studentName) ||
            event.type === "reserved"
            ? ``
            : ` ${isStudentLoggedIn
              ? `from ${event.tutorScreenName || "unknown"}`
              : `by ${event.studentName}`
            }`}
          {event.type === "reserved" && (
            <div>
              {String(remainingTime.minutes).padStart(2, "0")} :
              {String(remainingTime.seconds).padStart(2, "0")}
            </div>
          )}
          { event.type !== "reserved" && <div>"{event.subject}"</div>}
          {event.request === "postpone" && <div>Postpone Request</div>}
          {event.request === "delete" && <div>Deleted</div>}
          {!isStudentLoggedIn && event.ratingByStudent && (
            <div>
              <StarRating rating={event.ratingByStudent} />
            </div>
          )}
          {isStudentLoggedIn && event.ratingByTutor && (
            <div>
              <StarRating rating={event.ratingByTutor} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomEvent;
