import { useEffect, useState } from 'react';
import { get_tutor_data, set_tutor_status } from '../../axios/admin';
import { COLUMNS } from '../../Tables/Admin/column';
import 'react-loading-skeleton/dist/skeleton.css'
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import Loading from '../common/Loading';
import ToolTip from '../common/ToolTip'
import Pill from '../common/Pill';
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { toast } from 'react-toastify'
import { statesColours } from '../../constants/constants';

const TutorTable = () => {
    let [data, set_data] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false)

    useEffect(() => {
        get_tutor_data()
            .then((result) => {
                if (!result?.response?.data) {
                    set_data(result);
                    setFetching(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    let handleStatusChange = async (id, status, currentStatus) => {

        if (currentStatus === 'pending')
            return toast.warning('You can only change  Status of "Under-Review" Tutors!')
        if (currentStatus === status) return toast.warning(`You already on "${status}" Status`)
        setUpdatingStatus(true)
        let response = await set_tutor_status(id, status)

        if (response.bool) {
            const result = await get_tutor_data()
            if (!result?.response?.data) {
                set_data(result)
                setUpdatingStatus(false)
            }
        } else {
            toast.error(response.mssg)
            setUpdatingStatus(false)
        }
    }

    let redirect_to_tutor_setup = (tutor_user_id, screenName) => {
        window.localStorage.setItem('tutor_user_id', tutor_user_id);
        window.localStorage.setItem('tutor_screen_name', screenName)
        window.localStorage.setItem('user_role', 'admin');
        window.open(`${process.env.REACT_APP_BASE_URL}/tutor/setup`, "_blank")
    }

    if (fetching || updatingStatus)
        return <Loading />
    return (
        <div className="tables" style={{ height: '90vh', width: '100%', overflowX: 'hidden', overflowY: 'auto', padding: '5px' }}>
            {
                data.length > 0 ? <table style={{ position: 'relative' }}>
                    <thead >
                        <tr>
                            {COLUMNS.map(item => <th key={item.Header}>
                                {item.Header}
                            </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) =>
                            <tr key={item.SID}>
                                <td data-src={null} className='col-1'>
                                    <div className="col-10 m-auto">
                                        <Pill customColor={true} label={item.Status} fontColor={statesColours[item.Status].color} color={statesColours[item.Status].bg} hasIcon={false} />
                                    </div>
                                </td>

                                <td data-src={null} className='col-1' onDoubleClick={() => {
                                    // item.Status === PROFILE_STATUS.CLOSED ?
                                    //     toast.warning('You cannot view Closed tutor Profile!') :
                                    redirect_to_tutor_setup(item.AcademyId, item.TutorScreenname)
                                }}>
                                    <img src={item.Photo} alt="profile=pic"
                                        style={{ height: '80px', width: '100px' }} />
                                </td>
                                <td data-src={item.TutorScreenname}>{item.TutorScreenname}</td>
                                <td data-src={item.FirstName + ' ' + item.LastName}>{item.FirstName + ' ' + item.LastName}</td>
                                <td data-src={item.Email}>{item.Email}</td>
                                <td data-src={item.CellPhone} className='col-1'>{item.CellPhone}</td>
                                <td data-src={item.GMT} className='col-1'>{convertGMTOffsetToLocalString(item.GMT)}</td>
                                <td data-src={item.ResponseHrs}>{item.ResponseHrs}</td>
                                <td data-src={null}>{null}</td>
                                <td data-src={null}>{null}</td>
                                <td data-src={item.IdVerified}>{item.IdVerified}</td>
                                <td data-src={item.BackgroundVerified}>{item.BackgroundVerified}</td>
                                <td>
                                    <div>
                                        <ToolTip text="Mark Inactive">
                                            <FcDisapprove size={40} style={{ cursor: "pointer" }}
                                                onClick={() => handleStatusChange(item.AcademyId, 'disapproved', item.Status)} />
                                        </ToolTip>
                                        <ToolTip text="Mark Active" direction='bottomleft'>
                                            <FcApprove size={40} style={{ cursor: "pointer" }}

                                                onClick={() => handleStatusChange(item.AcademyId, 'active', item.Status)} />

                                        </ToolTip>
                                    </div>
                                </td>

                            </tr>
                        )}
                    </tbody>
                </table> : <div className='text-danger'> No record Found!</div>
            }
        </div>
    );
}

export default TutorTable;