import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import UserRichTextEditor from '../../../components/common/RichTextEditor/UserRichTextEditor'
import Pill from '../../../components/common/Pill'
import { RxCross2 } from 'react-icons/rx'
import { GoPlus } from 'react-icons/go'
import { FaTrashCan } from 'react-icons/fa6'
import { moment } from '../../../config/moment'
import { delete_ad, fetch_ad, fetch_tutor_ads, get_tutor_market_data, put_ad } from '../../../axios/tutor'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../components/common/Loading'
import Actions from '../../../components/common/Actions'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import { convertToDate } from '../../../components/common/Calendar/Calendar'
import { compareStates } from '../../../helperFunctions/generalHelperFunctions'

const Edit = () => {
    const { tutor } = useSelector(state => state.tutor);
    const params = useParams();
    const navigate = useNavigate();
    let [education, set_education] = useState({})
    const [subjects, set_subjects] = useState([])
    const [status, setStatus] = useState(null)
    const [subject, setSubject] = useState('');
    const [grades, setGrades] = useState([])
    const AcademyId = localStorage.getItem('tutor_user_id');
    const [error, setErrors] = useState({})
    const [header, setHeader] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [addText, setAddText] = useState(``);
    const [dbValues, setDBValues] = useState({});
    const [notEditableAfterPublish, setNotEditableAfterPublish] = useState(false);
    const [changesMade, setChangesMade] = useState(false)
    console.log(editMode, notEditableAfterPublish)

    useEffect(() => {
        if (editMode) {
            const localStates = {
                Grades: grades,
                AdText: addText,
                AdHeader: header,
                Subject: subject
            }
            setChangesMade(compareStates(dbValues, localStates))
        }
    }, [grades, subject, addText, header, editMode, dbValues])

    useEffect(() => {
        if (params.id) {
            fetch_ad(params.id)
                .then((result) => {
                    if (!result?.response?.data) {
                        setGrades(JSON.parse(result.Grades))
                        setSubject(result.Subject)
                        setHeader(result.AdHeader)
                        setAddText(result.AdText)
                        setStatus(result.Status)
                        setNotEditableAfterPublish(result.Status === 'published')
                        setDBValues({
                            Grades: JSON.parse(result.Grades),
                            Subject: result.Subject,
                            AdHeader: result.AdHeader,
                            AdText: result.AdText,
                            Status: result.Status,
                            Published_At: result.Published_At
                        })
                    }
                })
                .catch(err => console.log(err))

            get_tutor_market_data(window.localStorage.getItem('tutor_user_id'))
                .then((result) => {

                    let { Subjects, Education } = result
                    set_subjects(Subjects)
                    set_education(Education[0])
                })
                .catch(err => console.log(err))
        }
    }, [params])

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!grades.length) return toast.warning('Please select at least one school grade!')
        const ads = await fetch_tutor_ads(AcademyId)
        if (!ads?.length) {
            const adWithSameSubjExist = ads.filter(ad => ad.Subject === subject).length >= 2
            if (adWithSameSubjExist) return toast.warning('You can Publish 1 Ad per Subject every 7 days. this subjectwas already published in the past 7 days!')
        }

        const data = params.id && await put_ad(params.id, {
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
            Grades: JSON.stringify(grades),
            Status: 'published',
            Published_At: new Date()
        })

        if (data?.response?.data?.message) return toast.error(data.response.data.message)
        setEditMode(false)
        setChangesMade(false)
        navigate(`/tutor/market-place/list`)
        toast.success('Ad Published Succesfully, Please Visit Saved Ad Tab to view Published Ads');
    }

    const handleDeleteAd = async () => {
        try {
            await delete_ad(params.id)
            navigate('/tutor/market-place/list')
            toast.success('Ad Successfully deleted.')
        }
        catch (err) { }
    }

    if (!tutor.AcademyId || !education?.EducationalLevel?.length)
        return <Loading />
    return (
        <Layout>
            <div style={{ height: "78vh", overflowY: "auto" }}>
                <form onSubmit={handleUpdate}>
                    <div className="container mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            {dbValues.Status === 'published' && <b className='border p-2 m-2 text-primary blinking-button'>
                                This ad appears until {showDate(moment(convertToDate(dbValues.Published_At)).add(7, 'days').toDate())}
                            </b>
                            }
                            <div className="highlight m-0" >
                                This is the place where you can promote yourself by publishing your private ad for all students to watch. If you tutor multi subjects, you can select one subject at the time by changing the header.
                            </div>
                        </div>

                        <div className="rounded border shadow p-2">
                            <div className=" d-flex w-100 justify-content-end align-items-end mb-4"
                                style={{ gap: "10px" }}>
                                <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start align-items-center ">
                                    <label htmlFor="">Subject</label>
                                    <select disabled={true} className="form-select"
                                        required
                                        onChange={(e) => setSubject(e.target.value)}
                                        value={subject}>
                                        <option value={''} disabled>Subject</option>

                                        {subjects.map((item, index) =>
                                            <option key={index} value={item.subject}>{item.subject}</option>
                                        )}
                                    </select>
                                </div>
                                <div className=" d-flex align-items-end"
                                    style={{ gap: "10px", width: "90%" }}>
                                    <label className="fs-3 ">Ad's Header</label>
                                    <input disabled={true}
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
                                    <div className="click-effect-elem rounded-circle p-3" onClick={handleDeleteAd}
                                        style={{ cursor: "pointer", background: "lightGray" }}>
                                        <FaTrashCan size={32} />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap justify-content-start" style={{ gap: "10px" }}>

                                <div style={{ width: "100%" }}
                                    className=" mb-2 d-flex flex-column justify-content-start border p-2">
                                    <label htmlFor="">Tutor Teaching Grade(s)</label>
                                    <div className="w-100 d-flex justify-content-between">

                                        <div className="d-flex  " style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
                                            {
                                                JSON.parse(tutor.Grades ?? '[]').map(grade =>
                                                    <div style={{ width: "115px", margin: "2px" }}
                                                    >
                                                        <Pill
                                                            label={grade}
                                                            hasIcon={status === 'expired' ? false : true} icon={grades.find(item => item === grade) ? <RxCross2 /> : <GoPlus />}
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
                                    <input disabled={true} type="text" className="form-control" value={education.EducationalLevel} />
                                </div>

                                <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">Teaching Experience</label>
                                    <input disabled={true} className="form-control" type="text" value={education.EducationalLevelExperience} />
                                </div>

                                {!!education.Certificate.length && <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">Tutor's Certificate</label>
                                    <input disabled={true} className="form-control" type="text" value={education.Certificate} />
                                </div>}

                                <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">Country</label>

                                    <input disabled={true} className="form-control"
                                        value={tutor.Country} />
                                </div>

                                <div style={{ width: "300px" }}
                                    className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">GMT</label>

                                    <input disabled={true} className="form-control"
                                        value={tutor.GMT}
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded  shadow-lg my-4">
                            <div className="highlight">
                                The text below was generated generically by the computer. You can change the text to fit your personality. The ad will appear for 7 days for the selected subject. If you tutor multi subjects, you can publish a different ad for each subject.
                            </div>
                            <UserRichTextEditor
                                disabled={!editMode || notEditableAfterPublish}
                                readOnly={!editMode || notEditableAfterPublish}
                                required
                                className="w-100  fs-5 mb-4 "
                                height={"200px"} value={addText}
                                onChange={(value) => setAddText(value)}
                                placeholder={'Write You\'r Ad here '} />
                        </div>
                    </div>

                    <Actions
                        editDisabled={editMode || notEditableAfterPublish}
                        saveDisabled={!editMode && notEditableAfterPublish}
                        onEdit={() => setEditMode(true)}
                        unSavedChanges={changesMade}
                        SaveText={status === 'expired' ? 'RePublish' : 'Publish'}
                    />
                </form>
            </div >

        </Layout>
    )
}

export default Edit