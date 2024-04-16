import { useLocation } from "react-router-dom";
import TutorProfileComp from "../../components/tutor/TutorProfile";
import CommonLayout from "../../layouts/CommonLayout";

const TutorProfile = () => {
  const location = useLocation();
  const role = location.pathname.split('/')[1]
  return (
    <CommonLayout   role={role}>
      <TutorProfileComp />
    </CommonLayout>
  );
};

export default TutorProfile;
