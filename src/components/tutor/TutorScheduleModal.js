import React, { useEffect, useState } from "react";
import CenteredModal from "../common/Modal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { moment } from "../../config/moment";
import { useSelector } from "react-redux";
import { formatted_tutor_sessions } from "../../axios/tutor";
import { convertToDate } from "../common/Calendar/Calendar";
import CustomEvent from "../common/Calendar/Event";
import useDayPropGetter from "../common/Calendar/hooks/useDayPropGetter";
import useSlotPropGetter from "../common/Calendar/hooks/useSlotPropGetter";

const TutorScheduleModal = ({
  isOpen,
  onClose,
  id = "",
  name = "",
  disableColor,
  disableDates,
  disableWeekDays,
  isStudentLoggedIn,
  enabledDays,
  selectedSlots,
  disabledHours,
  disableHourSlots,
  enableHourSlots,
  timeDifference,
  timeZone,
  selectedTutor,
  // weekDaysTimeSlots,
  tutor,
  lessons
}) => {
  const [weekDaysTimeSlots, setWeekDaysTimeSlots] = useState([])
  //TODO: why it is used in calender?
  // useEffect(() => {
  //   if (timeZone) {
  //     const timeDifference = { value: 30, unit: "minutes" };
  //     const currentTime = moment();

  //     const timeSlots = [];

  //     (disableWeekDays ?? []).forEach((weekday) => {
  //       const nextWeekday = currentTime.clone().day(weekday).startOf("day");

  //       const endOfDay = nextWeekday.clone().endOf("day");

  //       let currentSlotTime = nextWeekday.clone();
  //       while (currentSlotTime.isBefore(endOfDay)) {
  //         timeSlots.push(currentSlotTime.utc().toDate());
  //         currentSlotTime.add(timeDifference.value, timeDifference.unit);
  //       }
  //     });
  //     setWeekDaysTimeSlots(timeSlots);
  //   }
  // }, [timeZone, disableWeekDays]);

  const [sessions, setSessions] = useState([]);
  const { student } = useSelector((state) => state.student);
  useEffect(() => {
    if (isOpen) {
      formatted_tutor_sessions(id).then((result) => {
        if (!result?.response?.data) {
          setSessions(result.sessions);
        }
      });
    }
  }, [isOpen]);

  const dayPropGetter = useDayPropGetter({
    disableColor,
    disableDates,
    disableWeekDays,
    isStudentLoggedIn,
    enabledDays,
  });

  const slotPropGetter = useSlotPropGetter({
    disableColor,
    disableDates,
    disabledHours,
    disableHourSlots,
    enableHourSlots,
    isStudentLoggedIn,
    timeDifference,
    timeZone,
    selectedSlots,
    selectedTutor,
    weekDaysTimeSlots,
    tutor,
    lessons,
  });

  const eventPropGetter = (event) => {
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
    } else if (event.type === "booked") {
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
  };

  const convertToGmt = (date) => {
    let updatedDate = moment(convertToDate(date)).tz(student.timeZone).toDate();
    return updatedDate;
  };

  console.log(
    disabledHours)

  const localizer = momentLocalizer(moment);
  return (
    // Todo:
    <CenteredModal
      show={isOpen}
      handleClose={onClose}
      title={`Schedule Of ${name}`}
      style={{ maxWidth: "50%" }}
    >
      <div>
        <div
          className="m-3 student-calender"
          style={{ height: "65vh", widh: "65vw" }}
        >
          <Calendar
            localizer={localizer}
            events={sessions.map((event) => ({
              ...event,
              start: convertToGmt(event.start),
              end: convertToGmt(event.end),
            }))}
            components={{
              event: (event) => (
                <CustomEvent
                  {...event}
                  reservedSlots={sessions.filter(
                    (event) => event.type === "reserved"
                  )}
                  isStudentLoggedIn={true}
                  handleEventClick={() => { }}
                  handleSetReservedSlots={() => { }}
                />
              ),
            }}
            slotPropGetter={slotPropGetter}
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventPropGetter}
            startAccessor="start"
            selectable={true}
            endAccessor="end"
            style={{ minHeight: "100%" }}
          />
        </div>
      </div>
    </CenteredModal>
  );
};

export default TutorScheduleModal;
