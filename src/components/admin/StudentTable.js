import { useEffect, useState } from 'react';
import { get_student_data } from '../../axios/admin';
import { COLUMNS } from '../../Tables/Admin/column_0';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions'
import Loading from '../common/Loading'

const StudentTable = () => {

    let [data, set_data] = useState([]);
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        setLoading(true)
        get_student_data()
            .then((result) => {
                if (!result?.response?.data) {
                    set_data(result)
                }
            }).finally(() => {
                setFetched(true)
                setLoading(false)
            })
    }, [])

    let set_status = async (e, Id, Status) => {
        e.preventDefault();
        // let response = await set_student_status(Id, Status)
        // if (response.bool) {
        //     alert(response.mssg)
        //     get_student_data()
        //         .then((result) => {
        //             console.log(result)
        //             set_data(result)
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //         })
        // } else {
        //     alert(response.mssg)
        // }
    }

    let redirect_to_student_setup = (student_id, screenName) => {
        window.localStorage.setItem('student_user_id', student_id);
        localStorage.setItem('student_screen_name', screenName)
        window.localStorage.setItem('user_role', 'admin');
        window.open(`${process.env.REACT_APP_BASE_URL}/student/setup`, "_blank")
    }

    return (
        <>
            <div className="tables" style={{ width: '100%', overflow: 'auto', padding: '5px' }}>

                {!loading ?
                    fetched && !data.length ?
                        <p className='text-danger'>
                            No Students Found!
                        </p>
                        : <table style={{ position: 'relative' }}>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    data.map((item) =>

                                        <tr key={item.SID} onDoubleClick={e =>
                                            redirect_to_student_setup(item.AcademyId, item.ScreenName)}>
                                            <td data-src={null}>
                                                <div className="dropdown">
                                                    <button style={{ background: '#f6f6f6', border: 'none', outline: 'none', color: '#000' }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1 status-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                        {item.Status}
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li style={{ width: '100%' }}><div data-status='pending'
                                                            onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)}
                                                            style={{ width: '100%' }} className="dropdown-item" >Pending</div></li>
                                                        <li style={{ width: '100%' }}><div data-status='active' onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)} style={{ width: '100%' }} className="dropdown-item">Active</div></li>
                                                        <li style={{ width: '100%' }}><div data-status='suspended' onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)} style={{ width: '100%' }} className="dropdown-item">Suspended</div></li>
                                                    </ul>
                                                </div>
                                            </td>

                                            <td data-src={null}>
                                                <img src={item.Photo} alt="profile=pic" style={{ height: '80px', width: '100px' }} />
                                            </td>
                                            <td data-src={item.AcademyId}>{item.AcademyId}</td>
                                            <td data-src={item.FirstName + ' ' + item.LastName}>{item.FirstName + ' ' + item.LastName}</td>
                                            <td data-src={item.Email}>{item.Email}</td>
                                            <td data-src={item.Cell}>{item.Cell}</td>
                                            <td data-src={item.GMT}>{convertGMTOffsetToLocalString(item.GMT)}</td>
                                            <td data-src={item.ResponseHrs}>{item.ResponseHrs}</td>
                                            <td data-src={null}>{null}</td>
                                            <td data-src={null}>{null}</td>
                                            <td data-src={item.IdVerified}>{item.IdVerified}</td>
                                            <td data-src={item.BackgroundVerified}>{item.BackgroundVerified}</td>

                                        </tr>
                                    )
                                }


                            </tbody>
                        </table>
                    :
                    <Loading />
                }
            </div>
        </>
    );
}

export default StudentTable;