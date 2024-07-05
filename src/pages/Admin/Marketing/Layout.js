import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/common/Tabs'
import AdminLayout from '../../../layouts/AdminLayout'
import Send from './Send'
import AddSMSMessages from './AddSMSTemps'

const Layout = ({ children }) => {
    let [activeTab, setActiveTab] = useState('')
    const [activeTabIndex, setActiveTabIndex] = useState(1);

    useEffect(() => {
        setActiveTab(<AddSMSMessages />)
    }, [])

    const tabs = [
        {
            label: 'Send',
            component: <Send />,
            link: '/admin/marketing'
        },
        {
            label: `Add SMS Templates`,
            component: <AddSMSMessages />,
            link: '/admin/marketing/add-sms'
        },
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