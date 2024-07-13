import moment from "moment";
import { convertToDate, views } from "../Calendar";
import {
  getSecond30MinsSlotWhenDoubleClick,
  isEventAlreadyExist,
  isPastDate,
} from "./calenderUtils";
import { toast } from "react-toastify";

export const handleSlotDoubleClick = (
  slotInfo,
  reservedSlots,
  bookedSlots,
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
  selectedTutor
) => {
  // console.log(
  //   slotInfo,
  //   reservedSlots,
  //   bookedSlots,
  //   toast,
  //   disableColor,
  //   isStudentLoggedIn,
  //   activeView,
  //
  //   setEnableHourSlots,
  //   setEnabledDays,
  //   setDisableDateRange,
  //   setDisableDates,
  //   disableWeekDays,
  //   enableHourSlots,
  //   enabledDays
  // );

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
      reservedSlots.concat(bookedSlots)
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
      reservedSlots
    );
  } else {
    handleSlotDoubleClickForStudent(
      slotInfo,
      activeView,
      enabledDays,
      slotInfo.start,
      disableDates,
      disableHourSlots,
      enableHourSlots,
      reservedSlots,
      disableWeekDays,
      disabledHours,
      selectedSlots,
      selectedTutor,
      setIsModalOpen,
      setSelectedSlots
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
  reservedSlots
) => {
  const dayName = moment(slotInfo.start).format("dddd");
  if (disableWeekDays && disableWeekDays.includes(dayName)) {
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
    // handleDisableHourSlots(
    //   slotInfo,
    //   setDisableHourSlots,
    //   disableHourSlots,
    //   reservedSlots
    // );
  }
};

export const handleSlotDoubleClickForStudent = (
  slotInfo,
  activeView,
  enabledDays,
  clickedDate,
  disableDates,
  disableHourSlots,
  enableHourSlots,
  reservedSlots,
  disableWeekDays,
  disabledHours,
  selectedSlots,
  selectedTutor,
  setIsModalOpen,
  setSelectedSlots
) => {
  handleStudentClickInWeekOrDayTab(
    slotInfo,
    activeView,
    enabledDays,
    clickedDate,
    disableDates,
    disableHourSlots,
    enableHourSlots,
    reservedSlots,
    disableWeekDays,
    disabledHours,
    selectedSlots,
    selectedTutor,
    setIsModalOpen,
    setSelectedSlots
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
    const existingSlotIndex = enableHourSlots.findIndex(
      (date) => convertToDate(date).getTime() === slotStart.getTime()
    );

    if (existingSlotIndex === -1) {
      setEnableHourSlots([...enableHourSlots, slotStart, endTime]);
    } else {
      const updatedEnableHourSlots = enableHourSlots.filter(
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
  const existingEnabledDayIndex = enabledDays.findIndex(
    (date) => convertToDate(date).getTime() === slotStart.getTime()
  );

  if (existingEnabledDayIndex === -1) {
    setEnabledDays([...enabledDays, slotStart]);
  } else {
    const updatedEnabledDays = enabledDays.filter(
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
    const existingDisableDateIndex = disableDates.findIndex(
      (date) => convertToDate(date).getTime() === slotInfo.start.getTime()
    );

    if (existingDisableDateIndex === -1) {
      setDisableDates([...disableDates, slotInfo.start]);
    } else {
      const updatedDisableDates = disableDates.filter(
        (date) => convertToDate(date).getTime() !== slotInfo.start.getTime()
      );
      setDisableDates(updatedDisableDates);
    }
  }
};

// Handling slot actions for student
// const handleSlotMonthView = (
//   slotInfo,
//   setDisableDateRange,
//   setDisableDates,

//   disableDates,
//   disableDateRange,
//   reservedSlots
// ) => {
//   const existingDisableDateIndex = disableDates.findIndex(
//     (date) => convertToDate(date).getTime() === slotInfo.start.getTime()
//   );
//   const reservedSlotPresentInClickedDate = reservedSlots?.some(
//     (slot) =>
//       moment(convertToDate(slot.start)).date() === moment(slotInfo.start).date()
//   );

//   const existingDisableDateRange = disableDateRange?.some(
//     (date) => date.start.getTime() === slotInfo.start.getTime()
//   );

//   if (!existingDisableDateRange && !reservedSlotPresentInClickedDate) {
//     setDisableDateRange([
//       ...(disableDateRange ?? []),
//       { start: slotInfo.start, end: slotInfo.end },
//     ]);
//   } else {
//     const updatedDisableDateRange = disableDateRange.filter(
//       (date) => convertToDate(date.start).getTime() !== slotInfo.start.getTime()
//     );
//     setDisableDateRange(updatedDisableDateRange);
//   }

//   if (!existingDisableDateIndex && !reservedSlotPresentInClickedDate) {
//     setDisableDates([...(disableDates ?? []), slotInfo.start]);
//   } else {
//     const updatedDisableDates = disableDates.filter(
//       (date) => convertToDate(date).getTime() !== slotInfo.start.getTime()
//     );
//     setDisableDates(updatedDisableDates);
//   }
// };

// const handleSlotWeekDayView = (
//   slotInfo,
//   setDisableHourSlots,
//   setEnableHourSlots,

//   disableHourSlots,
//   disableDates,
//   enableHourSlots,
//   reservedSlots,
//   activeView
// ) => {
//   if (activeView !== views.MONTH) {
//     const existInDisabledDate = disableDates?.some((storeDate) => {
//       const slotDateMoment = moment(convertToDate(slotInfo.start));
//       const storedMomentDate = moment(storeDate);
//       return storedMomentDate.isSame(slotDateMoment, "day");
//     });

//     const existInDisableHourSlots = disableHourSlots?.some(
//       (dateTime) =>
//         convertToDate(dateTime).getTime() === slotInfo.start.getTime() ||
//         slotInfo.end.getTime() === convertToDate(dateTime).getTime()
//     );

//     if (existInDisableHourSlots || existInDisabledDate) {
//       handleDisableHourSlots(slotInfo, setDisableHourSlots);
//     } else {
//       handleEnableHourSlots(
//         slotInfo,
//         setEnableHourSlots,
//         disableHourSlots,
//         enableHourSlots,
//         reservedSlots
//       );
//     }
//   }
// };

// const handleDisableHourSlots = (
//   slotInfo,
//   setDisableHourSlots,
//   disableHourSlots,
//   reservedSlots
// ) => {
//   const slotStart = convertToDate(slotInfo.start);
//   console.log(slotStart, "hourslots");
//   const reservedSlotsHaveClickedSlot = reservedSlots?.some(
//     (slot) => slot.start.getTime() === slotStart.startOf("hour").valueOf()
//   );

//   if (!reservedSlotsHaveClickedSlot) {
//     const existingDisableHourSlots = disableHourSlots?.some(
//       (date) =>
//         convertToDate(date).getTime() === slotInfo.start.getTime() ||
//         slotInfo.end.getTime() === convertToDate(date).getTime()
//     );

//     if (!existingDisableHourSlots) {
//       setDisableHourSlots([
//         ...(disableHourSlots ?? []),
//         slotInfo.start,
//         slotInfo.end,
//       ]);
//     } else {
//       const updatedDisableHourSlots = disableHourSlots.filter(
//         (date) =>
//           convertToDate(date).getTime() !== slotInfo.start.getTime() &&
//           slotInfo.end.getTime() !== convertToDate(date).getTime()
//       );
//       setDisableHourSlots(updatedDisableHourSlots);
//     }
//   }
// };

// const handleEnableHourSlots = (
//   slotInfo,
//   setEnableHourSlots,
//   disableHourSlots,
//   enableHourSlots,
//   reservedSlots
// ) => {
//   const reservedSlotsHaveClickedSlot = reservedSlots?.some(
//     (slot) => slot.start.getTime() === slotInfo.start.getTime()
//   );

//   if (!reservedSlotsHaveClickedSlot) {
//     if (
//       !disableHourSlots?.some(
//         (date) =>
//           convertToDate(date).getTime() === slotInfo.start.getTime() ||
//           slotInfo.end.getTime() === convertToDate(date).getTime()
//       )
//     ) {
//       setEnableHourSlots([
//         ...(enableHourSlots ?? []),
//         slotInfo.start,
//         slotInfo.end,
//       ]);
//     } else {
//       const updatedEnableHourSlots = enableHourSlots.filter(
//         (date) =>
//           convertToDate(date).getTime() !== slotInfo.start.getTime() &&
//           slotInfo.end.getTime() !== convertToDate(date).getTime()
//       );
//       setEnableHourSlots(updatedEnableHourSlots);
//     }
//   }
// };

const handleStudentClickInWeekOrDayTab = (
  slotInfo,
  activeView,
  enabledDays,
  clickedDate,
  disableDates,
  disableHourSlots,
  enableHourSlots,
  reservedSlots,
  disableWeekDays,
  disabledHours,
  selectedSlots,
  selectedTutor,
  setIsModalOpen,
  setSelectedSlots
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

    //student general
    const existInReservedSlots = reservedSlots?.some(
      (dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime()
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
      if (!existInReservedSlots) {
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
      `Cannot ${
        !isStudentLoggedIn ? "Disable/Enable " : "Book/Reserve"
      } older slots.`
    );
  }

  return false;
};