import React, { useEffect, useState } from 'react'
import TutorLayout from '../../../layouts/TutorLayout'
import Tabs from '../../../components/common/Tabs'
import Ads from '../../../components/student/Ads'
import List from '../../../components/tutor/Ads/ListComponent'
import Classified from '../../../components/tutor/Ads/Classified'

const Layout = ({ children }) => {
    let [activeTab, setActiveTab] = useState('')
    const [activeTabIndex, setActiveTabIndex] = useState(1);

    useEffect(() => {
        setActiveTab(<List
            setActiveTab={setActiveTab}
            setActiveTabIndex={setActiveTabIndex} />)
    }, [])


    const tabs = [
        { label: `Students' Classified`, component: <Classified />, link: '/tutor/market-place/classified' },
        {
            label: 'Saved Ads', component: <List
                setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex} />,
            link: '/tutor/market-place/list'
        },
        {
            label: 'Create your Ad', component: <Ads setActiveTab={setActiveTab} />,
            link: '/tutor/market-place'
        },
        { label: `Short List`, component: null, link: '/tutor/market-place/bid' },
    ];

    return (
        <TutorLayout  >
            <Tabs links={tabs} setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
                activeTab={activeTab}
                activeTabIndex={activeTabIndex}
            />
            {children}
        </TutorLayout>
    )
}

export default Layout