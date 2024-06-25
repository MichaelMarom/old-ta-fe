import React, { useEffect, useState } from 'react'
import CenteredModal from '../common/Modal'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { moment } from '../../config/moment'
import { useSelector } from 'react-redux'
import { formatted_tutor_sessions } from '../../axios/tutor'
import { convertToDate } from '../common/Calendar/Calendar'
import CustomEvent from '../common/Calendar/Event'

const TutorScheduleModal = ({ isOpen, onClose, id = "" }) => {
    const [sessions, setSessions] = useState([])
    const { student } = useSelector((state) => state.student)
    useEffect(() => {
        if (isOpen) {
            formatted_tutor_sessions(id).then((result) => {
                if (!result?.response?.data) {
                    setSessions(result.sessions)
                }
            })
        }
    }, [isOpen])

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
        let updatedDate = moment(convertToDate(date)).tz(student.timeZone).toDate();
        return updatedDate;
    };

    const localizer = momentLocalizer(moment);
    return (
        <CenteredModal show={isOpen} handleClose={onClose} title={`Schedule Of ${"Asiya"}`} style={{ maxWidth: "50%" }} >
            <div>
                <div className='m-3 student-calender' style={{ height: "65vh", widh: "65vw" }}>
                    <Calendar
                        localizer={localizer}
                        events={sessions.map((event) => ({
                            ...event,
                            start: convertToGmt(event.start),
                            end: convertToGmt(event.end),
                        }))}
                        components={{
                            event: event => (
                                <CustomEvent
                                    {...event}
                                    reservedSlots={sessions.filter((event) => event.type === "reserved")}
                                    isStudentLoggedIn={true}
                                    handleEventClick={() => { }}
                                    handleSetReservedSlots={() => { }}
                                />
                            )
                        }}
                        eventPropGetter={eventPropGetter}
                        startAccessor="start"
                        selectable={true}
                        endAccessor="end"
                        style={{ minHeight: "100%" }}
                    />
                </div>
            </div>
        </CenteredModal>
    )
}

export default TutorScheduleModal