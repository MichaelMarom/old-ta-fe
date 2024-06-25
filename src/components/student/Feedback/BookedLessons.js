import React, { useEffect, useState } from "react";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../utils/moment";
import Comment from "./Comment";
import StarRating from "../../common/StarRating";
import { convertToDate } from "../../common/Calendar/Calendar";
import { useSelector } from "react-redux";
import TAButton from "../../common/TAButton";
import { convertTutorIdToName } from "../../../utils/common";
import Avatar from "../../common/Avatar";
import { moment } from "../../../config/moment";

function BookedLessons({ events, handleRowSelect }) {
  const [sortedEvents, setSortedEvents] = useState([]);
  const { student } = useSelector((state) => state.student);
  useEffect(() => {
    const sortedEvents = events.sort((a, b) => {
      const startDateA = new Date(a.start);
      const startDateB = new Date(b.start);

      return startDateB - startDateA;
    });
    setSortedEvents(sortedEvents);
  }, [events]);

  const Header = [
    {
      width: "14%",
      title: "Photo",
    },
    {
      width: "14%",
      title: "Screen Id",
    },
    {
      width: "14%",
      title: "Date",
    },
    {
      width: "14%",
      title: "Subject",
    },
    {
      width: "14%",
      title: "Rating",
    },
    {
      width: "14%",
      title: "Comment",
    },
    {
      width: "14%",
      title: "Action",
    },
  ];

  const eligibleForFeedback = (session) => {
    if (session?.end) {
      const currentTimeInTimeZone = moment().tz(student.timeZone);

      const sessionEndInTimeZone = moment(session.end).tz(student.timeZone);
      const minutesDifference = sessionEndInTimeZone?.diff(
        currentTimeInTimeZone,
        "minutes"
      );
      if (minutesDifference <= 10) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <div
        className="d-flex rounded justify-content-between align-items-center  p-2"
        style={{ color: "white", background: "#2471A3" }}
      >
        {Header.map((header) => {
          return (
            <div
              className="text-center d-flex flex-column"
              key={header.title}
              style={{ width: header.width }}
            >
              <p className="m-0" key={header.title}>
                {" "}
                {header.title}
              </p>
            </div>
          );
        })}
      </div>
      <div style={{ height: "calc(100vh - 270px)", overflowY: "auto" }}>
        <table>
          <thead className="thead-light d-none">
            <tr>
              <th>Photo</th>
              <th scope="col" className="col-md-1">
                Screen Id
              </th>
              <th scope="col" className="col-md-2">
                Date
              </th>

              <th scope="col" className="col-md-2">
                Subject
              </th>
              <th scope="col" className="col-md-2">
                Rating
              </th>
              <th scope="col">Comment</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event, index) => (
              <tr
                key={index}
                style={{ color: event.type === "intro" ? "blue" : "inherit" }}
              >
                <td style={{ width: Header[0].width }}>
                  <Avatar showOnlineStatus={false} avatarSrc={event.photo} />
                </td>
                <td style={{ width: Header[0].width }}>
                  {convertTutorIdToName(event.tutorId)}
                </td>
                <td style={{ width: Header[0].width }}>
                  {showDate(convertToDate(event.start), wholeDateFormat)}
                </td>

                <td style={{ width: Header[0].width }}>
                  {event.subject} ({event.title})
                </td>

                <td style={{ width: Header[0].width }}>
                  <StarRating rating={event.rating} />
                </td>
                <td style={{ width: Header[0].width }}>
                  <Comment comment={event.comment} />
                </td>

                <td style={{ width: Header[0].width }}>
                  <TAButton
                    className={``}
                    buttonText={"Select"}
                    style={{
                      animation:
                       ( eligibleForFeedback(event) && !event.rating)
                          ? "blinking 1s infinite"
                          : "none",
                    }}
                    onClick={() => handleRowSelect(event)}
                    disabled={!eligibleForFeedback(event)}
                  />
                  {/* <button className={`btn ${selectedEvent.id === event.id ? 'btn-success' : 'btn-primary'} `}
                style={{ animation: (event.feedbackEligible && !event.rating) ? 'blinking 1s infinite' : 'none' }}
                onClick={() => handleRowSelect(event)} disabled={!event.feedbackEligible}>Select</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BookedLessons;
