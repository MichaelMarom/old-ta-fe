import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import SubjectsComp from "../../components/tutor/Subjects/Subjects";
import TutorLayout from "../../layouts/TutorLayout";

const Subjects = () => {
  return (
    <TutorLayout  >
      <TabInfoVideoToast iframeVideo={true}
      video={'https://www.youtube.com/embed/6XVVoOdp--4?si=dgyK8b8SnOdBpDFY'} />

      <SubjectsComp />
    </TutorLayout>
  );
};

export default Subjects;
