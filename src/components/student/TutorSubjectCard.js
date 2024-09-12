import React from 'react';
import { FaDollarSign, FaGlobe, FaClock, FaCheckCircle } from 'react-icons/fa';
import Avatar from '../common/Avatar';
import BTN_ICON from "../../assets/images/button__icon.png";
import Pill from '../common/Pill';
import { showDate } from '../../utils/moment';
import moment from 'moment'
import { wholeDateFormat } from '../../constants/constants';
import { MdCancel } from 'react-icons/md';
import { useSelector } from 'react-redux';

const TutorCard = ({ tutor, handleNavigateToFeedback, redirect_to_tutor_profile, handleNavigateToSchedule }) => {
    const {
        Photo,
        rate,
        grades,
        TutorScreenname,
        Country,
        GMT,
        ResponseHrs,
        CancellationPolicy,
        IntroSessionDiscount
    } = tutor;
    const { student } = useSelector(state => state.student);

    function convertGMTToLocalTime(gmtOffset) {
        if (gmtOffset) {

            const match = gmtOffset.match(/^([+-]\d{2})(?::(\d{2}))?$/);
            if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = match[2] ? parseInt(match[2], 10) : 0;

                const offset = hours * 60 + minutes;

                const timezones = moment.tz
                    .names()
                    .filter((name) => moment.tz(name).utcOffset() === offset);
                return moment().tz(timezones[0])
            }
        }
    }


    const calculateTimeDifference = (tutorGMT) => {
        try {
            if (tutorGMT && student.GMT) {
                const studentOffset = parseInt(student.GMT, 10);
                const tutorOffset = parseInt(tutorGMT, 10);

                const difference = studentOffset - tutorOffset;
                return difference;
            }
            else return '-'
        } catch (error) {
            console.log("Invalid GMT offset format");
        }
    };

    const classByDifference = (difference) => {
        if (typeof (difference) !== 'number') return ''
        if (difference >= -3 && difference <= 3) {
            return "text-bg-success";
        } else if (difference >= -6 && difference <= 6) {
            return "text-bg-warning";
        } else {
            return "text-bg-danger blinking-frame-red";
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            {/* Row with avatar on left and rate, country, GMT on right */}
            <div className="d-flex justify-content-start align-items-center mb-3">
                <div>
                    <Avatar avatarSrc={Photo} size='80' showOnlineStatus={false} />
                </div>

                <div className="text-end">
                    <div className="d-flex align-items-center justify-content-start">
                        <span>{rate}/hr</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-start mt-1">
                        <p className=' ' style={{ color: "#7d7d7d", fontWeight: "500" }}>{Country}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-start mt-1" >
                        <FaClock className="me-2" color="#7d7d7d" />
                        <p className='' style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: "500", overflow: "hidden", color: "#7d7d7d" }}>{showDate(
                            convertGMTToLocalTime(tutor?.GMT),
                            wholeDateFormat
                        )}</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 d-flex flex-column justify-content-between">

                <div className='d-flex justify-content-between'>
                    <h5 className="card-title text-start" style={{ fontSize: '1.2rem' }}>
                        {TutorScreenname}
                    </h5>

                    {tutor.CodeApplied && (
                        <div
                            className="blinking-button"
                            style={{ color: "black" }}
                        >
                            <span
                                className='badge' style={{ background: "limegreen" }}
                            >
                                connected
                            </span>
                        </div>
                    )}
                </div>
                <div>

                    <div className="mb-2">
                        {JSON.parse(grades).map((grade, index) => (
                            <span key={index} className="badge bg-success me-1">
                                {grade}
                            </span>
                        ))}
                    </div>

                    {/* Rows for each detail */}
                    <div className="">
                        {/* Row for Response Time */}
                        <div className="row py-2 w-100" style={{ backgroundColor: '#e9ecef' }}>
                            <div className="col-6 text-start"><strong style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", overflow: "hidden" }}>Response Time:</strong></div>
                            <div className="col-6 text-end">{ResponseHrs} hrs</div>
                        </div>

                        {/* Row for Cancellation Policy */}
                        <div className="row py-2 w-100" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="col-6 text-start"><strong style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", overflow: "hidden" }}>Cancellation Policy:</strong></div>
                            <div className="col-6 text-end">{CancellationPolicy ? `${CancellationPolicy} hrs` : 'N/A'}</div>
                        </div>

                        {/* Row for Discount */}
                        <div className="row py-2 w-100" style={{ backgroundColor: '#e9ecef' }}>
                            <div className="col-6 text-start"><strong style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", overflow: "hidden" }}>Intro Discount:</strong></div>
                            <div className="col-6 text-end">{!IntroSessionDiscount ? <FaCheckCircle color='green' /> : <MdCancel color="red" />}</div>
                        </div>
                        <div className="row py-2 w-100" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="col-6 text-start">
                                <strong style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", overflow: "hidden" }}>
                                    Time Diff:</strong></div>

                            <div className='col-6  d-flex justify-content-end '>

                                <div
                                    className={`d-inline rounded px-1 d-flex justify-content-center align-items-center ${classByDifference(
                                        calculateTimeDifference(tutor?.GMT)
                                    )}`}
                                    style={{ fontSize: "14px", width: "20px", height: "20px" }}
                                > {calculateTimeDifference(tutor?.GMT) > 0
                                    ? `+${calculateTimeDifference(tutor?.GMT)}`
                                    : calculateTimeDifference(tutor?.GMT)}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="d-flex justify-content-around mt-3">
                    <button
                        className="action-btn-square"
                        onClick={() => handleNavigateToSchedule(tutor)}
                    >
                        <div className="button__content">
                            <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div>
                            <div className="button__text text-sm">Book Lesson</div>
                        </div>
                    </button>
                    <button
                        className="action-btn-square"
                        onClick={() => handleNavigateToFeedback(tutor.AcademyId)}
                    >
                        <div className="button__content">
                            <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div>
                            <div className="button__text">Feedbacks</div>
                        </div>
                    </button>
                    <button
                        className="action-btn-square"
                        onClick={() => redirect_to_tutor_profile(tutor?.AcademyId)}
                    >
                        <div className="button__content">
                            <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div>
                            <div className="button__text">View Profile</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorCard;
