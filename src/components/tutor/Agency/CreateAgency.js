import React, { useState } from "react";
import CenteredModal from "../../common/Modal";
import Input from "../../common/Input";
import { MandatoryFieldLabel } from "../TutorSetup";
import TAButton from "../../common/TAButton"

const CreateAgency = ({ isOpen, onClose }) => {
    const [agencyName, setAgencyName] = useState("")
   const  handleSubmit=(e)=>{
    e.preventDefault()
    //call create apis
   }
  return (
    <CenteredModal show={isOpen} handleClose={onClose} title={"Create Agency"} minHeight="200px">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input value={agencyName} setValue={setAgencyName} label={<MandatoryFieldLabel text={"Agency Name"} />} />
          </div>
        
         <div className="p-2 d-flex justify-content-between">
         <TAButton handleClick={onClose} type="button"  buttonText={"Cancel"} />
         
            <TAButton type="submit" buttonText={"Create"} />
            </div>
        </form>
      </div>
    </CenteredModal>
  );
};

export default CreateAgency;
