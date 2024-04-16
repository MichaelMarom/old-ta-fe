import React from 'react'
import TutorHeader from '../layouts/tutor/Header'
import Header from '../layouts/student/Header'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useSelector } from 'react-redux'
import AdminLayout from './AdminLayout'
import TutorLayout from './TutorLayout'
import StudentLayout from './StudentLayout'


const CommonLayout = ({ role, children }) => {
    const { upcomingSessionFromNow, upcomingSession, inMins } = useSelector(state => state.studentSessions)
    const { upcomingSessionFromNow: tutorUpcomingFromNow,
        upcomingSession: tutorUpcoming,
        inMins: isTutorUpcomgLessonInMins } = useSelector(state => state.tutorSessions)

    if (role === 'student')
        return (
            <StudentLayout>{children}</StudentLayout>
        )
    else if (role === 'tutor')
        return (
            <TutorLayout>{children}</TutorLayout>
        )
    else if (role === 'admin')
        return (
            <div>
                <AdminLayout />
                {children}
            </div>
        )
    else return null
}

export default CommonLayout
