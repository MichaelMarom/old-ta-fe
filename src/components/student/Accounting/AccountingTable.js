import React, { useState } from "react";
import { showDate } from "../../../utils/moment";
import { wholeDateFormat } from "../../../constants/constants";
import AmountCalc from "./AmountCalc";
import Actions from "../../common/Actions";
import { useSelector } from "react-redux";

const AccountingTable = ({ sortedAndPastLessons }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { student } = useSelector((state) => state.student);
    const timeZone = student.timeZone || "UTC"; // Default to UTC if no timezone is provided

    const toStudentTimeZone = (date) =>
        new Date(
            date.toLocaleString("en-US", {
                timeZone,
            })
        );

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
                                            const lessonDate = new Date(row.start);
                                            const adjustedDate = toStudentTimeZone(lessonDate).getTime();

                                            const isHighlighted =
                                                startDate &&
                                                endDate &&
                                                adjustedDate >=
                                                    new Date(startDate).setHours(0, 0, 0, 0) &&
                                                adjustedDate <=
                                                    new Date(endDate).setHours(23, 59, 59, 999);

                                            return (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        backgroundColor: isHighlighted
                                                            ? "#d1e7dd" // Light green for highlighted rows
                                                            : "inherit",
                                                    }}
                                                >
                                                    <td>
                                                        {/* {lessonDate.toLocaleString("en-US", {
                                                            timeZone,
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })} */}
                                                        {showDate(row.start, wholeDateFormat)}
                                                    </td>
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
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    sortedAndPastLessons={sortedAndPastLessons}
                />
            </div>
            <Actions saveDisabled />
        </div>
    );
};

export default AccountingTable;
