import { createSlice } from "@reduxjs/toolkit";
import { get_chats } from "../../axios/chat";
import { convertToDate } from "../../components/common/Calendar/Calendar";

const slice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        isLoading: true,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setNotifications: (state, action) => {
            console.log(action.payload)
            action.payload.sort((a, b) => convertToDate(b.date).getTime() - convertToDate(a.date).getTime())
            console.log(action.payload)
           
            state.isLoading = false;
            state.notifications = action.payload;
        },
    },
});

export default slice.reducer;
export const { setNotifications } = slice.actions;
// ACTIONS

export function getNotifications(userId, role) {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const result = await get_chats(userId, role)
        if (result?.response?.data) return []

        dispatch(slice.actions.setNotifications(result));
        return result;
    };
}

