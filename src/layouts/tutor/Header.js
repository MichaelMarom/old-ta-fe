import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PROFILE_STATUS,
  statesColours,
  wholeDateFormat,
} from "../../constants/constants";
import { useClerk } from "@clerk/clerk-react";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaExclamation,
  FaSignOutAlt,
} from "react-icons/fa";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";
import { moment } from "../../config/moment";
import educationVideo from "../../assets/videos/education.mp4";
import collabVideo from "../../assets/videos/collaboration.mp4";
import feedbackVideo from "../../assets/videos/feedback.mp4";
import introVideo from "../../assets/videos/intro.mp4";
import motivateVideo from "../../assets/videos/motivation.mp4";
import calenderVideo from "../../assets/videos/calender.mp4";
import facultiesVideo from "../../assets/videos/faculties.mp4";
import setupVideo from "../../assets/videos/setup.mp4";
import marketplaceVideo from "../../assets/videos/marketplace.mp4";
import { PiVideoBold } from "react-icons/pi";

import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import Avatar from "../../components/common/Avatar";
import { showDate } from "../../utils/moment";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  let location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("intro");
  const [filteredSessions, setFilteredSessions] = useState([]);
  const { sessions } = useSelector((state) => state.tutorSessions);
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpened, setProfileDropdownOpened] = useState(false);

  const dispatch = useDispatch();

  const { missingFields } = useSelector((state) => state.missingFields);
  const { tutor } = useSelector((state) => state.tutor);
  const scrollRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const scrollStep = 500; // Adjust the scroll step as needed

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollStep;
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("tutor_user_id");
    localStorage.removeItem("user");
    dispatch(setUser({}));
    dispatch(setTutor({}));
    dispatch(setStudent({}));
    nav("/login");
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollStep;
    }
  };

  useEffect(() => {
    const element = document.getElementById("tutor-tab-header-list-active1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.pathname, activeTab]);

  // Handle click outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tabs = [
    { url: "/tutor/intro", name: "Introduction", video: introVideo },
    { url: "/tutor/setup", name: "Setup", video: setupVideo },
    { url: "/tutor/education", name: "Education", video: educationVideo },
    { url: "/tutor/discounts", name: "Motivate", video: motivateVideo },
    { url: "/tutor/accounting", name: "Accounting" },
    { url: "/tutor/subjects", name: "Subjects", video: facultiesVideo },
    { url: "/tutor/scheduling", name: "Scheduling", video: calenderVideo },
    { url: "/tutor/feedback", name: "Feedback", video: feedbackVideo },
    { url: "/tutor/my-students", name: "My students" },
    { url: "/tutor/term-of-use", name: "Terms Of Use" },
    { url: "/tutor/chat", name: "Message Board" },
    {
      url: "/tutor/market-place",
      name: "Market place",
      video: marketplaceVideo,
    },
    { url: "/tutor/agency", name: "Agency" },
    { url: "/collab", name: "Collaboration", common: true, video: collabVideo },
    { url: `/tutor/tutor-profile/${tutor.AcademyId}`, name: "Profile" },
  ];

  const StatusValues = {
    "under-review": "Under Review",
    pending: "Pending",
    suspended: "Suspended",
    active: "Active",
    disapproved: "Disapproved",
    closed: "Closed",
  };

  useEffect(() => {
    const currentTab = location.pathname;
    setActiveTab(currentTab);
  }, [location]);

  const getId = (tab) => {
    if (tab.common) {
      if (location.pathname === tab.url) {
        return "tutor-tab-header-list-active1";
      }
      return "";
    } else {
      const locationSegment = location.pathname.split("/")[2];
      const tabSegment = tab.url.split("/")[2];
      if (locationSegment === tabSegment) {
        return "tutor-tab-header-list-active1";
      }
      return "";
    }
  };

  useEffect(() => {
    const currentTime = moment();

    const filteredSessions = sessions.filter((session) => {
      const sessionEndDate = moment(session.end);
      const diffMinutes = sessionEndDate.diff(currentTime, "minutes");
      return diffMinutes <= 10 && !session.ratingByTutor;
    });
    setFilteredSessions(filteredSessions);
  }, [sessions]);

  return (
    <>
      <div className="tutor-tab-header shadow-sm">
        <div
         ref={profileDropdownRef}
          className={`screen-name position-relative flex-column px-1 gap-2`}
          style={{
            width: "170px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            marginLeft: "20px",
            height: "50px",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            // display: !tutor.TutorScreenname ? "none" : "flex",
            color: statesColours[tutor.Status]?.bg,
          }}
        >
          {!tutor.TutorScreenname ? (
            <div
              className="screen-name position-relative d-flex align-items-center px-1 gap-2"
              style={{ width: "170px", marginLeft: "20px", height: "50px" }}
            >
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={() =>
                  setProfileDropdownOpened(!profileDropdownOpened)
                }
              >
                <div>
                  <div
                    className="bg-secondary rounded-circle"
                    style={{ width: "35px", height: "35px" }}
                  ></div>
                </div>
                <div className="ms-2">
                  <div
                    className="bg-secondary"
                    style={{
                      width: "100px",
                      height: "14px",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <div
                    className="bg-secondary mt-1"
                    style={{
                      width: "80px",
                      height: "12px",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                {/* <div className="ms-2">
                <div
                  className="bg-secondary"
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                ></div>
              </div> */}
                <div
                  style={{
                    marginLeft: "5px",
                    transition: "transform 0.3s ease-in-out",
                    transform: profileDropdownOpened
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {profileDropdownOpened ? (
                    <FaChevronUp color="white" />
                  ) : (
                    <FaChevronDown color="white" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() =>
                setProfileDropdownOpened(!profileDropdownOpened)
              }
            >
              <div>
                <Avatar
                  avatarSrc={tutor.Photo}
                  size="35"
                  indicSize="8px"
                  borderSize="1px"
                />
              </div>
              <div className="">
                <div style={{ fontWeight: "bold" }}>
                  {tutor.TutorScreenname}
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700" }}>
                  {StatusValues[tutor.Status]}
                </div>
              </div>
              <div
                style={{
                  marginLeft: "5px",
                  transition: "transform 0.3s ease-in-out",
                  transform: profileDropdownOpened
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                {profileDropdownOpened ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
          )}
          <div
           
            className={`position-absolute text-bg-light shadow w-100`}
            style={{
              marginTop: "50px",
              maxHeight: profileDropdownOpened ? "200px" : "0",
              transition: "max-height 0.3s ease-in-out",
              overflow: "hidden",
              border: "1px solid lightgray",
              borderTop: "none",
              zIndex: 9,
            }}
          >
            <ul
              className="d-flex flex-column align-items-start p-2"
              style={{ background: "#212f3c", color: "white" }}
            >
              <li
                className="p-0 text-start border-bottom w-100"
                style={{ fontSize: "12px" }}
              >
                <span style={{ marginRight: "5px" }}>
                  <FaClock />
                </span>
                {showDate(moment().toDate(), wholeDateFormat)}
              </li>
              <li
                style={{ color: "#e14c4c" }}
                className="p-0 text-start w-100"
                onClick={() => signOut(() => handleSignOut())}
              >
                Signout
                <span style={{ marginLeft: "5px" }}>
                  <FaSignOutAlt />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          onClick={handleScrollLeft}
          style={{ marginLeft: "30px" }}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronBackOutline color="gray" size={30} />
        </div>
        <ul
          ref={scrollRef}
          className={`header`}
          style={{
            background: "inherit",
            // tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
            // user.role !== "admin"
            //   ? "#737476"
            //   : "inherit",
            // pointerEvents:
            //   tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
            //   user.role !== "admin"
            //     ? "none"
            //     : "auto",
            width: "calc(100% - 300px)",
            margin: "0 -10px",
            zIndex: 1,
          }}
        >
          {tabs.map((tab) => {
            return (
              (user.role !== "admin" || tab.url !== "/collab") && (
                <div
                  id={getId(tab)}
                  key={tab.url}
                  className="navitem d-flex justify-content-center align-items-center"
                >
                  <li
                    key={tab.url}
                    className="navitem-li"
                    data-url={tab.url}
                    onClick={() =>
                      ((tutor.Status !== PROFILE_STATUS.PENDING &&
                        tutor.AcademyId) ||
                        user.role === "admin") &&
                      nav(tab.url)
                    }
                    style={{
                      color:
                        tutor.Status ===
                          (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
                        user.role !== "admin"
                          ? "#b5b5b5"
                          : "white",
                      cursor:
                        tutor.Status ===
                          (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
                        user.role !== "admin"
                          ? "not-allowed"
                          : "pointer",
                      // pointerEvents:
                      //   tutor.Status ===
                      //     (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
                      //   user.role !== "admin"
                      //     ? "none"
                      //     : "auto",
                    }}
                  >
                    <h5 className="m-0 d-flex gap-2">
                      {!!missingFields.find(
                        (field) => field.tab === tab.name
                      ) && (
                        <span
                          className="rounded-circle m-1 bg-light d-flex justify-content-center align-items-center"
                          style={{ width: "15px", height: "15px" }}
                        >
                          <FaExclamation
                            className="blinking-button"
                            color="rgb(255, 78, 78)"
                            size={10}
                          />
                        </span>
                      )}
                      {tab.name}
                      {!!filteredSessions.length &&
                        tab.url === "/tutor/feedback" && (
                          <span
                            className="text-bg-danger p-1 rounded-circle"
                            style={{
                              display: "inline-flex",
                              width: "19px",
                              height: "19px",
                              fontSize: "10px",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {filteredSessions.length}
                          </span>
                        )}
                    </h5>
                  </li>
                  {tab.video && (
                    <div
                      className="cursor-pointer mx-2 video-nav-icon"
                      style={{ transform: "skew(0)" }}
                      onClick={() =>
                        ((tutor.Status !== PROFILE_STATUS.PENDING &&
                          tutor.AcademyId) ||
                          user.role === "admin") &&
                        setIsOpen(tab.url)
                      }
                    >
                      <PiVideoBold
                        color={
                          location.pathname === tab.url
                            ? "#ff4e4e"
                            : "rgb(153 132 132)"
                        }
                        size="28"
                        className="video-nav-icon"
                      />
                    </div>
                  )}
                </div>
              )
            );
          })}
        </ul>

        <div
          onClick={handleScrollRight}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronForwardOutline color="gray" size={30} />
        </div>

        <TabInfoVideoToast
          video={tabs.find((tab) => tab.url === isOpen)?.video}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
};

export default Header;
