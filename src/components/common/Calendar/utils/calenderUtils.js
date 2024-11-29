import { moment } from "../../../../config/moment";
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
  const slotStart = slotInfo.start.getTime();
  const slotEnd = slotInfo.end.getTime();

  return lessons?.some(({ start, end }) => {
    const eventStart = convertToDate(start).getTime();
    const eventEnd = convertToDate(end).getTime();
    console.log(convertToDate(start).getMinutes(), convertToDate(end).getMinutes(), 
    convertToDate(slotInfo.start).getMinutes(), convertToDate(slotInfo.end).getMinutes());
    return eventStart === slotStart || eventEnd === slotEnd;
  });
};

export const extractLoggedinStudentLesson = (lessons, selectedTutor, student) => {
  return lessons.filter((lesson) =>
    lesson.tutorId === selectedTutor.academyId &&
    lesson.studentId === student.AcademyId &&
    lesson.subject === selectedTutor.subject
  )
}

export function calculateDiscount(allLessons, selectedSlots, selectedTutor, student) {
  // const totalSlots = extractLoggedinStudentLesson(allLessons, selectedTutor, student)
  //   .filter(lesson => lesson.type !== 'reserved').length + selectedSlots.length;

  if (selectedSlots.length >= 24) {
    return 20; // Maximum discount
  } else if (selectedSlots.length >= 18) {
    return 15;
  } else if (selectedSlots.length >= 12) {
    return 10;
  } else if (selectedSlots.length >= 6) {
    return 5;
  } else {
    return 0; // No discount for less than 6 slots
  }
}

export const getSecond30MinsSlotWhenDoubleClick = (start, end) => {
  const secSlot = moment(convertToDate(start)).minutes() === 30;
  let endTime = secSlot
    ? moment(convertToDate(start)).subtract(30, "minutes").toDate()
    : end;

  return endTime;
};

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

  return {
    reservedSlots: tutorId ? updatedReservedSlots : reservedSlots,
    bookedSlots: tutorId ? updatedBookedSlots : bookedSlots,
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
