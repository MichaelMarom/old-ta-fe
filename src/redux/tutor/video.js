// slice.js
import { createSlice } from "@reduxjs/toolkit";
import {  updateTutorSetup } from "../../axios/tutor";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "video",
    initialState: {
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export default slice.reducer;

// ACTIONS

export function uploadVideo(data) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading(true))
        const tutor = getState().tutor.tutor;
        const res = await updateTutorSetup(tutor.AcademyId, data)
        dispatch(slice.actions.isLoading(false));
        return res;
    };
}