import { configureStore } from '@reduxjs/toolkit';
// import thicknessReducer from './student_store/Thickness';
// import colorLineReducer from './student_store/Color';
// import eraserReducer from './student_store/Eraser';
// import paintReducer from './student_store/Paint';
// import toolReducer from './student_store/Tool';
// import toolReq from './student_store/toolReq';
// import asideReq from './student_store/asideReq.js';
// import modeReducer from './tutor_store/Mode';
// import BoardAccessReducer from './tutor_store/BoardAccess';
// import save from './tutor_store/save';
// import ScreenName from './tutor_store/ScreenName';
import userReducer from './auth_state/auth';
import subjectReducer from './subject_store/subjectStore';
import selectedTutorReducer from './student_store/selectedTutor';
import studentBookingsReducer from './student_store/studentBookings';
import studentReducer from './student_store/studentData'
import shortlistReducer from './student_store/shortlist'

import tutorReducer from './tutor_store/tutorData'
import videoReducer from './tutor_store/video'
import chatReducer from './chat/chat';
import studentSessionsReducer from './student_store/studentSessions.js';
import tutorSessionsReducer from './tutor_store/tutorSessions.js';

let store = configureStore({
  reducer: {
    user: userReducer,
    subject: subjectReducer,
    selectedTutor: selectedTutorReducer,
    studentSessions: studentSessionsReducer,
    student: studentReducer,
    shortlist: shortlistReducer,
    bookings: studentBookingsReducer,
    chat: chatReducer,

    tutor: tutorReducer,
    video: videoReducer,
    
    tutorSessions: tutorSessionsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


export default store;