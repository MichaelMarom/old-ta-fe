import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/common/Tabs'
import AdminLayout from '../../../layouts/AdminLayout'
import AddTutors from './AddTutors'
import Send from './Send'

const Layout = ({ children }) => {
    let [activeTab, setActiveTab] = useState('')
    const [activeTabIndex, setActiveTabIndex] = useState(1);

    useEffect(() => {
        setActiveTab(<AddTutors />)
    }, [])

    const tabs = [
        {
            label: 'Send', component: <Send />,
            link: '/admin/marketing'
        },
        { label: `Add`, component: <AddTutors />, link: '/admin/marketing/add' },
    ];

    return (
        <AdminLayout >
            <Tabs links={tabs} setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
                activeTab={activeTab}
                activeTabIndex={activeTabIndex}
            />
            {children}
        </AdminLayout>
    )
}

export default Layout