import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import TextArea from "../../../components/common/TextArea";
import { MandatoryFieldLabel } from "../../../components/tutor/TutorSetup";
import TAButton from "../../../components/common/TAButton";
import { FaCheck, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../../components/common/Input";

function AddSMSTemps() {
  const [smsSamples, setSmsSamples] = useState([]);
  const [onUpdateSms, setOnUpdateSms] = useState("");
  const [currentSms, setCurrentSms] = useState("");
  const [editMode, setEditMode] = useState(true); // Track edit mode for button text
  const [currentName, setCurrentName] = useState("");

  const handleAddSms = (e) => {
    e.preventDefault();
    if (currentSms.trim()) {
      setSmsSamples([
        ...smsSamples,
        { name: currentName, text: currentSms, editMode: false },
      ]);
      setCurrentSms("");
      setCurrentName("");

      setEditMode(true);
    }
  };

  const handleEditSms = (sms) => {
    const updatedSmsSamples = smsSamples.map((item) =>
      item.text === sms.text ? { ...item, editMode: true } : item
    );
    setSmsSamples(updatedSmsSamples);
    setOnUpdateSms(sms.text); // Clear input field after editing
  };

  const handleDeleteSms = (index) => {
    const newSmsSamples = [...smsSamples];
    newSmsSamples.splice(index, 1);
    setSmsSamples(newSmsSamples);
  };

  const doneUpdatingSms = (sms) => {
    const udpatedSms = smsSamples.map((item) =>
      item.text === sms.text
        ? { ...item, text: onUpdateSms, editMode: false }
        : item
    );
    setOnUpdateSms("");
    setSmsSamples(udpatedSms);
  };

  console.log(smsSamples);

  return (
    <Layout>
      <div className="container" style={{ height: "calc(100vh - 150px)" }}>
        <h2>SMS Samples</h2>
        <form className="h-auto" onSubmit={handleAddSms}>
          <div
            className="form-group mb-3 d-flex align-items-start flex-column"
            style={{ gap: "10px" }}
          >
            <div className="w-100" style={{ margin: "10px" }}>
              <TextArea
                value={currentSms}
                setValue={setCurrentSms}
                label={<MandatoryFieldLabel text={"Write SMS Text"} />}
                editMode={editMode}
                height={80}
                required
              />
            </div>
            <div className="d-flex justify-content-between w-100 m-2">
              <div className="w-50">
                <Input
                  value={currentName}
                  setValue={setCurrentName}
                  label={<MandatoryFieldLabel text={"Name"} />}
                />
              </div>
              <TAButton buttonText={"Save"} type="submit" />
            </div>
          </div>
        </form>

        {smsSamples.map((sms, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2 border shadow p-2 rounded justify-content-between"
          >
            <div className="d-flex flex-column w-75">
              <h5>{sms.name}</h5>
              {sms.editMode ? (
                <div className="w-100">
                  <TextArea
                    value={onUpdateSms}
                    setValue={setOnUpdateSms}
                    label={<MandatoryFieldLabel text={"Update SMS Text"} />}
                    height={80}
                    required
                  />
                </div>
              ) : (
                <p className="me-auto">{sms.text}</p>
              )}
            </div>
            {sms.editMode ? (
              <div
                className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                style={{ width: "30px", height: "30px" }}
                onClick={() => doneUpdatingSms(sms)}
              >
                <FaCheck size={15} color="limegreen" />
              </div>
            ) : (
              <div className="d-flex" style={{ gap: "5px" }}>
                <div
                  className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handleEditSms(sms)}
                >
                  <FaEdit size={15} color="blue" />
                </div>
                <div
                  className="rounded-circle border shadow d-flex justify-content-center align-items-center click-effect-elem"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handleDeleteSms(index)}
                >
                  <FaTrash size={15} color="red" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AddSMSTemps;
