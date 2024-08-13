import React, { lazy } from 'react';
import AdminAccounting from '../pages/admin/AdminAccounting';

// tutor components
const Intro = lazy(() => import('../pages/tutor/Intro'));
const TutorSetup = lazy(() => import('../pages/tutor/TutorSetup'));
const Education = lazy(() => import('../pages/tutor/Education'));
const Discounts = lazy(() => import('../pages/tutor/Discounts'));
const Accounting = lazy(() => import('../pages/tutor/Accounting'));
const Subjects = lazy(() => import('../pages/tutor/Subjects'));
const MyStudents = lazy(() => import('../pages/tutor/MyStudents'));
const Scheduling = lazy(() => import('../pages/tutor/Scheduling'));
const TermOfUse = lazy(() => import('../pages/tutor/TermOfUse'));
const Classified = lazy(() => import('../pages/tutor/Add/Classified'));
const TutorProfile = lazy(() => import('../pages/tutor/TutorProfile'));
const Edit = lazy(() => import('../pages/tutor/Add/Edit'));
const Create = lazy(() => import('../pages/tutor/Add/Create'));
const Bid = lazy(() => import('../pages/tutor/Add/Bid'));
const StudentPublicProfile = lazy(() => import('../pages/tutor/StudentProfile'));
const List = lazy(() => import('../pages/tutor/Add/List'));
const TutorFeedback = lazy(() => import('../pages/tutor/Feedback'));
const AgencyList = lazy(() => import('../pages/tutor/Agency/List'));
const Agency = lazy(() => import('../pages/tutor/Agency/Agency'));



// student components
const StudentSetup = lazy(() => import('../pages/student/StudentSetup'));
const StudentFaculty = lazy(() => import('../pages/student/StudentFaculty'));
const StudentAccountings = lazy(() => import('../pages/student/StudentAccounting'));
const StudentScheduling = lazy(() => import('../pages/student/StudentScheduling'));
const Schedules = lazy(() => import('../pages/student/Schedules'))
const StudentTermOfUse = lazy(() => import('../pages/student/TermOfUse'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const TutorPublicProfile = lazy(() => import('../pages/student/TutorPublicProfile'));

const StudentIntro = lazy(() => import('../pages/student/StudentIntro'));
const Feedback = lazy(() => import('../pages/student/Feedback'));
const SingleTutorFeedbacks = lazy(() => import('../pages/student/SingleTutorFeedbacks'));

// admin components
const TutorNewSubject = lazy(() => import('../pages/admin/NewSubject'));
const TutorTable = lazy(() => import('../pages/admin/Tutor'));
const AddSMSMessages = lazy(() => import('../pages/admin/Marketing/AddSMSTemps'));
const StudentTable = lazy(() => import('../pages/admin/Student'));
const AdminChat = lazy(() => import('../pages/admin/Chat'));
const EmailList = lazy(() => import('../pages/admin/EmailTemplates/List'));
const EmailTempCreate = lazy(() => import('../pages/admin/EmailTemplates/Create'));
const EmailTempEdit = lazy(() => import('../pages/admin/EmailTemplates/Edit'));
const Send = lazy(() => import('../pages/admin/Marketing/Send'));

// common components
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Chat = lazy(() => import('../pages/Chat'));
const Marketplace = lazy(() => import('../pages/student/MarketPlace/Marketplace'));
const Bids = lazy(() => import('../pages/student/MarketPlace/Bids'));
const Ads = lazy(() => import('../pages/student/MarketPlace/Ad'));
const StudentAdList = lazy(() => import('../pages/student/MarketPlace/StudentAdList'));
const EditAd = lazy(() => import('../pages/student/MarketPlace/EditAd'));


const rolePermissions = {
  tutor: [
    { path: "/tutor/intro", component: <Intro /> },
    { path: "/tutor/setup", component: <TutorSetup /> },
    { path: "/tutor/education", component: <Education /> },
    { path: '/tutor/student-profile/:AcademyId', component: <StudentPublicProfile /> },
    { path: "/tutor/discounts", component: <Discounts /> },
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

    { path: "/tutor/agency", component: <AgencyList /> },
    { path: "/tutor/agency/:id", component: <Agency /> },


    { path: '/tutor/chat', component: <Chat /> },
    { path: '/tutor/chat/:id', component: <Chat /> },

    { path: '/tutor/feedback', component: <TutorFeedback /> }

  ],
  student: [
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
    { path: "/student/tutor-profile/:id", component: <TutorPublicProfile /> },
    { path: "/student/market-place/bid", component: <Bids /> },
    { path: "/student/market-place/ad", component: <Ads /> },
    { path: "/student/market-place/list", component: <StudentAdList /> },
    { path: "/student/market-place/ad/:id", component: <EditAd /> },
  ],
  admin: [
    { path: "/admin/tutor-data", component: <TutorTable /> },
    { path: "/admin/student-data", component: <StudentTable /> },
    { path: "/admin/new-subject", component: <TutorNewSubject /> },
    { path: "/admin/chat", component: <AdminChat /> },
    { path: "/admin/email-templates", component: <EmailList /> },
    { path: "/admin/email-templates/create", component: <EmailTempCreate /> },
    { path: "/admin/email-templates/:id", component: <EmailTempEdit /> },

    { path: "/admin/marketing", component: <Send /> },
    { path: "/admin/marketing/add-sms", component: <AddSMSMessages /> },

    { path: "/admin/accounting", component: <AdminAccounting /> },
  ],
  common: [
    { path: "/login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
  ],
};

export const isAllowed = (role, route) => rolePermissions[role]?.some((r) => r.path === route);
export default rolePermissions;

