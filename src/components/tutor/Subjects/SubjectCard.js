import React, { useState } from 'react'
import Input from '../../common/Input'
import GradePills from './../GradePills'
import Button from '../../common/Button'
import {  remove_subject_rates, upload_tutor_rates } from '../../../axios/tutor'
import { toast } from 'react-toastify'

const SubjectCard = ({ subject, rateVal, gradesVal, faculty, id }) => {
    const [rate, setRate] = useState(rateVal)
    const [grades, setGrades] = useState(gradesVal)
    const [editable, setEditable] = useState(false);
    const tutorId = localStorage.getItem('tutor_user_id')
    const options = [
        {
            value: 'K-3',
            text: 'K-3'
        },
        {
            value: '4-6',
            text: '4-6'
        },
        {
            value: '7-9',
            text: '7-9'
        },
        {
            value: '10-12',
            text: '10-12'
        }, {
            value: "University"
        }
    ]

    const validate = (value) => {
        const regex = /^\d{1,3}?$/;

        if (regex.test(value) || value === '') {
            return true
        }
        return false
    }

    const handleOnChangeRate = (value) => {
        if (validate(value)) {
            setRate(value ? parseInt(value, 10) : '')
        }
    }

    const removeFromSubjectRates = async () => {
        setGrades([])
        setEditable(false);
        await remove_subject_rates(id)
        toast.success('The subject was removed from your teaching list successfully!')
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (!grades.length) return toast.warning("Please select at least one range of school grades!")
        if (rate < 3) return toast.warning("Minimum rate is $3")

        setEditable(false);
        const data = await upload_tutor_rates(`$${rate}.00`, grades, tutorId, faculty, subject)

        if (data?.response?.status === 400) {
            toast.error('Failed to Save Record')
        }
        else {
            toast.success('Succesfully Save The Record')
        }
    }

    return (
        <div className={`border p-2 rounded  mx-2 d-flex justify-content-between align-items-center `}
            style={{ background: !editable ? '#d8d8d8' : "" }}>
            <h6 className='m-0 text-start col-2'>{subject}</h6>
            <form onSubmit={handleSave}
                className=' d-flex justify-content-between align-items-center'>

                <div className='d-flex col-6 flex-wrap'>
                    {options.map(option =>
                        <GradePills editable={editable} grade={option.value} setGrades={setGrades} grades={grades} />)
                    }
                </div>
                <div className='col-2 text-center'>
                    <Input style={{ width: "50px", padding: "5px", height: "30px" }}
                        placeholder={"00"} inputGroupText={"$"} className="form-control m-0" inputGroup={true} vertical={false} value={rate} onChange={handleOnChangeRate} disabled={!editable} />
                </div>
                <div className='float-end'>

                    {!editable &&
                        <Button className='action-btn btn' handleClick={() => setEditable(!editable)}>
                            <div className="button__content">
                                <p className="button__text">Edit</p>
                            </div>
                        </Button>
                    }
                    {(rate === '') && editable &&
                        <Button type={"button"} className='action-btn btn' handleClick={() => removeFromSubjectRates()}
                        >
                            <div className="button__content">
                                <p className="button__text">Revert</p>
                            </div>
                        </Button>
                    }


                    <Button type='submit' className={`action-btn btn ${editable ? 'blinking-button saving-btn' : ''}`} disabled={!editable}>
                        <div className="button__content">
                            <p className="button__text">Save</p>
                        </div>
                    </Button>
                </div>
            </form>

        </div >
    )
}

export default SubjectCard