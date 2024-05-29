import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { wholeDateFormat } from '../../constants/constants'
import { showDate } from '../../utils/moment'

const MessageBox = ({ message }) => {
    const location = useLocation()
    const { student } = useSelector(state => state.student);
    const { tutor } = useSelector(state => state.tutor);
    const studentLoggedIn = location.pathname.split('/')[1] === 'student';
    const loggedInUserDetail = studentLoggedIn ? student : tutor;

    return (
        <li key={message.id} className={`ks-item ${message.senderId === loggedInUserDetail.AcademyId ?
            'ks-from w-100' : 'ks-self w-100'}`}>
            <span className={`ks-avatar ${message.senderId === 'User A' ? 'ks-offline' : 'ks-online'}`}>
                <img src={message.photo} width="36" height="36"
                    className="rounded-circle"
                    alt="User Avatar" />
            </span>
            <div className="ks-body">
                <div className="ks-header">
                    <span className="ks-name">{message.screenName}</span>
                    <span className="ks-datetime">{showDate(message.date, wholeDateFormat)}</span>
                </div>
                <div className='d-flex flex-column align-items-end'>
                  {message.fileName&&  <div className='border border-secondary p-2 rounded float-end mb-2' style={{
                        boxShadow: " inset 0 0 10px rgba(0, 0, 0, 0.5)",
                        width: 'fit-content'
                    }}>
                        <div>{message.fileName}</div>
                        {message.fileUrl && <div className='mt-2' >
                            <img
                                src={message.fileUrl}
                                alt={message.file}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                        </div>}
                    </div>}
                    <div className="ks-message" style={{whiteSpace:"wrap"}}>{message.text}</div>
                </div>
            </div>
        </li>
    )
}

export default MessageBox
