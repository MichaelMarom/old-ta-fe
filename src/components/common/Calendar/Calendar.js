import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import EventModal from "../EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_calender_detals,
  getAllTutorLessons,
  updateTutorDisableslots,
} from "../../../axios/tutor";
import { get_student_lesson } from "../../../axios/calender";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomEvent from "./Event";
import Loading from "../Loading";
import { setLessons } from "../../../redux/student/studentBookings";
import { useLocation, useNavigate } from "react-router-dom";

import "../../../styles/common.css";
import useDebouncedEffect from "../../../hooks/DebouceWithDeps";
import { TutorEventModal } from "../EventModal/TutorEventModal/TutorEventModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { convertToGmt } from "./utils/calenderUtils";
import useEventPropGetter from "./hooks/useEventPropGetter";
import {
  handleBulkEventCreate,
  handleDeleteSessionByTutor,
  handlePostpone,
} from "./utils/actions";
import { handleSlotDoubleClick } from "./utils/SlotDoubleClick";
import useDayPropGetter from "./hooks/useDayPropGetter";
import useSlotPropGetter from "./hooks/useSlotPropGetter";

export const views = {
  WEEK: "week",
  DAY: "day",
  MONTH: "month",
};

export const convertToDate = (date) =>
  date instanceof Date ? date : new Date(date);

