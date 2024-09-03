import Actions from "../../components/common/Actions";
import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import SchedulingComp from "../../components/tutor/Scheduling";
import TutorLayout from "../../layouts/TutorLayout";

const Scheduling = () => {
  return (
    <  >
      {/* <TabInfoVideoToast video={VIDEO} /> */}
      <SchedulingComp />
      <Actions saveDisabled={true}
        editDisabled={true} />
    </>
  );
};

export default Scheduling;
