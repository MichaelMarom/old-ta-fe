import React from 'react'
import { showDate } from '../../../utils/moment'
import { convertTutorIdToName } from '../../../utils/common'
import { wholeDateFormat } from '../../../constants/constants'
import Actions from '../../common/Actions'

const Lessons = ({ paymentReportData }) => {
    return (
        <div className="container mt-4" style={{
            overflowY: 'auto',
            height: 'calc(100vh - 150px)'
        }}>
            <div className='d-flex justify-content-between'>
                <h2>Lessons</h2>
                <h5 className='border p-1 shadow rounded'>First Lesson: {paymentReportData?.[0]?.start  ? 
                showDate(paymentReportData?.[0]?.start) : "N/A"}</h5>
            </div>
            {paymentReportData.length ? <table>
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
            <Actions saveDisabled />
        </div>
    )
}

export default Lessons