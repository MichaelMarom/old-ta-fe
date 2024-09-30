import { useEffect, useState } from "react";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { COMMISSION_DATA, wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../utils/moment";
import Button from "../../common/Button";
import { moment } from "../../../config/moment";
import { convertToDate } from "../../common/Calendar/Calendar";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { get_last_pay_day, get_sessions_details } from "../../../axios/tutor";
import Loading from "../../common/Loading";
import Actions from "../../common/Actions";

const AccDetails = () => {
  const today = moment();
  const lastFriday = today.day(-2);
  const { tutor } = useSelector((state) => state.tutor);
  const [startDate, setStartDate] = useState(null);
  const [selectedWeekSession, setSelectedWeekSession] = useState([]);
  const [isNextDisabled, setIsNextDisabled] = useState(false)

  const [lastpayDay, setLastPayDay] = useState(lastFriday);
  const [endDate, setEndDate] = useState(moment(lastpayDay).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
  const [start, setStart] = useState(moment(endDate).toDate());
  const [end, setEnd] = useState(moment(lastpayDay).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lastpayDay) {
      const initialStartDate = moment(lastpayDay).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      initialStartDate.setDate(initialStartDate.getDate() - 14);
      setStartDate(initialStartDate);
    }
  }, [lastpayDay]);


  useEffect(() => {
    if (lastpayDay) {
      const setTo0 = moment(lastpayDay).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      setEnd(setTo0)
      setEndDate(setTo0);
    }
  }, [lastpayDay]);

useEffect(()=>{
  setIsNextDisabled( moment(endDate).add(14, "days").toDate().getTime() >
  moment(lastpayDay).toDate().getTime())
},[endDate, lastpayDay])

  useEffect(() => {
    setLoading(true);
    const fetchPayDay = async () => {
      const data = await get_last_pay_day();
      data?.Payday && setLastPayDay(data.Payday);
      setLoading(false);
    };
    fetchPayDay();
  }, []);

  useEffect(() => {
    if (startDate) {
      get_sessions_details(tutor.AcademyId).then((result) => {
        const filteredSession = result.sessions.filter((session) => {
          const sessionStart = moment(session.start);
          const sessionEnd = moment(session.end);

          return (sessionStart.isAfter(moment(startDate)) && sessionEnd.isBefore(moment(endDate)));
        });

        setStart(startDate ?
          moment(convertToDate(startDate)).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate() :
          moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate());
        setSelectedWeekSession(filteredSession);
      });
    }
  }, [endDate, startDate]);

  const handleBack = () => {
    const newEndDate = moment(startDate).toDate();
    const newStartDate = moment(newEndDate).subtract(14, "days").toDate();
    setStart(newStartDate);
    setEnd(newEndDate);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleNext = () => {
    const newStartDate = moment(endDate).toDate();
    const newEndDate = moment(newStartDate).add(14, "days").toDate();
    if (newEndDate.getTime() < moment(lastpayDay).toDate().getTime()) {
      setStartDate(newStartDate);
      setEnd(newEndDate);
      setStart(newStartDate);

      setEndDate(newEndDate);
    }
  };

  const totalAmount = selectedWeekSession
    .filter((row) => {
      if (!start || !end) return true;
      const sessionDate = moment(convertToDate(row.start));

      return (
        sessionDate.isSameOrAfter(start) &&
        sessionDate.isSameOrBefore(end) &&
        row.request !== "delete"
      );
    })
    .reduce((total, row) => total + row.net, 0)
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // const isNextDisabled =
  //   moment(endDate).toDate().getDate() >
  //   moment(lastpayDay).toDate().getDate()

  // const formatUTC = (dateInt, addOffset = false, start = true) => {
  //     let date = (!dateInt || dateInt.length < 1) ? moment() : moment(dateInt);
  //     if (date.isAfter(lastpayDay) && !start) {
  //         return end
  //     }

  //     if (tutor.timeZone) {
  //         date = date.tz(tutor.timeZone).toDate();
  //     }

  //     return date;
  // }

  const gmtInInt = tutor.GMT ? parseInt(tutor.GMT) : 0;
  // for reactdatepicker because it opertae on new Date() not on moment.
  // getting getLocalGMT and then multiple it with -1 to add (-5:00) or subtract (+5:00)
  const getLocalGMT =
    parseInt(
      ((offset) =>
        (offset < 0 ? "+" : "-") +
        ("00" + Math.abs((offset / 60) | 0)).slice(-2) +
        ":" +
        ("00" + Math.abs(offset % 60)).slice(-2))(
          new Date().getTimezoneOffset()
        )
    ) * -1;

  if (loading) return <Loading />;
  return (
    <div className="d-flex flex-column w-100 mt-4 container">
      <div className="w-100 d-flex justify-content-between">
        <div
          className="d-flex w-50 justify-content-end align-items-center"
          style={{ gap: "10px" }}
        >
          <h6 className="text-start m-0">Total Earning between </h6>
          <ReactDatePicker
            selected={
              //becuase react-date-picker do not support moment, SO need to manually convert time  TO tutor Timezone
              new Date(
                start
                  ? moment(start).toDate().getTime() +
                  (gmtInInt + getLocalGMT) * 60 * 60 * 1000
                  : moment().toDate().getTime() +
                  (gmtInInt + getLocalGMT) * 60 * 60 * 1000
              )
            }
            onChange={(date) => {
              date.setHours(0);
              date.setMinutes(0);
              date.setSeconds(0);
              const originalMoment = moment(date);
              setStart(originalMoment);
            }}
            dateFormat="MMM d, yyyy HH:mm:ss"
            className="form-control m-2"
          />

          <h6 className="m-0">and</h6>
          <ReactDatePicker
            selected={
              moment(end)
                .toDate().getTime() +
              (gmtInInt + getLocalGMT) * 60 * 60 * 1000
            }
            onChange={(date) => {
              date.setHours(23);
              date.setMinutes(59);
              date.setSeconds(59);
              const originalMoment = moment(date);
              setEnd(originalMoment);
            }}
            dateFormat="MMM d, yyyy HH:mm:ss"
            className="form-control m-2"
          />

          <h6 className="text-start m-0 rounded border p-2">{totalAmount}</h6>
        </div>
        <div
          className="d-flex w-50 align-items-center justify-content-end"
          style={{ gap: "10px" }}
        >
          <h6 className="text-start m-0">Bi-Weekly Account Details</h6>
          <IoChevronBackCircle
            style={{ cursor: "pointer" }}
            size={32}
            color="green"
            onClick={handleBack}
          />
          <div className="rounded-pill border p-2">
            from &nbsp;
            <span className="text-success">{showDate(startDate, wholeDateFormat)}</span> &nbsp;
            to &nbsp;
            <span className="text-success">{showDate(endDate, wholeDateFormat)}</span>
          </div>
          <IoChevronForwardCircle
            size={32}
            color={isNextDisabled ? "gray" : "green"}

            onClick={() => !isNextDisabled && handleNext()}

            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="mt-4" style={{ height: "53vh", overflowY: "auto" }}>
        {selectedWeekSession.length ? (
          <table>
            <thead>
            <tr>
              <th>Sr.</th>
              <th>Subject</th>
              <th>Student Name</th>
              <th>Date/Time</th>
              <th>Rate</th>
              <th>Disc. Subs</th>
              <th>Disc. Multi</th>
              <th>% Com'</th>
              <th>$ Net</th>
              <th>Invoice #</th>
              <th>Lesson Video</th>
            </tr>
            </thead>
            <tbody>
              {selectedWeekSession.map((session) => (
                <tr
                  key={session.sr}
                  className={session.request === "delete" ? `text-danger` : ""}
                >
                  <td>{session.sr}</td>
                  <td>{session.subject}</td>
                  <td>{session.studentName}</td>
                  <td className="col-2">
                    {showDate(session.start, wholeDateFormat)}
                  </td>
                  <td>
                    {" "}
                    {session.rate.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td> - </td>
                  <td> - </td>
                  <td>{session.comm}%</td>
                  <td>
                    {session.net.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{session.invoiceNum}</td>
                  <td>
                    <Button
                      className={`btn-sm ${session.request === "delete"
                        ? "btn-danger"
                        : "btn-primary"
                        }`}
                    >
                      {session.request === "delete"
                        ? "Cancelled"
                        : "View Video"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-danger">No records found for that bi-week</div>
        )}
      </div>

      <Actions saveDisabled={true} />
    </div>
  );
};

export default AccDetails;
