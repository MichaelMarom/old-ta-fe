import { useEffect, useState } from "react";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../helperFunctions/timeHelperFunctions";
import Button from "../../common/Button";
import { moment } from '../../../config/moment'
import { convertToDate } from "../../common/Calendar/Calendar";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux'
import { get_last_pay_day } from "../../../axios/tutor";
import Loading from "../../common/Loading";
import Actions from "../../common/Actions";

const AccDetails = ({ sessions }) => {
    const today = moment();
    const lastFriday = today.day(-2)
    const { tutor } = useSelector((state) => state.tutor)
    const [startDate, setStartDate] = useState(null);
    const [selectedWeekSession, setSelectedWeekSession] = useState([]);

    const [lastpayDay, setLastPayDay] = useState(lastFriday);
    const [endDate, setEndDate] = useState(moment(lastpayDay));
    const [start, setStart] = useState(moment(endDate).toDate())
    const [end, setEnd] = useState(moment(endDate).toDate())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (lastpayDay) {
            const initialStartDate = moment(lastpayDay).toDate()
            initialStartDate.setDate(initialStartDate.getDate() - 14);
            setStartDate(initialStartDate);
        }
    }, [lastpayDay]);

    useEffect(() => {
        if (lastpayDay) { setEndDate(moment(lastpayDay)) }
    }, [lastpayDay])

    useEffect(() => {
        setLoading(true)
        const fetchPayDay = async () => {
            const data = await get_last_pay_day();
            data?.Payday && setLastPayDay(data.Payday)
            setLoading(false)
        }
        fetchPayDay()
    }, [])

    useEffect(() => {
        if (startDate) {
            const filteredSession = sessions.filter(session => {
                const sessionDate = moment(session.end);
                const sessionDateWithoutTime = sessionDate.startOf('day');

                const startDateWithoutTime = moment(startDate).startOf('day');
                const endDateWithoutTime = moment(endDate).startOf('day');

                return (
                    sessionDateWithoutTime.isSameOrAfter(startDateWithoutTime) &&
                    sessionDateWithoutTime.isSameOrBefore(endDateWithoutTime)
                );
            });
            setStart(startDate ? moment(startDate).toDate() : moment().toDate());
            setSelectedWeekSession(filteredSession);
        }

    }, [endDate, startDate, sessions])

    const handleBack = () => {
        const newEndDate = moment(startDate).subtract(1, 'days').toDate();
        const newStartDate = moment(newEndDate).subtract(14, 'days').toDate();
        setStart(newStartDate);
        setEnd(newEndDate)
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleNext = () => {
        const newStartDate = moment(endDate).add(1, 'days').toDate();
        const newEndDate = moment(newStartDate).add(14, 'days').toDate();
        setStartDate(newStartDate);
        setEnd(newEndDate)
        setStart(newStartDate);

        setEndDate(newEndDate);
    };

    const totalAmount = sessions
        .filter((row) => {
            if (!start || !end) return true;
            const sessionDate = moment(convertToDate(row.start))


            return sessionDate.isSameOrAfter(start) && sessionDate.isSameOrBefore(end)
                && row.request !== 'delete';
        })
        .reduce((total, row) => { console.log(row.sr, total); return total + row.net }, 0)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const isNextDisabled = (moment(endDate).toDate()).getDate() >= (moment(lastpayDay).toDate()).getDate() &&
        (moment(endDate).toDate()).getMonth() >= (moment(lastpayDay).toDate()).getMonth() &&
        (moment(endDate).toDate()).getFullYear() >= (moment(lastpayDay).toDate()).getFullYear();

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
    const getLocalGMT = parseInt((offset => (offset < 0 ? '+' : '-') + ('00' + Math.abs(offset / 60 | 0)).slice(-2) + ':' + ('00' + Math.abs(offset % 60)).slice(-2))(new Date().getTimezoneOffset())) * -1;


    if (loading)
        return <Loading />
    return (
        <div className="d-flex flex-column w-100 mt-4 container">
            <div className="w-100 d-flex justify-content-between">
                <div className="d-flex w-50 justify-content-end align-items-center" style={{ gap: "10px" }}>
                    <h6 className="text-start m-0">Total Earning between </h6>
                    <ReactDatePicker
                        selected={new Date(start ? moment.tz(start, tutor.timeZone) :
                            moment().toDate().getTime() + (gmtInInt + getLocalGMT) * 60 * 60 * 1000)}
                        onChange={date => {
                            date.setHours(0);
                            date.setMinutes(0);
                            date.setSeconds(0);
                            const originalMoment = moment(date);
                            setStart(originalMoment)
                        }}
                        dateFormat="MMM d, yyyy"
                        className="form-control m-2"
                    />

                    <h6 className="m-0">and</h6>
                    <ReactDatePicker
                        selected={moment.tz(end ? end : new Date(), tutor.timeZone).toDate()}
                        onChange={date => {
                            date.setHours(23);
                            date.setMinutes(59)
                            date.setSeconds(59)
                            const originalMoment = moment(date)
                            setEnd(originalMoment)
                        }}
                        dateFormat="MMM d, yyyy"
                        className="form-control m-2"
                    />

                    <h6 className="text-start m-0 rounded border p-2">{totalAmount}</h6>
                </div>
                <div className="d-flex w-50 align-items-center justify-content-end" style={{ gap: "10px" }}>
                    <h6 className="text-start m-0">
                        Bi-Weekly Account Details</h6>
                    <IoChevronBackCircle
                        style={{ cursor: "pointer" }}
                        size={32} color="green" onClick={handleBack} />
                    <div className="rounded-pill border p-2">
                        from &nbsp;
                        <span className="text-success">{showDate(startDate)}</span> &nbsp;
                        to  &nbsp;
                        <span className="text-success">{showDate(endDate)}</span>
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
                {selectedWeekSession.length ? <table>
                    <thead>
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
                    </thead>
                    <tbody>
                        {selectedWeekSession.map((session) =>
                            <tr className={session.request === 'delete' ? `text-danger` : ''}>
                                <td>{session.sr}</td>
                                <td>{session.subject}</td>
                                <td>{session.studentName}</td>
                                <td className="col-2">{showDate(session.start, wholeDateFormat)}</td>
                                <td>{session.rate}</td>
                                <td> - </td>
                                <td> - </td>
                                <td>{session.comm}%</td>
                                <td>{session.net.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>{session.invoiceNum}</td>
                                <td><Button className={`btn-sm ${session.request === 'delete' ? 'btn-danger' : 'btn-primary'}`}>
                                    {session.request === 'delete' ? "Cancelled" : 'View Video'}</Button></td>
                            </tr>
                        )}
                    </tbody>
                </table> :
                    <div className="text-danger">No records found for that bi-week</div>
                }
            </div>

            <Actions saveDisabled={true} />
        </div>
    );
}

export default AccDetails;