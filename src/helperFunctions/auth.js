
export const redirect_to_login = (navigate, signOut) => {
    signOut();
    navigate('/login');
    localStorage.removeItem('access_token');
    localStorage.removeItem('student_user_id');
    localStorage.removeItem('tutor_user_id');
}