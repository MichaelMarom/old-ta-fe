import moment from "moment-timezone";
import { convertToDate, views } from "../Calendar";
import {
  getSecond30MinsSlotWhenDoubleClick,
  isEventAlreadyExist,
  isPastDate,
} from "./calenderUtils";
import { toast } from "react-toastify";
import { FeedbackMissing } from "../ToastMessages";

export const handleSlotDoubleClick = (
  slotInfo,
  student,
  // reservedSlots,
  // bookedSlots,
  disableColor,
  isStudentLoggedIn,
  activeView,

  setEnableHourSlots,
  setEnabledDays,
  setDisableDateRange,
  setDisableDates,
  disableWeekDays,
  enableHourSlots,
  enabledDays,

  setDisableHourSlots,
  disableHourSlots,
  disableDates,
  disabledHours,

  selectedSlots,
  setSelectedSlots,
  setIsModalOpen,
  selectedTutor,
  lessons
) => {
  //do nothing on single click
  // const clickedUpperSlot =
  //   moment(convertToDate(slotInfo.end)).diff(
  //     moment(convertToDate(slotInfo.start)),
  //     "days"
  //   ) === 1;

  // if (clickedUpperSlot && activeView !== views.MONTH) return;
  if (
    haveErrorsWhenDoubleClick(
      slotInfo,
      disableColor,
      isStudentLoggedIn,
      lessons
    )
  )
    return;

  // const secSlot = moment(convertToDate(slotInfo.start)).minutes() === 30;
  // let endTime = secSlot
  //   ? moment(convertToDate(slotInfo.start)).subtract(30, "minutes").toDate()
  //   : slotInfo.end;

  const endTime = getSecond30MinsSlotWhenDoubleClick(
    slotInfo.start,
    slotInfo.end
  );

  // Delegate further handling based on user type (student/tutor)
  if (!isStudentLoggedIn) {
    handleSlotDoubleClickForTutor(
      slotInfo,
      endTime,
      disableWeekDays,
      activeView,

      setEnableHourSlots,

      setEnabledDays,
      enableHourSlots,
      setDisableDates,
      enabledDays,
      disableDates,
      setDisableHourSlots,
      disableHourSlots,
      disabledHours
      // reservedSlots
    );
  } else {
    handleSlotDoubleClickForStudent(
      slotInfo,
      student,
      activeView,
      enabledDays,
      slotInfo.start,
      disableDates,
      disableHourSlots,
      enableHourSlots,
      // reservedSlots,
      disableWeekDays,
      disabledHours,
      selectedSlots,
      selectedTutor,
      setIsModalOpen,
      setSelectedSlots,
      lessons
    );
  }
};

export const handleSlotDoubleClickForTutor = (
  slotInfo,
  endTime,
  disableWeekDays,
  activeView,

  setEnableHourSlots,

  setEnabledDays,
  enableHourSlots,
  setDisableDates,
  enabledDays,

  disableDates,
  setDisableHourSlots,
  disableHourSlots,
  disabledHours
  // reservedSlots
) => {
  const dayName = moment(slotInfo.start).format("dddd");
  //TODO: fix 
  if ((disableWeekDays && disableWeekDays.includes(dayName)) ||
    (checkIfClickedSlotExistInDisabledHoursRange(slotInfo.start, disabledHours, "Australia/Eucla") && activeView !== views.MONTH)) {
    handleEnableHoursAndDays(
      slotInfo,
      endTime,
      activeView,

      setEnableHourSlots,
      enableHourSlots,
      setEnabledDays,
      enabledDays
    );
  } else {
    handleMonthViewDisable(slotInfo, setDisableDates, disableDates, activeView);
    if (
      disableHourSlots?.some(
        (date) =>
          convertToDate(date).getTime() === slotInfo.start.getTime() ||
          endTime.getTime() === convertToDate(date).getTime()
      )
    ) {
      const removeDisableHourSlots = disableHourSlots.filter(
        (date) =>
          convertToDate(date).getTime() !== slotInfo.start.getTime() &&
          endTime.getTime() !== convertToDate(date).getTime()
      );
      setDisableHourSlots(removeDisableHourSlots);
    } else {
      setDisableHourSlots([
        ...(disableHourSlots ?? []),
        slotInfo.start,
        endTime,
      ]);
    }
  }
};

