import { Link } from "react-router-dom";

const UnAuthorizeRoute = () => {
    return (
        <div className='fs-4 text-danger d-flex justify-content-center align-items-center flex-column'
            style={{ height: '100vh' }}
        >
         <div>
               404 | not found
        </div>
        <div>
            Please <Link to='/login'> Login </Link>/<Link to='/signup'>Signup </Link> to access portal.
        </div>
        </div>
    );
}

export default UnAuthorizeRoute
