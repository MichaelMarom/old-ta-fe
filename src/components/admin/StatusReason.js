import React from 'react'
import CenteredModal from '../common/Modal'
import TAButton from '../common/TAButton'
import Avatar from '../common/Avatar'

const StatusReason = ({ open, onClose, statusReason, setStatusReason, status, user={}, handleProceed }) => {
    return (
        <CenteredModal show={open} handleClose={onClose} title={"Reason for Changing Status"}>
            <form className='d-flex flex-column gap-3'  onSubmit={handleProceed}>
                <div className='d-flex align-items-center shadow rounded-3'>
                    <Avatar avatarSrc={user?.Photo} />
                    <div className='d-flex flex-column'>
                    <div><span className='fw-bold'>Name:</span> {user.TutorScreenname}</div>
                    <div><span className='fw-bold'>Current Status:</span> {user.Status}</div>
                        </div>

                </div>
                <div className='shadow rounded-3 p-2'>

                    <div><span className='fw-bold'>New Status:</span> {status}</div>
                    <label htmlFor='reason'>Enter Reason:</label>
                    <textarea required id="reason" style={{ height: "150px" }} className="w-100 border border-secondary" value={statusReason} onChange={(e) => setStatusReason(e.target.value)} placeholder={"Enter Reason"} />
                </div>
                <div className='d-flex justify-content-between'>
                    <TAButton buttonText={"Cancel"} type='button' handleClick={onClose} />
                    <TAButton buttonText={"Proceed"} type='submit' />
                </div>
            </form>
        </CenteredModal>
    )
}

export default StatusReason