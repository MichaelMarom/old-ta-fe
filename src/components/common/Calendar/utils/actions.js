// Import necessary dependencies
import { moment } from "../../../../config/moment";
import { convertToDate } from "../Calendar";
import {
  postStudentBookingWithInvoiceAndLessons,
  postStudentLesson,
  updateStudentLesson,
} from "../../../../redux/student/studentBookings";
import { FeedbackMissing } from "../ToastMessages";
import { toast } from "react-toastify";
import { emitSocketNotification, generateRandomId } from "../../../../utils/common";
import { calculateDiscount } from "./calenderUtils";
import { socket } from "../../../../config/socket";

export const handlePostpone = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  clickedSlot,
  setDisableHourSlots,
  disableHourSlots,
  navigate,
) => {
  setIsTutorSideSessionModalOpen(false);
  handleDisableSlot(
    convertToDate(clickedSlot.start),
    setDisableHourSlots,
    disableHourSlots
  );
  dispatch(
    updateStudentLesson(clickedSlot.id, { ...clickedSlot, request: "postpone" })
  );
  toast.success(
    "You have Successfully sent Postpone request! You are redirecting to Chat Page to Talk to your subject's student About this."
  );

  // socket.emit("postpone_request", {
  //   title: "Meeting Postponed",
  //   recieverId: clickedSlot.studentId,
  //   doerName: clickedSlot.tutorScreenName
  // })
  emitSocketNotification("postpone_request",
    clickedSlot.studentId,
    clickedSlot.tutorScreenName,
    "Meeting Postponed",
    "lesson pospone request",
    "tutor",
    clickedSlot.tutorId
  )

  setTimeout(() => {
    navigate(`/tutor/chat`);
  }, 4000);
};

// Function to handle deleting sessions by tutor
export const handleDeleteSessionByTutor = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  clickedSlot,
  navigate
) => {
  setIsTutorSideSessionModalOpen(false);
  dispatch(
    updateStudentLesson(clickedSlot.id, { ...clickedSlot, request: "delete" })
  );

  emitSocketNotification('notif_incoming',
    clickedSlot.studentId,
    clickedSlot.tutorScreenName,
    "Tutor Removed Lesson",
    `Tutor has removed lesson on date: ${showDate(convertToDate(clickedSlot.start))}`,
    "student",
    clickedSlot.tutorId
  )

  toast.success(
    "You have Successfully sent Delete request! You are redirecting to Chat Page to Talk to your subject's student About this."
  );

  setTimeout(() => {
    navigate(`/tutor/chat`);
  }, 4000);
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
  dispatch,
  student,
  selectedTutor,
  selectedSlots,
  navigate,
  lessons
) => {
  //intro session not conducted
  if (student.Status !== "active")
    return toast.warning("Only Active Students Can Book Lessons");
  if (
    lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId &&
        slot.tutorId === selectedTutor.academyId &&
        slot.end.getTime() > new Date().getTime()
      );
    })
  ) {
    return toast.warning(
      `Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`
    );
  }
  // //feedback missing
  if (
    lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId &&
        slot.tutorId === selectedTutor.academyId &&
        slot.end.getTime() < new Date().getTime() &&
        !slot.ratingByStudent
      );
    })
  ) {
    return toast.warning(
      <FeedbackMissing
        handleButtonClick={() => navigate("/student/feedback")}
        subject={selectedTutor.subject}
        buttonText={"Feedback"}
      />,
      { autoClose: false }
    );
  }

  //limit of max 6 lslot reservation at /bookingone time
  // if (
  //   selectedSlots.length &&
  //   selectedSlots[0].type === "reserved" &&
  //   lessons.map((les) => les.type === "reserved").length > 6
  // ) {
  //   toast.warning("You can not Reserve more than 6 slots");
  //   return;
  // }

  const updatedSelectedSlots = selectedSlots?.map((slot) => {
    return {
      ...slot,
      title:
        slot.type === "reserved"
          ? "Reserved"
          : slot.type === "intro"
            ? "Intro"
            : "Booked",
      studentName: student.FirstName,
      studentId: student.AcademyId,
      subject: selectedTutor.subject,
      tutorScreenName: selectedTutor.tutorScreenName,
      // invoiceNum: invoiceNum, // TODO: send same invoiceNumber for grouped selected slots, currently setting invoiceNumber differntly for indivualy slot
      tutorId: selectedTutor.academyId,
      rate:
        // type === "intro" && selectedTutor.introDiscountEnabled
        // ? parseInt(selectedTutor.rate.split("$")[1]) / 2:
        parseInt(selectedTutor.rate.split("$")[1]),
    };
  });
  console.log(selectedTutor)
  //handle delete type later todo
  if (selectedSlots[0].type === "intro") {
    const invoice = {
      InvoiceId: generateRandomId(),
      StudentId: student.AcademyId,
      TutorId: selectedTutor.academyId,
      TotalLessons: updatedSelectedSlots.length,
      DiscountAmount: selectedTutor.introDiscountEnabled ? 50 : 0,
      InvoiceDate: moment().utc()
    }
    dispatch(postStudentBookingWithInvoiceAndLessons(invoice, updatedSelectedSlots));

    // socket.emit("newLessonsEvent", {
    //   doerName: student.FirstName,
    //   title: "New Intro Lesson",
    //   message: "New Lesson Booked By student. Go to your calendar and contact your student fro further details",
    //   recieverId: selectedTutor.academyId
    // })

    emitSocketNotification("newLessonsEvent",
      selectedTutor.academyId,
      student.FirstName,
      "New Intro Lesson",
      "New Lesson Booked By student. Go to your calendar and contact your student fro further details",
      "student",
      student.AcademyId
    )

  } else if (selectedSlots[0].type === "booked") {
    const invoice = {
      InvoiceId: generateRandomId(),
      StudentId: student.AcademyId,
      TutorId: selectedTutor.academyId,
      TotalLessons: updatedSelectedSlots.length,
      DiscountAmount: selectedTutor.activateSubscriptionOption ?
        calculateDiscount(lessons, selectedSlots, selectedTutor, student) : 0,
      InvoiceDate: moment().utc()
    }
    emitSocketNotification("newLessonsEvent",
      selectedTutor.academyId,
      student.FirstName,
      "New Booked Lesson",
      "New Lesson Booked By student. Go to your calendar and contact your student fro further details",
      "student",
      student.AcademyId
    )
    // socket.emit("newLessonsEvent", {
    //   doerName: student.FirstName,
    //   title: "New Booked Lesson",
    //   message: "New Lesson Booked By student. Go to your calendar and contact your student fro further details",
    //   recieverId: selectedTutor.academyId
    // })
    dispatch(postStudentBookingWithInvoiceAndLessons(invoice, updatedSelectedSlots));
  }
  else {
    updatedSelectedSlots.map(lesson => dispatch(postStudentLesson(lesson)))
  }
  // student.AcademyId && dispatch(await setStudentSessions(student));
};
