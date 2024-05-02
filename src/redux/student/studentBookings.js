// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { get_student_tutor_events, save_student_events } from "../../axios/student";
import { convertToDate } from "../../components/common/Calendar/Calendar";

const slice = createSlice({
    name: "studentBookings",
    initialState: {
        reservedSlots: [],
        bookedSlots: [],
        studentId: '',
        tutorId: '',
        subjectName: '',
        studentBookings: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getReservedSlots: (state, action) => {
            state.isLoading = false;
            state.reservedSlots = action.payload;
        },
        getBookedSlots: (state, action) => {
            state.isLoading = false
            state.bookedSlots = action.payload;
        },
        setReservedSlots: (state, action) => {
            state.isLoading = false;
            const slotsWithDateObj = action.payload.map((slot) => ({ ...slot, start: convertToDate(slot.start), end: convertToDate(slot.end), createdAt: convertToDate(slot.createdAt) }));
            state.reservedSlots = slotsWithDateObj;
        },
        setBookedSlots: (state, action) => {
            state.isLoading = false;
            const slotsWithDateObj = action.payload.map((slot) => ({ ...slot, start: convertToDate(slot.start), end: convertToDate(slot.end), createdAt: convertToDate(slot.createdAt) }));
            state.bookedSlots = slotsWithDateObj;
        }
    },
});

export default slice.reducer;

// ACTIONS

export const setReservedSlots = (reservedSlots) => {
    return async (dispatch) => {
        dispatch(slice.actions.setReservedSlots(reservedSlots))
    }
}

export const setBookedSlots = (bookedSlots) => {
    return async (dispatch) => {
        dispatch(slice.actions.setBookedSlots(bookedSlots))
    }
}

export function getStudentBookings(studentId, tutorId) {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading(true));
        const result = await get_student_tutor_events(studentId, tutorId);
        if (result?.length) {
            const reservedSlots = result.map(data => JSON.parse(data.reservedSlots)).flat()
            const bookedSlots = result.map(data => JSON.parse(data.bookedSlots)).flat()
            dispatch(slice.actions.setReservedSlots(reservedSlots))
            dispatch(slice.actions.setBookedSlots(bookedSlots))
        }
        return result;
    };
}

export function postStudentBookings(data) {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading(true));
        await save_student_events(data);
        return await dispatch(getStudentBookings(data.studentId, data.tutorId))
    };
}


