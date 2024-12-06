import React, { useEffect, useState } from "react";
import LeftSideBar from "../LeftSideBar";
import SlotPill from "../../student/SlotPill";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SlotsInvoice from "../../student/SlotsInvoice";
import {
  convertTutorIdToName,
  formatName,
  generateRandomId,
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
  updateStudentBookingWithInvoiceAndLessons,
  updateStudentLesson,
} from "../../../redux/student/studentBookings";
import { calculateDiscount, extractLoggedinStudentLesson } from "../Calendar/utils/calenderUtils";
import PaymentDetailsModal from "../../student/PaymentDetailsModal";
import TAButton from '../TAButton'

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
  selectedType,
  setSelectedType
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lessons } = useSelector((state) => state.bookings);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const [rescheduleTime, setRescheduleTime] = useState(
    moment().add(1, "hours").set({ minute: 0 }).toDate()
  );
  const [invoiceNum, setInvoiceNum] = useState(null);

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

  const convertReservedToBooked = () => {
    const invoice = {
      InvoiceId: generateRandomId(),
      StudentId: student.AcademyId,
      TutorId: selectedTutor.academyId,
      TotalLessons: 1,
      DiscountAmount: selectedTutor.activateSubscriptionOption ?
        calculateDiscount(lessons, selectedSlots, selectedTutor, student) : 0,
      InvoiceDate: moment().utc()
    }
    dispatch(updateStudentBookingWithInvoiceAndLessons(invoice, clickedSlot.id,
      { ...clickedSlot, type: "booked", title: "Booked" }))
  }

  const handleAccept = () => {
    if (clickedSlot.id) {
      convertReservedToBooked()
    }
    else {
      handleBulkEventCreate(
        selectedType,
        dispatch,
        student,
        selectedTutor,
        selectedSlots,
        navigate,
        lessons
      );
    }
    onRequestClose();
    setClickedSlot({})
    setSelectedType(null);
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

  const conductedAndReviewedIntroLesson = () => {
    const introExist = lessons?.some((slot) =>
      slot.type === "intro" &&
      slot.subject === selectedTutor.subject &&
      slot.studentId === student.AcademyId &&
      slot.tutorId === selectedTutor.academyId
    );


    const feedbackedIntro = lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId &&
        slot.tutorId === selectedTutor.academyId &&
        slot.end.getTime() < (new Date()).getTime() &&
        slot.ratingByStudent
      );
    });
    return { introExist, feedbackedIntro };
  };
  let subscription_cols = [
    { Header: "Package" },
    { Header: "Hours" },
    { Header: "Discount" },
  ];

  let subscription_discount = [
    { discount: "0%", hours: "1-5", package: "A-0" },
    { discount: "5.0%", hours: "6-11", package: "A-6" },
    { discount: "10.0%", hours: "12-17", package: "A-12" },
    { discount: "15.0%", hours: "18-23", package: "A-18" },
    { discount: "20.0%", hours: "24+", package: "A-24" },
  ];
  useEffect(() => {
    if (selectedTutor.activateSubscriptionOption && !!selectedSlots.length && !!extractLoggedinStudentLesson(lessons, selectedTutor, student).some(lesson => lesson.type === "intro")) {
      let message = '';
      if (selectedSlots.length < 6) {
        const remainingSlots = 6 - selectedSlots.length;
        message = `Book ${remainingSlots} more ${remainingSlots > 1 ? 'slots' : 'slot'} to get 5% discount.`;
      } else if (selectedSlots.length < 12) {
        const remainingSlots = 12 - selectedSlots.length;
        message = `Book ${remainingSlots} more ${remainingSlots > 1 ? 'lessons' : 'lesson'} to get 10% discount.`;
      } else if (selectedSlots.length < 18) {
        const remainingSlots = 18 - selectedSlots.length;
        message = `Book ${remainingSlots} more ${remainingSlots > 1 ? 'lessons' : 'lesson'} to get 15% discount.`;
      } else if (selectedSlots.length < 24) {
        const remainingSlots = 24 - selectedSlots.length;
        message = `Book ${remainingSlots} more ${remainingSlots > 1 ? 'lessons' : 'lesson'} to get 20% discount.`;
      }
      message.length && toast.info(message, { className: 'setup-private-info' })
    }
  }, [lessons, selectedSlots, selectedTutor, student]);

  return (
    <>
      <LeftSideBar
        isOpen={isOpen}
        onClose={() => {
          onRequestClose();
          setSelectedType(null);
        }}
      >
        <div>
          <div className="modal-header">
            <h6 className="m-0 modal-title text-centerd-block" style={{ width: "80%" }}>
              Marked Slots for Booking.
            </h6>
          </div>
          <p className="p-2" style={{ fontSize: "13px", fontWeight: "600" }}>To delete a lesson from the invoice below click the delete icon</p>
          <div className="">
            {clickedSlot.request === "postpone" && (
              <h5 className="text-danger font-weight-bold text-center m-2">
                {convertTutorIdToName(clickedSlot.tutorId)} is requesting
                Reschedule
              </h5>
            )}
            {/* {clickedSlot.start ? (
              <div>
                <SlotPill
                  selectedSlots={[clickedSlot]}
                  handleRemoveSlot={() => setClickedSlot({})}
                  selectedType={!!extractLoggedinStudentLesson(lessons, selectedTutor, student).some(lesson => lesson.type === "intro") ?
                    'booked' : 'intro'}
                />
              </div>
            ) : (
              <div>
                <SlotPill
                  selectedSlots={selectedSlots}
                  handleRemoveSlot={handleRemoveSlot}
                  selectedType={!!extractLoggedinStudentLesson(lessons, selectedTutor, student).some(lesson => lesson.type === "intro") ?
                    'booked' : 'intro'}
                />
              </div>
            )} */}
            {/* {selectedType === "reserved" && (
              <div className=" d-flex justify-content-center">
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
            )} */}
            <div className="form-group d-flex flex-column">
              {(!conductedAndReviewedIntroLesson().introExist &&
                !clickedSlot.type) ? (
                <></>
                // <button
                //   type="button"
                //   className={` btn btn-sm btn-primary`}
                //   disabled={clickedSlot.start}
                //   onClick={() => setSelectedType("intro")}
                // >
                //   Mark as Intro Session
                // </button>
              ) : (
                // ((conductedAndReviewedIntroLesson().introExist &&
                //   conductedAndReviewedIntroLesson().feedbackedIntro) ||
                //   clickedSlot.start) && (
                <>
                  {/* {((clickedSlot.start && clickedSlot.type === "reserved") ||
                    (!clickedSlot.start && conductedAndReviewedIntroLesson().introExist &&
                      conductedAndReviewedIntroLesson().feedbackedIntro)) && (
                      <button
                        type="button"
                        className=" btn btn-sm btn-success"
                        onClick={() => setSelectedType("booked")}
                      >
                        Book This Session!
                      </button>
                    )} */}
                  {/* {(!clickedSlot.start && (conductedAndReviewedIntroLesson().introExist &&
                    conductedAndReviewedIntroLesson().feedbackedIntro)) && (
                      <button
                        type="button"
                        className="btn  btn-sm btn-warning"
                        style={{ background: "yellow" }}
                        disabled={clickedSlot.start}
                        onClick={() => {
                          selectedSlots.length > 6 ?
                            toast.warning("You reached the limit of 6 reserved lessons, You must book any reserved lesson before you can reserve more.") :
                            setSelectedType("reserved")
                            // handleAccept()
                        }}
                      >
                        Mark as Reserved Session
                      </button>
                    )} */}
                  {/* {clickedSlot.start && (
                    <button
                      type="button"
                      className=" btn btn-sm btn-danger"
                      onClick={() => setSelectedType("delete")}
                    >
                      Delete
                    </button>
                  )} */}
                  {clickedSlot.request === "postpone" && (
                    <div className="d-flex justify-content-between align-items-center h-100">
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

          {/* <div>
            <div className="rounded d-flex text-dark m-1" style={{ background: "#f7f5f6", fontWeight: "600" }}>
              <div className={`rounded p-3 m-1 ${selectedType === "booked" ? "bg-success-light" : ""}`}>Booking</div>
              <div className={`rounded p-3  m-1 ${selectedType === "intro" ? "bg-success" : ""}`}>Intro</div>

              <div className={`rounded p-3 m-1 ${selectedType === "reserved" ? "bg-success" : ""}`}>Reserve</div>

            </div>
          </div> */}

          {clickedSlot.id && (
            <div className=" p-4">
              <hr />
              <p className="text-danger">
                Are you sure you want to delete your Marked slot?
              </p>
              <hr />
              <div style={{ float: "right" }} >
                <TAButton style={{ margin: "0" }} type="button" buttonText={"Confirm"} handleClick={() => {
                  dispatch(deleteStudentLesson(clickedSlot));
                  setClickedSlot({});
                  onRequestClose();
                }} />
              </div>
            </div>
          )}

          {!!selectedSlots.length && (
            <SlotsInvoice
              timeZone={timeZone}
              setSelectedSlots={setSelectedSlots}
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
              handleAccept={() => setPaymentModalOpen(true)}
              handleClose={onRequestClose}
            />)}

          <div className="w-100 d-flex flex-column">
            {selectedTutor.activateSubscriptionOption && !!selectedSlots.length && (
              <>
                <table className="" style={{ width: "90%", margin: "5%" }}>
                  <thead>
                    <tr>
                      <th colSpan={3}>
                        Subscription Discount
                      </th>
                    </tr>
                    <tr>
                      {subscription_cols.map((item) => (
                        <th key={item.Header}>{item.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscription_discount.map((item, index) => (
                      <tr key={index}>
                        <td>{item.package}</td>

                        <td>{item.hours}</td>

                        <td>{item.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* {selectedTutor.activateSubscriptionOption && (
          <table className="" style={{ width: "90%", margin: "5%" }}>
            <thead>
              <tr>
                {subscription_cols.map((item) => (
                  <th key={item.Header}>{item.Header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscription_discount.map((item, index) => (
                <tr key={index}>
                  <td>{item.package}</td>

                  <td>{item.hours}</td>

                  <td>{item.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}
        </div>
      </LeftSideBar>
      <PaymentDetailsModal open={paymentModalOpen} handleAccept={() => { handleAccept(); setPaymentModalOpen(false) }} onClose={() => setPaymentModalOpen(false)} />
    </>
  );
}

export default EventModal;
