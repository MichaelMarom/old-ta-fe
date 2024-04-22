import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_STATUS, statesColours } from "../../constants/constants";
import { useClerk } from "@clerk/clerk-react";
import Tooltip from "../../components/common/ToolTip";
import { FaSignOutAlt } from "react-icons/fa";
import { setUser } from "../../redux/auth_state/auth";
import { setTutor } from "../../redux/tutor_store/tutorData";
import { setStudent } from "../../redux/student_store/studentData";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  let location = useLocation();
  const [activeTab, setActiveTab] = useState("intro");
  const dispatch = useDispatch();
  let [screen_name, set_screen_name] = useState(
    window.localStorage.getItem("tutor_screen_name")
  );

  let [tutorState, setTutorState] = useState("Pending");
  const { tutor } = useSelector((state) => state.tutor);
  const screenname = localStorage.getItem("tutor_screen_name");
  const handleSignOut = () => {
    localStorage.clear();
    dispatch(setUser({}));
    dispatch(setTutor({}));
    dispatch(setStudent({}));
    //setTutor tonull
    //setStudent tonull

    nav("/login");
  };

  useEffect(() => {
    const element = document.getElementById("tutor-tab-header-list-active");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.pathname, activeTab]);

  const tabs = [
    { url: "/tutor/intro", name: "Introduction" },
    { url: "/tutor/setup", name: "Tutor Setup" },
    { url: "/tutor/education", name: "Education" },
    { url: "/tutor/rates", name: "Motivate" },
    { url: "/tutor/accounting", name: "Accounting" },
    { url: "/tutor/subjects", name: "Subjects" },
    { url: "/tutor/scheduling", name: "Scheduling" },
    { url: "/tutor/feedback", name: "Feedback" },
    { url: "/tutor/my-students", name: "My students" },
    { url: "/tutor/term-of-use", name: "Terms Of Use" },
    { url: "/tutor/chat", name: "Message Board" },
    { url: "/tutor/market-place", name: "Market place" },
    { url: "/collab", name: "Collaboration" },
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
    set_screen_name(localStorage.getItem("tutor_screen_name"));
  }, [screenname]);

  useEffect(() => {
    setTutorState(tutor.Status);
  }, [tutor]);

  useEffect(() => {
    const currentTab = location.pathname;
    setActiveTab(currentTab);
  }, [location]);

  let handleTabClick = (e) => {
    let url = e.currentTarget.dataset.url;
    nav(`${url}`);

    let urls = [
      "intro",
      "setup",
      "education",
      "rates",
      "accounting",
      "subjects",
      "my-students",
      "scheduling",
      "term-of-use",
      "market-place",
      "collaboration",
      "tutor-profile",
    ];
    let new_index = urls.indexOf(url);
    window.localStorage.setItem("tab_index", new_index);
  };

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

  return (
    <>
      <div
        className={`screen-name btn-success rounded  p-1 flex-column align-items-center`}
        style={{
          fontSize: "14px",
          display: !tutor.TutorScreenname ? "none" : "flex",
          position: "fixed",
          top: "1px",
          zIndex: "999",
          left: "3%",
          background: statesColours[tutorState]?.bg,
          color: statesColours[tutorState]?.color,
        }}
      >
        <div style={{ fontWeight: "bold" }}>{screen_name}</div>
        <div style={{ fontSize: "12px", fontWeight: "700" }}>
          {StatusValues[tutor.Status]}
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
            background:
              tutor.Status === PROFILE_STATUS.PENDING || !tutor.AcademyId
                ? "#737476"
                : "inherit",
            pointerEvents:
              tutor.Status === PROFILE_STATUS.PENDING || !tutor.AcademyId
                ? "none"
                : "auto",
            width: "calc(100% - 300px)",
            margin: "0 200px ",
          }}
        >
          {tabs.map((tab) => {
            return (
              <li
                key={tab.url}
                data-url={tab.url}
                onClick={handleTabClick}
                id={
                  activeTab === tab.url.replace(/ /g, "%20") ||
                  (activeTab.split("/").length > 3 &&
                    activeTab.split("/").slice(0, -1).join() ===
                      tab.url.split("/").slice(0, -1).join())
                    ? "tutor-tab-header-list-active"
                    : ""
                }
              >
                <p className="m-0" style={{ transform: "skew(44deg, 0deg)" }}>
                  {tab.name}{" "}
                </p>
              </li>
            );
          })}
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
