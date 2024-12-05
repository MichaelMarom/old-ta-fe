import React from "react";
import { showDate } from "../../../utils/moment";
import { wholeDateFormat } from "../../../constants/constants";
import AmountCalc from "./AmountCalc";
import Actions from "../../common/Actions";

const AccountingTable = ({
  sortedAndPastLessons,
 
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 p-0">
          <h2>Payment Report</h2>
          {sortedAndPastLessons.length ? (
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
                    <th className="col-3">Date</th>
                    <th className="">Tutor</th>
                    <th className="">Subject</th>
                    <th className="">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndPastLessons
                    .filter((data) => data.type !== "reserved")
                    .map((row, index) => {
                      const lessonDate = new Date(row.start).getTime();
                      const isHighlighted = false
                        // startDate &&
                        // endDate &&
                        // lessonDate >= new Date(startDate).getTime() &&
                        // lessonDate <= new Date(endDate).getTime();

                      return (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: isHighlighted
                              ? "#d1e7dd" // Light green for highlighted rows
                              : "inherit",
                          }}
                        >
                          <td>{showDate(row.start, wholeDateFormat)}</td>
                          <td>{row.tutorScreenName || "Unknown"}</td>
                          <td>
                            {row.subject} ({row.title})
                          </td>
                          <td>${row.rate}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-danger">No Record Found</div>
          )}
        </div>
        <AmountCalc
          sortedAndPastLessons={sortedAndPastLessons}
        
        />
      </div>
      <Actions saveDisabled />
    </div>
  );
};

export default AccountingTable;
