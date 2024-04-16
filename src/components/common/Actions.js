import React from 'react';
import Button from './Button';
import BTN_ICON from '../../assets/images/button__icon.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { STEPS } from '../../constants/constants';

const actionsStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'white',
    borderTop: '1px solid #ccc',
    padding: '10px',
};

const Actions = ({
    saveDisabled = false,
    editDisabled = true,
    backDisabled = false,
    nextDisabled = false,
    SaveText = 'Save',
    loading = false,
    unSavedChanges = false,
    onSave = () => { },
    onEdit = () => { },
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { tutor } = useSelector(state => state.tutor)
    const currentTab = location.pathname.split('/')[2];
    const currentUser = location.pathname.split('/')[1];
    const isStudentSide = currentUser === 'student'

    const tutorTabsNavigationInfo = [
        { next: "setup", current: "intro", back: null, withRolePrefix: true },
        { next: "education", current: "setup", back: "intro", withRolePrefix: true },
        { next: "rates", current: "education", back: "setup", withRolePrefix: true },
        { next: "accounting", current: "rates", back: "education", withRolePrefix: true },
        { next: "subjects", current: "accounting", back: "rates", withRolePrefix: true },

        { next: "scheduling", current: "subjects", back: "accounting", withRolePrefix: true },
        { next: "feedback", current: "scheduling", back: "subjects", withRolePrefix: true },
        { next: "my-students", current: "feedback", back: "scheduling", withRolePrefix: true },
        { next: "term-of-use", current: "my-students", back: "feedback", withRolePrefix: true },
        { next: "chat", current: "term-of-use", back: "my-students", withRolePrefix: true },
        { next: "market-place", current: "chat", back: "term-of-use", withRolePrefix: true },
        { next: "/collab", current: "market-place", back: "chat", withRolePrefix: true },
        { next: `tutor-profile/${tutor.AcademyId}`, current: "/collab", back: "market-place", withRolePrefix: false },
        { next: null, current: `tutor-profile`, back: "/collab", withRolePrefix: true },
    ]

    const studentTabsNavigationInfo = [
        { next: "setup", current: "intro", back: null, withRolePrefix: true },
        { next: "faculties", current: "setup", back: "intro", withRolePrefix: true },
        { next: "accounting", current: "faculties", back: "setup", withRolePrefix: true },
        { next: "feedback", current: "accounting", back: "faculties", withRolePrefix: true },
        { next: "calender", current: "feedback", back: "accounting", withRolePrefix: true },
        { next: "term-of-use", current: "calender", back: "feedback", withRolePrefix: true },
        { next: "chat", current: "term-of-use", back: "calender", withRolePrefix: true },
        { next: "market-place", current: "chat", back: "term-of-use", withRolePrefix: true },
        { next: "/collab", current: "market-place", back: "chat", withRolePrefix: true },
        { next: `profile`, current: "/collab", back: "market-place", withRolePrefix: false },
        { next: null, current: "profile", back: "/collab", withRolePrefix: true },
        { next: null, current: `tutor-profile`, back: null, withRolePrefix: true },
    ]

    const currentTabInfo = (isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo)
        .find(tab => tab.current === currentTab)
    const nextTabInfo = (isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo)
        .find(tab => {
            return tab.back === currentTab
        })
    const backTabInfo = (isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo)
        .find(tab => tab.next === currentTab)

    const isNextTabExist = currentTabInfo.next;
    const isBackTabExist = currentTabInfo.back;

    const onNext = () => {
        nextTabInfo.withRolePrefix ? navigate(`/${currentUser}/${currentTabInfo.next}`) :
            navigate(`${currentTabInfo.next}`)
    }

    const onBack = () => {
        backTabInfo.withRolePrefix ? navigate(`/${currentUser}/${currentTabInfo.back}`) :
            navigate(`${currentTabInfo.back}`)
    }

    return (
        <div style={actionsStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="" style={{ width: "10%" }}>
                        <button type='button' onClick={onBack} className="back-btn action-btn btn"
                            disabled={!saveDisabled && (unSavedChanges || loading || backDisabled || !isBackTabExist)}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text"><FaChevronLeft />  Back</p>
                            </div>
                        </button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <button onClick={onEdit} type='button' className="edit-btn action-btn btn"
                            disabled={editDisabled}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text">Edit</p>
                            </div>
                        </button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <Button handleClick={onSave} className={`save-btn action-btn btn 
                        ${(unSavedChanges && !saveDisabled) ? 'blinking-button saving-btn' : ''}`} type="submit" loading={loading}
                            disabled={saveDisabled || loading} >
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} style={{
                                        animation: loading ? "spin 2s linear infinite" : 'none',
                                    }} />
                                </div>
                                <p className="button__text">{SaveText}</p>
                            </div>
                        </Button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <button onClick={onNext}
                            disabled={((!saveDisabled && (unSavedChanges || loading))
                                || !isNextTabExist || nextDisabled ||
                                currentTab === STEPS[tutor.Step]) && !isStudentSide}
                            type='button' className="next-btn action-btn btn">
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text">Next <FaChevronRight /> </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actions
