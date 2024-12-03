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
import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { slotPillDateFormat } from "../../constants/constants";

const SlotsInvoice = ({
  selectedType,
  studentName,
  tutorName,
  invoiceNum,
  selectedSlots,
  subject,
  rate,
  handleAccept,
  handleClose,
  introDiscountEnabled,
  timeZone,
}) => {
  const { selectedTutor } = useSelector((state) => state.selectedTutor);
  const { lessons } = useSelector((state) => state.bookings);
  const { student } = useSelector((state) => state.student);



  const subtotal = (
    selectedSlots.length *
    (introDiscountEnabled && selectedType === "intro"
      ? rate.split("$")[1] / 2
      : rate.split("$")[1])
  ).toFixed(2);

  const rateHalf = (rate) => (rate.split("$")[1] / 2).toFixed(2);

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

  return (
    <> <div className="container mt-4" >
      <div className="row  border rounded-4 p-1 shadow">
        <div className="col-12 p-1" ref={invoiceRef}>
          <div className="">
            <div>
              <div className=" text-center p-0">
                <div className="w-100">
                  <img
                    src={logo}
                    width={100}
                    height={100}
                    alt="logo"
                    style={{ minWidth: "200px" }}
                  />
                </div>
              </div>
              <div className="">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center " style={{ fontSize: "16px" }}>
                      <span className="fs-5 font-weight-bold"> Invoice</span> #
                      {invoiceNum}
                    </div>
                    <div>Date: {showDate(currentTime())}</div>
                  </div>
                  {!extractLoggedinStudentLesson(lessons, selectedTutor, student).
                    some(lesson => lesson.type === "intro") &&
                    introDiscountEnabled && (
                      <h5
                        className="text-center mb-3 text-danger font-weight-bold"
                        style={{ fontSize: "16px" }}
                      >
                        Avail 50% discount for this Intro Session
                      </h5>
                    )}
                  <div className="d-flex justify-content-between">
                    <div style={{ fontSize: "12px" }}>
                      <span className="fs-6 font-weight-bold">Student: </span>
                      {studentName}
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      <span className="fs-6 font-weight-bold">Tutor: </span>{" "}
                      {tutorName}
                    </div>
                  </div>
                </div>
                <table
                  className="table table-borderless table-striped m-0"
                  style={{ fontSize: "12px" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{ width: "5%" }} // Set width to 5px here
                        className="border-0"
                      >
                        #
                      </th>
                      <th className="border-0" style={{ background: "#2471A3" }}>
                        Slot
                      </th>
                      <th className="border-0" style={{ background: "#2471A3" }}>
                        Subject
                      </th>
                      <th className="border-0" style={{ background: "#2471A3" }}>
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSlots.map((slot, index) => (
                      <tr key={index}>
                        <td style={{ width: "5px" }}>{index + 1}</td>
                        <td className="border-0">
                          {showDate(slot.start, slotPillDateFormat)}
                        </td>
                        <td className="border-0">{subject}</td>
                        <td className="border-0">
                          { rate}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border-0"></td>
                      <td className="border-0"></td>
                      <td className="border-0 text-dark">
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
                      <td className="border-0 fw-bold">${bookingFee}</td>
                    </tr>
                    {selectedTutor.activateSubscriptionOption && (
                      <tr>
                        <td className="border-0"></td>
                        <td className="border-0 fw-bold text-danger"></td>
                        <td className="border-0 fw-bold text-danger">
                          Discount({discountPercentage} %):
                        </td>
                        <td className="border-0 fw-bold text-danger">
                          -${discountAmount}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="border-0"></td>
                      <td className="border-0"></td>
                      <td className="border-0 fw-bold">Total Amount:</td>
                      <td className="border-0 fw-bold">${totalAmount}</td>
                    </tr>
                  </tbody>
                </table>


              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
      <div className="d-flex justify-content-between align-items-center px-3">
        <div className="d-flex " style={{ gap: "10px" }}>
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
        </div>
        <div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
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

