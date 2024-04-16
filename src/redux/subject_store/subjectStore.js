// slice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "subject",
    initialState: {
        subject: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getSelectedSubject: (state, action) => {
            state.isLoading = false;
            state.subject = action.payload;
        },
        setSubject: (state, action) => {
            state.isLoading = false;
            state.subject = action.payload;
        }

    },
});

export default slice.reducer;

// ACTIONS

export function setSubject(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setSubject(data));
        return data;
    };
}

