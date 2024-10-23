import { v4 as uuidv4 } from "uuid";
import { apiClient, showErrorToast } from "./config";
import { capitalizeFirstLetter } from "../utils/common";

export let upload_new_subject = (body) => {
  return new Promise((resolve, reject) => {
    apiClient
      .post("/tutor/new-subject", body)
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        showErrorToast(err);
      });
  });
};
export const uploadFile = (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    apiClient
      .post("/tutor/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch((err) => {
        showErrorToast(err);
      });
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_subject = (id) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("/tutor/subjects", {
        params: {
          id,
        },
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        showErrorToast(err);

        showErrorToast(err);

        // reject(err)
      });
  });
};

export const get_tutor_feedback_questions = async () => {
  try {
    const { data } = await apiClient.get(`/tutor/feedback/questions`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_faculties = async () => {
  try {
    const { data } = await apiClient.get("/tutor/faculties", {
      params: {},
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_tutor_status = (faculty, subject, reason, AcademyId) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("/tutor/tutor-status", {
        params: {
          faculty,
          subject,
          reason,
          AcademyId,
        },
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        showErrorToast(err);

        // reject(err)
      });
  });
};

export const post_edu = async (body) => {
  try {
    const data = await apiClient.post("/tutor/edu", body);
    return data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};

export let upload_tutor_disocunt_form = (body) => {
  try {
    const { data } = apiClient.post("/tutor/tutor-discounts", body);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const update_discount_form = async (id, body) => {
  try {
    const { data } = await apiClient.put(`/tutor/tutor-discounts/${id}`, body);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

//not using
export const formatted_tutor_sessions = async (tutorId) => {
  const { data } = await apiClient.get(`/tutor/sessions/formatted/${tutorId}`);
  return data;
};

export const student_public_profile = async (studentId, tutorId = null) => {
  try {
    const { data } = await apiClient.get(
      `/tutor/${tutorId}/profile/${studentId}`
    );
    return data;
  } catch (e) {
    showErrorToast(e);
  }
};

export let upload_tutor_rates = async (rate, grades, id, faculty, subject) => {
  try {
    const { data } = await apiClient.post(
      `/tutor/rates/${faculty}/${encodeURIComponent(subject)}/${id}`,
      {
        grades,
        rate,
      }
    );
    return data;
  } catch (err) {
    return err;
  }
};

export const remove_subject_rates = async (id) => {
  try {
    const { data } = await apiClient.delete(`/subject-rate/${id}`);
    return data;
  } catch (err) {}
};

export let get_my_edu = async (AcademyId) => {
  try {
    const { data } = await apiClient.get("/tutor/my-edu", {
      params: {
        AcademyId,
      },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const get_tutor_subjects = async (id) => {
  try {
    const { data } = await apiClient.get(`/tutor/subjects/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const get_faculty_subject = async (id) => {
  try {
    const { data } = await apiClient.get(`/subject/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_rates = async (AcademyId, facultyId) => {
  try {
    const { data } = await apiClient.get("/tutor/my-rate", {
      params: {
        AcademyId,
        facultyId,
      },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let fetch_tutors_photos = async (AcademyIds) => {
  try {
    const { data } = await apiClient.get("/tutor/photos", {
      params: {
        AcademyIds,
      },
    });
    return data;
  } catch (e) {
    showErrorToast(e);
  }
};

export let get_bank_details = async (AcademyId) => {
  try {
    const { data } = await apiClient.get("/tutor/tutor-bank-details", {
      params: {
        AcademyId,
      },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let get_tutor_discount_form = async (AcademyId) => {
  try {
    const { data } = await apiClient.get("/tutor/tutor-discounts", {
      params: {
        AcademyId,
      },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export let upload_tutor_bank = async (
  email,
  acct_name,
  acct_type,
  bank_name,
  acct,
  routing,
  ssh,
  payment_option,
  AcademyId
) => {
  try {
    const { data } = await apiClient.post("/tutor/payment", {
      email,
      acct_name,
      acct_type,
      bank_name,
      acct,
      routing,
      ssh,
      payment_option,
      AcademyId,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const update_tutor_bank = async (id, body) => {
  try {
    const { data } = await apiClient.put(`/tutor/payment/${id}`, body);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

/**
 *
 * @param {Object} idObject  {userId} OR {AcademyId}
 * @returns
 */
export let get_tutor_setup = async (idObject) => {
  try {
    const { data } = await apiClient.get("/tutor/tutor-setup", {
      params: idObject,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const fetch_calender_detals = async (id) => {
  try {
    const { data } = await apiClient.get("/tutor/tutor-setup/calender", {
      params: { AcademyId: id },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const getAllTutorLessons = async (tutorId) => {
  try {
    const { data } = await apiClient.get(`/tutor/lesson`, {
      params: { tutorId },
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const new_subj_request_exist = async (subject) => {
  try {
    const response = await apiClient.get(`/tutor/newsubject/${subject}`);
    return response;
  } catch (err) {
    showErrorToast(err);
    console.error("Error:", err);
    return err;
  }
};

export let get_tutor_market_data = (id) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get("/tutor/market-data", { params: { id } })
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        showErrorToast(err);
      });
  });
};

export const updateTutorDisableslots = async (tutorAcademyId, body) => {
  try {
    const { data } = await apiClient.put(
      `/tutor/update/${tutorAcademyId}`,
      body
    );
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};
export const addDisabledDates = async (date) => {
  try {
    const response = await apiClient.post("/api/store-disabled-dates", date);
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
};

/**
 *
 * @param {Object} data mandatory keys(FirstName, LastName, MiddleName, userId)
 * @returns
 */
export const post_tutor_setup_at_signup = async (data) => {
  try {
    return await apiClient.post("/tutor/setup/signup", data);
  } catch (err) {
    showErrorToast(err);
    throw new Error(err);
  }
};

export const getDoc = async (docType, id) => {
  try {
    const response = await apiClient.get(`/tutor/my-edu/doc/${id}`, {
      params: { docType },
    });
    return response.data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};

export const updateTutorSetup = async (tutorAcademyId, body) => {
  try {
    const { data } = await apiClient.put(
      `/tutor/setup/${tutorAcademyId}`,
      body
    );
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const setAgreementDateToNullForAll = async () => {
  try {
    const data = apiClient.put("/tutor/agreement-updated");
    return data;
  } catch (err) {
    return err;
  }
};

export const get_tutor_students = async (AcademyId) => {
  try {
    const { data } = await apiClient.get(`/tutor/get_students/${AcademyId}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const get_sessions_details = async (AcademyId) => {
  try {
    const { data } = await apiClient.get(`/tutor/session/${AcademyId}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const get_last_pay_day = async () => {
  try {
    const { data } = await apiClient.get(`/p-payment/last_payday`);
    return data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};

export const get_tutor_profile = async (tutorId, studentId) => {
  try {
    const { data } = await apiClient.get(`/profile/${tutorId}/${studentId}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const post_tutor_ad = async (body) => {
  try {
    const { data } = await apiClient.post(`/tutor/market-place`, body);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const fetch_tutor_ads = async (id) => {
  try {
    const { data } = await apiClient.get(`/tutor/market-place/list/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const fetch_students_published_ads = async () => {
  try {
    const { data } = await apiClient.get(`/tutor/market-place/classified`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const deleteAdFromShortlist = async (adId, tutorId) => {
  try {
    const { data } = await apiClient.delete(
      `/tutor/${tutorId}/market-place/shortlist/${adId}`
    );
    return data;
  } catch (e) {
    showErrorToast(e);
  }
};

export const add_to_shortlist = async (adId, studentId) => {
  try {
    const { data } = await apiClient.post("/tutor/market-place/shortlist", {
      StudentAdId: adId,
      TutorId: studentId,
    });
    return data;
  } catch (e) {
    showErrorToast(e);
  }
};

export const get_shortlist_ads = async (tutorId) => {
  try {
    const { data } = await apiClient.get(
      `/tutor/market-place/shortlist/${tutorId}/list`
    );
    return data;
  } catch (e) {
    showErrorToast(e);
  }
};

export const fetch_ad = async (id) => {
  try {
    const { data } = await apiClient.get(`/tutor/ad/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};

export const put_ad = async (id, body) => {
  try {
    const { data } = await apiClient.put(`/tutor/ad/${id}`, body);
    return data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};

export const get_tutor_against_code = async (code) => {
  try {
    const { data } = await apiClient.get(`/tutor/rate/${code}`);
    return data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};

export const delete_ad = async (id) => {
  try {
    const data = apiClient.delete(`/tutor/ad/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
    return err;
  }
};
