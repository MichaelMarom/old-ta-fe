import { createSlice } from "@reduxjs/toolkit";
import * as tutorApis from "../../axios/tutor";
import _ from "lodash";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "education",
    initialState: {
        education: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setEducation: (state, action) => {
            state.isLoading = false;
            state.education = action.payload;
        },
    },
});

export default slice.reducer;

// ACTIONS

export function setEducation() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const tutor = getState().tutor.tutor

        const res = await tutorApis.get_my_edu(tutor.AcademyId);
        res[0] && dispatch(slice.actions.setEducation(res[0]))
        return res[0]
    };
}


export function postEducation(body) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const edu = getState().edu.education

        const res = await tutorApis.post_edu(body);

        dispatch(slice.actions.setEducation({...edu, ...body}))
        return res
    };
}