import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import DiscountsComp from "../../components/tutor/Discounts";
import TutorLayout from "../../layouts/TutorLayout";

const Discounts = () => {
    return (
        <TutorLayout  >
            {/* <TabInfoVideoToast video={VIDEO} /> */}
            <DiscountsComp />
        </TutorLayout>
    );
}

export default Discounts;