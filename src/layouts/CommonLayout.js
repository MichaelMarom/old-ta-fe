import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import TutorLayout from './TutorLayout'
import StudentLayout from './StudentLayout'
import UnAuthorizeRoute from '../pages/UnAuthorizeRoute'
import StudentHeader from './student/Header'
import TutorHeader from './tutor/Header'
import AdminHeader from './admin/Header'


const CommonLayout = ({ role, children }) => {

    if (role === 'student')
        return (
            <>
                <StudentHeader />{children}
            </>
        )
    else if (role === 'tutor')
        return (
            <>
                <TutorHeader />{children}</>
        )
    else if (role === 'admin')
        return (
            <>
                <AdminHeader />Admin Cannot access Collaboration Tab</>
        )
    else return <UnAuthorizeRoute />
}

export default CommonLayout
