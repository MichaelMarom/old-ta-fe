import React from "react";
import { showDate } from "../../../utils/moment";
import { wholeDateFormat } from "../../../constants/constants";
import AmountCalc from "./AmountCalc";
import Actions from "../../common/Actions";

const AccountingTable = ({
  paymentReportData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {

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
    
      </div>
      <Actions saveDisabled />
    </div>
  );
};

export default AccountingTable;
