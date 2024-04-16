import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ShowCalendar from "../common/Calendar/Calendar";
import TutorCalenderSidebar from "./TutorCalenderSidebar";


const Scheduling = () => {

  const [activeTab, setActiveTab] = useState("month");
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [disabledHours, setDisabledHours] = useState([]);
  const [disableColor, setDisableColor] = useState("#5ed387");
  useEffect(() => {
    console.log(disableColor)
  }, [disableColor])


  return (
    <>
      <div className="form-scheduling">
        <div className="time-period">
          <div className='d-flex mt-4' style={{ height: "70vh" }}>
            <div className="px-2 col-3">
              <TutorCalenderSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                disableWeekDays={disableWeekDays}
                setDisabledWeekDays={setDisabledWeekDays}
                disabledHours={disabledHours}
                setDisabledHours={setDisabledHours}
                disableColor={disableColor}
                setDisableColor={setDisableColor}
              />
            </div>
            <div className='px-5 col-9'>
              <ShowCalendar
                setActiveTab={setActiveTab}
                setDisableColor={setDisableColor}
                disableColor={disableColor}
                activeTab={activeTab}
                disableWeekDays={disableWeekDays}
                disabledHours={disabledHours}
                setDisabledWeekDays={setDisabledWeekDays}
                setDisabledHours={setDisabledHours} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scheduling;
