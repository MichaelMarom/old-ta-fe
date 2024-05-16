import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import SubjectsComp from "../../components/tutor/Subjects/Subjects";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../assets/videos/faculties.mp4'

const Subjects = () => {
  return (
    <TutorLayout  >
      <TabInfoVideoToast
      video={VIDEO} />

      <SubjectsComp />
    </TutorLayout>
  );
};

export default Subjects;
