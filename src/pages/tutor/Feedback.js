import React, { useEffect, useState } from "react";
import TutorLayout from "../../layouts/TutorLayout";
import { showDate } from "../../helperFunctions/timeHelperFunctions";
import QuestionFeedback from "../../components/tutor/Feedback/QuestionFeedback";
import SessionsTable from "../../components/tutor/Feedback/SessionsTable";
import { wholeDateFormat } from "../../constants/constants";
import {
  feedback_records,
  get_tutor_feedback_questions,
} from "../../axios/tutor";
import {
  get_feedback_to_question,
  post_feedback_to_question,
} from "../../axios/student";

import { useDispatch, useSelector } from "react-redux";
import { postStudentBookings } from "../../redux/student/studentBookings";
import { toast } from "react-toastify";
import Actions from "../../components/common/Actions";
import Tooltip from "../../components/common/ToolTip";
import Loading from "../../components/common/Loading";
import DebounceInput from "../../components/common/DebounceInput";
import _ from "lodash";

const Feedback = () => {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState({});
  const [questionLoading, setQuestionLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [comment, setComment] = useState("");
  const [questions, setQuestions] = useState([]);
  const [rawQuestions, setRawQuestions] = useState([]);

  const [pendingChange, setPendingChange] = useState(null);
  const { tutor } = useSelector((state) => state.tutor);
  const { isLoading } = useSelector((state) => state.bookings);
  const [fetchingSessions, setFetchingFeedbackSessions] = useState(false);

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

  useEffect(() => {
    const getFeedback = async () => {
      if (tutor.AcademyId && tutor.timeZone) {
        setFetchingFeedbackSessions(true);
        const records = await feedback_records(tutor.AcademyId, tutor.timeZone);
        setFetchingFeedbackSessions(false);

        !!records?.length && setFeedbackData(records);
      }
    };
    getFeedback();
  }, [tutor.AcademyId, tutor.timeZone]);

  const handleRowSelect = () => {};

  const handleEmojiClick = async (id, star) => {
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex(
      (question) => question.SID === id
    );

    if (questionIndex !== -1) {
      await post_feedback_to_question(
        selectedEvent.id,
        tutor.AcademyId,
        selectedEvent.studentId,
        id,
        star,
        0
      );
      updatedQuestions[questionIndex].star = star;
      setQuestions([...updatedQuestions]);
      const updatedSlots = feedbackData.map((slot) => {
        if (slot.id === selectedEvent.id) {
          slot.tutorRating =
            questions.reduce((sum, question) => {
              sum = question.star + sum;
              return sum;
            }, 0) / questions.length;
        }
        return slot;
      });

      const removedPhotoSessions = updatedSlots.map((sessions) => {
        const { photo, ...rest } = sessions;
        return rest;
      });
      dispatch(
        postStudentBookings({
          studentId: selectedEvent.studentId,
          tutorId: tutor.AcademyId,
          bookedSlots: removedPhotoSessions.filter(
            (slot) =>
              slot.type === "booked" &&
              slot.studentId === selectedEvent.studentId &&
              slot.tutorId === tutor.AcademyId
          ),
          reservedSlots: removedPhotoSessions.filter(
            (slot) =>
              slot.type !== "booked" &&
              slot.studentId === selectedEvent.studentId &&
              slot.tutorId === tutor.AcademyId
          ),
        })
      );
      setFeedbackData(
        feedbackData.map((slot) => {
          if (slot.id === selectedEvent.id) {
            slot.tutorRating =
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

  const handleDynamicSave = async (updatedSlots) => {
    const removedPhotoSessions = updatedSlots.map((sessions) => {
      const { photo, ...rest } = sessions;
      return rest;
    });
    const data = dispatch(
      postStudentBookings({
        studentId: selectedEvent.studentId,
        tutorId: tutor.AcademyId,
        bookedSlots: removedPhotoSessions.filter(
          (slot) =>
            slot.id === "booked" &&
            slot.studentId === selectedEvent.studentId &&
            slot.tutorId === tutor.AcademyId
        ),
        reservedSlots: removedPhotoSessions.filter(
          (slot) =>
            slot.id !== "booked" &&
            slot.studentId === selectedEvent.studentId &&
            slot.tutorId === tutor.AcademyId
        ),
      })
    );
    data?.response?.status === 400 &&
      toast.error("Error while saving the data");
  };

  useEffect(() => {
    // Show loading toast when loadingState is true
    if (isLoading) {
      toast.info("Loading...", {
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        bodyClassName: "loading-toast-body",
        autoClose: 500,
      });
    } else {
      // Hide the loading toast when isLoading is false
      // toast.dismiss();
    }
  }, [isLoading]);

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
      setComment(selectedEvent.tutorComment ? selectedEvent.tutorComment : "");
    } else setComment("");
    setQuestions((prevValue) =>
      prevValue.map((question) => ({ ...question, star: null }))
    );
  }, [selectedEvent.id, selectedEvent.tutorComment, tutor]);

  if (fetchingSessions) return <Loading />;
  return (
    <TutorLayout>
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
                  student as soon as possible.
                </div>
                <SessionsTable
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
              style={{ height: "75vh", overflowY: "auto" }}
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
                      const updatedSlots = feedbackData.map((slot) => {
                        if (slot.id === selectedEvent.id) {
                          slot.tutorComment = comment;
                        }
                        return slot;
                      });

                      setFeedbackData(updatedSlots);
                      setSelectedEvent({ ...selectedEvent, comment });
                      handleDynamicSave(updatedSlots);
                    }}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  {/* <TAButton buttonText="Save" handleClick={() => ()} /> */}
                  {/* <textarea
                    className="form-control"
                    id="exampleTextarea"
                    rows="4"
                    value={comment}
                    onChange={handleTextChange}
                  /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Actions saveDisabled />
    </TutorLayout>
  );
};

export default Feedback;
