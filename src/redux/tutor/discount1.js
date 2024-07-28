import { createSlice } from "@reduxjs/toolkit";
import * as tutorApis from "../../axios/tutor";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getTutor } from "./tutorData";

// Create a slice with your event-related reducers
const slice = createSlice({
  name: "discount",
  initialState: {
    discount: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    isLoading: (state) => {
      state.isLoading = true;
    },
    setDiscount: (state, action) => {
      state.isLoading = false;
      state.discount = action.payload;
    },
  },
});

export default slice.reducer;

export function setDiscount() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading());
    const tutor = getState().tutor.tutor;

    const res = await tutorApis.get_tutor_discount_form(tutor.AcademyId);
    dispatch(slice.actions.setDiscount(res[0]));
    return res[0];
  };
}

export const updateDiscount = async (id, body) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading());
    const discount = getState().discount.discount;

    const res = await tutorApis.update_discount_form(id, body);
    dispatch(slice.actions.setDiscount({ ...discount, ...body }));

    return res;
  };
};

export const postDiscount = async (body) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading());
    const tutor = getState().tutor.tutor;

    const res = await tutorApis.upload_tutor_disocunt_form(body);
    dispatch(
      slice.actions.setDiscount({ AcademyId: tutor.AcademyId, ...body })
    );

    return res;
  };
};
