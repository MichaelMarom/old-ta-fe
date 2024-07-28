import { configureStore } from '@reduxjs/toolkit';

import userReducer from './auth/auth';
import selectedTutorReducer from './student/selectedTutor';
import studentBookingsReducer from './student/studentBookings';
import studentReducer from './student/studentData'
import shortlistReducer from './student/shortlist'

import tutorReducer from './tutor/tutorData'
import videoReducer from './tutor/video'
import chatReducer from './chat/chat';
import studentSessionsReducer from './student/studentSessions.js';
import tutorSessionsReducer from './tutor/tutorSessions.js';
import newSubj from './admin/newSubj.js';
import missingFields from './tutor/missingFieldsInTabs.js';
import bankReducer from './tutor/accounting1.js';
import eduReducer from './tutor/education1.js';
import discountReducer from './tutor/discount1.js';


let store = configureStore({
  reducer: {
    user: userReducer,
    selectedTutor: selectedTutorReducer,
    studentSessions: studentSessionsReducer,
    student: studentReducer,
    shortlist: shortlistReducer,
    bookings: studentBookingsReducer,
    chat: chatReducer,

    tutor: tutorReducer,
    video: videoReducer,
    
    tutorSessions: tutorSessionsReducer,
    discount: discountReducer,
    bank:bankReducer,
    edu: eduReducer,

    newSubj,
    missingFields
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


export default store;