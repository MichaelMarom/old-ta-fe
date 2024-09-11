import { setLessons } from "../redux/student/studentBookings";
import { setStudentSessions } from "../redux/student/studentSessions";
import { setTutorSessions } from "../redux/tutor/tutorSessions";

export const redirect_to_login = async (
  navigate,
  signOut,
  dispatch,
  setTutor,
  setStudent,
  setUser,
  studentSessionInterval={},
  tutorSessionInterval={}
) => {
  await signOut(()=>{
      dispatch(setTutor({}));
      dispatch(setUser({}));
      dispatch(setStudent({}));
      dispatch(setLessons([]))
      
      // dispatch(setStudentSessions([]))
      // dispatch(setTutorSessions([]))

      // if (studentSessionInterval.current) {
      //   clearInterval(studentSessionInterval.current);
      // }
      //   if (tutorSessionInterval.current) {
      //   clearInterval(tutorSessionInterval.current);
      // }
    
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("student_user_id");
      localStorage.removeItem("tutor_user_id");
      navigate("/login");
  });
};
