import { apiClient, showErrorToast } from "./config";

export const get_payment_report = async (studentId, timeZone) => {
    try {
      const { data } = await apiClient.get(
        `/student/payment-report/${studentId}`,
        { params: { timeZone } }
      );
      return data;
    } catch (err) {
      showErrorToast(err);
    }
  };
  
  export const get_all_feedback_questions = async (isStudentLoggedIn = 1) => {
    try {
      const { data } = await apiClient.get(
        `/questions/list/${isStudentLoggedIn}`
      );
      return data;
    } catch (err) {
      showErrorToast(err);
    }
  };
  
  export const get_feedback_to_question = async (
    sessionId,
    tutorId,
    studentId,
    isstudentgiver = 1
  ) => {
    try {
      const { data } = await apiClient.get(
        `/questions/${studentId}/${tutorId}/${sessionId}/${isstudentgiver}`
      );
      return data;
    } catch (err) {
      showErrorToast(err);
       
    }
  };
  
  /**
   *
   * @param {String} sessionId session id
   * @param {String} tutorId tutor Id
   * @param {String} studentId student id
   * @param {String} feedbackQuestionId feedback que4stion id (from feedbackQuestions)
   * @param {Int} rating rating in number till 5
   * @param {Boolean} givenByStudent is feedback given by student or tutor
   * @returns
   */
  export const post_feedback_to_question = async (
    sessionId,
    tutorId,
    studentId,
    feedbackQuestionId,
    rating,
    givenByStudent = 1
  ) => {
    const body = {
      SessionId: sessionId,
      FeedbackQuestionsId: feedbackQuestionId,
      rating,
      TutorId: tutorId,
      StudentId: studentId,
      IsStudentGiver: givenByStudent,
    };
    try {
      const { data } = await apiClient.post(`/questions`, body);
      return data;
    } catch (err) {
      showErrorToast(err);
       
    }
  };



export const formatted_student_sessions = async (studentId) => {
    const { data } = await apiClient.get(
      `/student/sessions/formatted/${studentId}`
    );
    return data;
};

export const get_tutor_bookings = async (tutorId) => {
  try {
    const { data } = await apiClient.get(`/student/tutor/bookings/${tutorId}`);
    return data;
  } catch (err) {
    showErrorToast(err);
  }
};



export const save_student_events = async (body) => {
    try {
      await apiClient.post("/student/booking", body);
    } catch (e) {
      showErrorToast(e);
    }
  };
  
  export const save_student_lesson = async (body) => {
    try {
      await apiClient.post("/student/lesson", body);
    } catch (e) {
      showErrorToast(e);
    }
  };
  
  export const update_student_lesson = async (id, body) => {
    try {
      await apiClient.put(`/student/lesson/${id}`, body);
    } catch (e) {
      showErrorToast(e);
    }
  };
  
  export const get_student_lesson = async (studentId, tutorId) => {
    try {
      const { data } = await apiClient.get("/student/lesson", { params: { studentId, tutorId } });
      return data
    } catch (e) {
      showErrorToast(e);
    }
  };
  
  export const delete_student_lesson = async (id) => {
    try {
      const { data } = await apiClient.delete(`/student/lesson/${id}`);
      return data
    } catch (e) {
      showErrorToast(e);
    }
  };
  
  export const get_student_tutor_events = async (studentId, tutorId) => {
    try {
      const { data } = await apiClient.get(
        `/student/booking/${studentId}/${tutorId}`
      );
      return data;
    } catch (err) {
      showErrorToast(err);
    }
  };


export const fetch_student_photos = async (ids) => {
    try {
      const { data } = await apiClient.get(`/student/setup/photos`, {
        params: { AcademyIds: ids },
      });
      return data;
    } catch (err) {
      showErrorToast(err);
    }
  };

  