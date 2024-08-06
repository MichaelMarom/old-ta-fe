import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import BookedLessons from "../../components/student/Feedback/BookedLessons";
import QuestionFeedback from "../../components/student/Feedback/QuestionFeedback";
import {
  get_all_feedback_questions,
  get_feedback_to_question,
  post_feedback_to_question,
} from "../../axios/calender";
import { fetch_tutors_photos } from "../../axios/tutor";

import { showDate } from "../../utils/moment";
import { wholeDateFormat } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { updateStudentLesson } from "../../redux/student/studentBookings";
import Actions from "../../components/common/Actions";
import { toast } from "react-toastify";
import Loading from "../../components/common/Loading";
import _ from "lodash";
import DebounceInput from "../../components/common/DebounceInput";
import {
  setOnlySessions,
  setStudentSessions,
} from "../../redux/student/studentSessions";

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
      fetch_tutors_photos(sessions.map((session) => session.tutorId))
        .then((result) => {
          result?.length &&
            setFeedbackData(
              sessions.map((session) => ({
                ...session,
                photo: result.find(
                  (tutor) => tutor.AcademyId === session.tutorId
                )?.photo,
              }))
            );
        })
        .catch((error) => {
          console.log(error);
        });
  }, [sessions]);
  console.log(sessions);

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

      const rating =
        questions.reduce((sum, question) => {
          return question.star? sum + question.star : sum;
        }, 0) / questions.length;

      const withoutPhotoSession = { ...selectedEvent };
      delete withoutPhotoSession.photo;
      console.log(
        questions,rating
      );
      dispatch(
        updateStudentLesson(withoutPhotoSession.id, {
          ...withoutPhotoSession,
          ratingByStudent: rating,
        })
      );

      dispatch(
        await setOnlySessions(
          [...feedbackData].map((slot) => {
            if (slot.id === selectedEvent.id) {
              return {
                ...slot,
                ratingByStudent: rating,
              };
            }
            return slot;
          })
        )
      );
    }
  };

  const handleRowSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleDynamicSave = async (updatedSlot) => {
    
    const withoutPhotoSession = { ...updatedSlot };
    delete withoutPhotoSession.photo;
    console.log(withoutPhotoSession);

    const updatedSessionsData = [...feedbackData].map((slot) => {
      if (slot.id === withoutPhotoSession.id) {
        return withoutPhotoSession;
      }
      return slot;
    });
    dispatch(setOnlySessions(updatedSessionsData));
    dispatch(updateStudentLesson(withoutPhotoSession.id, withoutPhotoSession));
  };

  useEffect(() => {
    if (!!selectedEvent?.commentByStudent?.length) {
      setComment(selectedEvent?.commentByStudent);
    }
    else{
      setComment("");
    }
  }, [selectedEvent.commentByStudent]);

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
                    debounceCallback={(val) => {
                      console.log(selectedEvent);
                      handleDynamicSave({
                        ...selectedEvent,
                        commentByStudent: comment,
                      });
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
