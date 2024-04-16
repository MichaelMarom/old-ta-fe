import React from 'react'
import Button from '../../Button'

export const SessionActions = ({ clickedSlot, handlePostpone,
     handleDeleteSessionByTutor, 
    setConfirmDelete, handleClose, confirmDelete }) => {
   
    return (
        <div style={{ width: "95%" }}>

            <Button handleClick={handlePostpone} className='btn-warning w-100'>Postpone this lesson</Button>
            <Button handleClick={() => setConfirmDelete(true)} className='btn-danger w-100'>Delete this lesson</Button>
            {confirmDelete &&
                <div className='d-flex flex-column jsutify-content-between p-2 border m-2 align-items-center'>
                    <p className='text-danger'>Please take notice that credit for this
                        lesson cancellation to be refunded to Student
                    </p>
                    <div>
                        <Button className='btn-sm btn-secondary' handleClick={handleClose}>Cancel</Button>
                        <Button className='btn-sm btn-danger' handleClick={handleDeleteSessionByTutor}>Proceed to Delete </Button>

                    </div>
                </div>
            }
        </div>
    )
}
