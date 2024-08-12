import { createSlice } from "@reduxjs/toolkit";
import * as tutorApis from "../../axios/tutor";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getTutor } from "./tutorData";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "bank",
    initialState: {
        bank: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setAccounting: (state, action) => {
            state.isLoading = false;
            state.bank = action.payload;
        },
    },
});

export default slice.reducer;

// ACTIONS

export function setAccounting() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const tutor = getState().tutor.tutor
        const res = await tutorApis.get_bank_details(tutor.AcademyId);
        res[0] && dispatch(slice.actions.setAccounting(res[0]))
        return res[0]
    };
}


export const updateAccounting = (id, body) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.isLoading())
        const bank = getState().bank.bank

        const res = await tutorApis.update_tutor_bank(id, body);
        dispatch(slice.actions.setAccounting({ ...bank, ...body }))

        return res
    };
}
