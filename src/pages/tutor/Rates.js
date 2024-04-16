import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import RatesComp from "../../components/tutor/Rates";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../assets/videos/motivation.mp4'

const Rates = () => {
    return (
        <TutorLayout  >
            <TabInfoVideoToast video={VIDEO} />
            <RatesComp />
        </TutorLayout>
    );
}

export default Rates;