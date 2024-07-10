// utils/slotUtils.js

import moment from "moment";

export const handleSlotDoubleClick = (
  slotInfo,
  reservedSlots,
  bookedSlots,
  convertToDate,
  toast,
  disableColor,
  isStudentLoggedIn,
  activeView,
  views,
  setEnableHourSlots,
  setEnabledDays,
  setDisableDateRange,
  setDisableDates,
  disableWeekDays
) => {
  console.log(slotInfo);
  const clickedDate = slotInfo.start;
  const dayName = moment(clickedDate).format("dddd");
  const formattedTime = moment(clickedDate).format("h:00 a");

  const secSlot = moment(convertToDate(slotInfo.start)).minutes() === 30;
  let endTime = secSlot
    ? moment(convertToDate(slotInfo.start)).subtract(30, "minutes").toDate()
    : slotInfo.end;

  // Check if the event already exists
  const isEventAlreadyExist = reservedSlots
    .concat(bookedSlots)
    ?.some((event) =>
      [event.start, event.end].some(
        (date) =>
          convertToDate(date).getTime() === clickedDate.getTime() ||
          date.getTime() === slotInfo.end.getTime()
      )
    );

  // Error handling and validations
  if (!isStudentLoggedIn && !disableColor) {
    return toast.warning("Please select a color before disabling slots!");
  }

  if (isEventAlreadyExist && slotInfo.action === "doubleClick") {
    toast.warning(
      "This time slot is already reserved. Please select from available slots."
    );
    return;
  }

  const clickedUpperSlot =
    moment(convertToDate(slotInfo.end)).diff(
      moment(convertToDate(slotInfo.start)),
      "days"
    ) === 1;

  if (clickedUpperSlot && activeView !== views.MONTH) return;

  if (
    clickedDate.getTime() < new Date().getTime() &&
    slotInfo.action === "doubleClick"
  ) {
    return toast.warning(
      `Cannot ${
        !isStudentLoggedIn ? "Disable/Enable " : "Book/Reserve "
      } older slots.`
    );
  }

  // Delegate further handling based on user type (student/tutor)
  if (!isStudentLoggedIn) {
    handleSlotDoubleClickForTutor(
      slotInfo,
      dayName,
      formattedTime,
      endTime,
      disableWeekDays,
      activeView,
      views,
      convertToDate,
      setEnableHourSlots
    );
  } else {
    handleSlotDoubleClickForStudent(
      slotInfo,
      dayName,
      formattedTime,
      activeView,
      views,
      convertToDate,
      setDisableDateRange,
      setDisableDates
    );
  }
};

export const handleSlotDoubleClickForTutor = (
  slotInfo,
  dayName,
  formattedTime,
  endTime,
  disableWeekDays,
  activeView,
  views,
  convertToDate,
  setEnableHourSlots,

  setEnabledDays
) => {
  if (disableWeekDays && disableWeekDays.includes(dayName)) {
    handleDisableWeekday(
      slotInfo,
      endTime,
      activeView,
      views,
      convertToDate,
      setEnableHourSlots
    );
  } else {
    handleDisableDate(slotInfo, convertToDate, setEnabledDays);
  }
};

export const handleSlotDoubleClickForStudent = (
  slotInfo,
  dayName,
  formattedTime,
  activeView,
  views,
  convertToDate,
  setDisableDateRange,
  setDisableDates,

  setDisableHourSlots,
  setEnableHourSlots
) => {
  if (activeView === views.MONTH) {
    handleSlotMonthView(
      slotInfo,
      convertToDate,
      setDisableDateRange,
      setDisableDates
    );
  } else {
    handleSlotWeekDayView(
      slotInfo,
      dayName,
      formattedTime,
      convertToDate,
      setDisableHourSlots,
      setEnableHourSlots
    );
  }
};

// Handling slot actions for tutor
const handleDisableWeekday = (
  slotInfo,
  endTime,
  activeView,
  views,
  convertToDate,
  setEnableHourSlots,

  enableHourSlots,
  setDisableDateRange,
  setDisableDates,
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
          date.getTime() !== endTime.getTime()
      );
      setEnableHourSlots(updatedEnableHourSlots);
    }
  } else {
    handleMonthViewDisable(
      slotInfo,
      convertToDate,
      setDisableDateRange,
      setDisableDates
    );
  }
};

const handleDisableDate = (slotInfo, 
    convertToDate,
    setEnabledDays,

    enabledDays
    ) => {
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
  convertToDate,
  setDisableDateRange,
  setDisableDates,

  disableDates
) => {
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
};

// Handling slot actions for student
const handleSlotMonthView = (
  slotInfo,
  convertToDate,
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
  dayName,
  formattedTime,
  convertToDate,
  setDisableHourSlots,
  setEnableHourSlots,

  disableHourSlots,
  disableDates
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
    handleDisableHourSlots(slotInfo, convertToDate, setDisableHourSlots);
  } else {
    handleEnableHourSlots(
      slotInfo,
      formattedTime,
      convertToDate,
      setEnableHourSlots
    );
  }
};

const handleDisableHourSlots = (
  slotInfo,
  convertToDate,
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
  formattedTime,
  convertToDate,
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
