import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import Actions from '../../components/common/Actions'
import { useDispatch, useSelector } from 'react-redux'
import RichTextEditor from '../../components/common/RichTextEditor/RichTextEditor'
// import { get_adminConstants, post_termsOfUse } from '../../axios/admin'
import Loading from '../../components/common/Loading'
import { toast } from 'react-toastify'
import { showDate } from '../../utils/moment'
import { convertToDate } from '../../components/common/Calendar/Calendar'
import { post_student_agreement, setAgreementDateToNullForAllStudents } from '../../axios/student'
import { setStudent } from '../../redux/student/studentData'
import { MandatoryFieldLabel } from '../../components/tutor/TutorSetup'
import _ from 'lodash'

const TermOfUse = () => {
    const { user } = useSelector(state => state.user)
    const [editMode, setEditMode] = useState(false)
    const [unSavedChanges, setUnSavedChanges] = useState(false)
    const [loading, setLoading] = useState(false)
    const { student } = useSelector(state => state.student)
    const { studentMissingFields } = useSelector(state => state.studentMissingFields)
    const [agreed, setAgreed] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (student.AgreementDate) {
            setAgreed(student.AgreementDate)
        }
    }, [student])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const result = await get_adminConstants(2);
    //             if (!result?.response?.data) {
    //                 setTerms(result.data[0].TermContent);
    //                 set_db_terms(result.data[0].TermContent);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //         setFetching(false)
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        // (terms !== undefined && db_terms !== undefined && terms !== db_terms && editMode)
        if ((!student.AgreementDate && agreed)) {
            setUnSavedChanges(true);
        } else {
            setUnSavedChanges(false);
        }
    }, [agreed, student, editMode])

    // const handleSave = async (e) => {
    //     e.preventDefault()
    //     setLoading(true)
    //     const response = await post_termsOfUse({ id: 2, TermContent: terms });
    //     if (response.message) {
    //         toast.error(response.message)
    //     }
    //     else {
    //         toast.success('Successfully save the terms!');
    //         setAgreementDateToNullForAllStudents()
    //         set_db_terms(response.data.TermContent);
    //     }
    //     setEditMode(false);
    //     setLoading(false)
    // }

    const handleSaveAgreement = async (e) => {
        e.preventDefault()
        if (user.role === "student") {
            const missingFieldsExceptTOU = _.chain(studentMissingFields).filter((item) => item.tab !== "Terms Of Use").map(item => `"${item.tab}" `).value()
            if (missingFieldsExceptTOU.length)
                return toast.warning(
                    `Mandatory fields are missing from ${_.uniq(
                        _.chain(studentMissingFields).filter((item) => item.tab !== "Terms Of Use").map(item => `"${item.tab}" `).value()
                    )} Tab`
                );

            setLoading(true)

            const data = await post_student_agreement(user.SID, { AgreementDate: new Date(), Status: 'under-review' })
            if (data?.[0]) {
                dispatch(setStudent(data[0]))
            }
            setEditMode(false)
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSaveAgreement}>
                <div className="d-block py-3 px-5">
                    <h4 style={{ fontSize: "16px" }}><span className="text-danger" style={{ fontWeight: "bold", fontSize: "20px" }}>*</span>CHECKING THE BOX BELOW, CONSITUTES YOUR ACCPETANCE OF THESE TERMS OF USE
                    </h4>
                    <div className="form-check " >
                        <input className="form-check-input border border-dark" style={{ width: "30px", height: "30px", marginRight: '10px' }}
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
                <div className='px-4 mt-4 student-terms'>
                    <div className='overflow-auto border shadow p-2' style={{ maxHeight: "calc(100vh - 290px", height: "auto" }} >
                        <div className='w-100 text-center p-1'>
                            <img className='' src={`${process.env.REACT_APP_BASE_URL}/logo1.png`} width={350} height={100} alt="logo" />
                        </div>
                        <h6>Welcome to Tutoring Academy, an online platform that connects you with qualified tutors in various subjects.
                            By using our services, you agree to abide by the following terms of use:
                        </h6>
                        <ol>
                            <li>You are responsible for your own learning and academic performance. Our tutors are here to guide you, but they cannot do your homework, assignments, tests, or exams for you. You must not ask them to violate any academic integrity policies of your school or institution.
                            </li>
                            <li>You are expected to be respectful and courteous to our tutors and other users. You must not use any abusive, offensive, or inappropriate language or behavior on our platform. You must also respect the privacy and confidentiality of our tutors and other users. You must not share any personal or sensitive information without their consent.
                            </li>
                            <li>You are required to pay for the tutoring sessions that you book on our platform. You may cancel reschedule a session according to the cancellation policy of your tutor before the scheduled time. If you do not show up for a session without any notice, you will be charged the full session price.
                            </li>
                            <li>If you consented to the session recording, you are entitled to a refund or a replacement session if you are not satisfied with the quality of the tutoring service. You must contact us within 48 hours after the session and provide us with a detailed explanation of your dissatisfaction. We will review your recorded session case and offer you a suitable solution. if you didn't consent to the session recording, it may be harder for us to resolve your content.
                            </li>
                            <li>
                                You acknowledge that we own all the intellectual property rights of our platform, including but not limited to the content, design, logo, trademark, and software. You must not copy, modify, distribute, or use any of our materials without our prior written permission.
                            </li>
                            <li> You agree to indemnify and hold us harmless from any claims, damages, liabilities, or expenses that may arise from your use or misuse of our platform, your violation of these terms of use, or your infringement of any rights of our tutors or other users.
                            </li>
                            <li>We reserve the right to modify, suspend, or terminate our platform or any part of it at any time without prior notice. We also reserve the right to update, change, or amend these terms of use at any time without prior notice. You are advised to check these terms of use regularly for any changes. Your continued use of our platform after any changes constitutes your acceptance of the new terms of use.
                            </li>
                        </ol>
                        <p className='text-success'>
                            If you have any questions or concerns about these terms of use, please contact us at
                            <span className='text-primary'>
                                &nbsp;admin@tutoring-academy.com
                            </span>.
                        </p>
                    </div>
                    {/* <RichTextEditor
                        value={terms}
                        onChange={handleEditorChange}
                        readOnly={!editMode || user.role !== 'admin' || !editMode}
                        placeholder="Enter Term Of Service here"
                        style={{ height: "calc(100vh - 310px)" }}
                    /> */}
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
        </>
    )
}

export default TermOfUse
