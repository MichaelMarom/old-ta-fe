import React from "react";
import CenteredModal from "./Modal";
import QuestionFeedback from "../tutor/Feedback/QuestionFeedback";

import TAButton from "./TAButton";
import { CiClock2 } from "react-icons/ci";
import { Tooltip } from "react-bootstrap";
import DebounceInput from "./DebounceInput";
import { showDate } from "../../utils/moment";
import { wholeDateFormat } from "../../constants/constants";
import Avatar from "./Avatar";
import { MdReviews } from "react-icons/md";

const FeedbackModal = ({
  handleClose,
  studentSide = false,
  selectedEvent,
  setSelectedEvent,
  questions,
  questionLoading,
  handleEmojiClick,
  comment,
  setComment,
  handleSaveFeedback,
}) => {
  return (
    <CenteredModal
      isTitleReactNode
      title={
        <div className="d-flex align-items-center">
          <Avatar avatarSrc={selectedEvent.photo} />
          <div>
            {/* TODO: fix name */}
            <h6 className="m-0 text-start">{studentSide ? selectedEvent.tutorScreenName : selectedEvent.studentName}</h6>
            <p className="fw-bold" style={{ fontSize: "12px" }}>
              {selectedEvent.subject}
              {`(${selectedEvent.type})`}
            </p>
            <p className="fw-bold text-secondary" style={{ fontSize: "12px" }}>
              <CiClock2 size={17} />{" "}
              {showDate(selectedEvent.start, wholeDateFormat)}
            </p>
          </div>
        </div>
      }
      show={selectedEvent.id}
      handleClose={handleClose}
    >
      <div
        className=" "
        style={{ overflowY: "auto" }}
      >
        <div className="d-flex" >
          <h6>Average Score: </h6>
          <p> {questions.reduce((sum, question) => (question.star || 0) + sum, 0) / 5}</p>
        </div>
        <div className="questions">
          <QuestionFeedback
            loading={questionLoading}
            questions={questions}
            handleEmojiClick={handleEmojiClick}
          />
          <div className="form-group m-3">
            <label style={{ fontSize: "10px" }} htmlFor="exampleTextarea">
              Please write a short description of your impression about this
              lesson
              <Tooltip text={"Instructions how to grade freehand notes."} />
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
          <TAButton buttonText={"cancel"} handleClick={handleClose} />
          <TAButton buttonText={"save"} handleClick={handleSaveFeedback} />
        </div>
      </div>
    </CenteredModal>
  );
};

export default FeedbackModal;
