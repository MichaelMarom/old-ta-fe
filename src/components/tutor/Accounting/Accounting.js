import { useEffect, useState } from 'react';
import Tabs from '../../common/Tabs';
import AccDetails from './AccDetails';
import TutorAccSetup from './TutorAccSetup';
import { get_sessions_details } from '../../../axios/tutor';

const Accounting = () => {
    const [sessions, setSessions] = useState([])
    const [currentYearEarning, setCurrentYearEarning] = useState(0);
    const [previousYearEarning, setPreviousYearEarnig] = useState(0);
    const [currentYearHrs, setCurrentYearHrs] = useState(0);

    let [activeTab, setActiveTab] = useState(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} />);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const AcademyId = localStorage.getItem('tutor_user_id')

    useEffect(() => { setActiveTab(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs}
         currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} />) }, 
         [sessions, currentYearEarning, previousYearEarning,currentYearHrs ])

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const data = await get_sessions_details(AcademyId);
            if (!data?.response?.data) {
                setSessions(data.sessions)
                setCurrentYearHrs(data.currentYearAccHours)
                setCurrentYearEarning(data.currentYearEarning)
                setPreviousYearEarnig(data.previousYearEarning)
            }
        }
        fetchSessionDetails()
    }, [AcademyId])

    const tabs = [
        { label: 'Account Settings', component: <TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} previousYearEarning={previousYearEarning} /> },
        { label: 'Lessons performed', component: <AccDetails sessions={sessions} /> },
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