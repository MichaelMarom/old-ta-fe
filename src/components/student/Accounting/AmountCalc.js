import React from 'react'
import { convertToDate } from '../../common/Calendar/Calendar';

const AmountCalc = ({ paymentReportData,setStartDate, setEndDate, startDate, endDate }) => {
    
    const totalAmount = paymentReportData
        .filter((row) => {
            if (!startDate || !endDate) return true;
            console.log(row)
            return convertToDate(row.start) >= new Date(startDate) && convertToDate(row.start) <= new Date(endDate);
        })
        .reduce((total, row) => total + parseFloat(row.rate.split('$')[1]), 0);
    return (
        <div className="col-md-4">
            <h2>Filter by Date and Time</h2>
            <div className="form-group">
                <label htmlFor="startDate">Start Date and Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date and Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="endDate"
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="alert alert-info">
                Total Amount Paid: ${totalAmount}
            </div>
        </div>
    )
}

export default AmountCalc
