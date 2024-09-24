import { useLocation } from "react-router-dom";
import TutorProfileComp from "../../components/tutor/TutorProfile";

const TutorProfile = () => {
  const location = useLocation();
  const role = location.pathname.split('/')[1]
  
  return (
      <TutorProfileComp />
  );
};

export default TutorProfile;
