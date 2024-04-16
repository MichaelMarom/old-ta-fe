import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import Setup from "../../components/tutor/TutorSetup";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../assets/videos/setup.mp4'

const TutorSetup = () => {
    return (
        <TutorLayout>
            <TabInfoVideoToast video={VIDEO} />
            <Setup />
        </TutorLayout>
    );
}

export default TutorSetup;