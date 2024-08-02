import React, { useEffect, useState } from "react";
import { showDate } from "../../../utils/moment";
import TutorLayout from "../../../layouts/TutorLayout";
import { wholeDateFormat } from "../../../constants/constants";
import TAButton from '../../../components/common/TAButton'
import CreateAgency from "../../../components/tutor/Agency/CreateAgency";

const List = () => {
    const [isOpen, setIsOpen] = useState(false);

  const [agencies, setAgencies] = useState([
    {
      Name: "FastCoders",
      MainTutor: "Asiya",
      TotalSubTutors: 24,
      Created_At: new Date(),
    },
    {
      Name: "FastCoders",
      MainTutor: "Asiya",
      TotalSubTutors: 24,
      Created_At: new Date(),
    },
    {
      Name: "FastCoders",
      MainTutor: "Asiya",
      TotalSubTutors: 24,
      Created_At: new Date(),
    },
    {
      Name: "FastCoders",
      MainTutor: "Asiya",
      TotalSubTutors: 24,
      Created_At: new Date(),
    },
    {
      Name: "FastCoders",
      MainTutor: "Asiya",
      TotalSubTutors: 24,
      Created_At: new Date(),
    },
  ]);
  useEffect(() => {}, []);

  return (
    <TutorLayout>
      <div className="container">
        <div className="d-flex w-100 justify-content-end">
            <TAButton buttonText={"Create Agency"} handleClick={()=>setIsOpen(true)} />
        </div>
        <div className="d-flex gap-3 flex-wrap justify-content-center">
          {agencies.map((agency, index) => (
            <div key={index} className="p-2 click-effect-elem" style={{ width: "22%" }}>
              <div className="border rounded p-2">
                <h4 className="border-bottom">{agency.Name}</h4>
                <div className="d-flex justify-content-between">
                  <h6 className="text-start">Main Tutor:</h6>
                  <p className="" style={{fontSize:"12px"}}>{agency.MainTutor}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="text-start">Date Created:</h6>

                  <p style={{fontSize:"12px"}}>{showDate(agency.Created_At, wholeDateFormat)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateAgency isOpen={isOpen} onClose={()=>setIsOpen(false)} />
    </TutorLayout>
  );
};

export default List;
