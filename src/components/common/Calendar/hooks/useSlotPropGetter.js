import { useCallback } from "react";
import { moment } from "../../../../config/moment";
import {
  checkDateBetweenVacation,
  checkDefaultHours,
  checkDisableDates,
  checkDisableHourSlots,
  checkDisableWeekTimeSlots,
  checkEnableSlots,
  checkReservedSlots,
  checkSelectedSlots,
  isFutureDate,
} from "../utils/calenderUtils";
import { convertToDate } from "../Calendar";

const useSlotPropGetter = ({
  isStudentLoggedIn,
  selectedTutor,
  tutor,
  weekDaysTimeSlots,
  selectedSlots,
  timeDifference,
  timeZone,
  enableHourSlots,
  disableHourSlots,
  disableDates,
  disabledHours,
  disableColor,
  lessons
}) => {
  return useCallback(
    (date) => {
      if (!date || ( !selectedTutor.AcademyId &&  !tutor.AcademyId)) return {};
console.log(selectedTutor, tutor, date)
      const formattedTime = moment(date).format("h:00 a");

      const existBetweenVacationRange = checkDateBetweenVacation(
        date,
        isStudentLoggedIn ? selectedTutor.StartVacation : tutor.StartVacation,
        isStudentLoggedIn ? selectedTutor.EndVacation : tutor.EndVacation,
        isStudentLoggedIn ? selectedTutor.VacationMode : tutor.VacationMode
      );

      const existInDisableWeekTimeSlots = checkDisableWeekTimeSlots(
        date,
        weekDaysTimeSlots,
        timeZone,
        timeDifference,
        isStudentLoggedIn
      );

      const existsinReservedSlots = checkReservedSlots(
        date,
        lessons
      );

      const { existInSelectedSlotStart, existInSelectedSlotEnd } =
        checkSelectedSlots(date, selectedSlots, convertToDate);

      const existInEnableSlots = checkEnableSlots(
        date,
        enableHourSlots,
        convertToDate
      );

      const existInDisableHourSlots = checkDisableHourSlots(
        date,
        disableHourSlots,
        convertToDate
      );

      const existInDefaultHours = checkDefaultHours(
        date,
        disabledHours,
        formattedTime
      );

      const existInDisableDates = checkDisableDates(date, disableDates);

      // Switch checks
      if (existsinReservedSlots) {
        return {
          className: "reserved-slot",
        };
      } else if (existInSelectedSlotStart) {
        return {
          className: "place-holder-start-slot",
        };
      } else if (existInSelectedSlotEnd) {
        return {
          className: "place-holder-end-slot",
        };
      } else if (existBetweenVacationRange) {
        return {
          style: {
            backgroundColor: "rgb(226,244,227)",
          },
        };
      } else if (
        existInDisableHourSlots ||
        (isStudentLoggedIn && existInDisableWeekTimeSlots && isFutureDate(date))
      ) {
        return {
          style: {
            backgroundColor: disableColor || "red",
          },
          className: "disable-slot",
        };
      }
      else if (
        isFutureDate(date) &&
        disabledHours &&
        disabledHours?.some((timeRange) => {
          const [start] = timeRange;
          return formattedTime === start;
        }) &&
        !existInEnableSlots &&
        !existInDisableHourSlots
      ) {
        return {
          style: {
            backgroundColor: existInDefaultHours ? "lightgray" : disableColor,
          },
          className: "disabled-slot",
          onClick: () => {
            window.alert("This slot is blocked, please select a white slot.");
          },
        };
      }
      else if (existInEnableSlots) {
        return {
          style: {
            backgroundColor: "orange",
          },
          className: "enable-slot",
        };
      } else if (existInDisableDates) {
        return {
          style: {
            backgroundColor: disableColor,
          },
        };
      }

      return {};
    },
    [
      disabledHours,
      enableHourSlots,
      disableHourSlots,
      selectedSlots,
      weekDaysTimeSlots,
      disableColor,
      disableDates,
      isStudentLoggedIn,
      selectedTutor,
      timeDifference,
      timeZone,
      tutor,
      convertToDate,
      lessons
    ]
  );
};

export default useSlotPropGetter;
