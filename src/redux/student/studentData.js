// slice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "student",
    initialState: {
        student: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getStudent: (state, action) => {
            state.isLoading = false;
            state.student = action.payload;
        },
        setStudent: (state, action) => {
            state.isLoading = false;
            state.student = action.payload
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setStudent(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setStudent(data));
        return data;
    };
}