const ShowCalendar = ({
  setIsModalOpen = () => {}, //FOR STUDENT
  isModalOpen = false, //FOR STUDENT
  timeDifference = null, //FOR STUDENT
  setActiveTab = () => {}, //FOR Tutor
  setDisableColor = () => {}, //FOR Tutor
  disableColor = "", //FOR Tutor
  activeTab,
  disableWeekDays,
  disabledHours,
  setDisabledWeekDays,
  setDisabledHours,
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(views.MONTH);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const location = useLocation();

  // Extract student information from the URL
  const isStudentRoute = location.pathname.split("/")[1] === "student";
  const isStudentLoggedIn =
    user.role === "student"
      ? true
      : user.role === "admin" && isStudentRoute
      ? true
      : false;
  const [timeZone, setTimeZone] = useState();

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);
  const { tutor } = useSelector((state) => state.tutor);
  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [disableDateRange, setDisableDateRange] = useState([]);
  const [isTutorSideSessionModalOpen, setIsTutorSideSessionModalOpen] =
    useState(false);

  const tutorAcademyId = localStorage.getItem("tutor_user_id");

  //student states
  const [selectedSlots, setSelectedSlots] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSlot, setClickedSlot] = useState({});
  const { student } = useSelector((state) => state.student);
  const tutorId = selectedTutor.academyId;
  const studentId = student?.AcademyId;
  const subjectName = selectedTutor?.subject;
  const [weekDaysTimeSlots, setWeekDaysTimeSlots] = useState([]);

  let { reservedSlots, bookedSlots, lessons } = useSelector(
    (state) => state.bookings
  );

  //apis functions
  const updateTutorDisableRecord = async () => {
    await updateTutorDisableslots(tutorAcademyId, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours,
      disableColor: disableColor || null,
    });
  };

  const getTimeZonedDisableHoursRange = (initialArray) => {
    if (!isStudentLoggedIn) return initialArray;

    function addHours(timeString, hours) {
      let time = moment("2000-01-01 " + timeString, "YYYY-MM-DD h:mm a");
      time.add(hours, "hours");
      let formattedTime = time.format("h:mm a");
      return formattedTime;
    }
    function addHoursToSubArray(subArray) {
      let newArray = subArray.slice();
      newArray[0] = addHours(newArray[0], timeDifference * 1);
      newArray[1] = addHours(newArray[1], timeDifference * 1);
      return newArray;
    }

    let updatedArray = initialArray?.map(addHoursToSubArray);
    return updatedArray;
  };

  const getTimeZonedEnableHours = (originalDates, timeZone) => {
    if (!isStudentLoggedIn || !timeZone) return originalDates;
    return originalDates?.map((dateString) => {
      // const date = moment.utc(convertToDate(dateString)).tz(timeZone);
      // const dateObjDate = date.toDate()
      return dateString; // You can customize the format
    });
  };

  const getTutorSetup = async () => {
    const response = await fetch_calender_detals(
      isStudentLoggedIn ? selectedTutor.academyId : tutorAcademyId
    );
    if (Array.isArray(response) && response.length > 0) {
      const [result] = response;
      if (Object.keys(result ? result : {}).length) {
        const updatedEnableHours = getTimeZonedEnableHours(
          JSON.parse(
            result.enableHourSlots === "undefined"
              ? "[]"
              : result.enableHourSlots
          ),
          timeZone
        );
        setEnableHourSlots(updatedEnableHours); //done

        setDisableDates(JSON.parse(result.disableDates)); //done
        setEnabledDays(JSON.parse(result.enabledDays)); //done almost
        setDisabledWeekDays(JSON.parse(result.disableWeekDays));

        setDisableHourSlots(JSON.parse(result.disableHourSlots)); //done

        let updatedDisableHoursRange = getTimeZonedDisableHoursRange(
          JSON.parse(result.disableHoursRange)
        );
        setDisabledHours(updatedDisableHoursRange); //done
        setDisableColor(result.disableColor);
      }
      setDataFetched(true);
    } else {
      console.error("Unexpected API response format or empty response");
    }
  };

  const fetchBookings = async () => {
    if (isStudentLoggedIn) {
      const response = await get_student_lesson(
        student.AcademyId,
        selectedTutor.academyId
      );

      console.log(response);
      if (!!response && !response?.response?.data) {
        dispatch(setLessons(response));
      }
    } else {
      const response = await getAllTutorLessons(tutorAcademyId);
      if (!!response?.length) {
        dispatch(setLessons(response));
      }
    }
  };

  //getting array of disableqweekdays timeslot per week
  useEffect(() => {
    if (timeZone) {
      const timeDifference = { value: 30, unit: "minutes" };
      const currentTime = moment();

      const timeSlots = [];

      (disableWeekDays ?? []).forEach((weekday) => {
        const nextWeekday = currentTime.clone().day(weekday).startOf("day");

        const endOfDay = nextWeekday.clone().endOf("day");

        let currentSlotTime = nextWeekday.clone();
        while (currentSlotTime.isBefore(endOfDay)) {
          timeSlots.push(currentSlotTime.utc().toDate());
          currentSlotTime.add(timeDifference.value, timeDifference.unit);
        }
      });
      setWeekDaysTimeSlots(timeSlots);
    }
  }, [timeZone, disableWeekDays]);

  useEffect(() => {
    if (student?.GMT && isStudentLoggedIn) {
      const offset = parseInt(student.GMT, 10);
      const timezone = moment.tz
        .names()
        .filter((name) => moment.tz(name).utcOffset() === offset * 60);
      setTimeZone(timezone[0] || null);
    } else {
      if (tutor.GMT && !isStudentLoggedIn) {
        const offset = parseInt(tutor.GMT, 10);
        const timezone = moment.tz
          .names()
          .filter((name) => moment.tz(name).utcOffset() === offset * 60);
        setTimeZone(timezone[0] || null);
      }
    }
  }, [student, tutor, isStudentLoggedIn]);

  //setting default timeZone
  useEffect(() => {
    moment.tz.setDefault(timeZone);
  }, [timeZone]);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTutor, user]);

  const onStudentModalRequestClose = () => {
    setSelectedSlots([]);
    setClickedSlot({});
    setIsModalOpen(false);
  };

  const onTutorModalRequestClose = () => {
    setIsTutorSideSessionModalOpen(false);
  };

  useEffect(() => {
    timeZone && getTutorSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);

  useEffect(() => {
    activeTab === views.MONTH
      ? setActiveView(views.MONTH)
      : setActiveView(views.WEEK);
  }, [activeTab]);

  useDebouncedEffect(
    () => {
      if (dataFetched && !isStudentLoggedIn) {
        updateTutorDisableRecord();
      }
    },
    2000,
    [
      disableDates,
      disableHourSlots,
      enableHourSlots,
      disableWeekDays,
      dataFetched,
      disableColor,
      disabledHours,
    ]
  );

  const handleEventClick = (event) => {
    const ownSession =
      !isStudentLoggedIn || event.studentId === student?.AcademyId;
    if (!ownSession) {
      toast.warning(
        "We are sorry. You cannot see details of another student session"
      );
      return;
    }
    setClickedSlot(event);
    const pastEvent =
      convertToDate(convertToDate(event.end)).getTime() < new Date().getTime();
    if (isStudentLoggedIn && !pastEvent) {
      setIsModalOpen(true);
      setIsTutorSideSessionModalOpen(false);
    } else {
      setIsModalOpen(false);
      setIsTutorSideSessionModalOpen(true);
    }
  };

  const handleViewChange = (view) => setActiveView(view);
  const handleNavigate = (date) => {
    if (timeZone) {
      const timeDifference = { value: 30, unit: "minutes" };
      const currentTime = moment(date);

      const timeSlots = [];

      (disableWeekDays ?? []).forEach((weekday) => {
        // Find the start of the next occurrence of the specified weekday
        const nextWeekday = currentTime.clone().day(weekday).startOf("day");

        // Find the end of the next occurrence of the specified weekday
        const endOfDay = nextWeekday.clone().endOf("day");

        let currentSlotTime = nextWeekday.clone();
        while (currentSlotTime.isBefore(endOfDay)) {
          timeSlots.push(currentSlotTime.utc().toDate());
          currentSlotTime.add(timeDifference.value, timeDifference.unit);
        }
      });
      setWeekDaysTimeSlots(timeSlots);
    }
  };

  //handle scroll
  useEffect(() => {
    setActiveTab(activeView === "week" ? "day" : activeView);
    const weekTab = document.querySelector(".rbc-time-content");
    if (weekTab) {
      const middle = weekTab.scrollHeight / 3.5;
      weekTab.scrollTop = middle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, isStudentRoute]);

  useEffect(() => {
    if (isStudentRoute) setActiveView("week");
  }, [location, isStudentRoute]);

  //update day end slot to 11:59PM --> 12:PM end time does not show events
  function updateDayEndSlotEndTime() {
    const updatedEvents = lessons.map((event) => {
      if (
        moment(convertToDate(event.start)).hours() === 23 &&
        moment(convertToDate(event.start)).minutes() === 0
      ) {
        return {
          ...event,
          end: moment(convertToDate(event.start)).set({
            hours: 23,
            minutes: 59,
          }),
        };
      }
      return event;
    });

    return updatedEvents;
  }

  const eventPropGetter = useEventPropGetter({
    reservedSlots,
    bookedSlots,
    isStudentLoggedIn,
    selectedTutor,
    student,
    lessons,
  });

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
    reservedSlots,
    selectedSlots,
    selectedTutor,
    weekDaysTimeSlots,
    tutor,
    lessons,
  });

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
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
              isStudentLoggedIn={isStudentLoggedIn}
              clickedSlot={clickedSlot}
              selectedTutor={selectedTutor}
              lessons={lessons}
            />
          ),
        }}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ minHeight: "100%", width: "100%" }}
        step={30}
        onSelectSlot={(slotInfo) =>
          handleSlotDoubleClick(
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
          )
        }
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        onView={handleViewChange}
        onNavigate={handleNavigate}
      />
      <EventModal
        isOpen={isModalOpen}
        lessons={lessons}
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
        timeZone={timeZone}
        studentId={studentId}
        subjectName={subjectName}
        tutorId={tutorId}
      />
      <TutorEventModal
        isOpen={isTutorSideSessionModalOpen}
        onClose={onTutorModalRequestClose}
        handleDeleteSessionByTutor={() =>
          handleDeleteSessionByTutor(
            setIsTutorSideSessionModalOpen,
            dispatch,
            clickedSlot,
            navigate
          )
        }
        clickedSlot={clickedSlot}
        handlePostpone={() =>
          handlePostpone(
            setIsTutorSideSessionModalOpen,
            dispatch,
            clickedSlot,
            setDisableHourSlots,
            disableHourSlots,
            navigate
          )
        }
      />
    </div>
  );
};
export default ShowCalendar;
