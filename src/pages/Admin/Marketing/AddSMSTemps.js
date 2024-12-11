import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import TextArea from "../../../components/common/TextArea";
import { MandatoryFieldLabel } from "../../../components/common/Input/InputLabel"

import TAButton from "../../../components/common/TAButton";
import { FaCheck } from "react-icons/fa";
import Input from "../../../components/common/Input";
import { MdEdit } from "react-icons/md";
import { get_sms_mms_list, save_sms_mms_temp, update_sms_mms_temp } from "../../../axios/admin";
import { toast } from "react-toastify";

function AddSMSTemps() {
  const [smsSamples, setSmsSamples] = useState([]);
  const [onUpdateSms, setOnUpdateSms] = useState("");
  const [currentSms, setCurrentSms] = useState("");
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    get_sms_mms_list().then(result => !result?.response?.data && setSmsSamples(result))
  }, [])

  const handleAddSms = (e) => {
    e.preventDefault();
    if (currentSms.trim()) {
      save_sms_mms_temp({ name: currentName, text: currentSms }).then(result => {
        if (!result?.response?.data) {
          setSmsSamples([
            ...smsSamples,
            { name: currentName, text: currentSms, editMode: false },
          ]);
          setCurrentSms("");
          setCurrentName("");
          toast.success("Created Sucessfully!")
        }
      })
    }
  };

  const handleEditSms = (sms) => {
    const updatedSmsSamples = smsSamples.map((item) =>
      item.text === sms.text ? { ...item, editMode: true } : item
    );
    setSmsSamples(updatedSmsSamples);
    setOnUpdateSms(sms.text);
  };

  const handleDeleteSms = (index) => {
    const newSmsSamples = [...smsSamples];
    newSmsSamples.splice(index, 1);
    setSmsSamples(newSmsSamples);
  };

  const doneUpdatingSms = (sms) => {
    update_sms_mms_temp({ text: onUpdateSms }, sms.id).then(result => {
      if (!result?.response?.data) {
        const udpatedSms = smsSamples.map((item) =>
          item.text === sms.text
            ? { ...item, text: onUpdateSms, editMode: false }
            : item
        );
        setOnUpdateSms("");
        setSmsSamples(udpatedSms);
        toast.success("Updated Sucessfully")
      }
    })
  };

  return (
    <Layout>
      <div className="container" style={{ height: "calc(100vh - 150px)" }}>
        <h2>SMS Samples</h2>
        <form className="h-auto" onSubmit={handleAddSms}>
          <div
            className="form-group mb-3 d-flex align-items-start flex-column"
            style={{ gap: "10px" }}
          >
            <div className="w-100 d-flex" style={{ margin: "10px" }}>
              <TextArea
                value={currentSms}
                setValue={setCurrentSms}
                label={<MandatoryFieldLabel text={"Write SMS Text"} />}
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
                  {/* <div>
                    <FileUpload />
                  </div> */}
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
                  <MdEdit size={15} color="blue" />
                </div>
                {/* <div
                  className="rounded-circle border shadow d-flex justify-content-center align-items-center click-effect-elem"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handleDeleteSms(index)}
                >
                  <FaTrashAlt size={15} color="red" />
                </div> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AddSMSTemps;
