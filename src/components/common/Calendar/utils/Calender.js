import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import useSlotPropGetter from "../hooks/useSlotPropGetter";
import EventModal from "./EventModal";
import TutorEventModal from "./TutorEventModal";
import Loading from "./Loading";

const CalendarComponent = ({
  disabledHours,
  enableHourSlots,
  disableHourSlots,
  reservedSlots,
  selectedSlots,
  weekDaysTimeSlots,
  disableColor,
  disableDates,
  isStudentLoggedIn,
  selectedTutor,
  timeDifference,
  timeZone,
  tutor,
  activeView,
  setActiveView,
  isModalOpen,
  onStudentModalRequestClose,
  student,
  setSelectedSlots,
  handleBulkEventCreate,
  bookedSlots,
  clickedSlot,
  setClickedSlot,
  handleRemoveReservedSlot,
  handleRescheduleSession,
  isTutorSideSessionModalOpen,
  onTutorModalRequestClose,
  handleDeleteSessionByTutor,
  handlePostpone,
  dataFetched,
  handleSetReservedSlots,
  handleEventClick,
  isStudentRoute,
  location,
  disableWeekDays,
  enabledDays,
  handleSlotDoubleClick
}) => {
  const slotPropGetter = useSlotPropGetter({
    disabledHours,
    enableHourSlots,
    disableHourSlots,
    reservedSlots,
    selectedSlots,
    weekDaysTimeSlots,
    disableColor,
    disableDates,
    isStudentLoggedIn,
    selectedTutor,
    timeDifference,
    timeZone,
    tutor
  });

  const dayPropGetter = useDayPropGetter({
    disableWeekDays,
    enabledDays,
    disableDates,
    disableColor,
    isStudentLoggedIn,
  });

  const eventPropGetter = (event) => {
    // Your event prop getter logic...
  };

  const handleViewChange = (view) => setActiveView(view);
  const handleNavigate = (date) => {
    // Your handle navigate logic...
  };

  //handle scroll
  useEffect(() => {
    setActiveTab(activeView === "week" ? "day" : activeView);
    const weekTab = document.querySelector(".rbc-time-content");
    if (weekTab) {
      const middle = weekTab.scrollHeight / 3.5;
      weekTab.scrollTop = middle;
    }
  }, [activeView, isStudentRoute]);

  useEffect(() => {
    if (isStudentRoute) setActiveView("week");
  }, [location, isStudentRoute]);

  const localizer = momentLocalizer(moment);
  if (!dataFetched) return <Loading height="60vh" />;

  return (
    <div
      style={{ height: "100%" }}
      className={`${isStudentLoggedIn ? "student-calender" : "tutor-calender"}`}
    >
      <Calendar
        views={["day", "week", "month"]}
        localizer={localizer}
        selectable={true}
        defaultView={activeView}
        events={updateDayEndSlotEndTime()?.map((event) => ({
          ...event,
          start: convertToGmt(convertToDate(event.start)),
          end: convertToGmt(convertToDate(event.end)),
        }))}
        eventPropGetter={eventPropGetter}
        components={{
          event: (event) => (
            <CustomEvent
              {...event}
              handleSetReservedSlots={handleSetReservedSlots}
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
              isStudentLoggedIn={isStudentLoggedIn}
            />
          ),
        }}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ minHeight: "100%", width: "100%" }}
        step={30}
        onSelectSlot={handleSlotDoubleClick}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        onView={handleViewChange}
        onNavigate={handleNavigate}
      />
      <EventModal
        isOpen={isModalOpen}
        onRequestClose={onStudentModalRequestClose}
        student={student}
        isStudentLoggedIn={isStudentLoggedIn}
        selectedSlots={selectedSlots}
        setSelectedSlots={setSelectedSlots}
        handleBulkEventCreate={handleBulkEventCreate}
        reservedSlots={reservedSlots}
        bookedSlots={bookedSlots}
        clickedSlot={clickedSlot}
        setClickedSlot={setClickedSlot}
        handleRemoveReservedSlot={handleRemoveReservedSlot}
        timeZone={timeZone}
        handleRescheduleSession={handleRescheduleSession}
      />
      <TutorEventModal
        isOpen={isTutorSideSessionModalOpen}
        onClose={onTutorModalRequestClose}
        handleDeleteSessionByTutor={handleDeleteSessionByTutor}
        clickedSlot={clickedSlot}
        handlePostpone={handlePostpone}
      />
    </div>
  );
};

export default CalendarComponent;
