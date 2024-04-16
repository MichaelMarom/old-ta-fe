import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import EventModal from "../EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsBookings, get_tutor_setup, updateTutorDisableslots } from "../../../axios/tutor";
import { get_student_tutor_events } from "../../../axios/student";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import CustomEvent from "./Event";
import Loading from '../Loading'
import { postStudentBookings, setBookedSlots, setReservedSlots } from "../../../redux/student_store/studentBookings";
import { isEqualTwoObjectsRoot } from "../../../helperFunctions/generalHelperFunctions";
import { useLocation, useNavigate } from 'react-router-dom';

import '../../../styles/common.css';
import useDebouncedEffect from "../../../hooks/DebouceWithDeps";
import { TutorEventModal } from "../EventModal/TutorEventModal/TutorEventModal";
import { setStudentSessions } from "../../../redux/student_store/studentSessions";
import { FeedbackMissing } from "./ToastMessages";

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}

export const convertToDate = (date) => (date instanceof Date) ? date : new Date(date)

const ShowCalendar = ({
  setIsModalOpen = () => { }, //FOR STUDENT
  isModalOpen = false,  //FOR STUDENT
  timeDifference = null,  //FOR STUDENT
  setActiveTab = () => { },   //FOR Tutor
  setDisableColor = () => { },  //FOR Tutor
  disableColor = '',  //FOR Tutor
  activeTab,
  disableWeekDays,
  disabledHours,
  setDisabledWeekDays,
  setDisabledHours
}) => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState(views.MONTH);
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);
  const { selectedTutor } = useSelector(state => state.selectedTutor)
  const location = useLocation();

  // Extract student information from the URL
  const isStudentRoute = (location.pathname.split('/'))[1] === 'student';
  const isStudentLoggedIn = user.role === 'student' ? true : user.role === 'admin' && isStudentRoute ? true : false;
  const [timeZone, setTimeZone] = useState();

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);
  const { tutor } = useSelector(state => state.tutor)
  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [disableDateRange, setDisableDateRange] = useState([]);
  const [isTutorSideSessionModalOpen, setIsTutorSideSessionModalOpen] = useState(false);

  const tutorAcademyId = localStorage.getItem('tutor_user_id')

  //student states
  const [selectedSlots, setSelectedSlots] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSlot, setClickedSlot] = useState({})
  const { student } = useSelector(state => state.student)
  const tutorId = selectedTutor.academyId;
  const studentId = student?.AcademyId
  const subjectName = selectedTutor?.subject;
  const [weekDaysTimeSlots, setWeekDaysTimeSlots] = useState([])

  let { reservedSlots, bookedSlots } = useSelector(state => state.bookings);

  //apis functions
  const updateTutorDisableRecord = async () => {
    await updateTutorDisableslots(tutorAcademyId, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours,
      disableColor: disableColor || null
    })
  }

  const getTimeZonedDisableHoursRange = (initialArray) => {
    if (!isStudentLoggedIn) return initialArray;

    function addHours(timeString, hours) {
      let time = moment("2000-01-01 " + timeString, "YYYY-MM-DD h:mm a");
      time.add(hours, 'hours');
      let formattedTime = time.format("h:mm a");
      return formattedTime;
    }
    function addHoursToSubArray(subArray) {
      let newArray = subArray.slice();
      newArray[0] = addHours(newArray[0], (timeDifference * 1));
      newArray[1] = addHours(newArray[1], (timeDifference * 1));
      return newArray;
    }

    let updatedArray = initialArray?.map(addHoursToSubArray);
    return updatedArray
  }

  const getTimeZonedEnableHours = (originalDates, timeZone) => {
    if (!isStudentLoggedIn || !timeZone) return originalDates;
    return originalDates?.map(dateString => {
      // const date = moment.utc(convertToDate(dateString)).tz(timeZone);
      // const dateObjDate = date.toDate()
      return dateString; // You can customize the format
    });
  }

  const getTutorSetup = async () => {
    const [result = []] = await get_tutor_setup({ AcademyId: isStudentLoggedIn ? selectedTutor.academyId : tutorAcademyId });
    if (Object.keys(result ? result : {}).length) {
      console.log(result)
      const updatedEnableHours = getTimeZonedEnableHours(JSON.parse(result.enableHourSlots === 'undefined' ? '[]' : result.enableHourSlots), timeZone)
      setEnableHourSlots(updatedEnableHours); //done

      setDisableDates(JSON.parse(result.disableDates)); //done
      setEnabledDays(JSON.parse(result.enabledDays)); //done almost
      setDisabledWeekDays(JSON.parse(result.disableWeekDays));

      setDisableHourSlots(JSON.parse(result.disableHourSlots)); //done

      console.log(updatedEnableHours?.[0], JSON.parse(result.enableHourSlots),
        JSON.parse(result.enabledDays),
        JSON.parse(result.disableDates),
        JSON.parse(result.disableHourSlots),
        JSON.parse(result.disableWeekDays))

      let updatedDisableHoursRange = getTimeZonedDisableHoursRange(JSON.parse(result.disableHoursRange))
      setDisabledHours(updatedDisableHoursRange);//done
      setDisableColor(result.disableColor)
    }
    setDataFetched(true);
  }

  const fetchBookings = async () => {
    if (isStudentLoggedIn) {
      const response = await get_student_tutor_events(student.AcademyId, selectedTutor.academyId);
      if (response.length) {
        const reservedSlots = response?.map(data => JSON.parse(data.reservedSlots)).flat()
        const bookedSlots = response?.map(data => JSON.parse(data.bookedSlots)).flat()

        dispatch(setReservedSlots(reservedSlots))
        dispatch(setBookedSlots(bookedSlots))
      }
    }
    else {
      const response = await fetchStudentsBookings(tutorAcademyId);
      if (!!response.length) {
        const reservedSlots = response?.map(data => JSON.parse(data.reservedSlots)).flat()
        const bookedSlots = response?.map(data => JSON.parse(data.bookedSlots)).flat()

        dispatch(setReservedSlots(reservedSlots))
        dispatch(setBookedSlots(bookedSlots))
      }
    }
  }

  //getting array of disableqweekdays timeslot per week
  useEffect(() => {
    if (timeZone) {
      const timeDifference = { value: 30, unit: 'minutes' };
      const currentTime = moment();

      const timeSlots = [];

      (disableWeekDays ?? []).forEach((weekday) => {
        const nextWeekday = currentTime.clone().day(weekday).startOf('day');

        const endOfDay = nextWeekday.clone().endOf('day');

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
      const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
      setTimeZone(timezone[0] || null);
    }
    else {
      if (tutor.GMT && !isStudentLoggedIn) {
        const offset = parseInt(tutor.GMT, 10);
        const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
        setTimeZone(timezone[0] || null);
      }
    }
  }, [student, tutor, isStudentLoggedIn])

  //setting default timeZone
  useEffect(() => {
    moment.tz.setDefault(timeZone);
  }, [timeZone]);

  useEffect(() => {
    fetchBookings();
    //remove student //changes made
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedTutor, user])

  const onStudentModalRequestClose = () => {
    setSelectedSlots([]);
    setClickedSlot({})
    setIsModalOpen(false)
  }

  const onTutorModalRequestClose = () => {
    setIsTutorSideSessionModalOpen(false)
  }

  //tutor request
  const handlePostpone = () => {
    setIsTutorSideSessionModalOpen(false);
    let { reservedSlots: updatedReservedSlot, bookedSlots: updatedBookedSlots } =
      filterOtherStudentAndTutorSession(reservedSlots, bookedSlots, tutor.AcademyId, clickedSlot.studentId);
    handleDisableSlot(clickedSlot.start)
    if (clickedSlot.type === 'booked') {
      dispatch(postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots.map(slot => slot.id === clickedSlot.id ?
          { ...slot, request: 'postpone' } :
          slot),
        reservedSlots: updatedReservedSlot
      }));
      return;
    }
    if (clickedSlot.type === 'intro' || clickedSlot.type === 'reserved') {
      dispatch(postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots,
        reservedSlots: updatedReservedSlot.map(slot => slot.id === clickedSlot.id ?
          { ...slot, request: 'postpone' } :
          slot)
      }));
    }
    navigate(`/tutor/chat`)
  }

  const handleDeleteSessionByTutor = () => {
    setIsTutorSideSessionModalOpen(false);
    let { reservedSlots: updatedReservedSlot, bookedSlots: updatedBookedSlots } =
      filterOtherStudentAndTutorSession(reservedSlots, bookedSlots, tutor.AcademyId, clickedSlot.studentId);
    if (clickedSlot.type === 'booked') {
      dispatch(postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots.map(slot => slot.id === clickedSlot.id ?
          { ...slot, request: 'delete' } :
          slot),
        reservedSlots: updatedReservedSlot
      }));
      return;
    }
    if (clickedSlot.type === 'intro' || clickedSlot.type === 'reserved') {
      dispatch(postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots,
        reservedSlots: updatedReservedSlot.map(slot => slot.id === clickedSlot.id ?
          { ...slot, request: 'delete' } :
          slot)
      }));
    }
    navigate(`/tutor/chat`)
  }

  const handleDisableSlot = (start) => {
    const end = moment(start).add(30, 'minutes').toDate();

    const disableHourSlotExist = disableHourSlots?.some(date => convertToDate(date).getTime() === convertToDate(start).getTime() ||
      convertToDate(end).getTime() === convertToDate(date).getTime())
    if (!disableHourSlotExist) {
      return setDisableHourSlots([...(disableHourSlots ?? []), convertToDate(start), convertToDate(end)])
    }
  }

  useEffect(() => {
    getTutorSetup()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [timeZone])

  useEffect(() => {
    (activeTab === views.MONTH) ? setActiveView(views.MONTH) : setActiveView(views.WEEK)
  }, [activeTab])

  useDebouncedEffect(() => {
    if (dataFetched && !isStudentLoggedIn) {
      updateTutorDisableRecord();
    }

  }, 2000, [disableDates, disableHourSlots, enableHourSlots, disableWeekDays, dataFetched, disableColor, disabledHours]);

  const convertToGmt = (date) => {
    return date;
  };

  const filterOtherStudentAndTutorSession = (
    givenReservedSlots = [],
    givenBookedSlots,
    tutorId = isStudentLoggedIn ? selectedTutor.academyId : tutor.AcademyId,
    studentId) => {
    let updatedReservedSlots = (givenReservedSlots.length ? givenReservedSlots : reservedSlots).filter(slot =>
      (slot.studentId === (studentId ? studentId : student.AcademyId) && slot.tutorId === tutorId));
    let updatedBookedSlots = (givenBookedSlots ? givenBookedSlots :
      bookedSlots).filter(slot => slot.studentId === (studentId ? studentId : student.AcademyId) && slot.tutorId === tutorId);
    console.log(updatedReservedSlots.length, updatedBookedSlots.length, tutorId, (studentId ? studentId : student.AcademyId))
    return { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots };
  }

  const handleBulkEventCreate = async (type, invoiceNum) => {
    if (reservedSlots?.some(slot => isEqualTwoObjectsRoot(slot, clickedSlot))) {
      let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession()
      dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots: [...bookedSlots, { ...clickedSlot, title: "Booked", type: 'booked' }], reservedSlots: reservedSlots.filter(slot => slot.id !== clickedSlot.id) }));
      return
    }
    //intro session not conducted
    if (reservedSlots?.some(slot => {
      return slot.type === 'intro'
        && slot.subject === selectedTutor.subject
        && slot.studentId === student.AcademyId
        && (slot.end.getTime() > (new Date()).getTime())
    })) {
      toast.warning(`Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`)
      return;
    }
    //feedback missing
    if (reservedSlots?.some(slot => {
      return slot.type === 'intro'
        && slot.subject === selectedTutor.subject
        && slot.studentId === student.AcademyId
        && (slot.end.getTime() < (new Date()).getTime() &&
          (!slot.rating))
    })) {
      return toast.warning(<FeedbackMissing
        handleButtonClick={() => navigate('/student/feedback')}
        subject={selectedTutor.subject}
        buttonText={'Feedback'} />, { autoClose: false, });
    }

    //limit of max 6 lslot reservation at /bookingone time
    if ((selectedSlots.length && selectedSlots[0].type === 'reserved') && reservedSlots.length > 6) {
      toast.warning("You Can Reserve no more than 6 slots")
      return;
    }

    const updatedSelectedSlots = selectedSlots?.map((slot) => {
      return {
        ...slot,
        type,
        id: uuidv4(),
        title: type === 'reserved' ? 'Reserved' :
          type === 'intro' ? 'Intro' : "Booked",
        studentName: student.FirstName,
        studentId: student.AcademyId,
        createdAt: new Date(),
        subject: selectedTutor.subject,
        invoiceNum: invoiceNum,
        tutorId: selectedTutor.academyId,
        rate: (type === 'intro' && selectedTutor.introDiscountEnabled) ?
          `$${(parseInt(selectedTutor.rate.split('$')[1]) / 2)}.00` : selectedTutor.rate
      }
    })

    //handle delete type later todo
    if (type === 'reserved' || type === 'intro') {

      let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession()
      dispatch(postStudentBookings({ studentId: student.AcademyId, tutorId: selectedTutor.academyId, reservedSlots: reservedSlots.concat(updatedSelectedSlots), bookedSlots, subjectName: selectedTutor.subject }));
    }
    else if (type === 'booked') {

      let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession()
      dispatch(postStudentBookings({ studentId: student.AcademyId, tutorId: selectedTutor.academyId, reservedSlots, bookedSlots: bookedSlots.concat(updatedSelectedSlots), subjectName: selectedTutor.subject }));
    }
    student.AcademyId && dispatch(await setStudentSessions(student))
  }

  const handleRemoveReservedSlot = (reservedSlots) => {
    let { reservedSlots: updatedReservedSlots, bookedSlots } = filterOtherStudentAndTutorSession(reservedSlots)
    dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots, reservedSlots: updatedReservedSlots }));
  }

  const handleRescheduleSession = (reservedSlots, bookedSlots) => {
    let { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots } =
      filterOtherStudentAndTutorSession(reservedSlots, bookedSlots, tutor.AcademyId);

    console.log(updatedBookedSlots, updatedReservedSlots, tutor.AcademyId, selectedTutor.academyId)
    dispatch(postStudentBookings({
      studentId, tutorId: tutor.AcademyId, subjectName,
      bookedSlots: updatedBookedSlots, reservedSlots: updatedReservedSlots
    }));
  }

  const handleSetReservedSlots = (reservedSlots) => {
    let { reservedSlots: updatedReservedSlots, bookedSlots } = filterOtherStudentAndTutorSession(reservedSlots)
    dispatch(postStudentBookings({ studentId, tutorId: isStudentLoggedIn ? tutorId : tutor.AcademyId, subjectName, bookedSlots, reservedSlots: updatedReservedSlots }));
  }

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    const secSlot = moment(slotInfo.start).minutes() === 30;
    let endTime = secSlot ? moment(slotInfo.start).subtract(30, 'minutes').toDate() : slotInfo.end;
    //student
    const momentStartTime = moment(clickedDate);
    let startEventTime = momentStartTime.minute(0);
    let endEventTime = momentStartTime.clone().minute(0).add(1, 'hour')



    //some error handling
    let clickedUpperSlot = moment(slotInfo.end).diff(moment(slotInfo.start), 'days') === 1;
    const isEventAlreadyExist = (reservedSlots.concat(bookedSlots))?.some(event => (
      convertToDate(event.start).getTime() === clickedDate.getTime() || convertToDate(event.end).getTime() === slotInfo.end.getTime()));

    if (!isStudentRoute && !disableColor) { toast.warning("Please select color before disabling slots!"); return }
    if (isEventAlreadyExist && slotInfo.action === "doubleClick") { toast.warning("This time slot already reserved. Please select from white slots to continue!"); return }
    if (clickedUpperSlot && activeView !== views.MONTH) return;
    if (clickedDate.getTime() < (new Date()).getTime() && slotInfo.action === "doubleClick") {
      toast.warning(`Cannot ${!isStudentLoggedIn ? 'Disable/Enable ' : "Book/Reserve"} Older Slots`);
      return
    }

    // student and tutor side handling beside error handling
    if (slotInfo.action === "doubleClick") {
      if (!isStudentLoggedIn) {
        if (disableWeekDays && disableWeekDays?.includes(dayName)) {
          if (activeView !== views.MONTH) {
            if (!enableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
              setEnableHourSlots([...(enableHourSlots ?? []), slotInfo.start, endTime])
            }
            else {
              const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && convertToDate(date).getTime() !== endTime.getTime());
              setEnableHourSlots(removeEnableHourSlots)
            }
          }
          else {

            if (!enabledDays?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime()))
              setEnabledDays([...(enabledDays ?? []), slotInfo.start])
            else {
              const removeEnableDate = enabledDays.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setEnabledDays(removeEnableDate)
            }
          }
        }
        else {
          if (activeView === views.MONTH) {
            const existInDisableDates = disableDates?.some(date =>
              convertToDate(date).getTime() === slotInfo.start.getTime());
            const reservedSlotPresentInClickedDate = reservedSlots?.some(slot => moment(slot.start).date() === moment(clickedDate).date())

            //disbaleDateRange
            const existInDisableDateRange = disableDateRange?.some(date => date.start.getTime() === slotInfo.start.getTime())
            if (!existInDisableDateRange && !reservedSlotPresentInClickedDate)
              setDisableDateRange([...(disableDateRange ?? []), { start: slotInfo.start, end: slotInfo.end }])
            else {
              const removeDisableDateRange = disableDateRange.filter(date =>
                convertToDate(date.start).getTime() !== slotInfo.start.getTime());
              setDisableDateRange(removeDisableDateRange)
            }

            //disableDates
            if (!existInDisableDates && !reservedSlotPresentInClickedDate)
              setDisableDates([...(disableDates ?? []), slotInfo.start])
            else {
              const removeDisableDate = disableDates.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setDisableDates(removeDisableDate)
            }
          }
          else {
            const existInDisabledDate = disableDates?.some((storedDate) => {
              const slotDateMoment = moment(slotInfo.start);
              const storedMomentDate = moment(storedDate);
              return storedMomentDate.isSame(slotDateMoment, 'day')
            });
            if ((disabledHours &&
              disabledHours?.some((timeRange) => {
                const [start, end] = timeRange;
                return formattedTime >= start && formattedTime < end;
              })) || existInDisabledDate) {

              if (!enableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
                setEnableHourSlots([...(enableHourSlots ?? []), slotInfo.start, endTime])
              }
              else {
                const reservedSlotsHaveClickedSlot = reservedSlots?.some(slot => slot.start.getTime() === slotInfo.start.getTime())
                if (!reservedSlotsHaveClickedSlot) {
                  const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime()
                    && endTime.getTime() !== convertToDate(date).getTime());
                  setEnableHourSlots(removeEnableHourSlots)
                }
              }

              if (disableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() ||
                endTime.getTime() === convertToDate(date).getTime())) {
                const removeDisableHourSlots = disableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() &&
                  endTime.getTime() !== convertToDate(date).getTime()
                )
                setDisableHourSlots(removeDisableHourSlots)
              }
              else {
                setDisableHourSlots([...(disableHourSlots ?? []), slotInfo.start, endTime])
              }
            }
            else if (!existInDisabledDate) {
              const reservedSlotsHaveClickedSlot = reservedSlots?.some(slot =>
                slot.start.getTime() === moment(slotInfo.start).startOf('hour').valueOf())
              if (!disableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() ||
                endTime.getTime() === convertToDate(date).getTime())) {
                if (!reservedSlotsHaveClickedSlot) {
                  setDisableHourSlots([...(disableHourSlots ?? []), slotInfo.start, endTime])
                }
              }
              else {
                const removeDisableHourSlots = disableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
                )
                setDisableHourSlots(removeDisableHourSlots)
              }
            }
          }
        }
      } else if (isStudentLoggedIn) {
        if (activeView !== views.MONTH) {
          //slots/month
          const existsinEnabledInMonth = enabledDays?.some((arrayDate) => convertToDate(arrayDate).getTime() === clickedDate.getTime());
          const existsinEnabledInWeek = enabledDays?.some((arrayDate) => {
            const slotDateMoment = moment(clickedDate);
            const arrayMomentDate = moment(arrayDate);
            return arrayMomentDate.isSame(slotDateMoment, 'day')
          });

          const isDisableDate = disableDates?.some(storeDate => {
            const slotDateMoment = moment(clickedDate);
            const storedMomentDate = moment(storeDate);
            return storedMomentDate.isSame(slotDateMoment, 'day')
          })
          //slots week/days
          const existInDisableHourSlots = disableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime());
          const existInEnableSlots = enableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime())

          //student general
          const existInReservedSlots = reservedSlots?.some(dateTime => convertToDate(dateTime).getTime() === clickedDate.getTime())
          if ((!existInEnableSlots && disableWeekDays?.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek) || isDisableDate) {
            alert("This slot is blocked, please select a white slot.");
          }
          else if (existInDisableHourSlots || (!existInEnableSlots && disabledHours?.some((timeRange) => {
            const [start] = timeRange;
            return formattedTime === start;
          }))) {
            alert("This slot is blocked, please select a white slot.");
          }
          else {
            if (!existInReservedSlots) {
              if (selectedSlots.length < 6) {
                setSelectedSlots([...selectedSlots, { start: startEventTime.toDate(), end: endEventTime.toDate(), subject: selectedTutor.subject }])
                setIsModalOpen(true);
              }
              else {
                toast.error('You can not Place Hold more than 6 Slots! ')
              }
            }
          }
        }
      }

      return;
    }
  };

  const handleEventClick = (event) => {
    const ownSession = !isStudentLoggedIn || event.studentId === student?.AcademyId;
    if (!ownSession) {
      toast.warning('We are sorry. You cannot see details of another student session')
      return
    }
    setClickedSlot(event)
    const pastEvent = convertToDate(event.end).getTime() < (new Date()).getTime();
    if (isStudentLoggedIn && !pastEvent) {
      setIsModalOpen(true);
      setIsTutorSideSessionModalOpen(false);
    } else {
      setIsModalOpen(false);
      setIsTutorSideSessionModalOpen(true);
    }
  };

  const slotPropGetter = useCallback((date) => {
    if (date && moment(date).isSame(moment(date), 'day')) {
      const formattedTime = moment(date).format('h:00 a');
      const isFutureDate = date.getTime() >= (new Date()).getTime();

      const checkDate = moment.utc(date);
      const startDate = moment.utc((isStudentLoggedIn ? selectedTutor.StartVacation : tutor.StartVacation)).utc()
      const endDate = moment.utc((isStudentLoggedIn ? selectedTutor.EndVacation : tutor.EndVacation)).utc()

      const existBetweenVacationRange = (isStudentLoggedIn ? selectedTutor.VacationMode : tutor.VacationMode) && checkDate.isBetween(startDate, endDate, null, '[]');

      //student checks
      const existInDisableWeekTimeSlots = weekDaysTimeSlots?.some(slot => {
        const dateMoment = moment(date).tz(timeZone)
        const slotTimeZoneMoment = isStudentLoggedIn ?
          moment(slot).clone().add(timeDifference, 'hours') : moment(slot);

        return (slotTimeZoneMoment).isSame(dateMoment)
      })
      const existsinReservedSlots = reservedSlots?.some(slot => {
        return convertToDate(slot.start).getTime() === date.getTime()
      })
      const existInSelectedSlotStart = selectedSlots?.some(slot => slot.start.getTime() === date.getTime())

      const existInSelectedSlotEnd = selectedSlots?.some((slot) =>
        date.getTime() === (moment(slot.end).subtract(30, 'minutes').toDate()).getTime())
      // tutor checks
      const existInEnableSlots = enableHourSlots?.some((dateTime) => {
        const slotUTCTime = moment.utc(date);
        const enabledSlotUTCTime = moment(convertToDate(dateTime));
        if (moment.utc(date).isSame(moment(convertToDate(dateTime))))
          return slotUTCTime.isSame(enabledSlotUTCTime)
        return false
      })
      const twentyFourHoursAgo = moment(date).subtract(24, 'hours');
      const existInDisableDates = disableDates?.some(slot => moment(slot).isBetween(twentyFourHoursAgo, moment(date)))
      const existInDisableHourSlots = disableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime());
      const existInDefaultHours = disabledHours?.some(slot => {
        const startTime = moment('9:00 PM', 'h:mm A');
        const endTime = moment('7:00 AM', 'h:mm A');

        const momentTime = moment(formattedTime, 'h:mm A');

        if (endTime.isBefore(startTime)) {
          return slot[0] === formattedTime && (momentTime.isBetween(startTime, moment('11:59 PM', 'h:mm A'), undefined, '[]') ||
            momentTime.isBetween(moment('12:00 AM', 'h:mm A'), endTime, undefined, '[]'));
        }

        return slot[0] === formattedTime && momentTime.isBetween(startTime, endTime, undefined, '[]');
      })

      //swithes checks
      if (existsinReservedSlots) {
        return {
          className: 'reserved-slot'
        }
      }
      else if (existInSelectedSlotStart) {
        return {
          className: 'place-holder-start-slot',
        };
      }
      else if (existInSelectedSlotEnd) {
        return {
          className: "place-holder-end-slot"
        }
      }
      else if (existBetweenVacationRange) {
        return {
          style: {
            backgroundColor: "rgb(226,244,227)"
          }
        }
      }
      else if (existInDisableHourSlots || (isStudentLoggedIn && existInDisableWeekTimeSlots && isFutureDate)) {
        return {
          style: {
            backgroundColor: disableColor || 'red'
          },
          className: 'disable-slot',
        }
      }
      else if (isFutureDate && disabledHours && disabledHours?.some((timeRange) => {
        const [start] = timeRange;
        return formattedTime === start;
      }) && !existInEnableSlots && !existInDisableHourSlots) {
        return {
          style: {
            backgroundColor: existInDefaultHours ? "lightgray" : disableColor
          },
          className: 'disabled-slot',
          onClick: () => { window.alert('This slot is blocked, please select a white slot.'); }
        };
      }
      else if (existInEnableSlots) {
        return {
          // style: {
          //   backgroundColor: "orange",
          // },
          className: 'enable-slot',
        }
      }
      else if (existInDisableDates) {
        return {
          style: {
            backgroundColor: disableColor
          }
        }
      }

    }
    return {};
  }, [disabledHours, enableHourSlots, disableHourSlots,
    reservedSlots, selectedSlots, weekDaysTimeSlots,
    disableColor, disableDates, isStudentLoggedIn,
    selectedTutor, timeDifference, timeZone, tutor
  ]);

  const dayPropGetter = useCallback((date) => {
    const dayName = moment(date).format("dddd");
    const isFutureDate = date.getTime() >= (new Date()).getTime();


    const existsinEnabledInMonth = enabledDays?.some((arrayDate) => convertToDate(arrayDate).getTime() === date.getTime());
    const existsinEnabledInWeek = enabledDays?.some((arrayDate) => {
      const slotDateMoment = moment(date);
      const arrayMomentDate = moment(arrayDate);
      return arrayMomentDate.isSame(slotDateMoment, 'day')
    });

    const isDisableDate = disableDates?.some(storeDate => {
      const slotDateMoment = moment(date);
      const storedMomentDate = moment(storeDate);
      return storedMomentDate.isSame(slotDateMoment, 'day')
    })

    if ((isFutureDate &&
      (!isStudentLoggedIn && disableWeekDays && disableWeekDays?.includes(dayName))
      && !existsinEnabledInMonth && !existsinEnabledInWeek) || isDisableDate) {
      return {
        style: {
          backgroundColor: disableColor
        },
        className: "disabled-date",
        onClick: (e) => {
          e.preventDefault();
        },
      };
    }
    return {};
  },
    [disableWeekDays, enabledDays, disableDates, disableColor, isStudentLoggedIn]);

  const eventPropGetter = (event) => {
    const secSubject = reservedSlots?.some(slot => slot.type === 'intro'
      && event.subject !== selectedTutor.subject)
    const otherStudentSession = isStudentLoggedIn ? (reservedSlots.concat(bookedSlots))?.some(slot =>
      slot.studentName !== student.FirstName && event.id === slot.id
    ) : false
    const deletedSession = (reservedSlots.concat(bookedSlots))?.some(slot => slot.request === 'delete' && slot.start === event.start)


    if (deletedSession) return {
      style: {
        border: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: 'red',
        color: "white"
      },
    };
    if (otherStudentSession && (event.type === "intro" || event.type === "booked")) {
      return {
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'purple',
          color: "white"
        },
      };
    }
    if (otherStudentSession && event.type === "reserved") {
      return {
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#d9caf8',
          color: "black"
        },
      };
    }
    if (secSubject && event.type === 'intro') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightblue',
          color: "black"
        },
      };
    }
    if (secSubject && event.type === 'reserved') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightYellow',
          color: "black"
        },
      };
    }
    else if (secSubject && event.type === 'booked') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightGreen',
          color: "black"
        },
      };
    }
    else if (event.type === 'reserved') {
      return {
        className: 'reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'yellow',
          color: "black"
        },
      };
    } else if (event.type === 'booked') {
      return {
        className: 'booked-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'green',
        },
      };
    }
    return {};
  };

  const handleViewChange = (view) => setActiveView(view)
  const handleNavigate = (date) => {
    if (timeZone) {
      const timeDifference = { value: 30, unit: 'minutes' };
      const currentTime = moment(date);

      const timeSlots = [];

      (disableWeekDays ?? []).forEach((weekday) => {
        // Find the start of the next occurrence of the specified weekday
        const nextWeekday = currentTime.clone().day(weekday).startOf('day');

        // Find the end of the next occurrence of the specified weekday
        const endOfDay = nextWeekday.clone().endOf('day');

        let currentSlotTime = nextWeekday.clone();
        while (currentSlotTime.isBefore(endOfDay)) {
          timeSlots.push(currentSlotTime.utc().toDate());
          currentSlotTime.add(timeDifference.value, timeDifference.unit);
        }
      });
      setWeekDaysTimeSlots(timeSlots);
    }
  }

  //handle scroll
  useEffect(() => {
    setActiveTab(activeView === 'week' ? 'day' : activeView)
    const weekTab = document.querySelector('.rbc-time-content');
    if (weekTab) {
      const middle = weekTab.scrollHeight / 3.5;
      weekTab.scrollTop = middle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [activeView, isStudentRoute]);

  useEffect(() => {
    if (isStudentRoute) setActiveView('week')
  }, [location, isStudentRoute])

  //update day end slot to 11:59PM --> 12:PM end time does not show events
  function updateDayEndSlotEndTime() {
    const updatedEvents = (bookedSlots.concat(reservedSlots)).map(event => {

      if (moment(event.start).hours() === 23 && moment(event.start).minutes() === 0) {
        return {
          ...event,
          end: moment(event.start).set({ hours: 23, minutes: 59 })
        };
      }
      return event;
    });

    return updatedEvents;
  }

  const localizer = momentLocalizer(moment);
  if (!dataFetched)
    return <Loading height="60vh" />
  return (
    <div style={{ height: "100%" }} className={`${isStudentLoggedIn ? 'student-calender' : 'tutor-calender'}`}>
      <Calendar
        views={["day", "week", "month"]}
        localizer={localizer}
        selectable={true}
        defaultView={activeView}
        events={(updateDayEndSlotEndTime())?.map((event) => ({
          ...event,
          start: convertToGmt(event.start),
          end: convertToGmt(event.end),
        }))}
        eventPropGetter={eventPropGetter}
        components={{
          event: event => (
            <CustomEvent
              {...event}
              handleSetReservedSlots={handleSetReservedSlots}
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
              isStudentLoggedIn={isStudentLoggedIn}
            />
          )
        }}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ minHeight: "100%", width: "100%" }}
        step={30}
        onSelectSlot={handleDateClick}
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
export default ShowCalendar;