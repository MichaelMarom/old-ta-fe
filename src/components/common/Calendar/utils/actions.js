// Import necessary dependencies
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { filterOtherStudentAndTutorSession } from './calenderUtils';
import { convertToDate } from '../Calendar';
import { postStudentBookings } from '../../../../redux/student/studentBookings';

// Import API or dispatch here

// Function to handle postponing sessions
export const handlePostpone = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  reservedSlots,
  bookedSlots,
  tutor,
  clickedSlot,
  navigate
) => {
  setIsTutorSideSessionModalOpen(false);
  let {
    reservedSlots: updatedReservedSlot,
    bookedSlots: updatedBookedSlots,
  } = filterOtherStudentAndTutorSession(
    reservedSlots,
    bookedSlots,
    tutor.AcademyId,
    clickedSlot.studentId
  );
  handleDisableSlot(convertToDate(clickedSlot.start));
  if (clickedSlot.type === "booked") {
    dispatch(
      postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots.map((slot) =>
          slot.id === clickedSlot.id ? { ...slot, request: "postpone" } : slot
        ),
        reservedSlots: updatedReservedSlot,
      })
    );
    return;
  }
  if (clickedSlot.type === "intro" || clickedSlot.type === "reserved") {
    dispatch(
      postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots,
        reservedSlots: updatedReservedSlot.map((slot) =>
          slot.id === clickedSlot.id ? { ...slot, request: "postpone" } : slot
        ),
      })
    );
  }
  navigate(`/tutor/chat`);
};

// Function to handle deleting sessions by tutor
export const handleDeleteSessionByTutor = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  reservedSlots,
  bookedSlots,
  tutor,
  clickedSlot,

  navigate
) => {
  setIsTutorSideSessionModalOpen(false);
  let {
    reservedSlots: updatedReservedSlot,
    bookedSlots: updatedBookedSlots,
  } = filterOtherStudentAndTutorSession(
    reservedSlots,
    bookedSlots,
    tutor.AcademyId,
    clickedSlot.studentId
  );
  if (clickedSlot.type === "booked") {
    dispatch(
      postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots.map((slot) =>
          slot.id === clickedSlot.id ? { ...slot, request: "delete" } : slot
        ),
        reservedSlots: updatedReservedSlot,
      })
    );
    return;
  }
  if (clickedSlot.type === "intro" || clickedSlot.type === "reserved") {
    dispatch(
      postStudentBookings({
        studentId: clickedSlot.studentId,
        tutorId: tutor.AcademyId,
        subjectName: clickedSlot.subjectName,
        bookedSlots: updatedBookedSlots,
        reservedSlots: updatedReservedSlot.map((slot) =>
          slot.id === clickedSlot.id ? { ...slot, request: "delete" } : slot
        ),
      })
    );
  }
  navigate(`/tutor/chat`);
};

// Function to handle disabling slots
export const handleDisableSlot = (setDisableHourSlots, disableHourSlots, convertToDate, moment, start) => {
  const end = moment(start).add(30, "minutes").toDate();

  const disableHourSlotExist = disableHourSlots?.some(
    (date) =>
      convertToDate(date).getTime() === convertToDate(start).getTime() ||
      convertToDate(end).getTime() === convertToDate(date).getTime()
  );
  if (!disableHourSlotExist) {
    return setDisableHourSlots([
      ...(disableHourSlots ?? []),
      convertToDate(start),
      convertToDate(end),
    ]);
  }
};

// Function to handle bulk event creation
export const handleBulkEventCreate = async (
  toast,
  reservedSlots,
  dispatch,
  student,
  tutorId,
  selectedTutor,
  selectedSlots,
  filterOtherStudentAndTutorSession,
  setStudentSessions
) => {
  // Implement the bulk event creation logic here
  // Make sure to use the dependencies and parameters as needed
};

// Function to handle removing reserved slots
export const handleRemoveReservedSlot = (
  dispatch,
  studentId,
  tutorId,
  subjectName,
  reservedSlots,
  bookedSlots,
  filterOtherStudentAndTutorSession
) => {
  let { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots } =
    filterOtherStudentAndTutorSession(reservedSlots, bookedSlots);
  dispatch(
    postStudentBookings({
      studentId,
      tutorId: tutorId,
      subjectName,
      bookedSlots,
      reservedSlots: updatedReservedSlots,
    })
  );
};

// Function to handle rescheduling sessions
export const handleRescheduleSession = (
  dispatch,
  studentId,
  tutorId,
  subjectName,
  reservedSlots,
  bookedSlots,
  filterOtherStudentAndTutorSession,

  tutor
) => {
  let {
    reservedSlots: updatedReservedSlots,
    bookedSlots: updatedBookedSlots,
  } = filterOtherStudentAndTutorSession(reservedSlots, bookedSlots, tutor.AcademyId);
  dispatch(
    postStudentBookings({
      studentId,
      tutorId: tutor.AcademyId,
      subjectName,
      bookedSlots: updatedBookedSlots,
      reservedSlots: updatedReservedSlots,
    })
  );
};

// Function to handle setting reserved slots
export const handleSetReservedSlots = (
    reservedSlots,
    studentId,

  dispatch,
  tutorId,
  subjectName,
  bookedSlots,
  isStudentLoggedIn,

  tutor
) => {
  let {
    reservedSlots: updatedReservedSlots,
    bookedSlots: updatedBookedSlots,
  } = filterOtherStudentAndTutorSession(reservedSlots, bookedSlots);

  dispatch(
    postStudentBookings({
      studentId: studentId,
      tutorId: isStudentLoggedIn ? tutorId : tutor.AcademyId,
      subjectName,
      bookedSlots,
      reservedSlots: updatedReservedSlots,
    })
  );
};
