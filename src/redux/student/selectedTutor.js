// slice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "selectedTutor",
    initialState: {
        selectedTutor: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getSelectedTutor: (state, action) => {
            state.isLoading = false;
            state.selectedTutor = action.payload;
        },
        setTutor: (state, action) => {
            state.isLoading = false;
            state.selectedTutor = action.payload;
        }

    },
});

export default slice.reducer;

// ACTIONS

export function setTutor(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setTutor(data));
        return data;
    };
}

