import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/common/Tabs'
import Ads from '../../student/MarketPlace/Ad'
import List from '../../../components/tutor/Ads/ListComponent'
import Classified from './Classified'

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
        { label: `Shortlist`, component: null, link: '/tutor/market-place/bid' },
    ];

    return (
        <  >
            <Tabs links={tabs} setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
                activeTab={activeTab}
                activeTabIndex={activeTabIndex}
            />
            {children}
        </>
    )
}

export default Layout