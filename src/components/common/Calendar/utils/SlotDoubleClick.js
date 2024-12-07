import moment from "moment-timezone";
import { convertToDate, views } from "../Calendar";
import {
  getSecond30MinsSlotWhenDoubleClick,
  isEventAlreadyExist,
  isPastDate,
} from "./calenderUtils";
import { toast } from "react-toastify";
import { save_student_lesson } from "../../../../axios/calender";
import { postStudentLesson, updateStudentLesson } from "../../../../redux/student/studentBookings";

export const handleSlotDoubleClick = (
  dispatch,
  slotInfo,
  student,
  // reservedSlots,
  // bookedSlots,
  slotForPostpone,
  setSlotForPostpone,
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
  lessons,
  selectedType,
  clickedSlot,
  setClickedSlot
) => {

  if (
    haveErrorsWhenDoubleClick(
      slotInfo,
      disableColor,
      isStudentLoggedIn,
      lessons
    )
  )
    return;



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
    handleStudentClickInWeekOrDayTab(
      dispatch,
      slotInfo,
      student,
      slotForPostpone,
      setSlotForPostpone,
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
      lessons,
      selectedType,
      clickedSlot,
      setClickedSlot
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

const handleStudentClickInWeekOrDayTab = async (
  dispatch,
  slotInfo,
  student,
  slotForPostpone,
  setSlotForPostpone,
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
  lessons,
  selectedType,
  clickedSlot, 
  setClickedSlot

) => {
  if (activeView !== views.MONTH) {
    //slots/month
    const dayName = moment(slotInfo.start).format("dddd");
    const formattedTime = moment(slotInfo.start).format("h:00 a");
    const momentStartTime = moment(slotInfo.start);
    let startEventTime = momentStartTime.minute(0);
    let endEventTime = momentStartTime.clone().minute(0).add(1, "hour");

    // check blocked slots
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
    const ifAlreadySelecetd = selectedSlots.some((slot) =>
      convertToDate(slot.start).getTime() === convertToDate(startEventTime).getTime())
    if (ifAlreadySelecetd) return

    const threeHoursGap = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
    if (startEventTime.toDate() < threeHoursGap) return toast.warning("You can only reserve slots starting at least 3 hours from now.");


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
      }) && !clickedSlot.id
    ) {
      return toast.warning(`Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`);
    }

    const introExistsInLessons = lessons.some(
      (lesson) =>
        lesson.type === "intro" &&
        lesson.studentId === student.AcademyId &&
        lesson.subject === selectedTutor.subject &&
        lesson.tutorId === selectedTutor.academyId
    );
    if (
      (!existInEnableSlots &&
        disableWeekDays?.includes(dayName) &&
        !existsinEnabledInMonth &&
        !existsinEnabledInWeek) ||
      isDisableDate
    ) {
      alert(`This slot is blocked, please select a white slot.`);
    } else if (
      existInDisableHourSlots ||
      (!existInEnableSlots &&
        disabledHours?.some((timeRange) => {
          const [start] = timeRange;
          return formattedTime === start;
        }))
    ) {
      alert("This slot is blocked, please select a white slot.");
    } else if (!clickedSlot.id) {
      if (introExistsInLessons) {
        const result = await dispatch(postStudentLesson({
          end: endEventTime.toDate(),
          start: startEventTime.toDate(),
          subject: selectedTutor.subject,
          type: 'reserved',
          studentId: student.AcademyId,
          studentName: student.FirstName,
          tutorId: selectedTutor.academyId,
          tutorScreenName: selectedTutor.tutorScreenName,
          title: "Reserved"
        }))

        result?.[0]?.id && setSelectedSlots([
          ...selectedSlots,
          {
            id: result[0].id,
            start: startEventTime.toDate(),
            end: endEventTime.toDate(),
            subject: selectedTutor.subject,
            type: 'booked',

            // invoiceNum: generateRandomId()
          },
        ]);

        // TODO: add slot here: it will generate id comb=ine thoes ids into and array
        // next slot will be like [{id, other details}. {id, other details}] = 
        // already saved in db with type = reserved 
        // after hitting pay: it will individullay update the ids with type = "booked" add invoiceNum
        // and then add invoice Record with discount, booking fee etc
      } else {
        setSelectedSlots([
          {
            start: startEventTime.toDate(),
            end: endEventTime.toDate(),
            subject: selectedTutor.subject,
            type: 'intro',
            // invoiceNum: generateRandomId()
          },
        ]);
      }
    }
    else {
      dispatch(updateStudentLesson(clickedSlot.id, {
        ...clickedSlot,
        end: endEventTime.toDate(),
        start: startEventTime.toDate(),
        request: null,
      }))
     setClickedSlot({})
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
