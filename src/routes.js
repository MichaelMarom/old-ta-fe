import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { isExpired } from 'react-jwt'
import React from "react";

import "./styles/Tab_Styles/LargeScreen.css";
import "./styles/student.css";
import "./styles/admin.css";
import "./styles/collab.css";
import './styles/tutor.css'
import "./styles/Collaboration_Styles/LargeScreen.css";
import { setUser } from "./redux/auth_state/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import rolePermissions from "./config/permissions";
import UnAuthorizeRoute from "./pages/UnAuthorizeRoute";
import { get_tutor_setup } from "./axios/tutor";
import { get_my_data, get_student_setup_by_userId } from "./axios/student";
import { get_user_detail } from "./axios/auth";

import { setStudent } from "./redux/student_store/studentData";
import { setTutor } from "./redux/tutor_store/tutorData";
import { setChats } from "./redux/chat/chat";
import { moment } from './config/moment';
import {
  useClerk, useAuth,
  SignedIn
} from '@clerk/clerk-react';
import { redirect_to_login } from "./helperFunctions/auth";
// import { setStudentSessions } from "./redux/student_store/studentSessions";
// import { setTutorSessions } from "./redux/tutor_store/tutorSessions";
import TutorClass from "./pages/tutor/TutorClass";
import CallWithChatExperience from "./pages/tutor/Test1";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('access_token')
  const { userId, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state => state.student))
  const { tutor } = useSelector((state => state.tutor))

  const [activeRoutes, setActiveRoutes] = useState([]);
  const studentUserId = localStorage.getItem('student_user_id')
  const tutorUserId = localStorage.getItem('tutor_user_id')
  const studentLoggedIn = user?.role === 'student';
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const role = studentLoggedIn ? 'student' : 'tutor';
  const nullValues = ['undefined', 'null'];

  const handleExpiredToken = (result) => {
    const isExpired = result?.response?.data?.message?.includes('expired');
    const isMalformed = result?.response?.data?.message?.includes('malformed');
    const missingToken = result?.response?.data?.reason?.includes('attached');
    console.log('handle expiration', isExpired, isMalformed, missingToken)
    if ((isExpired || isMalformed) && !missingToken) {
      return redirect_to_login(navigate, signOut)
    }
  }

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetch = async () => {
        const data = await get_user_detail(userId);
        if (data?.response?.data?.message?.includes('expired') ||
          data?.response?.data?.message?.includes('malformed')) {
          return redirect_to_login(navigate, signOut)
        }
        if (!data?.response?.data) {
          dispatch(setUser(data));
          localStorage.setItem('user', JSON.stringify(data));

          data.SID && data.role === 'tutor' && dispatch(setTutor())
          if (data.role === 'student') {
            const result = await get_student_setup_by_userId(data.SID);
            if (result?.[0] && result[0].AcademyId) {
              dispatch(setStudent(result[0]))
              localStorage.setItem('student_user_id', result[0].AcademyId);
            }
          }
        }
      }
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [userId, token, isSignedIn, dispatch, navigate])

  useEffect(() => {
    if (user && user.role !== 'admin' && user.SID && isSignedIn && token)
      get_tutor_setup({ userId: user.SID }).then((result) => {
        handleExpiredToken(result);
        result?.data?.[0]?.AcademyId && localStorage.setItem("tutor_user_id", result?.data?.[0]?.AcademyId);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [user, isSignedIn, token]);

  //dispatch
  useEffect(() => {
    if (studentLoggedIn && userId && isSignedIn) {
      moment.tz.setDefault(student.timeZone);
    }
    else {
      moment.tz.setDefault(tutor.timeZone);
    }
  }, [tutor, student, userId, isSignedIn, studentLoggedIn])

  //sessions :nextsession, :allsessions, :time remaing for next lesson
  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER_URL)
    if (token) {
      // const dispatchUserSessions = async () => {
      //   const studentSessions = student.AcademyId && dispatch(await setStudentSessions(student));
      //   const tutorSessions = tutor.AcademyId && dispatch(await setTutorSessions(tutor));
      //   student.AcademyId && handleExpiredToken(studentSessions)
      //   tutor.AcademyId && handleExpiredToken(tutorSessions)

      //   const intervalId = setInterval(async () => {
      //     const studentSessions = student.AcademyId && dispatch(await setStudentSessions(student));
      //     const tutorSessions = tutor.AcademyId && dispatch(await setTutorSessions(tutor));
      //     student.AcademyId && handleExpiredToken(studentSessions)
      //     tutor.AcademyId && handleExpiredToken(tutorSessions)
      //   }, 60000);

      //   return () => clearInterval(intervalId);
      // }
      // dispatchUserSessions()
    }
  }, [student, tutor, dispatch, token]);

  const getStudentDetails = async () => {
    if (nullValues.includes(studentUserId)) {
      return dispatch(setStudent({}));
    }
    const res = await get_my_data(studentUserId)
    if (res?.response?.data?.message?.includes('expired')) return redirect_to_login(navigate, signOut)
    !res?.response?.data?.message && dispatch(setStudent(res[1][0][0]));
  }

  useEffect(() => {
    if (userId && token && isSignedIn) getStudentDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [dispatch, studentUserId, userId, isSignedIn, token])

  useEffect(() => {
    if (userId && token && isSignedIn) {
      console.log('render', token)
      dispatch(setTutor())
    }
  }, [dispatch, tutorUserId, userId, isSignedIn, token])

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetchData = () => {
        if (loggedInUserDetail.AcademyId) {
          dispatch(setChats(loggedInUserDetail.AcademyId, role));
        }
      };

      fetchData();
    }

  }, [dispatch, loggedInUserDetail.AcademyId, role, userId, isSignedIn, token])

  //routes
  const generateRoutes = (role) => {
    if (role && rolePermissions[role]) {
      if (role === 'admin') {
        const allRoutes = Object.keys(rolePermissions).map((key) => rolePermissions[key]).flat();
        setActiveRoutes(
          allRoutes.map((route) => ({
            path: route.path,
            element: route.component,
          })))
      } else {
        setActiveRoutes(
          rolePermissions[role].map((route) => ({
            path: route.path,
            element: route.component,
          })))
      }
    }
    else {
      setActiveRoutes([]);
    }
  };

  useEffect(() => {
    generateRoutes(user?.role);
  }, [user])

  useEffect(() => {
    if (location.pathname === '/')
      navigate('/login')
  }, [location, navigate])


  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      console.log(isExpired(localStorage.getItem("access_token")))
      if (isExpired(localStorage.getItem("access_token"))) {
        navigate('/login')
        localStorage.clear()
      }
    }
    else { navigate('/login') }
  }, [navigate])

  return (
    <Routes>
      <Route path={`/collab`} element={<TutorClass />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat-call" element={<CallWithChatExperience />} />
      {activeRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<SignedIn>{route.element}</SignedIn>} />
      ))}
      <Route path="*" element={<UnAuthorizeRoute />} />
    </Routes>
  );
};

export default App;
