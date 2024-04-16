import React from 'react'

export const FeedbackMissing = ({ buttonText, subject, handleButtonClick }) => {
    return (
        <div>
            Your Feedback for the "{subject}" LESSON is missing. You must complete the feedback before booking!
            <button className='btn btn-outline-primary' onClick={handleButtonClick}>{buttonText}</button>
        </div>
    )
}
