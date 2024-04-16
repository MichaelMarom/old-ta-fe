import React, { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import { get_student_events } from '../../axios/student';
import CustomEvent from '../../components/common/Calendar/Event';
import { convertToDate } from '../../components/common/Calendar/Calendar';
import { useSelector } from 'react-redux';
import Actions from '../../components/common/Actions';
import { TutorFeedbackModal } from '../../components/student/CalenderTab/TutorFeedbackModal';
import Loading from '../../components/common/Loading';

export const Schedules = () => {
    const studentId = localStorage.getItem("student_user_id");
    const [reservedSlots, setReservedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [timeZone, setTimeZone] = useState('America/New_York');
    const { student } = useSelector(state => state.student)
    const [clickedSlot, setClickedSlot] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const isStudentLoggedIn = student.AcademyId

    useEffect(() => {
        moment.tz.setDefault(timeZone);
    }, [timeZone]);

    useEffect(() => {
        if (student.GMT) {
            const offset = parseInt(student.GMT, 10);
            const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
            setTimeZone(timezone[0] || null);
        }
    }, [student])

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true)
            const data = await get_student_events(studentId);
            setLoading(false)

            if (!data?.response?.data) {
                const reservedSlotsArray = data.map(item => JSON.parse(item.reservedSlots)).flat();
                const bookedSlotsArray = data.map(item => JSON.parse(item.bookedSlots)).flat();
                setReservedSlots(reservedSlotsArray);
                setBookedSlots(bookedSlotsArray);
            }
        }
        fetchEvents();
    }, [studentId])

    const handleEventClick = (event) => {
        setClickedSlot(event)
        const pastEvent = convertToDate(event.end).getTime() < (new Date()).getTime();
        console.log(event, student, isStudentLoggedIn && !pastEvent)
        if (isStudentLoggedIn && pastEvent) {
            setIsModalOpen(true);
        }
    };

    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const eventPropGetter = (event) => {
        if (event.type === 'reserved') {
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

    const localizer = momentLocalizer(moment);
    if (loading)
        return <Loading />
    return (
        <StudentLayout  >
            <div>
                <h4 className='text-center m-3'>Your Schedule</h4>
                <div className='m-3 student-calender' style={{ height: "65vh" }}>
                    <Calendar
                        localizer={localizer}
                        events={(reservedSlots.concat(bookedSlots)).map((event) => ({
                            ...event,
                            start: convertToGmt(event.start),
                            end: convertToGmt(event.end),
                        }))}
                        components={{
                            event: event => (
                                <CustomEvent
                                    {...event}
                                    reservedSlots={reservedSlots}
                                    isStudentLoggedIn={true}
                                    handleEventClick={handleEventClick}
                                    handleSetReservedSlots={() => { }}
                                />
                            )
                        }}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ minHeight: "100%" }}
                    />
                </div>
            </div>
            <TutorFeedbackModal
                isOpen={isModalOpen}
                clickedSlot={clickedSlot}
                onClose={() => setIsModalOpen(false)}
            />
            <Actions saveDisabled />
        </StudentLayout >
    );
}
