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
import { getStartAndEndDateOfSlotForLesson, isFutureDate, isPastDate } from '../../components/common/Calendar/utils/calenderUtils';
import { toast } from 'react-toastify';
import { update } from 'lodash';
import { getStudentLessons, updateStudentLesson } from '../../redux/student/studentBookings';
import { fetch_calender_detals } from '../../axios/tutor';
import { useLocation } from 'react-router-dom';
import { getNameUsingIdColumn } from '../../axios/common';

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
    const [tutorGMT, setTutorGMT] = useState(null);
    const [timeDiff, setTimeDiff] = useState()

    const isStudentRoute = location.pathname.split("/")[1] === "student";

    const calculateTimeDifference = () => {
        if (tutorGMT && student.GMT) {
            const studentOffset = parseInt(student.GMT, 10);
            const tutorOffset = parseInt(tutorGMT, 10);

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
    const [disabledWeekDays, setDisabledWeekDays] = useState([]);
    const [disableHourSlots, setDisableHourSlots] = useState([]);
    const [disabledHours, setDisabledHours] = useState([]);
    const [disableColor, setDisableColor] = useState('');

    useEffect(() => {
        dispatch(getStudentLessons(student.AcademyId));
    }, [student.AcademyId]);

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
        setClickedSlot(event);
        if (isPastDate(convertToDate(event.end))) {
            setIsModalOpen(true);
        } else if (activeView === 'week') {
            setIsModalOpen(false);
            toast.info("Click on an Empty slot to postpone your selected (blinking) Booked lesson.");
        }
    };

    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const handleDoubleClickSlot = (slot) => {
        if (clickedSlot.id && slot.action === "doubleClick" && activeView === 'week') {
            const { start, end } = getStartAndEndDateOfSlotForLesson(slot.start, slot.end);
            dispatch(updateStudentLesson(clickedSlot.id, {
                studentId: clickedSlot.studentId,
                tutorId: clickedSlot.tutorId,
                start,
                end,
            }));
            setClickedSlot({});
        }
    };

    console.log(timeDiff)
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
            getNameUsingIdColumn(clickedSlot.tutorId, 'TutorSetup', 'GMT').then(res => setTutorGMT(res[0].GMT))
        }
    }, [clickedSlot]);

    useEffect(() => {
        if (tutorGMT) {
            setTimeDiff(calculateTimeDifference())
        }
    }, [tutorGMT])

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
            clickedSlot.request !== 'delete';

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
        return {};
    };

    const handleViewChange = (view) => setActiveView(view);

    const localizer = momentLocalizer(moment);
    if (loading) return <Loading />;
    return (
        <div>
            <div>
                <h4 className='text-center m-3'>Your Schedule</h4>
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
                                    sessions={lessons}
                                />
                            ),
                        }}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        selectable={true}
                        onSelectSlot={handleDoubleClickSlot}
                        endAccessor="end"
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
