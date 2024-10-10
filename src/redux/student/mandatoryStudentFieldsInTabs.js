import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { applicationMandatoryFields, studentMandtoryFields } from "../../constants/constants";

// Create a slice with your event-related reducers
const slice = createSlice({
  name: "studentMissingFields",
  initialState: {
    studentMissingFields: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    isLoading: (state) => {
      state.isLoading = true;
    },
    setFieldsAndTabs: (state, action) => {
      state.isLoading = false;
      state.studentMissingFields = action.payload;
    },
  },
});

export default slice.reducer;
export const { setFieldsAndTabs } = slice.actions;

export const setStudentMissingFeildsAndTabs = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading());
    const student = getState().student.student;
    const bank = getState().studentBank.studentBank;

    const missingFields = [];
    const tabs = { bank, setup:student };

    studentMandtoryFields.Accounting.map((item) => {
      if (
        (!tabs.bank?.[item.column] || tabs.bank?.[item.column] === "null") &&
       
        (!item.mandatory ||
          item.mandatory?.values?.includes(
            tabs?.["bank"]?.[item.mandatory?.column]
          ))
      ) {
        missingFields.push({ tab: "Accounting", field: item.column });
      }
    });

    studentMandtoryFields.Setup.map((item) => {
      if (
        (!student?.[item.column] ||
          student?.[item.column] === "null" ||
          !student?.[item.column]?.length) &&
          (!item.notMandatory ||
            !item.notMandatory?.values?.includes(
              tabs?.["setup"]?.[item.notMandatory?.column]
            ))&&
        (!item.mandatory ||
          (item.mandatory?.tab &&
            item.mandatory?.values?.includes(
              tabs?.[item.mandatory?.tab]?.[item.mandatory?.column]
            )))
      ) {
        missingFields.push({
          tab: "Setup",
          field: item.column,
          value: student?.[item.column],
        });
      }
    });

    if (!student.AgreementDate)
      missingFields.push({
        tab: "Terms Of Use",
        field: "AgreementDate",
        value: student.AgreementDate,
      });

    dispatch(slice.actions.setFieldsAndTabs(missingFields));
  };
};
