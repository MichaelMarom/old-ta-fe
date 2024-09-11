import { useClerk } from '@clerk/clerk-react'
import React from 'react'
import { FaEnvelope, FaSignOutAlt } from 'react-icons/fa'
import { redirect_to_login } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTutor } from '../redux/tutor/tutorData'
import { setStudent } from '../redux/student/studentData'
import { setUser } from '../redux/auth/auth'

const ClosedAccPage = () => {
    const { signOut } = useClerk()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-danger p-4 shadow-lg rounded" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <h4>Your Account is Closed</h4>
                <p>Please contact the administrator.</p>
                <div className="mt-3">
                    <FaEnvelope className="me-2" />
                    <span>Contact: admin@example.com</span>
                </div>
                <button className="btn btn-outline-danger mt-3" onClick={() => redirect_to_login(
                    navigate, signOut, dispatch, setTutor, setStudent, setUser)}>
                    <FaSignOutAlt className="me-2" /> Sign Out
                </button>
            </div>
        </div>
    )
}

export default ClosedAccPage