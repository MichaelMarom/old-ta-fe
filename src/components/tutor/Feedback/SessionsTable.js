import React, { useEffect, useState } from "react";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../utils/moment";
import { moment } from "../../../config/moment";
import Comment from "./Comment";
import StarRating from "../../common/StarRating";
import { convertToDate } from "../../common/Calendar/Calendar";
import { useSelector } from "react-redux";
import TAButton from "../../common/TAButton";
import { convertTutorIdToName } from "../../../utils/common";
import Avatar from "../../common/Avatar";
import TableHeader from "../../common/TableHeader";
import { capitalize } from "lodash";
import Tooltip from "../../common/ToolTip";
import { FaComment, FaCommentAlt } from "react-icons/fa";

function SessionsTable({ events = [], setSelectedEvent, selectedEvent }) {
  const { tutor } = useSelector((state) => state.tutor);
  const [sortedEvents, setSortedEvents] = useState([]);

  const eligibleForFeedback = (session) => {
    if (session?.end && tutor.timeZone) {
      const currentTimeInTimeZone = moment().tz(tutor.timeZone);

      const sessionEndInTimeZone = moment(convertToDate(session.end)).tz(
        tutor.timeZone
      );
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

    let sorted = [...events].filter(eve=>eve.type!=="reserved").sort((a, b) => {
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
      {/* <div
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
      </div> */}
      <TableHeader headers={Header} />
      <div style={{ height: "calc(100vh - 280px)", overflowY: "auto" }}>
        <table>
          <tbody>
            {sortedEvents.map((event, index) => (
              <tr key={index}>
                <td style={{ width: Header[0].width }}>
                  <Avatar avatarSrc={event.photo} showOnlineStatus={false} />
                </td>
                <td style={{ width: Header[0].width }}>
                  {capitalize(event.studentName)}
                </td>

                <td style={{ width: Header[0].width }}>
                  {showDate(convertToDate(event.start), wholeDateFormat)}
                </td>
                <td style={{ width: Header[0].width }}>
                  {event.subject}({event.type})
                </td>

                <td style={{ width: Header[0].width }}>
                  {
                    event.ratingByTutor ? <div className="d-flex justify-content-center">
                      <Tooltip direction="top" width="50px" text={event.ratingByTutor}>
                        <StarRating rating={event.ratingByTutor} />
                      </Tooltip>
                    </div> :
                      <StarRating rating={event.ratingByTutor} />
                  }
                </td>
                <td style={{ width: Header[0].width }}>
                  {event.commentByTutor ? <div className="d-flex justify-content-center">
                    <Tooltip direction="bottomright" text={event.commentByTutor}>
                      <FaComment size={20} color="green" />
                    </Tooltip>
                  </div> :
                    <FaComment color="gray" />
                  }
                  {/* <Comment comment={event.commentByTutor} /> */}
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
