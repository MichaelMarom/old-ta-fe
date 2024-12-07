import { useCallback } from "react";
import { convertToDate } from "../Calendar";
import { isPastDate } from "../utils/calenderUtils";


const useEventPropGetter = ({
  isStudentLoggedIn,
  selectedTutor,
  student,
  lessons,
  clickedSlot,
  selectedSlots,
}) => {
  return useCallback(
    (event) => {
      // Check if the event matches the clickedSlot and it's a reserved slot
      const isFutureActiveLessonSelected =
        clickedSlot &&
        event.start === clickedSlot.start &&
        !isPastDate(convertToDate(clickedSlot.end)) && clickedSlot.request!=='delete' ;

      // Other conditions
      const secSubject = lessons?.some(
        (slot) =>
          slot.type === "intro" &&
          (event.subject !== selectedTutor.subject ||
            event.tutorId !== selectedTutor.academyId)
      );

      const otherStudentSession = isStudentLoggedIn
        ? lessons?.some(
            (slot) =>
              slot.studentName !== student.FirstName && event.id === slot.id
          )
        : false;

      const deletedSession = lessons?.some(
        (slot) =>
          slot.request === "delete" && slot.start === convertToDate(event.start)
      );

      if (deletedSession)
        return {
          className: isFutureActiveLessonSelected ? "blinking-button" : "",
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "red",
            color: "white",
          },
        };

      if (otherStudentSession && (event.type === "intro" || event.type === "booked")) {
        return {
          className: isFutureActiveLessonSelected ? "blinking-button" : "",
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "purple",
            color: "white",
          },
        };
      }

      if (otherStudentSession && event.type === "reserved") {
        return {
          className: isFutureActiveLessonSelected ? "blinking-button" : "",
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#d9caf8",
            color: "black",
          },
        };
      }

      if (secSubject && event.type === "intro") {
        return {
          className: `sec-reserved-event ${
            isFutureActiveLessonSelected ? "blinking-button" : ""
          }`,
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "lightblue",
            color: "black",
          },
        };
      }

      if (secSubject && event.type === "reserved") {
        return {
          className: `sec-reserved-event ${
            isFutureActiveLessonSelected ? "blinking-button" : ""
          }`,
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "lightYellow",
            color: "black",
          },
        };
      }

      if (secSubject && event.type === "booked") {
        return {
          className: `sec-reserved-event ${
            isFutureActiveLessonSelected ? "blinking-button" : ""
          }`,
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "lightGreen",
            color: "black",
          },
        };
      }

      if (event.type === "reserved") {
        return {
          className: `reserved-event ${
            isFutureActiveLessonSelected ? "blinking-button" : ""
          }`,
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "yellow",
            color: "black",
          },
        };
      }

      if (event.type === "booked") {
        return {
          className: `booked-event ${
            isFutureActiveLessonSelected ? "blinking-button" : ""
          }`,
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "green",
          },
        };
      }

      return {};
    },
    [isStudentLoggedIn, selectedTutor, student, lessons, clickedSlot, selectedSlots]
  );
};

export default useEventPropGetter;
