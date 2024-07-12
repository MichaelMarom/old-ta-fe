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
  disableDates
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
      disableDates
    );
  } else {
    handleSlotDoubleClickForStudent(
      slotInfo,
      activeView,

      setDisableDateRange,
      setDisableDates,

      setDisableHourSlots,
      setEnableHourSlots,
      enableHourSlots,
      disableHourSlots,
      disableDates,
      reservedSlots
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

  disableDates
) => {
  const dayName = moment(slotInfo.start).format("dddd");
  console.log(disableWeekDays, disableWeekDays.includes(dayName));
  if (disableWeekDays && disableWeekDays.includes(dayName)) {
    handleDisableWeekday(
      slotInfo,
      endTime,
      activeView,

      setEnableHourSlots,
      enableHourSlots,
      setDisableDates,
      disableDates
    );
  } else {
    handleDisableDate(slotInfo, setEnabledDays, enabledDays);
  }
};

export const handleSlotDoubleClickForStudent = (
  slotInfo,
  activeView,

  setDisableDateRange,
  setDisableDates,

  setDisableHourSlots,
  setEnableHourSlots,
  enableHourSlots,
  disableHourSlots,
  disableDates,
  reservedSlots
) => {
  if (activeView === views.MONTH) {
    handleSlotMonthView(slotInfo, setDisableDateRange, setDisableDates);
  } else {
    handleSlotWeekDayView(
      slotInfo,
      setDisableHourSlots,
      setEnableHourSlots,

      disableHourSlots,
      disableDates,
      enableHourSlots,
      reservedSlots
    );
  }
};

// Handling slot actions for tutor
const handleDisableWeekday = (
  slotInfo,
  endTime,
  activeView,

  setEnableHourSlots,

  enableHourSlots,
  setDisableDates,
  disableDates
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
    handleMonthViewDisable(slotInfo, setDisableDates, disableDates);
  }
};

const handleDisableDate = (
  slotInfo,
  setEnabledDays,

  enabledDays
) => {
  const slotStart = convertToDate(slotInfo.start);
  const existingEnabledDayIndex = enabledDays.findIndex(
    (date) => convertToDate(date).getTime() === slotStart.getTime()
  );
  console.log(enabledDays, existingEnabledDayIndex)

  if (existingEnabledDayIndex === -1) {
    setEnabledDays([...enabledDays, slotStart]);
  } else {
    
    const updatedEnabledDays = enabledDays.filter(
      (date) => convertToDate(date).getTime() !== slotStart.getTime()
      );
      console.log(enabledDays, updatedEnabledDays)
    setEnabledDays(updatedEnabledDays);
  }
};

const handleMonthViewDisable = (
  slotInfo,
  setDisableDates,

  disableDates
) => {
  const existingDisableDateIndex = disableDates.findIndex(
    (date) => convertToDate(date).getTime() === slotInfo.start.getTime()
    );
    
    console.log(disableDates,existingDisableDateIndex)
  if (existingDisableDateIndex === -1) {
    setDisableDates([...disableDates, slotInfo.start]);
  } else {
    const updatedDisableDates = disableDates.filter(
      (date) => convertToDate(date).getTime() !== slotInfo.start.getTime()
    );
    console.log(disableDates,updatedDisableDates)
    setDisableDates(updatedDisableDates);
  }
};

