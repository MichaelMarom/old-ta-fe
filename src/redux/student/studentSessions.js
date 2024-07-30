// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { formatted_student_sessions } from "../../axios/student";
import { showErrorToast } from "../../axios/config";

// Create a slice with your event-related reducers
const slice = createSlice({
  name: "studentSessions",
  initialState: {
    sessions: [],
    upcomingSession: {},
    upcomingSessionFromNow: "",
    currentSession: {},
    inMins: false,
  },
  reducers: {
    isLoading: (state) => {
      state.isLoading = true;
    },
    setStudentSession: (state, action) => {
      state.isLoading = false;
      state.sessions = action.payload.sessions || [];
      state.upcomingSession = action.payload.upcomingSession || {};
      state.currentSession = action.payload.currentSession || {};
      state.inMins = action.payload.inMins;
      state.upcomingSessionFromNow =
        action.payload.upcomingSessionFromNow || "";
    },
    setOnlySessions: (state, action) => {
      state.isLoading = false;
      state.sessions = action.payload || [];
    },
  },
});

export default slice.reducer;
export const { setOnlySessions } = slice.actions;

// ACTIONS

export const setStudentSessions = async (student) => {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.isLoading());
      const result = await formatted_student_sessions(student.AcademyId);
      !result?.response?.data &&
        dispatch(slice.actions.setStudentSession(result));
      return result;
    } catch (err) {
      showErrorToast(err)
      return err;
    }
  };
};
