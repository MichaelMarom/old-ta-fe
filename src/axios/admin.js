import { apiClient, showErrorToast } from "./config";

export let delete_new_subject = async (subject, AcademyId) => {
  try {
    const data = await apiClient.post("/admin/delete-new-subject", {
      subject,
      AcademyId,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

// export let post_new_subject = async (id, subject, AcademyId) => {
//   try {
//     const { data } = apiClient.post("/admin/add-new-subject", {
//       id,
//       subject,
//       AcademyId,
//     });
//     return data;
//   } catch (err) {
//     showErrorToast(err);
//   }
// };
export let accept_new_subject = async (id, subject, AcademyId) => {
  try {
    const  data =await apiClient.post("/admin/accept-new-subject", {
      id,
      subject,
      AcademyId,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_new_subj_count = async () => {
  try {
    const { data } = await apiClient.get("/admin/tutor/new-subject/count");
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_tutor_new_subject = async () => {
  try {
    const { data } = await apiClient.get("/admin/tutor-new-subject", {});
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_tutor_data = async (status) => {
  try {
    const { data } = await apiClient
      .get("/admin/tutor-data", { params: { status } })
    return data
  }
  catch (err) {
    showErrorToast(err);
  }
};

export let get_role_count_by_status = async (role) => {
  try {
    const { data } = await apiClient.get(`/admin/${role}/status/count`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_user_list = async (status) => {
  try {
    const { data } = await apiClient.get("/admin/user/list");
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let set_tutor_status = async (Id, Status) => {
  try {
    const { data } = await apiClient.post("/admin/set-tutor-status", {
      Id,
      Status,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_student_data = async (status) => {
  try {
    const { data } = await apiClient.get("/admin/student-data", { params: { status } });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let set_student_status = (Id, Status) => {
  try {
    const data = apiClient.post("/admin/set-student-status", {
      Id,
      Status,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const post_termsOfUse = async (data) => {
  try {
    const response = await apiClient.post(`/admin/store-terms`, data);
    return response;
  } catch (error) {
    showErrorToast(error);
  }
};

export const get_adminConstants = async (id = 1) => {
  try {
    const response = await apiClient.get(`/admin/get-constants/${id}`);
    return response;
  } catch (error) {
    showErrorToast(error);
  }
};

/**
 *
 * @param {Array} body array of numbers and message
 * @returns
 */
export const send_sms = async (body) => {
  try {
    const data = await apiClient.post("/send-message", body);
    return data;
  } catch (err) {
    showErrorToast(err)
  }
};



/**
 *
 * @param {Array} body array of emails and message and subject
 * @returns
 */
export const send_email = async (body) => {
  try {
    const data = await apiClient.post("/send-email", body);
    return data;
  } catch (err) {
    showErrorToast(err)
    throw new Error('Failed to send email')
  }
};




/**
 *
 * @param {Array} body array of emails and message and subject
 * @returns
 */
export const send_templated_tutor_marketing_email = async (body) => {
  try {
    const data = await apiClient.post("/send-email/tutor/template/marketing", body);
    return data;
  } catch (err) {
    showErrorToast(err)
    throw new Error('Failed to send email')
  }
};



/**
 *
 * @param {Array} body array of emails and message and subject
 * @returns
 */
export const send_temaplted_email = async (body) => {
  try {
    const data = await apiClient.post("/send-email/chat", body);
    return data;
  } catch (err) {
    showErrorToast(err)
    // throw new Error('Failed to send email')
  }
};




/**
 * 
 * @param {Object} body it will contain name, text and created_by
 * @returns created data
 */
export const save_email_temp = async (body) => {
  try {
    const { data } = await apiClient.post('/admin/email-template', body)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @returns 
 */
export const get_email_temp_list = async () => {
  try {
    const { data } = await apiClient.get('/admin/email-template/list')
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @param {Object} body it will contain name, text and created_by
 * @param {UUID} id it will contain id
 * @returns
 */
export const update_email_temp = async (body, id) => {
  try {
    const { data } = await apiClient.put(`/admin/email-template/${id}`, body)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @param {UUID} id 
 * @returns 
 */
export const get_email_temp = async (id) => {
  try {
    const { data } = await apiClient.get(`/admin/email-template/${id}`)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}


/**
 * 
 * @param {UUID} id 
 * @returns 
 */
export const delete_email_temp = async (id) => {
  try {
    const { data } = await apiClient.delete(`/admin/email-template/${id}`)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @param {Object} body it will contain name, text and optional(fileName, attachment)
 * @returns created data
 */
export const save_sms_mms_temp = async (body) => {
  try {
    const { data } = await apiClient.post('/admin/sms-mms-temp', body)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @returns 
 */
export const get_sms_mms_list = async () => {
  try {
    const { data } = await apiClient.get('/admin/sms-mms-temp/list')
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @param {Object} body it will contain name, text and optional(fileName, attachment)
 * @param {INT} id it will contain id
 * @returns
 */
export const update_sms_mms_temp = async (body, id) => {
  try {
    const { data } = await apiClient.put(`/admin/sms-mms-temp/${id}`, body)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}

/**
 * 
 * @param {INT} id 
 * @returns 
 */
export const get_sms_mms_temp = async (id) => {
  try {
    const { data } = await apiClient.get(`/admin/sms-mms-temp/${id}`)
    return data
  }
  catch (err) {
    showErrorToast(err)
  }
}


