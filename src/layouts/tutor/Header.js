import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_STATUS, statesColours } from "../../constants/constants";
import { useClerk } from "@clerk/clerk-react";
import Tooltip from "../../components/common/ToolTip";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaSignOutAlt } from "react-icons/fa";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";
import { moment } from '../../config/moment'
import educationVideo from '../../assets/videos/education.mp4'
import collabVideo from '../../assets/videos/collaboration.mp4'
import feedbackVideo from '../../assets/videos/feedback.mp4'
import introVideo from '../../assets/videos/intro.mp4'
import motivateVideo from '../../assets/videos/motivation.mp4'
import calenderVideo from '../../assets/videos/calender.mp4'
import facultiesVideo from '../../assets/videos/faculties.mp4'
import setupVideo from '../../assets/videos/setup.mp4'
import marketplaceVideo from '../../assets/videos/marketplace.mp4'
import { PiVideoBold } from "react-icons/pi";

import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import Avatar from "../../components/common/Avatar";

const Header = () => {
  const { signOut } = useClerk();
  let nav = useNavigate();
  let location = useLocation();
  const { user } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState("intro");
  const [filteredSessions, setFilteredSessions] = useState([])
  const { sessions } = useSelector(state => state.tutorSessions)
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useDispatch();
  let [screen_name, set_screen_name] = useState(
    window.localStorage.getItem("tutor_screen_name")
  );

  let [tutorState, setTutorState] = useState("Pending");
  const { tutor } = useSelector((state) => state.tutor);
  const screenname = localStorage.getItem("tutor_screen_name");
  const scrollRef = useRef(null);
  const scrollStep = 100; // Adjust the scroll step as needed

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollStep;
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

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollStep;
    }
  };

  useEffect(() => {
    const element = document.getElementById("tutor-tab-header-list-active");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.pathname, activeTab]);

  const tabs = [
    { url: "/tutor/intro", name: "Introduction", video: introVideo },
    { url: "/tutor/setup", name: "Tutor Setup", video: setupVideo },
    { url: "/tutor/education", name: "Education", video: educationVideo },
    { url: "/tutor/rates", name: "Motivate", video: motivateVideo },
    { url: "/tutor/accounting", name: "Accounting", },
    { url: "/tutor/subjects", name: "Subjects", video: facultiesVideo },
    { url: "/tutor/scheduling", name: "Scheduling", video: calenderVideo },
    { url: "/tutor/feedback", name: "Feedback", video: feedbackVideo },
    { url: "/tutor/my-students", name: "My students" },
    { url: "/tutor/term-of-use", name: "Terms Of Use" },
    { url: "/tutor/chat", name: "Message Board", },
    { url: "/tutor/market-place", name: "Market place", video: marketplaceVideo },
    { url: "/tutor/agency", name: "Agency" },
    { url: "/collab", name: "Collaboration", common: true, video: collabVideo },
    { url: `/tutor/tutor-profile/${tutor.AcademyId}`, name: "Profile", },
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

  const getId = (tab) => {
    if (tab.common) {
      if (location.pathname === tab.url) {
        return "tutor-tab-header-list-active"
      }
      return '';
    } else {
      const locationSegment = location.pathname.split('/')[2];
      const tabSegment = tab.url.split('/')[2];
      if (locationSegment === tabSegment) {
        return 'tutor-tab-header-list-active'
      }
      return '';
    }
  }

  useEffect(() => {

    const currentTime = moment();

    const filteredSessions = sessions.filter(session => {
      const sessionEndDate = moment(session.end);
      const diffMinutes = sessionEndDate.diff(currentTime, 'minutes');
      return diffMinutes <= 10 && !session.tutorRating;
    });
    setFilteredSessions(filteredSessions)
  }, [sessions])

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
          <FaArrowAltCircleLeft size={30} />
        </div>
        <div
          className={`screen-name rounded align-items-center px-1`}
          style={{
            fontSize: "14px",
            whiteSpace: "nowrap",
            marginLeft: "20px",
            display: !tutor.TutorScreenname ? "none" : "flex",
            color: statesColours[tutor.Status]?.bg,
          }}
        >
          <div>
            <Avatar avatarSrc={tutor.Photo} size="35" indicSize="8px" />
          </div>
          <div className="flex">
            <div style={{ fontWeight: "bold" }}>{tutor.TutorScreenname}</div>
            <div style={{ fontSize: "12px", fontWeight: "700" }}>
              {StatusValues[tutor.Status]}
            </div>
          </div>
        </div>
        <ul ref={scrollRef}
          className={`header`}
          style={{
            background:
              tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) && user.role !== 'admin'
                ? "#737476"
                : "inherit",
            pointerEvents:
              tutor.Status === (PROFILE_STATUS.PENDING || !tutor.AcademyId) && user.role !== 'admin'
                ? "none"
                : "auto",
            width: "calc(100% - 300px)",
            margin: "0 50px 0 50px ",
          }}
        >
          {tabs.map((tab) => {
            return (
              <>
                <li
                  key={tab.url}
                  data-url={tab.url}
                  onClick={() => nav(tab.url)}
                  id={getId(tab)}
                >
                  <p className="m-0" style={{ transform: "skew(41deg, 0deg)" }}>
                    {tab.name}
                    {!!filteredSessions.length && tab.url === '/tutor/feedback' &&
                      <span className="text-bg-danger p-1 rounded-circle" style={{
                        display: "inline-flex",
                        width: "24px",
                        height: "24px",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>{filteredSessions.length}</span>}
                  </p>
                </li>
                {tab.video && <div className="cursor-pointer mx-2 video-nav-icon" style={{ transform: "skew(0)" }}
                  onClick={() => setIsOpen(tab.url)}>
                  <PiVideoBold color={location.pathname === tab.url ? '#ff4e4e' : "rgb(153 132 132)"}
                    size="28" className="video-nav-icon" />
                </div>}
                <div className="text-light" style={{ fontWeight: "bold" }}>|</div>
              </>
            );
          })}
        </ul>
        <TabInfoVideoToast video={tabs.find(tab => tab.url === isOpen)?.video} isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className="d-flex border rounded p-1 justify-content-center align-items-center "
          style={{ marginRight: "30px", cursor: "pointer" }}
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
