import { isAllowed } from './permissions';
import { useNavigate } from 'react-router-dom';

const AuthorizeRoute = ({ role, route, children }) => {
    const navigate = useNavigate();
    if (isAllowed(role, route)) {
        return children;
    } else {
        navigate('/unauthorized'); // Redirect to an unauthorized route or handle it as needed
        return null; // Return null to prevent rendering of unauthorized content
    }
}

export default AuthorizeRoute
