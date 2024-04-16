// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { formatted_tutor_sessions } from "../../axios/tutor";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "tutorSessions",
    initialState: {
        sessions: [],
        upcomingSession: {},
        upcomingSessionFromNow: '',
        currentSession: {},
        inMins: false
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setTutorSession: (state, action) => {
            state.isLoading = false;
            state.sessions = action.payload.sessions || [];
            state.upcomingSession = action.payload.upcomingSession || {};
            state.currentSession = action.payload.currentSession || {};
            state.inMins = action.payload.inMins;

            state.upcomingSessionFromNow = action.payload.upcomingSessionFromNow || '';
        },
    },
});

export default slice.reducer;

// ACTIONS

export const setTutorSessions = async (tutor) => {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.isLoading())
            const result = await formatted_tutor_sessions(tutor.AcademyId)
            !result?.response?.dat && dispatch(slice.actions.setTutorSession(result));
            return result;
        }
        catch (err) {
            console.log(err)
            return err
        }
    };
}

