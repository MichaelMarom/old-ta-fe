import React, { useEffect, useState } from "react";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../utils/moment";
import {moment } from '../../../config/moment'
import Comment from "./Comment";
import StarRating from "../../common/StarRating";
import { convertToDate } from "../../common/Calendar/Calendar";
import { useSelector } from "react-redux";
import Tooltip from "../../common/ToolTip";
import TAButton from "../../common/TAButton";
import { convertTutorIdToName } from "../../../utils/common";
import Avatar from "../../common/Avatar";

function SessionsTable({ events=[], setSelectedEvent, selectedEvent }) {
  const { tutor } = useSelector((state) => state.tutor);
  const [sortedEvents, setSortedEvents] = useState([]);

  const eligibleForFeedback = (session) => {
    if (session?.end) {
      const currentTimeInTimeZone = moment().tz(tutor.timeZone);

      const sessionEndInTimeZone = moment(session.end).tz(tutor.timeZone);
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

  useEffect(() => {
    // const updatedEvents = events.map(event => {
    //   const matchingTutor = shortlist.find(tutor => {
    //     return (tutor.AcademyId[0] === event.tutor
    //       || (tutor.AcademyId[0] === event.tutorId))
    //   })

    //   if (matchingTutor) {
    //     return {
    //       ...event,
    //       photo: matchingTutor.Photo,
    //     };
    //   }

    //   return event;
    // });

    let sorted = [...events].sort((a, b) => {
      const startDateA = new Date(a.start);
      const startDateB = new Date(b.start);

      return startDateB - startDateA;
    });
    setSortedEvents(sorted);
  }, [events]);

  const Header = [
    {
      width: "14%",
      title: "Photo",
    },
    {
      width: "14%",
      title: "Name",
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
              style={{ width: header.width }}
              key={header.title}
            >
              <p className="m-0" key={header.title}>
                {" "}
                {header.title}
              </p>
            </div>
          );
        })}
      </div>
      <div style={{ height: "calc(100vh - 280px)", overflowY: "auto" }}>
        <table>
          <tbody>
            {sortedEvents.map((event, index) => (
              <tr key={index}>
                <td style={{ width: Header[0].width }}>
                  <Avatar avatarSrc={event.photo} showOnlineStatus={false} />
                </td>
                <td style={{ width: Header[0].width }}>
                  {convertTutorIdToName(event.studentId)}
                </td>

                <td style={{ width: Header[0].width }}>
                  {showDate(convertToDate(event.start), wholeDateFormat)}
                </td>
                <td style={{ width: Header[0].width }}>
                  {event.subject}({event.type})
                </td>

                <td style={{ width: Header[0].width }}>
                  <StarRating rating={event.ratingByTutor} />
                </td>
                <td style={{ width: Header[0].width }}>
                  <Comment comment={event.commentByTutor} />
                </td>

                <td style={{ width: Header[0].width }}>
                  <TAButton
                    className={``}
                    buttonText={"Select"}
                    style={{
                      animation:
                        eligibleForFeedback(event) && !event.ratingByTutor
                          ? "blinking 1s infinite"
                          : "none",
                    }}
                    onClick={() => setSelectedEvent(event)}
                    disabled={!eligibleForFeedback(event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SessionsTable;
