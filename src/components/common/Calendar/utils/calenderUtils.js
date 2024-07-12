import moment from "moment";
import { useCallback } from "react";
import { convertToDate } from "../Calendar";

export const isBetweenVacationRange = (
  date,
  isStudentLoggedIn,
  selectedTutor,
  tutor
) => {
  const checkDate = moment.utc(date);
  const startDate = moment.utc(
    isStudentLoggedIn ? selectedTutor.StartVacation : tutor.StartVacation
  );
  const endDate = moment.utc(
    isStudentLoggedIn ? selectedTutor.EndVacation : tutor.EndVacation
  );

  return (
    (isStudentLoggedIn ? selectedTutor.VacationMode : tutor.VacationMode) &&
    checkDate.isBetween(startDate, endDate, null, "[]")
  );
};

export const isFutureDate = (date) => date.getTime() >= new Date().getTime();
export const isPastDate = (date) => date.getTime() < new Date().getTime();

export const isEventAlreadyExist = (lessons, slotInfo) => {
  return lessons?.some((event) =>
    [event.start, event.end].some(
      (date) =>
        convertToDate(date).getTime() === slotInfo.start.getTime() ||
        convertToDate(date).getTime() === slotInfo.end.getTime()
    )
  );
};

export const getSecond30MinsSlotWhenDoubleClick = (start, end) =>{
  const secSlot = moment(convertToDate(start)).minutes() === 30;
  let endTime = secSlot
    ? moment(convertToDate(start)).subtract(30, "minutes").toDate()
    : end;

    return endTime
}

export const convertToGmt = (date) => {
  return date;
};

export const filterOtherStudentAndTutorSession = (
  givenReservedSlots = [],
  givenBookedSlots,

  tutorIdPassed,
  studentIdPassed,

  tutor,
  selectedTutor,
  isStudentLoggedIn,
  reservedSlots,
  student,
  bookedSlots,
  //   tutorId = isStudentLoggedIn ? selectedTutor.academyId : tutor.AcademyId,

  studentId
) => {
  let tutorId =
    tutorIdPassed || isStudentLoggedIn
      ? selectedTutor.academyId
      : tutor.AcademyId;

  let updatedReservedSlots = (
    givenReservedSlots.length ? givenReservedSlots : reservedSlots
  ).filter(
    (slot) =>
      slot.studentId === (studentId ? studentId : student.AcademyId) &&
      slot.tutorId === tutorId
  );
  let updatedBookedSlots = (
    givenBookedSlots ? givenBookedSlots : bookedSlots
  ).filter(
    (slot) =>
      slot.studentId === (studentId ? studentId : student.AcademyId) &&
      slot.tutorId === tutorId
  );
  console.log(
    updatedReservedSlots.length,
    updatedBookedSlots.length,
    tutorId,
    studentId ? studentId : student.AcademyId
  );
  return {
    reservedSlots: updatedReservedSlots,
    bookedSlots: updatedBookedSlots,
  };
};

export const checkDateBetweenVacation = (
  date,
  startVacation,
  endVacation,
  vacationMode
) => {
  const checkDate = moment.utc(date);
  const startDate = moment.utc(startVacation).utc();
  const endDate = moment.utc(endVacation).utc();

  return vacationMode && checkDate.isBetween(startDate, endDate, null, "[]");
};

export const checkDisableWeekTimeSlots = (
  date,
  weekDaysTimeSlots,
  timeZone,
  timeDifference,
  isStudentLoggedIn
) => {
  return weekDaysTimeSlots?.some((slot) => {
    const dateMoment = moment(date).tz(timeZone);
    const slotTimeZoneMoment = isStudentLoggedIn
      ? moment(slot).clone().add(timeDifference, "hours")
      : moment(slot);

    return slotTimeZoneMoment.isSame(dateMoment);
  });
};

export const checkReservedSlots = (date, reservedSlots) => {
  return reservedSlots?.some((slot) => {
    return (
      convertToDate(convertToDate(slot.start)).getTime() === date.getTime()
    );
  });
};

export const checkSelectedSlots = (date, selectedSlots) => {
  const existInSelectedSlotStart = selectedSlots?.some(
    (slot) => slot.start.getTime() === date.getTime()
  );

  const existInSelectedSlotEnd = selectedSlots?.some(
    (slot) =>
      date.getTime() ===
      moment(convertToDate(slot.end)).subtract(30, "minutes").toDate().getTime()
  );

  return { existInSelectedSlotStart, existInSelectedSlotEnd };
};

export const checkEnableSlots = (date, enableHourSlots) => {
  return enableHourSlots?.some((dateTime) => {
    const slotUTCTime = moment.utc(date);
    const enabledSlotUTCTime = moment(convertToDate(dateTime));
    return slotUTCTime.isSame(enabledSlotUTCTime);
  });
};

export const checkDisableHourSlots = (date, disableHourSlots) => {
  return disableHourSlots?.some(
    (dateTime) => convertToDate(dateTime).getTime() === date.getTime()
  );
};

export const checkDefaultHours = (date, disabledHours, formattedTime) => {
  return disabledHours?.some((slot) => {
    const startTime = moment("9:00 PM", "h:mm A");
    const endTime = moment("7:00 AM", "h:mm A");
    const momentTime = moment(formattedTime, "h:mm A");

    if (endTime.isBefore(startTime)) {
      return (
        slot[0] === formattedTime &&
        (momentTime.isBetween(
          startTime,
          moment("11:59 PM", "h:mm A"),
          undefined,
          "[]"
        ) ||
          momentTime.isBetween(
            moment("12:00 AM", "h:mm A"),
            endTime,
            undefined,
            "[]"
          ))
      );
    }

    return (
      slot[0] === formattedTime &&
      momentTime.isBetween(startTime, endTime, undefined, "[]")
    );
  });
};

export const checkDisableDates = (date, disableDates) => {
  const twentyFourHoursAgo = moment(date).subtract(24, "hours");
  return disableDates?.some((slot) =>
    moment(slot).isBetween(twentyFourHoursAgo, moment(date))
  );
};
