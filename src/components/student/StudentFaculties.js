import { useEffect, useState } from "react";
import { getTutorsAccordingToSubjectandFaculty } from "../../axios/student";
import { get_faculty, get_faculty_subject } from "../../axios/tutor";

import Actions from "../common/Actions";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "../common/ToolTip";
import Pill from "../common/Pill";
import { wholeDateFormat } from "../../constants/constants";
import SubMenu from "../common/SubMenu";
import Loading from "../common/Loading";
import { convertTutorIdToName } from "../../utils/common";
import Avatar from "../common/Avatar";
import { showDate } from "../../utils/moment";
import { useNavigate } from "react-router-dom";
import { setTutor } from "../../redux/student/selectedTutor";
import BTN_ICON from "../../assets/images/button__icon.png";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaCandyCane, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const StudentFaculties = () => {
  const dispatch = useDispatch();
  const [subjects, setSubjects] = useState([]);

  const { student } = useSelector((state) => state.student);
  const [faculties, set_faculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [tutorsWithRates, setTutorWithRates] = useState([]);
  const [fetchingTutorsRate, setFetchingTutorsRate] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToSchedule = async (item) => {
    dispatch(
      setTutor({
        id: item.SID,
        photo: item.Photo,
        academyId: item.AcademyId,
        GMT: item.GMT,
        firstName: item.FirstName,
        lastName: item.LastName,
        subject: selectedSubject.SubjectName,
        rate: item.rate,
        disableColor: item.disableColor,
        introDiscountEnabled: item.IntroSessionDiscount || false,
        activateSubscriptionOption: item.ActivateSubscriptionOption === "true",
        discountHours: item.DiscountHours,
        StartVacation: item.StartVacation,
        EndVacation: item.EndVacation,
        VacationMode: item.VacationMode,
      })
    );
    navigate("/student/booking");
  };
  const handleNavigateToFeedback = (id) =>
    navigate(`/student/tutor/feedback/${id}`);

  function convertGMTToLocalTime(gmtOffset) {
    const utcTime = new Date();
    const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
    return localTime;
  }

  useEffect(() => {
    setSelectedSubject({});
    if (selectedFaculty) {
      get_faculty_subject(selectedFaculty).then((result) => {
        if (!result?.response?.data) setSubjects(result);
      });
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedSubject.Id && selectedFaculty && student.AcademyId) {
      setFetchingTutorsRate(true);
      //   setTimeout(() => {
      //     setFetchingTutorsRate(false);
      //   }, 4000);

      getTutorsAccordingToSubjectandFaculty(
        selectedSubject.SubjectName,
        selectedFaculty,
        student.AcademyId
      ).then((result) => {
        if (result) {
          !result?.response?.data && setTutorWithRates(result);
          setFetchingTutorsRate(false);
        }
      });
    }
  }, [selectedSubject, selectedFaculty, student]);
  console.log(tutorsWithRates);

  useEffect(() => {
    !selectedSubject.Id && setTutorWithRates([]);
  }, [selectedSubject]);

  let multi_student_cols = [
    { Header: "Photo", width: "7.69%" },
    { Header: "Rate", width: "7.69%" },
    { Header: "Grades", width: "7.69%" },

    {
      Header: "Demo @50%",
      width: "7.69%",
      tooltip: (
        <Tooltip
          color="white"
          width="200px"
          direction="bottomright"
          text="The student must conduct an introduction lesson with tutor. Most 
                Tutors motivate students by offering the 'Intro' lesson at half price. 
                The discounted 'Intro' marked by a green check box icon. 
                After the 'intro' lesson performed, the student being requested to provide
                 feedback before permitted to book further lessons with the tutor."
        />
      ),
    },
    { Header: "Name", width: "7.69%" },
    { Header: "Country", width: "7.69%" },
    {
      Header: "Tutor time",
      width: "7.69%",
      tooltip: (
        <Tooltip
          width="200px"
          color="white"
          direction="bottomleft"
          text="The time shown is the local time (UTC) at the tutor's location."
        />
      ),
    },
    {
      Header: "Time Diff",
      width: "7.69%",
      tooltip: (
        <Tooltip
          color="white"
          direction="bottomleft"
          width="200px"
          text="The numbers below calculate the difference between your time zone and the tutor. When difference is between +/-3 to 6 Hours, we provide orange background. And if is 7 time zones or more, we show blinking red background. When you book your lesson on the tutor's calendar, it will be shown on your calendar adjusted to your local time (UTC). "
        />
      ),
    },
    {
      Header: "Tutor's Calendar",
      width: "7.69%",
      tooltip: (
        <Tooltip
          width="200px"
          color="white"
          direction="bottomright"
          text="Its cancellation time, if you delet your booked session before that, then you will be refunded ful amount"
        />
      ),
    },
    {
      Header: "FeedBack",
      width: "7.69%",
      tooltip: (
        <Tooltip
          width="200px"
          color="white"
          direction="bottomleft"
          text="To view tutor's feedback as graded by other students, click the button below."
        />
      ),
    },
    {
      Header: "Profile",
      width: "7.69%",
      tooltip: (
        <Tooltip
          color="white"
          direction="bottomleft"
          width="200px"
          text="To view the full tutor's profile, include introduction video, education credentials, verifications, work experience, and more, Click on the button below."
        />
      ),
    },
    {
      Header: "Policy",
      width: "7.69%",
      tooltip: (
        <Tooltip
          color="white"
          direction="bottomleft"
          width="200px"
          text="Number of hours the tutor allows you to cancell the booked lesson without penalty. if you cancel less than the indicated hours, you liable for the lesson amount. Otherwise you will receive refund."
        />
      ),
    },
    {
      Header: "Response Time",
      width: "7.69%",
      tooltip: (
        <Tooltip
          width="200px"
          color="white"
          direction="bottomleft"
          text="This is the time the tutor committed to response to you address him/her. Please take notice that this committment is in effect during tutor's local time (UTC) business hours. "
        />
      ),
    },
  ];

  const getFacultiesOption = async () => {
    let list = await get_faculty();
    !list?.reposnse?.data && set_faculties(list);
  };
  useEffect(() => {
    getFacultiesOption();
  }, []);

  let redirect_to_tutor_profile = (id) => {
    navigate(`/student/tutor-profile/${id}`);
  };

  const calculateTimeDifference = (tutorGMT) => {
    try {
      const studentOffset = parseInt(student.GMT, 10);
      const tutorOffset = parseInt(tutorGMT, 10);

      const difference = studentOffset - tutorOffset;
      return difference;
    } catch (error) {
      console.log("Invalid GMT offset format");
    }
  };

  const classByDifference = (difference) => {
    if (difference >= -3 && difference <= 3) {
      return "text-bg-success";
    } else if (difference >= -6 && difference <= 6) {
      return "text-bg-warning";
    } else {
      return "text-bg-danger blinking-frame-red";
    }
  };

  return (
    <>
      <div className="tutor-popin"></div>
      <div className="save-overlay">
        <span className="save_loader"></span>
      </div>
      <div
        className="form-subjects"
        style={{ overflow: "hidden", height: "calc(100vh - 50px)" }}
      >
        <div id="form-subject-data-collection-table">
          <SubMenu
            faculty={faculties}
            selectedFaculty={selectedFaculty}
            setSelectedFaculty={setSelectedFaculty}
          />

          <div className="highlight m-0" style={{ width: "100%" }}>
            There are 41 faculties containing 600+ subjects to select from. From
            the sub menu above, select the faculty of interest. Then from the
            table below select the subject of interest. Your selected subject
            generates a coparison table of all tutors for that subject allow you
            to compare from the list. Then click on the BOOK LESSON button to
            view your preferred tutor's calendar.
          </div>

          <div
            className="d-flex  rounded justify-content-between
                         align-items-center
                         p-2"
            style={{ color: "white", background: "#2471A3" }}
          >
            {subjects.length} subjects. Select the subject of interest from the
            list bellow.
          </div>

          {selectedSubject.SubjectName && (
            <div className="d-flex align-items-center " style={{ gap: "30px" }}>
              <div
                className="d-flex align-items-center blinking-button"
                style={{ fontSize: "16px" }}
                onClick={() => setSelectedSubject({})}
              >
                <IoArrowBackCircleSharp size={30} className="" /> Back to
                Subjects
              </div>
              <p className="m-0" style={{ fontWeight: "bold" }}>
                {selectedSubject.SubjectName}
              </p>
            </div>
          )}

          <div>
            {!selectedSubject.SubjectName && (
              <div
                className="d-flex flex-wrap align-content-start"
                style={{ height: "55vh", overflowY: "auto" }}
              >
                {subjects.map((subj) => (
                  <div
                    key={subj.Id}
                    className="form-check col-3 border m-0 "
                    style={{ height: "45px" }}
                  >
                    <input
                      className="form-check-input border border-dark"
                      type="radio"
                      disabled={!subj.tutor_count}
                      name="options"
                      id="subject"
                      checked={selectedSubject.Id === subj.Id}
                      onChange={() =>
                        subj.tutor_count && setSelectedSubject(subj)
                      }
                    />
                    <label className="form-check-label" htmlFor="subject">
                      {subj.SubjectName}
                    </label>
                  </div>
                ))}
                <div style={{ height: "40px", marginTop: "20px" }}></div>
              </div>
            )}

            {selectedSubject.SubjectName && !fetchingTutorsRate ? (
              <>
                {tutorsWithRates.length ? (
                  <>
                    <div
                      className="d-flex rounded justify-content-between  align-items-center "
                      style={{ color: "white", background: "#2471A3" }}
                    >
                      {multi_student_cols.map((item) => (
                        <div
                          key={item.Header}
                          className="text-center d-flex flex-column"
                          style={{ width: item.width }}
                        >
                          <p className="m-0" key={item.Header}>
                            {item.Header}
                          </p>
                          <div style={{ float: "right" }}>{item.tooltip}</div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="tables"
                      style={{
                        height: "53vh",
                        width: "100%",
                        overflowY: "auto",
                      }}
                    >
                      <table>
                        <thead className="d-none"></thead>

                        <tbody>
                          {tutorsWithRates.map((item, index) => {
                            const rate = item.rate;
                            return (
                              <tr key={index}>
                                <td
                                  style={{
                                    width: multi_student_cols[0].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  <div className="d-flex flex-column">
                                    <Avatar
                                      size="50"
                                      avatarSrc={item?.Photo}
                                      online={item.Online}
                                      showOnlineStatus={false}
                                    />
                                    {item.CodeApplied && (
                                      <div
                                        className="blinking-button"
                                        style={{ color: "black" }}
                                      >
                                        <Pill
                                          fontColor="black"
                                          label={"connected"}
                                          customColor
                                          color="limegreen"
                                          editable={false}
                                          hasIcon={false}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[9].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  {rate}
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[11].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  <div
                                    style={{
                                      overflowY: "auto",
                                      height: "100%",
                                    }}
                                  >
                                    {JSON.parse(item.grades).map((grade) => (
                                      <Pill label={grade} key={grade} />
                                    ))}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[0].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  {item?.IntroSessionDiscount ? (
                                    <FaCheckCircle
                                      color="limegreen"
                                      size={20}
                                    />
                                  ) : (
                                    <MdCancel size={20} color="red" />
                                  )}
                                  {/* <input
                                    type="checkbox"
                                    style={{
                                      height: "20px",
                                      width: "20px",
                                      cursor: "pointer",
                                    }}
                                    defaultChecked={
                                      item?.IntroSessionDiscount || false
                                    }
                                  /> */}
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[2].width,
                                    border: "1px solid lightgray",
                                  }}
                                  className=""
                                >
                                  {convertTutorIdToName(item?.AcademyId)}
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[3].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  {item?.Country}
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[4].width,
                                    border: "1px solid lightgray",
                                  }}
                                  className="text-center"
                                >
                                  {showDate(
                                    convertGMTToLocalTime(item?.GMT),
                                    wholeDateFormat
                                  )}{" "}
                                  <br />
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[5].width,
                                    border: "1px solid lightgray",
                                  }}
                                  className=""
                                >
                                  <div
                                    className={`d-inline card px-1 m-auto ${classByDifference(
                                      calculateTimeDifference(item?.GMT)
                                    )}`}
                                    style={{ fontSize: "18px" }}
                                  >
                                    {calculateTimeDifference(item?.GMT) > 0
                                      ? `+${calculateTimeDifference(item?.GMT)}`
                                      : calculateTimeDifference(item?.GMT)}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[6].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  <button
                                    className="action-btn-square"
                                    onClick={() =>
                                      handleNavigateToSchedule(item)
                                    }
                                  >
                                    <div className="button__content">
                                      <div className="button__icon">
                                        <img
                                          src={BTN_ICON}
                                          alt={"btn__icon"}
                                          width={20}
                                          height={20}
                                        />
                                      </div>
                                      <div className="button__text  text-sm">
                                        Book Lesson
                                      </div>
                                    </div>
                                  </button>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[7].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  <button
                                    className="action-btn-square"
                                    onClick={() =>
                                      handleNavigateToFeedback(item.AcademyId)
                                    }
                                  >
                                    <div className="button__content">
                                      <div className="button__icon">
                                        <img
                                          src={BTN_ICON}
                                          alt={"btn__icon"}
                                          width={20}
                                          height={20}
                                        />
                                      </div>
                                      <div className="button__text">
                                        {" "}
                                        Feedbacks
                                      </div>
                                    </div>
                                  </button>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[8].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  <button
                                    className="action-btn-square"
                                    onClick={() =>
                                      redirect_to_tutor_profile(item?.AcademyId)
                                    }
                                  >
                                    <div className="button__content">
                                      <div className="button__icon">
                                        <img
                                          src={BTN_ICON}
                                          alt={"btn__icon"}
                                          width={20}
                                          height={20}
                                        />
                                      </div>
                                      <div className="button__text">
                                        View Profile
                                      </div>
                                    </div>
                                  </button>
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[10].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  {item.CancellationPolicy} Hrs
                                </td>
                                <td
                                  style={{
                                    width: multi_student_cols[11].width,
                                    border: "1px solid lightgray",
                                  }}
                                >
                                  {item.ResponseHrs.replace("Hours", "Hrs")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-danger p-4 m-2">
                    No tutors found that is offering that Subject
                  </p>
                )}
              </>
            ) : (
              selectedSubject.SubjectName && <Loading height="30vh" />
            )}
          </div>
        </div>
      </div>
      <Actions saveDisabled={true} />
    </>
  );
};

export default StudentFaculties;
