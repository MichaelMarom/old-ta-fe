import React, { useEffect, useState } from "react";
import { showDate } from "../../../utils/moment";
import TutorLayout from "../../../layouts/TutorLayout";
import { wholeDateFormat } from "../../../constants/constants";
import TAButton from "../../../components/common/TAButton";
import CreateAgency from "../../../components/tutor/Agency/CreateAgency";
import { create_agency, get_agencies } from "../../../axios/agency";
import { useSelector } from "react-redux";
import Actions from "../../../components/common/Actions";
import { capitalize } from "lodash";

const List = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { tutor } = useSelector((state) => state.tutor);
  const [creating, setCreating]=useState(false)

  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    get_agencies().then(
      (result) => !result?.response?.data && setAgencies(result)
    );
  }, [tutor.AcademyId]);

  const onCreateAgency = async (e, body) => {
    e.preventDefault();
setCreating(true)
    const result = await create_agency(body);
    if (!result?.response?.data) {
      setAgencies([...agencies, result]);
      setIsOpen(false);
    }
setCreating(false)

  };

  return (
    <TutorLayout>
      <div className="container" style={{ height: "calc(100vh - 150px)" }}>
        <div className="d-flex w-100 justify-content-end">
          <TAButton
            buttonText={"Create Agency"}
            handleClick={() => setIsOpen(true)}
          />
        </div>
        <div className="d-flex gap-3 flex-wrap justify-content-start">
          {agencies.map((agency, index) => (
            <div
              key={index}
              className="p-2 click-effect-elem"
              style={{ height:"fit-content" }}
            >
              <div className=" rounded p-2 shadow " style={{minWidth:"200px"}}>
                <h4 className="fw-bold border-bottom">{agency.AgencyName}</h4>
                <div className="d-flex justify-content-between">
                  <h6 className="text-start">Main Tutor:</h6>
                  <p className="" style={{ fontSize: "12px" }}>
                    {capitalize(tutor.FirstName)} {capitalize(tutor.LastName)}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="text-start">Date Created:</h6>

                  <p style={{ fontSize: "12px" }}>
                    {showDate(agency.CreatedAt, wholeDateFormat)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateAgency
      loading={creating}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={onCreateAgency}
      />
      <Actions saveDisabled />
    </TutorLayout>
  );
};

export default List;
