import { apiClient, showErrorToast } from "./config"

export let delete_new_subject = async (subject, AcademyId) => {
    try {
        const { data } = await apiClient.post('/admin/delete-new-subject', { subject, AcademyId })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let post_new_subject = async (id, subject, AcademyId) => {
    try {
        const { data } = apiClient.post('/admin/post-new-subject', { id, subject, AcademyId })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_tutor_new_subject = async () => {
    try {
        const { data } = await apiClient.get('/admin/tutor-new-subject', {})
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_tutor_data = () => {
    return new Promise((resolve, reject) => {
        apiClient.get('/admin/tutor-data', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export let set_tutor_status = async (Id, Status) => {
    try {
        const { data } = await apiClient.post('/admin/set-tutor-status', {
            Id, Status
        })
        return data
    } catch (err) {
        showErrorToast(err)
    }
}

export let get_student_data = async () => {
    try {
        const { data } = await apiClient.get('/admin/student-data', {})
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let set_student_status = (Id, Status) => {
    try {
        const { data } = apiClient.post('/admin/set-student-status', {
            Id, Status
        })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const post_termsOfUse = async (data) => {
    try {
        const response = await apiClient.post(`/admin/store-terms`, data);
        return response;
    } catch (error) {
        showErrorToast(error)
    }
};

export const get_adminConstants = async (id = 1) => {
    try {
        const response = await apiClient.get(`/admin/get-constants/${id}`);
        return response;
    } catch (error) {
        showErrorToast(error)
    }
};

/**
 * 
 * @param {Array} body array of emails
 * @returns 
 */
export const send_sms = async (body) => {
    try {
        const data = await apiClient.post('/send-message', body)
        return data
    }
    catch (err) {
        return err
    }

}


