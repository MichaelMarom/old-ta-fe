// slice.js
import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { get_my_data } from "../../axios/student";
import { redirect_to_login } from "../../utils/auth";

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
      state.student = action.payload;
    },
  },
});

export default slice.reducer;

// ACTIONS

export function setStudent(data) {
  return async (dispatch) => {
    console.log(data, "data:36", _.isObject(data), !_.isEmpty(data))
    if (data && _.isObject(data))
      dispatch(slice.actions.setStudent(data));
    else {
      dispatch(slice.actions.isLoading());
      const nullValues = ["undefined", "null"];
      const studentUserId = localStorage.getItem("student_user_id");

      if (nullValues.includes(studentUserId)) {
        return dispatch(slice.actions.setStudent({}));
      }
      const res = await get_my_data(studentUserId);
      res && !res?.response?.data?.message && dispatch(slice.actions.setStudent(res));
    }

    return data;
  };
}
