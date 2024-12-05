import Tabs from "../../common/Tabs";
import Lessons from "./Lessons";
import AccountingTable from "./AccountingTable";
import BankDetails from "./BankDetails";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertToDate } from "../../common/Calendar/Calendar";


const StudentAccounting = () => {


  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { sessions } = useSelector((state) => state.studentSessions);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setActiveTab(<BankDetails />);
  }, []);

  const sortedAndPastLessons = sessions
    .filter(
      (data) =>
        data.type !== "reserved" &&
        convertToDate(data.end).getTime() < new Date().getTime()
    )
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  const tabs = [
    {
      label: "Payment Type",
      component: <BankDetails />,
    },
    {
      label: "Accounting",
      component: (
        <AccountingTable
          sortedAndPastLessons={sortedAndPastLessons}
          
        />
      ),
    },
    {
      label: "Lessons Records",
      component: (
        <Lessons
          paymentReportData={sortedAndPastLessons}
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
