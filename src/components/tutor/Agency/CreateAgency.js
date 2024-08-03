import React, { useState } from "react";
import CenteredModal from "../../common/Modal";
import Input from "../../common/Input";
import { MandatoryFieldLabel } from "../TutorSetup";
import TAButton from "../../common/TAButton";
import { useSelector } from "react-redux";

const CreateAgency = ({ isOpen, onClose, onCreate, loading }) => {
  const [agencyName, setAgencyName] = useState("");
  const { tutor } = useSelector((state) => state.tutor);

  return (
    <CenteredModal
      show={isOpen}
      handleClose={onClose}
      title={"Create Agency"}
      minHeight="200px"
    >
      <div>
        <form
          onSubmit={(e) => {
            onCreate(e, {
              AgencyName: agencyName,
              MainTutorId: tutor.AcademyId,
            });
            setAgencyName("");
          }}
        >
          <div className="mb-3">
            <Input
              value={agencyName}
              setValue={setAgencyName}
              label={<MandatoryFieldLabel text={"Agency Name"} />}
            />
          </div>

          <div className="p-2 d-flex justify-content-between">
            <TAButton
              handleClick={onClose}
              type="button"
              buttonText={"Cancel"}
            />

            <TAButton type="submit" buttonText={"Create"}  loading={loading}/>
          </div>
        </form>
      </div>
    </CenteredModal>
  );
};

export default CreateAgency;
