import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { applicationMandatoryFields } from "../../constants/constants";

// Create a slice with your event-related reducers
const slice = createSlice({
  name: "missingFields",
  initialState: {
    missingFields: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    isLoading: (state) => {
      state.isLoading = true;
    },
    setFieldsAndTabs: (state, action) => {
      state.isLoading = false;
      state.missingFields = action.payload;
    },
  },
});

export default slice.reducer;
export const { setFieldsAndTabs } = slice.actions;

export const setMissingFeildsAndTabs = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading());
    const student = getState().student.student;
    const bank = getState().bank.studentBank;
    console.log(bank)

    const missingFields = [];
    const tabs = { bank };

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

    console.log(missingFields);

    if (!student.AgreementDate)
      missingFields.push({
        tab: "Terms Of Use",
        field: "AgreementDate",
        value: student.AgreementDate,
      });

    dispatch(slice.actions.setFieldsAndTabs(missingFields));
  };
};