// Handling slot actions for student
const handleSlotMonthView = (
  slotInfo,
  setDisableDateRange,
  setDisableDates,

  disableDates,
  disableDateRange,
  reservedSlots
) => {
  const existingDisableDateIndex = disableDates.findIndex(
    (date) => convertToDate(date).getTime() === slotInfo.start.getTime()
  );
  const reservedSlotPresentInClickedDate = reservedSlots?.some(
    (slot) =>
      moment(convertToDate(slot.start)).date() === moment(slotInfo.start).date()
  );

  const existingDisableDateRange = disableDateRange?.some(
    (date) => date.start.getTime() === slotInfo.start.getTime()
  );

  if (!existingDisableDateRange && !reservedSlotPresentInClickedDate) {
    setDisableDateRange([
      ...(disableDateRange ?? []),
      { start: slotInfo.start, end: slotInfo.end },
    ]);
  } else {
    const updatedDisableDateRange = disableDateRange.filter(
      (date) => convertToDate(date.start).getTime() !== slotInfo.start.getTime()
    );
    setDisableDateRange(updatedDisableDateRange);
  }

  if (!existingDisableDateIndex && !reservedSlotPresentInClickedDate) {
    setDisableDates([...(disableDates ?? []), slotInfo.start]);
  } else {
    const updatedDisableDates = disableDates.filter(
      (date) => convertToDate(date).getTime() !== slotInfo.start.getTime()
    );
    setDisableDates(updatedDisableDates);
  }
};

const handleSlotWeekDayView = (
  slotInfo,
  setDisableHourSlots,
  setEnableHourSlots,

  disableHourSlots,
  disableDates,
  enableHourSlots,
  reservedSlots
) => {
  const existInDisabledDate = disableDates?.some((storeDate) => {
    const slotDateMoment = moment(convertToDate(slotInfo.start));
    const storedMomentDate = moment(storeDate);
    return storedMomentDate.isSame(slotDateMoment, "day");
  });

  const existInDisableHourSlots = disableHourSlots?.some(
    (dateTime) =>
      convertToDate(dateTime).getTime() === slotInfo.start.getTime() ||
      slotInfo.end.getTime() === convertToDate(dateTime).getTime()
  );

  if (existInDisableHourSlots || existInDisabledDate) {
    handleDisableHourSlots(slotInfo, setDisableHourSlots);
  } else {
    handleEnableHourSlots(
      slotInfo,
      setEnableHourSlots,
      disableHourSlots,
      enableHourSlots,
      reservedSlots
    );
  }
};

const handleDisableHourSlots = (
  slotInfo,
  setDisableHourSlots,

  disableHourSlots,
  reservedSlots
) => {
  const slotStart = convertToDate(slotInfo.start);
  const reservedSlotsHaveClickedSlot = reservedSlots?.some(
    (slot) => slot.start.getTime() === slotStart.startOf("hour").valueOf()
  );

  if (!reservedSlotsHaveClickedSlot) {
    const existingDisableHourSlots = disableHourSlots?.some(
      (date) =>
        convertToDate(date).getTime() === slotInfo.start.getTime() ||
        slotInfo.end.getTime() === convertToDate(date).getTime()
    );

    if (!existingDisableHourSlots) {
      setDisableHourSlots([
        ...(disableHourSlots ?? []),
        slotInfo.start,
        slotInfo.end,
      ]);
    } else {
      const updatedDisableHourSlots = disableHourSlots.filter(
        (date) =>
          convertToDate(date).getTime() !== slotInfo.start.getTime() &&
          slotInfo.end.getTime() !== convertToDate(date).getTime()
      );
      setDisableHourSlots(updatedDisableHourSlots);
    }
  }
};

const handleEnableHourSlots = (
  slotInfo,
  setEnableHourSlots,
  disableHourSlots,
  enableHourSlots,
  reservedSlots
) => {
  const reservedSlotsHaveClickedSlot = reservedSlots?.some(
    (slot) => slot.start.getTime() === slotInfo.start.getTime()
  );

  if (!reservedSlotsHaveClickedSlot) {
    if (
      !disableHourSlots?.some(
        (date) =>
          convertToDate(date).getTime() === slotInfo.start.getTime() ||
          slotInfo.end.getTime() === convertToDate(date).getTime()
      )
    ) {
      setEnableHourSlots([
        ...(enableHourSlots ?? []),
        slotInfo.start,
        slotInfo.end,
      ]);
    } else {
      const updatedEnableHourSlots = enableHourSlots.filter(
        (date) =>
          convertToDate(date).getTime() !== slotInfo.start.getTime() &&
          slotInfo.end.getTime() !== convertToDate(date).getTime()
      );
      setEnableHourSlots(updatedEnableHourSlots);
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
