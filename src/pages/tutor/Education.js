import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import EducationComp from "../../components/tutor/Education/Education";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../assets/videos/education.mp4'

const Education = () => {
  return (
    <TutorLayout   >
      <TabInfoVideoToast video={VIDEO} />
      <EducationComp />
    </TutorLayout>
  );
};

export default Education;
