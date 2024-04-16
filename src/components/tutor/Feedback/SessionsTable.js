import React, { useEffect, useState } from 'react';
import { wholeDateFormat } from '../../../constants/constants';
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import Comment from './Comment';
import StarRating from '../../common/StarRating';
import { convertToDate } from '../../common/Calendar/Calendar';
import { useSelector } from 'react-redux';
import Tooltip from '../../common/ToolTip';
import TAButton from '../../common/TAButton'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions';

function SessionsTable({
  events,
  setSelectedEvent,
  selectedEvent,
}) {
  const { shortlist } = useSelector(state => state.shortlist)
  const [sortedEvents, setSortedEvents] = useState([])

  useEffect(() => {
    const updatedEvents = events.map(event => {
      const matchingTutor = shortlist.find(tutor => {
        return (tutor.AcademyId[0] === event.tutor
          || (tutor.AcademyId[0] === event.tutorId))
      })

      if (matchingTutor) {
        return {
          ...event,
          photo: matchingTutor.Photo,
        };
      }

      return event;
    });

    const sortedEvents = updatedEvents.sort((a, b) => {
      const startDateA = new Date(a.start);
      const startDateB = new Date(b.start);

      return startDateB - startDateA;
    })
    setSortedEvents(sortedEvents)

  }, [events, shortlist]);
  const Header = [{
    width: "14%",
    title: "Photo"
  }, {
    width: "14%",
    title: "Screen Id"
  }, {
    width: "14%",
    title: "Date"
  }, {
    width: "14%",
    title: "Subject"
  }, {
    width: "14%",
    title: "Rating"
  }, {
    width: "14%",
    title: "Comment"
  },
  {
    width: "14%",
    title: "Action"
  }]

  return (
    <>
      <div className='d-flex rounded justify-content-between align-items-center  p-2' style={{ color: "white", background: "#2471A3" }}>
        {Header.map(header => {
          return <div className='text-center d-flex flex-column'
            style={{ width: header.width }}>
            <p className='m-0' key={header.title} > {header.title}</p>
          </div>
        })}
      </div>
      <div style={{ height: "57vh", overflowY: "auto" }}>

      <table >
        <thead className="thead-light d-none"  >
          <tr>
            <th style={{ position: "relative" }}>Photo</th>
            <th style={{ position: "relative" }}>Screen Id</th>

            <th scope="col" className='col-md-3' style={{ position: "relative" }}>Date</th>
            <th scope="col" className='col-md-2' style={{ position: "relative" }}>Lesson</th>
            <th scope="col" className='col-md-3' style={{ position: "relative" }}>Rating</th>
            <th scope="col" style={{ position: "relative" }}>Comment</th>
            <th scope="col" style={{ position: "relative" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event, index) => (
            <tr key={index}>
              <td style={{ width: Header[0].width }}>
                <Tooltip text={event.studentId}>
                  <img src={event.photo} alt={event.studentId} height={60} width={60} />
                </Tooltip>
              </td>
              <td style={{ width: Header[0].width }}>{convertTutorIdToName(event.studentId)}</td>

              <td style={{ width: Header[0].width }}>{showDate(convertToDate(event.start), wholeDateFormat)}</td>
              <td style={{ width: Header[0].width }}>{event.subject}({event.type})</td>

              <td style={{ width: Header[0].width }}><StarRating rating={event.tutorRating} /></td>
              <td style={{ width: Header[0].width }}>
                <Comment comment={event.tutorComment} />
              </td>

              <td style={{ width: Header[0].width }}>

                <TAButton className={``} buttonText={'Select'}
                  style={{ animation: (event.tutorFeedbackEligible && !event.tutorRating) ? 'blinking 1s infinite' : 'none' }}
                  onClick={() => setSelectedEvent(event)} disabled={!event.tutorFeedbackEligible}
                />
                {/* <button className={`btn ${selectedEvent.id === event.id ? 'btn-success' : 'btn-primary'} `}
                style={{ animation: (event.tutorFeedbackEligible && !event.tutorRating) ? 'blinking 1s infinite' : 'none' }}
                onClick={() => setSelectedEvent(event)} disabled={!event.tutorFeedbackEligible}>Select</button> */}
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
