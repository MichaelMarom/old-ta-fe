import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import Input from '../../../components/common/Input'
import { useSelector } from 'react-redux';
import TAButton from '../../../components/common/TAButton'
import UserRichTextEditor from '../../../components/common/RichTextEditor/UserRichTextEditor';
import { get_email_temp, save_email_temp, update_email_temp } from '../../../axios/admin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MandatoryFieldLabel } from '../../../components/common/Input/InputLabel';

const Edit = () => {
    const [subject, setSubject] = useState('');
    const [emailText, setEmailText] = useState('')
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate()

    const param = useParams()

    useEffect(() => {
        param.id && get_email_temp(param.id).then(result => {
            if (!result?.response?.data) {
                setEmailText(result.text);
                setSubject(result.name)
            }
        })
    }, [param.id])

    const handleSave = async (e) => {
        e.preventDefault()
        setUpdating(true)
        update_email_temp({ name: subject, text: emailText }, param.id).then(() => {
            toast.success('Updated Successfully!')
            navigate('/admin/email-templates')
        }).finally(() => {
            setUpdating(false)
        })
    }

    return (
        <Layout>
            <div className='container m-auto'>
                <div className='my-4 h-100 email-temp d-flex justify-content-center align-items-center'>
                    <form className='w-75' onSubmit={handleSave}>
                        <div className='d-flex flex-column m-4 justify-content-center align-items-center'
                            style={{ gap: "5px" }}>
                            <h5> Update Email Template</h5>

                            <Input value={subject} setValue={setSubject} label={<MandatoryFieldLabel text={"Enter Subject"} />} />

                            <UserRichTextEditor
                                onChange={(value) => setEmailText(value)}
                                placeholder={"Enter Email Text. This Email text will be followed by signature and it starts with logo"}
                                readOnly={false}
                                value={emailText}
                                height='300px'
                            />
                            <TAButton buttonText={"Update"} type='submit' loading={updating} />
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Edit 