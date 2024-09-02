import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import React from "react";

import "./styles/tutor.css";
import "./styles/tabs.css";
import "./styles/collab.css";
import "./styles/student.css";
import "./styles/admin.css";

import { setUser } from "./redux/auth/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import rolePermissions from "./config/permissions";
import UnAuthorizeRoute from "./pages/UnAuthorizeRoute";
import { get_student_setup_by_userId } from "./axios/student";
import { get_user_detail } from "./axios/auth";

import { setStudent } from "./redux/student/studentData";
import { setTutor } from "./redux/tutor/tutorData";
import { setChats } from "./redux/chat/chat";
import { moment } from "./config/moment";
import { useClerk, useAuth, SignedIn } from "@clerk/clerk-react";
import { redirect_to_login } from "./utils/auth";
import { setStudentSessions } from "./redux/student/studentSessions";
import { setTutorSessions } from "./redux/tutor/tutorSessions";
import Collaboration from "./pages/tutor/Collaboration";
import { setNewSubjCount } from "./redux/admin/newSubj";
import Loading from "./components/common/Loading";
import { setMissingFeildsAndTabs } from "./redux/tutor/missingFieldsInTabs";
import { setEducation } from "./redux/tutor/education";
import { setAccounting } from "./redux/tutor/accounting";
import { setDiscount } from "./redux/tutor/discount";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import TutorLayout from "./layouts/TutorLayout";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");
  const { userId, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state) => state.student);
  const { tutor } = useSelector((state) => state.tutor);
  const { bank } = useSelector((state) => state.bank);
  const { education } = useSelector((state) => state.edu);
  const { discount } = useSelector((state) => state.discount);
  const [activeRoutes, setActiveRoutes] = useState([]);
  const tutorUserId = localStorage.getItem("tutor_user_id");
  const studentLoggedIn = user?.role === "student";
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const role = studentLoggedIn ? "student" : "tutor";

  const handleExpiredToken = (result) => {
    const isExpired = result?.response?.data?.message?.includes("expired");
    const isMalformed = result?.response?.data?.message?.includes("malformed");
    const missingToken = result?.response?.data?.reason?.includes("attached");
    if ((isExpired || isMalformed) && !missingToken) {
      return redirect_to_login(
        navigate,
        signOut,
        dispatch,
        setTutor,
        setStudent,
        setUser
      );
    }
  };

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetch = async () => {
        const data = await get_user_detail(userId);
        if (
          data?.response?.data?.message?.includes("expired") ||
          data?.response?.data?.message?.includes("malformed")
        ) {
          return redirect_to_login(navigate, signOut);
        }
        if (data) {
          dispatch(setUser(data));
          localStorage.setItem("user", JSON.stringify(data));

          data.SID && data.role === "tutor" && dispatch(setTutor());
          if (data.role === "student") {
            const result = await get_student_setup_by_userId(data.SID);
            if (result?.[0] && result[0].AcademyId) {
              dispatch(setStudent(result[0]));
              localStorage.setItem("student_user_id", result[0].AcademyId);
            }
          }
        }
      };
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, isSignedIn]);

  useEffect(() => {
    if (user.role === "admin" && isSignedIn && token) {
      dispatch(setNewSubjCount());
    }
  }, [user.role, isSignedIn, token]);

  //setting timeZone for user
  useEffect(() => {
    if (studentLoggedIn && userId && isSignedIn) {
      moment.tz.setDefault(student.timeZone);
    } else {
      moment.tz.setDefault(tutor.timeZone);
    }
  }, [tutor, student, userId, isSignedIn, studentLoggedIn]);

  //checking missing mandatory fields and update header//tutor
  useEffect(() => {
    dispatch(setMissingFeildsAndTabs());
  }, [education, discount, bank, tutor]);

  //sessions :nextsession, :allsessions, :time remaing for next lesson
  useEffect(() => {
    if (token && tutor.AcademyId) {
      dispatch(setEducation());
      dispatch(setAccounting());
      dispatch(setDiscount());

      const dispatchUserSessions = async () => {
        const tutorSessions = await dispatch(await setTutorSessions(tutor));
        handleExpiredToken(tutorSessions);

        const intervalId = setInterval(async () => {
          const tutorSessions = await dispatch(await setTutorSessions(tutor));
          console.log(tutorSessions)
          if (handleExpiredToken(tutorSessions)) clearInterval(intervalId);
        }, 60000);

        return () => clearInterval(intervalId);
      };
      dispatchUserSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor.AcademyId, token]);

  useEffect(() => {
    if (token && student.AcademyId) {
      const dispatchUserSessions = async () => {
        const studentSessions = await dispatch(
          await setStudentSessions(student)
        );
        handleExpiredToken(studentSessions);

        const intervalId = setInterval(async () => {
          const studentSessions = await dispatch(
            await setStudentSessions(student)
          );

          if (handleExpiredToken(studentSessions)) clearInterval(intervalId);
        }, 60000);

        return () => clearInterval(intervalId);
      };
      dispatchUserSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.AcademyId, token]);

  useEffect(() => {
    if (userId && token && isSignedIn && user.role === "admin") {
      localStorage.getItem("tutor_user_id") && dispatch(setTutor());
      localStorage.getItem("student_user_id") && dispatch(setStudent());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorUserId, userId, isSignedIn, token, user.role]);

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetchData = () => {
        if (loggedInUserDetail.AcademyId) {
          dispatch(setChats(loggedInUserDetail.AcademyId, role));
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUserDetail.AcademyId, role, userId, isSignedIn, token]);

  //routes
  const generateRoutes = (role) => {
    if (role && rolePermissions[role]) {
      if (role === "admin") {
        const allRoutes = Object.keys(rolePermissions)
          .map((key) => rolePermissions[key])
          .flat();
        setActiveRoutes(
          allRoutes.map((route) => ({
            path: route.path,
            element: route.component,
          }))
        );
      } else {
        setActiveRoutes(
          rolePermissions[role].map((route) => ({
            path: route.path,
            element: route.component,
          }))
        );
      }
    } else {
      setActiveRoutes([]);
    }
  };

  useEffect(() => {
    generateRoutes(user?.role);
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/") navigate("/login");
  }, [location, navigate]);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      if (isExpired(localStorage.getItem("access_token"))) {
        navigate("/login");
        localStorage.removeItem("access_token");
        localStorage.removeItem("student_user_id");
        localStorage.removeItem("tutor_user_id");
        localStorage.removeItem("user");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(user.role)

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/collab" element={user.role === "student" || user.role === "tutor" ? <Collaboration /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      
        {/* {user.role === "admin" || user.role === "student" && */}
          <Route path="/student/*" element={<StudentLayout />}>
            {rolePermissions['student']
              // .filter(route => route.role === 'student')
              .map(route => (
                <Route
                  key={route.path}
                  path={route.path.replace('/student/', '')} // Removing '/student' prefix
                  element={<SignedIn>{route.component}</SignedIn>}
                />
              ))}
          </Route>
        {/* } */}

        {/* Tutor Section */}
        {/* {user.role === "admin" || user.role === "tutor" && */}
          <Route path="/tutor/*" element={<TutorLayout />}>
            {rolePermissions['tutor']
              // .filter(route => route.user.role === 'tutor')
              .map(route => (
                <Route
                  key={route.path}
                  path={route.path.replace('/tutor/', '')} // Removing '/tutor' prefix
                  element={<SignedIn>{route.component}</SignedIn>}
                />
              ))}
          </Route>
        {/* } */}

        {/* Admin Section */}
        {user.role === "admin" &&
          <Route path="/admin/*" element={<AdminLayout />}>
            {rolePermissions['admin']
              // .filter(route => route.user.role === 'admin')
              .map(route => (
                <Route
                  key={route.path}
                  path={route.path.replace('/admin/', '')} // Removing '/admin' prefix
                  element={<SignedIn>{route.component}</SignedIn>}
                />
              ))}
          </Route>
        }

        {/* Fallback Route */}
        <Route path="*" element={<div >Hi</div>} />
      </Routes>
    </Suspense>
  );
};

export default App;
