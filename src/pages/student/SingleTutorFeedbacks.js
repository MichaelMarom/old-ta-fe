import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import CustomEvent from '../../components/common/Calendar/Event';
import { convertToDate } from '../../components/common/Calendar/Calendar';
import { get_tutor_bookings } from '../../axios/calender';
import { TutorEventModal } from '../../components/common/EventModal/TutorEventModal/TutorEventModal';
import { getNameUsingIdColumn } from '../../axios/common';


const SingleTutorFeedbacks = () => {
    const params = useParams();
    const [events, setEvents] = useState([]);
    const [timeZone, setTimeZone] = useState('America/New_York');
    const { student } = useSelector(state => state.student);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [clickedSlot, setClickedSlot] = useState({})
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tutorName, setTutorName] = useState("")

    useEffect(() => {
        moment.tz.setDefault(timeZone);
    }, [timeZone]);

    useEffect(() => {
        if (student.GMT) {
            const offset = parseInt(student.GMT, 10);
            const timezone = moment.tz.names().filter(name =>
                (moment.tz(name).utcOffset()) === offset * 60);
            setTimeZone(timezone[0] || null);
        }
    }, [student])

    useEffect(() => {
        const fetchTutorBookings = async () => {
            const result = await get_tutor_bookings(params.AcademyId);
            if (!result?.response?.data && result) {
                setEvents(result.filter(event => (convertToDate(event.start).getTime() <= (new Date()).getTime()) && event.ratingByStudent));
            }
        }
        fetchTutorBookings();
    }, [params])

    const handleEventClick = (event) => {
        const inFuture = convertToDate(event.end).getTime() > (new Date()).getTime()
        if (!inFuture) {
            setClickedSlot(event)
            setFeedbackModalOpen(true)
        }
    }

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

    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const handleModalClose = () => {
        setClickedSlot({});
        setFeedbackModalOpen(false)
    }

    const handleNavigate = (date, view, action) => {
        if (action === 'NEXT' && date > new Date()) {
            return;
        }
        setCurrentDate(date);
    }

    useEffect(() => {
        getNameUsingIdColumn(params.AcademyId, "TutorSetup", "TutorScreenname").
        then(res => !res?.response?.data && setTutorName(res[0].TutorScreenname))
    }, [params.AcademyId])

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <div>
                <h4 className='text-center m-3'>Tutor "{tutorName}" feedback from students</h4>
                <div className='m-3 student-calender' style={{ height: "80vh" }}>
                    <Calendar
                        localizer={localizer}
                        events={events.map((event) => ({
                            ...event,
                            start: convertToGmt(event.start),
                            end: convertToGmt(event.end),
                        }))}
                        components={{
                            event: event => (
                                <CustomEvent
                                    {...event}
                                    reservedSlots={events}
                                    isStudentLoggedIn={false} //exception becuase student need to see other students feedback, thats why isStudentLoggedin is false
                                    handleSetReservedSlots={() => { }}
                                />
                            )
                        }}
                        onSelectEvent={(event) => handleEventClick(event)}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%" }}
                        date={currentDate}
                        onNavigate={handleNavigate}
                    />
                </div>
            </div>
            <TutorEventModal
                isOpen={feedbackModalOpen}
                onClose={() => handleModalClose()}
                clickedSlot={clickedSlot}
                showTutorFeedback={false}
            />
        </div>
    )
}


export default SingleTutorFeedbacks;