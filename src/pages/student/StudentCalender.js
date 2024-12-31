import React, { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import CustomEvent from '../../components/common/Calendar/Event';
import { convertToDate } from '../../components/common/Calendar/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../components/common/Actions';
import { TutorFeedbackModal } from '../../components/student/CalenderTab/TutorFeedbackModal';
import Loading from '../../components/common/Loading';
import { getStartAndEndDateOfSlotForLesson, isFutureDate, isPastDate }
    from '../../components/common/Calendar/utils/calenderUtils';
import { toast } from 'react-toastify';
import { getStudentLessons, updateStudentLesson } from '../../redux/student/studentBookings';
import { fetch_calender_detals, get_tutor_setup } from '../../axios/tutor';
import { useLocation } from 'react-router-dom';
import useSlotPropGetter from '../../components/common/Calendar/hooks/useSlotPropGetter';
import SlotPill from '../../components/student/SlotPill';

const StudentCalender = () => {
    const [timeZone, setTimeZone] = useState('America/New_York');
    const { student } = useSelector(state => state.student);
    const [clickedSlot, setClickedSlot] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { lessons } = useSelector(state => state.bookings);
    const dispatch = useDispatch();
    const [activeView, setActiveView] = useState('month');
    const [tutorCalender, setTutorCalender] = useState();
    const { user } = useSelector(state => state.user);
    const location = useLocation();
    const [selectedtutor, setSelectedTutor] = useState({});
    const [timeDiff, setTimeDiff] = useState();

    const isStudentRoute = location.pathname.split("/")[1] === "student";

    const calculateTimeDifference = () => {
        if (selectedtutor.GMT && student.GMT) {
            const studentOffset = parseInt(student.GMT, 10);
            const tutorOffset = parseInt(selectedtutor.GMT, 10);

            const difference = studentOffset - tutorOffset;
            return difference;
        } else return "-";
    };


    const isStudentLoggedIn =
        user.role === "student"
            ? true
            : user.role === "admin" && isStudentRoute
                ? true
                : false;

    const [enableHourSlots, setEnableHourSlots] = useState([]);
    const [disableDates, setDisableDates] = useState([]);
    const [enabledDays, setEnabledDays] = useState([]);
    const [disableWeekDays, setDisabledWeekDays] = useState([]);
    const [disableHourSlots, setDisableHourSlots] = useState([]);
    const [disabledHours, setDisabledHours] = useState([]);
    const [disableColor, setDisableColor] = useState('');
    const [weekDaysTimeSlots, setWeekDaysTimeSlots] = useState([]);


    useEffect(() => {
        dispatch(getStudentLessons(student.AcademyId, selectedtutor.AcademyId));
    }, [student.AcademyId, selectedtutor.AcademyId]);

    useEffect(() => {
        moment.tz.setDefault(timeZone);
    }, [timeZone]);

    useEffect(() => {
        if (student.GMT) {
            const offset = parseInt(student.GMT, 10);
            const timezone = moment.tz.names().filter(name => moment.tz(name).utcOffset() === offset * 60);
            setTimeZone(timezone[0] || null);
        }
    }, [student]);

    const handleEventClick = (event) => {
        if (student.AcademyId !== event.studentId) return toast.warning("You cannot see details of another student lesson")
        if (isPastDate(convertToDate(event.end))) {
            setClickedSlot(event);
            setIsModalOpen(true);
        } else if (activeView === 'week') {
            setIsModalOpen(false);
            setClickedSlot(event);
            toast.info("Click on an Empty slot to postpone your selected (blinking) Booked lesson. Made a mistake? then click on the lesson you want to pospone.");
        }
        else {
            toast.info('You are currently on "Month" view. To Postpone booked lesson, Move to a "Week" or "Day" view.');
        }
    };

    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const handleDoubleClickSlot = (slot) => {
        if (clickedSlot.id && slot.action === "doubleClick" && activeView === 'week') {
            // const isPresentinBlockedSlot = ()=>{}
            const { start, end } = getStartAndEndDateOfSlotForLesson(slot.start, slot.end);
            dispatch(updateStudentLesson(clickedSlot.id, {
                studentId: clickedSlot.studentId,
                // tutorId: clickedSlot.tutorId,
                start,
                end,
            }));

            emitSocketNotification('notif_incoming',
                clickedSlot.studentId,
                clickedSlot.tutorScreenName,
                "Lesson Postponed",
                `Lesson has been posponed from date: ${clickedSlot.start} to date: ${showDate(convertToDate(start))}`,
                "tutor",
                clickedSlot.tutorId
            )

            setClickedSlot({});
        }
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
            newArray[0] = addHours(newArray[0], timeDiff * 1);
            newArray[1] = addHours(newArray[1], timeDiff * 1);
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

    useEffect(() => {
        if (isFutureDate(convertToDate(clickedSlot.start)) && clickedSlot.id) {
            get_tutor_setup({ AcademyId: clickedSlot.tutorId }).then(res => setSelectedTutor(res[0]))
        }
        if (!clickedSlot.id) setSelectedTutor({})
    }, [clickedSlot]);

    useEffect(() => {
        if (selectedtutor.GMT) {
            setTimeDiff(calculateTimeDifference())
        }
    }, [selectedtutor.GMT])

    useEffect(() => {
        if (clickedSlot.tutorId && timeDiff) {
            fetch_calender_detals(clickedSlot.tutorId).then(result => {
                if (Array.isArray(result) && result.length > 0) {
                    const [res] = result;
                    if (Object.keys(res || {}).length) {
                        const updatedEnableHours = getTimeZonedEnableHours(
                            JSON.parse(
                                res.enableHourSlots === "undefined" ? "[]" : res.enableHourSlots
                            ),
                            timeZone
                        );
                        setEnableHourSlots(updatedEnableHours);
                        setDisableDates(JSON.parse(res.disableDates));
                        setEnabledDays(JSON.parse(res.enabledDays));
                        setDisabledWeekDays(JSON.parse(res.disableWeekDays));
                        setDisableHourSlots(JSON.parse(res.disableHourSlots));
                        const updatedDisableHoursRange = getTimeZonedDisableHoursRange(
                            JSON.parse(res.disableHoursRange)
                        );
                        setDisabledHours(updatedDisableHoursRange);
                        setDisableColor(res.disableColor);
                    }
                } else {
                    console.error("Unexpected API response format or empty response");
                }
            });
        }
    }, [timeDiff, clickedSlot.tutorId])

    const eventPropGetter = (event) => {
        const isFutureClickedLesson = !!clickedSlot.id &&
            !!isFutureDate(convertToDate(clickedSlot.start)) &&
            convertToDate(event.start).getTime() === convertToDate(clickedSlot.start).getTime() &&
            clickedSlot.request !== 'delete' &&
            activeView !== 'month';
        const otherStudentLesson = event.studentId !== student.AcademyId;
        if (otherStudentLesson)
            return {
                style: {
                    backgroundColor: "yellow",
                    color: "black",
                }
            }
        if (event.type === 'reserved') {
            return {
                className: `reserved-event ${isFutureClickedLesson ? ' blinking-button' : ''}`,
                style: {
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'yellow',
                    color: "black",
                },
            };
        } else if (event.type === 'booked') {
            return {
                className: `booked-event ${isFutureClickedLesson ? ' blinking-button' : ''}`,
                style: {
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'green',
                },
            };
        }
        return { className: `${isFutureClickedLesson ? ' blinking-button' : ''}`, };
    };

    const slotPropGetter = useSlotPropGetter({
        disableColor,
        disableDates,
        disabledHours,
        disableHourSlots,
        enableHourSlots,
        isStudentLoggedIn,
        timeDifference: timeDiff,
        timeZone: student.timeZone,
        selectedSlots: [],
        selectedTutor: { ...selectedtutor, academyId: selectedtutor.AcademyId },
        weekDaysTimeSlots,
        tutor: {},
        lessons,
    });
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

    const handleViewChange = (view) => setActiveView(view);

    const localizer = momentLocalizer(moment);
    if (loading) return <Loading />;
    return (
        <div>
            <div>
                <div className='d-flex justify-content-between w-50 align-items-center'>
                    {clickedSlot.id && isFutureDate(convertToDate(clickedSlot.start)) &&
                        <div className='d-flex align-items-center'>
                            <h6 className='m-0' style={{ whiteSpace: "nowrap" }}>Selected Lesson:</h6>
                            <SlotPill selectedType={clickedSlot.type} selectedSlots={[clickedSlot]} handleRemoveSlot={() => setClickedSlot({})} />
                        </div>
                    }
                    <h3 className=' text-end' style={{ whiteSpace: "nowrap" }}>Your Schedule</h3>
                </div>
                <div className='m-3 student-calender' style={{ height: "65vh" }}>
                    <Calendar
                        localizer={localizer}
                        onView={handleViewChange}
                        events={lessons.map(event => ({
                            ...event,
                            start: convertToGmt(event.start),
                            end: convertToGmt(event.end),
                        }))}
                        components={{
                            event: event => (
                                <CustomEvent
                                    {...event}
                                    isStudentLoggedIn={true}
                                    handleEventClick={handleEventClick}
                                    onDoubleClick={() => console.log('doubkeclicked event')}
                                    sessions={lessons}
                                />
                            ),
                        }}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        selectable={true}
                        onSelectSlot={handleDoubleClickSlot}
                        endAccessor="end"
                        slotPropGetter={slotPropGetter}

                        style={{ minHeight: "100%" }}
                    />
                </div>
            </div>
            <TutorFeedbackModal
                isOpen={isModalOpen}
                showTutorFeedback={true}
                clickedSlot={clickedSlot}
                onClose={() => setIsModalOpen(false)}
            />
            <Actions saveDisabled />
        </div>
    );
};

export default StudentCalender;
