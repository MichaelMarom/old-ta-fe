import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/common/Tabs'
import List from '../../../components/tutor/Ads/ListComponent'
import StudentLayout from '../../../layouts/StudentLayout'
import Marketplace from './Marketplace'
import Ad from './Ad'
import Bids from './Bids'
import StudentAdList from './StudentAdList'

const Layout = ({ children }) => {
  let [activeTab, setActiveTab] = useState('')
  const [activeTabIndex, setActiveTabIndex] = useState(1);

  useEffect(() => {
    setActiveTab(<List
      setActiveTab={setActiveTab}
      setActiveTabIndex={setActiveTabIndex} />)
  }, [])

  const tabs = [
    { label: `MarketPlace`, component: <Marketplace />, link: '/student/market-place' },
    {
      label: 'Saved Ads', component: <StudentAdList />,
      link: '/student/market-place/list'
    },
    {
      label: 'Advertise', component: <Ad />,
      link: '/student/market-place/ad'
    },
    {
      label: 'Shortlist', component: <Bids />,
      link: '/student/market-place/bid'
    },
  ];

  return (
    <StudentLayout >
      <Tabs links={tabs} setActiveTab={setActiveTab}
        setActiveTabIndex={setActiveTabIndex}
        activeTab={activeTab}
        activeTabIndex={activeTabIndex}
      />
      {children}
    </StudentLayout>
  )
}

export default Layout