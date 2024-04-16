import { useEffect, useState } from "react";

import { fetch_tutor_ads, get_tutor_market_data, post_tutor_ad } from "../../../axios/tutor";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter, compareStates } from "../../../helperFunctions/generalHelperFunctions";
import Pill from '../../common/Pill'
import Loading from "../../common/Loading";
import { RxCross2 } from "react-icons/rx";
import { FaTrashCan } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import Actions from "../../common/Actions";
import { toast } from "react-toastify";
import UserRichTextEditor from "../../common/RichTextEditor/UserRichTextEditor";


const CreateComponent = ({ setActiveTab }) => {
    const { tutor } = useSelector(state => state.tutor);
    let [education, set_education] = useState({})
    const [subjects, set_subjects] = useState([])
    const [fetching, setFetching] = useState(true);
    const [subject, setSubject] = useState('');
    const [grades, setGrades] = useState([])
    const [header, setHeader] = useState('');
    const [error, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const AcademyId = localStorage.getItem('tutor_user_id');
    const [unSavedChanges, setUnSavedChanges] = useState(false);
    console.log(tutor)

    const [addText, setAddText] = useState(`Hello Students. My screen name is ${tutor.TutorScreenname ? capitalizeFirstLetter(tutor.TutorScreenname) : ''}, 
    I teach ${subject.length ? subject : "......"}  for ${grades.length ? grades.map(elem => '[' + elem + ']') : '.....'}. 
    I am ${education ? education?.EducationalLevel : '...'} with experience of ${education ? education?.EducationalLevelExperience : '...'}. 
    I live in ${tutor.Country}, time zone ${tutor.GMT}.  Click here to view my profile for my work experience, certificates, and Diploma.
    There you can look at my calendar-scheduling for availability, and book your lesson.`)

    useEffect(() => {
        if (AcademyId !== null) {
            get_tutor_market_data(AcademyId)
                .then((result) => {
                    if (!result?.repsonse?.data) {
                        let { Subjects, Education } = result
                        set_subjects(Subjects)
                        set_education(Education[0])
                        setFetching(false)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [AcademyId])

    useEffect(() => {
        if (tutor.AcademyId) {
            setAddText(`Hello Students. My screen name is ${capitalizeFirstLetter(tutor.TutorScreenname)}, 
        I teach ${subject.length ? subject : "......"}  for ${grades.length ? grades.map(elem => '[' + elem + ']') : '.....'}. 
        I am ${education ? education?.EducationalLevel : '...'} with experience of ${education ? education?.EducationalLevelExperience : '...'}. 
        I live in ${tutor.Country}, time zone ${tutor.GMT}.  Click here to view my profile for my work experience, certificates, and Diploma.
        There you can look at my calendar-scheduling for availability, and book your lesson.`)
        }
    }, [subject, tutor, education, grades])

    const handleClickPill = (grade) => {
        const gradeExist = grades.find(item => item === grade)
        if (gradeExist) {
            return setGrades(grades.filter(item => item !== grade))
        }
        return setGrades([...grades, grade])
    }

    const handleSave = async (e) => {
        e.preventDefault();
        if (!grades.length) return toast.warning('Please select at least one school grade!')
        setLoading(true)
        const ads = await fetch_tutor_ads(AcademyId)
        setLoading(false)
        if (ads?.length) {
            const adExist = ads.find(ad => ad.Subject === subject)
            if (adExist) return toast.warning('You can  Publish 1 Ad per Subject every 7 days. this subject is already published in the last 7 days!')
        }
        const data = await post_tutor_ad({
            AcademyId,
            AdText: addText,
            AdHeader: header,
            Subject: subject,
            Certificate: education.Certificate,
            Experience: education.EducationalLevelExperience,
            GMT: tutor.GMT,
            Country: tutor.Country,
            EducationalLevel: education.EducationalLevel,
            Languages: education.NativeLang,
            Grades: grades,
            Published_At: new Date(),
            Status: 'published'
        })
        if (data?.response?.data?.message) {
            return toast.error(data?.response?.data?.message)
        }
        setSubject('')
        setGrades([])
        setHeader('')
        setAddText(`Hello Students. My screen name is ${capitalizeFirstLetter(tutor.TutorScreenname)}, 
        I teach ${subject.length ? subject : "......"}  for ${grades.length ? grades.map(elem => '[' + elem + ']') : '.....'}. 
        I am ${education ? education?.EducationalLevel : '...'} with experience of ${education ? education?.EducationalLevelExperience : '...'}. 
        I live in ${tutor.Country}, time zone ${tutor.GMT}.  Click here to view my profile for my work experience, certificates, and Diploma.
        There you can look at my calendar-scheduling for availability, and book your lesson.`)

        toast.success('Data Saved Successfully');
    }

    //compare changes
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    const currentState = {
        Subject: subject,
        Grades: grades,
        AdHeader: header,
        // AdText: addText
    }
    useEffect(() => {
        let initialState = {
            Subject: '',
            Grades: [],
            AdHeader: '',
            // AdText: `Hello Students. My screen name is ${capitalizeFirstLetter(tutor.TutorScreenname)}, 
            // I teach ${subject.length ? subject : "......"}  for ${grades.length ? grades.map(elem => '[' + elem + ']') : '.....'}. 
            // I am ${education ? education?.EducationalLevel : '...'} with experience of ${education ? education?.EducationalLevelExperience : '...'}. 
            // I live in ${tutor.Country}, time zone ${tutor.GMT}.  Click here to view my profile for my work experience, certificates, and Diploma.
            // There you can look at my calendar-scheduling for availability, and book your lesson.`
        }
        setUnSavedChanges(compareStates(initialState, currentState))
    }, [currentState, tutor, grades, education, subject])

    if (fetching || !tutor.AcademyId)
        return <Loading />
    if (!education?.EducationalLevel)
        return <div className="text-danger fs-5ٖ">please fill education tab to generate Ads</div>
    return (
        <div style={{ height: "78vh", overflowY: "auto" }}>
            <form onSubmit={handleSave}>
                <div className="container mt-4">
                    <div className="d-flex justify-content-between">
                        {/* <div className="form-switch form-check w-25" style={{ marginBottom: "-10px" }}>
                            <input className="form-check-input"
                                type="checkbox"
                                role="switch"
                                disabled
                            />
                            <label htmlFor="reportAd"
                                onClick={() => toast.warning('You can publish only if you saved the ad before!')}>
                                <b>Publish This Ad</b>
                            </label>
                        </div> */}
                        <div className="highlight w-100" >
                            This is the place where you can promote yourself by publishing your private ad for all students to watch. If you tutor multi subjects, you can select one subject at the time by changing the header.
                        </div>
                    </div>

                    <div className="rounded border shadow p-2">
                        <div className=" d-flex w-100 justify-content-start align-items-end mb-4"
                            style={{ gap: "10px" }}>
                            <div style={{ width: "300px" }} className="d-flex align-items-center flex-column justify-content-start ">
                                <label htmlFor="">Subject</label>
                                <select className="form-select shadow"
                                    required
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}>
                                    <option value={''} disabled>Select</option>

                                    {(subjects || []).map((item, index) =>
                                        <option key={index} value={item.subject}>{item.subject}</option>
                                    )}
                                </select>
                            </div>
                            <div className=" d-flex align-items-center"
                                style={{ gap: "10px", width: "60%" }}>
                                <label className="fs-3 ">Ad's Header</label>
                                <input
                                    className="form-control  shadow m-0"
                                    style={{ width: "60%" }}
                                    type="text"
                                    placeholder="Type here a catchy message promoting your subject"
                                    required
                                    value={header}
                                    onChange={(e) => {
                                        if (e.target.value.length < 121) {
                                            delete error.header;
                                            setErrors(error)
                                            return setHeader(e.target.value)
                                        }
                                        setErrors({ ...error, header: "Max Limit 120 characters" })
                                    }} />
                                {error.header && <p className="text-sm text-danger m-0">{error.header} </p>}
                            </div>
                            <div className="d-flex align-items-center justify-content-end"
                                style={{ width: "10%", gap: "20px" }}>
                                <div className="click-effect-elem rounded-circle p-3"
                                    style={{ cursor: "pointer", background: "lightGray" }}>
                                    <FaTrashCan size={32} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-start"
                            style={{ gap: "10px" }}>
                            <div style={{ width: "100%" }}
                                className=" mb-2 d-flex flex-column justify-content-between border p-2">
                                <label htmlFor="">Tutor Teaching Grade(s)</label>
                                <div className="w-100 d-flex justify-content-between">

                                    <div className="d-flex  " style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
                                        {
                                            JSON.parse(tutor?.Grades ?? '[]').map(grade =>
                                                <div style={{ width: "115px", margin: "2px" }} onClick={() => handleClickPill(grade)}>
                                                    <Pill
                                                        label={grade}
                                                        hasIcon={true} icon={grades.find(item => item === grade) ? <RxCross2 /> : <GoPlus />}
                                                        color={grades.find(item => item === grade) ? "success" : "primary"} />
                                                </div>)
                                        }
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: "50%" }} className="d-flex flex-column justify-content-start border p-2">
                                <label htmlFor="">Tutor Languages</label>
                                <div className="d-flex " style={{ width: "99%", overflowX: "auto", overflowY: "hidden" }}>
                                    <div style={{ width: "100px", margin: "2px" }}>
                                        <Pill label={JSON.parse(education.NativeLang).value} hasIcon={false} color="success" />
                                    </div>
                                    {
                                        JSON.parse(education.NativeLangOtherLang || '[]').map(lang =>
                                            <div style={{ width: "100px", margin: "2px" }}>
                                                <Pill label={lang.value} hasIcon={false} />
                                            </div>)
                                    }
                                </div>

                            </div>



                            <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                <label htmlFor="">Educational Level</label>
                                <input type="text" className="form-control"
                                    value={education.EducationalLevel} disabled />
                            </div>

                            <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                <label htmlFor="">Teaching Experience</label>
                                <input className="form-control" disabled type="text" value={education.EducationalLevelExperience} />
                            </div>

                            {!!education.Certificate.length && <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                <label htmlFor="">Tutor's Certificate</label>
                                <input className="form-control" disabled type="text" value={education.Certificate} />
                            </div>}

                            <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                <label htmlFor="">Country</label>

                                <input className="form-control" disabled
                                    value={tutor.Country} />
                            </div>

                            <div style={{ width: "300px" }}
                                className="d-flex flex-column justify-content-start ">
                                <label htmlFor="">GMT</label>

                                <input className="form-control" disabled
                                    value={tutor.GMT}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded  shadow-lg my-4">
                        <div className="highlight">
                            Ad's text here
                        </div>
                        <UserRichTextEditor
                            required
                            className="w-100  fs-5 mb-4 "
                            height={"200px"} value={addText}
                            onChange={(value) => setAddText(value)}
                            placeholder={'Write You\'r Add here '} />
                    </div>

                </div>

                <Actions
                    loading={loading}
                    SaveText="Publish"
                    unSavedChanges={unSavedChanges}
                />
            </form>
        </div>
    );
}

export default CreateComponent;
