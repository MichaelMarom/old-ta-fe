import {
    apiClient,
    showErrorToast
} from "./config";

export let upload_setup_form = (fname, mname, sname, email,
    lang, secLan, parentAEmail, parentBEmail, parentAName,
    parentBName,
    is_18, pwd, cell, grade,
    add1, add2, city, state, zipCode, country, timeZone,
    photo, acadId,
    parentConsent, userId) => {

    return new Promise((resolve, reject) => {
        apiClient.post('/student/setup', {
            fname, mname, sname, email, lang, secLan, parentAEmail, parentBEmail, parentAName, parentBName,
            is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, photo, acadId,
            parentConsent, userId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}

export const post_student_agreement = async (userId, body) => {
    try {
        const { data } = await apiClient.put(`/student/setup/agreement/${userId}`, body)
        return data
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export let get_student_setup = (AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/student/setup', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}

export const get_student_setup_by_userId = async (userId) => {
    try {
        const { data } = await apiClient.get('/student/setup', {
            params: {
                userId
            }
        })
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err);
        return err
    }
}

export let get_student_grade = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/student/grade', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}

export let get_student_market_data = async (id) => {
    try {
        const { data } = await apiClient.get('/student/market-data', { params: { id } })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

/**
 * 
 * @param {Object} body {
    AcademyId,
    AdText,
    AdHeader ,
    Subject ,
    FacultyId,
    TutorCertificate ,
    TutorExperience,
    TutorGMT,
    TutorEduLevel,
    TutorLanguages,
    Country,
    Language,
    Grade,
    GMT,
    Status,
    Published_At 
}
 */
export const post_student_ad = async (body) => {
    try {
        const { data } = await apiClient.post('/student/ad', body)
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}
/**
 * @param {String} id Id of Ad
 * @param {Object} body {
    AcademyId,
    AdText,
    AdHeader ,
    Subject ,
    FacultyId,
    TutorCertificate ,
    TutorExperience,
    TutorGMT,
    TutorEduLevel,
    TutorLanguages,
    Country,
    Language,
    Grade,
    GMT,
    Status,
    Published_At 
} */
export const put_ad = async (id, body) => {
    try {
        const { data } = await apiClient.put(`/student/ad/${id}`, body)
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_ad = async (id) => {
    try {
        const { data } = await apiClient.get(`/student/ad/${id}`)
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const fetch_student_ads = async (id) => {
    try {
        const { data } = await apiClient.get(`/student/ad/${id}/list`)
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export let get_tutor_subject = async (subject) => {
    try {
        const { data } = await apiClient.get('/student/tutor-subject', { params: { subject } })
        console.log(data, 'in axios123')
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const getTutorsAccordingToSubjectandFaculty = async (subjectName, facultyId, studentId) => {
    try {
        const { data } = await apiClient.get(`/student/${studentId}/subject/${subjectName}/faculty/${facultyId}`)
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let upload_student_short_list = async (body) => {
    try {
        const result = await apiClient.post('/student/short-list', body)
        return result.data
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export let get_student_short_list = async (student) => {
    try {
        const { data } = await apiClient.get(`/student/short-list/${student}`)
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_my_data = async (AcademyId) => {
    try {
        const { data } = await apiClient.get('/student/my-data', {
            params: {
                AcademyId
            }
        })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }

}


export let get_student_short_list_data = async (id) => {

    try {
        const { data } = await apiClient.get('/student/short-list-data', { params: { id } })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const save_student_events = async (body) => {
    await apiClient.post('/student/booking', body);
}

export const get_student_tutor_events = async (studentId, tutorId) => {
    try {
        const { data } = await apiClient.get(`/student/booking/${studentId}/${tutorId}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const get_student_events = async (studentId) => {
    try {
        const { data } = await apiClient.get(`/student/booking/${studentId}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const formatted_student_sessions = async (studentId) => {
    try {
        const { data } = await apiClient.get(`/student/sessions/formatted/${studentId}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const get_tutor_bookings = async (tutorId) => {
    try {
        const { data } = await apiClient.get(`/student/tutor/bookings/${tutorId}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
    }
}

export const post_bank_details = async (payload) => {
    try {
        const { data } = await apiClient.post('/student/bank', payload);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_bank_details = async (id) => {
    try {
        const { data } = await apiClient.get(`/student/bank/${id}`);
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_payment_report = async (studentId, timeZone) => {
    try {
        const { data } = await apiClient.get(`/student/payment-report/${studentId}`, { params: { timeZone } });
        return data
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_all_feedback_questions = async (isStudentLoggedIn = 1) => {
    try {
        const { data } = await apiClient.get(`/questions/list/${isStudentLoggedIn}`);
        return data;
    } catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const get_feedback_to_question = async (sessionId, tutorId, studentId, isstudentgiver = 1) => {
    try {
        const { data } = await apiClient.get(`/questions/${studentId}/${tutorId}/${sessionId}/${isstudentgiver}`);
        return data;
    } catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

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
export const post_feedback_to_question = async (sessionId, tutorId, studentId, feedbackQuestionId, rating, givenByStudent = 1) => {
    const body = {
        SessionId: sessionId,
        FeedbackQuestionsId: feedbackQuestionId,
        rating,
        TutorId: tutorId,
        StudentId: studentId,
        IsStudentGiver: givenByStudent
    }
    try {
        const { data } = await apiClient.post(`/questions`, body);
        return data;
    } catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export const update_student_shortlist = async (AcademyId, studentId, subject, body) => {
    try {
        const { data } = await apiClient.put(`/student/short-list/${AcademyId}/${studentId}/${subject}`, body)
        return data;
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export const getBookedSlot = async (AcademyId) => {
    try {

        let result = await apiClient.get('/student/booked-slot', { params: { AcademyId } })

        return result

    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export const code_applied = async (studentId, tutorId) => {
    try {
        let { data } = await apiClient.put(`/code-applied/${studentId}/${tutorId}`)
        return data;
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export const fetch_published_ads = async () => {
    try {
        const { data } = await apiClient.get('/student/ads');
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}

export const add_to_shortlist = async (adId, studentId) => {
    try {
        const { data } = await apiClient.post('/student/ads/shortlist', {
            AdId: adId,
            StudentId: studentId
        });
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}

export const get_shortlist_ads = async (studentId) => {
    try {
        const { data } = await apiClient.get(`/student/ads/shortlist/list/${studentId}`);
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}

export const deleteAdFromShortlist = async (adId, studentId) => {
    try {
        const { data } = await apiClient.delete(`/student/ads/shortlist/${adId}/${studentId}`);
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}