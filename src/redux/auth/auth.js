// slice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "user",
    initialState: {
        user: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getLoggedinUser: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        },
        setLoggedinUser: (state, action) => {
            state.isLoading = false;
            state.user = action.payload
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setUser(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setLoggedinUser(data));
        return data;
    };
}

