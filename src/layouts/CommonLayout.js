import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import TutorLayout from './TutorLayout'
import StudentLayout from './StudentLayout'
import UnAuthorizeRoute from '../pages/UnAuthorizeRoute'


const CommonLayout = ({ role, children }) => {

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
                <AdminLayout />
        )
    else return <UnAuthorizeRoute />
}

export default CommonLayout
