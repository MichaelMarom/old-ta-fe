import { createSlice } from "@reduxjs/toolkit";
import * as tutorApis from "../../axios/tutor";
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
    const edu = getState().edu.education;
    const tutor = getState().tutor.tutor;
    const bank = getState().bank.bank;
    const discount = getState().discount.discount;
    console.log(bank)

    const missingFields = [];
    const tabs = { bank, discount, edu };

    applicationMandatoryFields.Accounting.map((item) => {
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

    applicationMandatoryFields.Motivate.map((item) => {
      if (
        (!tabs.discount?.[item.column] ||
          tabs.discount?.[item.column] === "null") &&
        (!item.mandatory ||
          (item.mandatory?.tab &&
            item.mandatory?.values?.includes(
              tabs?.[item.mandatory?.tab]?.[item.mandatory?.column]
            )))
      ) {
        missingFields.push({ tab: "Motivate", field: item.column });
      }
    });

    applicationMandatoryFields.Setup.map((item) => {
      if (
        (!tutor?.[item.column] ||
          tutor?.[item.column] === "null" ||
          !tutor?.[item.column]?.length) &&
        (!item.mandatory ||
          (item.mandatory?.tab &&
            item.mandatory?.values?.includes(
              tabs?.[item.mandatory?.tab]?.[item.mandatory?.column]
            )))
      ) {
        missingFields.push({
          tab: "Setup",
          field: item.column,
          value: tutor?.[item.column],
        });
      }
    });

    applicationMandatoryFields.Education.map((item) => {
      let columnValueExistInDB = tabs.edu?.[item.column];
      let columnValueNullInString = tabs.edu?.[item.column] === "null";

      if (
        (!columnValueExistInDB || columnValueNullInString) &&
        (!item.notMandatory ||
          !item.notMandatory?.values?.includes(
            tabs?.["edu"]?.[item.notMandatory?.column]
          )) &&
        (!item.mandatory ||
          item.mandatory?.values?.includes(
            tabs?.["edu"]?.[item.mandatory?.column]
          ))
      ) {
        missingFields.push({
          tab: "Education",
          field: item.column,
          value: tabs?.["edu"]?.[item.column],
        });
      }
    });
    console.log(missingFields);

    if (!tutor.AgreementDate)
      missingFields.push({
        tab: "Terms Of Use",
        field: "AgreementDate",
        value: tutor.AgreementDate,
      });

    dispatch(slice.actions.setFieldsAndTabs(missingFields));
  };
};
