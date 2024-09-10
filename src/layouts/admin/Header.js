import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useClerk } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/auth/auth";
import { setTutor } from "../../redux/tutor/tutorData";
import { setStudent } from "../../redux/student/studentData";

const Header = () => {
  const { signOut } = useClerk();

  const { count } = useSelector((state) => state.newSubj);

  let nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: "tutor-data", name: "Tutor" },
    { id: "student-data", name: "Student" },
    { id: "marketing", name: "Marketing" },
    { id: "email-templates", name: "Email-Templates" },

    { id: "new-subject", name: "New Subject" },
    { id: "accounting", name: "Accounting" },
    { id: "chat", name: "Communications" },
    // { id: 'tos', label: 'TOS' },
    // { id: 'intro', label: 'Plateform Intro' },
  ];

  let handleTabClick = (e) => {
    nav(`/admin/${e.currentTarget.dataset.url}`);
  };

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    setActiveTab(location.pathname);
  }, [location]);

  let [screen_name, set_screen_name] = useState("");

  useEffect(() => {
    let name = window.localStorage.getItem("admin_screen_name");
    set_screen_name(name);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("tutor_user_id");
    localStorage.removeItem("user");
    dispatch(setUser({}));
    dispatch(setTutor({}));
    dispatch(setStudent({}));
    console.log('cliekc')
    nav("/login");
  };

  return (
    <>
      <div
        className=" shadow-sm d-flex align-items-center"
        style={{ background: "rgb(33, 47, 61)" }}
      >
        <div
          className="screen-name rounded p-2 m-2"
          style={{
            display: screen_name === "null" ? "none" : "flex",
            fontWeight: "bold",
            fontSize: "12px",
            color: "#fff",
            whiteSpace: "nowrap",
            padding: "0 5px",
            height: "30px",
          }}
        >
          {JSON.parse(localStorage.getItem("user"))?.email}
        </div>

        <ul
          className="header h-100"
          style={{
            background: "inherit",
            pointerEvents: "auto",
            width: "calc(100% - 400px)",
            margin: "0 50px",
          }}
        >
          {tabs.map((tab) => (
            <>
              <li
              className="navitem navitem-li"
                key={tab.id}
                data-url={tab.id}
                onClick={handleTabClick}
                id={
                  activeTab.split("/")[2] === tab.id
                    ? "tutor-tab-header-list-active1"
                    : ""
                }
              >
                <h5
                  className="m-0"
                  style={{fontSize: "14px" }}
                >
                  {tab.name}
                  {tab.name === "New Subject" && !!count && (
                    <span
                      className=" text-bg-danger p-1 rounded-circle"
                      style={{
                        display: "inline-flex",
                        width: "19px",
                        height: "19px",
                        flexDirection: "row",
                        fontSize: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        bottom: "6px",
                        marginRight: "5px",
                        left:"0"
                      }}
                    >
                      {count}
                    </span>
                  )}
                </h5>
              </li>
            </>
          ))}
        </ul>

        <div
          className="d-flex gap-2 border rounded p-1 justify-content-center align-items-center "
          style={{ marginRight: "20px", cursor: "pointer" }}
          onClick={() => signOut(() => handleSignOut())}
        >
          <h6 className="text-light m-0">Signout</h6>
          <FaSignOutAlt color="white" />
        </div>
      </div>
    </>
  );
};

export default Header;
