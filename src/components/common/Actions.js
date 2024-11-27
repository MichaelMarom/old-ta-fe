import React from "react";
import Button from "./Button";
import BTN_ICON from "../../assets/images/button__icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { STEPS } from "../../constants/constants";
import { toast } from "react-toastify";
import TAButton from "./TAButton";

const actionsStyle = {
  position: "fixed",
  bottom: "0",
  left: "0",
  right: "0",
  backgroundColor: "white",
  borderTop: "1px solid #ccc",
  padding: "10px",
  height: "100px",
};

const Actions = ({
  saveDisabled = false,
  editDisabled = true,
  backDisabled = false,
  nextDisabled = false,
  SaveText = "Save",
  loading = false,
  unSavedChanges = false,
  onSave = () => {},
  onEdit = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutor } = useSelector((state) => state.tutor);
  const { student } = useSelector((state) => state.student);
  const { user } = useSelector((state) => state.user);
  const currentTab = location.pathname.split("/")[2];
  const currentUser = location.pathname.split("/")[1];
  const isStudentSide = currentUser === "student";

  const tutorTabsNavigationInfo = [
    {
      next: "setup",
      current: "intro",
      back: null,
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "education",
      current: "setup",
      back: "intro",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "discounts",
      current: "education",
      back: "setup",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "accounting",
      current: "discounts",
      back: "education",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "subjects",
      current: "accounting",
      back: "discounts",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "scheduling",
      current: "subjects",
      back: "accounting",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "feedback",
      current: "scheduling",
      back: "subjects",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "my-students",
      current: "feedback",
      back: "scheduling",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "term-of-use",
      current: "my-students",
      back: "feedback",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "chat",
      current: "term-of-use",
      back: "my-students",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },   {
      next: "market-place",
      current: "chat",
      back: "term-of-use",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "agency",
      current: "market-place",
      back: "chat",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
 
    {
      next: "collab",
      current: "agency",
      back: "market-place",
      withCurrentRolePrefix: true,
      withNextRolePrefix: false,
      withBackRolePrefix: true,
    },
    {
      next: `tutor-profile/${tutor.AcademyId}`,
      current: "collab",
      back: "agency",
      withCurrentRolePrefix: false,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: null,
      current: `/tutor/tutor-profile/${encodeURI(tutor.AcademyId)}`,
      back: "collab",
      checkWholeUrl: true,
      withCurrentRolePrefix: true,
      withNextRolePrefix: false,
      withBackRolePrefix: false,
    },
  ];

  const studentTabsNavigationInfo = [
    {
      next: "setup",
      current: "intro",
      back: null,
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "faculties",
      current: "setup",
      back: "intro",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "accounting",
      current: "faculties",
      back: "setup",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "feedback",
      current: "accounting",
      back: "faculties",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "calendar",
      current: "feedback",
      back: "accounting",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "term-of-use",
      current: "calendar",
      back: "feedback",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "chat",
      current: "term-of-use",
      back: "calendar",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "market-place",
      current: "chat",
      back: "term-of-use",
      withCurrentRolePrefix: true,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: "collab",
      current: "market-place",
      back: "chat",
      withCurrentRolePrefix: true,
      withNextRolePrefix: false,
      withBackRolePrefix: true,
    },
    {
      next: `profile`,
      current: "collab",
      back: "market-place",
      withCurrentRolePrefix: false,
      withNextRolePrefix: true,
      withBackRolePrefix: true,
    },
    {
      next: null,
      current: "profile",
      back: "collab",
      withCurrentRolePrefix: true,
      withNextRolePrefix: false,
      withBackRolePrefix: false,
    },
    {
      next: null,
      current: `tutor-profile`,
      back: null,
      withCurrentRolePrefix: true,
      withNextRolePrefix: false,
      withBackRolePrefix: true,
    },
  ];

  const currentTabInfo = (
    user.role === "student"
      ? studentTabsNavigationInfo
      : tutorTabsNavigationInfo
  ).find((tab) =>
    tab.checkWholeUrl
      ? tab.current === location.pathname
      : !tab.withCurrentRolePrefix
      ? tab.current === location.pathname.split("/")[1]
      : tab.current === currentTab
  );

  const nextTabInfo = (
    isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo
  ).find((tab) => {
    return !tab.withNextRolePrefix
      ? tab.back === location.pathname.split("/")[1]
      : tab.back === currentTab;
  });
  const backTabInfo = (
    isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo
  ).find((tab) =>
    !tab.withBackRolePrefix
      ? tab.next === location.pathname.split("/")[1]
      : tab.next === currentTab
  );

  const isNextTabExist = currentTabInfo?.next;
  const isBackTabExist = currentTabInfo?.back;

  const onNext = () => {
    currentTabInfo.withNextRolePrefix
      ? navigate(`/${user.role}/${currentTabInfo.next}`)
      : navigate(`/${currentTabInfo.next}`);
  };

  const onBack = () => {
    currentTabInfo.withBackRolePrefix
      ? navigate(`/${user.role}/${currentTabInfo.back}`)
      : navigate(`/${currentTabInfo.back}`);
  };

  return (
    <div style={actionsStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="" style={{ width: "120px" }}>
            <TAButton
              type="button"
              buttonText={"Back"}
              handleClick={onBack}
              disabled={
                (!saveDisabled &&
                  (loading || backDisabled || !isBackTabExist)) ||
                user.role === "admin"
              }
            />
            {/* <button type='button' onClick={onBack} className="back-btn action-btn btn"
                            disabled={!saveDisabled && (loading || backDisabled || !isBackTabExist) || user.role === "admin"}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"}  width={20} height={23}  />
                                </div>
                                <p className="button__text"><FaChevronLeft />Back</p>
                            </div>
                        </button> */}
          </div>

          <div className="" style={{ width: "120px" }}>
            <TAButton
              type="button"
              buttonText={"Edit"}
              handleClick={onEdit}
              disabled={editDisabled}
            />
            {/* <button onClick={onEdit} type='button' className="edit-btn action-btn btn"
                            disabled={editDisabled}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"}  width={20} height={23} />
                                </div>
                                <p className="button__text">Edit</p>
                            </div>
                        </button> */}
          </div>
          <div className="" style={{ width: "120px" }}>
            <TAButton
              loading={loading}
              type="submit"
              buttonText={SaveText}
              handleClick={onSave}
              className={`save-btn
                    ${
                      unSavedChanges && !saveDisabled
                        ? "blinking-button saving-btn"
                        : ""
                    }`}
              disabled={saveDisabled || loading}
            />
            {/* <Button handleClick={onSave} className={`save-btn action-btn btn 
                        ${(unSavedChanges && !saveDisabled) ? 'blinking-button saving-btn' : ''}`} type="submit" loading={loading}
                            disabled={saveDisabled || loading} >
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"}  width={20} height={23} style={{
                                        animation: loading ? "spin 2s linear infinite" : 'none',
                                    }} />
                                </div>
                                <p className="button__text">{SaveText}</p>
                            </div>
                        </Button> */}
          </div>
          <div className="" style={{ width: "120px" }}>
            <TAButton
              type="button"
              buttonText={"Next"}
              handleClick={onNext}
              disabled={
                (!saveDisabled && loading) ||
                !isNextTabExist ||
                nextDisabled ||
                user.role === "admin"
                // || currentTab === STEPS[tutor.Step]
              }
            />
            {/* <button onClick={onNext}
                            disabled={(!saveDisabled && (loading))
                                || !isNextTabExist || nextDisabled
                                || user.role === 'admin'
                                // || currentTab === STEPS[tutor.Step]
                            }
                            type='button' className="next-btn action-btn btn">
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} width={20} height={23} />
                                </div>
                                <p className="button__text">Next <FaChevronRight /> </p>
                            </div>
                        </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
