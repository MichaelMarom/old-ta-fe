import React, { useRef } from "react";
import { showDate } from "../../utils/moment";
import logo from "../../assets/images/tutoring Logo.png";
import moment from "moment-timezone";
import { HiPrinter } from "react-icons/hi2";
import { MdDownloadForOffline } from "react-icons/md";
import Tooltip from "../common/ToolTip";
import ReactToPrint from "react-to-print";

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
  const subtotal =
    (selectedSlots.length *
      (introDiscountEnabled && selectedType === "intro"
        ? ((rate.split("$")[1]) / 2)
        : (rate.split("$")[1]))).toFixed(2);

  const rateHalf = (rate) => ((rate.split("$")[1]) / 2).toFixed(2);
  const currentTime = () => {
    const currentDate = moment().tz(timeZone).toDate();
    return currentDate;
  };
  const invoiceRef = useRef(null)

  return (
    <div className="container mt-4" ref={invoiceRef}>
      <div className="row">
        <div className="col-12 p-2">
          <div className="card">
            <div>
              <div className="card-header text-center p-0">
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
              <div className="card-body">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center " style={{ fontSize: "16px" }}>
                      <span className="fs-5 font-weight-bold"> Invoice</span> #
                      {invoiceNum}
                    </div>
                    <div>Date: {showDate(currentTime())}</div>
                  </div>
                  {selectedType === "intro" && introDiscountEnabled && (
                    <h5
                      className="text-center mb-3 text-danger font-weight-bold"
                      style={{ fontSize: "16px" }}
                    >
                      Avail 50% discount for this Intro Session
                    </h5>
                  )}
                  <div className="d-flex justify-content-between px-2">
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
                  className="table table-borderless table-striped"
                  style={{ fontSize: "12px" }}
                >
                  <thead>
                    <tr>
                      <th
                        className="  border-0"
                        style={{ background: "#2471A3" }}
                      >
                        Slot
                      </th>
                      <th className=" border-0" style={{ background: "#2471A3" }}>
                        Subject
                      </th>
                      <th
                        className="  border-0"
                        style={{ background: "#2471A3" }}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSlots.map((slot, index) => (
                      <tr key={index}>
                        <td className="border-0">{showDate(slot.start)}</td>
                        <td className="border-0">{subject}</td>
                        {introDiscountEnabled && selectedType === "intro" ? (
                          <>
                            <td className="border-0">
                              {" "}
                              <s>{rate}</s> ${rateHalf(rate)}
                            </td>
                          </>
                        ) : (
                          <td className="border-0"> {rate}</td>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="border-0 fw-bold">Subtotal:</td>
                      <td className="border-0"></td>
                      <td className="border-0 fw-bold">${subtotal}</td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex " style={{ gap: "10px" }}>
                <ReactToPrint
                  trigger={() => (
                    <HiPrinter
                      size={20}
                      style={{ cursor: "pointer" }}
                    // onClick={() => window.print()}
                    />
                  )}
                  content={() => invoiceRef.current}
                />
                <Tooltip text={"download invoice"}>
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
                  Book Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsInvoice;
