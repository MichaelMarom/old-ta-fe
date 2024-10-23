import { useState } from "react";
import { useEffect } from "react";
import {
  get_faculties,
  get_rates,
  new_subj_request_exist,
  upload_new_subject,
} from "../../../axios/tutor";
import CenteredModal from "../../common/Modal";
import Button from "../../common/Button";
import { toast } from "react-toastify";
import SubjectCard from "./SubjectCard";
import Actions from "../../common/Actions";
import Loading from "../../common/Loading";
import TAButton from "../../common/TAButton";

import { FaBook, FaChevronRight, FaPlus, FaSearch } from "react-icons/fa";
import DebounceInput from "../../common/DebounceInput";
import Pill from "../../common/Pill";

import _ from "lodash";

const Subjects = () => {
  let [newSubjectFaculty, setNewSubjectFaculty] = useState([]);

  let [newSubjectFacultyData, setNewSubjectFacultyData] = useState("");
  let [newSubjectData, setNewSubjectData] = useState("");
  let [newSubjectReasonData, setNewSubjectReasonData] = useState("");
  const [showAddNewSubjModal, setShowAddNewSubjModal] = useState(false);
  const [newSubjRequestChecking, setNewSubjReqChecking] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(36);
  const [subjectExistInFaculties, setSubjectInFaculties] = useState([]);
  let [faculty, set_faculty] = useState([]);
  const [subjectsWithRates, setSubjectsWithRates] = useState([]);
  const [phase, setPhase] = useState("search");

  const [loadingSubs, setLoadingSubs] = useState(false);

  const handleModalClose = () => {
    setShowAddNewSubjModal(false);
    setNewSubjectData("");
    setNewSubjectFacultyData("");
    setNewSubjectReasonData("");
    setSubjectInFaculties([]);
    setPhase("search");
  };

  const handleSearch = async () => {
    if (!newSubjectData.length) setSubjectInFaculties([]);
    else {
      setNewSubjReqChecking(true);
      const result = await new_subj_request_exist(newSubjectData);
      if (result?.data) setSubjectInFaculties(result.data.faculties);
      if (!result?.data?.faculties?.length) setPhase("add");
      setNewSubjReqChecking(false);
    }
  };

  const formatSubjectCount = (count) => (count > 99 ? "99+" : count);

  useEffect(() => {
    let user_id = window.localStorage.getItem("tutor_user_id");
    setLoadingSubs(true);
    get_rates(user_id, selectedFaculty)
      .then((result) => {
        if (!result?.response?.data) {
          console.log(result);
          setSubjectsWithRates(_.sortBy(result, "subject"));
        }
        setLoadingSubs(false);
      })
      .catch((err) => console.log(err));
  }, [selectedFaculty]);

  const getFacultiesOption = async () => {
    let list = await get_faculties();
    if (list?.length) {
      const selectOptions = list.map((item) => {
        return (
          <option
            key={item.Id}
            data-id={item.Id}
            value={`${item.Faculty}-${item.Id}`}
            selected={newSubjectFacultyData === `${item.Faculty}-${item.Id}`}
          >
            {item.Faculty}
          </option>
        );
      });
      set_faculty(_.sortBy(list, "Faculty"));
      setNewSubjectFaculty(selectOptions);
    }
  };

  useEffect(() => {
    getFacultiesOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSubjectFacultyData]);

  const checkRequestExist = async (e) => {
    e.preventDefault();
    setNewSubjReqChecking(true);
    if (!newSubjectData.length) setSubjectInFaculties([]);
    else if (!subjectExistInFaculties.length) {
      const result = await new_subj_request_exist(newSubjectData);
      if (!result.subjectExist) {
        uploadNewSubject();
      } else {
        setNewSubjectData("");
        toast.warning(result.response.data.message);
      }
    }
    setNewSubjReqChecking(false);
  };

  let uploadNewSubject = () => {
    let user_id = window.localStorage.getItem("tutor_user_id");
    upload_new_subject({
      faculty: newSubjectFacultyData.split("-")[0],
      subject: newSubjectData,
      reason: newSubjectReasonData,
      AcademyId: user_id,
      facultyId: newSubjectFacultyData.split("-")[1],
    })
      .then((result) => {
        if (result) {
          setNewSubjectData("");
          setNewSubjectFacultyData("");
          setNewSubjectReasonData("");
          toast.success(
            "Subject Added Succefully. Please wait for Admin to approve your request"
          );
          setShowAddNewSubjModal(false);
        } else {
          toast.error("Error While Sending Request of New Subject");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="" style={{ margin: "10px" }}>
        <div className=" d-flex flex-column">
          {/* <SubMenu
            faculty={faculty}
            selectedFaculty={selectedFaculty}
            setSelectedFaculty={setSelectedFaculty}
          /> */}

          <div className="d-flex justify-content-around">
            <div className=" d-flex flex-column align-items-center m-0">
              <div
                className="p-3 rounded-3"
                style={{
                  width: "100%",
                  height: "calc(100vh - 170px)",
                  overflowY: "auto",
                  backgroundColor: "rgb(33 47 61)",
                  color: "white",
                }}
              >
                <h4 className="text-light text-center">
                  {faculty.length} Faculties
                </h4>
                <p className="text-center small">
                  Total Subjects{" "}
                  {faculty.reduce((sum, fac) => {
                    sum = sum + fac.subjectCount;
                    return sum;
                  }, 0)}
                </p>
                <TAButton
                  handleClick={() => setShowAddNewSubjModal(true)}
                  style={{ width: "100%", marginLeft: "0", marginRight: "0" }}
                  type="button"
                  buttonText={"Search/Add New Subject"}
                />

                <ul className="list-group">
                  {faculty.map(({ Id, Faculty, subjectCount }) => (
                    <li
                      key={Id}
                      id={
                        Id === selectedFaculty
                          ? "tutor-tab-header-list-active1"
                          : ""
                      }
                      className="list-group-item list-group-item-action navitem-li navitem d-flex justify-content-between"
                      style={{
                        backgroundColor: "rgb(33 47 61)",
                        color: Id === selectedFaculty ? "lightgreen" : "white",
                        padding: "10px",
                      }}
                      onClick={() => setSelectedFaculty(Id)}
                    >
                      <div className="d-flex align-items-center">
                        {/* <p style={{ width: "30px" }}>{subjectCount}</p> */}
                        <span
                          className="badge bg-transparent border d-flex justify-content-center align-items-center"
                          style={{
                            width: "25px",
                            height: "25px",
                            fontSize: "0.7rem", // Smaller font size for notification style
                            padding: "0.3em 0.6em",
                            borderRadius: "50%",
                          }}
                        >
                          {formatSubjectCount(subjectCount)}
                        </span>
                        <FaBook className="me-2" /> <p>{Faculty}</p>
                      </div>
                      <FaChevronRight
                        className="float-end"
                        style={{ marginTop: "5px" }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {/* <p>
                Select your faculty above, then from the list below click on the
                'Edit' button for each subject that you teach (you can select
                more than one). Type your rate, select the school grade(s) you
                tutor for this subject and SAVE. Didn't find your subject, and
                want to add it? Submit your request that match your expertise by
                clicking here:
              </p> */}
            </div>

            {loadingSubs ? (
              <div style={{ width: "78%" }}>
                <Loading height="calc(100vh - 170px)" />
              </div>
            ) : (
              <div style={{ width: "78%" }}>
                <div
                  className="d-flex rounded justify-content-between
                         align-items-center
                         mx-2 p-2"
                  style={{ color: "white", background: "#2471A3" }}
                >
                  <h6 className="m-0 col-2">
                    {subjectsWithRates.length} Subjects
                  </h6>
                  <h6 className="m-0 col-6">
                    School Grades (elementary, middle, & high school)
                  </h6>
                  <h6 className="m-0 col-3 text-start"> $ Rate</h6>
                  <h6 className="m-0 col-1"> Action</h6>
                </div>
                <div
                  style={{
                    height: "calc(100vh - 200px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    position: "relative",
                  }}
                >
                  {subjectsWithRates.map((item, index) => {
                    const rateExtracted =
                      item.rate && parseFloat(item.rate.replace("$", ""));
                    const rate = isNaN(rateExtracted) ? "" : rateExtracted;
                    const grades = JSON.parse(item.grades ?? "[]");
                    return (
                      <SubjectCard
                        key={index}
                        faculty={selectedFaculty}
                        subject={item.subject}
                        rateVal={rate}
                        gradesVal={grades}
                        id={item.SID}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CenteredModal
        show={showAddNewSubjModal}
        handleClose={handleModalClose}
        title={
          !subjectExistInFaculties.length &&
          phase !== "search" &&
          !!newSubjectData.length
            ? "Add New Suggested Subject"
            : "To Search If your subject exist , please type it in below field"
        }
      >
        <form onSubmit={checkRequestExist}>
          <div className="d-flex flex-column" style={{ gap: "20px" }}>
            <DebounceInput
              delay={500}
              value={newSubjectData}
              setInputValue={setNewSubjectData}
              onChange={(e) => setNewSubjectData(e.target.value)}
              type="text"
              debounceCallback={handleSearch}
              placeholder="Type your subject here"
              className="form-control"
              required
            />
            {!subjectExistInFaculties.length &&
              phase !== "search" &&
              !!newSubjectData.length && (
                <div style={{ fontSize: "12px" }}>
                  <p>
                    This Subject does not exist. To add the subject, select also
                    the fauclty to be considered.
                  </p>
                  <select
                    className="form-select mb-1"
                    required
                    onChange={(e) => setNewSubjectFacultyData(e.target.value)}
                    type="text"
                  >
                    <option
                      value=""
                      selected={!newSubjectFacultyData.length}
                      disabled
                    >
                      Select Faculty
                    </option>
                    {newSubjectFaculty}
                  </select>
                </div>
              )}
            {/* {!subjectExistInFaculties.length && !!newSubjectData.length &&
                            !!newSubjectReasonData.length &&
                        } */}

            {!subjectExistInFaculties.length && phase === "add" && (
              <textarea
                style={{ height: "200px" }}
                value={newSubjectReasonData}
                required
                className="form-control"
                onChange={(e) => setNewSubjectReasonData(e.target.value)}
                placeholder="Explain why this subject should be added, and your ability, and experience of tutoring it.(max 700 characters)"
              />
            )}
            {!!subjectExistInFaculties.length && (
              <div className="border p-2 shadow rounded">
                <h6>The Subject found in the Faculty below.</h6>
                <div className="d-flex align-items-center flex-wrap">
                  {subjectExistInFaculties.map((faculty) => (
                    <Pill key={faculty} label={faculty} width="200px" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 d-flex justify-content-between">
            <div>
              {newSubjRequestChecking ? (
                <Loading
                smallerIcon
                                  loadingText="searching subject..."
                  iconSize="20px"
                  height="20px"
                />
              ) : null}
            </div>
            <div>
              <button
                type="button"
                className="action-btn btn"
                onClick={handleModalClose}
              >
                <div className="button__content">
                  <p className="button__text">Close</p>
                </div>
              </button>
              <Button
                type="submit"
                className="action-btn btn"
                loading={newSubjRequestChecking}
                disabled={
                  newSubjRequestChecking || subjectExistInFaculties.length
                }
              >
                <div className="button__content align-items-center">
                  {!subjectExistInFaculties ? (
                    <FaPlus
                      style={{
                        animation: newSubjRequestChecking
                          ? "spin 2s linear infinite"
                          : "none",
                        marginBottom: "5px",
                      }}
                    />
                  ) : (
                    <FaSearch
                      style={{
                        animation: newSubjRequestChecking
                          ? "spin 2s linear infinite"
                          : "none",
                        marginBottom: "5px",
                      }}
                    />
                  )}
                  <p className="button__text">
                    {phase === "search" ? "Search" : "Add"}
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </form>
      </CenteredModal>
      <Actions saveDisabled={true} />
    </>
  );
};

export default Subjects;
