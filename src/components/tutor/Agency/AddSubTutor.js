import React, { useEffect, useState } from "react";
import LeftSideBar from "../../common/LeftSideBar";
import Input from "../../common/Input";
import TAButton from "../../common/TAButton";
import { MandatoryFieldLabel } from "../TutorSetup";
import Select from "../../common/Select";
import { useSelector } from "react-redux";
import {
  get_faculties,
  get_faculty_subject,
  get_my_data,
  get_rates,
  get_tutor_setup,
} from "../../../axios/tutor";

const AddSubTutor = ({ isOpen, onClose }) => {
  const { tutor } = useSelector((state) => state.tutor);
  const [selectedTutor, setSelectedTutor] = useState({});
  const [subTutor, setSubTutor] = useState({
    AcademyId: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Country: "",
    Faculty: "",
    Subject: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [fetchingTutor, setFetchingTutor] = useState(false);

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

  const checkIfTutorExists = async () => {
    const data = await get_tutor_setup({AcademyId:subTutor.AcademyId});
    console.log(data);
    setSelectedTutor(data[0])
  };

  const handleAddSubTutor = (e) => {
    e.preventDefault();
    // Add subtutor
  };

  return (
    <LeftSideBar isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleAddSubTutor}>
        <div className="bg-white h-100">
          <div className="modal-header">
            <h4 className="modal-title text-center" style={{ width: "100%" }}>
              Add Tutor
            </h4>
          </div>
          <div className="m-3">
            <p className="fw-bold" style={{ fontSize: "12px" }}>
              Check Tutor if Exists
            </p>
            <Input
              value={subTutor.AcademyId}
              setValue={(e) => setSubTutor({ ...subTutor, AcademyId: e })}
              label={<MandatoryFieldLabel text="AcademyId" />}
            />
            <button className="btn border btn-sm" onClick={checkIfTutorExists}>
              Search
            </button>
          </div>
          {selectedTutor.AcademyId && (
            <>
              <div className="m-3">
                <Input
                  value={subTutor.FirstName}
                  setValue={(e) => setSubTutor({ ...subTutor, FirstName: e })}
                  label={<MandatoryFieldLabel text="First Name" />}
                />
              </div>
              <div className="m-3">
                <Input
                  value={subTutor.LastName}
                  setValue={(e) => setSubTutor({ ...subTutor, LastName: e })}
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
                  value={subTutor.Subject}
                  setValue={(value) =>
                    setSubTutor({ ...subTutor, Subject: value })
                  }
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
            </>
          )}
        </div>
        <TAButton buttonText={"Add"} />
      </form>
    </LeftSideBar>
  );
};

export default AddSubTutor;
