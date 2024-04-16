import React, { useState, useEffect } from 'react';
import moment from 'moment';
import StarRating from '../StarRating';
import { useSelector } from 'react-redux';
import { convertToDate } from './Calendar';
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions';

function CustomEvent({
    event,
    isStudentLoggedIn,
    handleEventClick = () => { },
    handleSetReservedSlots,
    reservedSlots }) {
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(event.createdAt));
    const [extraFiveMinStart, setExtraFiveMinStart] = useState(false);
    const { student } = useSelector(state => state.student)

    useEffect(() => {
        let intervalId;
        const checkIfOlderThan65Minutes = () => {
            const newRemainingTime = calculateRemainingTime(event.createdAt);
            setRemainingTime(newRemainingTime);

            if ((newRemainingTime.minutes === 0 && newRemainingTime.seconds === 1) || newRemainingTime.minutes >= 60) {
                clearInterval(intervalId);
                setExtraFiveMinStart(true)
            }
        }
        if (event.type === 'reserved') {
            checkIfOlderThan65Minutes();
            intervalId = setInterval(checkIfOlderThan65Minutes, 1000);
        }

        return () => clearInterval(intervalId);
    }, [event]);

    useEffect(() => {
        let intervalId;
        const checkIfOlderThan65Minutes = () => {
            const currentTime = moment();
            const inputTime = moment(event.createdAt);
            const diffInMinutes = currentTime.diff(inputTime, 'minutes');
            //5 min extra after expire
            console.log(event, convertToDate(event.createdAt).toLocaleString())
            if (diffInMinutes >= 65 && event.type === 'reserved') {
                handleSetReservedSlots(reservedSlots.filter(slot => {
                    if (slot.type === "reserved") console.log(event, slot)
                    return event.id !== slot.id
                }));
                setExtraFiveMinStart(false)
            }
        };

        if (extraFiveMinStart) {
            event.type === "reserved" && checkIfOlderThan65Minutes();
            intervalId = event.type === "reserved" && setInterval(checkIfOlderThan65Minutes, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [event, extraFiveMinStart, reservedSlots]);

    function calculateRemainingTime(createdAt) {
        const createdAtMoment = moment(createdAt);
        const now = moment();
        const duration = moment.duration(now.diff(createdAtMoment));

        if (duration.hours() > 2 || duration.days() > 1 || now.diff(createdAtMoment, 'minutes') > 64) {
            return {
                minutes: 0,
                seconds: 1
            }
        }
        const remainingMinutes = 60 - duration.minutes() - 1;
        const remainingSeconds = 60 - duration.seconds() - 1;

        return {
            minutes: remainingMinutes,
            seconds: remainingSeconds,
        };
    }

    return (
        <div
            className={`text-center h-100 ${event.request === 'postpone' ? 'blinking-button' : ''} `}
            style={{ fontSize: "12px" }}
            onClick={() => handleEventClick(event)}
        >
            {(event.type === 'reserved' && extraFiveMinStart) ? (
                <div>
                    {event.title} by {event.studentName} - expired
                </div>
            ) : (
                <div>
                    {event.title} {isStudentLoggedIn &&
                        student.FirstName !== event.studentName ? `` : ` ${isStudentLoggedIn ? `from ${convertTutorIdToName(event.tutorId)}` :
                            `by ${event.studentName}`}`}
                    {event.type === 'reserved' &&
                        <div>
                            {String(remainingTime.minutes).padStart(2, '0')} :
                            {String(remainingTime.seconds).padStart(2, '0')}
                        </div>
                    }
                    {
                        <div >
                            "{event.subject}"
                        </div>
                    }
                    {event.request === 'postpone' &&
                        <div >
                            Postpone Request
                        </div>
                    }
                    {event.request === 'delete' &&
                        <div >
                            Deleted
                        </div>
                    }
                    {!isStudentLoggedIn && event.rating &&
                        <div >
                            <StarRating rating={event.rating} />
                        </div>
                    }
                    {isStudentLoggedIn && event.tutorRating &&
                        <div >
                            <StarRating rating={event.tutorRating} />
                        </div>
                    }
                </div>
            )}
        </div>
    );
}

export default CustomEvent;
