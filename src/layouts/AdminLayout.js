import React from 'react'
import Header from './admin/Header'

const AdminLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>

    )
}

export default AdminLayout
