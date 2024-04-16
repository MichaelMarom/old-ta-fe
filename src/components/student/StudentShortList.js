import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTutor } from '../../redux/student_store/selectedTutor';
import Loading from '../common/Loading';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { wholeDateFormat } from '../../constants/constants';
import Avatar from '../common/Avatar';
import Tooltip from '../common/ToolTip';
import Actions from '../common/Actions';
import BTN_ICON from '../../assets/images/button__icon.png'

import Pill from '../common/Pill'
import { useEffect, useState } from 'react';


const StudentShortList = () => {
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const { shortlist: response, isLoading: shortlistLoading } = useSelector(state => state.shortlist)
    const { student } = useSelector(state => state.student)
    const [sortedResponse, setSortedResponse] = useState([])
    const handleNavigateToSchedule = async (item) => {
        dispatch(setTutor({
            id: item.SID[0],
            academyId: item.AcademyId[0],
            GMT: item.GMT,
            firstName: item.FirstName,
            lastName: item.LastName,
            subject: item.Subject,
            rate: item.Rate,
            disableColor: item.disableColor,
            introDiscountEnabled: item.IntroSessionDiscount || false,
            activateSubscriptionOption: item.ActivateSubscriptionOption === "true",
            discountHours: item.DiscountHours,
            StartVacation: item.StartVacation,
            EndVacation: item.EndVacation,
            VacationMode: item.VacationMode,
        }))
        navigate('/student/booking')
    }
    const handleNavigateToFeedback = (id) => navigate(`/student/tutor/feedback/${id}`)

    function convertGMTToLocalTime(gmtOffset) {
        const utcTime = new Date();
        const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
        return localTime;
    }

    let multi_student_cols = [
        { Header: 'Photo', width: "6%", },
        {
            Header: 'VacationMode',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="vacation permitted to book further lessons with the tutor." />
        },
        {
            Header: 'Vacations',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="date" />
        },
        {
            Header: 'Demo Lesson @50%',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="The student must conduct an introduction lesson with tutor. Most 
                Tutors motivate students by offering the 'Intro' lesson at half price. 
                The discounted 'Intro' marked by a green check box icon. 
                After the 'intro' lesson performed, the student being requested to provide
                 feedback before permitted to book further lessons with the tutor."  />
        },
        { Header: 'Subject', width: "6%", },
        { Header: 'Tutor Name', width: "6%", },
        { Header: 'Country', width: "6%", },
        {
            Header: 'Tutor Local Time (UTC).',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="The time shown is the local time (UTC) at the tutor's location." />
        },
        {
            Header: "Be Aware Time Zone Diff",
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="The numbers below calculate the difference between your time zone and the tutor. When difference is between +/-3 to 6 Hours, we provide orange background. And if is 7 time zones or more, we show blinking red background. When you book your lesson on the tutor's calendar, it will be shown on your calendar adjusted to your local time (UTC). " />
        },
        {
            Header: 'View Tutor Schedule',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomright'
                text="Its cancellation time, if you delet your booked session before that, then you will be refunded ful amount" />
        },
        {
            Header: 'Consult Students FeedBack',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="To view tutor's feedback as graded by other students, click the button below." />
        },
        {
            Header: 'Examine Tutor Profile',
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="To view the full tutor's profile, include introduction video, education credentials, verifications, work experience, and more, Click on the button below." />
        },
        { Header: 'Rate', width: "6%", },
        {
            Header: 'Cancellation Policy',
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="Number of hours the tutor allows you to cancell the booked lesson without penalty. if you cancel less than the indicated hours, you liable for the lesson amount. Otherwise you will receive refund." />
        },
        {
            Header: 'Tutor Response Time',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="This is the time the tutor committed to response to you address him/her. Please take notice that this committment is in effect during tutor's local time (UTC) business hours. " />
        }

    ]
    useEffect(() => {
        if (response.length > 0) {
          // Create a new array with the sorted data
          const sortedArray = [...response].sort((a, b) => {
            if (a.CodeApplied && !b.CodeApplied) return -1;
            if (!a.CodeApplied && b.CodeApplied) return 1;
            return 0;
          });
          setSortedResponse(sortedArray);
        }
      }, [response]);
      
    let redirect_to_tutor_profile = (id) => {
        navigate(`/student/tutor-profile/${id}`)
    }

    const calculateTimeDifference = (tutorGMT) => {
        try {
            const studentOffset = parseInt(student.GMT, 10);
            const tutorOffset = parseInt(tutorGMT, 10);

            const difference = studentOffset - tutorOffset;
            return difference
        } catch (error) {
            console.log('Invalid GMT offset format');
        }
    };

    const classByDifference = (difference) => {
        if (difference >= -3 && difference <= 3) {
            return 'text-bg-success';
        } else if (difference >= -6 && difference <= 6) {
            return 'text-bg-warning';
        } else {
            return 'text-bg-danger blinking-frame-red';
        }
    }

    if (shortlistLoading) return <Loading />
    return (
        <>
            <div className="form-into-prompt shadow-sm " style={{ padding: '20px', height: "94vh" }}>
                <div className='d-flex rounded justify-content-between
                         align-items-center
                         p-2' style={{ color: "white", background: "#2471A3" }}>
                    {multi_student_cols.map(item =>

                        <div className='text-center d-flex flex-column'
                            style={{ width: item.width }}>
                            <p className='m-0' key={item.Header} > {item.Header}</p>
                            <div style={{ float: "right" }}>
                                {item.tooltip}
                            </div>
                        </div>
                    )}
                </div>
                <div className="tables" style={{ height: '53vh', width: '100%', overflowY: "auto" }}>
                    <table>
                        {sortedResponse.length ?
                            <thead className='d-none'>
                                <tr>
                                    {multi_student_cols.map(item =>
                                        <th key={item.Header} className=''>{item.Header}{item.tooltip}</th>
                                    )}
                                </tr>
                            </thead> : null}
                        <tbody>
                            {
                                sortedResponse.length > 0
                                    ?
                                    sortedResponse.map((item, index) => {
                                        const rate = item.rate;
                                        return (
                                            <tr key={index}>
                                                <td style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                    <div className='d-flex flex-column' >
                                                        <Avatar
                                                            size='100'
                                                            indicSize='20px'
                                                            avatarSrc={item?.Photo}
                                                            online={item.Online}
                                                        />
                                                        {item.CodeApplied &&
                                                            <div className="blinking-button" style={{ color: "black" }}>
                                                                <Pill fontColor='black' label={'connected'} customColor color='limegreen' editable={false} hasIcon={false} />
                                                            </div>
                                                        }
                                                    </div>
                                                </td>
                                                <td className='m-auto' style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                    <div className="form-check form-switch d-flex gap-3 justify-content-center" style={{ fontSize: "16px " }}>
                                                        <input
                                                            className="form-check-input "
                                                            type="checkbox"
                                                            role="switch"
                                                            style={{
                                                                width: "30px",
                                                                height: "15px"
                                                            }}
                                                            checked={item.VacationMode}
                                                        />

                                                    </div>
                                                </td>
                                                <td style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                    {item.VacationMode ?
                                                        `${showDate(item.StartVacation)} - ${showDate(item.EndVacation)}`
                                                        : `-`
                                                    }  </td>
                                                <td style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                    <input type='checkbox'
                                                        style={{ height: '20px', width: '20px' }}
                                                        checked={item?.IntroSessionDiscount || false}
                                                    />
                                                </td>
                                                <td style={{ width: multi_student_cols[1].width, border: '1px solid lightgray' }} className=''>
                                                    {item?.Subject}
                                                </td>
                                                <td style={{ width: multi_student_cols[2].width, border: '1px solid lightgray' }} className=''>
                                                    {convertTutorIdToName(item?.AcademyId[0])}
                                                </td>
                                                <td style={{ width: multi_student_cols[3].width, border: '1px solid lightgray' }}>
                                                    {item?.Country}
                                                </td>
                                                <td style={{ width: multi_student_cols[4].width, border: '1px solid lightgray' }} className='text-center'>
                                                    {showDate(convertGMTToLocalTime(item?.GMT), wholeDateFormat)} <br />
                                                </td>
                                                <td style={{ width: multi_student_cols[5].width, border: '1px solid lightgray' }} className=''>
                                                    <div className={`d-inline card px-1 m-auto ${classByDifference(calculateTimeDifference(item?.GMT))}`}
                                                        style={{ fontSize: "18px" }}
                                                    >
                                                        {calculateTimeDifference(item?.GMT) > 0 ?
                                                            `+${calculateTimeDifference(item?.GMT)}` :
                                                            calculateTimeDifference(item?.GMT)}
                                                    </div>
                                                </td>
                                                <td style={{ width: multi_student_cols[6].width, border: '1px solid lightgray' }}>
                                                    <button className='action-btn-square'
                                                        onClick={() => handleNavigateToSchedule(item)}>
                                                        <div className='button__content'>
                                                            <div className='button__icon'>
                                                                <img src={BTN_ICON} alt={"btn__icon"} />
                                                            </div>
                                                            <div className='button__text  text-sm'>Book Lesson</div>
                                                        </div>
                                                    </button>
                                                </td>
                                                <td style={{ width: multi_student_cols[7].width, border: '1px solid lightgray' }} >
                                                    <button className='action-btn-square'
                                                        onClick={() => handleNavigateToFeedback(item.AcademyId[0])}>
                                                        <div className='button__content'>
                                                            <div className='button__icon'>
                                                                <img src={BTN_ICON} alt={"btn__icon"} />
                                                            </div>
                                                            <div className='button__text'> Feedbacks</div>
                                                        </div></button>
                                                </td>
                                                <td style={{ width: multi_student_cols[8].width, border: '1px solid lightgray' }}>
                                                    <button className='action-btn-square'
                                                        onClick={() => redirect_to_tutor_profile(item?.AcademyId[0])}>
                                                        <div className='button__content'>
                                                            <div className='button__icon'>
                                                                <img src={BTN_ICON} alt={"btn__icon"} />
                                                            </div>
                                                            <div className='button__text'> View Profile</div>
                                                        </div>
                                                    </button>
                                                </td>
                                                <td style={{ width: multi_student_cols[9].width, border: '1px solid lightgray' }}>{rate}</td>
                                                <td style={{ width: multi_student_cols[10].width, border: '1px solid lightgray' }}>
                                                    {item.CancellationPolicy} Hrs
                                                </td>

                                                <td style={{ width: multi_student_cols[11].width, border: '1px solid lightgray' }}>
                                                    {item.ResponseHrs.replace("Hours", "Hrs")}
                                                </td>

                                            </tr>
                                        )
                                    }) :
                                    null
                            }

                        </tbody>
                    </table>

                </div>
            </div>
            <Actions saveDisabled="true" />
        </>
    );
}

export default StudentShortList;