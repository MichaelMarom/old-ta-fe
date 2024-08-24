import { useEffect, useState } from 'react';
import Tabs from '../../common/Tabs';
import AccDetails from './AccDetails';
import TutorAccSetup from './TutorAccSetup';
import { useSelector } from 'react-redux';

const Accounting = () => {
    const { sessions } = useSelector(state => state.tutorSessions)
    const [currentYearEarning, setCurrentYearEarning] = useState(0);
    const [previousYearEarning, setPreviousYearEarnig] = useState(0);
    const [currentYearHrs, setCurrentYearHrs] = useState(0);

    let [activeTab, setActiveTab] = useState(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} />);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    useEffect(() => {
        setActiveTab(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs}
            currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} />)
    },
        [sessions, currentYearEarning, previousYearEarning, currentYearHrs])

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const getYear = date => new Date(date).getFullYear();

            const isCurrentYear = date => getYear(date) === new Date().getFullYear();

            const isLastYear = date => getYear(date) === new Date().getFullYear() - 1
            const currentYearSessions = sessions.filter(session => isCurrentYear(session.startDate));
            const currentYearEarnings = currentYearSessions.reduce((acc, session) => acc + session.rate, 0);

            const lastYearSessions = sessions.filter(session => isLastYear(session.startDate));
            const lastYearEarnings = lastYearSessions.reduce((acc, session) => acc + session.rate, 0);

            setCurrentYearHrs(currentYearSessions.length)
            setCurrentYearEarning(currentYearEarnings)
            setPreviousYearEarnig(lastYearEarnings)
        }
        fetchSessionDetails()
    }, [sessions])

    const tabs = [
        { label: 'Account Settings', component: <TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} /> },
        { label: 'Lessons performed', component: <AccDetails /> },
        { label: 'Tutor Academy Account', component: null },
    ];

    return (
        <>
            <Tabs links={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
                activeTabIndex={activeTabIndex}
            />
            <div>
                {activeTab}
            </div>
        </>
    );
}

export default Accounting;