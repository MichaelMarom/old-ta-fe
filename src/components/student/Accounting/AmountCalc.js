import React from "react";
import { moment } from "../../../config/moment";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";

const AmountCalc = ({ sortedAndPastLessons, startDate, setStartDate, endDate, setEndDate }) => {
    const { student } = useSelector((state) => state.student);
    const timeZone = student.timeZone || "UTC"; // Default to UTC if timeZone is undefined

    // Adjust a date to the start of the day in the student's timezone
    const startOfDayInStudentTimeZone = (date) => {
        const utcDate = moment(date).utc();
        return utcDate.tz(timeZone).startOf("day").toDate();
    };

    // Adjust a date to the end of the day in the student's timezone
    const endOfDayInStudentTimeZone = (date) => {
        const utcDate = moment(date).utc();
        return utcDate.tz(timeZone).endOf("day").toDate();
    };

    // Calculate the total amount
    const totalAmount = sortedAndPastLessons
        .filter((row) => {
            if (!startDate || !endDate) return true;
            const lessonDate = new Date(row.start).getTime();
            return (
                lessonDate >= startOfDayInStudentTimeZone(startDate).getTime() &&
                lessonDate <= endOfDayInStudentTimeZone(endDate).getTime()
            );
        })
        .reduce((total, row) => total + parseFloat(row.rate), 0);

    return (
        <div className="col-md-4">
            <h2>Filter by Date and Time</h2>
            <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <ReactDatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMM d, yyyy"
                    className="form-control m-2"
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <ReactDatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MMM d, yyyy"
                    className="form-control m-2"
                />
            </div>
            <div className="alert alert-info">
                Total Amount Paid: ${new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(totalAmount)}
            </div>
        </div>
    );
};

export default AmountCalc;
