import { useState } from 'react';
import { useEffect } from 'react';
import {
    get_faculty,
    get_rates, new_subj_request_exist,
    upload_new_subject
} from '../../../axios/tutor';
import CenteredModal from '../../common/Modal';
import Button from '../../common/Button';
import { toast } from 'react-toastify';
import SubjectCard from './SubjectCard';
import Actions from '../../common/Actions'
import Loading from '../../common/Loading';
import { FaPlus, FaSearch } from 'react-icons/fa';
import DebounceInput from '../../common/DebounceInput';
import Pill from '../../common/Pill';
import SubMenu from '../../common/SubMenu';


const Subjects = () => {

    let [newSubjectFaculty, setNewSubjectFaculty] = useState([]);

    let [newSubjectFacultyData, setNewSubjectFacultyData] = useState('');
    let [newSubjectData, setNewSubjectData] = useState('');
    let [newSubjectReasonData, setNewSubjectReasonData] = useState('');
    const [showAddNewSubjModal, setShowAddNewSubjModal] = useState(false)
    const [newSubjRequestChecking, setNewSubjReqChecking] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState(1);
    const [subjectExistInFaculties, setSubjectInFaculties] = useState([])
    let [faculty, set_faculty] = useState([]);
    const [subjectsWithRates, setSubjectsWithRates] = useState([]);
    const [phase, setPhase] = useState('search')

    const [loadingSubs, setLoadingSubs] = useState(false)

    const handleModalClose = () => {
        setShowAddNewSubjModal(false)
        setNewSubjectData('')
        setNewSubjectFacultyData('')
        setNewSubjectReasonData('')
        setSubjectInFaculties([])
        setPhase('search')
    }

    const handleSearch = async () => {
        if (!newSubjectData.length) setSubjectInFaculties([])
        else {
            setNewSubjReqChecking(true)
            const result = await new_subj_request_exist(newSubjectData);
            if (result?.data) setSubjectInFaculties(result.data.faculties);
            if (!result?.data?.faculties?.length) setPhase('add')
            setNewSubjReqChecking(false)
        }
    }

    useEffect(() => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        setLoadingSubs(true)
        get_rates(user_id, selectedFaculty)
            .then((result) => {
                if (!result?.response?.data) { setSubjectsWithRates(result) }
                setLoadingSubs(false)
            })
            .catch((err) => console.log(err))
    }, [selectedFaculty])

    const getFacultiesOption = async () => {
        let list = await get_faculty()
        if (list?.length) {
            const selectOptions = list.map((item) => {
                return (
                    <option data-id={item.Id} value={`${item.Faculty}-${item.Id}`}
                        selected={newSubjectFacultyData === `${item.Faculty}-${item.Id}`} >{item.Faculty}</option>
                )
            })
            set_faculty(list)
            setNewSubjectFaculty(selectOptions)
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    useEffect(() => { getFacultiesOption() }, [newSubjectFacultyData])


    const checkRequestExist = async (e) => {
        e.preventDefault()
        setNewSubjReqChecking(true)
        if (!newSubjectData.length) setSubjectInFaculties([])
        else if (!subjectExistInFaculties.length) {
            const result = await new_subj_request_exist(newSubjectData);
            if (!result.subjectExist) {
                uploadNewSubject()
            }
            else {
                setNewSubjectData('')
                toast.warning(result.response.data.message)
            }
        }
        setNewSubjReqChecking(false)
    }

    let uploadNewSubject = () => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        upload_new_subject(newSubjectFacultyData.split('-')[0], newSubjectData, newSubjectReasonData,
            user_id, newSubjectFacultyData.split('-')[1])
            .then((result) => {
                if (result) {
                    setNewSubjectData('')
                    setNewSubjectFacultyData('')
                    setNewSubjectReasonData('')
                    toast.success("Subject Added Succefully. Please wait for Admin to approve your request");
                    setShowAddNewSubjModal(false)
                } else {
                    toast.error("Error While Sending Request of New Subject")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="" style={{ marginTop: "2px" }}>

                <div className=" d-flex flex-column">

                    <SubMenu faculty={faculty} selectedFaculty={selectedFaculty} setSelectedFaculty={setSelectedFaculty} />
                    <div className='d-flex justify-content-around' >
                        <div className="highlight d-flex flex-column align-items-center m-0" style={{ width: "20%" }}>
                            <p>
                                Select your faculty above, then from the list below click on the 'Edit' button for each subject that you teach
                                (you can select more than one). Type your rate, select the school grade(s) you tutor for this subject and SAVE.
                                Didn't find your subject, and want to add it? Submit your request that match your expertise by clicking here:
                            </p>
                            <Button className='action-btn btn text-center w-100' type="button"
                                handleClick={() => setShowAddNewSubjModal(true)} >
                                <div className="button__content">
                                    <div className="button__icon">
                                        <FaPlus />
                                    </div>
                                    <p className="button__text">Search/Add New Subject</p>
                                </div>
                            </Button>

                        </div>

                        {loadingSubs ? <Loading height='57vh' /> :
                            <div style={{ width: "78%" }}>
                                <div className='d-flex rounded justify-content-between
                         align-items-center
                         mx-2 p-2' style={{ color: "white", background: "#2471A3" }}>
                                    <p className='m-0 col-2'>{subjectsWithRates.length} Subjects</p>
                                    <p className='m-0 col-6'>School Grades (elementary, middle, & high school)</p>
                                    <p className='m-0 col-3 text-start'> $ Rate</p>
                                    <p className='m-0 col-1'> Action</p>
                                </div>
                                <div style={{ height: "57vh", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
                                    {
                                        subjectsWithRates.map((item, index) => {
                                            const rateExtracted = item.rate && parseFloat(item.rate.replace('$', ''))
                                            const rate = isNaN(rateExtracted) ? '' : rateExtracted
                                            const grades = JSON.parse(item.grades ?? '[]');
                                            return <SubjectCard
                                                faculty={selectedFaculty}
                                                subject={item.subject}
                                                rateVal={rate}
                                                gradesVal={grades}
                                                id={item.SID}
                                            />
                                        }
                                        )
                                    }
                                </div>

                            </div>
                        }
                    </div>
                </div>

            </div>

            <CenteredModal
                show={showAddNewSubjModal}
                handleClose={handleModalClose}
                title={!subjectExistInFaculties.length && phase !== 'search' && !!newSubjectData.length ?
                    'Add New Suggested Subject' :
                    'To Search If your subject exist , please type it in below field'}
            >
                <form onSubmit={checkRequestExist}>

                    <div className='d-flex flex-column' style={{ gap: "20px" }}>

                        <DebounceInput
                            delay={500}
                            value={newSubjectData}
                            setInputValue={setNewSubjectData}
                            onChange={(e) => setNewSubjectData(e.target.value)}
                            type='text'
                            debouceCallback={handleSearch}
                            placeholder='Type your subject here'
                            className='form-control'
                            required
                        />
                        {
                            !subjectExistInFaculties.length && phase !== 'search' && !!newSubjectData.length && <div style={{ fontSize: "12px" }}>
                                <p>This Subject does not exist.
                                    To add the subject, select also the fauclty to be considered.
                                </p>
                                <select className='form-select mb-1'
                                    required onChange={e => setNewSubjectFacultyData(e.target.value)} type='text' >
                                    <option value='' selected={!newSubjectFacultyData.length} disabled>Select Faculty</option>
                                    {newSubjectFaculty}
                                </select>
                            </div>
                        }
                        {/* {!subjectExistInFaculties.length && !!newSubjectData.length &&
                            !!newSubjectReasonData.length &&
                        } */}

                        {!subjectExistInFaculties.length && phase === 'add' && <textarea
                            style={{ height: "200px" }}
                            value={newSubjectReasonData}
                            required className='form-control'
                            onChange={e => setNewSubjectReasonData(e.target.value)}
                            placeholder='Explain why this subject should be added, and your ability, and experience of tutoring it.(max 700 characters)' />}
                        {
                            !!subjectExistInFaculties.length &&
                            <div className='border p-2 shadow rounded'>
                                <h6>The Subject found in the Faculty below.</h6>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {subjectExistInFaculties.map(faculty =>
                                        <Pill label={faculty} width='200px' />
                                    )}
                                </div>
                            </div>

                        }
                    </div>
                    <div className="mt-4 d-flex justify-content-between">
                        <div>
                            {
                                newSubjRequestChecking ? <Loading loadingText='searching subject...' iconSize='20px' height='20px' />
                                    : null
                            }
                        </div>
                        <div>
                            <button type="button" className="action-btn btn" onClick={handleModalClose}>
                                <div className="button__content">
                                    <p className="button__text">Close</p>
                                </div>
                            </button>
                            <Button type="submit" className="action-btn btn" loading={newSubjRequestChecking}
                                disabled={newSubjRequestChecking || subjectExistInFaculties.length}>
                                <div className="button__content align-items-center">
                                    {!subjectExistInFaculties ?
                                        <FaPlus style={{
                                            animation: newSubjRequestChecking ? "spin 2s linear infinite" : 'none',
                                            marginBottom: "5px"
                                        }} /> :
                                        <FaSearch style={{
                                            animation: newSubjRequestChecking ? "spin 2s linear infinite" : 'none',
                                            marginBottom: "5px"
                                        }} />
                                    }
                                    <p className="button__text">{phase === 'search' ? 'Search' : 'Add'}</p>
                                </div>
                            </Button>
                        </div>

                    </div>
                </form>
            </CenteredModal>
            <Actions saveDisabled={true} />
        </>
    );
}

export default Subjects;