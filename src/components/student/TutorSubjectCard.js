import React, { useEffect, useRef, useState } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Avatar from "../common/Avatar";
import { showDate } from "../../utils/moment";
import moment from "moment";
import { wholeDateFormat } from "../../constants/constants";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { useNavigate } from "react-router-dom";

const TutorCard = ({
  tutor,
  handleNavigateToFeedback,
  redirect_to_tutor_profile,
  handleNavigateToSchedule,
}) => {
  const {
    Photo,
    rate,
    grades,
    TutorScreenname,
    Country,
    GMT,
    ResponseHrs,
    CancellationPolicy,
    IntroSessionDiscount,
  } = tutor;
  const { student } = useSelector((state) => state.student);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate()


  const [isOpen, setIsOpen] = useState(false); 
  const dropdownRef = useRef(null); 

  const handleToggle = () => {
    setIsOpen(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
        return moment().tz(timezones[0]);
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
      } else return "-";
    } catch (error) {
      console.log("Invalid GMT offset format");
    }
  };

  // Scroll the container to the left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; // adjust the scroll value as needed
    }
  };

  // Scroll the container to the right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // adjust the scroll value as needed
    }
  };

  const classByDifference = (difference) => {
    if (typeof difference !== "number") return "";
    if (difference >= -3 && difference <= 3) {
      return "text-bg-success";
    } else if (difference >= -6 && difference <= 6) {
      return "text-bg-warning";
    } else {
      return "text-bg-danger blinking-frame-red";
    }
  };

  return (
    <div className="d-flex flex-column h-100 ">
      <div className="d-flex justify-content-start align-items-center mb-3 flex-wrap">
        <div>
          <Avatar avatarSrc={Photo} size="80" showOnlineStatus={false} />
        </div>

        <div className="text-end w-100" >
          <div className="d-flex align-items-center justify-content-between">
            <span>{rate}/hr</span>
            <div style={{ position: 'relative' }}>
              <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
                <BiDotsVerticalRounded />
              </div>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    right: '0',
                    background: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    width: '150px',
                    overflow: 'hidden',
                    zIndex: 1000,
                  }}
                >
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {/* TODO:  ad chat if no chatId is there.*/}
                    <li style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => {
                     tutor.ChatID && navigate(`/student/chat/${tutor.ChatID}`)
                    }} className="hoveringListItem w-100">Message</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-start mt-1">
            <p className=" " style={{ color: "#7d7d7d", fontWeight: "500" }}>
              {Country}
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-start mt-1">
            <FaClock className="me-2" color="#7d7d7d" />
            <p
              className=""
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontWeight: "500",
                overflow: "hidden",
                color: "#7d7d7d",
              }}
            >
              {showDate(convertGMTToLocalTime(tutor?.GMT), wholeDateFormat)}
            </p>
          </div>
        </div>

      </div>

      <div className="flex-grow-1 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between">
          <h5 className="card-title text-start" style={{ fontSize: "1.2rem" }}>
            {TutorScreenname}
          </h5>

          {!tutor.CodeApplied && (
            <div className="blinking-button" style={{ color: "black" }}>
              <span className="badge" style={{ background: "limegreen" }}>
                connected
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="grade-scroller mb-2 d-flex align-items-center position-relative">
            <FaChevronLeft
              className="h-100 text-start flex-shrink-0 chevron"
              style={{ cursor: "pointer", position: "absolute", left: 0, boxShadow: " rgb(0 0 0 / 71%) -19px 0px 10px -5px inset" }}
              size={15}
              color="white"
              onClick={scrollLeft}
            />
            <div
              ref={scrollContainerRef}
              style={{ scrollBehavior: "smooth" }}
              className="grades-container d-flex overflow-hidden flex-grow-1"
            >
              {JSON.parse(grades).map((grade, index) => (
                <span key={index} className="badge bg-success me-1 ">
                  {grade}
                </span>
              ))}
            </div>

            <FaChevronRight
              style={{ cursor: "pointer", position: "absolute", right: 0, boxShadow: "rgb(0 0 0 / 77%) 20px 0px 10px -5px inset" }}
              className="h-100 text-end flex-shrink-0 chevron"
              size={15}
              color="white"

              onClick={scrollRight}
            />
          </div>

          {/* Rows for each detail */}
          <div className="">
            {/* Row for Response Time */}
            <div
              className="row py-2 w-auto"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <div className="col-6 text-start">
                <strong
                  title="Response Time"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "block",
                    overflow: "hidden",
                    fontSize: "13px"
                  }}
                >
                  Response Time:
                </strong>
              </div>
              <div className="col-6 text-end">{ResponseHrs} hrs</div>
            </div>

            {/* Row for Cancellation Policy */}
            <div
              className="row py-2 w-auto"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="col-6 text-start">
                <strong
                  title="Cancellation Policy"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "block",
                    overflow: "hidden",
                    fontSize: "13px"

                  }}
                >
                  Cancellation Policy:
                </strong>
              </div>
              <div className="col-6 text-end">
                {CancellationPolicy ? `${CancellationPolicy} hrs` : "N/A"}
              </div>
            </div>

            {/* Row for Discount */}
            <div
              className="row py-2 w-auto"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <div className="col-6 text-start">
                <strong
                  title="Introduction Discount"
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "block",
                    overflow: "hidden",
                    fontSize: "13px"

                  }}
                >
                  Intro Discount:
                </strong>
              </div>
              <div className="col-6 text-end">
                {!IntroSessionDiscount ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <MdCancel color="red" />
                )}
              </div>
            </div>
            <div
              className="row py-2 w-auto"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="col-6 text-start">
                <strong
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "block",
                    overflow: "hidden",
                    fontSize: "13px"

                  }}
                >
                  Time Diff:
                </strong>
              </div>

              <div className="col-6  d-flex justify-content-end ">
                <div
                  className={`d-inline rounded px-1 d-flex justify-content-center align-items-center ${classByDifference(
                    calculateTimeDifference(tutor?.GMT)
                  )}`}
                  style={{ fontSize: "14px", width: "20px", height: "20px" }}
                >
                  {" "}
                  {calculateTimeDifference(tutor?.GMT) > 0
                    ? `+${calculateTimeDifference(tutor?.GMT)}`
                    : calculateTimeDifference(tutor?.GMT)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-around mt-3">
          <button
            title="Book Lesson"
            style={{ gridColumn: "1 / 6" }}
            className="action-btn-square"
            onClick={() => handleNavigateToSchedule(tutor)}
          >
            <div className="button__content">
              {/* <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div> */}
              <div
                className="button__text text-sm"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  gridColumn: "1 / 6",
                }}
              >
                Book Lesson
              </div>
            </div>
          </button>
          <button
            title="Feedbacks"
            style={{ gridColumn: "1 / 6" }}
            className="action-btn-square"
            onClick={() => handleNavigateToFeedback(tutor.AcademyId)}
          >
            <div className="button__content">
              {/* <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div> */}
              <div
                className="button__text"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  gridColumn: "1 / 6",
                }}
              >
                Feedbacks
              </div>
            </div>
          </button>
          <button
            title=" View Profile"
            style={{ gridColumn: "1 / 6" }}
            className="action-btn-square"
            onClick={() => redirect_to_tutor_profile(tutor?.AcademyId)}
          >
            <div className="button__content">
              {/* <div className="button__icon">
                                <img src={BTN_ICON} alt="btn__icon" width={20} height={20} />
                            </div> */}
              <div
                className="button__text"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                View Profile
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
