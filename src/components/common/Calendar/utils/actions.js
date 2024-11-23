// Import necessary dependencies
import { moment } from "../../../../config/moment";
import { convertToDate } from "../Calendar";
import {
  postStudentLesson,
  updateStudentLesson,
} from "../../../../redux/student/studentBookings";
import { FeedbackMissing } from "../ToastMessages";
import { toast } from "react-toastify";

export const handlePostpone = (
  setIsTutorSideSessionModalOpen,
  dispatch,
  clickedSlot,
  setDisableHourSlots,
  disableHourSlots,
  navigate
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
  type,
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
        slot.end.getTime() > new Date().getTime()
      );
    })
  ) {
    return toast.warning(
      ` Your intro session must be conducted first for the "${selectedTutor.subject}" LESSON`
    );
  }
  // //feedback missing
  if (
    lessons?.some((slot) => {
      return (
        slot.type === "intro" &&
        slot.subject === selectedTutor.subject &&
        slot.studentId === student.AcademyId &&
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
  if (
    selectedSlots.length &&
    selectedSlots[0].type === "reserved" &&
    lessons.map((les) => les.type === "reserved").length > 6
  ) {
    toast.warning("You Can not Reserve more than 6 slots");
    return;
  }

  const updatedSelectedSlots = selectedSlots?.map((slot) => {
    return {
      ...slot,
      type,
      title:
        type === "reserved"
          ? "Reserved"
          : type === "intro"
          ? "Intro"
          : "Booked",
      studentName: student.FirstName,
      studentId: student.AcademyId,
      subject: selectedTutor.subject,
      tutorScreenName:selectedTutor.tutorScreenName,
      // invoiceNum: invoiceNum, // TODO: send same invoiceNumber for grouped selected slots, currently setting invoiceNumber differntly for indivualy slot
      tutorId: selectedTutor.academyId,
      rate:
        type === "intro" && selectedTutor.introDiscountEnabled
          ? parseInt(selectedTutor.rate.split("$")[1]) / 2
          : parseInt(selectedTutor.rate.split("$")[1]),
    };
  });

  //handle delete type later todo
  if (type === "reserved" || type === "intro") {
    updatedSelectedSlots.map((lesson) => {
      dispatch(postStudentLesson(lesson));
    });
  } else if (type === "booked") {
    updatedSelectedSlots.map((lesson) => {
      dispatch(postStudentLesson(lesson));
    });
  }
  // student.AcademyId && dispatch(await setStudentSessions(student));
};
