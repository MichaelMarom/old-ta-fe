import { useCallback } from "react";
import { convertToDate } from "../Calendar";

const useEventPropGetter = ({
  reservedSlots,
  bookedSlots,
  isStudentLoggedIn,
  selectedTutor,
  student
}) => {
  return useCallback(
    (event) => {
      const secSubject = reservedSlots?.some(
        (slot) => slot.type === "intro" && event.subject !== selectedTutor.subject
      );

      const otherStudentSession = isStudentLoggedIn
        ? reservedSlots.concat(bookedSlots)?.some(
            (slot) => slot.studentName !== student.FirstName && event.id === slot.id
          )
        : false;

      const deletedSession = reservedSlots.concat(bookedSlots)?.some(
        (slot) => slot.request === "delete" && slot.start === convertToDate(event.start)
      );

      if (deletedSession)
        return {
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "red",
            color: "white",
          },
        };

      if (otherStudentSession && (event.type === "intro" || event.type === "booked")) {
        return {
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
          className: "sec-reserved-event",
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
          className: "sec-reserved-event",
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
          className: "sec-reserved-event",
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
          className: "reserved-event",
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
          className: "booked-event",
          style: {
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "green",
          },
        };
      }

      return {};
    },
    [reservedSlots, bookedSlots, isStudentLoggedIn, selectedTutor, student]
  );
};

export default useEventPropGetter;
