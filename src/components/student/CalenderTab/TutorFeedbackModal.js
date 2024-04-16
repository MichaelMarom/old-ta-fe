import React, { useEffect, useState } from 'react'
import { get_feedback_to_question } from '../../../axios/student'
import { wholeDateFormat } from '../../../constants/constants'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import LeftSideBar from '../../common/LeftSideBar'
import { SessionFeedback } from '../../common/EventModal/TutorEventModal/SessionFeedback'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'

export const TutorFeedbackModal = ({ isOpen, onClose, clickedSlot, handlePostpone, handleDeleteSessionByTutor }) => {
    const [questions, setQuestions] = useState([]);
    const [questionLoading, setQuestionLoading] = useState(false);

    useEffect(() => {
        if (clickedSlot.id) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await get_feedback_to_question(clickedSlot.id, clickedSlot.tutorId, clickedSlot.studentId, 0)
                if (data?.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }
    }, [clickedSlot])

    const handleClose = () => {
        onClose()
    }

    return (
        <LeftSideBar
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div className="">
                <div className="modal-header">
                    <div className='text-center' style={{ width: '90%' }}>
                        <p className="modal-title fs-5" style={{ fontSize: "14px", fontWeight: "700" }}>
                            {showDate(clickedSlot.start, wholeDateFormat)} - {convertTutorIdToName(clickedSlot.tutorId)}
                        </p>
                    </div>
                </div>
                {
                    // (convertToDate(clickedSlot.end).getTime() <= (new Date()).getTime()) ?
                    !clickedSlot.tutorRating ? <div className='p-3 text-danger text-center' style={{ fontWeight: "700" }}>
                        No feedback given for this session!</div> :
                        <SessionFeedback clickedSlot={clickedSlot} questions={questions} questionLoading={questionLoading} showTutorFeedback />
                    // :
                    // <SessionActions
                    //     setConfirmDelete={setConfirmDelete}
                    //     confirmDelete={confirmDelete}
                    //     clickedSlot={clickedSlot}
                    //     handlePostpone={handlePostpone}
                    //     handleDeleteSessionByTutor={handleDeleteSessionByTutor}
                    //     handleClose={handleClose}
                    // />
                }

            </div>
        </LeftSideBar >
    )
}
