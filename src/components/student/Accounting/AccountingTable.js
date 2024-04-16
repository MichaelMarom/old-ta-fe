import React from 'react'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import { wholeDateFormat } from '../../../constants/constants'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'
import AmountCalc from './AmountCalc'

const AccountingTable = ({ paymentReportData
    , startDate
    , endDate
    , setStartDate
    , setEndDate }) => {
    return (
        <div className='container'>
            <div className='row'>
                <div className="col-md-8" style={{
                    overflowY: 'auto',
                    height: '60vh'
                }}>
                    <h2>Payment Report</h2>
                    {paymentReportData.length ?
                        <table>
                            <thead className='thead-light'>
                                <tr>
                                    <th className=' col-3'>Date</th>
                                    <th className=''>Tutor</th>
                                    <th className=''>Subject</th>
                                    <th className=''>Rate</th>
                                    <th className=''>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentReportData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{showDate(row.start, wholeDateFormat)}</td>
                                        <td>{convertTutorIdToName(row.tutorId)}</td>
                                        <td>{row.subject}</td>
                                        <td>{row.rate}</td>
                                        <td>{row.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className='text-danger'>No Record Found</div>}
                </div>
                <AmountCalc
                    paymentReportData={paymentReportData}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>
        </div>
    )
}

export default AccountingTable
