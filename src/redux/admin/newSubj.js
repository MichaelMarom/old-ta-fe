// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { get_new_subj_count } from "../../axios/admin";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "newSubj",
    initialState: {
        count: 0,
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setNewSubj: (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
            state.count = action.payload?.[0]?.count
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setNewSubjCount() {
    return async (dispatch) => {
        const data = await get_new_subj_count();
        !data?.response?.data && dispatch(slice.actions.setNewSubj(data));
        return data;
    };
}

