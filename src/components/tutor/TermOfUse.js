import { useEffect, useState } from "react";
import RichTextEditor from "../common/RichTextEditor/RichTextEditor";
import Actions from "../common/Actions";
import { get_adminConstants, post_termsOfUse } from "../../axios/admin";
import { get_bank_details, get_my_edu, get_tutor_rates, post_tutor_setup, setAgreementDateToNullForAll } from "../../axios/tutor";
import Loading from "../common/Loading";
import { setTutor } from "../../redux/tutor/tutorData";
import { useDispatch, useSelector } from "react-redux";
import { showDate } from "../../utils/moment";
import { convertToDate } from "../common/Calendar/Calendar";
import { PROFILE_STATUS, applicationMandatoryFields } from "../../constants/constants";
import { toast } from "react-toastify";
import { apiClient } from "../../axios/config";

const TermOfUse = () => {
    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const [terms, set_terms] = useState('');
    const [db_terms, set_db_terms] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true)
    const [agreed, setAgreed] = useState(false)
    const { tutor } = useSelector(state => state.tutor)
    const [video, setVideo] = useState(null)
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserRole = user.role;
                const result = await get_adminConstants();
                if (result?.data?.[0]?.TermContent) {
                    set_terms(result.data[0].TermContent);
                    set_db_terms(result.data[0].TermContent);
                }
                setUserRole(storedUserRole);
            } catch (error) {
                toast.error(error.message);
            }
            setFetching(false)
        }
        fetchData();
    }, [user]);

    useEffect(() => {
        if (tutor.AgreementDate)
            setAgreed(true)
    }, [tutor])

    useEffect(() => {
        if ((terms !== undefined && db_terms !== undefined && terms !== db_terms && editMode) ||
            (!tutor.AgreementDate && agreed)) {
            setUnSavedChanges(true);
        } else {
            setUnSavedChanges(false);
        }
    }, [terms, db_terms, agreed, tutor, editMode])

    const handleEditorChange = (value) => {
        set_terms(value);
    };

    const handleSaveTerms = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await post_termsOfUse({ TermContent: terms });
        await setAgreementDateToNullForAll()
        response?.data?.TermContent && set_db_terms(response.data.TermContent);
        setEditMode(false);
        setLoading(false)
    };

    const handleSaveAgreement = async (e) => {
        e.preventDefault()
        const res = await get_my_edu(tutor.AcademyId);
        const bank = await get_bank_details(tutor.AcademyId);
        const rate = await get_tutor_rates(tutor.AcademyId);
        // console.log(bank, rate);
        applicationMandatoryFields.Accounting.map(item => {
            console.log(bank?.[0]?.[item.column], item.column)
            if (!bank?.[0]?.[item.column] || bank?.[0]?.[item.column] === "null") return toast.warning(`Please fill ${item.column} Field in Accounting atb`)
        })

        // if ((!res?.[0]?.DegFileName || !res?.[0]?.DegFileName?.length)
        //     && (res?.[0]?.EducationalLevel !== "Undergraduate Student" ||
        //         (res?.[0]?.EducationalLevel !== "No Academic Record")))
        //     return toast.warning('Please upload your degree in Education Tab')

        // if (!tutor?.Photo?.length)
        //     return toast.error('Please upload your Photo in Setup Tab')

        // if (videoError) return toast.error('Please upload your Video in Setup Tab')


        // setLoading(true)
        // let body = {
        //     userId: tutor.userId, AgreementDate: new Date(),
        //     fname: tutor.FirstName, lname: tutor.LastName, mname: tutor.MiddleName
        // }
        // if (tutor.Step === 5 && tutor.Status === PROFILE_STATUS.PENDING)
        //     body.Status = PROFILE_STATUS.UNDER_REVIEW
        // await post_tutor_setup(body)
        // setLoading(false)

        // dispatch(setTutor());
    }

    useEffect(() => {
        tutor.AcademyId &&
            apiClient
                .get("/tutor/setup/intro", {
                    params: { user_id: tutor.AcademyId.replace(/[.\s]/g, "") },
                })
                .then((res) => {
                    res?.data?.url && setVideo(res.data.url);
                })
                .catch((err) => console.log(err));
    }, [tutor]);

    if (fetching)
        return <Loading />
    return (
        <div className="form-term-of-use h-100">
            <video
                src={video}
                onError={() => setVideoError(true)}
                className="w-100 h-100 m-0 p-0 videoLive d-none"
                controls
                autoPlay={false}
            />
            <form onSubmit={userRole === 'admin' ? handleSaveTerms : handleSaveAgreement}>
                <div className="d-block p-5">
                    <h4 style={{ fontSize: "16px" }}>CHECKING THE BOX BELOW, CONSITUTES YOUR ACCPETANCE OF THESE TERMS OF USE</h4>

                    <div className="form-check " >
                        <input className="form-check-input"
                            style={{ width: "30px", height: "30px", marginRight: '10px', border: "4px solid black" }} type="checkbox" checked={agreed} onChange={() => setAgreed(true)}
                            disabled={tutor.AgreementDate || userRole !== 'tutor' || !editMode}
                            required={userRole === 'tutor'}
                        />
                        <label className="form-check-label fs-6">
                            By checking the box you agree with the terms of the tutoring academy service.
                        </label>
                    </div>{
                        tutor.AgreementDate &&
                        <div className="text-success">
                            Agreed on - {showDate(convertToDate(tutor.AgreementDate))}
                        </div>
                    }
                </div>
                <div className='px-4 tutor-tos'>
                    <RichTextEditor
                        value={terms}
                        onChange={handleEditorChange}
                        readOnly={!editMode || userRole !== 'admin' || !editMode}
                        placeholder="Enter Term Of  Service"
                        height="calc(100vh - 190px)"
                        className='mb-5'
                    />
                </div>

                <Actions
                    loading={loading}
                    saveDisabled={!editMode || (tutor.AgreementDate && userRole === 'tutor')}
                    editDisabled={editMode}
                    onEdit={() => setEditMode(true)}
                    unSavedChanges={unSavedChanges}
                    nextDisabled={!tutor.AgreementDate}
                />
            </form>

        </div>
    );
}

export default TermOfUse;