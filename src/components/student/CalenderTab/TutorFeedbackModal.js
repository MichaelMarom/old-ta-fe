import React, { useEffect, useState } from "react";
import { get_feedback_to_question } from "../../../axios/calender";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../utils/moment";
import LeftSideBar from "../../common/LeftSideBar";
import { SessionFeedback } from "../../common/EventModal/TutorEventModal/SessionFeedback";
import CenteredModal from "../../common/Modal";

export const TutorFeedbackModal = ({
  isOpen,
  onClose,
  clickedSlot,
  showTutorFeedback,
  handlePostpone,
  handleDeleteSessionByTutor,
}) => {
  const [questions, setQuestions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  useEffect(() => {
    if (clickedSlot.id) {
      setQuestionLoading(true);
      const fetchFeedbackToQuestion = async () => {
        const data = await get_feedback_to_question(
          clickedSlot.id,
          clickedSlot.tutorId,
          clickedSlot.studentId,
          0
        );
        if (data?.length) {
          const uniqueData = data.reduce((uniqueQuestions, currentQuestion) => {
            return uniqueQuestions.find(
              (item) => item.questionText === currentQuestion.questionText
            )
              ? uniqueQuestions
              : [...uniqueQuestions, currentQuestion];
          }, []);
          setQuestions(uniqueData);
        }
        setQuestionLoading(false);
      };
      fetchFeedbackToQuestion();
    }
  }, [clickedSlot]);

  return (
    <CenteredModal
      isTitleReactNode
      title={
        <div className="text-center" style={{ width: "90%" }}>
          <p
            className="modal-title fs-5"
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            {showDate(clickedSlot.start, wholeDateFormat)} -{" "}
            {clickedSlot.tutorScreenName}
          </p>
        </div>
      }
      show={isOpen}
      handleClose={onClose}
    >
      <div className="">
        {
          !clickedSlot.ratingByTutor ? (
            <div
              className="p-3 text-danger text-center"
              style={{ fontWeight: "700" }}
            >
              No feedback given for this session!
            </div>
          ) : (
            <SessionFeedback
              clickedSlot={clickedSlot}
              questions={questions}
              questionLoading={questionLoading}
              showTutorFeedback={showTutorFeedback}
            />
          )
        }
      </div>
    </CenteredModal>
  );
};
