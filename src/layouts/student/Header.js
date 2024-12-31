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
  FaExclamation,
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
import { setLessons } from "../../redux/student/studentBookings";
import { socket } from '../../config/socket'
import { toast } from "react-toastify";
import FloatingMessage from "../../components/common/FloatingMessages";
import { BiBell } from "react-icons/bi";
import { setNotifications } from "../../redux/common/notifications";
import { get_user_notification } from "../../axios/common";
import { convertToDate } from "../../components/common/Calendar/Calendar";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const [filteredSessions, setFilteredSessions] = useState([]);
  const { sessions } = useSelector((state) => state.studentSessions);
  const { notifications } = useSelector((state) => state.notifications);
  const { studentMissingFields } = useSelector(
    (state) => state.studentMissingFields
  );
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [profileDropdownOpened, setProfileDropdownOpened] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const scrollRef = useRef();
  const profileDropdownRef = useRef();
  const scrollStep = 500;
  let location = useLocation();
  const [incomingNotificationMessage, setIncomingNotificationMessage] = useState({});

  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    const checkOverflow = () => {
      const el = scrollRef.current;
      if (el) {
        const hasOverflow =
          el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow(); // Check on mount

    // Optional: Check on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const tabs = [
    { name: "Introduction", url: "/student/intro" },
    { name: "Setup", url: "/student/setup" },
    { name: "Find Your Tutor", url: "/student/find-tutor" },
    { name: "Accounting", url: "/student/accounting" },
    { name: "Feedback", url: "/student/feedback" },
    { name: "Calendar", url: "/student/calendar" },
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

  // useEffect(() => {
  //   const element = document.getElementById("tutor-tab-header-list-active1");
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [location.pathname, activeTab]);

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

  useEffect(() => {
    student.AcademyId && get_user_notification(student.AcademyId).then(result => !result?.data?.response && dispatch(setNotifications(result)))
  }, [student.AcademyId])

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("tutor_user_id");
    localStorage.removeItem("user");
    dispatch(setUser({}));
    dispatch(setTutor({}));
    dispatch(setLessons([]));

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
      return diffMinutes <= 10 && !session.ratingByStudent && session.type !== "reserved"
    });
    setFilteredSessions(filteredSessions);
  }, [sessions]);

  useEffect(() => {
    socket.on('notification', (data) => {
      // toast.info(data.doerName)
      console.log(notifications, 'deidjei')
      dispatch(setNotifications([...notifications, { ...data, date: new Date() }]))
      setIncomingNotificationMessage({ title: data.title, message: data.message, doerName: data.doerName });
    });

    return () => {
      socket.off('notification');
    };
  }, [notifications]);
  console.log(notifications)

  return (
    <div className="tutor-tab-header shadow-sm" style={{ background: "#074b90" }}>
      <div>
        {incomingNotificationMessage.title && (
          <FloatingMessage
            message={incomingNotificationMessage}
            setIncomingNotificationMessage={setIncomingNotificationMessage}
          />
        )}
      </div>
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
              className="d-flex align-items-center cursor-pointer"
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
            className="d-flex align-items-center  cursor-pointer"
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
                <FaClock color="white" />
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
                <FaSignOutAlt color="#e14c4c" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      {isOverflowing && (
        <div
          onClick={handleScrollLeft}
          style={{ marginLeft: "30px" }}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronBackOutline color="#47c176" size={30} />
        </div>
      )}
      <ul
        ref={scrollRef}
        className={`header`}
        style={{
          background: "inherit",
          // justifyContent: "center",
          // tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
          // user.role !== "admin"
          //   ? "#737476"
          //   : "inherit",
          // pointerEvents:
          //   tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) &&
          //   user.role !== "admin"
          //     ? "none"
          //     : "auto",
          width: "calc(100% - 400px)",
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
            >
              <h5
                className="m-0 d-flex align-items-center gap-2"
                style={{ fontSize: "14px" }}
              >
                {!!studentMissingFields.find(
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
                        left: "0",
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
      {isOverflowing && (
        <div
          onClick={handleScrollRight}
          className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
        >
          <IoChevronForwardOutline color="#47c176" size={30} />
        </div>
      )}
      <div className="position-relative d-flex align-items-center h-100 m-2" style={{ color: "white" }}>
        <BiBell size={30}
          style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out" }}
          onClick={() => setIsNotifyOpen(!isNotifyOpen)}
        />
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "5px",
            width: "8px",
            height: "8px",
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        ></span>
        <div
          className={`position-absolute shadow border rounded`}
          style={{
            top: "50px",
            right: "-30px",
            width: "300px",
            overflow: "auto",
            maxHeight: isNotifyOpen ? "200px" : "0",
            transition: "max-height 0.3s ease-in-out",
            color: "white",
            background: "#212f3c",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "40px",
              width: "0",
              height: "0",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid #212f3c",
              zIndex: "1",
              display: isNotifyOpen ? "block" : "none",
            }}
          ></div>
          <div className="d m-0 p-2">
            {notifications.map((notification, index) => (
              <div key={index} className="p-2 border-bottom">
                <strong>{notification.doerName || notification.TutorScreenname || notification.ScreenName}</strong>
                <br />
                <span>{notification.message || notification.text}</span>
                <br />
                <small className="text-muted">{showDate(notification.date, wholeDateFormat)}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabInfoVideoToast
        video={tabs.find((tab) => tab.url === isOpen)?.video}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Header;
