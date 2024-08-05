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
import { toast } from "react-toastify";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { BiSolidMessage, BiSolidMessageSquareEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { tutor } = useSelector((state) => state.tutor);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    get_agencies().then(
      (result) => !result?.response?.data && setAgencies(result)
    );
  }, [tutor.AcademyId]);

  const onCreateAgency = async (e, body) => {
    e.preventDefault();
    if(agencies.length) return toast.warning("You cannot create more than one Agency!")
    setCreating(true);
    const result = await create_agency(body);
    if (!result?.response?.data) {
      setAgencies([...agencies, result]);
      setIsOpen(false);
    }
    setCreating(false);
  };

  return (
    <TutorLayout>
      <div className="container" style={{ height: "calc(100vh - 150px)" }}>
      <div className=" mt-2 highlight">
          <p className="m-1 fw-bold">
            Tutoring Academy platform offers you with a unique 'Agency'
            opportunity that comes with specific prerequisitis. As a dedicated
            tutor, you are invited to expand your impact by maintaining an
            active account and completing at least 40 hours of tutoring. Your
            leadership skills will shine as you mentor a minimum of six
            sub-tutors, guiding them towards success.
          </p>
          <p className="m-1 fw-bold">
            To begin, simply list your sub-tutors in the designated table and
            assign a markup percentage for each. Your earnings will reflect the
            difference between your earning level, and that of your sub-tutors,
            rewarding you for your mentorship efforts. Once you have a team of
            six or more sub-tutors, the 'Code' button will be enabled. By
            clicking these buttons, you will activate your franchise.
          </p>
          <p className="m-1 fw-bold">
            Distribute the generated codes to your sub-tutors and, once they
            register and activate their accounts, your agency will be fully
            operational. We are excited to see you grow and succeed in this new
            venture
          </p>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <TAButton
            buttonText={"Create Agency"}
            style={{width:"200px"}}
            handleClick={() => setIsOpen(true)}
          />
        </div>
        <div className="d-flex gap-3 flex-wrap justify-content-start">
          {agencies.map((agency, index) => (
            <div
              key={index}
              className="p-2 click-effect-elem"
              style={{ height: "fit-content" }}
              onClick={()=>navigate(`/tutor/agency/${agency.AgencyId}`)}
            >
              <div
                className=" rounded p-2 shadow "
                style={{ minWidth: "200px" }}
              >
              <div className="d-flex justify-content-between">
                  <h4 className="fw-bold border-bottom">{agency.AgencyName}</h4>
                  <BiSolidMessageSquareEdit color="lightblue" />
                  </div>
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
