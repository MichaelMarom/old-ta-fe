import Intro from "../../components/tutor/Intro";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../assets/videos/intro.mp4'
import TabInfoVideoToast from '../../components/common/TabInfoVideoToast'


const TutorIntro = () => {
    return (
        <TutorLayout  >
            <TabInfoVideoToast video={VIDEO} />
            <Intro />
        </TutorLayout>
    );
}

export default TutorIntro;