import { createSlice } from "@reduxjs/toolkit";
import * as studentApis from "../../axios/student";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "studentBank",
    initialState: {
        studentBank: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setAccounting: (state, action) => {
            state.isLoading = false;
            state.studentBank = action.payload;
        },
    },
});

export default slice.reducer;

// ACTIONS

export function setStudentAccounting() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const student = getState().student.student
        const res = await studentApis.get_bank_details(student.AcademyId);
        console.log(res[0])
        res[0] && dispatch(slice.actions.setAccounting(res[0]))
        return res[0]
    };
}


export const updateStudentAccounting = (id, body) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const bank = getState().studentBank.studentBank

        const res = await studentApis.update_bank_details(id, body);
        dispatch(slice.actions.setAccounting({ ...bank, ...body }))

        return res
    };
}


export const updateStudentAccountingState = (body) => {
    return async (dispatch) => {
        dispatch(slice.actions.setAccounting(body))
        return body
    };
}