import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/common/Tabs'
import AdminLayout from '../../../layouts/AdminLayout'
import List from './List'
import Create from './Create'

const Layout = ({ children }) => {
  let [activeTab, setActiveTab] = useState('')
  const [activeTabIndex, setActiveTabIndex] = useState(1);

  useEffect(() => {
    setActiveTab(<List
      setActiveTab={setActiveTab}
      setActiveTabIndex={setActiveTabIndex} />)
  }, [])

  const tabs = [
    { label: `List`, component: <List />, link: '/admin/email-templates' },
    {
      label: 'Create', component: <Create />,
      link: '/admin/email-templates/create'
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