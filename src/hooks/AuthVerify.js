import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from 'react-jwt'

const AuthVerify = () => {
    const navigate = useNavigate();

    if (localStorage.getItem("access_token")) {
        console.log(isExpired(localStorage.getItem("access_token")))
        if (isExpired(localStorage.getItem("access_token"))) {
            navigate('/login')
            localStorage.clear()
        }
    }
    return <div></div>;
};

export default AuthVerify;