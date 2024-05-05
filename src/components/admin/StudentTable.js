import { useEffect, useState } from 'react';
import { get_student_data } from '../../axios/admin';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions'
import Loading from '../common/Loading'
import { statesColours } from '../../constants/constants';

const StudentTable = () => {

    let [data, set_data] = useState([]);
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)
    const [status, setStatus]=useState('pending')
    console.log(data)
    const [statusCount, setStatusCount]=useState([])
    const COLUMNS = [

        {
            Header: 'Status',
            accessor: 'Status',
        },
        {
            Header: 'Photo',
            accessor: 'Photo',
        },
        {
            Header: 'Screen ID',
            accessor: 'Screen ID',
        },
        {
            Header: 'Student Name',
            accessor: 'Student Name',
        },
        {
            Header: 'Email',
            accessor: 'Email',
        },
        {
            Header: 'Phone',
            accessor: 'Phone',
        },
        {
            Header: 'GMT',
            accessor: 'GMT',
        },
        {
            Header: 'Tot. Hours',
            accessor: 'Tot. Hours',
        },
        {
            Header: 'Tot. $ Paid',
            accessor: 'Tot. $ Paid',
        },
        {
            Header: 'Last Active',
            accessor: 'Last Active',
        },
        {
            Header: 'ID Verified',
            accessor: 'ID Verified',
        },

    ];
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
            <div className="tables" style={{ width: '100%', overflowY: 'auto', height: "90vh", padding: '5px' }}>
                <div className="d-flex justify-content-center mt-4">
                    <div
                        onClick={() => setStatus("pending")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["pending"].color,
                            background: statesColours["pending"].bg,
                            border: status === "pending" ? "2px solid #268daf" : "none",
                        }}
                    >
                        Pending{" "}
                        {statusCount.find((rec) => rec.Status === "pending")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "pending")?.count}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={() => setStatus("under-review")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["under-review"].color,
                            background: statesColours["under-review"].bg,
                            border: status === "under-review" ? "2px solid #268daf" : "none",
                        }}
                    >
                        under-review{" "}
                        {statusCount.find((rec) => rec.Status === "under-review")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "under-review")?.count}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={() => setStatus("active")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["active"].color,
                            background: statesColours["active"].bg,
                            border: status === "active" ? "2px solid #268daf" : "none",
                        }}
                    >
                        active{" "}
                        {statusCount.find((rec) => rec.Status === "active")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center d-flex justify-content-center align-items-center"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "active")?.count}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={() => setStatus("suspended")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["suspended"].color,
                            background: statesColours["suspended"].bg,
                            border: status === "suspended" ? "2px solid #268daf" : "none",
                        }}
                    >
                        suspended{" "}
                        {statusCount.find((rec) => rec.Status === "suspended")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "suspended")?.count}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={() => setStatus("disapproved")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["disapproved"].color,
                            background: statesColours["disapproved"].bg,
                            border: status === "disapproved" ? "2px solid #268daf" : "none",
                        }}
                    >
                        disapproved{" "}
                        {statusCount.find((rec) => rec.Status === "disapproved")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center border"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "disapproved")?.count}
                            </span>
                        )}
                    </div>
                    <div
                        onClick={() => setStatus("closed")}
                        className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
                        style={{
                            color: statesColours["closed"].color,
                            background: statesColours["closed"].bg,
                            border: status === "closed" ? "2px solid #268daf" : "none",
                        }}
                    >
                        closed{" "}
                        {statusCount.find((rec) => rec.Status === "closed")?.count && (
                            <span
                                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                                style={{
                                    width: "20px",
                                    fontSize: "12px",
                                    height: "20px",
                                    marginLeft: "8px",
                                }}
                            >
                                {statusCount.find((rec) => rec.Status === "closed")?.count}
                            </span>
                        )}
                    </div>
                </div>
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
                                            <td ></td>
                                            <td ></td>
                                            <td data-src={item.IdVerified}>{item.IdVerified}</td>
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