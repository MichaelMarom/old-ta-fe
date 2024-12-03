// slice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createStudentBookings,
  delete_student_lesson,
  get_student_lesson,
  get_student_tutor_events,
  save_student_events,
  save_student_lesson,
  update_student_lesson,
  updateStudentBooking,
} from "../../axios/calender";
import { convertToDate } from "../../components/common/Calendar/Calendar";
import { create_chat } from "../../axios/chat";

const slice = createSlice({
  name: "studentBookings",
  initialState: {
    reservedSlots: [],
    bookedSlots: [],
    studentId: "",
    tutorId: "",
    subjectName: "",
    studentBookings: {},
    isLoading: false,
    error: null,
    lessons: [],
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
      state.isLoading = false;
      state.bookedSlots = action.payload;
    },
    setReservedSlots: (state, action) => {
      state.isLoading = false;
      const slotsWithDateObj = action.payload.map((slot) => ({
        ...slot,
        start: convertToDate(slot.start),
        end: convertToDate(slot.end),
        createdAt: convertToDate(slot.createdAt),
      }));
      state.reservedSlots = slotsWithDateObj;
    },
    setBookedSlots: (state, action) => {
      state.isLoading = false;
      const slotsWithDateObj = action.payload.map((slot) => ({
        ...slot,
        start: convertToDate(slot.start),
        end: convertToDate(slot.end),
        createdAt: convertToDate(slot.createdAt),
      }));
      state.bookedSlots = slotsWithDateObj;
    },

    setLessons: (state, action) => {
      state.isLoading = false;
      const slotsWithDateObj = action.payload.map((slot) => ({
        ...slot,
        start: convertToDate(slot.start),
        end: convertToDate(slot.end),
        createdAt: convertToDate(slot.createdAt),
      }));
      state.lessons = slotsWithDateObj;
    },
  },
});

export default slice.reducer;

// ACTIONS

// export const setReservedSlots = (reservedSlots) => {
//   return async (dispatch) => {
//     dispatch(slice.actions.setReservedSlots(reservedSlots));
//   };
// };

export const setLessons = (lessons) => {
  return async (dispatch) => {
    dispatch(slice.actions.setLessons(lessons));
  };
};

// export const setBookedSlots = (bookedSlots) => {
//   return async (dispatch) => {
//     dispatch(slice.actions.setBookedSlots(bookedSlots));
//   };
// };

// export function getStudentBookings(studentId, tutorId) {
//   return async (dispatch) => {
//     dispatch(slice.actions.isLoading(true));
//     const result = await get_student_tutor_events(studentId, tutorId);
//     if (result?.length) {
//       const reservedSlots = result
//         .map((data) => JSON.parse(data.reservedSlots))
//         .flat();
//       const bookedSlots = result
//         .map((data) => JSON.parse(data.bookedSlots))
//         .flat();
//       dispatch(slice.actions.setReservedSlots(reservedSlots));
//       dispatch(slice.actions.setBookedSlots(bookedSlots));
//     }
//     return result;
//   };
// }

// export function postStudentBookings(data) {
//   return async (dispatch) => {
//     dispatch(slice.actions.isLoading(true));
//     await save_student_events(data);
//     return await dispatch(getStudentBookings(data.studentId, data.tutorId));
//   };
// }

//lessons
export function postStudentLesson(data) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading(true));
   const result =  await save_student_lesson(data);
    const chatExists = getState().chat.chats.filter(
      (chat) => chat.AcademyId === data.tutorId
    );

    //create chat if chat is not initiated: it will create on first lessons
    !chatExists.length &&
      (await create_chat({ User1ID: data.studentId, User2ID: data.tutorId }));
      await dispatch(getStudentLessons(data.studentId, data.tutorId));
    return result;
  };
}

export function postStudentBookingWithInvoiceAndLessons(invoice, lessons) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading(true));
    await createStudentBookings(invoice, lessons);
    const chatExists = getState().chat.chats.filter(
      (chat) => chat.AcademyId === lessons[0].tutorId
    );

    //create chat if chat is not initiated: it will create on first lessons
    !chatExists.length &&
      (await create_chat({ User1ID: lessons[0].studentId, User2ID: lessons[0].tutorId }));
    return await dispatch(getStudentLessons(lessons[0].studentId, lessons[0].tutorId));
  };
}


export function updateStudentBookingWithInvoiceAndLessons(invoice, id, lesson) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading(true));
    await updateStudentBooking(id, lesson, invoice);

    return await dispatch(getStudentLessons(lesson.studentId, lesson.tutorId));
  };
}

export function updateStudentLesson(id, body) {
  return async (dispatch) => {
    dispatch(slice.actions.isLoading(true));
    await update_student_lesson(id, body);
    return await dispatch(getStudentLessons(body.studentId, body.tutorId));
  };
}

export function getStudentLessons(studentId, tutorId) {
  return async (dispatch) => {
    dispatch(slice.actions.isLoading(true));
    const result = await get_student_lesson(studentId, tutorId);
    if (result?.length) {
      dispatch(slice.actions.setLessons(result));
    }
    return result;
  };
}

export function deleteStudentLesson(event) {
  return async (dispatch) => {
    dispatch(slice.actions.isLoading(true));
    const result = await delete_student_lesson(event.id);
    return await dispatch(getStudentLessons(event.studentId, event.tutorId));
  };
}
