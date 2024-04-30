import React, { useEffect, useState } from 'react'
import Header from '../layouts/tutor/Header'
import { useSelector } from 'react-redux'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useNavigate } from 'react-router-dom'

const TutorLayout = ({ children }) => {
    const { tutor } = useSelector(state => state.tutor);
    const { user } = useSelector(state => state.user)
    const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.tutorSessions)
    const navigate = useNavigate()
    const [remainingTime, setTimeRemaining] = useState(0)


    //todo
    //when currentsession timeRemaing is 7 minutes then move to feedback
    //shuould not depend on upcoming session, upcomingsession can be null
    useEffect(() => {
        const extractRemainingtimeInInteger = parseInt(upcomingSessionFromNow.split(' ')[0]);
        if (inMins && upcomingSession?.id && extractRemainingtimeInInteger < 4) {
            navigate(`/collab?sessionId=${upcomingSession.id}`)
        }
        else if (currentSession?.id && remainingTime > 10 * 60) {
            navigate(`/collab?sessionId=${currentSession.id}`)
        }
    }, [currentSession.id, inMins, navigate, upcomingSession, upcomingSessionFromNow, remainingTime])

    useEffect(() => {
        if (currentSession.end) {
            const intervalId = setInterval(() => {
                const currentTime = new Date();
                const remainingTime = Math.max(0, Math.floor((new Date(currentSession.end).getTime() - currentTime) / 1000));
                setTimeRemaining(remainingTime);
            }, 1000)

            return () => clearInterval(intervalId);
        }
    }, [currentSession.end]);

    if (user.role !== 'admin' && (tutor.Status === 'closed' || tutor.Status === 'disapproved'))
        return <div className='text-danger'>Your Account is Closed or Suspended. Please contact adminitrator.</div>
    if (user.role === 'admin' && !localStorage.getItem('tutor_user_id'))
        return <div className='text-danger'>Please Select Tutor  From Tutor-Table to view tutor records</div>
    return (
        <div>
            {/* {(!tutor.Status || tutor.Status === 'pending') ?
                <Steps steps={steps} currentStep={currentStep} /> : */}
            < Header />
            <SmallSideBar inMins={inMins} currentSession={currentSession} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />
            {children}
        </div>
    )
}

export default TutorLayout
