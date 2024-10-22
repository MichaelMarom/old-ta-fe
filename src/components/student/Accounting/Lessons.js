import React, { useState } from 'react'
import { showDate } from '../../../utils/moment'
import { wholeDateFormat } from '../../../constants/constants'
import Actions from '../../common/Actions'
import Button from '../../common/Button'
import CenteredModal from '../../common/Modal'

const Lessons = ({ paymentReportData }) => {
    const [showVideoModal, setVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    return (
        <div className="container mt-4" style={{
            overflowY: 'auto',
            height: 'calc(100vh - 200px)'
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
                        <th className=''>Video</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentReportData.map((row, index) => (
                        <tr key={index}>
                            <td>{showDate(row.start, wholeDateFormat)}</td>
                            <td>{row.tutorScreenName}</td>
                            <td>{row.subject}({row.title})</td>
                            <td>{row.rate.toFixed(2)}</td>
                            <td>
                          <Button
                            onClick={() => {
                              setVideoUrl(row.Recording);
                              setVideoModal(true);
                            }}
                            disabled={
                              row.request === "delete" || !row.Recording
                            }
                            className={`btn-sm ${
                              row.request === "delete"
                                ? "btn-danger"
                                : "btn-primary"
                            }`}
                          >
                            { row.request === "delete" || !row.Recording
                              ? "Not Consented"
                              : "View Video"}
                          </Button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table> : <div className='text-danger'>No Record Found</div>}

            <CenteredModal
          show={showVideoModal}
          handleClose={() => {
            setVideoModal(false);
            setVideoUrl("");
          }}
          title={"Lecture Video"}
        >
          <div>
            <video src={videoUrl} controls={true} width="100%" />
          </div>
        </CenteredModal>
            <Actions saveDisabled />
        </div>
    )
}

export default Lessons