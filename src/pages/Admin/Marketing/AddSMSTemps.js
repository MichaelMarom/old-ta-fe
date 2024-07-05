import React, { useState } from "react";
import Layout from "./Layout";
import TextArea from "../../../components/common/TextArea";
import { MandatoryFieldLabel } from "../../../components/tutor/TutorSetup";
import TAButton from "../../../components/common/TAButton";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

function AddSMSTemps() {
  const [smsSamples, setSmsSamples] = useState([]);
  const [currentSms, setCurrentSms] = useState("");
  const [editMode, setEditMode] = useState(true); // Track edit mode for button text

  const handleAddSms = (e) => {
    e.preventDefault();
    console.log(currentSms);
    if (currentSms.trim()) {
      // Check for empty input before adding
      setSmsSamples([...smsSamples, { text: currentSms, editMode: false }]);
      setCurrentSms(""); // Clear input field after adding
      setEditMode(true); // Switch to edit mode after first addition
    }
  };

  const handleEditSms = (index) => {
    const newSmsSamples = [...smsSamples];
    newSmsSamples[index] = currentSms;
    setSmsSamples(newSmsSamples);
    setCurrentSms(""); // Clear input field after editing
    setEditMode(false); // Exit edit mode after saving
  };

  const handleDeleteSms = (index) => {
    const newSmsSamples = [...smsSamples];
    newSmsSamples.splice(index, 1);
    setSmsSamples(newSmsSamples);
  };

  const handlePlusClick = () => {
    setSmsSamples([...smsSamples, ""]); // Add a new empty input for next SMS
  };

  const handleInputChange = (e) => {
    setCurrentSms(e.target.value);
  };
console.log(smsSamples)
  return (
    <Layout>
      <div className="container" style={{height:"calc(100vh - 150px)"}}>
        <h2>SMS Samples</h2>
        <form className="h-auto" onSubmit={handleAddSms}>
          <div
            className="form-group mb-3 d-flex align-items-end"
            style={{ gap: "10px" }}
          >
            <div className="w-75" style={{ margin: "10px" }}>
              <TextArea
                value={currentSms}
                setValue={setCurrentSms}
                label={<MandatoryFieldLabel text={"Write SMS Text"} />}
                editMode={editMode}
                height={50}
                required
              />
            </div>
            <TAButton buttonText={"Save"} type="submit" />

          </div>
        </form>
        
        {smsSamples.map((sms, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2 border shadow p-2 rounded"
          >
            <p className="me-auto">{sms.text}</p>
              <div className="d-flex" style={{gap:"5px"}}>
                <div
                  type="button"
                  className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                  style={{ width: "30px", height: "30px" }}
                //   onClick={() => handleDeleteSms(index)}
                >
                  <FaEdit size={15} color="blue" />
                </div>
                <div
                  type="button"
                  className="rounded-circle border shadow d-flex justify-content-center align-items-center click-effect-elem"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handleDeleteSms(index)}
                >
                  <FaTrash size={15} color="red" />
                </div>
              </ div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AddSMSTemps;
