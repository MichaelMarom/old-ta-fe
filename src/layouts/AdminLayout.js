import React from 'react'
import Header from '../components/admin/AdminHeader'

const AdminLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>

    )
}

export default AdminLayout