export const handleSlotDoubleClickForStudent = (
  slotInfo,
  student,
  activeView,
  enabledDays,
  clickedDate,
  disableDates,
  disableHourSlots,
  enableHourSlots,
  // reservedSlots,
  disableWeekDays,
  disabledHours,
  selectedSlots,
  selectedTutor,
  setIsModalOpen,
  setSelectedSlots,
  lessons
) => {
  handleStudentClickInWeekOrDayTab(
    slotInfo,
    student,
    activeView,
    enabledDays,
    clickedDate,
    disableDates,
    disableHourSlots,
    enableHourSlots,
    // reservedSlots,
    disableWeekDays,
    disabledHours,
    selectedSlots,
    selectedTutor,
    setIsModalOpen,
    setSelectedSlots,
    lessons
  );
  // if (activeView === views.MONTH) {
  //   handleSlotMonthView(slotInfo, setDisableDateRange, setDisableDates);
  // } else {
  //   handleSlotWeekDayView(
  //     slotInfo,
  //     setDisableHourSlots,
  //     setEnableHourSlots,

  //     disableHourSlots,
  //     disableDates,
  //     enableHourSlots,
  //     reservedSlots,
  //     activeView
  //   );
  // }
};

const checkIfClickedSlotExistInDisabledHoursRange = (date, blockedHours, timeZone) => {
  // Convert the given UTC date to the tutor's timezone and extract the time part
  const tutorTime = moment.utc(date).tz(timeZone).format('h:mm a');

  for (let i = 0; i < blockedHours.length; i++) {
    const [startTime, endTime] = blockedHours[i];

    // Handle 'midnight' as a special case
    const formattedStartTime = startTime.includes('midnight') ? '12:00 am' : startTime;
    const formattedEndTime = endTime.includes('midnight') ? '12:00 am' : endTime;

    const start = moment(formattedStartTime, 'h:mm a');
    const end = moment(formattedEndTime, 'h:mm a');
    const currentTime = moment(tutorTime, 'h:mm a'); // Convert tutor time to moment object

    // If the end time is midnight or early morning, handle the next day range
    if (end.isBefore(start)) {
      if (currentTime.isBetween(start, moment('11:59 pm', 'h:mm a')) || currentTime.isBetween(moment('12:00 am', 'h:mm a'), end)) {
        return true;
      }
    } else {
      // Check if the currentTime falls within the start and end times
      if (currentTime.isBetween(start, end, null, '[)')) {
        return true;
      }
    }
  }

  return false; // The date's hour is not blocked
}


// Handling slot actions for tutor
const handleEnableHoursAndDays = (
  slotInfo,
  endTime,
  activeView,

  setEnableHourSlots,

  enableHourSlots,
  setEnabledDays,
  enabledDays
) => {
  if (activeView !== views.MONTH) {
    const slotStart = convertToDate(slotInfo.start);
    const existingSlotIndex = (enableHourSlots || []).findIndex(
      (date) => convertToDate(date).getTime() === slotStart.getTime()
    );

    if (existingSlotIndex === -1) {
      setEnableHourSlots([...(enableHourSlots || []), slotStart, endTime]);
    } else {
      const updatedEnableHourSlots = (enableHourSlots || []).filter(
        (date) =>
          convertToDate(date).getTime() !== slotStart.getTime() &&
          convertToDate(date).getTime() !== endTime.getTime()
      );
      setEnableHourSlots(updatedEnableHourSlots);
    }
  } else {
    handleEnableDate(slotInfo, setEnabledDays, enabledDays);
  }
};

const handleEnableDate = (slotInfo, setEnabledDays, enabledDays) => {
  const slotStart = convertToDate(slotInfo.start);
  const existingEnabledDayIndex = (enabledDays || []).findIndex(
    (date) => convertToDate(date).getTime() === slotStart.getTime()
  );

  if (existingEnabledDayIndex === -1) {
    setEnabledDays([...(enabledDays || []), slotStart]);
  } else {
    const updatedEnabledDays = (enabledDays || []).filter(
      (date) => convertToDate(date).getTime() !== slotStart.getTime()
    );
    setEnabledDays(updatedEnabledDays);
  }
};

const handleMonthViewDisable = (
  slotInfo,
  setDisableDates,

  disableDates,
  activeView
) => {
  if (activeView !== views.WEEK) {
    console.log(disableDates, typeof (disableDates))
    const existingDisableDateIndex = (disableDates || []).findIndex(
      (date) => convertToDate(date).getTime() === slotInfo.start.getTime()
    );

    if (existingDisableDateIndex === -1) {
      setDisableDates([...(disableDates || []), slotInfo.start]);
    } else {
      const updatedDisableDates = (disableDates || []).filter(
        (date) => convertToDate(date).getTime() !== slotInfo.start.getTime()
      );
      setDisableDates(updatedDisableDates);
    }
  }
};

