import { useCallback } from "react";
import moment from "moment";
import { convertToDate } from "../Calendar";
import { isFutureDate } from "../utils/calenderUtils";
import { useSelector } from "react-redux";

const useDayPropGetter = ({
  disableWeekDays,
  enabledDays,
  disableDates,
  disableColor,
  isStudentLoggedIn,
}) => {

  const { tutor } = useSelector(state => state.tutor)
  return useCallback(
    (date) => {
      const dayName = moment(date).format("dddd");
      // const isFutureDate = date.getTime() >= new Date().getTime();

      const existsInEnabledInMonth = enabledDays?.some(
        (arrayDate) => convertToDate(arrayDate).getTime() === date.getTime()
      );

      const start = moment.tz(tutor.StartVacation, tutor.timeZone);
      const end = moment.tz(tutor.EndVacation, tutor.timeZone);
      const compare = moment.tz(date, tutor.timeZone);

      // Check if the compare date is within the range (inclusive)
      const VacationDayOff = compare.isSameOrAfter(start) && compare.isSameOrBefore(end);

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
      if (VacationDayOff && isFutureDate(date))
        return {
          className: "tutor-vacation-dayoff",
          style: {
            backgroundColor: "rgb(226,244,227)",
          },
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
