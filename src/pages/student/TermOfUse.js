import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import Actions from '../../components/common/Actions'
import { useDispatch, useSelector } from 'react-redux'
import RichTextEditor from '../../components/common/RichTextEditor/RichTextEditor'
import { get_adminConstants, post_termsOfUse } from '../../axios/admin'
import Loading from '../../components/common/Loading'
import { toast } from 'react-toastify'
import { showDate } from '../../helperFunctions/timeHelperFunctions'
import { convertToDate } from '../../components/common/Calendar/Calendar'
import { post_student_agreement } from '../../axios/student'
import { setStudent } from '../../redux/student_store/studentData'

const StudentIntro = () => {
    const { user } = useSelector(state => state.user)
    const [terms, setTerms] = useState('');
    const [editMode, setEditMode] = useState(false)
    const [unSavedChanges, setUnSavedChanges] = useState(false)
    const [loading, setLoading] = useState(false)
    const [db_terms, set_db_terms] = useState('');
    const [fetching, setFetching] = useState(true);
    const { student } = useSelector(state => state.student)
    const [agreed, setAgreed] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (student.AgreementDate) {
            setAgreed(student.AgreementDate)
        }
    }, [student])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get_adminConstants(2);
                if (!result?.response?.data) {
                    setTerms(result.data[0].TermContent);
                    set_db_terms(result.data[0].TermContent);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setFetching(false)
        };

        fetchData();
    }, []);

    useEffect(() => {
        if ((terms !== undefined && db_terms !== undefined && terms !== db_terms && editMode) ||
            (!student.AgreementDate && agreed)) {
            setUnSavedChanges(true);
        } else {
            setUnSavedChanges(false);
        }
    }, [terms, db_terms, agreed, student, editMode])

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        const response = await post_termsOfUse({ id: 2, TermContent: terms });
        if (response.message) {
            toast.error(response.message)
        }
        else {
            toast.success('Successfully save the terms!');
            set_db_terms(response.data.TermContent);
        }
        setEditMode(false);
        setLoading(false)
    }

    const handleSaveAgreement = async (e) => {
        e.preventDefault()
        setLoading(true)

        console.log(student.FirstName, student.MiddleName, student.LastName, student.Email,
            student.Language, student.SecLan, student.ParentAEmail, student.ParentAName,
            student.ParentBEmail, student.parentBName, student.AgeGrade,
            'random', student.Cell, student.Grade, student.Address1, student.Address2,
            student.City, student.State, student.ZipCode, student.Country,
            student.GMT, student.Photo, student.AcademyId, student.userId
        )
        const data = await post_student_agreement(user.SID, { AgreementDate: new Date() })
        if (data?.[0]) {
            dispatch(setStudent(data[0]))
        }
        setEditMode(false)
        setLoading(false)
    }

    const handleEditorChange = (value) => { setTerms(value) }

    if (fetching)
        return <Loading />
    return (
        <StudentLayout  >

            <form onSubmit={user.role === 'admin' ? handleSave : handleSaveAgreement}>
                <div className='px-4 mt-4 student-terms'>
                    <RichTextEditor
                        value={terms}
                        onChange={handleEditorChange}
                        readOnly={!editMode || user.role !== 'admin' || !editMode}
                        placeholder="Enter Term Of Service here"
                        style={{ height: "55vh" }}
                    />
                </div>
                <div className="d-block p-5">
                    <div className="form-check " >
                        <input className="form-check-input" style={{ width: "30px", height: "30px", marginRight: '10px' }}
                            type="checkbox" checked={agreed} onChange={() => setAgreed(true)}
                            disabled={student.AgreementDate || user.role !== 'student' || !editMode}
                            required={user.role === 'student'}
                        />
                        <label className="form-check-label fs-6">
                            By checking the box you agree with the terms of the tutoring academy service.
                        </label>
                    </div>{
                        student.AgreementDate &&
                        <div className="text-success">
                            Agreed on -  {showDate(convertToDate(student.AgreementDate))}
                        </div>
                    }
                </div>

                <Actions
                    loading={loading}
                    saveDisabled={!editMode || (student.AgreementDate && user.role === 'student')}
                    editDisabled={editMode}
                    onEdit={() => setEditMode(true)}
                    unSavedChanges={unSavedChanges}
                    nextDisabled={!student.AgreementDate}
                />
            </form>
        </StudentLayout>
    )
}

export default StudentIntro
