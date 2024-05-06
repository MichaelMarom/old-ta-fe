import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../../components/common/ToolTip";
import { FaSignOutAlt } from "react-icons/fa";
import { useClerk } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";


const Header = () => {
    const { signOut } = useClerk();

    const { count } = useSelector(state => state.newSubj)

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
        localStorage.removeItem('access_token')
        localStorage.removeItem('student_user_id')
        localStorage.removeItem('tutor_user_id')
        localStorage.removeItem('user')
        // localStorage.clear()()
        dispatch(setUser({}))

        dispatch(setTutor({}))
        dispatch(setStudent({}))
        //setTutor tonull
        //setStudent tonull
        nav('/login')
    }

    return (
        <>

            <div className="admin-tab-header shadow-sm">
                <ul>
                    {tabs.map((tab) => (
                        <li key={tab.id} data-url={tab.id} onClick={handleTabClick}
                            id={`${activeTab === tab.id ? 'admin-tab-header-list-active' : ''}`}
                        > <p className="m-0" style={{ transform: "skew(41deg, 0deg)" }}>
                                {tab.label}
                                {tab.label === 'New Subject' && <span
                                    className=" text-bg-danger p-1 rounded-circle"
                                    style={{
                                        display: "inline-flex",
                                        width: "20px",
                                        height: "20px",
                                        flexDirection: "row",
                                        fontSize: "12px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: "8px"
                                    }}
                                >
                                    {count}
                                </span>
                                }</p>
                        </li>
                    ))}
                </ul>
                <div style={{ marginRight: "230px", cursor: "pointer" }}>
                    <Tooltip text={"signout"} direction="bottomright">
                        <FaSignOutAlt color="white" onClick={() => signOut(() => handleSignOut())} />
                    </Tooltip>
                </div>
            </div>
            <div className="screen-name btn-success rounded" 
            style={{ display: screen_name === 'null' ? 'none' : 'flex',
             position: 'fixed', top: '15px', zIndex: '999', fontWeight: 'bold', 
             color: '#fff', right: '45px', padding: '3px 5px 0', height: '30px' }}>
                {JSON.parse(localStorage.getItem('user'))?.email}
            </div>
        </>
    );
}

export default Header;