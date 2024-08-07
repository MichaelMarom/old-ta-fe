import { configureStore } from '@reduxjs/toolkit';

import userReducer from './auth/auth';
import selectedTutorReducer from './student/selectedTutor';
import studentBookingsReducer from './student/studentBookings';
import studentReducer from './student/studentData'

import tutorReducer from './tutor/tutorData'
import videoReducer from './tutor/video'
import chatReducer from './chat/chat';
import studentSessionsReducer from './student/studentSessions.js';
import tutorSessionsReducer from './tutor/tutorSessions.js';
import newSubj from './admin/newSubj.js';
import missingFields from './tutor/missingFieldsInTabs.js';
import educationReducer from './tutor/education.js'
import discountReducer from './tutor/discount.js'
import accountingReducer from './tutor/accounting.js'


let store = configureStore({
  reducer: {
    user: userReducer,
    selectedTutor: selectedTutorReducer,
    studentSessions: studentSessionsReducer,
    student: studentReducer,
    bookings: studentBookingsReducer,
    chat: chatReducer,

    tutor: tutorReducer,
    video: videoReducer,

    tutorSessions: tutorSessionsReducer,
    edu: educationReducer,
    bank: accountingReducer,
    discount: discountReducer,

    newSubj,
    missingFields
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


export default store;