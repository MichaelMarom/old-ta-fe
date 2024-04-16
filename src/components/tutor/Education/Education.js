import { useEffect, useRef, useState } from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import { get_my_edu, post_edu, post_tutor_setup } from '../../../axios/tutor';
import { upload_file } from '../../../axios/file';
import career from '../../../assets/images/Experience-photo50.jpg';

import { moment } from '../../../config/moment'

import Select from 'react-select'
import Actions from '../../common/Actions';
import { FaRegTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loading from '../../common/Loading';
import { AUST_STATES, CAN_STATES, CERTIFICATES, Countries, EXPERIENCE, LEVEL, UK_STATES, US_STATES, languages } from '../../../constants/constants'
import { compareStates } from '../../../helperFunctions/generalHelperFunctions';
import Button from '../../common/Button';
import Tooltip from '../../common/ToolTip';
import ReactDatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { setTutor } from '../../../redux/tutor_store/tutorData';
import DebounceInput from '../../common/DebounceInput';

const languageOptions = languages.map((language) => ({
    value: language,
    label: language,
}));

const Education = () => {

    const [editMode, setEditMode] = useState(false);
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    let [level, set_level] = useState('');

    let [uni_bach, set_uni_bach] = useState('');
    let [uni_mast, set_mast_uni] = useState('');
    let [doc_uni, set_doc_uni] = useState('');

    let [degree, set_degree] = useState([]);
    let [certificate, set_certificate] = useState('');
    let [language, set_language] = useState({});

    const [countryForAssociate, setCountryForAssoc] = useState('');
    const [countryForCert, setCountryForCert] = useState('');
    const [countryForMast, setCountryForMast] = useState('');
    const [countryForDoc, setCountryForDoc] = useState('');
    const [countryForDeg, setCountryForDeg] = useState('')

    let [bach_state, set_bach_state] = useState('');
    let [mast_state, set_mast_state] = useState('');
    let [deg_state, set_deg_state] = useState('');
    let [cert_state, set_cert_state] = useState('');
    let [doctorateState, set_doctorateState] = useState('')

    let [experience, set_experience] = useState('');
    let [bach_yr, set_bach_year] = useState('');
    let [mast_yr, set_mast_year] = useState('');
    let [degree_yr, set_degree_year] = useState('');
    let [doctorateGraduateYear, setDoctorateGraduateYear] = useState('')

    let [expiration, set_expiration] = useState('');
    let [othelang, set_othelang] = useState([]);
    let [workExperience, set_workExperience] = useState('');

    let [exp, set_exp] = useState('');
    let [level_list, set_level_list] = useState('')
    let [certificate_list, set_certificate_list] = useState('')
    let [d_list, set_d_list] = useState([])

    let [dbValues, setDbValues] = useState({});

    const [degreeFile, setDegreeFile] = useState(null);
    const [resumePath, set_resumePath] = useState(null);
    // const [degreeFileContent, setDegreeFileContent] = useState('')
    const [certificateFile, setCertificateFile] = useState(null);
    // const [certFileContent, setCertFileContent] = useState('')
    const [dataFetched, setDataFetched] = useState(false)
    let [db_edu_level, set_db_edu_level] = useState('');
    let [db_edu_cert, set_db_edu_cert] = useState('');
    const [fetchingEdu, setFetchingEdu] = useState(false);
    const [deg_file_name, set_deg_file_name] = useState('');
    const [cert_file_name, set_cert_file_name] = useState('');
    const [addReference, setAddReference] = useState(false)
    const [references, setReferences] = useState('')
    const [saving, setSaving] = useState(false);
    const [recordFetched, setRecordFetched] = useState(false);
    const { tutor } = useSelector(state => state.tutor);
    const dispatch = useDispatch();

    console.log(dbValues)

    //private info protection notice
    let toastId = useRef();
    useEffect(() => {
        toastId.current = !toastId.current && recordFetched && !dbValues.EducationalLevel?.length &&
            !(cert_file_name || deg_file_name) &&
            toast('Please upload the highest diploma you earned. The academy only verifies your credentials, and guard your privecy by not publishing it on the portal.', {
                closeButton: true,
                autoClose: false,
                className: "setup-private-info edu"
            })
        console.log(toastId)

        if (toastId && (cert_file_name || deg_file_name)) {
            toast.dismiss()
        }
    }, [recordFetched, dbValues, cert_file_name, deg_file_name])

    useEffect(() => {
        if (dbValues.AcademyId) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }
    }, [dbValues])

    useEffect(() => {
        if (dataFetched && db_edu_level !== level) {
            set_mast_year('')
            set_bach_year('')
            setCountryForAssoc('')
            setCountryForDeg('')
            setCountryForDoc('')
            setCountryForMast('')
            setDoctorateGraduateYear('')
            set_degree_year('')
            set_uni_bach('')
            set_mast_uni('')
            set_doc_uni('')
            set_bach_state('')
            set_mast_state('')
            set_doctorateState('')
            set_deg_state('')
            set_deg_file_name('')
        }
    }, [level, db_edu_level, dataFetched])

    useEffect(() => {
        if (dataFetched && db_edu_cert !== certificate) {
            setCountryForCert('')
            set_cert_state('')
            set_expiration('')
            set_cert_file_name('')
        }
    }, [certificate, db_edu_cert, dataFetched])

    const options = {
        "Australia": AUST_STATES,
        "USA": US_STATES,
        "Canada": CAN_STATES,
        "UnitedKingdom": UK_STATES
    }

    useEffect(() => {
        if (dataFetched && db_edu_level !== level) {
            setDegreeFile(null)
            // setDegreeFileContent(null)
        }
        if (dataFetched && db_edu_cert !== certificate) {
            setCertificateFile(null)
            // setCertFileContent(null)
        }
        if (level === 'Undergraduate Student') {
            set_bach_year('current')
        }

        // eslint-disable-next-line
    }, [level, certificate, dataFetched])

    const handleLanguageChange = (selectedOption) => {
        set_othelang(selectedOption);
    }

    useEffect(() => {
        const currentYear = (new Date()).getFullYear();
        const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 },
            (_, i) => start + (i * step));
        let d = range(currentYear, currentYear - 50, -1)
        let list = d.map(item => <option value={item} >{item}</option>)
        list.unshift(<option value='' >Select Year</option>)

        set_d_list(d)
    }, [])

    let AcademyId = window.localStorage.getItem('tutor_user_id');
    const jsonFields = ['NativeLang', 'NativeLangOtherLang']
    const dynamicSave = async (key, value) => {
        if (jsonFields.includes(key)) value = JSON.stringify(value)
        if (key && value && tutor.AcademyId) {
            await post_edu({
                AcademyId: tutor.AcademyId,
                [key]: value
            })
        }
    }

    const markSecondEduStepCompleted = () => {
        const fieldsForThirdStep = {
            level: { validate: true, value: level }, experience: { validate: true, value: experience },
            uni_bach: { value: uni_bach, validate: level !== 'No Academic Education' },
            bach_yr: { value: bach_yr, validate: (level !== 'No Academic Education' && level !== 'Undergraduate Student') },
            bach_state: { value: bach_state, validate: (level !== 'No Academic Education' && options[countryForAssociate]) },
            countryForAssociate: { value: countryForAssociate, validate: level !== 'No Academic Education' },
            countryForMast: {
                value: countryForMast, validate: (level !== 'No Academic Education' && level !== 'Undergraduate Student'
                    && level !== 'Associate Degree' && level !== 'Bachlor Degree')
            },
            uni_mast: {
                value: uni_mast, validate: (level !== 'No Academic Education' && level !== 'Undergraduate Student'
                    && level !== 'Associate Degree' && level !== 'Bachlor Degree')
            },
            mast_yr: {
                value: mast_yr, validate: (level !== 'No Academic Education' && level !== 'Undergraduate Student'
                    && level !== 'Associate Degree' && level !== 'Bachlor Degree')
            },
            mast_state: {
                value: mast_state, validate: ((level !== 'No Academic Education' && level !== 'Undergraduate Student'
                    && level !== 'Associate Degree' && level !== 'Bachlor Degree') && options[countryForAssociate])
            },
            countryForDoc: { value: countryForDoc, validate: (level === 'Doctorate Degree' || level === 'Post Doctorate Degree' || level === 'Professor') },
            doc_uni: { value: doc_uni, validate: (level === 'Doctorate Degree' || level === 'Post Doctorate Degree' || level === 'Professor') },
            doctorateGraduateYear: { value: doctorateGraduateYear, validate: (level === 'Doctorate Degree' || level === 'Post Doctorate Degree' || level === 'Professor') },
            doctorateState: { value: doctorateState, validate: ((level === 'Doctorate Degree' || level === 'Post Doctorate Degree' || level === 'Professor') && options[countryForAssociate]) },
            certificate: { validate: false },
            expiration: { value: expiration, validate: (certificate && certificate !== 'Not Certified') },
            cert_state: { value: cert_state, validate: ((certificate && certificate !== 'Not Certified') && options[countryForAssociate]) },
            countryForCert: { value: countryForCert, validate: (certificate && certificate !== 'Not Certified') },
            NativeLang: { validate: true, value: language }, NativeLangOtherLang: { validate: false },
            workExperience: { validate: true, value: workExperience },
            references: { validate: false }
        }
        let flag = { value: null, valid: 1 }

        Object.keys(fieldsForThirdStep).map(fields => {
            if (fieldsForThirdStep[fields].validate) {
                const validated = jsonFields.includes(fields) ?
                    !!Object.keys(fieldsForThirdStep[fields].value)?.length :
                    !!fieldsForThirdStep[fields].value?.length;

                if (!validated) {
                    flag.valid = 0;
                    flag.value = fields
                }
            }
            return flag;
        })
        return flag
    }

    let saver = async () => {
        let Step = 3;
        await post_tutor_setup({
            Step, fname: tutor.FirstName,
            lname: tutor.LastName, mname: tutor.MiddleName, userId: tutor.userId
        })
        dispatch(setTutor())
        // let response = await upload_edu_form(level,
        //     uni_bach,
        //     uni_mast,
        //     doc_uni,
        //     degree,
        //     degreeFileContent,
        //     certificate,
        //     certFileContent,
        //     JSON.stringify(language),
        //     bach_state,
        //     mast_state,
        //     deg_state,
        //     cert_state,
        //     [],
        //     doctorateState,
        //     experience,
        //     bach_yr,
        //     mast_yr,
        //     degree_yr,
        //     doctorateGraduateYear,
        //     expiration,
        //     JSON.stringify(othelang),
        //     workExperience,
        //     AcademyId,
        //     countryForDeg,
        //     countryForMast,
        //     countryForCert,
        //     countryForDoc,
        //     countryForAssociate,
        //     resumePath,
        //     cert_file_name,
        //     deg_file_name,
        //     references
        // )
    }

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps 
    let fieldValues = {
        EducationalLevel: level,
        Bach_College: uni_bach,
        Mast_College: uni_mast,
        DoctorateCollege: doc_uni,
        Certificate: certificate,
        BachCountry: countryForAssociate,
        CertCountry: countryForCert,
        MastCountry: countryForMast,
        DocCountry: countryForDoc,
        DegCountry: countryForDeg,
        Bach_College_State: bach_state,
        Mast_College_State: mast_state,
        DegreeState: deg_state,
        CertificateState: cert_state,
        DoctorateState: doctorateState,
        EducationalLevelExperience: experience,
        Bach_College_Year: bach_yr,
        Mast_College_StateYear: mast_yr,
        DegreeYear: degree_yr,
        DoctorateGradYr: doctorateGraduateYear,
        CertificateExpiration: expiration,
        WorkExperience: workExperience,
        Resume: resumePath,
        ThingsReferences: references,
        CertFileName: cert_file_name,
        DegFileName: deg_file_name,
        NativeLang: language,
        NativeLangOtherLang: othelang
    }
    // comparing DB, Local
    useEffect(() => {
        setUnsavedChanges(compareStates(dbValues, fieldValues))
    }, [dbValues, fieldValues])

    //fetching DB

    useEffect(() => {
        !editMode && setFetchingEdu(true)

        get_my_edu(window.localStorage.getItem('tutor_user_id'))
            .then((result) => {
                if (result?.length) {
                    let data = result[0];
                    let NativeLang = JSON.parse(data.NativeLang ?? '{}');
                    let NativeLangOtherLang = JSON.parse(data.NativeLangOtherLang ?? '[]')
                    setDbValues({ ...data, NativeLang, NativeLangOtherLang });

                    set_workExperience(data.WorkExperience)
                    set_uni_bach(data.Bach_College)
                    set_mast_uni(data.Mast_College)
                    set_doc_uni(data.DoctorateCollege)

                    set_language(JSON.parse(data.NativeLang ?? '{}'))
                    set_othelang(JSON.parse(data.NativeLangOtherLang ?? '[]'))

                    set_bach_year(data.Bach_College_Year)
                    set_mast_year(data.Mast_College_StateYear)
                    set_degree_year(data.DegreeYear)

                    setCountryForAssoc(data.BachCountry)
                    setCountryForCert(data.CertCountry)
                    setCountryForDeg(data.DegCountry)
                    setCountryForDoc(data.DocCountry)
                    setCountryForMast(data.MastCountry)
                    set_bach_state(data.College1State)
                    set_mast_state(data.College2State)
                    set_deg_state(data.DegreeState)
                    set_cert_state(data.CertificateState)
                    set_doctorateState(data.DoctorateState)

                    setDoctorateGraduateYear(data.DoctorateGradYr)
                    setReferences(data.ThingsReferences)
                    // setAddReference(data.ThingsReferences?.length)

                    set_doctorateState(data.DoctorateState)

                    set_degree(data.Degree)
                    set_certificate(data.Certificate)
                    set_db_edu_cert(data.Certificate)

                    // setDegreeFileContent(data.DegreeFile)
                    // setCertFileContent(data.CertificateFile)

                    set_level(data.EducationalLevel)
                    set_db_edu_level(data.EducationalLevel)

                    set_expiration(data.CertificateExpiration)
                    set_experience(data.EducationalLevelExperience)

                    set_resumePath(data.Resume);
                    set_deg_file_name(data.DegFileName)
                    set_cert_file_name(data.CertFileName)

                    setDataFetched(true)
                } else {
                    setDbValues({
                        EducationalLevel: level,
                        College1: uni_bach,
                        College2: uni_mast,
                        DoctorateCollege: doc_uni,
                        Certificate: certificate,
                        BachCountry: countryForAssociate,
                        CertCountry: countryForCert,
                        MastCountry: countryForMast,
                        DocCountry: countryForDoc,
                        DegCountry: countryForDeg,
                        College1State: bach_state,
                        College2State: mast_state,
                        DegreeState: deg_state,
                        CertificateState: cert_state,
                        DoctorateState: doctorateState,
                        EducationalLevelExperience: experience,
                        College1Year: bach_yr,
                        College2StateYear: mast_yr,
                        DegreeYear: degree_yr,
                        DoctorateGradYr: doctorateGraduateYear,
                        CertificateExpiration: expiration,
                        WorkExperience: workExperience,
                        ThingsReferences: references,
                        NativeLangOtherLang: othelang,
                        NativeLang: language
                    })
                }

            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setFetchingEdu(false)
                setRecordFetched(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])

    useEffect(() => {
        let experiences = EXPERIENCE.map((item) =>
            <option key={item} className={item} value={item}>{item}</option>
        );
        let head = <option value='' disabled>Select</option>

        experiences.unshift(head);
        set_exp(experiences)

        // get_state()
        //     .then(({ recordset }) => {
        //         recordset.map(item => item.State);
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })

        // get_degree()
        //     .then((data) => {
        //         let list = data.recordset.map((item) =>
        //             <option key={item.Degree}
        //                 className={item.Degree} style={{
        //                     height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px',
        //                     borderRadius: '0'
        //                 }} value={item.Degree}>{item.Degree}</option>
        //         );
        //         let head = <option key='null' style={{
        //             height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px',
        //             borderRadius: '0'
        //         }} value=''>Degree</option>

        //         // list.unshift(head);

        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })

        let eduLevels = LEVEL.map((item) =>
            <option key={item} className={item} value={item}>{item}</option>
        );
        set_level_list(eduLevels)

        let certificatesOptions = CERTIFICATES.map((item) =>
            <option key={item} className={item} value={item}>{item}</option>
        );
        set_certificate_list(certificatesOptions)


    }, [certificate, degree, experience, level])

    const handleDegFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setDegreeFileContent(base64);
            };
            reader.readAsDataURL(file);
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileName = `${AcademyId}-degree-${level}.${fileExtension}`;
            set_deg_file_name(fileName)
            setDegreeFile(file);
        }
    }

    useEffect(() => {
        if (degreeFile && level && deg_file_name) {
            handleUploadDegreeToServer()
            dynamicSave('DegFileName', deg_file_name)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [degreeFile, level, deg_file_name])

    useEffect(() => {
        if (certificateFile && certificate && cert_file_name) {
            handleUploadCertificateToServer()
            dynamicSave('CertFileName', cert_file_name)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [certificate, cert_file_name, certificateFile])

    // const handleResumeFileUpload = (event) => {
    //     const file = event.target.files[0];

    //     if (file) {
    //         setResumeFile(file);
    //         set_resumePath(`${AcademyId}-resume-${(new Date()).getTime()}-${file.name}`);
    //     }
    // }

    const handleUploadDegreeToServer = async () => {
        if (degreeFile) {
            const formData = new FormData();
            formData.append('file', degreeFile);
            try {
                await upload_file(formData, deg_file_name)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    // const handleUploadResumeToServer = async () => {
    //     if (resumeFile) {
    //         const previousFilePath = await getPreviousFilePathFromDB(AcademyId);
    //         if (previousFilePath) {
    //             await deleteFileOnServer(AcademyId);
    //         }
    //         const formData = new FormData();
    //         formData.append('file', resumeFile);

    //         try {
    //             const fileName = resumePath
    //             const response = await upload_file(formData, fileName)

    //             console.log(response.data);
    //         } catch (error) {
    //             console.error('Error uploading file:', error);
    //         }
    //     } else {
    //         console.log('Please select a file before uploading.');
    //     }
    // };

    const handleUploadCertificateToServer = async () => {
        if (certificateFile) {
            const formData = new FormData();
            formData.append('file', certificateFile);
            try {
                await upload_file(formData, cert_file_name)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleCertUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setCertFileContent(base64);
            };
            reader.readAsDataURL(file);
            setCertificateFile(file);
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileName = `${AcademyId}-certificate-${certificate}.${fileExtension}`;
            set_cert_file_name(fileName)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        if (!workExperience || workExperience.length === 11 || !workExperience.length) return toast.warning('Work Experiece is Required!')

        if (!markSecondEduStepCompleted().valid)
            return toast.warning(`Please fill required fields ${markSecondEduStepCompleted().value}`)


        if (!cert_file_name || !deg_file_name)
            toast.warning('You selected academic education, but did not upload your diploma. Hence,your Profile will stay in "Pending" status and cannot be activated until you upload your diploma!')

        setSaving(true)
        tutor.Status === 'pending' && await saver();
        setSaving(false)
        setEditMode(false)
    }

    if (fetchingEdu)
        return <Loading loadingText='Fetching Tutor Eduction...' />
    return (
        <div style={{ height: "70vh", overflowY: "auto" }}>
            <div className="container tutor-tab-education">
                <form action="" onSubmit={handleSave}>
                    <div className="tutor-tab-education-info pt-4">
                        <h3>Education</h3>
                        <h6 className="tutor-tab-education-notice highlight">
                            Tutor does not have to be an academy graduate in order to lecture his knowledge. However, when you select your academic background, you must upload your diploma and/or Certificate(s). You have 7 days to do that. Until your credentials are uploaded, "X" icon is being shown near the appropriate field. When your documents are uploaded, the "X" icon is changed to a green "Verified" logo. The student or parents can see your status when making their decision of selecting you.
                        </h6>

                        <div className="d-flex  row border p-3 shadow ">
                            <h6 className='border-bottom'>Experience</h6>
                            <div className='d-flex justify-content-between'>

                                <div className="col-md-4">
                                    <div className='d-flex justify-content-between'>
                                        <label className="text-secondary text-start" htmlFor="level">Education Level:</label>
                                        <Tooltip width="250px" text=" Please select the highest education level that you have earned diploma from (could be high school). If you selected academic education level, but cannot provide a proof in a form of diploma, we would have to decline your application." />
                                    </div>
                                    <select
                                        id="level"
                                        className="form-select m-0"
                                        onChange={(e) => {
                                            set_level(e.target.value)
                                            dynamicSave('EducationalLevel', e.target.value)
                                        }}
                                        value={level}
                                        required
                                        disabled={!editMode}
                                    >
                                        <option value="" disabled>Select highest Education</option>
                                        {level_list}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="text-secondary" htmlFor="experience">Experience:</label>
                                    <select
                                        id="experience"
                                        className="form-select m-0"
                                        onChange={(e) => {
                                            set_experience(e.target.value)
                                            dynamicSave('EducationalLevelExperience', e.target.value)
                                        }}
                                        value={experience}
                                        required
                                        disabled={!editMode}
                                    >
                                        {exp}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {level && level !== 'No Academic Education' && level.length ? (
                            <>
                                <div className="row mt-3 p-3 shadow  border shadow">
                                    {
                                        <h6 className='border-bottom'>
                                            {(level === 'Associate Degree' ||
                                                level === 'Undergraduate Student') ?
                                                'College' : 'Bachelor Degree'}
                                        </h6>
                                    }
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="uni_bach">{(level === 'Associate Degree' ||
                                                level === 'Undergraduate Student') ?
                                                'College Name' : 'Bachelor Degree Institute:'}</label>
                                            {/* <input
                                                type="text"
                                                id="uni_bach"
                                                className="form-control m-0"
                                                value={uni_bach}
                                                onChange={(e) => set_uni_bach(e.target.value)}
                                                placeholder="College/University 1"
                                                required
                                                disabled={!editMode}
                                            /> */}
                                            <DebounceInput
                                                placeholder="College/University 1"
                                                required
                                                disabled={!editMode}
                                                className="form-control m-0"
                                                delay={2000}
                                                value={uni_bach}
                                                setInputValue={set_uni_bach}
                                                debouceCallback={() => dynamicSave('Bach_College', uni_bach)}
                                                onChange={(e) => set_uni_bach(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country for {`${level === 'Associate Degree' ?
                                                    "Associate degree" : "Bachelor"}`}</label>
                                                <select className='form-select'
                                                    onChange={(e) => {
                                                        setCountryForAssoc(e.target.value)
                                                        dynamicSave('BachCountry', e.target.value)
                                                    }}
                                                    value={countryForAssociate}
                                                    disabled={!editMode}
                                                >
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForAssociate] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => {
                                                            set_bach_state(e.target.value)
                                                            dynamicSave('Bach_College_State', e.target.value)
                                                        }}


                                                        value={bach_state}
                                                        required
                                                        disabled={!editMode}
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForAssociate].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }

                                        </div>

                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="yr1">Graduation Year:</label>
                                            {level === 'Undergraduate Student' ? <div>{bach_yr}</div> :
                                                <select
                                                    id="yr1"
                                                    className="form-select m-0 w-100"
                                                    onChange={(e) => {
                                                        set_bach_year(e.target.value)
                                                        dynamicSave('Bach_College_Year', e.target.value)
                                                    }}
                                                    value={bach_yr}
                                                    required
                                                    disabled={!editMode}
                                                >
                                                    <option value="">Select Year</option>
                                                    {d_list.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>}
                                        </div>
                                    </div>

                                </div>
                                {
                                    level !== 'Bachelor Degree' && level !== 'Undergraduate Student' && level !== 'Associate Degree' ? (
                                        <div className="row mt-3 border p-3 shadow ">
                                            <h6 className='border-bottom'>Master Degree</h6>
                                            <div className='d-flex justify-content-between'>
                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="uni_mast">Master Degree University:</label>
                                                    {/* <input
                                                        type="text"
                                                        id="uni_mast"
                                                        className="form-control m-0"
                                                        value={uni_mast}
                                                        onChange={(e) => set_mast_uni(e.target.value)}
                                                        placeholder="College/University 2"
                                                        required
                                                        disabled={!editMode}
                                                    /> */}
                                                    <DebounceInput
                                                        placeholder="College/University 2"
                                                        required
                                                        disabled={!editMode}
                                                        className="form-control m-0"
                                                        delay={2000}
                                                        value={uni_mast}
                                                        setInputValue={set_mast_uni}
                                                        debouceCallback={() => dynamicSave('Mast_College', uni_mast)}
                                                        onChange={(e) => set_mast_uni(e.target.value)}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country for Master.</label>
                                                        <select className='form-select'
                                                            onChange={(e) => {
                                                                setCountryForMast(e.target.value)
                                                                dynamicSave('MastCountry', e.target.value)
                                                            }}
                                                            disabled={!editMode}
                                                            value={countryForMast}
                                                        >
                                                            <option value={''} disabled>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForMast] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                className="form-select m-0 w-100"
                                                                onChange={(e) => {
                                                                    set_mast_state(e.target.value)
                                                                    dynamicSave('Mast_College_State', e.target.value)
                                                                }}
                                                                value={mast_state}
                                                                required
                                                                disabled={!editMode}
                                                            >
                                                                <option value="">Select State</option>
                                                                {options[countryForMast].map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
                                                    <select
                                                        id="yr2"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => {
                                                            set_mast_year(e.target.value)
                                                            dynamicSave('Mast_College_StateYear', e.target.value)
                                                        }}
                                                        value={mast_yr}
                                                        required
                                                        disabled={!editMode}
                                                    >
                                                        <option value="">Select Year</option>
                                                        {d_list.map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div></div>

                                        </div>
                                    ) : null
                                }
                                {
                                    level !== 'Undergraduate Student' && level !== 'Bachelor Degree' &&
                                        level !== 'Master Degree' && level !== 'Associate Degree' ? (
                                        <div className="row mt-3 border p-3 shadow ">
                                            <h6 className='border-bottom'>Doctorate Degree</h6>
                                            <div className='d-flex justify-content-between'>
                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="uni_mast"> Doctorate Degree university </label>
                                                    {/* <input
                                                        type="text"
                                                        className="form-control m-0"
                                                        value={doc_uni}
                                                        onChange={(e) => set_doc_uni(e.target.value)}
                                                        placeholder="College/University 3"
                                                        required
                                                        disabled={!editMode}
                                                    /> */}
                                                    <DebounceInput
                                                        type="text"
                                                        className="form-control m-0"
                                                        value={doc_uni}
                                                        setInputValue={set_doc_uni}
                                                        placeholder="College/University 3"
                                                        required
                                                        disabled={!editMode}
                                                        debouceCallback={() => dynamicSave('DoctorateCollege', doc_uni)}
                                                    />

                                                </div>

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country For Doctorate</label>
                                                        <select className='form-select'
                                                            onChange={(e) => {
                                                                setCountryForDoc(e.target.value)
                                                                dynamicSave('DocCountry', e.target.value)
                                                            }}
                                                            disabled={!editMode}
                                                            value={countryForDoc}
                                                        >
                                                            <option value={''} disabled>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForDoc] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                id="state1"
                                                                className="form-select m-0 w-100"
                                                                onChange={(e) => {
                                                                    set_doctorateState(e.target.value)
                                                                    dynamicSave('DoctorateState', e.target.value)
                                                                }}
                                                                value={doctorateState}
                                                                required
                                                                disabled={!editMode}
                                                            >
                                                                <option value="">Select State</option>
                                                                {options[countryForDoc].map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
                                                    <select
                                                        id="yr2"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => {
                                                            setDoctorateGraduateYear(e.target.value)
                                                            dynamicSave('DoctorateGradYr', e.target.value)
                                                        }}

                                                        value={doctorateGraduateYear}
                                                        required
                                                        disabled={!editMode}
                                                    >
                                                        <option value="">Select Year</option>
                                                        {d_list.map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div></div>

                                        </div>
                                    ) : null
                                }

                                <div className="row mt-3 border p-3 shadow ">
                                    <h6 className='border-bottom'>Degree Document</h6>
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-md-4">
                                            <div className='d-flex'>
                                                <label className="text-secondary text-start" htmlFor="degree">Upload Highest Degree Diploma:</label>
                                                <Tooltip width="200px" text="We use your document only to verify your status. we do not publish it to the public.
                                                               Upon verification, we mark your profile by the academic verification symbol" />
                                            </div>
                                            <div className='d-flex align-items-center'>

                                                {(deg_file_name && deg_file_name.length) ? (
                                                    <div className='d-flex w-100 justify-content-between border rounded p-2'>
                                                        <div>Degree uploaded</div>
                                                        <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                                    </div>
                                                ) : (
                                                    <>  <div className="form-outline">
                                                        <input
                                                            type="file"
                                                            accept=".pdf, .jpeg, .png, .jpg"
                                                            id="degreeFile"
                                                            name="degreeFile"
                                                            disabled={!editMode}
                                                            className="form-control m-0"
                                                            onChange={handleDegFileUpload}
                                                        />
                                                    </div>
                                                        <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>

                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country For Degree</label>
                                                <select className='form-select'
                                                    disabled={!editMode}
                                                    value={countryForDeg}
                                                    required
                                                    onChange={(e) => {
                                                        setCountryForDeg(e.target.value)
                                                        dynamicSave('DegCountry', e.target.value)
                                                    }}>
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForDeg] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => {
                                                            set_deg_state(e.target.value)
                                                            dynamicSave('DegreeState', e.target.value)
                                                        }}
                                                        value={deg_state}
                                                        required
                                                        disabled={!editMode}
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForDeg].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                        </div>

                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="yr3">Diploma earned Year:</label>
                                            <select
                                                id="yr3"
                                                className="form-select m-0 w-100"
                                                onChange={(e) => {
                                                    set_degree_year(e.target.value)
                                                    dynamicSave('DegreeYear', e.target.value)
                                                }}
                                                value={degree_yr}
                                                required
                                                disabled={!editMode}
                                            >
                                                <option value="" disabled>Select Year</option>
                                                {d_list.map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </>
                        ) : null}

                        <div className="row mt-3 align-items-start border p-3 shadow ">
                            <h6 className='border-bottom'>Certification</h6>
                            <div className='d-flex justify-content-between'>
                                <div className="col-md-4">
                                    <div className='d-flex justify-content-between'>
                                        <label className="text-secondary text-start" htmlFor="degree">Certification</label>
                                        <Tooltip width="200px" text="We use your document only to verify your certification. We do not publish it to the public.
                                                               Upon verification, we mark your profile by the Diploma verification symbol" />
                                    </div>
                                    <select
                                        id="certificate"
                                        name="certificate"
                                        className="form-select m-0"
                                        onChange={(e) => {
                                            set_certificate(e.target.value)
                                            dynamicSave('Certificate', e.target.value)
                                        }}
                                        placeholder='Select Certificate'
                                        value={certificate}
                                        // required
                                        disabled={!editMode}
                                    >
                                        <option value="" disabled>Select Certificate</option>
                                        {certificate_list}
                                    </select>
                                    {(certificate && certificate.length && certificate !== 'Not Certified') ? (
                                        <div className='d-flex justify-content-center align-items-center'>

                                            {(cert_file_name?.length) ? (
                                                <div className='d-flex w-100 justify-content-between border rounded p-2'>
                                                    <div>Certificate Uploaded</div>
                                                    <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                                </div>) : (
                                                <>
                                                    <div className="form-outline">
                                                        <input
                                                            type="file"
                                                            accept=".pdf, .jpeg, .png, .jpg, .doc"
                                                            id="certificateFile"
                                                            name="certificateFile"
                                                            className="form-control m-0 mr-2"
                                                            onChange={handleCertUpload}
                                                            disabled={!editMode}

                                                        />
                                                    </div>
                                                    <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>
                                                </>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                                {(certificate && certificate.length && certificate !== 'Not Certified') ? (
                                    <>
                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country For Certification</label>
                                                <select className='form-select'
                                                    disabled={!editMode}
                                                    onChange={(e) => {
                                                        setCountryForCert(e.target.value)
                                                        dynamicSave('CertCountry', e.target.value)
                                                    }}
                                                    value={countryForCert}
                                                    required
                                                >
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForCert] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => {
                                                            set_cert_state(e.target.value)
                                                            dynamicSave('CertificateState', e.target.value)
                                                        }}
                                                        value={cert_state}
                                                        required
                                                        disabled={!editMode}
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForCert].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }

                                        </div>
                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="expiration">Certificate Expiration:</label>
                                            <ReactDatePicker
                                                selected={moment.tz(expiration ? expiration : new Date(), tutor.timeZone).toDate()}
                                                onChange={date => {
                                                    date.setHours(23);
                                                    date.setMinutes(59)
                                                    date.setSeconds(59)
                                                    const originalMoment = moment(date)
                                                    set_expiration(originalMoment)
                                                    dynamicSave('CertificateExpiration', originalMoment)
                                                }}
                                                minDate={new Date()}
                                                dateFormat="MMM d, yyyy"
                                                className="form-control m-2"
                                                readOnly={!editMode}
                                                placeholder="Expiration Date"
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="row mt-3 justify-content-between border p-3 shadow ">
                            <h6 className='border-bottom'>Languages</h6>
                            <div className='d-flex justify-content-between'>
                                <div className="col-md-5">
                                    <label className="text-secondary" htmlFor="language">Select Native (Primary) Language:</label>
                                    <Select
                                        isMulti={false}
                                        placeholder="Select Native Languages"
                                        className="language-selector w-100"
                                        id="native-language"
                                        onChange={(selectedOption) => {
                                            set_language(selectedOption)
                                            dynamicSave('NativeLang', selectedOption)
                                        }}
                                        defaultValue={language}
                                        value={language}
                                        options={languageOptions}
                                        required
                                        isDisabled={!editMode}
                                    />
                                </div>

                                <div className="col-md-5">
                                    <label className="text-secondary" htmlFor="other-languages">Select Secondary language(s):</label>
                                    <Select
                                        isMulti
                                        placeholder="Select other language(s)"
                                        className="language-selector w-100"
                                        id="other-languages"
                                        value={othelang}
                                        onChange={(selectedOption) => {
                                            handleLanguageChange(selectedOption)
                                            dynamicSave('NativeLangOtherLang', selectedOption)
                                        }}
                                        options={languageOptions}
                                        isDisabled={!editMode} />
                                </div>
                            </div>

                        </div>

                        <div style={{ height: "100px" }}></div>
                    </div>
                    <div className="tutor-tab-education-experience"
                        style={{ marginTop: "75px" }}>
                        <div className="education-work-experience-logo">
                            <img
                                src={career}
                                style={{ height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '5px 10px 5px 10px' }}
                                alt=""
                            />

                        </div>
                        <div>
                            <Button className='action-btn btn' style={{ width: "40%" }}
                                disabled={!editMode}
                                handleClick={() => setAddReference(true)}>
                                <div className="button__content">
                                    <p className="button__text">Add Resources</p>
                                </div>
                            </Button>
                        </div>
                        {
                            (!!dbValues.ThingsReferences?.length || addReference) &&
                            <div className="form-outline my-3" style={{ width: "450px" }}>
                                <DebounceInput
                                    delay={2000}
                                    className="references"
                                    value={references}
                                    setInputValue={setReferences}
                                    readOnly={!editMode}
                                    debouceCallback={() => dynamicSave('ThingsReferences', references)}
                                    placeholder={`Tutoring academy recommends using a digital pen made by Wacom for the collaboration tab whiteboard. Basic models are CTL-4100 & 6100. Check their official website www.wacom.com
                               Cost: $50 or less
                               `}
                                    element='rich-editor'
                                    height='400px'
                                />
                                {/* <RichTextEditor
                                    className="references"
                                    value={references}
                                    onChange={(value) => setReferences(value)}
                                    readOnly={!editMode}
                                    placeholder={`Tutoring academy recommends using a digital pen made by Wacom for the collaboration tab whiteboard. Basic models are CTL-4100 & 6100. Check their official website www.wacom.com
                                    Cost: $50 or less
                                    `}
                                    height='400px'
                                /> */}
                            </div>
                        }
                        <div style={{ width: "450px" }}>


                            <DebounceInput
                                delay={2000}
                                className="work-exp"
                                value={workExperience}
                                setInputValue={set_workExperience}
                                readOnly={!editMode}
                                placeholder="Enter Your Work Experience"
                                height='800px'
                                required
                                debouceCallback={() => dynamicSave('WorkExperience', workExperience)}
                                element='user-rich-editor'
                            />


                            {/* <UserRichTextEditor
                                className="work-exp"
                                value={workExperience}
                                onChange={handleEditorChange}
                                readOnly={!editMode}
                                placeholder="Enter Your Work Experience"
                                height='800px'
                                required

                            />
 */}
                        </div>
                    </div>

                    <Actions
                        editDisabled={editMode}
                        saveDisabled={!editMode}
                        onEdit={handleEditClick}
                        unSavedChanges={unSavedChanges}
                        loading={saving}
                    />
                </form>
            </div>
        </div>
    );
}

export default Education;