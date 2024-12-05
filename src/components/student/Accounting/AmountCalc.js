import React, { useState } from "react";
import { convertToDate } from "../../common/Calendar/Calendar";
import moment from "moment-timezone";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";

const AmountCalc = ({ sortedAndPastLessons }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { student } = useSelector((state) => state.student);
    const gmtInInt = student.GMT ? parseInt(student.GMT) : 0;

    // Calculate local GMT offset in milliseconds
    const getLocalGMTOffset = new Date().getTimezoneOffset() * -60000; // in milliseconds

    const calculateTutorTime = (date) => {
        if (!date) return null;
        const tutorTimeOffset = (gmtInInt * 3600 + getLocalGMTOffset / 1000) * 1000; // in milliseconds
        return new Date(moment(date ).toDate().getTime() + tutorTimeOffset);
    };

    const totalAmount = sortedAndPastLessons
        .filter((row) => {
            if (!startDate || !endDate) return true;
            const lessonDate = convertToDate(row.start).getTime();
            return (
                lessonDate >= startDate.getTime() &&
                lessonDate <= endDate.getTime()
            );
        })
        .reduce((total, row) => total + parseFloat(row.rate), 0);

    return (
        <div className="col-md-4">
            <h2>Filter by Date and Time</h2>
            <div className="form-group">
                <label htmlFor="startDate">Start Date and Time</label>
                <ReactDatePicker
                    selected={startDate ? calculateTutorTime(startDate) : null}
                    onChange={(date) => {
                        if (!date) return;
                        setStartDate(date);
                    }}
                    dateFormat="MMM d, yyyy HH:mm:ss"
                    className="form-control m-2"
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date and Time</label>
                <ReactDatePicker
                    selected={endDate ? calculateTutorTime(endDate) : null}
                    onChange={(date) => {
                        if (!date) return;
                        setEndDate(date);
                    }}
                    dateFormat="MMM d, yyyy HH:mm:ss"
                    className="form-control m-2"
                />
            </div>
            <div className="alert alert-info">
                Total Amount Paid: ${totalAmount.toFixed(2)}
            </div>
        </div>
    );
};

export default AmountCalc;
