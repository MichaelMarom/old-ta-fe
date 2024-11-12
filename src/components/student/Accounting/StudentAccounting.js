import React, { useEffect, useState } from "react";
import AccountingTable from "./AccountingTable";
import BankDetails from "./BankDetails";
import Tabs from "../../common/Tabs";
import Lessons from "./Lessons";
import { useSelector } from "react-redux";
import { convertToDate } from "../../common/Calendar/Calendar";

const StudentAccounting = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { sessions } = useSelector((state) => state.studentSessions);
  let [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setActiveTab(<BankDetails />);
  }, []);

  const tabs = [
    {
      label: "Payment Type",
      component: <BankDetails />,
    },
    {
      label: "Accounting",
      component: (
        <AccountingTable
          paymentReportData=
          {sessions.filter((data) => data.type !== "reserved" && 
            convertToDate(data.end).getTime() < (new Date()).getTime()).sort((a,b)=>new Date(b.start)-new Date(a.start))}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      ),
    },
    {
      label: "Lessons Records",
      component: (
        <Lessons
          paymentReportData={sessions.filter((data) => data.type !== "reserved" && 
            convertToDate(data.end).getTime() < (new Date()).getTime()).sort((a,b)=>new Date(b.start)-new Date(a.start))}
        />
      ),
    },
  ];

  return (
    <>
      <Tabs
        links={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTab={setActiveTab}
        setActiveTabIndex={setActiveTabIndex}
      />

      {activeTab}
    </>
  );
};

export default StudentAccounting;
