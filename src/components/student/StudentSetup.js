import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  code_applied,
  get_my_data,
  post_student_setup,
  upload_student_setup_by_fields,
} from "../../axios/student";
import { get_tutor_against_code } from "../../axios/tutor";
import { convertGMTOffsetToLocalString } from "../../utils/moment";
import { useDispatch } from "react-redux";
import { setStudent } from "../../redux/student/studentData";
import Tooltip from "../common/ToolTip";
import { FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import TAButton from "../common/TAButton";
import {
  AUST_STATES,
  CAN_STATES,
  Countries,
  GMT,
  GRADES,
  STATES,
  UK_STATES,
  US_STATES,
} from "../../constants/constants";
import { PhoneInput } from "react-international-phone";
import Actions from "../common/Actions";
import { toast } from "react-toastify";
import { compareStates } from "../../utils/common";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import Input from "../common/Input";
import Select from "../common/Select";
import { MandatoryFieldLabel, OptionalFieldLabel } from "../tutor/TutorSetup";
import Loading from "../common/Loading";
import { uploadStudentImages } from "../../axios/file";
import _ from "lodash";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const StudentSetup = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  let [fname, set_fname] = useState("");
  let [mname, set_mname] = useState("");
  let [sname, set_sname] = useState("");

  let [email, set_email] = useState("");

  const [picUploading, setPicUploading] = useState(false);

  let [cell, set_cell] = useState("");
  let [add1, set_add1] = useState("");
  let [add2, set_add2] = useState("");
  let [city, set_city] = useState("");
  let [state, set_state] = useState("");
  let [zipCode, set_zipCode] = useState("");
  let [country, set_country] = useState("");
  let [timeZone, set_timeZone] = useState("");
  let [is_18, set_is_18] = useState(false);
  let [lang, set_lang] = useState("");
  let [parentConsent, set_parentConsent] = useState(false);
  let [grade, set_grade] = useState("");

  let [photo, set_photo] = useState("");

  const [parentAEmail, setParentAEmail] = useState("");
  const [parentBEmail, setParentBEmail] = useState("");
  const [parentAName, setParentAName] = useState("");
  const [parentBName, setParentBName] = useState("");
  const [secLan, setSecLang] = useState("");

  const options = {
    Australia: AUST_STATES,
    USA: US_STATES,
    Canada: CAN_STATES,
    UnitedKingdom: UK_STATES,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let lang_list = ["English", "French", "German", "Spanish"];
  let [GradeList, setGradeList] = useState("");

  const [dateTime, setDateTime] = useState("");
  const { user } = useSelector((state) => state.user);
  const { student, isLoading } = useSelector((state) => state.student);
  const [saving, setSaving] = useState(false);
  const [code, set_code] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [nameFieldsDisabled, setNameFieldsDisabled] = useState(false);
  const [unSavedChanges, setUnSavedChanges] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const isValid = isPhoneValid(cell);


  const nameValidations = (value) => {
    if (!/^[a-zA-Z]+$/.test(value)) {
      return `"Can only contain letters"`;
    }
    if (value.length < 2) {
      return `"Must be at least 2 characters long"`;
    }
    return false;
  };

  useEffect(() => {
    user.role &&
      student.AcademyId &&
      student.Status === "pending" &&
      !toastShown &&
      toast.success(
        `Please note that your application is currently in 'pending' status. 
    Use the 'Next' or 'Back' buttons at the page footer to navigate between pages. 
    The menu tabs will become active once your application is complete`,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          autoClose: false,
          draggable: true,
          className: "setup-private-info center-center",
        }
      );
    setToastShown(true);
    //eslint-disable-next-line
  }, [user.role, student.Status, student.AcademyId]);

  let saver = async (e, id) => {
    e.preventDefault();
    if (_.some(errors, (value) => typeof value === "string"))
      return toast.error("Please fix validation errors!");
    if (!isValid) {
      return toast.warning("Please enter the correct phone number");
    }

    setSaving(true);
    if (id) {
      upload_student_setup_by_fields(id, {
        Language: lang,
        SecLan: secLan,
        Over18: is_18,
        Cell: cell,
        Grade: grade,
        Address1: add1,
        Address2: add2,
        City: city,
        State: state,
        ZipCode: zipCode,
        Country: country,
        GMT: timeZone,
        Photo: photo,
        ParentAEmail: parentAEmail,
        ParentBEmail: parentBEmail,
        ParentAName: parentAName,
        ParentBName: parentBName,
        ParentConsent: parentConsent,
      }).then((response) => {
        if (!response?.response?.data) {
          toast.success("Updated Successfully!");
          get_my_data(id).then((data) => {
            dispatch(setStudent(data));
          });
        }
      });
    } else {
      toast.error("Tutor Does not exists!");
      // post_student_setup({
      //   userId: user.SID,
      //   FirstName: fname,
      //   MiddleName: mname,
      //   LastName: sname,
      //   Language: lang,
      //   SecLan: secLan,
      //   ParentAEmail: parentAEmail,
      //   ParentBEmail: parentBEmail,
      //   ParentAName: parentAName,
      //   ParentBName: parentBName,
      //   Over18: is_18,
      //   Cell: cell,
      //   Grade: grade,
      //   Address1: add1,
      //   Address2: add2,
      //   City: city,
      //   State: state,
      //   ZipCode: zipCode,
      //   Country: country,
      //   GMT: timeZone,
      //   Photo: photo,
      //   Status: "pending",
      //   ParentConsent: parentConsent,
      // }).then((response) => {
      //   if (!response?.response?.data) {
      //     console.log(response[0]);
      //     toast.success("Created Successfully!");
      //     dispatch(setStudent(response[0]));
      //   }
      // });
    }

    setSaving(false);
  };

  useEffect(() => {
    if (student.AcademyId) {
      setEditMode(false);
      setNameFieldsDisabled(true);
    } else {
      setEditMode(true);
      setNameFieldsDisabled(false);
    }
  }, [student]);

  // unsavedChanges
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentState = {
    Address2: add2,
    Over18: is_18,
    Cell: cell,
    City: city,
    Country: country,
    // FirstName: fname,
    GMT: timeZone,
    Grade: grade,
    Language: lang,
    ParentAEmail: parentAEmail,
    ParentAName: parentAName,
    ParentBEmail: parentBEmail,
    ParentBName: parentBName,
    ParentConsent: `${parentConsent}`,
    SecLan: secLan,
    State: state,
    ZipCode: zipCode,
  };

  useEffect(() => {
    setUnSavedChanges(compareStates(student, currentState));

    // eslint-disable-next-line
  }, [currentState, student]);

  useEffect(() => {
    const fetchStudentSetup = async () => {
      if (user.role === "student" || user.role === "admin") {
        if (Object.keys(student)) {
          let data = student;
          // set_fname(data.FirstName);
          // set_sname(data.LastName);
          // set_mname(data.MiddleName);
          set_photo(data.Photo);
          set_email(data.Email);
          set_cell(data.Cell);
          set_state(data.State);
          set_parentConsent(data.ParentConsent);
          set_city(data.City);
          set_country(data.Country);
          set_timeZone(data.GMT);
          set_zipCode(data.ZipCode);
          set_add1(data.Address1);
          set_add2(data.Address2);
          set_is_18(data.Over18);
          set_lang(data.Language);
          set_grade(data.Grade);
          let list = [...document.querySelectorAll(".parentConsentOption")];
          for (let i; i < list.length; list++) {
            if (data.ParentConsent === "true") {
              list[0].checked = true;
              list[1].checked = false;
            } else {
              list[0].checked = false;
              list[1].checked = true;
            }
          }
          setParentAName(data.ParentAName);
          setParentBName(data.ParentBName);
          setParentAEmail(data.ParentAEmail);
          setParentBEmail(data.ParentBEmail);
          setSecLang(data.SecLan);
        }
      }
    };
    fetchStudentSetup();
  }, [student, user]);

  useEffect(() => {
    let list = Countries.map((item, index) => (
      <option
        key={index}
        className={item.Country}
        style={{
          height: "80px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value={item.Country}
      >
        {item.Country}
      </option>
    ));
    let head = (
      <option
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value=""
      >
        Country
      </option>
    );

    list.unshift(head);

    let gmt_list = GMT.map((item, index) => (
      <option
        key={index}
        className={item.GMT}
        style={{
          height: "80px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value={item.GMT}
      >
        {item.GMT}
      </option>
    ));
    let gmt_head = (
      <option
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value=""
      >
        GMT
      </option>
    );

    gmt_list.unshift(gmt_head);

    let grades_list = GRADES.map((item, index) => (
      <option
        key={index}
        className={item.Grade}
        style={{
          height: "80px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value={item.Grade}
      >
        {item.Grade}
      </option>
    ));
    let grades_head = (
      <option
        key="null"
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value=""
        disabled={student.Status === "active"}
      >
        Grade
      </option>
    );

    grades_list.unshift(grades_head);
    setGradeList(grades_list);

    let states_list = STATES.map((item, index) => (
      <option
        key={index}
        className={item.State}
        style={{
          height: "80px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value={item.State}
      >
        {item.State}
      </option>
    ));
    let state_head = (
      <option
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value=""
      >
        State
      </option>
    );

    states_list.unshift(state_head);
  }, [student.Status]);

  let handleImage = async (e) => {
    if (!student.AcademyId) return toast.warning("Please set you Name first!")
    if (e.target.files[0].type.split("/")?.[0] !== "image") {
      alert("Only Image Can Be Uploaded To This Field");
    } else {
      try {
        setPicUploading(true);
        let reader = new FileReader();

        reader.onload = (result) => {
          set_photo(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        // TODO: handle for new users with no id
        const result = await uploadStudentImages(
          student.AcademyId,
          e.target.files[0]
        );

        result.data?.url &&
          upload_student_setup_by_fields(student.AcademyId, {
            Photo: result.data.url,
          }).then(() => {
            dispatch(setStudent({ ...student, Photo: result.data.url }));
            toast.success("Uploaded Successfully!")
          });

        setPicUploading(false);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleConnectClick = async (e) => {
    e.preventDefault();
    if (code.length) {
      const data = await get_tutor_against_code(code);
      set_code("");
      if (data?.response?.data?.message) {
        return toast.error(data.response.data.message);
      }
      if (student.AcademyId && data.AcademyId) {
        const result = await code_applied(student.AcademyId, data.AcademyId);
        if (result.message && result?.response?.status !== 400) {
          toast.success(result.message);
          navigate("/student/faculties");
        }
      }
    }
  };

  useEffect(() => {
    const localTime = convertGMTOffsetToLocalString(timeZone);
    setDateTime(localTime);
  }, [timeZone]);

  const mandatoryFields = [
    // { name: "fname", filled: !!fname?.length, value: fname },
    // { name: "lname", filled: !!sname?.length, value: sname },
    { name: "phone", filled: !!cell, value: cell },
    // { name: "over18", filled: !!is_18?.length, value: is_18 },
    { name: "gmt", filled: !!timeZone?.length, value: timeZone },
    { name: "grade", filled: !!grade?.length, value: grade },
    { name: "nativeLang", filled: !!lang?.length, value: lang },
    { name: "country", filled: !!country?.length, value: country },
    { name: "parentAName", filled: !!parentAName?.length, value: parentAName },
    { name: "parentBName", filled: !!parentBName?.length, value: parentBName },
    { name: "state", filled: !!state?.length, value: state },
    {
      name: "parentAEmail",
      filled: !!parentAEmail?.length,
      value: parentAEmail,
    },
    {
      name: "parentBEmail",
      filled: !!parentBEmail?.length,
      value: parentBEmail,
    },
  ];

  if (isLoading) return <Loading height="calc(100vh - 50px)" />;
  return (
    <form
      onSubmit={(e) => saver(e, student.AcademyId)}
      style={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        background: editMode ? "inherit" : "rgb(233, 236, 239)",
      }}
    >
      {!!student.StatusReason?.length && <div className="m-3 highlight text-danger w-auto"><FaExclamationCircle color="red" /> {student.StatusReason}</div>
      }<div
        className="d-flex justify-content-center container mt-4"
        style={{ height: "100%", gap: "3%" }}
      >
        <div className="text-center" style={{ width: "30%" }}>
          <div>
            <h6 className="m-0"> <span className="text-primary">{student.FirstName} {student.MiddleName} {student.LastName}</span>
            </h6>
          </div>
          <h6 style={{ whiteSpace: "nowrap" }} className="fw-bold">
            Profile Photo
          </h6>
          <input
            className="form-control"
            disabled={!editMode}
            type="file"
            data-type="file"
            required={false}
            onChange={handleImage}
            style={{ display: "none" }}
            id="photo"
          />
          <div
            className="m-auto border shadow rounded-circle"
            style={{ width: "200px", height: "200px" }}
          >
            <Avatar avatarSrc={photo} showOnlineStatus={false} size="180" />
          </div>
          <label id="btn" className="action-btn mt-4" htmlFor="photo">
            <div className="button__content">
              <div className="button__text">Upload</div>
            </div>
          </label>

          <div className="rounded border shadow p-2 mt-4 bg-light">
            <div>
              <h6>Type tutor's code here</h6>
              <div
                className="mb-2 d-flex align-items-center justify-content-center"
                style={{ gap: "2%" }}
              >
                <div className="w-50">
                  <Input
                    required={false}
                    setValue={set_code}
                    value={code}
                    label={<p className="bg-light p-1">Enter received Code here </p>}
                  />
                </div>

                <TAButton onClick={handleConnectClick} buttonText={"Connect"} />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column" style={{ width: "66%" }}>
          <div className="d-flex" style={{ width: "100%", gap: "3%" }}>
            <div className="profile-details-cnt" style={{ width: "48%" }}>
              {/* <div className="input-group mb-2 ">
                <Input
                  validationFn={nameValidations}
                  setValue={set_fname}
                  setErrors={setErrors}
                  errors={errors}
                  fieldName="First Name"
                  value={fname}
                  required={true}
                  label={
                    <MandatoryFieldLabel
                      text="First Name"
                      editMode={editMode}
                      name={"fname"}
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  editMode={!nameFieldsDisabled}
                />
              </div> */}

              {/* <div className="input-group mb-2 ">
                <Input
                  setErrors={setErrors}
                  errors={errors}
                  fieldName="Middle Name"
                  validationFn={nameValidations}
                  setValue={set_mname}
                  value={mname}
                  required={false}
                  label={
                    <OptionalFieldLabel
                      label={"Middle Name"}
                      editMode={editMode}
                    />
                  }
                  editMode={!nameFieldsDisabled}
                />
              </div> */}

              {/* <div className="input-group mb-2 ">
                <Input
                  setErrors={setErrors}
                  errors={errors}
                  fieldName="Last Name"
                  validationFn={nameValidations}
                  setValue={set_sname}
                  value={sname}
                  label={
                    <MandatoryFieldLabel
                      text="Last Name"
                      editMode={editMode}
                      name="lname"
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  editMode={!nameFieldsDisabled}
                />
              </div> */}

              <div className="input-group mb-2 ">
                <Input
                  value={user.role === "student" ? user.email : email}
                  label={
                    <MandatoryFieldLabel text="Email" editMode={editMode} />
                  }
                  editMode={false}
                />
              </div>

              <div className="input-group mb-2 ">
                <div className="input w-100">
                  <PhoneInput
                    disabled={!editMode}
                    defaultCountry="us"
                    value={cell || ""}
                    onChange={(cell) => set_cell(cell)}
                    required
                  />
                  <span
                    className="input__label roboto-medium"
                    style={{
                      top: "6px",
                      left: "0px",
                      zIndex: "99",
                      padding: "2px",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "14px",
                      background: editMode ? "white" : "rgb(233, 236, 239)",
                      transform: " translate(0.25rem, -65%) scale(0.8)",
                    }}
                  >
                    <MandatoryFieldLabel
                      name="phone"
                      mandatoryFields={mandatoryFields}
                      editMode={editMode}
                      text={"Phone"}
                    />

                  </span>
                </div>
              </div>

              <div className="input-group mb-2">
                <Select
                  editMode={editMode}
                  label={
                    <MandatoryFieldLabel
                      text="GMT"
                      editMode={editMode}
                      name="gmt"
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  setValue={set_timeZone}
                  value={timeZone}
                >
                  <option
                    style={{
                      height: "50px",
                      width: "100%",
                      outline: "none",
                      padding: "0 10px 0 10px",
                      borderRadius: "0",
                    }}
                    value=""
                    disabled={student.Status === "active"}
                  >
                    GMT
                  </option>
                  {GMT.map((item, index) => (
                    <option
                      key={index}
                      className={item.GMT}
                      style={{
                        height: "80px",
                        width: "100%",
                        outline: "none",
                        padding: "0 10px 0 10px",
                        borderRadius: "0",
                      }}
                      value={item.GMT}
                    >
                      {item.GMT}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="input-group mb-2 ">
                <Select
                  editMode={editMode}
                  label={
                    <MandatoryFieldLabel
                      text="Grade"
                      editMode={editMode}
                      name="grade"
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  setValue={set_grade}
                  value={grade}
                >
                  {GradeList}
                </Select>
              </div>

              <div className="input-group mb-2 ">
                <Select
                  editMode={editMode}
                  label={
                    <MandatoryFieldLabel
                      text="Native Language"
                      editMode={editMode}
                      name={"nativeLang"}
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  setValue={set_lang}
                  value={lang}
                >
                  <option value="" disabled={student.Status === "active"}>
                    Select Language
                  </option>
                  {lang_list.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="input-group mb-2">
                <Select
                  editMode={editMode}
                  label={
                    <OptionalFieldLabel
                      label="Secondry Language(s)"
                      editMode={editMode}
                    />
                  }
                  setValue={setSecLang}
                  value={secLan}
                >
                  <option value="null">Select Language</option>
                  {lang_list.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="profile-details-cnt" style={{ width: "48%" }}>
              <div className="input-group mb-2 ">
                <Input
                  setValue={set_add1}
                  value={add1}
                  label={
                    <OptionalFieldLabel
                      label={"Address 1"}
                      editMode={editMode}
                    />
                  }
                  required={false}
                  editMode={editMode}
                />
              </div>

              <div className="input-group mb-2 ">
                <Input
                  setValue={set_add2}
                  value={add2}
                  required={false}
                  label={
                    <OptionalFieldLabel
                      label={"Adress 2"}
                      editMode={editMode}
                    />
                  }
                  editMode={editMode}
                />
              </div>

              <div className="input-group mb-2 ">
                <Input
                  setValue={set_city}
                  value={city}
                  required={false}
                  label={
                    <OptionalFieldLabel
                      label={"City/Town"}
                      editMode={editMode}
                    />
                  }
                  editMode={editMode}
                />
              </div>
              <div className="input-group mb-2 ">
                <Select
                  editMode={editMode}
                  label={
                    <MandatoryFieldLabel
                      text="Country"
                      editMode={editMode}
                      name="country"
                      mandatoryFields={mandatoryFields}
                    />
                  }
                  setValue={set_country}
                  value={country}
                >
                  <option
                    style={{
                      height: "50px",
                      width: "100%",
                      outline: "none",
                      padding: "0 10px 0 10px",
                      borderRadius: "0",
                    }}
                    value=""
                    disabled={student.Status === "active"}
                  >
                    Country
                  </option>
                  {Countries.map((item, index) => (
                    <option
                      key={index}
                      className={item.Country}
                      style={{
                        height: "80px",
                        width: "100%",
                        outline: "none",
                        padding: "0 10px 0 10px",
                        borderRadius: "0",
                      }}
                      value={item.Country}
                    >
                      {item.Country}
                    </option>
                  ))}
                </Select>
              </div>

              {options[country] && (
                <div className="input-group mb-2 ">
                  <Select
                    editMode={editMode}
                    label={
                      <MandatoryFieldLabel
                        text="State"
                        editMode={editMode}
                        name="state"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    setValue={set_state}
                    value={state}
                  >
                    <option value="" disabled={student.Status === "active"}>
                      Select State
                    </option>

                    {options[country].map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="input-group mb-2">
                <Input
                  setValue={set_zipCode}
                  value={zipCode}
                  required={false}
                  label={
                    <OptionalFieldLabel
                      label={"Zip Code"}
                      editMode={editMode}
                    />
                  }
                  editMode={editMode}
                />
              </div>
              <div className="input-group mb-2 ">
                <Input
                  value={dateTime}
                  label={<MandatoryFieldLabel text="UTC" editMode={editMode} />}
                  editMode={false}
                />
              </div>
              <div className="form-check d-flex gap-2 align-items-center">
                <input
                  style={{ width: "20px", height: "20px" }}
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheckbox"
                  disabled={!editMode}
                  checked={is_18}
                  onChange={(e) => set_is_18(!is_18)}
                />
                <label className="form-check-label" htmlFor="exampleCheckbox">
                  Are you over 18?
                </label>
              </div>

              {["Freshman", "Junior", "Senior", "Sophmore"].includes(grade) && (
                <div
                  className="d-flex flex-column justify-content-center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <div className="form-check d-flex gap-2 align-items-center ">
                    <input
                      style={{ width: "20px", height: "20px" }}
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheckbox"
                      disabled={!editMode}
                      checked={parentConsent}
                      onChange={() => set_parentConsent(!parentConsent)}
                    />
                    <label
                      className="form-check-label mr-3"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Video recording consent
                    </label>
                    <Tooltip
                      text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
                      width="200px"
                    >
                      <FaInfoCircle size={15} color="#0096ff" />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!["Freshman", "Junior", "Senior", "Sophmore"].includes(grade) && (
            <div
              className="d-flex flex-column border rounded shadow p-2 m-2"
              style={{ gap: "2%" }}
            >
              <h6 className="mb-3 fw-bold">Parent Info</h6>
              <div className="d-flex" style={{ gap: "2%" }}>
                <div className="input-group mb-2 ">
                  <Input
                    type="email"
                    value={parentAEmail}
                    label={
                      <MandatoryFieldLabel
                        text="Parent A Email"
                        editMode={editMode}
                        name="parentAEmail"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    editMode={editMode}
                    setValue={setParentAEmail}
                    required={!is_18 && student.Status === "active"}
                  />
                </div>

                <div className="input-group mb-2 ">
                  <Input
                    value={parentAName}
                    label={
                      <MandatoryFieldLabel
                        text="Parent A Name"
                        editMode={editMode}
                        name="parentAName"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    editMode={editMode}
                    setValue={setParentAName}
                    required={!is_18 && student.Status === "active"}
                  />
                </div>
              </div>
              <div className="d-flex" style={{ gap: "2%" }}>
                <div className="input-group mb-2">
                  <Input
                    type="email"
                    value={parentBEmail}
                    label={
                      <MandatoryFieldLabel
                        text="Parent B Email"
                        editMode={editMode}
                        name={"parentBEmail"}
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    editMode={editMode}
                    setValue={setParentBEmail}
                    required={!is_18 && student.Status === "active"}
                  />
                </div>

                <div className="input-group mb-2 ">
                  <Input
                    value={parentBName}
                    label={
                      <MandatoryFieldLabel
                        text="Parent B Name"
                        editMode={editMode}
                        name="parentBName"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    editMode={editMode}
                    setValue={setParentBName}
                    required={!is_18 && student.Status === "active"}
                  />
                </div>
              </div>

              {!is_18 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    className="form-check form-switch d-flex gap-3"
                    style={{ fontSize: "16px " }}
                  >
                    <input
                      className="form-check-input border border-dark m-1"
                      disabled={!editMode}
                      type="checkbox"
                      role="switch"
                      style={{
                        width: "30px",
                        height: "15px",
                      }}
                      onChange={() => {
                        set_parentConsent(!parentConsent);
                      }}
                      checked={
                        parentConsent === "true" || parentConsent === true
                      }
                    />
                    <label
                      className="form-check-label mr-3"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Parent(s) consent to record lesson.
                    </label>
                    <Tooltip
                      text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers."
                      width="200px"
                    >
                      <FaInfoCircle size={18} color="#0096ff" />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Actions
        editDisabled={editMode}
        onEdit={() => setEditMode(true)}
        loading={saving}
        saveDisabled={!editMode}
        unSavedChanges={unSavedChanges}
      />
    </form>
  );
};

export default StudentSetup;
