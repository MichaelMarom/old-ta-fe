// Import necessary dependencies
import { moment } from "../../../../config/moment";
import { v4 as uuidv4 } from "uuid";
import { filterOtherStudentAndTutorSession } from "./calenderUtils";
import { convertToDate } from "../Calendar";
import {
  postStudentBookings,
  postStudentLesson,
  updateStudentLesson,
} from "../../../../redux/student/studentBookings";
import { setStudentSessions } from "../../../../redux/student/studentSessions";
import { isEqualTwoObjectsRoot } from "../../../../utils/common";
import { FeedbackMissing } from "../ToastMessages";
import { update_student_lesson } from "../../../../axios/student";

export const handlePostpone = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  reservedSlots,
  bookedSlots,
  tutor,
  clickedSlot,
  navigate,
  setDisableHourSlots,
  disableHourSlots,
  //
  selectedTutor,
  isStudentLoggedIn,
  student,
  studentId,
  lessons
) => {
  setIsTutorSideSessionModalOpen(false);
  // let { reservedSlots: updatedReservedSlot, bookedSlots: updatedBookedSlots } =
  //   filterOtherStudentAndTutorSession(
  //     reservedSlots,
  //     bookedSlots,
  //     tutor.AcademyId,
  //     clickedSlot.studentId,
  //     //
  //     tutor,
  //     selectedTutor,
  //     isStudentLoggedIn,
  //     reservedSlots,
  //     student,
  //     bookedSlots,
  //     studentId
  //   );
  handleDisableSlot(
    convertToDate(clickedSlot.start),
    setDisableHourSlots,
    disableHourSlots
  );
  dispatch(
    updateStudentLesson(clickedSlot.id, { ...clickedSlot, request: "postpone" })
  );
  // if (clickedSlot.type === "booked") {
  //   dispatch(
  //     postStudentBookings({
  //       studentId: clickedSlot.studentId,
  //       tutorId: tutor.AcademyId,
  //       subjectName: clickedSlot.subjectName,
  //       bookedSlots: updatedBookedSlots.map((slot) =>
  //         slot.id === clickedSlot.id ? { ...slot, request: "postpone" } : slot
  //       ),
  //       reservedSlots: updatedReservedSlot,
  //     })
  //   );
  //   return;
  // }
  // if (clickedSlot.type === "intro" || clickedSlot.type === "reserved") {
  //   dispatch(
  //     postStudentBookings({
  //       studentId: clickedSlot.studentId,
  //       tutorId: tutor.AcademyId,
  //       subjectName: clickedSlot.subjectName,
  //       bookedSlots: updatedBookedSlots,
  //       reservedSlots: updatedReservedSlot.map((slot) =>
  //         slot.id === clickedSlot.id ? { ...slot, request: "postpone" } : slot
  //       ),
  //     })
  //   );
  // }
  // navigate(`/tutor/chat`);
};

// Function to handle deleting sessions by tutor
export const handleDeleteSessionByTutor = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  reservedSlots,
  bookedSlots,
  tutor,
  clickedSlot,
  navigate,
  //
  selectedTutor,
  isStudentLoggedIn,
  student,
  studentId
) => {
  setIsTutorSideSessionModalOpen(false);
  // let { reservedSlots: updatedReservedSlot, bookedSlots: updatedBookedSlots } =
  //   filterOtherStudentAndTutorSession(
  //     reservedSlots,
  //     bookedSlots,
  //     tutor.AcademyId,
  //     clickedSlot.studentId,
  //     //
  //     tutor,
  //     selectedTutor,
  //     isStudentLoggedIn,
  //     reservedSlots,
  //     student,
  //     bookedSlots,
  //     studentId
  //   );

  dispatch(
    updateStudentLesson(clickedSlot.id, { ...clickedSlot, request: "delete" })
  );
  // if (clickedSlot.type === "booked") {
  //   dispatch(
  //     postStudentBookings({
  //       studentId: clickedSlot.studentId,
  //       tutorId: tutor.AcademyId,
  //       subjectName: clickedSlot.subjectName,
  //       bookedSlots: updatedBookedSlots.map((slot) =>
  //         slot.id === clickedSlot.id ? { ...slot, request: "delete" } : slot
  //       ),
  //       reservedSlots: updatedReservedSlot,
  //     })
  //   );
  //   return;
  // }
  // if (clickedSlot.type === "intro" || clickedSlot.type === "reserved") {
  //   dispatch(
  //     postStudentBookings({
  //       studentId: clickedSlot.studentId,
  //       tutorId: tutor.AcademyId,
  //       subjectName: clickedSlot.subjectName,
  //       bookedSlots: updatedBookedSlots,
  //       reservedSlots: updatedReservedSlot.map((slot) =>
  //         slot.id === clickedSlot.id ? { ...slot, request: "delete" } : slot
  //       ),
  //     })
  //   );
  // }
  navigate(`/tutor/chat`);
};

