import React, { useState } from 'react';
import CenteredModal from '../Modal';
import moment from 'moment-timezone';
import { showDate } from '../../../utils/moment';
import DatePicker from "react-datepicker";
import { wholeDateFormat } from '../../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateStudentLesson } from '../../../redux/student/studentBookings';
import { toast } from 'react-toastify';
import "moment-timezone";
import { convertToDate } from './Calendar';

const StudentFutureEventModal = ({ setClickedSlot, show, handleClose, clickedSlot }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const { student } = useSelector(state => state.student);
    const { lessons } = useSelector(state => state.bookings);
    const dispatch = useDispatch();

    const handleReschedule = () => {
        if (!selectedDate) {
            return toast.warning("Please select a valid date and time!");
        }

        // Convert selectedDate to the student's timezone
        const dateInStudentTimeZone = moment.tz(selectedDate, student.timeZone);

        console.log("Selected Date Details in Student's Timezone:");
        console.log("Hour:", dateInStudentTimeZone.hour()); // Hour in 24-hour format
        console.log("Minute:", dateInStudentTimeZone.minute());
        console.log("Day of the Month:", dateInStudentTimeZone.date());
        console.log("Month:", dateInStudentTimeZone.month() + 1); // Months are 0-indexed
        console.log("Year:", dateInStudentTimeZone.year());
        console.log("Full Formatted Date:", dateInStudentTimeZone.format("YYYY-MM-DD HH:mm:ss"));

        const sessionOnSameTime =
            moment.utc(clickedSlot.start).isSame(dateInStudentTimeZone.utc());

        const sessionExistOnSelectedTime = lessons.filter((slot) =>
            moment.utc(slot.start).isSame(dateInStudentTimeZone.utc())
        );

        if (sessionOnSameTime) {
            return toast.warning("Session is already on the same time!");
        }
        if (sessionExistOnSelectedTime.length) {
            return toast.warning("Session already exists for that time!");
        }

        const rescheduleEndTime = dateInStudentTimeZone.clone().add(1, "hours");

        dispatch(
            updateStudentLesson(clickedSlot.id, {
                ...clickedSlot,
                start: dateInStudentTimeZone.utc().toDate(),
                end: rescheduleEndTime.utc().toDate(),
                request: null,
            })
        );

        setClickedSlot({});
        handleClose();
    };

    const handleDateChange = (date) => {
        // Adjust the selected date to the student's timezone immediately
        const adjustedDate = moment.tz(
            moment(date).format("YYYY-MM-DD HH:mm:ss"),
            student.timeZone
        );

        console.log("Adjusted Selected Date in Student's Timezone:", adjustedDate.format("YYYY-MM-DD HH:mm:ss"));
        setSelectedDate(adjustedDate.toDate());
    };

    return (
        <CenteredModal show={show} handleClose={handleClose} title={showDate(clickedSlot.start, wholeDateFormat)}>
            <div>
                <div className="d-flex justify-content-between align-items-center h-100">
                    <div>
                        <p>Enter New Date and Time for Lesson:</p>
                        <DatePicker
                            selected={moment(convertToDate(selectedDate)).tz(student.timeZone).toDate()}
                            onChange={handleDateChange}
                            showTimeSelect
                            dateFormat="MMM d, yyyy hh:mm aa"
                            className="form-control m-2 w-80"
                            timeIntervals={60}
                        />
                    </div>
                    <button
                        className="btn-success btn-sm"
                        onClick={handleReschedule}
                    >
                        Postpone
                    </button>
                </div>
            </div>
        </CenteredModal>
    );
};

export default StudentFutureEventModal;
