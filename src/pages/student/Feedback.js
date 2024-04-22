import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import BookedLessons from "../../components/student/Feedback/BookedLessons";
import QuestionFeedback from "../../components/student/Feedback/QuestionFeedback";
import {
  get_all_feedback_questions,
  get_feedback_to_question,
  get_payment_report,
  post_feedback_to_question,
} from "../../axios/student";
import { showDate } from "../../helperFunctions/timeHelperFunctions";
import { wholeDateFormat } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { postStudentBookings } from "../../redux/student_store/studentBookings";
import Actions from "../../components/common/Actions";
import { toast } from "react-toastify";
import Loading from "../../components/common/Loading";
import { moment } from "../../config/moment";

export const Feedback = () => {
  const [questions, setQuestions] = useState([]);
  const [comment, setComment] = useState("");
  const [reservedSlots, setReservedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const { student } = useSelector((state) => state.student);
  const [pendingChange, setPendingChange] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllFeedbackQuestion = async () => {
      const data = await get_all_feedback_questions();
      !!data.length && setQuestions(data);
    };
    getAllFeedbackQuestion();
  }, []);

  const handleEmojiClick = async (id, star) => {
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(
      (question) => question.SID === id
    );

    if (questionIndex !== -1) {
      updatedQuestions[questionIndex].star = star;
      setQuestions([...updatedQuestions]);
      await post_feedback_to_question(
        selectedEvent.id,
        selectedEvent.tutorId,
        student.AcademyId,
        id,
        star
      );
      if (selectedEvent.type === "booked") {
        const updatedBookedSlots = bookedSlots.map((slot) => {
          if (slot.id === selectedEvent.id) {
            slot.rating =
              questions.reduce((sum, question) => {
                sum = question.star + sum;
                return sum;
              }, 0) / questions.length;
          }
          return slot;
        });
        dispatch(
          postStudentBookings({
            studentId: student.AcademyId,
            tutorId: selectedEvent.tutorId,
            bookedSlots: updatedBookedSlots,
            reservedSlots,
          })
        );
        setBookedSlots([...updatedBookedSlots]);
      } else {
        const updatedReservedSlots = reservedSlots.map((slot) => {
          if (slot.id === selectedEvent.id) {
            slot.rating =
              questions.reduce((sum, question) => {
                sum = question.star + sum;
                return sum;
              }, 0) / questions.length;
          }
          return slot;
        });

        dispatch(
          postStudentBookings({
            studentId: student.AcademyId,
            tutorId: selectedEvent.tutorId,
            bookedSlots,
            reservedSlots: updatedReservedSlots,
          })
        );
        setReservedSlots([...updatedReservedSlots]);
      }
      setFeedbackData(
        feedbackData.map((slot) => {
          if (slot.id === selectedEvent.id) {
            slot.rating =
              questions.reduce((sum, question) => {
                sum = question.star + sum;
                return sum;
              }, 0) / questions.length;
          }
          return slot;
        })
      );
    }
  };

  const handleRowSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleDynamicSave = async (value) => {
    const updatedSlots = (
      selectedEvent.type === "booked" ? bookedSlots : reservedSlots
    ).map((slot) => {
      if (slot.id === selectedEvent.id) {
        slot.comment = value;
      }
      return slot;
    });
    if (selectedEvent.type === "booked") {
      const data = dispatch(
        postStudentBookings({
          studentId: student.AcademyId,
          tutorId: selectedEvent.tutorId,
          bookedSlots: updatedSlots,
          reservedSlots,
        })
      );
      data.response?.status === 400
        ? toast.error("Error while saving the data")
        : toast.success("Data Succesfully Saved");
    } else {
      const data = dispatch(
        postStudentBookings({
          studentId: student.AcademyId,
          tutorId: selectedEvent.tutorId,
          bookedSlots,
          reservedSlots: updatedSlots,
        })
      );
      data?.response?.status === 400 &&
        toast.error("Error while saving the data");
    }
  };

  const handleTextChange = (event) => {
    const updatedValue = event.target.value;
    setComment(updatedValue);

    if (pendingChange) {
      clearTimeout(pendingChange);
    }

    const timeout = setTimeout(() => {
      handleDynamicSave(updatedValue);
    }, 1000);

    setPendingChange(timeout);
  };

  useEffect(() => {
    const updatedSlots = (
      selectedEvent.type === "booked" ? bookedSlots : reservedSlots
    ).map((slot) => {
      if (slot.id === selectedEvent.id) {
        slot.comment = comment;
      }
      return slot;
    });

    setFeedbackData(
      feedbackData.map((slot) => {
        if (slot.id === selectedEvent.id) {
          slot.comment = comment;
        }
        return slot;
      })
    );
    setSelectedEvent({ ...selectedEvent, comment });
    if (selectedEvent.type === "booked") setBookedSlots([...updatedSlots]);
    else setReservedSlots([...updatedSlots]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  useEffect(() => {
    setQuestions((prevValue) =>
      prevValue.map((question) => ({ ...question, star: null }))
    );
    setComment("");
  }, [selectedEvent.id]);

  const transformFeedbackData = (item) => {
    let bookedSlots = JSON.parse(item.bookedSlots);
    let reservedSlots = JSON.parse(item.reservedSlots);
    const currentTimeInTimeZone = moment().tz(student.timeZone);

    bookedSlots = bookedSlots.map((slot) => {
      const sessionEndInTimeZone = moment(slot.end).tz(student.timeZone);
      const minutesDifference = sessionEndInTimeZone.diff(
        currentTimeInTimeZone,
        "minutes"
      );
      if (minutesDifference <= 10 && minutesDifference > 0) {
        return {
          ...slot,
          feedbackEligible: true,
        };
      }
      return slot;
    });
    reservedSlots = reservedSlots.map((slot) => {
      const sessionEndInTimeZone = moment(slot.end).tz(student.timeZone);
      const minutesDifference = sessionEndInTimeZone.diff(
        currentTimeInTimeZone,
        "minutes"
      );
      if (minutesDifference <= 10 && minutesDifference > 0) {
        return {
          ...slot,
          feedbackEligible: true,
        };
      }
      return slot;
    });

    const combinedPaymentData = reservedSlots.concat(bookedSlots);
    const final = combinedPaymentData.filter(
      (data) => data.type !== "reserved"
    );
    return final;
  };

  useEffect(() => {
    if (student.AcademyId && student.timeZone) {
      const fetchPaymentReport = async () => {
        setLoading(true);
        const data = await get_payment_report(
          student.AcademyId,
          student.timeZone
        );
        setLoading(false);

        if (!data?.response?.data) {
          const uniqueData = data.reduce((unique, item) => {
            if (unique?.some((detail) => detail.tutorId === item.tutorId)) {
              return unique;
            } else {
              return [...unique, item];
            }
          }, []);
          const transformedData = uniqueData
            .map((item) => transformFeedbackData(item))
            .flat()
            .filter((slot) => slot.studentId === student.AcademyId);
          setFeedbackData(transformedData);
        }
      };

      fetchPaymentReport();
    }
  }, [student.AcademyId, student.timeZone]);

  useEffect(() => {
    if (selectedEvent.id) {
      setQuestionLoading(true);
      const fetchFeedbackToQuestion = async () => {
        const data = await get_feedback_to_question(
          selectedEvent.id,
          selectedEvent.tutorId,
          student.AcademyId
        );
        if (!!data.length) setQuestions(data);
        setQuestionLoading(false);
      };
      fetchFeedbackToQuestion();
    }

    const categorizedData = feedbackData.reduce(
      (acc, obj) => {
        if (
          (obj.type === "intro" || obj.type === "reserved") &&
          obj.tutorId === selectedEvent.tutorId
        ) {
          acc.reservedSlots.push(obj);
        } else if (
          obj.type === "booked" &&
          obj.tutorId === selectedEvent.tutorId
        ) {
          acc.bookedSlots.push(obj);
        }
        return acc;
      },
      { reservedSlots: [], bookedSlots: [] }
    );

    setReservedSlots(categorizedData.reservedSlots);
    setBookedSlots(categorizedData.bookedSlots);
  }, [selectedEvent, student.AcademyId, feedbackData]);

  // useEffect(() => {
  //     if (!!feedbackData.length && student.timeZone) {
  //         const currentTime = moment().tz(student.timeZone)
  //             // const upcomingEvent = feedbackData.reduce((upcoming, current) => {
  //             //     return (new Date(current.start) < new Date(upcoming.start) && new Date(current.start) > currentTime) ? current : upcoming;
  //             // });
  //             ;

  //         const sortedEvents = feedbackData.sort((a, b) => moment(a.start).diff(moment(b.start)));

  //         // Find the first event whose start time is after the current time
  //         const upcomingEvent = sortedEvents.find(event => moment(event.start).isAfter(currentTime));

  //         console.log(upcomingEvent)
  //         setUpcomingEvent(upcomingEvent)
  //     }
  // }, [feedbackData, student])

  // useEffect(() => {
  //     const currentTime = moment().tz(student.timeZone || 'America/New_York'); // Current time
  //     if (upcomingEvent?.start && student.timeZone
  //         //  && moment(upcomingEvent.start).tz(student.timeZone).isSameOrAfter(currentTime)
  //     ) {
  //         const timeUntilStart = moment(upcomingEvent.start).tz(student.timeZone).to(currentTime, true);
  //         const message = `Your next lesson (${upcomingEvent.subject}) is starting in ${timeUntilStart}.`;
  //         setUpcomingSessionNotice(message)
  //     }
  // }, [student, upcomingEvent]);

  if (loading) return <Loading />;
  return (
    <StudentLayout>
      <div className="container mt-1">
        <div className="py-2 row">
          <div className={` ${selectedEvent.id ? "col-md-8" : "col-md-12"}`}>
            <h2>Booked Lessons</h2>
            {feedbackData.length ? (
              <>
                <div style={{ fontSize: "14px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {" "}
                    Lessons blinking
                  </span>{" "}
                  by green border are ready for your feedback. Please rate your
                  tutor as soon as posible.
                </div>
                <BookedLessons
                  setEvents={setFeedbackData}
                  events={feedbackData}
                  handleRowSelect={handleRowSelect}
                  setSelectedEvent={setSelectedEvent}
                  selectedEvent={selectedEvent}
                />
              </>
            ) : (
              <div className="text-danger">No Record Found</div>
            )}
          </div>
          {selectedEvent.id && (
            <div
              className="col-md-4 "
              style={{ height: "70vh", overflowY: "auto" }}
            >
              <h4>
                Feedback on {showDate(selectedEvent.start, wholeDateFormat)}{" "}
                Session
              </h4>
              <div className="questions">
                <QuestionFeedback
                  loading={questionLoading}
                  questions={questions}
                  handleEmojiClick={handleEmojiClick}
                />
                <div className="form-group">
                  <label htmlFor="exampleTextarea">
                    Please write a short description of your impression about
                    this lesson
                  </label>

                  <textarea
                    className="form-control"
                    id="exampleTextarea"
                    rows="4"
                    value={
                      selectedEvent.comment ? selectedEvent.comment : comment
                    }
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Actions saveDisabled={true} />
    </StudentLayout>
  );
};