const handleStudentClickInWeekOrDayTab = (
  slotInfo,
  student,
  activeView,
  enabledDays,
  clickedDate,
  disableDates,
  disableHourSlots,
  enableHourSlots,
  // reservedSlots,
  disableWeekDays,
  disabledHours,
  selectedSlots,
  selectedTutor,
  setIsModalOpen,
  setSelectedSlots,
  lessons
) => {
  if (activeView !== views.MONTH) {
    //slots/month
    const dayName = moment(slotInfo.start).format("dddd");
    const formattedTime = moment(slotInfo.start).format("h:00 a");
    const momentStartTime = moment(slotInfo.start);
    let startEventTime = momentStartTime.minute(0);
    let endEventTime = momentStartTime.clone().minute(0).add(1, "hour");

    const existsinEnabledInMonth = enabledDays?.some(
      (arrayDate) =>
        convertToDate(arrayDate).getTime() === clickedDate.getTime()
    );
    const existsinEnabledInWeek = enabledDays?.some((arrayDate) => {
      const slotDateMoment = moment(clickedDate);
      const arrayMomentDate = moment(arrayDate);
      return arrayMomentDate.isSame(slotDateMoment, "day");
    });

    const isDisableDate = disableDates?.some((storeDate) => {
      const slotDateMoment = moment(clickedDate);
      const storedMomentDate = moment(storeDate);
      return storedMomentDate.isSame(slotDateMoment, "day");
    });

    //slots week/days
    const existInDisableHourSlots = disableHourSlots?.some(
      (dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime()
    );

    const existInEnableSlots = enableHourSlots?.some(
      (dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime()
    );

    //student general: lesson already exist in selected slot
    const existInOccopiedSlots = lessons
      ?.some(
        (lesson) =>
          convertToDate(lesson.start).getTime() === clickedDate.getTime() ||
          convertToDate(moment(lesson.start).add(30, 'minute').toDate()).getTime() === clickedDate.getTime()
      );

    if (
      lessons?.some((slot) => {
        return (
          slot.type === "intro" &&
          slot.subject === selectedTutor.subject &&
          slot.studentId === student.AcademyId &&
          slot.tutorId === selectedTutor.academyId &&
          slot.end.getTime() < new Date().getTime() &&
          !slot.ratingByStudent
        );
      })
    ) {
      return toast.warning(`Your Feedback for the "${selectedTutor.subject}" LESSON is missing.
           You must complete the feedback before booking!`
      );
    }
    if (
      lessons?.some((slot) => {
        return (
          slot.type === "intro" &&
          slot.subject === selectedTutor.subject &&
          slot.studentId === student.AcademyId &&
          slot.tutorId === selectedTutor.academyId &&
          slot.end.getTime() > new Date().getTime()
        );
      })
    ) {
      return toast.warning(`Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`
      );
    }


    const introExistsInLessons = lessons.some(
      (lesson) =>
        lesson.type === "intro" &&
        lesson.studentId === student.AcademyId &&
        lesson.subject === selectedTutor.subject
    );
    if (
      (!existInEnableSlots &&
        disableWeekDays?.includes(dayName) &&
        !existsinEnabledInMonth &&
        !existsinEnabledInWeek) ||
      isDisableDate
    ) {
      alert(`This slot is blocked, please select a white slot1.`);
    } else if (
      existInDisableHourSlots ||
      (!existInEnableSlots &&
        disabledHours?.some((timeRange) => {
          const [start] = timeRange;
          return formattedTime === start;
        }))
    ) {
      alert("This slot is blocked, please select a white slot.");
    } else {
      console.log(
        introExistsInLessons,
        existInOccopiedSlots,
        lessons,
        student,
        selectedTutor
      );
      if (!existInOccopiedSlots) {
        if (introExistsInLessons) {
          if (selectedSlots.some((slot) => convertToDate(slot.start).getTime() === convertToDate(startEventTime).getTime())) return
          if (selectedSlots.length < 6) {
            setSelectedSlots([
              ...selectedSlots,
              {
                start: startEventTime.toDate(),
                end: endEventTime.toDate(),
                subject: selectedTutor.subject,
              },
            ]);
            setIsModalOpen(true);
          } else {
            toast.error("You can not Place Hold more than 6 Slots! ");
          }
        } else {
          setSelectedSlots([
            {
              start: startEventTime.toDate(),
              end: endEventTime.toDate(),
              subject: selectedTutor.subject,
            },
          ]);
          setIsModalOpen(true);
        }
      }
    }
  }
};

const haveErrorsWhenDoubleClick = (
  slotInfo,
  disableColor,
  isStudentLoggedIn,
  lessons
) => {
  if (slotInfo.action === "click") return true;
  if (!isStudentLoggedIn && !disableColor) {
    return toast.warning("Please select a color before disabling slots!");
  }
  if (isEventAlreadyExist(lessons, slotInfo)) {
    return toast.warning(
      "This time slot is already reserved. Please select from available slots."
    );
  }
  if (isPastDate(slotInfo.start)) {
    return toast.warning(
      `Cannot ${!isStudentLoggedIn ? "Disable/Enable " : "Book/Reserve"
      } older slots.`
    );
  }

  return false;
};
