import React from 'react'
import CenteredModal from '../common/Modal'
import ReactDatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { moment } from '../../config/moment'
import { FaCalendar } from 'react-icons/fa';
import TAButton from '../common/TAButton'
import { toast } from 'react-toastify';
import { updateTutorSetup } from '../../axios/tutor';
import { setTutor } from '../../redux/tutor/tutorData';

const VacationSettingModal = ({ isOpen, handleClose, start, end, editMode, setStart, setEnd, timeZone }) => {
    const { tutor } = useSelector(state => state.tutor);
    const dispatch = useDispatch();

    const saveVacations = async () => {
        if (!start || !end) {
            toast.error('Start and end date are required.');
            return;
        }

        const res = await updateTutorSetup(tutor.AcademyId, { StartVacation: start, EndVacation: end })
        if (res?.message === 'updated!') {
            toast.success(res?.message)
            dispatch(setTutor({ ...tutor, StartVacation: start, EndVacation: end }));
        }
    }

    const gmtInInt = timeZone ? parseInt(timeZone) : 0;
    // for reactdatepicker because it opertae on new Date() not on moment.
    // getting getLocalGMT and then multiple it with -1 to add (-5:00) or subtract (+5:00)
    const getLocalGMT =
        parseInt(
            ((offset) =>
                (offset < 0 ? "+" : "-") +
                ("00" + Math.abs((offset / 60) | 0)).slice(-2) +
                ":" +
                ("00" + Math.abs(offset % 60)).slice(-2))(
                    new Date().getTimezoneOffset()
                )
        ) * -1;


    return (
        <CenteredModal show={isOpen} handleClose={handleClose} style={{ minHeight: "250px" }} title="Vacations Setting">
            <div>
                <h6 className="text-start">Enter Start and end Date</h6>
                <div
                    className="d-flex align-items-center"
                    style={{ gap: "10px" }}
                >

                    <div className='d-flex m-0'>
                        <FaCalendar className='border p-1' size={34} />
                        <ReactDatePicker
                            disabled={!editMode}
                            selected={
                                new Date(
                                    start
                                        ? start
                                        : moment(new Date()).toDate().getTime() +
                                        (gmtInInt + getLocalGMT) * 60 * 60 * 1000
                                )
                            }
                            onChange={(date) => {
                                date.setHours(0);
                                date.setMinutes(0);
                                date.setSeconds(0);
                                const originalMoment = moment
                                    .tz(date, tutor.timeZone)
                                    .startOf("day");
                                const utcMomentStartDate = originalMoment.clone();
                                // utcMomentStartDate.utc()
                                // console.log(originalMoment.get('hour'), utcMomentStartDate.get('hour'), originalMoment.get('date'), date.getDate(), date.getHours())
                                setStart(utcMomentStartDate);
                            }}
                            minDate={new Date()}
                            dateFormat="MMM d, yyyy"
                            className="form-control m-0"
                        />
                    </div>

                    <h6 className="m-0">and</h6>
                    <div className='d-flex m-0'>
                        <FaCalendar className='border p-1' size={34} />

                        <ReactDatePicker
                            disabled={!editMode}
                            minDate={new Date(start)}
                            selected={moment(end ? end : new Date()).toDate()}
                            onChange={(date) => {
                                date.setHours(0);
                                date.setMinutes(0);
                                date.setSeconds(0);
                                const originalMoment = moment(date).endOf("day").utc();
                                setEnd(originalMoment.toISOString());
                            }}
                            dateFormat="MMM d, yyyy"
                            className="form-control m-0"
                        />
                    </div>
                </div>
                <div className='divider d-flex justify-content-between'>
                    <TAButton buttonText={"Cancel"} handleClick={()=>handleClose()} />
                    <TAButton buttonText="Save Dates" style={{width:"150px"}} handleClick={() => {
                        // toast.info("Please Save the Tab to Save Vacation Settings!");
                        saveVacations()
                        handleClose();
                    }} />
                </div>
            </div>

        </CenteredModal>
    )
}

export default VacationSettingModal