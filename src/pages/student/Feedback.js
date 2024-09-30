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

  console.log(rawQuestions, "rawQ");
  useEffect(() => {
    const getAllFeedbackQuestion = async () => {
      const data = await get_all_feedback_questions();
      if (!!data.length) {
        // If at any point, you set questions to the same array as rawQuestions without making a copy, changes in questions will still affect rawQuestions due to reference sharing. For example, this might happen during initialization in your useEffect or when resetting the state.
        // setQuestions([...data]);
        // setRawQuestions([...data]);
        setQuestions([...data.map((q) => ({ ...q }))]); // Deep copy
        setRawQuestions([...data.map((q) => ({ ...q }))]); // Deep copy
      }
    };
    getAllFeedbackQuestion();
  }, []);

  const handleEmojiClick = async (id, star) => {
    // Create a shallow copy of questions to avoid mutating the rawQuestions array
    // const updatedQuestions = questions.map((question) => ({ ...question }));
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(
      (question) => question.SID === id
    );

    if (questionIndex !== -1) {
      updatedQuestions[questionIndex].star = star;
      setQuestions(updatedQuestions); // Now this only updates questions, not rawQuestions
    }
  };

  const handleRowSelect = (event) => {
    setSelectedEvent(event);
  };

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
    // rawQuestions,
  ]);

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
    console.log(rawQuestions);
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
