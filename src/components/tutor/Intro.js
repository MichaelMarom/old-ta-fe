import { useState } from 'react';
import { useEffect } from 'react';
import RichTextEditor from '../common/RichTextEditor/RichTextEditor';

import motivateTab from "../../assets/images/tabs/motivate-tab.jpg"; // Adjust the path as needed
import EduTab from "../../assets/images/tabs/edu-tab.jpg"; // Adjust the path as needed
import FacultyTab from "../../assets/images/tabs/faculty-tutor-tab.jpg"; // Adjust the path as needed
import Feedback from "../../assets/images/tabs/feedback-tutor-tab.jpg"; // Adjust the path as needed
import ScheduleTab from "../../assets/images/tabs/schedule-tutor.jpg"; // Adjust the path as needed
import SetupTab from "../../assets/images/tabs/setup-tab.jpg"; // Adjust the path as needed
import AccTab from "../../assets/images/tabs/accounting-tutor-tab.jpg"; // Adjust the path as needed
import MyStudents from "../../assets/images/tabs/mystudents-tutor-tab.jpg"; // Adjust the path as needed
import ProfileTab from "../../assets/images/tabs/profile-tutor-tab.jpg"; // Adjust the path as needed
import ChatTab from "../../assets/images/tabs/chat-tutor-tab.jpg"; // Adjust the path as needed
import AgencyTab from "../../assets/images/tabs/agency-tutor-tab.jpg"; // Adjust the path as needed


import Actions from '../common/Actions';
import { get_adminConstants, post_termsOfUse } from '../../axios/admin';
import Loading from '../common/Loading';
import { useSelector } from 'react-redux';
import { FaRegLightbulb, FaUserCircle, FaUserFriends, FaVideo } from 'react-icons/fa';
import DarkModal from '../common/DarkModal';

const Intro = () => {
    const [unSavedChanges, setUnsavedChanges] = useState(false);
    const { tutor } = useSelector(state => state.tutor);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [db_intro, set_db_intro] = useState('');
    const [intro, set_intro] = useState('');
    const userRole = localStorage.getItem("user_role");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get_adminConstants();
                if (!!result?.data?.[0]?.IntroContent) {
                    set_intro(result.data[0].IntroContent);
                    set_db_intro(result.data[0].IntroContent);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setFetching(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        setUnsavedChanges(intro !== undefined && db_intro !== undefined &&
            intro !== db_intro);
    }, [intro, db_intro]);

    const handleEditorChange = (value) => {
        set_intro(value);
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await post_termsOfUse({ IntroContent: intro });
        set_db_intro(response.data.IntroContent);
        setEditMode(false);
        setLoading(false);
    };

    if (fetching)
        return <Loading />

    return (
        <form onSubmit={handleSave}>
            <div className="px-4 m-3  shadow" style={{ maxHeight: "calc(100vh - 170px)", height: "auto", overflow: "auto" }} >
                <div className='w-100 text-center p-1'>
                    <img className='' src={`${process.env.REACT_APP_BASE_URL}/logo1.png`} width={350} height={100} alt="logo" />
                </div>
                <section className="mb-4">
                    <h5 className="text-primary">You, the tutor, are the value we provide to our students.</h5>
                    <div className="alert alert-info">
                        <FaVideo className="me-2" />
                        You can view the tutorial video for each menu tab above by clicking on the video icon at the end of the menu bar.
                    </div>
                    <p>Welcome to the Tutoring Academy portal. Our tutoring academy is more than just a service—it’s a community of learners and educators. We developed this portal to be both sophisticated and intuitive. If you have a request to add a feature, let us know, we would love to develop it.</p>
                </section>

                {/* Setup Account Section */}
                <section className="mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <h6><FaRegLightbulb className="me-2 text-primary" />Setting Up Your Account</h6>
                            <p>To set up your account, you need to fill in basic information, upload your photo, an introduction video, and certificates or diplomas (if earned). To proceed to the next tab, click on the "Next" button at the footer of each tab.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(SetupTab); setOpenImageModal(true); }}
                                src={SetupTab}
                                alt="Setting Account"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </section>

                {/* Menu Tabs Section */}
                <section className="mb-4">
                    <h6><FaUserFriends className="me-2 text-primary" />Navigating the Menu Tabs</h6>

                    {/* Setup Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Setup Tab</h6>
                            <p>Fill in personal information, select the school grades you teach, and upload a 30-60 second introduction video.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(SetupTab); setOpenImageModal(true); }}
                                src={SetupTab}
                                alt="Setup Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Education Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Education Tab</h6>
                            <p>Provide information about your education, certificates, diplomas, and work experience.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(EduTab); setOpenImageModal(true); }}
                                src={EduTab}
                                alt="Education Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Motivate Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Motivate Tab</h6>
                            <p>Indicate if you provide services to multiple students or classes, and generate codes for students.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(motivateTab); setOpenImageModal(true); }}
                                src={motivateTab}
                                alt="Motivate Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Accounting Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Accounting Tab</h6>
                            <p>Set up payment preferences and view your lesson performance and bi-weekly accounting.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(AccTab); setOpenImageModal(true); }}
                                src={AccTab}
                                alt="Accounting Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Subjects Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Subjects Tab</h6>
                            <p>Select the subjects and grades you teach, along with your hourly rate.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(FacultyTab); setOpenImageModal(true); }}
                                src={FacultyTab}
                                alt="Subjects Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* My Students Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>My Students Tab</h6>
                            <p>View all your students, their pictures, country, and school grade.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(MyStudents); setOpenImageModal(true); }}
                                src={MyStudents}
                                alt="My Students Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Scheduling Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Scheduling Tab</h6>
                            <p>Set up your availability for the upcoming week and mark lessons that were completed.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(ScheduleTab); setOpenImageModal(true); }}
                                src={ScheduleTab}
                                alt="Scheduling Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Franchising Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Franchising Tab</h6>
                            <p>Develop your own tutoring franchise, hire tutors, and receive a markup on their earnings.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(AgencyTab); setOpenImageModal(true); }}
                                src={AgencyTab}
                                alt="Franchising Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Profile Tab */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h6>Profile Tab</h6>
                            <p>Access your public profile and view the tabs available to students when they visit your profile.</p>
                        </div>
                        <div className="col-md-6 border shadow">
                            <img
                                onClick={() => { setSelectedImage(ProfileTab); setOpenImageModal(true); }}
                                src={ProfileTab}
                                alt="Profile Tab"
                                className="img-fluid rounded shadow-sm openable-img"
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </section>

                <DarkModal
                    onClose={() => setOpenImageModal(false)}
                    open={openImageModal}
                    src={selectedImage}
                />
            </div>

            <Actions
                handleSave={handleSave}
                loading={loading}
                disabled={!unSavedChanges || !tutor}
                editMode={editMode}
                setEditMode={setEditMode}
                handleEditClick={handleEditClick}
            />
        </form>
    );
};

export default Intro;
