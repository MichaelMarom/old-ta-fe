import React, { useState } from 'react'
import TutorLayout from '../../layouts/TutorLayout'
import CreateLeftPanel from '../../components/tutor/Agency/CreateLeftPanel'
import TAButton from '../../components/common/TAButton'

const Agency = () => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => {
        setIsOpen(false)
    }

    return (
        <TutorLayout>
            <div className='container'>
                <div className=' mt-2 highlight'>
                    <p className='m-1'>
                        Tutoring Academy platform offers you with a unique 'Agency' opportunity 
                        that comes with specific prerequisitis. As a dedicated tutor, you are 
                        invited to expand your impact by maintaining an active account and 
                        completing at least 40 hours of tutoring. Your leadership skills will 
                        shine as you mentor a minimum of six sub-tutors, guiding them towards 
                        success.
                    </p>
                    <p className='m-1'>
                        To begin, simply list your sub-tutors in the designated table and assign 
                        a markup percentage for each. Your earnings will reflect the difference 
                        between your earning level, and that of your sub-tutors, rewarding you for 
                        your mentorship efforts. Once you have a team of six or more sub-tutors, 
                        the 'Code' button will be enabled. By clicking these buttons, you will 
                        activate your franchise.
                    </p>
                    <p className='m-1'>
                        Distribute the generated codes to your sub-tutors and,
                        once they register and activate their accounts, your agency will be
                        fully operational.
                        We are excited to see you grow and succeed in this new venture
                    </p >
                </div>
                <div className='d-flex w-100 justify-content-end mt-3'>
                    <TAButton buttonText={"Add Tutor"} handleClick={() => setIsOpen(true)} />
                </div>
                <div className='mt-2'>
                    <table>
                        <thead>
                            <th>
                                SID
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Country</th>
                            <th>Subjects</th>

                            <th>Markup%</th>

                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Phone</td>
                                <td>Country</td>
                                <td>Subjects</td>

                                <td>Markup%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <CreateLeftPanel isOpen={isOpen} onClose={onClose} />
            </div>

        </TutorLayout>
    )
}

export default Agency