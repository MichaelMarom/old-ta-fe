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
export const { setFieldsAndTabs } = slice.actions


export const setMissingFeildsAndTabs = (tutor) => {
    return async (dispatch) => {

        dispatch(slice.actions.isLoading())
        const res = await tutorApis.get_my_edu(tutor.AcademyId);
        const bank = await tutorApis.get_bank_details(tutor.AcademyId);
        const rate = await tutorApis.get_tutor_rates(tutor.AcademyId);
        const missingFields = [];
        const tabs = { setup: tutor, bank: bank[0], rate: rate[0], edu: res?.[0] };

        applicationMandatoryFields.Accounting.map((item) => {
            if (
                (!bank?.[0]?.[item.column] || bank?.[0]?.[item.column] === "null") &&
                item.mandatory &&
                item.mandatory?.tab &&
                item.mandatory?.values?.includes(
                    tabs?.[item.mandatory?.tab]?.[item.mandatory?.column]
                )
            ) {
                missingFields.push({ tab: "Accounting", field: item.column });
            }
        });

        applicationMandatoryFields.Motivate.map((item) => {
            if (
                (!rate?.[0]?.[item.column] || rate?.[0]?.[item.column] === "null") &&
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
                (!tutor?.[item.column] || tutor?.[item.column] === "null" || !tutor?.[item.column]?.length) &&
                (!item.mandatory ||
                    (item.mandatory?.tab &&
                        item.mandatory?.values?.includes(
                            tabs?.[item.mandatory?.tab]?.[item.mandatory?.column]
                        )))
            ) {
                missingFields.push({
                    tab: "Setup",
                    field: item.column,
                    value: tutor[item.column],
                });
            }
        });

        applicationMandatoryFields.Education.map((item) => {
            if (
                (!res?.[0]?.[item.column] || res?.[0]?.[item.column] === "null") &&
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
                    value: tabs["edu"][item.column],
                });
            }
        });
        dispatch(slice.actions.setFieldsAndTabs(missingFields))
    };
}

