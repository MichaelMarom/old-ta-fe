import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import BookedLessons from "../../components/student/Feedback/BookedLessons";
import QuestionFeedback from "../../components/student/Feedback/QuestionFeedback";
import {
  get_all_feedback_questions,
  get_feedback_to_question,
  post_feedback_to_question,
} from "../../axios/student";
import { showDate } from "../../utils/moment";
import { wholeDateFormat } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { postStudentBookings } from "../../redux/student/studentBookings";
import Actions from "../../components/common/Actions";
import { toast } from "react-toastify";
import Loading from "../../components/common/Loading";
import _ from "lodash";
import DebounceInput from "../../components/common/DebounceInput";
import { setStudentSessions } from "../../redux/student/studentSessions";
import { fetch_tutors_photos } from "../../axios/tutor";

const Feedback = () => {
  const { sessions } = useSelector((state) => state.studentSessions);
  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [comment, setComment] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const { student } = useSelector((state) => state.student);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    sessions.length &&
      fetch_tutors_photos(sessions.map((session) => session.tutorId)).then((result) => {
        result?.length && setFeedbackData(
          sessions.map((session) => ({
            ...session,
            photo: result.find((tutor) => tutor.AcademyId === session.tutorId)
              ?.photo,
          }))
        );
      }).catch((error) => { console.log(error) });
  }, [sessions]);

  useEffect(() => {
    let fetchSession = async () =>
      student.AcademyId && dispatch(await setStudentSessions(student));
    fetchSession();
    //eslint-disable-next-line
  }, [student.AcademyId]);

  useEffect(() => {
    const getAllFeedbackQuestion = async () => {
      const data = await get_all_feedback_questions();
      if (!!data.length) {
        setQuestions(data);
        setRawQuestions(data);
      }
    };
    getAllFeedbackQuestion();
  }, []);

  const handleEmojiClick = async (id, star) => {
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(
      (question) => question.SID === id
    );

    if (questionIndex !== -1) {
      await post_feedback_to_question(
        selectedEvent.id,
        selectedEvent.tutorId,
        student.AcademyId,
        id,
        star
      );
      updatedQuestions[questionIndex].star = star;
      setQuestions([...updatedQuestions]);
      const updatedSlots = feedbackData.map((slot) => {
        if (slot.id === selectedEvent.id) {
          return {
            ...slot,
            rating:
              questions.reduce((sum, question) => {
                sum = question.star + sum;
                return sum;
              }, 0) / questions.length,
          };
        }
        return slot;
      });

      const removedPhotoSessions = updatedSlots.map((sessions) => {
        const { photo, ...rest } = sessions;
        return rest;
      });

      console.log(
        selectedEvent.tutorId,
        student.AcademyId,
        removedPhotoSessions
      );
      dispatch(
        postStudentBookings({
          studentId: student.AcademyId,
          tutorId: selectedEvent.tutorId,
          bookedSlots: removedPhotoSessions.filter(
            (slot) =>
              slot.type === "booked" &&
              slot.studentId === student.AcademyId &&
              slot.tutorId === selectedEvent.tutorId
          ),
          reservedSlots: removedPhotoSessions.filter(
            (slot) =>
              slot.type !== "booked" &&
              slot.studentId === student.AcademyId &&
              slot.tutorId === selectedEvent.tutorId
          ),
        })
      );

      setFeedbackData(
        feedbackData.map((slot) => {
          if (slot.id === selectedEvent.id) {
            return {
              ...slot,
              rating:
                questions.reduce((sum, question) => {
                  sum = question.star + sum;
                  return sum;
                }, 0) / questions.length,
            };
          }
          return slot;
        })
      );
    }
  };

  const handleRowSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleDynamicSave = async (updatedSlots) => {
    const removedPhotoSessions = updatedSlots.map((sessions) => {
      const { photo, ...rest } = sessions;
      return rest;
    });
    const data = dispatch(
      postStudentBookings({
        studentId: student.AcademyId,
        tutorId: selectedEvent.tutorId,
        bookedSlots: removedPhotoSessions.filter(
          (slot) =>
            slot.id === "booked" &&
            slot.studentId === student.AcademyId &&
            slot.tutorId === selectedEvent.tutorId
        ),
        reservedSlots: removedPhotoSessions.filter(
          (slot) =>
            slot.id !== "booked" &&
            slot.studentId === student.AcademyId &&
            slot.tutorId === selectedEvent.tutorId
        ),
      })
    );

    data?.response?.status === 400 &&
      toast.error("Error while saving the data");
  };

  useEffect(() => {
    if (!!selectedEvent?.comment?.length) {
      setComment(selectedEvent?.comment);
    }
  }, [selectedEvent.comment]);

  useEffect(() => {
    if (selectedEvent.id) {
      setQuestionLoading(true);
      const fetchFeedbackToQuestion = async () => {
        const data = await get_feedback_to_question(
          selectedEvent.id,
          selectedEvent.tutorId,
          student.AcademyId
        );
        if (!!data.length) {
          const combinedArray = _.mergeWith(
            [],
            data,
            rawQuestions,
            (objValue, srcValue) => {
              if (
                objValue &&
                objValue.star === null &&
                srcValue &&
                srcValue.star !== null
              ) {
                return srcValue;
              }
            }
          );

          setQuestions(combinedArray);
        }
        setQuestionLoading(false);
      };
      fetchFeedbackToQuestion();
    }
  }, [
    selectedEvent.id,
    selectedEvent.tutorId,
    student.AcademyId,
    rawQuestions,
  ]);

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
                    Lessons blinking
                  </span>{" "}
                  by green border are ready for your feedback. Please rate your
                  tutor as soon as possible.
                </div>
                <BookedLessons
                  events={feedbackData}
                  handleRowSelect={handleRowSelect}
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
                Feedback on {showDate(selectedEvent.start, wholeDateFormat)}
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
                  <DebounceInput
                    placeholder=""
                    required
                    element="textarea"
                    className="form-control m-0"
                    delay={1000}
                    value={comment}
                    style={{ height: "150px" }}
                    setInputValue={setComment}
                    debounceCallback={() => {
                      const updatedSlots = feedbackData.map((slot) => {
                        if (slot.id === selectedEvent.id) {
                          return { ...slot, comment };
                        }
                        return slot;
                      });

                      setFeedbackData(updatedSlots);
                      setSelectedEvent({ ...selectedEvent, comment });
                      handleDynamicSave(updatedSlots);
                    }}
                    onChange={(e) => setComment(e.target.value)}
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

export default Feedback;
