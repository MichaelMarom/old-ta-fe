import React from "react";
import { showDate } from "../../../utils/moment";
import { wholeDateFormat } from "../../../constants/constants";
import { convertTutorIdToName } from "../../../utils/common";
import AmountCalc from "./AmountCalc";
import Actions from "../../common/Actions";
import Button from "../../common/Button";
import CenteredModal from "../../common/Modal";
import { useState } from "react";

const AccountingTable = ({
  paymentReportData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [showVideoModal, setVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 p-0">
          <h2>Payment Report</h2>
          {paymentReportData.filter((data) => data.type !== "reserved")
            .length ? (
            <div
              className="p-3"
              style={{
                overflowY: "auto",
                height: "calc(100vh - 240px)",
              }}
            >
              <table>
                <thead className="thead-light">
                  <tr>
                    <th className=" col-3">Date</th>
                    <th className="">Tutor</th>
                    <th className="">Subject</th>
                    <th className="">Rate</th>
                    <th className="">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentReportData
                    .filter((data) => data.type !== "reserved")
                    .map((row, index) => (
                      <tr key={index}>
                        <td>{showDate(row.start, wholeDateFormat)}</td>
                        <td>{row.tutorScreenName || "Unknown"}</td>
                        <td>
                          {row.subject}
                          {row.title}
                        </td>
                        <td>${row.rate}</td>
                        <td>
                          <Button
                            onClick={() => {
                              setVideoUrl(row.Recording);
                              setVideoModal(true);
                            }}
                            disabled={
                              row.request === "delete" || !row.Recording
                            }
                            className={`btn-sm ${
                              row.request === "delete"
                                ? "btn-danger"
                                : "btn-primary"
                            }`}
                          >
                            {row.request === "delete"
                              ? "Cancelled"
                              : "View Video"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-danger">No Record Found</div>
          )}
        </div>
        <AmountCalc
          paymentReportData={paymentReportData.filter(
            (data) => data.type !== "reserved"
          )}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <CenteredModal
          show={showVideoModal}
          handleClose={() => {
            setVideoModal(false);
          }}
          title={"Lecture Video"}
        >
          <div>
            <video src={videoUrl} controls={true} width="100%" />
          </div>
        </CenteredModal>
      </div>
      <Actions saveDisabled />
    </div>
  );
};

export default AccountingTable;
