import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChevronDown,
  FaChevronLeft,
  FaClock,
  FaChevronRight,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import { useClerk } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";
import { moment } from "../../config/moment";
import { statesColours, wholeDateFormat } from "../../constants/constants";
import Avatar from "../../components/common/Avatar";

import { showDate } from "../../utils/moment";
import collabVideo from "../../assets/videos/collaboration.mp4";
import { PiVideoBold } from "react-icons/pi";
import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const [filteredSessions, setFilteredSessions] = useState([]);
  const { sessions } = useSelector((state) => state.studentSessions);
  const [profileDropdownOpened, setProfileDropdownOpened] = useState(false);
  const scrollRef = useRef();
  const profileDropdownRef = useRef();
  const scrollStep = 500;
  let location = useLocation();
  

  const { student } = useSelector((state) => state.student);
  const tabs = [
    { name: "Introduction", url: "/student/intro" },
    { name: "Student Setup", url: "/student/setup" },
    { name: "Faculties", url: "/student/faculties" },
    { name: "Accounting", url: "/student/accounting" },
    { name: "Feedback", url: "/student/feedback" },
    { name: "Calender", url: "/student/calender" },
    { name: "Terms Of Use", url: "/student/term-of-use" },
    { name: "Message Board", url: "/student/chat" },
    { name: "Market place", url: "/student/market-place" },
    { name: "Collaboration", url: "/collab", video: collabVideo },
    { name: "Profile", url: "/student/profile" },
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
    const element = document.getElementById("tutor-tab-header-list-active1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollStep;
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollStep;
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

  let handleTabClick = (e) => {
    nav(`${e.currentTarget.dataset.url}`);
  };

  useEffect(() => {
    const currentTime = moment();

    const filteredSessions = sessions.filter((session) => {
      const sessionEndDate = moment(session.end);
      const diffMinutes = sessionEndDate.diff(currentTime, "minutes");
      return diffMinutes <= 10 && !session.ratingByStudent;
    });
    setFilteredSessions(filteredSessions);
  }, [sessions]);

  return (
    <>
      <div className="tutor-tab-header shadow-sm">
        {/* <div
          style={{
            margin: "0 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#efefef",
            opacity: ".7",
            height: "100%",
            transform: "skew(-0deg)",
            width: "50px",
          }}
          className="scroller-left"
          onClick={handleScrollLeft}
        >
          <div style={{ opacity: "1" }}>
            <FaChevronLeft size={20} />
          </div>
        </div> */}
        {/* <div
          className={`screen-name rounded align-items-center px-1`}
          style={{
            fontSize: "14px",
            whiteSpace: "nowrap",
            marginLeft: "20px",
            display: !student.ScreenName ? "none" : "flex",
            color: statesColours[student.Status]?.bg,
          }}
        >
          <div>
            <Avatar avatarSrc={student.Photo} size="35" indicSize="8px"  borderSize="1px"/>
          </div>
          <div className="flex">
            <div style={{ fontWeight: "bold" }}>{student.ScreenName}</div>
            <div style={{ fontSize: "12px", fontWeight: "700" }}>
              {StatusValues[student.Status]}
            </div>
          </div>
        </div> */}

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
            color: statesColours[student.Status]?.bg,
          }}
        >
          {!student.ScreenName ? (
            <div
              className="screen-name position-relative d-flex align-items-center px-1 gap-2"
              style={{ width: "170px", marginLeft: "20px", height: "50px" }}
            >
              <div
                className="d-flex align-items-center"
                onClick={() => setProfileDropdownOpened(!profileDropdownOpened)}
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
              className="d-flex align-items-center"
              onClick={() => setProfileDropdownOpened(!profileDropdownOpened)}
            >
              <div>
                <Avatar
                  avatarSrc={student.Photo}
                  size="35"
                  indicSize="8px"
                  borderSize="1px"
                />
              </div>
              <div className="">
                <div style={{ fontWeight: "bold" }}>{student.ScreenName}</div>
                <div style={{ fontSize: "12px", fontWeight: "700" }}>
                  {StatusValues[student.Status]}
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

        {/* <div
          className={`screen-name position-relative flex-column px-1 gap-2`}
          style={{
            width: "170px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            marginLeft: "20px",
            height: "50px",
            transition: "all 0.3s ease-in-out",
            display: !student.ScreenName ? "none" : "flex",
            color: statesColours[student.Status]?.bg,
          }}
        >
          <div className="d-flex align-items-center">
            <div>
              <Avatar
                avatarSrc={student.Photo}
                size="35"
                indicSize="8px"
                borderSize="1px"
              />
            </div>
            <div className="">
              <div style={{ fontWeight: "bold" }}>{student.ScreenName}</div>
              <div style={{ fontSize: "12px", fontWeight: "700" }}>
                {StatusValues[student.Status]}
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
              onClick={() => setProfileDropdownOpened(!profileDropdownOpened)}
            >
              {profileDropdownOpened ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>

          <div
            ref={profileDropdownRef}
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
              style={{ background: "#212f3c", color: "white" }}
              className="d-flex flex-column align-items-start p-2"
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
        </div> */}
        <div
          onClick={handleScrollLeft}
          style={{ marginLeft: "30px" }}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronBackOutline color="#47c176" size={30} />
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
          {tabs.map((tab) => (
            <div
              id={
                activeTab.includes(tab.url) ||
                (activeTab.split("/").length > 3 &&
                  activeTab.split("/")[2] === tab.url)
                  ? "tutor-tab-header-list-active1"
                  : ""
              }
              key={tab.url}
              className="navitem d-flex justify-content-center align-items-center"
            >
              <li
                data-url={tab.url}
                onClick={handleTabClick}
                className="navitem-li"
                // id={
                //   activeTab.includes(tab.url) ||
                //   (activeTab.split("/").length > 3 &&
                //     activeTab.split("/")[2] === tab.url)
                //     ? "tutor-tab-header-list-active1"
                //     : ""
                // }
              >
                <h5 className="m-0" style={{ fontSize: "14px" }}>
                  {tab.name}
                  {!!filteredSessions.length &&
                    tab.url === "/student/feedback" && (
                      <span
                        className=" text-bg-danger p-1 rounded-circle"
                        style={{
                          display: "inline-flex",
                          width: "19px",
                          height: "19px",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          fontSize: "10px",
                          bottom: "6px",
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
                  onClick={() => setIsOpen(tab.url)}
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
          ))}
        </ul>

        <div
          onClick={handleScrollRight}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronForwardOutline color="#47c176" size={30} />
        </div>
        <TabInfoVideoToast
          video={tabs.find((tab) => tab.url === isOpen)?.video}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        {/* <div
          className="d-flex  gap-2 border rounded p-1 justify-content-center align-items-center "
          style={{ marginRight: "20px", cursor: "pointer" }}
          onClick={() => signOut(() => handleSignOut())}
        >
          <h6 className="text-light m-0">Signout</h6>
          <FaSignOutAlt color="white" />
        </div> */}
        {/* <div
          style={{
            margin: "0 0 0 0",
            background: "#efefef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: ".7",
            height: "100%",
            transform: "skew(-0deg)",
          }}
          className="scroller-right"
          onClick={handleScrollRight}
        >
          <FaChevronRight size={20} />
        </div> */}
      </div>
    </>
  );
};

export default Header;
