import { configureStore } from '@reduxjs/toolkit';

import userReducer from './auth_state/auth';
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