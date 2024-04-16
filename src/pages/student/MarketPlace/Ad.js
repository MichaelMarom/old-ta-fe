import { useEffect, useState } from "react";
import { get_student_market_data, post_student_ad } from "../../../axios/student";
import { get_faculty_subject } from "../../../axios/tutor";

import Layout from "./Layout";
import { useSelector } from "react-redux";
import UserRichTextEditor from "../../../components/common/RichTextEditor/UserRichTextEditor";
import { CERTIFICATES, EXPERIENCE, LEVEL, languages } from "../../../constants/constants";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import Actions from "../../../components/common/Actions";
import { useNavigate } from "react-router-dom";
import { compareStates } from "../../../helperFunctions/generalHelperFunctions";
import Tooltip from "../../../components/common/ToolTip";

const Ads = () => {
    const { student } = useSelector(state => state.student)

    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const [header, setHeader] = useState('')
    const [errors, setErrors] = useState({})
    const [adText, setAdText] = useState('')
    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState('')
    const [faculties, setFaculties] = useState([])
    const [level, setLevel] = useState('')
    const [experience, setExperience] = useState('')
    const [language, setLanguage] = useState([])
    const [timeZone, setTimezone] = useState('')
    const [certificate, setCertificate] = useState('')
    const [loading, setLoading] = useState(false)

    let [activeFaculty, setActiveFaculty] = useState('')

    // eslint-disable-next-line react-hooks/exhaustive-deps 
    const currentState = {
        AdHeader: header,
        Subject: subject,
        FacultyId: activeFaculty,
        TutorCertificate: certificate,
        TutorExperience: experience,
        TutorGMT: timeZone,
        TutorEduLevel: level,
        TutorLanguages: language,
    }

    useEffect(() => {
        setUnSavedChanges(compareStates({
            AdHeader: '',
            Subject: '',
            FacultyId: '',
            TutorCertificate: '',
            TutorExperience: '',
            TutorGMT: '',
            TutorEduLevel: '',
            TutorLanguages: [],
        }, currentState))
    }, [currentState])

    const languageOptions = languages.map((language) => ({
        value: language,
        label: language,
    }));

    const navigate = useNavigate()

    useEffect(() => {
        if (student.AcademyId) {
            setAdText(`Hello teachers,
        My name is ${student.ScreenName}.
        I am a ${student.Grade} school grade student.  I live in ${student.Country},GMT: ${student.GMT}.
        I am looking for a tutor who can teach me <b>${subject.length ? subject : '(SELECTED SUBJECT HERE)'}</b>, 
        who has teaching experience of <b>${experience.length ? experience : '(SELECTED TUTOR EXPERIENCE)'}</b> years, 
        and speaks <b>${language.length ? language.map(item => item.value) : "(SELECTED LANGUAGE(s) HERE)"}</b>. 
        And preferable from time zones like mine <b>${timeZone.length ? timeZone : "(SELECTED TIMEZONE HERE)"}</b>. 
        Please contact me as soon as possible.`)
        }
    }, [student, subject, language, experience, timeZone])

    useEffect(() => {
        setSubject('')
        if (activeFaculty.length) {
            get_faculty_subject(activeFaculty)
                .then(result => !result?.response?.data && setSubjects(result))
                .catch(err => toast.error(err.message))
        }
    }, [activeFaculty])

    useEffect(() => {
        if (student.AcademyId) {
            get_student_market_data(student.AcademyId)
                .then(faculties => {
                    !faculties?.response?.data && setFaculties(faculties)
                })
                .catch(err => toast.error(err.message))
        }
    }, [student])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.length) return toast.warning('Please Select Subject for posting Ad!')
        setLoading(true)
        const data = await post_student_ad({
            AcademyId: student.AcademyId, AdText: adText, AdHeader: header,
            Subject: subject, FacultyId: activeFaculty, TutorCertificate: certificate,
            TutorExperience: experience, TutorGMT: timeZone, TutorEduLevel: level, TutorLanguages: JSON.stringify(language),
            Country: student.Country, Language: student.Language, Grade: student.Grade,
            GMT: student.GMT, Status: 'published', Published_At: new Date()
        });
        setLoading(false)

        if (!data?.response?.data?.message?.length) {
            navigate('/student/market-place/list')
        }
    }

    return (
        <Layout>
            <div className="" style={{ height: "70vh", overflowY: "auto" }}>
                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className=" d-flex justify-content-center align-items-end mb-2"
                            style={{ width: "90%", gap: '3%' }}>
                            <label className="fs-3 ">Ad's Header</label>
                            <input
                                className="form-control  shadow m-0"
                                style={{ width: "60%", }}
                                type="text"
                                required
                                placeholder="Type here a catchy message to attract tutors"
                                value={header}
                                onChange={(e) => {
                                    if (e.target.value.length < 121) {
                                        delete errors.header;
                                        setErrors(errors)
                                        return setHeader(e.target.value)
                                    }
                                    setErrors({ ...errors, header: "Max Limit 120 characters" })
                                }} />
                            {errors.header && <p className="text-sm text-danger m-0">{errors.header} </p>}
                        </div>
                        <div className="d-flex justify-content-center" style={{ gap: "2%" }}>
                            <div className="border p-2 shadow " style={{ width: "40%" }} >
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Faculty</label>
                                    <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setActiveFaculty(e.target.value)}
                                        value={activeFaculty}>
                                        <option value={''} disabled>Select</option>

                                        {faculties.map((item, index) =>
                                            <option key={index} value={item.Id}>{item.Faculty}</option>
                                        )}
                                    </select>
                                </div>
                                {!!activeFaculty.length && <div className=" d-flex justify-content-between  align-items-center m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Subject</label>
                                    {subjects.length ? <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setSubject(e.target.value)}
                                        value={subject}>
                                        <option value={''} disabled>Select</option>

                                        {subjects.map((item, index) =>
                                            <option key={index} value={item.SubjectName}>{item.SubjectName}</option>
                                        )}
                                    </select> : <div className="text-danger" style={{ fontSize: "14px" }}>No subjects registered in the selected faculty </div>}
                                </div>}
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Grade</label>
                                    <input disabled
                                        className="form-control  shadow m-0"
                                        style={{ maxWidth: "300px" }}
                                        type="text"
                                        required
                                        value={student.Grade}
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Country</label>
                                    <input disabled
                                        className="form-control  shadow m-0"
                                        style={{ maxWidth: "300px" }}
                                        type="text"
                                        required
                                        value={student.Country}
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">GMT</label>
                                    <input disabled
                                        className="form-control  shadow m-0"
                                        style={{ maxWidth: "300px" }}
                                        type="text"
                                        required
                                        value={student.GMT} />
                                </div>
                                <div className=" d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Language</label>
                                    <input disabled
                                        className="form-control  shadow m-0"
                                        style={{ maxWidth: "300px" }}
                                        type="text"
                                        required
                                        value={student.Language}
                                    />
                                </div>

                            </div>
                            <div className="border p-2 shadow " style={{ width: "40%" }}>
                                <h4>Tutor Requirments</h4>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Education Level</label>
                                    <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setLevel(e.target.value)}
                                        value={level}>
                                        <option value={''} disabled>Select</option>

                                        {LEVEL.map((item, index) =>
                                            <option key={index} value={item}>{item}</option>
                                        )}
                                        <option value={'any'} >Any</option>

                                    </select>
                                </div>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Experience</label>
                                    <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setExperience(e.target.value)}
                                        value={experience}>
                                        <option value={''} disabled>Select</option>

                                        {EXPERIENCE.map((item, index) =>
                                            <option key={index} value={item}>{item}</option>
                                        )}
                                        <option value={'any'} >Any</option>

                                    </select>
                                </div>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Certificate</label>
                                    <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setCertificate(e.target.value)}
                                        value={certificate}>
                                        <option value={''} disabled>Select</option>

                                        {CERTIFICATES.map((item, index) =>
                                            item.includes('<<<') ?
                                                <option key={index} value={item} disabled>{item}</option> :
                                                <option key={index} value={item}>{item}</option>
                                        )}
                                        <option value={'any'} >Any</option>

                                    </select>
                                </div>
                                <div className=" d-flex justify-content-between  align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Language</label>
                                    <div className="w-100" style={{ maxWidth: "300px" }}>
                                        <ReactSelect
                                            isMulti
                                            placeholder="Select other language(s)"
                                            className="language-selector w-100"
                                            id="other-languages"
                                            value={language}
                                            onChange={(selectedOption) => {
                                                setLanguage(selectedOption)
                                            }}
                                            options={languageOptions}
                                            isDisabled={false} />
                                    </div>

                                </div>
                                <div className="d-flex justify-content-between align-items-start m-1"
                                    style={{ width: "100%" }}>
                                    <label className="">Timezone Differnce <Tooltip text={'time zone diff'} /> </label>
                                    <select className="form-select" style={{ maxWidth: "300px" }}
                                        required
                                        onChange={(e) => setTimezone(e.target.value)}
                                        value={timeZone}>
                                        <option value={''} disabled>Select</option>

                                        {["+/- 0", "+/- 1", "+/- 2", "+/- 3", "+/- 4", "+/- 5"].map((item, index) =>
                                            <option key={index} value={item}>{item}</option>
                                        )}
                                        <option value={'any'} >Any</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border rounded  shadow-lg my-4">
                            <div className="highlight">
                                The text below was generated generically by the computer. You can change the text to fit your personality. The ad will appear for 7 days for the selected subject. If you tutor multi subjects, you can publish a different ad for each subject.
                            </div>
                            <UserRichTextEditor
                                disabled={false}
                                readOnly={false}
                                required
                                className="w-100  fs-5 mb-4 "
                                height={"200px"} value={adText}
                                onChange={(value) => setAdText(value)}
                                placeholder={'Write You\'r Ad here '} />
                        </div>
                    </div>
                    <Actions
                        SaveText="Publish"
                        editDisabled
                        unSavedChanges={unSavedChanges}
                        loading={loading}
                    />
                </form>
            </div>
        </Layout>
    );
}

export default Ads;