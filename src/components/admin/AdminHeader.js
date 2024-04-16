import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../common/ToolTip";
import { FaSignOutAlt } from "react-icons/fa";
import { useClerk } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/auth_state/auth";
import { setTutor } from "../../redux/tutor_store/tutorData";
import { setStudent } from "../../redux/student_store/studentData";


const Header = () => {
    const { signOut } = useClerk();


    let nav = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    const [activeTab, setActiveTab] = useState('');

    const tabs = [
        { id: 'tutor-data', label: 'Tutor' },
        { id: 'student-data', label: 'Student' },
        { id: 'marketing', label: 'Marketing' },
        { id: 'new-subject', label: 'New Subject' },
        { id: 'accounting', label: 'Accounting' },
        { id: 'chat', label: 'Communications' },
        // { id: 'tos', label: 'TOS' },
        // { id: 'intro', label: 'Plateform Intro' },
    ];


    let handleTabClick = e => {
        nav(`/admin/${e.currentTarget.dataset.url}`)
    }

    useEffect(() => {
        const currentTab = location.pathname.split('/').pop();
        setActiveTab(currentTab)
    }, [location])

    let [screen_name, set_screen_name] = useState('')

    useEffect(() => {
        let name = window.localStorage.getItem('admin_screen_name');
        set_screen_name(name)
    }, []);

    const handleSignOut = () => {
        localStorage.clear()
        dispatch(setUser({}))

        dispatch(setTutor({}))
        dispatch(setStudent({}))
        //setTutor tonull
        //setStudent tonull
        nav('/login')
    }

    return (
        <>
            <div className="screen-name btn-success rounded" style={{ display: screen_name === 'null' ? 'none' : 'flex', position: 'fixed', top: '15px', zIndex: '999', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height: '30px' }}>
                {JSON.parse(localStorage.getItem('user'))?.email}
            </div>
            <div className="admin-tab-header shadow-sm">
                <ul>
                    {tabs.map((tab) => (
                        <li key={tab.id} data-url={tab.id} onClick={handleTabClick}
                            id={`${activeTab === tab.id ? 'admin-tab-header-list-active' : ''}`}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
                <div style={{ marginRight: "230px", cursor: "pointer" }}>
                    <Tooltip text={"signout"} direction="bottomright">
                        <FaSignOutAlt color="white" onClick={() => signOut(() => handleSignOut())} />
                    </Tooltip>
                </div>
            </div>
        </>
    );
}

export default Header;