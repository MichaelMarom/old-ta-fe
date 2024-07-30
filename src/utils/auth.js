export const redirect_to_login = async (
  navigate,
  signOut,
  dispatch,
  setTutor,
  setStudent,
  setUser
) => {
  await signOut(()=>{
      dispatch(setTutor({}));
      dispatch(setUser({}));
      dispatch(setStudent({}));

    
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("student_user_id");
      localStorage.removeItem("tutor_user_id");
      navigate("/login");
  });
};
