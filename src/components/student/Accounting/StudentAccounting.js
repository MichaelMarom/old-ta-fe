import React, { useEffect, useState } from 'react';
import AccountingTable from './AccountingTable';
import BankDetails from './BankDetails';
import Tabs from '../../common/Tabs';
import Lessons from './Lessons';
import { useSelector } from 'react-redux';

const StudentAccounting = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentReportData, setPaymentReportData] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const { sessions } = useSelector(state => state.studentSessions)
    let [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        setActiveTab(<BankDetails />)
    }, [])

    const tabs = [
        {
            label: 'Payment Type', component: <BankDetails />
        },
        {
            label: 'Accounting', component: <AccountingTable paymentReportData={sessions} startDate={startDate}
                endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
        },
        { label: 'Lessons Records', component: <Lessons paymentReportData={sessions} /> },
    ];

    return (
        <>
            <Tabs
                links={tabs}
                activeTabIndex={activeTabIndex}
                setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
            />

            {
                activeTab
            }
        </>
    );
};

export default StudentAccounting;
