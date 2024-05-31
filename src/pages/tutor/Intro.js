import Intro from "../../components/tutor/Intro";
import TutorLayout from "../../layouts/TutorLayout";
import TabInfoVideoToast from '../../components/common/TabInfoVideoToast'


const TutorIntro = () => {
    return (
        <TutorLayout  >
            {/* <TabInfoVideoToast video={VIDEO} /> */}
            <Intro />
        </TutorLayout>
    );
}

export default TutorIntro;