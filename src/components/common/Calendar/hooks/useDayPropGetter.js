import { useCallback } from "react";
import moment from "moment";
import { convertToDate } from "../Calendar";
import { isFutureDate } from "../utils/calenderUtils";

const useDayPropGetter = ({
  disableWeekDays,
  enabledDays,
  disableDates,
  disableColor,
  isStudentLoggedIn,
}) => {
  return useCallback(
    (date) => {
      const dayName = moment(date).format("dddd");
      // const isFutureDate = date.getTime() >= new Date().getTime();

      const existsInEnabledInMonth = enabledDays?.some(
        (arrayDate) => convertToDate(arrayDate).getTime() === date.getTime()
      );

      const existsInEnabledInWeek = enabledDays?.some((arrayDate) => {
        const slotDateMoment = moment(date);
        const arrayMomentDate = moment(arrayDate);
        return arrayMomentDate.isSame(slotDateMoment, "day");
      });

      const isDisableDate = disableDates?.some((storeDate) => {
        const slotDateMoment = moment(date);
        const storedMomentDate = moment(storeDate);
        return storedMomentDate.isSame(slotDateMoment, "day");
      });

      if (
        (isFutureDate(date) &&
          disableWeekDays &&
          disableWeekDays?.includes(dayName) &&
          !existsInEnabledInMonth &&
          !existsInEnabledInWeek) ||
        isDisableDate
      ) {
        return {
          style: {
            backgroundColor: disableColor,
          },
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault();
          },
        };
      }
      return {};
    },
    [
      disableWeekDays,
      enabledDays,
      disableDates,
      disableColor,
      isStudentLoggedIn,
    ]
  );
};

export default useDayPropGetter;