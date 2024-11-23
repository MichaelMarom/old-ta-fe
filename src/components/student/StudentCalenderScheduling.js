import React, { useEffect, useState } from "react";
import ShowCalendar from "../common/Calendar/Calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import {
  capitalizeFirstLetter,
  formatName,
} from "../../utils/common";
import { convertGMTOffsetToLocalString } from "../../utils/moment";
// import { get_my_data } from "../../axios/student";
import { useDispatch } from "react-redux";
import { setStudent } from "../../redux/student/studentData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import Avatar from "../common/Avatar";
import { FaBook, FaClock, FaUserCircle } from "react-icons/fa";

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
    { Header: "Package" },
    { Header: "Hours" },
    { Header: "Discount" },
  ];

  let subscription_discount = [
    { discount: "0%", hours: "1-5", package: "A-0" },
    { discount: "5.0%", hours: "6-11", package: "A-6" },
    { discount: "10.0%", hours: "12-17", package: "A-12" },
    { discount: "15.0%", hours: "18-23", package: "A-18" },
    { discount: "20.0%", hours: "24+", package: "A-24" },
  ];
  useEffect(() => {
    setTutorTime(convertGMTOffsetToLocalString(selectedTutor.GMT));
    setActiveSubscriptionHours(selectedTutor.discountHours);
  }, [selectedTutor]);

  useEffect(() => {
    const update = async () => {
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
    // const getStudentDetails = async () => {
    //   const res = await get_my_data(localStorage.getItem("student_user_id"));
    //   !res?.response?.data?.message && dispatch(setStudent(res));
    // };
    // getStudentDetails();
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
    <div className={`${studentModalOpen ? "w-75 float-end" : "w-100"}`}>


      <div className="d-flex justify-content-end" style={{ height: "calc(100vh - 50px)" }}>
        <div className={`d-flex col-3 `} >
          <div className="d-flex ">
            <div className="d-flex flex-column">
              <h6 className="m-0 text-center " style={{lineHeight:"0.7"}}>Subscription Discount</h6>
              {selectedTutor.activateSubscriptionOption && (
                <table className="" style={{ width: "90%", margin: "5%" }}>
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
                        <td>{item.package}</td>

                        <td>{item.hours}</td>

                        <td>{item.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div
                className={`w-100 align-items-center justify-content-between mt-3 d-flex flex-column `}
              >
                <div className="d-flex card m-2">
                  <div className="c d-flex flex-column">

                    <div
                      key={selectedTutor.id}
                      className="d-flex flex-column align-items-center p-3 rounded-4 shadow-lg"
                      style={{
                        backgroundColor: "white",
                        color: 'black',
                        // boxShadow: "gray 6px 3px 10px 1px"
                      }}
                    >
                      <div className="d-flex ">
                        <div className="me-3">
                          <Avatar avatarSrc={selectedTutor.photo} showOnlineStatus size="60" positionInPixle={6} />
                        </div>

                        <div className="flex-grow-1">
                          <h5 className="mb-1"> {capitalizeFirstLetter(
                            formatName(selectedTutor.firstName, selectedTutor.lastName)
                          )}</h5>
                          <p className="mb-1">
                            <FaBook className="me-2" />
                            {selectedTutor.subject}
                          </p>
                          <p className="mb-0">
                            <FaClock className="me-2" />
                            {tutorTime}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <h5
                          className={`d-inline mr-2 card ${getTimeDifferenceClass(
                            calculateTimeDifference()
                          )} px-1`}
                        >
                          Time Difference:{" "}
                          {calculateTimeDifference() > 0
                            ? `+${calculateTimeDifference()}`
                            : calculateTimeDifference()}
                        </h5>
                        <h6>UTC: {moment().utc().format("hh:mm a")}</h6>
                      </div>
                      <div className=" d-flex align-items-center gap-2">
                        <h5 className="m-0 d-inline mr-2 ">Your Time:</h5>
                        <h6 className="m-0 text-start">
                          {convertGMTOffsetToLocalString(student.GMT)}
                        </h6>
                      </div>
                    </div>

                  </div>
                </div>


              </div>

            </div>
          </div>
        </div>
        <div
          className={` col-9`}
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
