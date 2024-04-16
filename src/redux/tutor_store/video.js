// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { post_tutor_setup } from "../../axios/tutor";

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
    return async (dispatch) => {
        dispatch(slice.actions.isLoading(true))
        const res = await post_tutor_setup(data)
        dispatch(slice.actions.isLoading(false));
        return res;
    };
}