// Function to handle disabling slots
export const handleDisableSlot = (
  start,
  setDisableHourSlots,
  disableHourSlots
) => {
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

// TODO: check params
// Function to handle bulk event creation
export const handleBulkEventCreate = async (
  type,
  invoiceNum,
  //
  toast,
  passedReservedSlots,
  dispatch,
  student,
  tutorId,
  selectedTutor,
  selectedSlots,
  studentId,
  clickedSlot,
  navigate,
  subjectName,
  //
  tutor,
  isStudentLoggedIn,
  passedBookedSlots,
  lessons
) => {
  if (
    passedReservedSlots?.some((slot) =>
      isEqualTwoObjectsRoot(slot, clickedSlot)
    )
  ) {
    let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession(
      //
      passedReservedSlots,
      passedBookedSlots,
      tutorId,
      clickedSlot.studentId,
      //
      tutor,
      selectedTutor,
      isStudentLoggedIn,
      passedReservedSlots,
      student,
      passedBookedSlots,
      studentId
    );
    toast.info("inside bulk 1st condition");

    console.log(passedReservedSlots, reservedSlots, "pas, rese");

    // dispatch(
    //   postStudentBookings({
    //     studentId,
    //     tutorId,
    //     subjectName,
    //     bookedSlots: [
    //       ...bookedSlots,
    //       { ...clickedSlot, title: "Booked", type: "booked" },
    //     ],
    //     reservedSlots: reservedSlots.filter(
    //       (slot) => slot.id !== clickedSlot.id
    //     ),
    //   })
    // );
    return;
  }

  //intro session not conducted
  // if (
  //   lessons?.some((slot) => {
  //     return (
  //       slot.type === "intro" &&
  //       slot.subject === selectedTutor.subject &&
  //       slot.studentId === student.AcademyId &&
  //       slot.end.getTime() > new Date().getTime()
  //     );
  //   })
  // ) {
  //   return toast.warning(
  //     ` Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`
  //   );
  // }
  // //feedback missing
  // if (
  //   lessons?.some((slot) => {
  //     return (
  //       slot.type === "intro" &&
  //       slot.subject === selectedTutor.subject &&
  //       slot.studentId === student.AcademyId &&
  //       slot.end.getTime() < new Date().getTime() &&
  //       !slot.rating
  //     );
  //   })
  // ) {
  //   return toast.warning(
  //     <FeedbackMissing
  //       handleButtonClick={() => navigate("/student/feedback")}
  //       subject={selectedTutor.subject}
  //       buttonText={"Feedback"}
  //     />,
  //     { autoClose: false }
  //   );
  // }

  //limit of max 6 lslot reservation at /bookingone time
  if (
    selectedSlots.length &&
    selectedSlots[0].type === "reserved" &&
    passedReservedSlots.length > 6
  ) {
    toast.warning("You Can Reserve no more than 6 slots");
    return;
  }

  const updatedSelectedSlots = selectedSlots?.map((slot) => {
    return {
      ...slot,
      type,
      // id: uuidv4(),
      title:
        type === "reserved"
          ? "Reserved"
          : type === "intro"
          ? "Intro"
          : "Booked",
      studentName: student.FirstName,
      studentId: student.AcademyId,
      // createdAt: new Date(),
      subject: selectedTutor.subject,
      // invoiceNum: invoiceNum,
      tutorId: selectedTutor.academyId,
      rate:
        type === "intro" && selectedTutor.introDiscountEnabled
          ? parseInt(selectedTutor.rate.split("$")[1]) / 2
          : parseInt(selectedTutor.rate.split("$")[1]),
      // rate:
      //   type === "intro" && selectedTutor.introDiscountEnabled
      //     ? `$${parseInt(selectedTutor.rate.split("$")[1]) / 2}.00`
      //     : selectedTutor.rate,
    };
  });

  //handle delete type later todo
  if (type === "reserved" || type === "intro") {
    // let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession(
    //   passedReservedSlots,
    //   passedBookedSlots,
    //   tutor.AcademyId,
    //   clickedSlot.studentId,
    //   //
    //   tutor,
    //   selectedTutor,
    //   isStudentLoggedIn,
    //   passedReservedSlots,
    //   student,
    //   passedBookedSlots,
    //   studentId
    // );

    updatedSelectedSlots.map((lesson) => {
      dispatch(postStudentLesson(lesson));
    });
    // dispatch(
    //   postStudentBookings({
    //     studentId: student.AcademyId,
    //     tutorId: selectedTutor.academyId,
    //     reservedSlots: reservedSlots.concat(updatedSelectedSlots),
    //     bookedSlots,
    //     subjectName: selectedTutor.subject,
    //   })
    // );
  } else if (type === "booked") {
    updatedSelectedSlots.map((lesson) => {
      dispatch(postStudentLesson(lesson));
    });
    // let { reservedSlots, bookedSlots } = filterOtherStudentAndTutorSession(
    //   passedReservedSlots,
    //   passedBookedSlots,
    //   tutor.AcademyId,
    //   clickedSlot.studentId,
    //   //
    //   tutor,
    //   selectedTutor,
    //   isStudentLoggedIn,
    //   passedReservedSlots,
    //   student,
    //   passedBookedSlots,
    //   studentId
    // );
    // console.log(passedReservedSlots, reservedSlots, bookedSlots, "ded");
    // dispatch(
    //   postStudentBookings({
    //     studentId: student.AcademyId,
    //     tutorId: selectedTutor.academyId,
    //     reservedSlots,
    //     bookedSlots: bookedSlots.concat(updatedSelectedSlots),
    //     subjectName: selectedTutor.subject,
    //   })
    // );
  }
  // student.AcademyId && dispatch(await setStudentSessions(student));
};

// Function to handle removing reserved slots
// export const handleRemoveReservedSlot = (
//   passedReservedSlots,
//   //
//   dispatch,
//   studentId,
//   tutorId,
//   subjectName,
//   bookedSlots,

//   //
//   tutor,
//   clickedSlot,
//   selectedTutor,
//   isStudentLoggedIn,
//   student
// ) => {
//   let { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots } =
//     filterOtherStudentAndTutorSession(
//       passedReservedSlots,
//       bookedSlots,
//       tutor.AcademyId,
//       clickedSlot.studentId,
//       //
//       tutor,
//       selectedTutor,
//       isStudentLoggedIn,
//       passedReservedSlots,
//       student,
//       bookedSlots,
//       studentId
//     );
//   dispatch(
//     postStudentBookings({
//       studentId,
//       tutorId: tutorId,
//       subjectName,
//       bookedSlots,
//       reservedSlots: updatedReservedSlots,
//     })
//   );
// };

// Function to handle rescheduling sessions
// export const handleRescheduleSession = (
//   passedReservedSlots,
//   bookedSlots,

//   //
//   dispatch,
//   studentId,
//   subjectName,
//   tutor,
//   //
//   clickedSlot,
//   selectedTutor,
//   isStudentLoggedIn,
//   student
// ) => {
//   let { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots } =
//     filterOtherStudentAndTutorSession(
//       passedReservedSlots,
//       bookedSlots,
//       tutor.AcademyId,
//       clickedSlot.studentId,
//       tutor,
//       selectedTutor,
//       isStudentLoggedIn,
//       passedReservedSlots,
//       student,
//       bookedSlots,
//       studentId
//     );
//   dispatch(
//     postStudentBookings({
//       studentId,
//       tutorId: selectedTutor.academyId,
//       subjectName,
//       bookedSlots: updatedBookedSlots,
//       reservedSlots: updatedReservedSlots,
//     })
//   );
// };

// Function to handle setting reserved slots
// export const handleSetReservedSlots = (
//   lessons,
//   studentId,

//   dispatch,
//   tutorId,
//   subjectName,
//   bookedSlots,
//   isStudentLoggedIn,

//   tutor,
//   //
//   clickedSlot,
//   selectedTutor,
//   student
// ) => {
//   // let { reservedSlots: updatedReservedSlots, bookedSlots: updatedBookedSlots } =
//   //   filterOtherStudentAndTutorSession(
//   //     reservedSlots,
//   //     bookedSlots,
//   //     tutor.AcademyId,
//   //     clickedSlot.studentId,
//   //     //
//   //     tutor,
//   //     selectedTutor,
//   //     isStudentLoggedIn,
//   //     reservedSlots,
//   //     student,
//   //     bookedSlots,
//   //     studentId
//   //   );

//   console.log(lessons, lessons.filter((les) => les.type !== "reserved").length);
//   // dispatch(
//   //   postStudentLesson({
//   //     studentId: studentId,
//   //     tutorId: isStudentLoggedIn ? tutorId : tutor.AcademyId,
//   //     subjectName,
//   //     bookedSlots,
//   //     reservedSlots: updatedReservedSlots,
//   //   })
//   // );
// };
