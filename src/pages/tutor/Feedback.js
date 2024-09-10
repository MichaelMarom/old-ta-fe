import React, { useEffect, useState } from "react";
import {
  fetch_student_photos,
  get_feedback_to_question,
  post_feedback_to_question,
} from "../../axios/calender";
import {
  formatted_tutor_sessions,
  get_tutor_feedback_questions,
} from "../../axios/tutor";
import SessionsTable from "../../components/tutor/Feedback/SessionsTable";

import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Actions from "../../components/common/Actions";
import FeedbackModal from "../../components/common/FeedbackModal";
import Loading from "../../components/common/Loading";
import { updateStudentLesson } from "../../redux/student/studentBookings";

const Feedback = () => {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState({});

  // const { sessions } = useSelector((state) => state.tutorSessions);
  const [sessions, setSessions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [comment, setComment] = useState("");
  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [sessionsFetched, setSessionsFetched] = useState(false);
  const { tutor } = useSelector((state) => state.tutor);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tutor.AcademyId) {
      formatted_tutor_sessions(tutor.AcademyId)
        .then((res) => {
          if (!res.response?.data) {
            setSessions(res.sessions);
            res.sessions.length && setSessionsFetched(true);
          }
        })
        .catch((err) => toast.error(err.message));
    }
  }, [tutor.AcademyId]);

  useEffect(() => {
    if (sessionsFetched) {
      setFetching(true);
      fetch_student_photos(_.uniq(sessions.map((session) => session.studentId)))
        .then((result) => {
          !result?.response?.data &&
            setFeedbackData(
              sessions.map((session) => ({
                ...session,
                photo:
                  result.find(
                    (student) => student.AcademyId === session.studentId
                  )?.Photo || null,
              }))
            );
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [sessionsFetched]);

  useEffect(() => {
    const getAllFeedbackQuestion = async () => {
      const data = await get_tutor_feedback_questions();
      if (!!data?.length) {
        setRawQuestions(data);
        setQuestions(data);
      }
    };
    getAllFeedbackQuestion();
  }, []);

  const handleEmojiClick = async (id, star) => {
    setQuestionLoading(true);
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(
      (question) => question.SID === id
    );

    if (questionIndex !== -1) {
      // await post_feedback_to_question(
      //   selectedEvent.id,
      //   tutor.AcademyId,
      //   selectedEvent.studentId,
      //   id,
      //   star,
      //   0
      // );

      updatedQuestions[questionIndex].star = star;
      setQuestions([...updatedQuestions]);

      // setFeedbackData([
      //   ...sessions.filter((ses) => ses.id !== selectedEvent.id),
      //   {
      //     ...selectedEvent,
      //     ratingByTutor:
      //       questions.reduce((sum, question) => {
      //         sum = question.star + sum;
      //         return sum;
      //       }, 0) / questions.length,
      //   },
      // ]);

      // const lessonToUpdate = { ...selectedEvent };
      // delete lessonToUpdate.photo;
      // dispatch(updateStudentLesson(lessonToUpdate.id, lessonToUpdate));

      setQuestionLoading(false);
    }
  };

  // const handleDynamicSave = async (updatedSlot) => {
  //   const updatedSessionsData = [...feedbackData].map((slot) => {
  //     if (slot.id === updatedSlot.id) {
  //       return updatedSlot;
  //     }
  //     return slot;
  //   });
  //   // dispatch(setOnlySessions(updatedSessionsData));

  //   const lessonToUpdate = { ...updatedSlot };
  //   delete lessonToUpdate.photo;
  //   // dispatch(updateStudentLesson(lessonToUpdate.id, lessonToUpdate));
  // };

  useEffect(() => {
    if (selectedEvent.id) {
      setQuestionLoading(true);
      const fetchFeedbackToQuestion = async () => {
        const data = await get_feedback_to_question(
          selectedEvent.id,
          tutor.AcademyId,
          selectedEvent.studentId,
          0
        );
        if (!!data?.length) {
          console.log(data);
          // const combinedArray = _.mergeWith(
          //   [],
          //   data,
          //   rawQuestions,
          //   (objValue, srcValue) => {
          //     if (
          //       objValue &&
          //       objValue.star === null &&
          //       srcValue &&
          //       srcValue.star !== null
          //     ) {
          //       return srcValue;
          //     }
          //   }
          // );
          // console.log(combinedArray)

          setQuestions(data);
        }
        setQuestionLoading(false);
      };
      fetchFeedbackToQuestion();
      setComment(
        selectedEvent.commentByTutor ? selectedEvent.commentByTutor : ""
      );
    } else setComment("");
    setQuestions((prevValue) =>
      prevValue.map((question) => ({ ...question, star: null }))
    );
  }, [selectedEvent.id, selectedEvent.commentByTutor, tutor]);

  const handleSaveFeedback = () => {
    const ifAnyQuestionisNull = questions.filter(
      (question) => !question.star
    ).length;
    if (ifAnyQuestionisNull || !comment.trim().length)
      return toast.warning(
        "Please answer all questions and write valuabe feedback to your tutor"
      );

      const updatedLesson = { ...selectedEvent };
    delete updatedLesson.photo;

    setFeedbackData([
      ...feedbackData.filter((ses) => ses.id !== updatedLesson.id),
      {
        ...selectedEvent,
        ratingByTutor:
          questions.reduce((sum, question) => {
            sum = question.star + sum;
            return sum;
          }, 0) / questions.length,
        commentByTutor: comment,
      },
    ]);

    questions.map((ques) =>
      post_feedback_to_question(
        updatedLesson.id,
        tutor.AcademyId,
        updatedLesson.studentId,
        ques.SID,
        ques.star,
        0
      )
    );

    dispatch(
      updateStudentLesson(updatedLesson.id, {
        ...updatedLesson,
        commentByTutor: comment,
        ratingByTutor: questions.reduce((sum, q) => q.star + sum, 0) / 5,
      })
    );

    toast.success("Saved Successfully")
    setQuestions(rawQuestions);
    setSelectedEvent({});
    setComment("");
  };
  return (
    <>
      <div>
        {fetching || saving ? (
          <Loading />
        ) : (
          <div className="container mt-1">
            <div className="py-2 row">
              <div
                className={`${selectedEvent.id ? "col-md-12" : "col-md-12"}`}
              >
                <h2>Booked Lessons</h2>
                {feedbackData.length ? (
                  <>
                    <div style={{ fontSize: "14px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Lessons blinking
                      </span>
                      by green border are ready for your feedback. Please rate
                      your student as soon as possible.
                    </div>
                    <SessionsTable
                      events={feedbackData}
                      setSelectedEvent={setSelectedEvent}
                      selectedEvent={selectedEvent}
                    />
                  </>
                ) : (
                  <div className="text-danger">No Record Found</div>
                )}
              </div>
              <FeedbackModal
                handleClose={() => {
                  setQuestions(rawQuestions);
                  setSelectedEvent({});
                  setComment("");
                }}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                setComment={setComment}
                comment={comment}
                handleEmojiClick={handleEmojiClick}
                handleSaveFeedback={handleSaveFeedback}
                questions={questions}
                questionLoading={questionLoading}
              />
              {/* <CenteredModal
                isTitleReactNode
                title={
                  <div className="d-flex align-items-center">
                    <Avatar avatarSrc={selectedEvent.photo} />
                    <div>
                      <h6 className="m-0 text-start">
                        {selectedEvent.studentName}
                      </h6>
                      <p className="fw-bold" style={{ fontSize: "12px" }}>
                        {selectedEvent.subject}
                        {`(${selectedEvent.type})`}
                      </p>
                      <p
                        className="fw-bold text-secondary"
                        style={{ fontSize: "12px" }}
                      >
                        <CiClock2 size={17} />{" "}
                        {showDate(selectedEvent.start, wholeDateFormat)}
                      </p>
                    </div>
                  </div>
                }
                show={selectedEvent.id}
                handleClose={() => setSelectedEvent({})}
              >
                <div
                  className=" "
                  style={{ height: "calc(100vh - 165px)", overflowY: "auto" }}
                >
                  <div className="questions">
                    <QuestionFeedback
                      loading={questionLoading}
                      questions={questions}
                      handleEmojiClick={handleEmojiClick}
                    />
                    <div className="form-group m-3">
                      <label
                        style={{ fontSize: "10px" }}
                        htmlFor="exampleTextarea"
                      >
                        Please write a short description of your impression
                        about this lesson
                        <Tooltip
                          text={"Instructions how to grade freehand notes."}
                        />
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
                          // setSelectedEvent({
                          //   ...selectedEvent,
                          //   commentByTutor: comment,
                          // });
                          // comment.length &&
                          //   handleDynamicSave({
                          //     ...selectedEvent,
                          //     commentByTutor: comment,
                          //   });
                        }}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-100 d-flex justify-content-between">
                    <TAButton buttonText={"cancel"} />
                    <TAButton
                      buttonText={"save"}
                      handleClick={handleSaveFeedback}
                    />
                  </div>
                </div>
              </CenteredModal> */}
            </div>
          </div>
        )}
        <Actions saveDisabled />
      </div>
    </>
  );
};

export default Feedback;
