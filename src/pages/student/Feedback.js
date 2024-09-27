import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import BookedLessons from "../../components/student/Feedback/BookedLessons";
import QuestionFeedback from "../../components/student/Feedback/QuestionFeedback";
import {
  formatted_student_sessions,
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
import FeedbackModal from "../../components/common/FeedbackModal";

const Feedback = () => {
  // const { sessions } = useSelector((state) => state.studentSessions);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);
  const [comment, setComment] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const { student } = useSelector((state) => state.student);
  const [loading, setLoading] = useState(false);
  const [sessionsFetched, setSessionsFetched] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (student.AcademyId) {
      formatted_student_sessions(student.AcademyId)
        .then((res) => {
          if (!res.response?.data) {
            setSessions(res.sessions);
            res.sessions.length && setSessionsFetched(true);
          }
        })
        .catch((err) => toast.error(err.message));
    }
  }, [student.AcademyId]);

  console.log(feedbackData);
  useEffect(() => {
    if (sessionsFetched) {
      setFetching(true);
      fetch_tutors_photos(_.uniq(sessions.map((session) => session.tutorId)))
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
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [sessionsFetched]);
  console.log(sessions);

  // useEffect(() => {
  //   let fetchSession = async () =>
  //     student.AcademyId && dispatch(await setStudentSessions(student));
  //   fetchSession();
  //   //eslint-disable-next-line
  // }, [student.AcademyId]);

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
      // await post_feedback_to_question(
      //   selectedEvent.id,
      //   selectedEvent.tutorId,
      //   student.AcademyId,
      //   id,
      //   star
      // );
      updatedQuestions[questionIndex].star = star;
      setQuestions([...updatedQuestions]);

      // const rating =
      //   questions.reduce((sum, question) => {
      //     return question.star ? sum + question.star : sum;
      //   }, 0) / questions.length;

      // const withoutPhotoSession = { ...selectedEvent };
      // delete withoutPhotoSession.photo;
      // console.log(questions, rating);
      // dispatch(
      //   updateStudentLesson(withoutPhotoSession.id, {
      //     ...withoutPhotoSession,
      //     ratingByStudent: rating,
      //   })
      // );

      // dispatch(
      //   await setOnlySessions(
      //     [...feedbackData].map((slot) => {
      //       if (slot.id === selectedEvent.id) {
      //         return {
      //           ...slot,
      //           ratingByStudent: rating,
      //         };
      //       }
      //       return slot;
      //     })
      //   )
      // );
    }
  };

  const handleRowSelect = (event) => {
    setSelectedEvent(event);
  };

  // const handleDynamicSave = async (updatedSlot) => {
  //   const withoutPhotoSession = { ...updatedSlot };
  //   delete withoutPhotoSession.photo;
  //   console.log(withoutPhotoSession);

  //   const updatedSessionsData = [...feedbackData].map((slot) => {
  //     if (slot.id === withoutPhotoSession.id) {
  //       return withoutPhotoSession;
  //     }
  //     return slot;
  //   });
  //   dispatch(setOnlySessions(updatedSessionsData));
  //   dispatch(updateStudentLesson(withoutPhotoSession.id, withoutPhotoSession));
  // };

  useEffect(() => {
    if (!!selectedEvent?.commentByStudent?.length) {
      setComment(selectedEvent?.commentByStudent);
    } else {
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

          setQuestions(data);
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

  useEffect(() => {
    console.log( rawQuestions,  'questoon');
  }, [rawQuestions])

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
        ratingByStudent:
          questions.reduce((sum, question) => {
            sum = question.star + sum;
            return sum;
          }, 0) / questions.length,
        commentByStudent: comment,
      },
    ]);

    questions.map((ques) =>
      post_feedback_to_question(
        updatedLesson.id,
        updatedLesson.tutorId,
        student.AcademyId,
        ques.SID,
        ques.star,
        1
      )
    );

    dispatch(
      updateStudentLesson(updatedLesson.id, {
        ...updatedLesson,
        commentByStudent: comment,
        ratingByStudent: questions.reduce((sum, q) => q.star + sum, 0) / 5,
      })
    );

    toast.success("Saved Successfull123y");
    console.log(rawQuestions)
    setQuestions(rawQuestions);
    setSelectedEvent({});
    setComment("");
  };

  if (loading) return <Loading />;
  return (
    <div>
      <div className="container mt-1">
        <div className="py-2 row">
{/* {rawQuestions.map(q=><div className="">{q.star}-</div>)} */}

          <div className={` ${selectedEvent.id ? "col-md-12" : "col-md-12"}`}>
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
        </div>
      </div>
 
      <Actions saveDisabled={true} />
    </div>
  );
};

export default Feedback;
