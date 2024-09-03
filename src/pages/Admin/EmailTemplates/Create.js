import React, { useState } from 'react'
import Layout from './Layout'
import Input from '../../../components/common/Input'
import { useSelector } from 'react-redux';
import TAButton from '../../../components/common/TAButton'
import UserRichTextEditor from '../../../components/common/RichTextEditor/UserRichTextEditor';
import { save_email_temp } from '../../../axios/admin';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MandatoryFieldLabel } from '../../../components/tutor/TutorSetup';

const Create = () => {
  const [subject, setSubject] = useState('');
  const [emailText, setEmailText] = useState('')
  const [creating, setCreating] = useState(false)
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleSave = async (e) => {
    e.preventDefault()
    setCreating(true)
    save_email_temp({ name: subject, text: emailText, created_by: user.email }).then((result) => {
      if (!result?.response?.data) {
        navigate('/admin/email-templates')
        toast.success('Created Succesfully!')
      }
      else {
        toast.success('Failed To Create!')
      }
    }).finally(() => {
      setCreating(false)
    })
  }

  return (
    <Layout>
      <div className='container m-auto'>
        <div className='my-4 h-100 email-temp d-flex justify-content-center align-items-center'>
          <form className='w-75 border' onSubmit={handleSave}>
            <div className='d-flex flex-column m-4 justify-content-center align-items-center'
              style={{ gap: "5px" }}>
                <h5> Create Email Template</h5>
              <Input value={subject} setValue={setSubject} label={<MandatoryFieldLabel text={"Enter Subject"} />} />

              <UserRichTextEditor
                onChange={(value) => setEmailText(value)}
                placeholder={"Enter Email Text. This Email text will be followed by signature and it starts with logo"}
                readOnly={false}
                value={emailText}
                height='300px'
              />
              <TAButton buttonText={"Save"} type='submit' loading={creating} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Create 