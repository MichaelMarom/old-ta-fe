import { createSlice } from "@reduxjs/toolkit";
import { get_chats } from "../../axios/chat";

const slice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        isLoading: true,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getChats: (state, action) => {
            state.isLoading = false;
            state.chats = action.payload;
        },
        setChats: (state, action) => {
            state.isLoading = false;
            state.chats = action.payload
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setChats(userId, role) {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const result = await get_chats(userId, role)
        if(result?.response?.data) return []

        dispatch(slice.actions.setChats(result));
        return result;
    };
}

