import StudentProfileCnt from "../../components/student/StudentProfile";
import StudentLayout from "../../layouts/StudentLayout";
import Actions from '../../components/common/Actions';

const StudentProfile = () => {
    return (
        <  >
            <StudentProfileCnt />
            <Actions saveDisabled />
        </>
    );
}

export default StudentProfile;