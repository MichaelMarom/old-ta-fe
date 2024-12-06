import React, { useRef } from "react";
import { showDate } from "../../utils/moment";
import logo from "../../assets/images/tutoring Logo.png";
import moment from "moment-timezone";
import { HiPrinter } from "react-icons/hi2";
import { MdDownloadForOffline } from "react-icons/md";
import Tooltip from "../common/ToolTip";
import ReactToPrint from "react-to-print";
import { calculateDiscount, extractLoggedinStudentLesson } from "../common/Calendar/utils/calenderUtils";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { slotPillDateFormat } from "../../constants/constants";
import { BsTrash, BsTrash2 } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { deleteStudentLesson } from "../../redux/student/studentBookings";

const SlotsInvoice = ({
  selectedType,
  studentName,
  tutorName,
  invoiceNum,
  selectedSlots,
  setSelectedSlots,
  rate,
  handleAccept,
  handleClose,
  introDiscountEnabled,
  timeZone,
}) => {
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const { lessons } = useSelector((state) => state.bookings);
  const { student } = useSelector((state) => state.student);
  const dispatch = useDispatch()

  const subtotal = (
    selectedSlots.length *
    (introDiscountEnabled && selectedType === "intro"
      ? rate.split("$")[1] / 2
      : rate.split("$")[1])
  ).toFixed(2);

  const bookingFee = parseFloat(process.env.REACT_APP_LESSON_BOOKING_FEE || 0);
  // Discount calculation
  const discountPercentage = (!extractLoggedinStudentLesson(lessons, selectedTutor, student).
    some(lesson => lesson.type === "intro") && introDiscountEnabled ? 50 :
    selectedTutor.activateSubscriptionOption
      ? calculateDiscount([], selectedSlots)
      : 0);

  const discountAmount = ((subtotal * discountPercentage) / 100).toFixed(2);

  // Total after discount
  const totalAfterDiscount = (subtotal - discountAmount).toFixed(2);

  // Final total (after discount + booking fee)
  const totalAmount = (
    parseFloat(totalAfterDiscount) +
    parseFloat(bookingFee)
  ).toFixed(2);

  const currentTime = () => {
    const currentDate = moment().tz(timeZone).toDate();
    return currentDate;
  };

  const invoiceRef = useRef(null);

  const handleDelete = (event) => {
    dispatch(deleteStudentLesson({ ...event, studentId: student.AcademyId, tutorId: selectedTutor.academyId }))
    setSelectedSlots(selectedSlots.filter(slot => slot.id !== event.id))
  }
  console.log(lessons.length)

  return (
    <>
      <div className="p-2 mt-4" >
        <table
          className=" m-0"
          style={{ fontSize: "12px" }}
        >
          <thead>
            <tr>
              <th colspan="4">Invoice (proposed)</th>
            </tr>
            <tr>
              <th
                style={{ width: "5%" }} // Set width to 5px here

              >
                #
              </th>
              <th style={{ background: "#2471A3" }}>
                Delete
              </th>
              <th style={{ background: "#2471A3" }}>
                Slot
              </th>

              <th style={{ background: "#2471A3" }}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedSlots.map((slot, index) => (
              <tr key={index}>
                <td style={{ width: "5px" }}>{index + 1}</td>
                <td className=" ">
                  <div className="d-flex w-fit-content justify-content-center">
                    <div onClick={() => handleDelete(slot)}
                      style={{ width: "30px", height: "30px" }}
                      className="click-effect-elem d-flex justify-content-center align-items-center rounded-circle shadow ">
                      <FaTrashAlt />
                    </div>
                  </div>
                </td>
                <td >
                  {showDate(slot.start, slotPillDateFormat)}
                </td>

                <td >
                  {rate}
                </td>
              </tr>
            ))}
            <tr>
              <td ></td>
              <td ></td>
              <td className=" text-dark">
                <div className="d-flex gap-1">
                  <Tooltip
                    iconSize={15}
                    text={
                      "There is a one-time booking charge for each invoice when you book one or multiple lessons."
                    }
                    width="200px"
                  />
                  <p>Booking Fee:</p>
                </div>
              </td>
              <td className=" fw-bold">${bookingFee}</td>
            </tr>
            {selectedTutor.activateSubscriptionOption && (
              <tr>
                <td ></td>
                <td className=" fw-bold text-danger"></td>
                <td className=" fw-bold text-danger">
                  Discount({discountPercentage} %):
                </td>
                <td className=" fw-bold text-danger">
                  -${discountAmount}
                </td>
              </tr>
            )}
            <tr>
              <td ></td>
              <td ></td>
              <td className=" fw-bold">Total Amount:</td>
              <td className=" fw-bold">${totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div >
      <div className="d-flex justify-content-between align-items-center px-3">
        {/* <div className="d-flex " style={{ gap: "10px" }}>
          <ReactToPrint
            trigger={() => (
              <HiPrinter
                size={20}
                style={{ cursor: "pointer" }}
              />
            )}
            content={() => invoiceRef.current}
          />
          <Tooltip text={"Download invoice"}>
            <MdDownloadForOffline
              size={20}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </div> */}
        <div className="w-100 d-flex justify-content-center">
          <button
            className="btn btn-sm btn-danger"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={handleAccept}
          >
            Pay Invoice
          </button>
        </div>
      </div>
    </>
  );
};

export default SlotsInvoice;

