import React, { useEffect, useState } from "react";
import { get_feedback_to_question } from "../../../../axios/calender";
import { wholeDateFormat } from "../../../../constants/constants";
import { showDate } from "../../../../utils/moment";
import { convertToDate } from "../../Calendar/Calendar";
import LeftSideBar from "../../LeftSideBar";
import { SessionActions } from "./SessionActions";
import { SessionFeedback } from "./SessionFeedback";
import CenteredModal from "../../Modal";
import { useSelector } from "react-redux";

export const TutorEventModal = ({
  isOpen,
  showTutorFeedback,
  onClose,
  clickedSlot,
  handlePostpone,
  handleDeleteSessionByTutor,
}) => {
  const [questions, setQuestions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {student} = useSelector(state=>state.student)

  useEffect(() => {
    if (clickedSlot.id && !student.AcademyId) {
      setQuestionLoading(true);
      const fetchFeedbackToQuestion = async () => {
        const data = await get_feedback_to_question(
          clickedSlot.id,
          clickedSlot.tutorId,
          clickedSlot.studentId,
          showTutorFeedback ? 0 : 1
        );
        if (data?.length) {
          //sometime duplicate questions are there, so we need to remove duplicate questions
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
  }, [clickedSlot, student.AcademyId]);

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <CenteredModal
      height="56vh"
      top={"300px"}
      isTitleReactNode
      show={isOpen}
      title={
        <div className="text-center" style={{ width: "90%" }}>
          <p
            className="modal-title fs-5"
            style={{ fontSize: "14px", fontWeight: "700" }}
          >
            {showDate(clickedSlot.start, wholeDateFormat)} - 
            {showTutorFeedback ? clickedSlot.tutorScreenName || "Unknown" : clickedSlot.studentName || "Unknown"}
          </p>
        </div>
      }
      handleClose={handleClose}
    >
      <div className="">
        {convertToDate(clickedSlot.end).getTime() <= new Date().getTime() ? (
          !clickedSlot.ratingByStudent ? (
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
              showTutorFeedback={showTutorFeedback}
              questionLoading={questionLoading}
            />
          )
        ) : (
          <SessionActions
            setConfirmDelete={setConfirmDelete}
            confirmDelete={confirmDelete}
            handlePostpone={handlePostpone}
            handleDeleteSessionByTutor={handleDeleteSessionByTutor}
            handleClose={handleClose}
          />
        )}
      </div>
    </CenteredModal>
  );
};
