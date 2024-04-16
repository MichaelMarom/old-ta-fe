import React from 'react'
import StarRating from '../../StarRating'
import Loading from '../../Loading'
import { convertTutorIdToName } from '../../../../helperFunctions/generalHelperFunctions'

export const SessionFeedback = ({ clickedSlot, questions, questionLoading, showTutorFeedback }) => {
    return (
        <div>
            <div className='m-2'>
                <h5 className='text-center'>{showTutorFeedback ? convertTutorIdToName(clickedSlot.tutorId) : clickedSlot.studentName} Reviews</h5>
                <div className='rounded-pill border border-secondary px-3 d-flex' style={{ width: "100%", height: "30px" }}>
                    <div style={{ width: "60%" }}>
                        <StarRating rating={showTutorFeedback ? clickedSlot.tutorRating : clickedSlot.rating} />
                    </div>
                    <p className='float-end m-0 mt-1' style={{ fontSize: "12px", width: "40%" }}>{showTutorFeedback ? clickedSlot.tutorRating : clickedSlot.rating} out of 5.00</p>
                </div>
                {
                    questionLoading ? <Loading height='50px' /> :
                        <div className='m-4'>
                            {questions.map(question => {
                                return (<div className='mb-2'>
                                    <p className='m-0' style={{ fontSize: "12px" }}>{question.questionText}</p>
                                    <div className="progress" role="progressbar" aria-label="Warning example" aria-valuenow={question.star} aria-valuemin="0" aria-valuemax="1500">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: `${(question.star / 5) * 100}%` }}>{(question.star / 5) * 100}%</div>
                                    </div>
                                </div>)
                            })}
                        </div>
                }
            </div>
            <div className='m-4'>
                <h6>{showTutorFeedback ? convertTutorIdToName(clickedSlot.tutorId) : clickedSlot.studentName} - Comment</h6>
                <pre className='rounded p-2 border border-secondary m-0' style={{ fontSize: "14px", height: "auto" }}>
                    {showTutorFeedback ? clickedSlot.tutorComment : clickedSlot.comment}
                </pre>
            </div>
        </div>
    )
}
