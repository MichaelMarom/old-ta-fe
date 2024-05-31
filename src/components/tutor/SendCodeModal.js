import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import TAButton from '../common/TAButton'
import Input from '../common/Input'
import UserRichTextEditor from '../common/RichTextEditor/UserRichTextEditor';
import { useSelector } from 'react-redux';
import { send_email } from '../../axios/admin';
import { toast } from 'react-toastify';

const SendCodeModal = ({ isOpen, onClose, code, subject }) => {
    const [name, setName] = useState('')
    const { tutor } = useSelector(state => state.tutor)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailText, setEmailText] = useState(`Hi <b>${name}</b>,
    <p> I am a tutor, my screen name is  ${tutor.TutorScreenname} for the new tutoring platfor. I am happy to announce the launch of a new educational platform,
     that i am using for my tutoring.
    <a href="${process.env.REACT_APP_BASE_URL}/signup?role=student">https://tutoring-Academy.com</a>. 
    As part of this initiative, I have provided you the code “${code}” for subject “${subject}”  
        that you'll need to access your setup page. 
        By entering this code, we'll be able to connect on the new platform.<p>`)

    useEffect(() => {
        if (name?.length && code?.length && tutor?.TutorScreenname && subject?.length) {
            setEmailText(`Hi <b>${name}</b>,
            <p> I am a tutor my screen name is ${tutor.TutorScreenname} for the new platform. I am happy to announce the launch of a new educational platform, 
            that i am using for my tutoring.
            <a href="${process.env.REACT_APP_BASE_URL}/signup?role=student">https://tutoriring-Academy.com</a>. 
            As part of this initia  tive, I have provided you the code “${code}”  for subject “${subject}” 
            that you'll need to access your setup page. 
            By entering this code, we'll be able to connect on the new platform.<p>`)
        }
    }, [name, code, tutor.TutorScreenname, subject, isOpen])

    const handleSubmit = async (e) => {
       try{ e.preventDefault()
        setLoading(true)
        const data = await send_email({ emails: [email], message: emailText, subject: "Tutor's Code" })
        if (!data?.response?.data) {
            setEmail('')
            setName('')
            onClose()
            setEmailText('')
            toast.success("Email Sent Successfully")
        }
        else toast.error("Email Sent Error")
        setLoading(false)}
        catch(err){
            toast.error("Email Sent Error", err.message)
        }
    }

    return (
        <Modal show={isOpen} handleClose={onClose} 
        title={`Send Code for <b>${subject}</b> To Student`} >
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex w-100'>
                        <div className='m-1 w-50'>
                            <Input label="Email Of Student" type="email " setValue={setEmail} value={email} />
                        </div>
                        <div className='m-1 w-50'>
                            <Input label="Code" editMode={false} value={code} />
                        </div>
                    </div>
                    <div className='d-flex w-100'>
                        <div className='m-1 w-50'>
                            <Input label="Name of Student" setValue={setName} value={name} />
                        </div>
                        <div className='m-1 w-50'>
                            <Input label="Your Name" value={tutor.TutorScreenname} 
                            editMode={false} />
                        </div>
                    </div>
                    <div style={{pointerEvents:"none"}}>
                        <div className='border p-2 m-1' 
                            dangerouslySetInnerHTML={{ __html: emailText }}
                        />
                    </div>
                    <TAButton type="submit" buttonText={"Send"} className='w-auto' loading={loading} />
                </form>
            </div>
        </Modal>
    )
}

export default SendCodeModal