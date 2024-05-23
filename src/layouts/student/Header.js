import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getBookedSlot } from "../../axios/student";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import Tooltip from "../../components/common/ToolTip";
import { useClerk } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";
import { moment } from "../../config/moment";
import { statesColours } from "../../constants/constants";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const dispatch = useDispatch();
  const [filteredSessions, setFilteredSessions] = useState([]);
  const { sessions } = useSelector((state) => state.studentSessions);
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

  let handle_scroll_right = () => {
    let div = document.querySelector(".tutor-tab-header");
    let scroll_elem = div.children[1];
    let w = scroll_elem.offsetWidth;
    scroll_elem.scrollLeft = w;
  };

  let handle_scroll_left = () => {
    let div = document.querySelector(".tutor-tab-header");
    let scroll_elem = div.children[1];
    let w = scroll_elem.offsetWidth;
    scroll_elem.scrollLeft = -w;
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
      <div
        className={`screen-name btn-success rounded  p-1 flex-column align-items-center`}
        style={{
          fontSize: "14px",
          display: !student.ScreenName ? "none" : "flex",
          position: "fixed",
          top: "1px",
          zIndex: "999",
          left: "3%",
          background: statesColours[student.Status]?.bg,
          color: statesColours[student.Status]?.color,
        }}
      >
        <div style={{ fontWeight: "bold" }}>{student.ScreenName}</div>
        <div style={{ fontSize: "12px", fontWeight: "700" }}>
          {StatusValues[student.Status]}
        </div>
      </div>

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
          onClick={handle_scroll_left}
        >
          <div style={{ opacity: "1" }}>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <ul
          id=""
          className={` header`}
          style={{
            background: "inherit",
            pointerEvents: "auto",
            width: "calc(100% - 300px)",
            margin: "0 150px 0 150px",
          }}
        >
          {tabs.map((tab) => (
            <li
              key={tab.url}
              data-url={tab.url}
              onClick={handleTabClick}
              id={
                activeTab.includes(tab.url) ||
                  (activeTab.split("/").length > 3 &&
                    activeTab.split("/")[2] === tab.url)
                  ? "tutor-tab-header-list-active"
                  : ""
              }
            >
              <p className="m-0" style={{ transform: "skew(41deg, 0deg)" }}>
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
          style={{ marginRight: "60px", cursor: "pointer" }}
          onClick={() => signOut(() => handleSignOut())}
        >
          <p className="text-danger m-0">Signout</p>
          <Tooltip text={"signout"} direction="bottomright">
            <FaSignOutAlt color="red" />
          </Tooltip>
        </div>
        <div
          className="scroller-right"
          onClick={handle_scroll_right}
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
        ></div>
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
          onClick={handle_scroll_right}
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Header;
