import { useSelector } from "react-redux";
import StudentShortList from "../../components/student/StudentShortList";
import StudentLayout from "../../layouts/StudentLayout";
import { generateUpcomingSessionMessage } from "../../helperFunctions/generalHelperFunctions";
import SmallSideBar from "../../components/common/SmallSideBar";

const StudentShortLists = () => {
    return (
        <StudentLayout  >
            <StudentShortList />
        </StudentLayout>
    );
}

export default StudentShortLists;