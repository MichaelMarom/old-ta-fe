import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getBookedSlot } from "../../axios/student";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaSignOutAlt } from "react-icons/fa";
import Tooltip from "../../components/common/ToolTip";
import { useClerk } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";
import { moment } from "../../config/moment";
import { statesColours } from "../../constants/constants";
import Avatar from "../../components/common/Avatar";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const dispatch = useDispatch();
  const [filteredSessions, setFilteredSessions] = useState([]);
  const { sessions } = useSelector((state) => state.studentSessions);
  const scrollRef = useRef();
  const scrollStep = 100;
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
    { name: "Collaboration", url: "/collab" },
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
    const element = document.getElementById("tutor-tab-header-list-active");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, activeTab]);

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
    localStorage.removeItem('access_token')
    localStorage.removeItem('student_user_id')
    localStorage.removeItem('tutor_user_id')
    localStorage.removeItem('user')
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
      return diffMinutes <= 10 && !session.rating;
    });
    setFilteredSessions(filteredSessions);
  }, [sessions]);

  return (
    <>
      <div className="tutor-tab-header shadow-sm">
        <div
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
            <FaArrowAltCircleLeft size={30} />
          </div>
        </div>
        <div
          className={`screen-name rounded align-items-center px-1`}
          style={{
            fontSize: "14px",
            whiteSpace:"nowrap",
            marginLeft:"20px",
            display: !student.ScreenName ? "none" : "flex",
            // background: statesColours[student.Status]?.bg,
            color: statesColours[student.Status]?.bg,
          }}
        >
          <div>
            <Avatar avatarSrc={student.Photo} size="35"  indicSize="8px" />
          </div>
          <div className="flex">

          <div style={{ fontWeight: "bold" }}>{student.ScreenName}</div>
          <div style={{ fontSize: "12px", fontWeight: "700" }}>
            {StatusValues[student.Status]}
          </div>
          </div>
        </div>
        <ul ref={scrollRef}
          className={``}
          style={{
            background: "inherit",
            pointerEvents: "auto",
            width: "calc(100% - 300px)",
            margin: "0 50px",
           
          }}
        >
          {tabs.map((tab) => (
            <li
              key={tab.url}
              data-url={tab.url}
              onClick={handleTabClick}
              className="border"
              id={
                activeTab.includes(tab.url) ||
                  (activeTab.split("/").length > 3 &&
                    activeTab.split("/")[2] === tab.url)
                  ? "tutor-tab-header-list-active"
                  : ""
              }
            >
              <p className="m-0" style={{ transform: "skew(40deg, 0deg)", fontSize:"14px"  }}>
                {tab.name}
                {!!filteredSessions.length && tab.url === "/student/feedback" && (
                  <span
                    className=" text-bg-danger p-1 rounded-circle"
                    style={{
                      display: "inline-flex",
                      width: "24px",
                      height: "24px",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {filteredSessions.length}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
        <div
          className="d-flex border rounded p-1 justify-content-center align-items-center "
          style={{ marginRight: "20px", cursor: "pointer" }}
          onClick={() => signOut(() => handleSignOut())}
        >
          <p className="text-danger m-0">Signout</p>
          <Tooltip text={"signout"} direction="bottomright">
            <FaSignOutAlt color="red" />
          </Tooltip>
        </div>
        <div
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
          <FaArrowAltCircleRight size={30} />
        </div>
      </div>
    </>
  );
};

export default Header;
