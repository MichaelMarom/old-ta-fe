import React, { useEffect, useState } from "react";
import ShowCalendar from "../common/Calendar/Calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import {
  capitalizeFirstLetter,
  formatName,
} from "../../utils/common";
import { convertGMTOffsetToLocalString } from "../../utils/moment";
import { get_my_data } from "../../axios/student";
import { useDispatch } from "react-redux";
import { setStudent } from "../../redux/student/studentData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import Avatar from "../common/Avatar";

const StudentCalenderScheduling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const activeTab = "month";
  const [tutorTime, setTutorTime] = useState("");
  const [disabledHours, setDisabledHours] = useState([]);
  const [subscriptionHours, setActiveSubscriptionHours] = useState(null);
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    if (!selectedTutor.academyId) {
      toast.warning(
        "Please select subject and then tutor to open tutor schedule!"
      );
      navigate("/student/faculties");
    }
  }, [selectedTutor, navigate]);

  let subscription_cols = [
    { Header: "Hours" },
    { Header: "Select" },
    { Header: "Discount" },
  ];
  let subscription_discount = [
    { discount: "0%", hours: "1-5", value: 5 },
    { discount: "6.0%", hours: 6, value: 6 },
    { discount: "12.0%", hours: 12, value: 12 },
  ];

  useEffect(() => {
    setTutorTime(convertGMTOffsetToLocalString(selectedTutor.GMT));
    setActiveSubscriptionHours(selectedTutor.discountHours);
  }, [selectedTutor]);

  useEffect(() => {
    const update = async () => {
      console.log(student.AcademyId);
      if (subscriptionHours && student.AcademyId?.length) {
        // updating discountHours in StudentsBooking
        // await update_student_shortlist(
        //   selectedTutor.academyId,
        //   student.AcademyId,
        //   selectedTutor.subject,
        //   { DiscountHours: subscriptionHours }
        // );
      }
    };
    update();
  }, [subscriptionHours, student, selectedTutor]);

  useEffect(() => {
    const getStudentDetails = async () => {
      const res = await get_my_data(localStorage.getItem("student_user_id"));
      !res?.response?.data?.message && dispatch(setStudent(res));
    };
    getStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTimeDifferenceClass = (difference) => {
    if (difference >= -3 && difference <= 3) {
      return "text-bg-success";
    } else if (difference >= -6 && difference <= 6) {
      return "text-bg-warning";
    } else {
      return "text-bg-danger blinking-frame-red";
    }
  };

  const calculateTimeDifference = () => {
    try {
      const studentOffset = parseInt(student.GMT, 10);
      const tutorOffset = parseInt(selectedTutor.GMT, 10);

      const difference = studentOffset - tutorOffset;

      return difference;
    } catch (error) {
      console.log("Invalid GMT offset format");
    }
  };

  if (!selectedTutor.academyId)
    return (
      <div className="text-danger mt-4">
        Please select tutor to Book lessons
      </div>
    );
  return (
    <div className={`${studentModalOpen ? "w-75 float-end" : "w-100"} px-5`}>
      <div
        className={`d-flex ${selectedTutor.activateSubscriptionOption ? "justify-content-end" : ""
          }`}
      >
        <div className="d-flex ">
          {selectedTutor.activateSubscriptionOption && (
            <div className="px-2 col-3 mt-3">
              <h4 className="text-center ">Subscription Discount</h4>
              <div className="rate-table">
                <table>
                  <thead>
                    <tr>
                      {subscription_cols.map((item) => (
                        <th key={item.Header}>{item.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscription_discount.map((item, index) => (
                      <tr key={index}>
                        <td>{item.hours}</td>
                        <td>
                          <input
                            onChange={() =>
                              setActiveSubscriptionHours(item.value)
                            }
                            type="radio"
                            checked={item.value === subscriptionHours}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                          />
                        </td>

                        <td>{item.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="d-flex flex-column">
            <div
              className={`w-100 align-items-center justify-content-between mt-3 d-flex row flex-row m-2 border`}
            >
              <div className="d-flex col-3 card m-2">
                <div className="c d-flex flex-column">
                  <div className="d-inline  card-title ">
                    <div className="d-flex align-items-center gap-3">
                      <h5> Tutor:</h5>
                      <div className="d-flex align-items-center"> <Avatar avatarSrc={selectedTutor.photo} showOnlineStatus size="30" />
                        <p>  {capitalizeFirstLetter(
                          formatName(selectedTutor.firstName, selectedTutor.lastName)
                        )}</p></div>
                    </div>
                    <div className="d-flex align-items-center gap-3">  <h5> Subject:</h5><p> {selectedTutor.subject}</p></div>
                    <div className="card-subtitle d-inline ml-2 card-text d-flex align-items-center gap-3">
                      <h5> Time:</h5><p> {tutorTime}</p>
                    </div> </div>

                </div>
              </div>

              <div className="col-4 text-center">
                <h5
                  className={`d-inline mr-2 card ${getTimeDifferenceClass(
                    calculateTimeDifference()
                  )} px-1`}
                >
                  Time zones Difference:{" "}
                  {calculateTimeDifference() > 0
                    ? `+${calculateTimeDifference()}`
                    : calculateTimeDifference()}
                </h5>
                <h6>Greenwich UTC: {moment().utc().format("hh:mm a")}</h6>
              </div>
              <div className="d-flex col-3 card m-2">
                <div className="card-body">
                  <h4 className="d-inline mr-2 card-title">My Time:</h4>
                  <h6 className="card-subtitle text-start">
                    {convertGMTOffsetToLocalString(student.GMT)}
                  </h6>
                </div>
              </div>
            </div>
            <div className="highlight small lh-sm mb-3">
              Double click on an aviable (unblocked) slots. You must first book an
              introduction lesson. Most tutors will discount the 'intro' by 50%. You
              must conduct the "Introductionary" (Intro) lesson, and provide feedback
              before you can "Book" the next lesson with that tutor. You can book
              multiple lessons for a discount. For that reason you can "Reserve" up to
              6 time slots for 60 minutes until you make your final decision.
            </div>
          </div>
        </div>
      </div>


      <div className="d-flex justify-content-end" style={{ height: "57vh" }}>
        <div
          className={` ${selectedTutor.activateSubscriptionOption ? "col-9" : "col-12"
            } `}
        >
          <ShowCalendar
            setIsModalOpen={setStudentModalOpen}
            isModalOpen={studentModalOpen}
            timeDifference={calculateTimeDifference()}
            disableColor={selectedTutor.disableColor}
            activeTab={activeTab}
            disableWeekDays={disableWeekDays}
            disabledHours={disabledHours}
            setDisabledWeekDays={setDisabledWeekDays}
            setDisabledHours={setDisabledHours}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentCalenderScheduling;
