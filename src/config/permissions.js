// tutor
import Intro from "../pages/tutor/Intro";
import TutorSetup from "../pages/tutor/TutorSetup";
import Education from "../pages/tutor/Education";
import Rates from "../pages/tutor/Rates";
import Accounting from "../pages/tutor/Accounting";
import Subjects from "../pages/tutor/Subjects";
import MyStudents from "../pages/tutor/MyStudents";
import Scheduling from "../pages/tutor/Scheduling";
import TermOfUse from "../pages/tutor/TermOfUse";
import Classified from "../pages/tutor/Add/Classified";
import TutorProfile from "../pages/tutor/TutorProfile";
import Edit from "../pages/tutor/Add/Edit";
import Create from "../pages/tutor/Add/Create";
import Bid from "../pages/tutor/Add/Bid";
import StudentPublicProfile from '../pages/tutor/StudentProfile'
import List from "../pages/tutor/Add/List";
import TutorClass from "../pages/tutor/TutorClass";
import TutorFeedback from '../pages/tutor/Feedback'

// students
import StudentSetup from "../pages/student/StudentSetup";
import StudentFaculty from "../pages/student/StudentFaculty";
import StudentAccountings from "../pages/student/StudentAccounting";
import StudentScheduling from "../pages/student/StudentScheduling";
import StudentTermOfUse from "../pages/student/TermOfUse";
import StudentProfile from "../pages/student/StudentProfile";
import StudentIntro from "../pages/student/StudentIntro";
import { Feedback } from "../pages/student/Feedback";
import { Schedules } from "../pages/student/Schedules";
import { SingleTutorFeedbacks } from "../pages/student/SingleTutorFeedbacks";

//admin
import TutorNewSubject from "../pages/Admin/NewSubject";
import TutorTable from "../pages/Admin/Tutor";
import StudentTable from "../pages/Admin/Student";
import Marketing from "../pages/Admin/Marketing";
import AdminChat from '../pages/Admin/Chat'

//common
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Chat from "../pages/Chat";
import Marketplace from "../pages/student/MarketPlace/Marketplace";
import Bids from "../pages/student/MarketPlace/Bids";
import Ads from "../pages/student/MarketPlace/Ad";
import StudentAdList from "../pages/student/MarketPlace/StudentAdList";
import EditAd from "../pages/student/MarketPlace/EditAd";


const rolePermissions = {
  tutor: [
    { path: "/tutor/intro", component: <Intro /> },
    { path: "/tutor/setup", component: <TutorSetup /> },
    { path: "/tutor/education", component: <Education /> },
    { path: '/tutor/student-profile/:AcademyId', component: <StudentPublicProfile /> },
    { path: "/tutor/rates", component: <Rates /> },
    { path: "/tutor/accounting", component: <Accounting /> },
    { path: "/tutor/subjects", component: <Subjects /> },
    { path: "/tutor/my-students", component: <MyStudents /> },
    { path: "/tutor/scheduling", component: <Scheduling /> },
    { path: "/tutor/term-of-use", component: <TermOfUse /> },
    { path: "/tutor/market-place/classified", component: <Classified /> },
    { path: "/tutor/market-place/:id", component: <Edit /> },
    { path: "/tutor/market-place/bid", component: <Bid /> },
    { path: "/tutor/market-place", component: <Create /> },
    { path: "/tutor/market-place/list", component: <List /> },
    { path: "/tutor/tutor-profile/:id", component: <TutorProfile /> },


    { path: "/tutor/collaboration", component: <TutorClass /> },
    { path: '/tutor/chat', component: <Chat /> },
    { path: '/tutor/chat/:id', component: <Chat /> },
    { path: '/tutor/feedback', component: <TutorFeedback /> }

  ],
  student: [
    { path: "/student/", component: <StudentSetup /> },
    { path: "/student/intro", component: <StudentIntro /> },
    { path: "/student/setup", component: <StudentSetup /> },
    { path: "/student/faculties", component: <StudentFaculty /> },
    { path: "/student/accounting", component: <StudentAccountings /> },
    { path: "/student/market-place", component: <Marketplace /> },
    { path: "/student/booking", component: <StudentScheduling /> },
    { path: "/student/calender", component: <Schedules /> },
    { path: "/student/term-of-use", component: <StudentTermOfUse /> },
    { path: "/student/profile", component: <StudentProfile /> },
    { path: '/student/feedback', component: <Feedback /> },
    { path: "/student/tutor/feedback/:AcademyId", component: <SingleTutorFeedbacks /> },
    { path: '/student/chat', component: <Chat /> },
    { path: '/student/chat/:id', component: <Chat /> },
    { path: "/student/tutor-profile/:id", component: <TutorProfile /> },
    { path: "/student/market-place/bid", component: <Bids /> },
    { path: "/student/market-place/ad", component: <Ads /> },
    { path: "/student/market-place/list", component: <StudentAdList /> },
    { path: "/student/market-place/ad/:id", component: <EditAd /> },
  ],
  admin: [
    { path: "/admin/tutor-data", component: <TutorTable /> },
    { path: "/admin/student-data", component: <StudentTable /> },
    { path: "/admin/new-subject", component: <TutorNewSubject /> },
    { path: "/admin/marketing", component: <Marketing /> },
    { path: "/admin/chat", component: <AdminChat /> },
    { path: "/admin/accounting", component: null },
  ],
  common: [
    { path: "/login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
  ],
};

export const isAllowed = (role, route) => rolePermissions[role]?.some((r) => r.path === route);
export default rolePermissions;

