import moment from 'moment-timezone'
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import { capitalizeFirstLetter } from '../../helperFunctions/generalHelperFunctions';
import { IoWarning } from 'react-icons/io5';
import { FaCheckCircle } from "react-icons/fa";


function calcTime() {
    let utcDateTime = moment().utc()
    const localTime = utcDateTime.local().format('dddd, MMMM D, HH:mm:ss');
    return localTime;
}

const StudentProfileCnt = () => {
    const { student } = useSelector(state => state.student)
    console.log(student.ParentAName, student)

    return (
        <div className='d-flex flex-column container justify-content-center align-items-center' style={{ gap: "20px" }}>
            <div className='m-2'><b className='small'>{calcTime()}</b></div>
            <div className='d-flex'>
                <Avatar avatarSrc={student.Photo} size='200px' positionInPixle='20px' online={student.Online} indicSize='20px' />
            </div>

            <div className='d-flex' style={{ width: "700px", gap: "2%" }}>
                <div className='d-flex flex-column w-50' style={{ gap: "10px", width: "345px" }}>
                    <div className="d-flex">
                        <label style={{ width: "200px" }}>Screen Name</label>
                        <input className="form-control" disabled defaultValue={student.ScreenName} type='text'></input>
                    </div>
                    <div className='d-flex'>
                        <label style={{ width: "200px" }}>Grade</label>
                        <input className="form-control" disabled defaultValue={student.Grade} type='text'></input>
                    </div>
                    <div className='d-flex'>
                        <label style={{ width: "200px" }}>Country</label>
                        <input className="form-control" disabled defaultValue={student.Country} type='text'></input>
                    </div>
                </div>

                <div className='d-flex flex-column' style={{ gap: "10px", width: "345px" }}>
                    <div className='d-flex'>
                        <label style={{ width: "200px" }}>Time Zone GMT</label>
                        <input className="form-control" disabled
                            defaultValue={student.GMT} type='text'></input>
                    </div>
                    {student.ParentAName && <div className='d-flex'>
                        <label style={{ width: "200px" }}>Parent Name</label>
                        <input className="form-control" disabled defaultValue={student.ParentAName?.split(' ')[0]?.length ? capitalizeFirstLetter(student.ParentAName.split(' ')[0]) : student.ParentAName} type='text'></input>
                    </div>}
                </div>
            </div>
            <div style={{ width: "700px" }} >
                {student.ParentConsent === 'true' ?
                    <div className='alert alert-success d-flex'><FaCheckCircle size={20} color={'green'}
                        className='m-1' />
                        <h6 className='m-1'>
                            Parent Has Given Consent Of Video recording
                        </h6>
                    </div> :
                    <div className='alert alert-warning d-flex'> <IoWarning size={20} className='m-1 text-warning' />
                        <h6 className='m-1'>
                            Parent did not give consent of video recording
                        </h6>
                    </div>
                }
            </div>
        </div>
    );
}

export default StudentProfileCnt;