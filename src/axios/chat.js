import {
    apiClient,
    showErrorToast
} from "./config";

export const get_chats = async (loggedInUserId, role) => {
    try {
        const { data } = await apiClient.get(`/chats/${role}/${loggedInUserId}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_chat_message = async (chatId) => {
    try {
        console.log(chatId)
        const { data } = await apiClient.get(`/messages/${chatId}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}
export const post_message = async (body) => {
    try {
        const { data } = await apiClient.post('/message', body);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

/**
 * 
 * @param {{User1ID:"String", User2ID:"String"}} body 
 * @returns 
 */
export const create_chat = async (body) => {
    try {
        console.log(body)
        const { data } = await apiClient.post('/chat', body);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const set_online_status = async (isOnline, id, role) => {
    try {
        const { data } = await apiClient.post(`/chat/online/${id}/${role}`, { Online: isOnline });
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const recomendation = async (id) => {
    try {
        const { data } = await apiClient.get(`/chat/recomendation/${id}`)
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err;

    }
}