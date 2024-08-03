import { apiClient, showErrorToast } from "./config";

export const create_agency = async (body) => {
    try {
        const { data } = await apiClient.post('/agency', body);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const update_agency = async (id,body) => {
    try {
        const { data } = await apiClient.put(`/agency/${id}`, body);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const delete_agency = async (id) => {
    try {
        const { data } = await apiClient.delete(`/agency/${id}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const get_agency = async (id) => {
    try {
        const { data } = await apiClient.get(`/agency/${id}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const get_agencies = async () => {
    try {
        const { data } = await apiClient.get('/agency');
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
