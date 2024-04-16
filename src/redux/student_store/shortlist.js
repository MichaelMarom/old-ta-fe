// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { get_student_short_list } from "../../axios/student";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "shortlist",
    initialState: {
        shortlist: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getShortlist: (state, action) => {
            state.isLoading = false;
            state.shortlist = action.payload;
        },
        setShortlist: (state, action) => {
            console.log('shortlist, ', action.payload)
            state.isLoading = false;
            state.shortlist = action.payload
        }
    },
});

export default slice.reducer;
export const setShortlistAction = slice.actions.setShortlist
// ACTIONS

export function setShortlist() {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const nullValues = ['undefined', 'null']

        if (!window.localStorage.getItem('student_user_id') ||
            nullValues.includes(localStorage.getItem('student_user_id'))) {
            return dispatch(slice.actions.setShortlist([]));
        }
        const result = await get_student_short_list(window.localStorage.getItem('student_user_id'))
        if (result?.response?.data) return [];
        result.sort(function (a, b) {
            if (a.Subject < b.Subject) {
                return -1;
            }
            if (a.Subject > b.Subject) {
                return 1;
            }
            return 0;
        });

        dispatch(slice.actions.setShortlist(result));
        return result;
    };
}

