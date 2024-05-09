import React, { useState } from 'react'
import Layout from './Layout'
import Input from '../../../components/common/Input'
import TAButton from '../../../components/common/TAButton'

const AddTutors = () => {
    const [tutorInfo, setTutorInfo] = useState({})
    const [creating, setCreating]=useState(false)

    const setInfo = (value, key) => {
        setTutorInfo({ ...tutorInfo, [key]: value })
    }

    const handleSave = async()=>{

    }

    return (
        <Layout>
            <div className='container m-auto'>
                <div className='my-4 h-100 email-temp d-flex justify-content-center align-items-center'>
                    <form className='w-75 border' onSubmit={handleSave}>
                        <div className='d-flex flex-column m-4 justify-content-center align-items-center'
                            style={{ gap: "5px" }}>
                            <h5> Create Email Template</h5>
                            <Input value={tutorInfo.fname} setValue={(val) => setInfo(val, 'fname')} label={"Enter First Name"} />
                            <Input value={tutorInfo.lname} setValue={(val) => setInfo(val, 'lname')} label={"Enter Last Name"} />
                            <Input value={tutorInfo.country} setValue={(val) => setInfo(val, 'country')} label={"Enter Country"} />
                            <Input value={tutorInfo.email} setValue={(val) => setInfo(val, 'email')} label={"Enter Email"} />
                            <Input value={tutorInfo.pnumber} setValue={(val) => setInfo(val, 'pnumber')} label={"Enter Phone Number"} />


                            <TAButton buttonText={"Save"} type='submit' loading={creating} />
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default AddTutors