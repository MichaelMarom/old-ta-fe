import React, { useEffect, useState } from 'react';
import CenteredModal from '../Modal';
import { moment } from "../../../config/moment";

import { showDate } from '../../../utils/moment';
import DatePicker from "react-datepicker";
import { wholeDateFormat } from '../../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateStudentLesson } from '../../../redux/student/studentBookings';
import { toast } from 'react-toastify';
import { convertToDate } from './Calendar';
import { format, toZonedTime } from "date-fns-tz";
import "react-datepicker/dist/react-datepicker.css";

const StudentFutureEventModal = ({ setClickedSlot, show, handleClose, clickedSlot }) => {
    const [selectedDate, setSelectedDate] = useState(
        moment().add(1, "hours").set({ minute: 0 }).toDate()
    );
    const { student } = useSelector(state => state.student);
    const { lessons } = useSelector(state => state.bookings);
    const dispatch = useDispatch();

    useEffect(() => {
        if (clickedSlot.id) {
            setSelectedDate(
                moment(clickedSlot.start)
                    .tz(student.timeZone)
                    .add(1, "hours")
                    .toDate()
            );
        }
    }, [clickedSlot.id, student.timeZone]);

    // Format the date in the user's selected time zone
    const formatDateInTimeZone = (date = new Date(), timeZone) => {
        const zonedDate = toZonedTime(date, timeZone); // Convert to the user's time zone
        return format(zonedDate, "MMM d, yyyy hh:mm aa zzz", { timeZone });
    };

    const handleReschedule = () => {
        if (!selectedDate) {
            return toast.warning("Please select a valid date and time!");
        }

        // Convert selectedDate to the student's timezone
        const dateInStudentTimeZone = moment.tz(selectedDate, student.timeZone);

        const sessionOnSameTime =
            convertToDate(clickedSlot.start).getTime() ===
            convertToDate(selectedDate).getTime();

        const sessionExistOnSelectedTime = lessons.filter((slot) =>
            moment
                .utc(convertToDate(slot.start))
                .isSame(moment.utc(convertToDate(selectedDate)))
        );

        if (sessionOnSameTime)
            return toast.warning("Session is already on the same time!");
        if (sessionExistOnSelectedTime.length)
            return toast.warning("Session already exists for that time!");

        const rescheduleEndTime = moment(convertToDate(selectedDate)).add(1, "hours");

        dispatch(
            updateStudentLesson(clickedSlot.id, {
                ...clickedSlot,
                start: selectedDate,
                end: rescheduleEndTime.toDate(),
                request: null,
            })
        );

        setClickedSlot({});
        handleClose();
    };

    const handleDateChange = (date) => {
        // Adjust the selected date to the user's timezone immediately
        const adjustedDate = moment.tz(date, student.timeZone);
        setSelectedDate(adjustedDate.toDate());
    };

    const renderCustomInput = ({ value, onClick }) => (
        <input
            className="form-control m-2 w-80"
            onClick={onClick}
            value={formatDateInTimeZone(selectedDate, student.timeZone)}
            readOnly
        />
    );

    return (
        <CenteredModal
            show={show}
            handleClose={handleClose}
            title={showDate(clickedSlot.start, wholeDateFormat)}
        >
            <div>
                <div className="d-flex justify-content-between align-items-center h-100">
                    <div>
                        <p>Enter New Date and Time for Lesson:</p>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            dateFormat="MMM d, yyyy hh:mm aa z"
                            
                            // customInput={renderCustomInput({ value: selectedDate })}
                        />
                    </div>
                    <button
                        className="btn-success btn-sm"
                        onClick={handleReschedule}
                    >
                        Postpone
                    </button>
                </div>
                <p>{formatDateInTimeZone(selectedDate, student.timeZone)}</p>
            </div>
        </CenteredModal>
    );
};

export default StudentFutureEventModal;
