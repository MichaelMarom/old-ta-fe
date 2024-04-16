import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css'
import { delete_new_subject, get_tutor_new_subject, post_new_subject } from '../../axios/admin';
import Loading from '../common/Loading';
import { toast } from 'react-toastify';
import { RxCrossCircled } from "react-icons/rx";

const TutorTable = () => {
    let [data, setData] = useState([])
    const [loading, setIsLoading] = useState(false);
    const [actionTaken, setActionTaken] = useState()

    const COLUMNS = [
        {
            Header: 'Tutor Name',
            accessor: 'Tutor Name',
        },
        {
            Header: 'Subject',
            accessor: 'Subject',
        },
        {
            Header: 'Faculty',
            accessor: 'Faculty',
        },
        {
            Header: 'Notes',
            accessor: 'Notes',
        },
        {
            Header: 'Accepted',
            accessor: 'Accepted',
        },
        {
            Header: 'Check Box',
            accessor: 'Check Box'
        }

    ];

    useEffect(() => {
        setIsLoading(true)
        get_tutor_new_subject()
            .then((result) => {
                if (!result?.response?.data) {
                    setData(result)
                    setIsLoading(false)
                }
            })
            .catch((err) => console.log(err))
    }, [actionTaken])

    let acceptNewSubject = async (id, subject, AcademyId) => {
        const response = await post_new_subject(id, subject, AcademyId)
        if (response.bool) {
            setActionTaken(!actionTaken)
            toast.success("Record Updated Successfully!")
        } else {
            toast.error("Failed to Update the Record")
        }
    }

    let declineNewSubject = async (subject, AcademyId) => {
        const response = await delete_new_subject(subject, AcademyId)

        if (response.bool) {
            setActionTaken(!actionTaken)
            toast.success("Record Updated Successfully!")
        } else {
            toast.error("Failed to Update the Record")
        }
    }
    if (loading)
        return <Loading />
    return (

        <div className="tables" style={{ height: '100%', width: '100%', overflow: 'auto', padding: '5px' }}>

            {
                data.length ?
                    <table style={{ position: 'relative' }}>
                        <thead >
                            <tr>
                                {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                            </tr>
                        </thead>
                        <tbody>

                            {
                                data.length > 0
                                    ?

                                    data.map((item) => {
                                        console.log(item.IsRejected, typeof (item.IsRejected))
                                        return <tr key={item.SID} >

                                            <td data-src={''}>{item.FirstName}</td>
                                            <td data-src={''}>{item.subject}</td>
                                            <td data-src={''}>{item.faculty}</td>
                                            <td data-src={''}>{item.reason}</td>
                                            <td data-src={''}>{item.IsRejected ? <RxCrossCircled size={20} /> : '-'}</td>

                                            <td data-src=''>
                                                <>
                                                    <button
                                                        onClick={() => acceptNewSubject(item.facultyId, item.subject, item.AcademyId[0])}
                                                        className='action-btn btn btn-sm'>
                                                        <div className="button__content">

                                                            <p className="button__text">Accept   </p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => declineNewSubject(item.subject, item.AcademyId[0])}
                                                        className='action-btn btn btn-sm' disabled={item.IsRejected}>
                                                        <div className="button__content">
                                                            <p className="button__text">Decline   </p>
                                                        </div>
                                                    </button>
                                                </>

                                            </td>

                                        </tr>
                                    }
                                    ) : null
                            }



                        </tbody>
                    </table> : <div className='text-danger m-3'>No record Found</div>
            }

        </div>
    );
}

export default TutorTable;