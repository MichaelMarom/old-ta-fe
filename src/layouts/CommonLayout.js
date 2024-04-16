import React from 'react'
import AdminLayout from './AdminLayout'
import TutorLayout from './TutorLayout'
import StudentLayout from './StudentLayout'


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
            <div>
                <AdminLayout />
                {children}
            </div>
        )
    else return null
}

export default CommonLayout
