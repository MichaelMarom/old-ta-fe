import { v4 as uuidv4 } from 'uuid'
import { apiClient, showErrorToast } from './config'
import { capitalizeFirstLetter } from '../helperFunctions/generalHelperFunctions';

export let upload_new_subject = (faculty, subject, reason, AcademyId, facultyId) => {
    return new Promise((resolve, reject) => {

        apiClient.post('/tutor/new-subject', {
            faculty, subject, reason, AcademyId, facultyId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)
                // reject(error)
            })
    })
}
export const uploadFile = (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        apiClient.post('/tutor/upload-resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((result) => {
                return result.data;
            })
            .catch(error => {
                showErrorToast(error)
            });
    } catch (error) {
        showErrorToast(error)
    }
};

export let get_subject = (id) => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/subjects', {
            params: {
                id
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                showErrorToast(error)

                // reject(error)
            })

    })
}

export const get_tutor_feedback_questions = async () => {
    try {
        const { data } = await apiClient.get(`/tutor/feedback/questions`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
        console.log(err)
        return err
    }
}

export let get_faculty = () => {

    return new Promise((resolve, reject) => {
        apiClient.get('/tutor/faculties', {
            params: {

            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)
            })
    })
}


export let get_tutor_status = (faculty, subject, reason, AcademyId) => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/tutor-status', {
            params: {
                faculty, subject, reason, AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let get_countries = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/countries', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export let get_state = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/state', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export let get_experience = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/experience', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export let get_gmt = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/gmt', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let get_response = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/response', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export let upload_setup_form = (fname, uname, mname, lname, email, cell, acadId, add1, add2, city, state, zipCode,
    country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId) => {
    return new Promise((resolve, reject) => {

        apiClient.post('/tutor/form-one', {
            fname, uname, mname, lname, email, cell, acadId, add1, add2, city, state, zipCode, country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export const post_edu = async (body) => {
    try {
        const data = await apiClient.post('/tutor/edu', body)
        return data
    }
    catch (error) {
        showErrorToast(error)
        return error
    }
}

//not using
export let upload_tutor_rates_form = (MutiStudentHourlyRate, CancellationPolicy,
    FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption, SubscriptionPlan,
    AcademyId, DiscountCode, CodeSubject, CodeShareable, MultiStudent, IntroSessionDiscount, CodeStatus) => {
    return new Promise((resolve, reject) => {

        apiClient.post('/tutor/tutor-rates', {
            MutiStudentHourlyRate, CancellationPolicy, IntroSessionDiscount, FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption, SubscriptionPlan, AcademyId, DiscountCode, CodeShareable, MultiStudent, CodeSubject, CodeStatus
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export const formatted_tutor_sessions = async (tutorId) => {
    try {
        const { data } = await apiClient.get(`/tutor/sessions/formatted/${tutorId}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}

export const feedback_records = async (tutorId, timeZone) => {
    try {
        const { data } = await apiClient.get(`/tutor/feedbacks/${tutorId}`, { params: { timeZone } });
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_degree = () => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/degree', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let get_level = () => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/level', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}



export let get_certificates = () => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/certificates', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export let get_user_data = (user_id) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/education', {
            params: {
                user_id
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export const student_public_profile = async (studentId, tutorId = null) => {
    try {
        const { data } = await apiClient.get(`/tutor/${tutorId}/profile/${studentId}`);
        return data;
    }
    catch (e) {
        showErrorToast(e)
    }
}

export let upload_tutor_rates = async (rate, grades, id, faculty, subject) => {
    try {
        const { data } = await apiClient.post(`/tutor/rates/${faculty}/${subject}/${id}`, {
            grades,
            rate
        })
        return data
    }
    catch (error) {
        return error
    }
}

export const remove_subject_rates = async (id) => {
    try {
        const { data } = await apiClient.delete(`/subject-rate/${id}`)
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export let get_my_data = (AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/my-data', {
            params: {
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)
                // reject(error)
            })

    })
}

export let get_my_edu = (AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/my-edu', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export const get_tutor_subjects = async (id) => {
    try {
        const { data } = await apiClient.get(`/tutor/subjects/${id}`)
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}
export const get_faculty_subject = async (id) => {
    try {
        const { data } = await apiClient.get(`/subject/${id}`)
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_rates = (AcademyId, facultyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/my-rate', {
            params: {
                AcademyId,
                facultyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let get_bank_details = (AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/tutor-bank-details', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let get_tutor_rates = (AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.get('/tutor/tutor-rate', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}

export let upload_tutor_bank = (email, acct_name, acct_type, bank_name, acct, routing, ssh, payment_option, AcademyId) => {
    return new Promise((resolve, reject) => {

        apiClient.post('/tutor/payment', {
            email, acct_name, acct_type, bank_name, acct, routing, ssh, payment_option, AcademyId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)
            })

    })
}

export let get_tutor_setup = async (idObject) => {
    try {
        const { data } = await apiClient.get('/tutor/tutor-setup', {
            params: idObject
        })
        return data
    }
    catch (err) {
        showErrorToast(err)
    }
}

export let get_tutor_setup_by_userId = async (id) => {
    try {
        const { data } = await apiClient.get('/tutor/tutor-setup', {
            params: {
                userId: id
            }
        })
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }

}

export let get_tutor_setup_by_acaId = async (id) => {
    try {
        const { data } = await apiClient.get('/tutor/tutor-setup', {
            params: {
                AcademyId: id
            }
        })
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }

}

export const storeEventAPI = async (eventDetails) => {
    try {
        console.log(eventDetails, 'dataformat');
        const newEvent = {
            title: eventDetails.title,
            allDay: eventDetails.allDay,
            start: eventDetails.start,
            end: eventDetails.end,
        };
        const response = await apiClient.post("/api/store-event", newEvent);
        return response.data;
    } catch (error) {
        showErrorToast(error)

        console.error("Error:", error);
    }
};

export const fetchStudentsBookings = async (tutorId) => {
    try {
        const response = await apiClient.get(`api/bookings/${tutorId}`);
        return response.data;
    } catch (error) {
        showErrorToast(error)

        console.error("Error:", error);
    }
};

export const new_subj_request_exist = async (subject) => {
    try {
        const response = await apiClient.get(`/tutor/newsubject/${subject}`);
        return response;
    } catch (error) {
        showErrorToast(error)
        console.error("Error:", error);
        return error
    }
}

export let get_tutor_market_data = (id) => {

    return new Promise((resolve, reject) => {


        apiClient.get('/tutor/market-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch(error => {
                showErrorToast(error)

                // reject(error)
            })

    })
}


export const updateTutorDisableslots = async (tutorAcademyId, body) => {
    try {
        const { data } = await apiClient.put(`/tutor/update/${tutorAcademyId}`, body);
        return data
    }
    catch (error) {
        showErrorToast(error)
    }
}
export const addDisabledDates = async (date) => {
    try {
        const response = await apiClient.post("/api/store-disabled-dates", date);
        return response.data;
    } catch (error) {
        showErrorToast(error)

        console.error("Error:", error);
    }
};


export const post_tutor_setup = async (data) => {
    try {
        let dataObject = {}
        if (data.photo !== undefined) dataObject.Photo = data.photo;
        if (data.video !== undefined) dataObject.Video = data.video;
        if (data.recordedVideo !== undefined) dataObject.VideoRecorded = data.recordedVideo;
        if (data.fname !== undefined) dataObject.FirstName = data.fname;
        if (data.mname !== undefined) dataObject.MiddleName = data.mname;
        if (data.lname !== undefined) dataObject.LastName = data.lname;
        if (data.add1 !== undefined) dataObject.Address1 = data.add1;
        if (data.add2 !== undefined) dataObject.Address2 = data.add2;
        if (data.city !== undefined) dataObject.CityTown = data.city;
        if (data.state !== undefined) dataObject.StateProvince = data.state;
        if (data.zipCode !== undefined) dataObject.ZipCode = data.zipCode;
        if (data.country !== undefined) dataObject.Country = data.country;
        if (data.cell !== undefined) dataObject.CellPhone = data.cell;
        if (data.timeZone !== undefined) dataObject.GMT = data.timeZone;
        if (data.response_zone !== undefined) dataObject.ResponseHrs = data.response_zone;
        if (data.screenName !== undefined) dataObject.TutorScreenname = data.screenName;
        if (data.headline !== undefined) dataObject.HeadLine = data.headline;
        if (data.intro !== undefined) dataObject.Introduction = data.intro;
        if (data.motivation !== undefined) dataObject.Motivate = data.motivation;
        if (data.userId !== undefined) dataObject.userId = data.userId;
        if (data.grades !== undefined) dataObject.Grades = JSON.stringify(data.grades);
        if (data.start !== undefined) dataObject.StartVacation = data.start;
        if (data.end !== undefined) dataObject.EndVacation = data.end;
        if (data.vacation_mode !== undefined) dataObject.VacationMode = data.vacation_mode;
        if (data.AgreementDate !== undefined) dataObject.AgreementDate = data.AgreementDate
        if (data.Step !== undefined) dataObject.Step = data.Step;
        if (data.Status !== undefined) dataObject.Status = data.Status

        dataObject.TutorScreenname = data.mname.length ?
            `${capitalizeFirstLetter(data.fname)}. ${capitalizeFirstLetter(data.mname[0])}. 
            ${capitalizeFirstLetter(data.lname[0])}.` :
            `${capitalizeFirstLetter(data.fname)}. ${capitalizeFirstLetter(data.lname[0])}.`;

        dataObject.AcademyId = uuidv4();
        return await apiClient.post('/tutor/setup', dataObject);
    } catch (error) {
        console.log(error)
        return error
    }
}

export const setAgreementDateToNullForAll = async () => {
    try {
        const data = apiClient.put('/tutor/agreement-updated')
        return data
    }
    catch (error) {
        return error
    }
}
export const get_tutor_students = async (AcademyId) => {
    try {
        const { data } = await apiClient.get(`/tutor/get_students/${AcademyId}`);
        return data;
    } catch (error) {
        showErrorToast(error)

        console.log(error)
    }
}

export const get_sessions_details = async (AcademyId) => {
    try {
        const { data } = await apiClient.get(`/tutor/session/${AcademyId}`);
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const get_last_pay_day = async () => {
    try {
        const { data } = await apiClient.get(`/p-payment/last_payday`);
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const get_tutor_profile = async (tutorId, studentId) => {
    try {
        const { data } = await apiClient.get(`/profile/${tutorId}/${studentId}`);
        return data
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const post_tutor_ad = async (body) => {
    try {
        const { data } = await apiClient.post(`/tutor/market-place`, body)
        return data;
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const fetch_tutor_ads = async (id) => {
    try {
        const { data } = await apiClient.get(`/tutor/market-place/list/${id}`)
        return data;
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const fetch_students_published_ads = async () => {
    try {
        const { data } = await apiClient.get(`/tutor/market-place/classified`)
        return data;
    }
    catch (error) {
        console.log(error)
        return error
    }
}

export const deleteAdFromShortlist = async (adId, tutorId) => {
    try {
        const { data } = await apiClient.delete(`/tutor/${tutorId}/market-place/shortlist/${adId}`);
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
        const { data } = await apiClient.post('/tutor/market-place/shortlist', {
            StudentAdId: adId,
            TutorId: studentId
        });
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}

export const get_shortlist_ads = async (tutorId) => {
    try {
        const { data } = await apiClient.get(`/tutor/market-place/shortlist/${tutorId}/list`);
        return data
    }
    catch (e) {
        console.log(e.message)
        showErrorToast(e)
        return e
    }
}

export const fetch_ad = async (id) => {
    try {
        const { data } = await apiClient.get(`/tutor/ad/${id}`)
        return data
    }
    catch (error) {
        showErrorToast(error)
    }
}

export const put_ad = async (id, body) => {
    try {
        const { data } = await apiClient.put(`/tutor/ad/${id}`, body)
        return data
    }
    catch (error) {
        return error
    }
}


export const get_tutor_against_code = async (code) => {
    try {
        const { data } = await apiClient.get(`/tutor/rate/${code}`);
        return data;
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export const delete_ad = async (id) => {
    try {
        const data = apiClient.delete(`/tutor/ad/${id}`)
        return data;
    }
    catch (err) {
        showErrorToast(err)
        return err
    }
}

export const getSessionDetail = async (sessionId, timezone) => {
    try {
        const { data } = await apiClient.get(`/collab/${sessionId}`, { params: { timezone } })
        return data;
    }
    catch (err) {
        showErrorToast(err)
    }
}