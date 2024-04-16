import React, { useEffect, useState } from 'react'
import { get_feedback_to_question } from '../../../../axios/student'
import { wholeDateFormat } from '../../../../constants/constants'
import { showDate } from '../../../../helperFunctions/timeHelperFunctions'
import { convertToDate } from '../../Calendar/Calendar'
import LeftSideBar from '../../LeftSideBar'
import { SessionActions } from './SessionActions'
import { SessionFeedback } from './SessionFeedback'

export const TutorEventModal = ({ isOpen, onClose, clickedSlot, handlePostpone, handleDeleteSessionByTutor }) => {
    const [questions, setQuestions] = useState([]);
    const [questionLoading, setQuestionLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (clickedSlot.id) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await get_feedback_to_question(clickedSlot.id, clickedSlot.tutorId, clickedSlot.studentId)
                if (data?.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }
    }, [clickedSlot])

    const handleClose = () => {
        setConfirmDelete(false)
        onClose()
    }

    return (
        <LeftSideBar
            top={"165px"}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div className="">
                <div className="modal-header">
                    <div className='text-center' style={{ width: '90%' }}>
                        <p className="modal-title fs-5" style={{ fontSize: "14px", fontWeight: "700" }}>
                            {showDate(clickedSlot.start, wholeDateFormat)} - {clickedSlot.studentName}
                        </p>
                    </div>
                </div>
                {
                    (convertToDate(clickedSlot.end).getTime() <= (new Date()).getTime()) ?
                        !clickedSlot.rating ? <div className='p-3 text-danger text-center' style={{ fontWeight: "700" }}>
                            No feedback given for this session!</div> :
                            <SessionFeedback clickedSlot={clickedSlot} questions={questions} questionLoading={questionLoading} /> :
                        <SessionActions
                            setConfirmDelete={setConfirmDelete}
                            confirmDelete={confirmDelete}
                            clickedSlot={clickedSlot}
                            handlePostpone={handlePostpone}
                            handleDeleteSessionByTutor={handleDeleteSessionByTutor}
                            handleClose={handleClose}
                        />
                }

            </div>
        </LeftSideBar >
    )
}
