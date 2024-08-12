import React, { useEffect, useState } from "react";
import LeftSideBar from "../../common/LeftSideBar";
import Input from "../../common/Input";
import TAButton from "../../common/TAButton";
import { MandatoryFieldLabel } from "../TutorSetup";
import Select from "../../common/Select";
import { useSelector } from "react-redux";
import {
  get_faculties,
  get_rates,
} from "../../../axios/tutor";
import { capitalize } from "lodash";
import { create_subTutor, get_subTutors } from "../../../axios/agency";
import { useParams } from "react-router-dom";

const AddSubTutor = ({
  isOpen,
  onClose,
  agencySubTutors,
  setAgencySubTutors,
}) => {
  const { tutor } = useSelector((state) => state.tutor);
  const [selectedTutor, setSelectedTutor] = useState({});
  const [subTutor, setSubTutor] = useState({
    TutorId: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Country: "",
    Faculty: "",
    ServiceCharge: 10,
    Subject: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [fetchingTutor, setFetchingTutor] = useState(false);
  const params = useParams();

  useEffect(() => {
    get_faculties().then(
      (faculties) => !faculties?.response?.data && setFaculties(faculties)
    );
  }, []);

  useEffect(() => {
    // TODO: replace with api that only returm subjects of fauclty, current api return rates along with subject
    !!subTutor.Faculty &&
      get_rates(tutor.AcademyId, subTutor.Faculty).then(
        (subjects) => !subjects?.response?.data && setSubjects(subjects)
      );
  }, [subTutor.Faculty]);

  // const checkIfTutorExists = async () => {
  //   const data = await get_tutor_setup({ AcademyId: subTutor.TutorId });
  //   console.log(data);
  //   setSelectedTutor(data[0])
  // };

  useEffect(() => {
    if (subTutor.FirstName && subTutor.LastName) {
      setSubTutor({
        ...subTutor,
        TutorId: `${capitalize(subTutor.FirstName)}${capitalize(
          subTutor.LastName[0]
        )}${new Date().getTime()}`,
      });
    }
  }, [subTutor.FirstName, subTutor.LastName]);

  const handleAddSubTutor = async (e) => {
    e.preventDefault();
    const result = await create_subTutor(params.id, subTutor);

    setAgencySubTutors([...agencySubTutors, result]);
    setSubTutor({
      TutorId: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
      Country: "",
      Faculty: "",
      ServiceCharge: 10,
      Subject: "",
    });
    onClose();
  };

  return (
    <LeftSideBar isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleAddSubTutor}>
        <div className="bg-white ">
          <div className="modal-header">
            <h4 className="modal-title text-center" style={{ width: "100%" }}>
              Add Sub-Tutor
            </h4>
          </div>
          <div className="m-3">
            {/* <p className="fw-bold" style={{ fontSize: "12px" }}>
              Check if tutor is part of application.
            </p> */}
            <Input
              editMode={false}
              value={subTutor.TutorId}
              label={<MandatoryFieldLabel text="AcademyId" edit />}
            />
            {/* <button className="btn border btn-sm" onClick={checkIfTutorExists}>
              Search
            </button> */}
          </div>

          <div className="m-3">
            <Input
              value={subTutor.FirstName}
              setValue={(e) =>
                setSubTutor({ ...subTutor, FirstName: capitalize(e) })
              }
              label={<MandatoryFieldLabel text="First Name" />}
            />
          </div>
          <div className="m-3">
            <Input
              value={subTutor.LastName}
              setValue={(e) =>
                setSubTutor({ ...subTutor, LastName: capitalize(e) })
              }
              label={<MandatoryFieldLabel text="Last Name" />}
            />
          </div>
          <div className="m-3">
            <Input
              value={subTutor.Email}
              setValue={(e) => setSubTutor({ ...subTutor, Email: e })}
              label={<MandatoryFieldLabel text="Email" />}
            />
          </div>
          <div className="m-3">
            <Input
              value={subTutor.Phone}
              setValue={(e) => setSubTutor({ ...subTutor, Phone: e })}
              label={<MandatoryFieldLabel text="Phone" />}
            />
          </div>
          <div className="m-3">
            <Input
              value={subTutor.Country}
              setValue={(e) => setSubTutor({ ...subTutor, Country: e })}
              label={<MandatoryFieldLabel text="Country" />}
            />
          </div>
          <div className="m-3">
            <Select
              value={subTutor.Faculty}
              setValue={(e) => setSubTutor({ ...subTutor, Faculty: e })}
              label={<MandatoryFieldLabel text="Faculty" />}
              required={true}
            >
              <option disabled value={""}>
                Select
              </option>
              {faculties.map((faculty) => (
                <option value={faculty.Id}>{faculty.Faculty}</option>
              ))}
            </Select>
          </div>
          <div className="m-3">
            <Select
              required={true}
              value={subTutor.Subject}
              setValue={(value) => setSubTutor({ ...subTutor, Subject: value })}
              label={<MandatoryFieldLabel text="Subject" />}
            >
              <option disabled value={""}>
                Select
              </option>
              {subjects.map(({ subject }) => (
                <option value={subject}>{subject}</option>
              ))}
            </Select>
          </div>
          <div className="m-3">
            <Input
              value={subTutor.ServiceCharge}
              setValue={(e) => setSubTutor({ ...subTutor, ServiceCharge: e })}
              label={<MandatoryFieldLabel text="Service Charge%" />}
            />
          </div>
        </div>
        <TAButton buttonText={"Add"} type="submit" />
      </form>
    </LeftSideBar>
  );
};

export default AddSubTutor;
