import React, { useEffect, useState } from "react";
import LeftSideBar from "../LeftSideBar";
import SlotPill from "../../student/SlotPill";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SlotsInvoice from "../../student/SlotsInvoice";
import {
  convertTutorIdToName,
  formatName,
  isEqualTwoObjectsRoot,
} from "../../../utils/common";
import { convertToDate } from "../Calendar/Calendar";
import Button from "../Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { moment } from "../../../config/moment";
import { useNavigate } from "react-router-dom";
import {
  deleteStudentLesson,
  updateStudentLesson,
} from "../../../redux/student/studentBookings";

function EventModal({
  isStudentLoggedIn = false,
  student = {},
  isOpen,
  onRequestClose,
  selectedSlots,
  setSelectedSlots,
  handleBulkEventCreate,
  clickedSlot,
  setClickedSlot,
  timeZone,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const { lessons } = useSelector((state) => state.bookings);
  const { tutor } = useSelector((state) => state.tutor);
  const [canPostEvents, setCanPostEvents] = useState(true);
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const [rescheduleTime, setRescheduleTime] = useState(
    moment().add(1, "hours").set({ minute: 0 }).toDate()
  );
  const [invoiceNum, setInvoiceNum] = useState(null);

  const formatUTC = (dateInt, addOffset = false) => {
    let date = !dateInt || dateInt.length < 1 ? new Date() : new Date(dateInt);
    const currentDate = new Date();
    if (date < currentDate) {
      return null; // You can also throw an error here if you prefer
    }
    if (typeof dateInt === "string") {
      return date;
    } else {
      const offset = addOffset
        ? date.getTimezoneOffset()
        : -date.getTimezoneOffset();
      const offsetDate = new Date();
      offsetDate.setTime(date.getTime() + offset * 60000);
      return offsetDate;
    }
  };

  useEffect(() => {
    if (clickedSlot.id) {
      setRescheduleTime(moment(clickedSlot.start).add(1, "hours").toDate())
    }
  }, [clickedSlot.id]);

  const handleReschedule = () => {

    const sessionOnSameTime =
      convertToDate(clickedSlot.start).getTime() ===
      convertToDate(rescheduleTime).getTime();

    const sessionExistOnSelectedTime = lessons.filter((slot) =>
      moment
        .utc(convertToDate(slot.start))
        .isSame(moment.utc(convertToDate(rescheduleTime)))
    );

    if (sessionOnSameTime)
      return toast.warning("Session is already on the same time!");
    if (sessionExistOnSelectedTime.length)
      return toast.warning("Session is already exist for that time!");

    const rescheduleEndTime = moment(convertToDate(rescheduleTime)).add(
      1,
      "hours"
    );

    dispatch(
      updateStudentLesson(clickedSlot.id, {
        ...clickedSlot,
        start: rescheduleTime,
        end: rescheduleEndTime.toDate(),
        request: null,
      })
    );

    onRequestClose();
    setSelectedType(null);
  };

  const handleRemoveSlot = (startTime) => {
    setSelectedSlots(
      selectedSlots.filter(
        (slot) => slot.start.getTime() !== startTime.getTime()
      )
    );
  };

  const handleAccept = () => {
    if (canPostEvents) {
      handleBulkEventCreate(
        selectedType,
        dispatch,
        student,
        selectedTutor,
        selectedSlots,
        navigate,
        lessons
      );
      onRequestClose();
      setSelectedType(null);
    }
  };

  const generateNumberWithDate = () => {
    const today = moment();
    const datePart = today.format("DDMMYY");
    const randomTwoDigitNumber = Math.floor(Math.random() * 90) + 10;
    const generatedNumber = `${datePart}${randomTwoDigitNumber}`;
    return generatedNumber;
  };

  useEffect(() => {
    if (selectedType === "intro" || selectedType === "booked")
      setInvoiceNum(generateNumberWithDate());
    else {
      setInvoiceNum(null);
    }
  }, [selectedType]);

  useEffect(() => {
    const existIntroSession = lessons?.some(
      (slot) =>
        slot.type === "intro" &&
        selectedTutor.subject === slot.subject &&
        (!isStudentLoggedIn || slot.studentId === student.AcademyId)
    );
    if (
      existIntroSession &&
      selectedType === "intro" &&
      selectedSlots[0]?.start
    ) {
      toast.warning("Cannot add more than 1 Intro Session!");
      setCanPostEvents(false);
    } else if (
      !existIntroSession &&
      selectedType !== "intro" &&
      selectedSlots[0]?.start
    ) {
      setCanPostEvents(false);
      toast.warning(
        `Your first Session must be Introduction session for ${selectedTutor.subject}!`
      );
    } else if (
      existIntroSession &&
      selectedType === "intro" &&
      selectedSlots.length > 1
    ) {
      setCanPostEvents(false);
      toast.warning("Cannot book the same subject intro session twice!");
    } else {
      setCanPostEvents(true);
    }
  }, [
    selectedSlots,
    selectedType,
    lessons,
    isStudentLoggedIn,
    selectedTutor,
    student,
  ]);

  const conductedAndReviewedIntroLesson = () => {
    const introExist = lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId
        // slot.end.getTime() > new Date().getTime()
      );
    });
    const feedbackedIntro = lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId &&
        slot.end.getTime() < (new Date()).getTime() &&
        slot.ratingByStudent
      );
    });
    return { introExist, feedbackedIntro };
  };

  console.log(selectedSlots, clickedSlot, lessons, student, selectedTutor)
  return (
    <LeftSideBar
      isOpen={isOpen}
      onClose={() => {
        onRequestClose();
        setSelectedType(null);
      }}
    >
      <div className="">
        <div className="modal-header">
          <h4 className="modal-title text-center" style={{ width: "100%" }}>
            Selected Slots
          </h4>
        </div>
        <div className="">
          {clickedSlot.request === "postpone" && (
            <h5 className="text-danger font-weight-bold text-center m-2">
              {convertTutorIdToName(clickedSlot.tutorId)} is requesting
              Reschedule
            </h5>
          )}
          {clickedSlot.start ? (
            <div>
              <SlotPill
                selectedSlots={[clickedSlot]}
                handleRemoveSlot={() => setClickedSlot({})}
                selectedType={selectedType}
              />
            </div>
          ) : (
            <div>
              <SlotPill
                selectedSlots={selectedSlots}
                handleRemoveSlot={handleRemoveSlot}
                selectedType={selectedType}
              />
            </div>
          )}
          <div className="form-group d-flex flex-column">
            {(!conductedAndReviewedIntroLesson().introExist &&
              !clickedSlot.type) ? (
              <button
                type="button"
                className={` btn btn-sm btn-primary`}
                disabled={clickedSlot.start}
                onClick={() => setSelectedType("intro")}
              >
                Mark as Intro Session
              </button>
            ) : (
              // ((conductedAndReviewedIntroLesson().introExist &&
              //   conductedAndReviewedIntroLesson().feedbackedIntro) ||
              //   clickedSlot.start) && (
              <>
                {((clickedSlot.start && clickedSlot.type === "reserved" ) || (!clickedSlot.start && conductedAndReviewedIntroLesson().introExist &&
                  conductedAndReviewedIntroLesson().feedbackedIntro) ) && (
                    <button
                      type="button"
                      className=" btn btn-sm btn-success"
                      onClick={() => setSelectedType("booked")}
                    >
                      Mark as Booking Session
                    </button>
                  )}
                {(!clickedSlot.start && (conductedAndReviewedIntroLesson().introExist &&
                  conductedAndReviewedIntroLesson().feedbackedIntro)) && (
                    <button
                      type="button"
                      className="btn  btn-sm btn-warning"
                      style={{ background: "yellow" }}
                      disabled={clickedSlot.start}
                      onClick={() => setSelectedType("reserved")}
                    >
                      Mark as Reserved Session
                    </button>
                  )}
                {clickedSlot.start && (
                  <button
                    type="button"
                    className=" btn btn-sm btn-danger"
                    onClick={() => setSelectedType("delete")}
                  >
                    Delete
                  </button>
                )}
                {clickedSlot.request === "postpone" && (
                  <div className="d-flex justify-content-between align-items-center h-100">
                    {/* <DatePicker
                        selected={formatUTC(rescheduleTime, true)}
                        onChange={(date) => setRescheduleTime(formatUTC(date))}
                        showTimeSelect
                        dateFormat="MMM d, yyyy hh:mm aa"
                        className="form-control m-2 w-80"
                        timeIntervals={60}
                      /> */}
                    <DatePicker
                      selected={rescheduleTime}
                      onChange={(date) => setRescheduleTime(date)}
                      showTimeSelect
                      dateFormat="MMM d, yyyy hh:mm aa"
                      className="form-control m-2 w-80"
                      timeIntervals={60}
                    />
                    <Button
                      className="btn-success btn-sm"
                      onClick={() => handleReschedule()}
                    >
                      Postpone
                    </Button>
                  </div>
                )}
              </>
              //)
            )}
          </div>
        </div>

        {selectedType === "delete" && (
          <div className=" p-4">
            <hr />
            <p className="text-danger">
              Are you sure you want to delete your reservation?!
            </p>
            <hr />
            <div>
              <button
                type="button"
                className="action-btn btn btn-sm float-end"
                onClick={() => {
                  dispatch(deleteStudentLesson(clickedSlot));
                  // handleRemoveReservedSlot(
                  //   reservedSlots.filter(
                  //     (slot) => !isEqualTwoObjectsRoot(slot, clickedSlot)
                  //   ),
                  //   //
                  //   dispatch,
                  //   studentId,
                  //   tutorId,
                  //   subjectName,
                  //   bookedSlots,
                  //   //
                  //   tutor,
                  //   clickedSlot,
                  //   selectedTutor,
                  //   isStudentLoggedIn,
                  //   student
                  // );
                  setClickedSlot({});
                  onRequestClose();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
        {selectedType === "reserved" && (
          <div className="modal-footer">
            <button
              type="button"
              className="action-btn btn btn-sm"
              onClick={handleAccept}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onRequestClose();
                setSelectedType(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {(selectedType === "intro" || selectedType === "booked") && (
          <div>
            <SlotsInvoice
              timeZone={timeZone}
              selectedType={selectedType}
              studentName={formatName(student.FirstName, student.LastName)}
              tutorName={formatName(
                selectedTutor.firstName,
                selectedTutor.lastName
              )}
              invoiceNum={invoiceNum}
              selectedSlots={clickedSlot.start ? [clickedSlot] : selectedSlots}
              subject={selectedTutor.subject}
              rate={selectedTutor.rate}
              introDiscountEnabled={selectedTutor.introDiscountEnabled}
              handleAccept={handleAccept}
              handleClose={onRequestClose}
            />
          </div>
        )}
      </div>
    </LeftSideBar>
  );
}

export default EventModal;
