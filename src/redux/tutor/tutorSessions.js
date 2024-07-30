// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { formatted_tutor_sessions } from "../../axios/tutor";
import { showErrorToast } from "../../axios/config";

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
        setOnlySessions: (state, action) => {
            console.log(state, action)
            state.isLoading = false;
            state.sessions = action.payload || [];
                    },
    },
});

export default slice.reducer;
export const { setTutorSession, isLoading,setOnlySessions } = slice.actions;


// ACTIONS

export const setSessionsManually = async(data)=>{
    return async (dispatch) => {
        try {
            dispatch(slice.actions.setTutorSession(data));
        }
        catch (err) {
            return err
        }
    };
}

export const setTutorSessions = async (tutor) => {
    return async (dispatch) => {
        try {
            dispatch(slice.actions.isLoading())
            const result = await formatted_tutor_sessions(tutor.AcademyId)
            !result?.response?.data && dispatch(slice.actions.setTutorSession(result));
            return result;
        }
        catch (err) {
            showErrorToast(err)
            return err
        }
    };
}

