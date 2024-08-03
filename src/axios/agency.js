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


//sub tutors


export const create_subTutor = async (agencyId,body) => {
    try {
        const { data } = await apiClient.post(`/agency/${agencyId}/sub-tutor`, body);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const update_subTutor = async (id,body) => {
    try {
        const { data } = await apiClient.put(`/agency/sub-tutor/${id}`, body);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const delete_subTutor = async (id) => {
    try {
        const { data } = await apiClient.delete(`/agency/sub-tutor/${id}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const get_subTutor = async (id) => {
    try {
        const { data } = await apiClient.get(`/agency/sub-tutor/${id}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const get_subTutors = async (agencyId) => {
    try {
        const { data } = await apiClient.get(`/agency/${agencyId}/sub-tutors`);
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
