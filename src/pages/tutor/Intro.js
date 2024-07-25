import Intro from "../../components/tutor/Intro";
import TutorLayout from "../../layouts/TutorLayout";
import TabInfoVideoToast from '../../components/common/TabInfoVideoToast'
import Dashboard from '../../layouts/Dashboard'


const TutorIntro = () => {
    return (
        <Dashboard >
                {/* // <TutorLayout  > */}
                <Intro />
                {/* <TabInfoVideoToast video={VIDEO} /> */}
            {/* // </TutorLayout> */}

            </Dashboard>
    );
}

export default TutorIntro;