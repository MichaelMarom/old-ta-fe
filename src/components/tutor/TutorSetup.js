import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsCameraVideo, BsCloudUpload } from "react-icons/bs";
import { moment } from "../../config/moment";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

import { toast } from "react-toastify";
import { RiRobot2Fill } from "react-icons/ri";

import { post_tutor_setup } from "../../axios/tutor";
import { apiClient } from "../../axios/config";
import { useDispatch } from "react-redux";
// import { setscreenNameTo } from "../../redux/tutor_store/ScreenName";
import { convertGMTOffsetToLocalString } from "../../helperFunctions/timeHelperFunctions";
import WebcamCapture from "./Recorder/VideoRecorder";
import Loading from "../common/Loading";
import ToolTip from "../common/ToolTip";

import Actions from "../common/Actions";
import { uploadVideo } from "../../redux/tutor_store/video";
import {
  AUST_STATES,
  CAN_STATES,
  Countries,
  GMT,
  RESPONSE,
  UK_STATES,
  US_STATES,
} from "../../constants/constants";
import { setTutor } from "../../redux/tutor_store/tutorData";
import {
  capitalizeFirstLetter,
  unsavedChangesHelper,
} from "../../helperFunctions/generalHelperFunctions";
import ReactDatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { IoPersonCircle } from "react-icons/io5";
import { convertToDate } from "../common/Calendar/Calendar";
import Tooltip from "../common/ToolTip";
import { FaInfoCircle } from "react-icons/fa";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const TutorSetup = () => {
  const [editMode, setEditMode] = useState(false);
  let [fname, set_fname] = useState("");
  let [mname, set_mname] = useState("");
  let [lname, set_sname] = useState("");
  let [cell, set_cell] = useState("");
  let [add1, set_add1] = useState("");
  let [add2, set_add2] = useState("");
  let [city, set_city] = useState("");
  let [state, set_state] = useState("");
  let [zipCode, set_zipCode] = useState("");
  let [country, set_country] = useState("");
  let [timeZone, set_timeZone] = useState("");
  let [dateTime, setDateTime] = useState(moment());
  let [response_zone, set_response_zone] = useState("");
  let [intro, set_intro] = useState("");
  let [motivation, set_motivation] = useState("");
  let [headline, set_headline] = useState("");
  let [photo, set_photo] = useState("");
  const lastNameInputRef = useRef(null);
  let [video, set_video] = useState("");

  let grades = [
    { grade: "1st grade" },
    { grade: "2nd grade" },
    { grade: "3rd grade" },
    { grade: "4th grade" },
    { grade: "5th grade" },
    { grade: "6th grade" },
    { grade: "7th grade" },
    { grade: "8th grade" },
    { grade: "9th grade" },
    { grade: "10th grade" },
    { grade: "11th grade" },
    { grade: "12th grade" },
    { grade: "Academic" },
  ];

  let [tutorGrades, setTutorGrades] = useState([]);
  const isValid = isPhoneValid(cell);
  const { user } = useSelector((state) => state.user);
  const [email, set_email] = useState(user?.email);
  const [unSavedChanges, setUnsavedChanges] = useState(false);
  let [countryList, setCountryList] = useState("");
  let [GMTList, setGMTList] = useState("");
  let [response_list, set_response_list] = useState("");
  let dispatch = useDispatch();

  let [userExist, setUserExist] = useState(false);
  const [uploadPhotoClicked, setUploadPhotoClicked] = useState(false);
  const [uploadVideoClicked, setUploadVideoClicked] = useState(false);
  const [userId, setUserId] = useState(user.SID);
  const [picUploading, setPicUploading] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);

  const [vacation_mode, set_vacation_mode] = useState(false);
  const [start, setStart] = useState(moment(new Date()).toDate());
  const [end, setEnd] = useState(moment(new Date()).endOf("day").toDate());

  const [dbCountry, setDBCountry] = useState(null);

  const { tutor, isLoading: tutorDataLoading } = useSelector(
    (state) => state.tutor
  );
  const { isLoading } = useSelector((state) => state.video);
  const [nameFieldsDisabled, setNameFieldsDisabled] = useState(false);
  let [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    tutor.AcademyId &&
      apiClient
        .get("/tutor/setup/intro", {
          params: { user_id: tutor.AcademyId.replace(/[.\s]/g, "") },
        })
        .then((res) => {
          res?.data?.url && set_video(res.data.url);
        })
        .catch((err) => console.log(err));
  }, [tutor]);

  useEffect(() => {
    if (
      convertToDate(tutor.EndVacation).getTime() < new Date().getTime() &&
      tutor.VacationMode
    ) {
      post_tutor_setup({
        userId: tutor.userId,
        fname: tutor.FirstName,
        lname: tutor.LastName,
        mname: tutor.MiddleName,
        vacation_mode: false,
      });
      dispatch(setTutor());
    }
  }, [tutor, userId]);

  const options = {
    Australia: AUST_STATES,
    USA: US_STATES,
    Canada: CAN_STATES,
    UnitedKingdom: UK_STATES,
  };

  useEffect(() => {
    if (tutor.AcademyId) {
      setEditMode(false);
      setNameFieldsDisabled(true);
    } else {
      setEditMode(true);
      setNameFieldsDisabled(false);
    }
  }, [tutor]);

  useEffect(() => {
    set_email(user?.email);
  }, [user]);

  //reset state on country change
  useEffect(() => {
    if (country !== dbCountry) {
      set_state("");
    }
  }, [country, dbCountry]);

  const [selectedVideoOption, setSelectedVideoOption] = useState(null);

  const handleOptionClick = (option) => {
    setUploadVideoClicked(true);
    setSelectedVideoOption(option);
  };

  let handleTutorGrade = (grade) => {
    if (tutorGrades.some((item) => item === grade)) {
      const removedGrades = tutorGrades.filter((item) => item !== grade);
      setTutorGrades(removedGrades);
    } else setTutorGrades([...tutorGrades, grade]);
  };

  //upload photo
  useEffect(() => {
    const postImage = async () => {
      if (uploadPhotoClicked && userExist) {
        setPicUploading(true);
        await post_tutor_setup({ photo, fname, lname, mname, userId });
        setPicUploading(false);

        setUploadPhotoClicked(false);
        dispatch(setTutor());
      }
    };
    postImage();
  }, [photo, userExist, fname, lname, mname, userId, uploadPhotoClicked]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  //upload video
  useEffect(() => {
    const upload_video = async () => {
      if (uploadVideoClicked && userExist) {
        if (tutor.FirstName && video !== tutor.Video)
          dispatch(uploadVideo({ video, fname, lname, mname, userId }));
        // dispatch(setTutor())
      }
    };
    upload_video();
  }, [
    video,
    tutor,
    fname,
    lname,
    photo,
    mname,
    userExist,
    userId,
    uploadVideoClicked,
  ]);

  useEffect(() => {
    const fetchTutorSetup = async () => {
      if (tutor.AcademyId) {
        let data = tutor;

        setUserId(tutor.userId);
        setUserExist(true);
        set_fname(data.FirstName);
        set_sname(data.LastName);
        set_mname(data.MiddleName);
        set_photo(data.Photo);
        set_cell(data.CellPhone);
        set_state(data.StateProvince);
        set_email(data.email);
        set_city(data.CityTown);
        set_country(data.Country);
        setDBCountry(data.Country);
        set_response_zone(data.ResponseHrs);
        set_intro(data.Introduction);
        set_motivation(data.Motivate);
        set_timeZone(data.GMT);
        set_zipCode(data.ZipCode);
        set_headline(data.HeadLine);
        set_add1(data.Address1);
        set_add2(data.Address2);
        setTutorGrades(JSON.parse(data?.Grades ?? "[]"));

        set_video(data.Video);
        setSelectedVideoOption("upload");
        set_vacation_mode(data.VacationMode);
        setStart(data.StartVacation);
        setEnd(data.EndVacation);
      }
      setUploadPhotoClicked(false);
    };
    fetchTutorSetup();
  }, [tutor]);

  // comparing db and local
  useEffect(() => {
    let newTutor;
    if (!tutor.AcademyId) {
      newTutor = {
        FirstName: "",
        MiddleName: "",
        LastName: "",
        CellPhone: "+1",
        Address1: "",
        Address2: "",
        CityTown: "",
        StateProvince: "",
        ZipCode: "",
        Country: "",
        GMT: "",
        ResponseHrs: "",
        Introduction: "",
        Motivate: "",
        HeadLine: "",
        Grades: `[]`,
        VacationMode: false,
      };
    }
    let formValues = {
      fname,
      mname,
      lname,
      cell,
      add1,
      add2,
      city,
      state,
      zipCode,
      country,
      timeZone,
      response_zone,
      intro,
      motivation,
      headline,
      tutorGrades,
      vacation_mode,
    };
    setUnsavedChanges(
      unsavedChangesHelper(formValues, tutor.AcademyId ? tutor : newTutor)
    );
  }, [
    fname,
    mname,
    lname,
    cell,
    add1,
    add2,
    city,
    state,
    zipCode,
    country,
    timeZone,
    dateTime,
    response_zone,
    intro,
    motivation,
    headline,
    tutorGrades,
    tutor,
    vacation_mode,
  ]);

  const saveTutorSetup = async (e) => {
    e.preventDefault();
    if (!isValid) {
      return toast.warning("Please enter the correct phone number");
    }
    if (!video || !photo)
      toast.warning(`You did not upload your Photo or Video, therefore 
    your Profile remains in 'Pending' status, until you upload the missing items!`);
    if (!tutorGrades?.length > 0) {
      return toast.warning("Please select at least one School grade");
    }

    setSavingRecord(true);
    let response = await saver();
    setSavingRecord(false);
    if (response.status === 200) {
      dispatch(setTutor());
      window.localStorage.setItem(
        "tutor_screen_name",
        response.data?.[0]?.TutorScreenname
      );
      localStorage.setItem("tutor_user_id", response.data?.[0]?.AcademyId);
      // dispatch(setscreenNameTo(response.data?.[0]?.TutorScreenname));
      setEditMode(false);
      toast.success("Data saved successfully");
    } else {
      toast.error("Error saving the Data ");
    }
  };

  let saver = async () => {
    const body = {
      fname,
      mname,
      lname,
      cell,
      add1,
      add2,
      city,
      state,
      zipCode,
      country,
      timeZone,
      response_zone,
      intro,
      motivation,
      headline,
      tutorGrades,
      userId: tutor.userId ? tutor.userId : user?.SID,
      grades: tutorGrades,
      start: vacation_mode ? start : moment().toDate(),
      end: vacation_mode ? end : moment().endOf().toDate(),
      vacation_mode,
    };
    if (!tutor.FirstName) body.video = video;
    if (!tutor.FirstName) body.photo = photo;
    if (!tutor.AcademyId) body.Step = 2;

    let response = await post_tutor_setup(body);
    return response;
  };

  useEffect(() => {
    const sortedCountries = Countries.sort((a, b) =>
      a.Country.localeCompare(b.Country)
    );
    let countries = sortedCountries.map((item) => (
      <option
        key={item.Country}
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
    let countries_select_head = (
      <option
        key="null"
        value={""}
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        disabled
      >
        Country
      </option>
    );

    countries.unshift(countries_select_head);
    setCountryList(countries);

    let list = GMT.map((item) => (
      <option
        key={item.GMT}
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
    let head = (
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
      >
        Select
      </option>
    );

    list.unshift(head);
    setGMTList(list);

    let response_list = RESPONSE.map((item) => (
      <option
        key={item.Response}
        className={item.Response}
        style={{
          height: "80px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value={item.Response}
      >
        {item.Response}
      </option>
    ));
    let response_head = (
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
      >
        Select
      </option>
    );

    response_list.unshift(response_head);
    set_response_list(response_list);
  }, []);

  let handleImage = () => {
    setUploadPhotoClicked(true);

    let f = document.querySelector("#photo");

    let type = [...f.files]?.[0]?.type;

    if (type.split("/")?.[0] !== "image") {
      alert("Only Image Can Be Uploaded To This Field");
    } else {
      // frame.innerHTML = "";

      let reader = new FileReader();

      reader.onload = (result) => {
        // let img = `<img src='${reader.result}' style='height: 100%; width: 100%; '}} alt='photo' />`;

        set_photo(reader.result);

        // frame?.insertAdjacentHTML("afterbegin", img);
      };
      reader.readAsDataURL([...f.files]?.[0]);
    }
  };

  let handleVideo = () => {
    let f = document.querySelector("#video");

    let type = [...f.files]?.[0]?.type;

    if (type.split("/")?.[0] !== "video") {
      alert("Only Video Can Be Uploaded To This Field");
    } else {
      let reader = new FileReader({});

      reader.onload = (result) => {
        set_video(reader.result);
      };
      reader.readAsDataURL([...f.files]?.[0]);
    }
  };

  let counter = (inputs, elem, cb, length) => {
    let charLength = inputs?.length;
    cb(inputs);

    if (charLength < length) {
      elem.style.border = "1px solid black";
      elem.nextElementSibling?.removeAttribute("id");
    } else {
      elem.style.border = "1px solid red";
      elem.nextElementSibling?.setAttribute("id", "inputValidator");
    }
  };

  useEffect(() => {
    const localTime = convertGMTOffsetToLocalString(timeZone);
    setDateTime(localTime);
  }, [timeZone]);

  useEffect(() => {
    if (vacation_mode) {
      setStart(moment().toDate());
      setEnd(moment().endOf("day").toDate());
    }
  }, [vacation_mode]);

  const gmtInInt = timeZone ? parseInt(timeZone) : 0;
  // for reactdatepicker because it opertae on new Date() not on moment.
  // getting getLocalGMT and then multiple it with -1 to add (-5:00) or subtract (+5:00)
  const getLocalGMT =
    parseInt(
      ((offset) =>
        (offset < 0 ? "+" : "-") +
        ("00" + Math.abs((offset / 60) | 0)).slice(-2) +
        ":" +
        ("00" + Math.abs(offset % 60)).slice(-2))(
        new Date().getTimezoneOffset()
      )
    ) * -1;

  if (tutorDataLoading) return <Loading height="80vh" />;
  return (
    <form onSubmit={saveTutorSetup}>
      <div style={{ overflowY: "auto", height: "76vh" }}>
        <div
          className="d-flex justify-content-between"
          style={{
            gap: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            marginTop: "0",
          }}
        >
          <div className="profile-photo-cnt " style={{ width: "15%" }}>
            <h6 className="text-start m-0" style={{ whiteSpace: "nowrap" }}>
              Profile Photo
            </h6>
            {/* <input
              type="file"
              data-type="file"
              name="photo"
              onChange={handleImage}
              style={{ display: "none" }}
              id="photo"
            /> */}
            <div className="mb-2 w-100 h-100">
              {picUploading && (
                <Loading
                  height="10px"
                  iconSize="20px"
                  loadingText="uploading picture ..."
                />
              )}
            </div>
            <div className=" h-100 border shadow">
              {photo ? (
                <img
                  src={photo}
                  style={{ height: "230px", width: "230px" }}
                  alt="profile-pic"
                />
              ) : (
                `You must upload your picture, and video on this tab.  
                  You are permitted to move to next tabs without validating that, but your account will not be activated until it’s done`
              )}
            </div>

            <input
              type="file"
              data-type="file"
              name="photo"
              onChange={handleImage}
              style={{ display: "none" }}
              id="photo"
              disabled={!editMode}
            />
            <label
              id="btn"
              onClick={() =>
                !editMode &&
                toast.info(
                  'Please click the "Edit" button to activate the "Upload" Photo button!'
                )
              }
              style={{
                // pointerEvents: !editMode ? "none" : "auto",
                width: "50%",
              }}
              type="label"
              disabled={!editMode}
              htmlFor="photo"
              className="action-btn btn mt-4"
            >
              <div className="button__content">
                <div className="button__icon">
                  <IoPersonCircle size={20} />
                </div>
                <p className="button__text">Upload </p>
              </div>
            </label>
          </div>

          <div className="mt-4" style={{ width: "25%" }}>
            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                First Name
              </label>
              <input
                required
                disabled={nameFieldsDisabled}
                onChange={(e) => set_fname(e.target.value)}
                placeholder="First Name"
                value={fname}
                type="text"
                id="fname"
                className="form-control m-0"
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Middle
              </label>
              <input
                disabled={nameFieldsDisabled}
                onInput={(e) => set_mname(e.target.value)}
                placeholder="Optional"
                value={mname}
                className="form-control m-0"
                type="text"
                id="mname"
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Last Name
              </label>
              <input
                required
                disabled={nameFieldsDisabled}
                onInput={(e) => set_sname(e.target.value)}
                placeholder="Last Name"
                value={lname}
                type="text"
                id="lname"
                className="form-control m-0"
                onBlur={() => {
                  if (fname.length && lname.length) {
                    const screenName = `${capitalizeFirstLetter(fname)} ${
                      mname.length
                        ? `${capitalizeFirstLetter(mname?.[0])}.`
                        : ``
                    } ${capitalizeFirstLetter(lname?.[0])}.`;
                    toast(
                      `You screen name is; ${screenName} which we use online. We do not disclose your private information online. 
                    We use your cellphone only for verification to withdraw your funds, or for events notifications like
                    students booking/postponding/cancelling lessons, etc'. `,
                      {
                        closeButton: true,
                        autoClose: false,
                        className: "setup-private-info",
                      }
                    );
                  }
                }}
                ref={lastNameInputRef}
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",
                alignItems: "center",

                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Email
              </label>
              <input
                className="form-control m-0"
                placeholder="Email"
                value={email}
                type="text"
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="w-50 input-group-text" htmlFor="">
                Cell Phone
              </label>

              <PhoneInput
                defaultCountry="us"
                value={cell}
                onChange={(cell) => set_cell(cell)}
                required
                disabled={nameFieldsDisabled}
                style={{ width: "66%" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",

                whiteSpace: "nowrap",
              }}
            >
              <label
                className="input-group-text w-50"
                htmlFor=""
                style={{ fontSize: "14px" }}
              >
                <ToolTip
                  width="200px"
                  text="Select your response time answering the student during business time in your time zone. Please take notice that the student take this fact as one of the considurations of selecting you as tutor."
                />{" "}
                Response Time
              </label>
              <select
                className="form-select m-0"
                onInput={(e) => set_response_zone(e.target.value)}
                value={response_zone}
                id="resZone"
                disabled={!editMode}
                required
              >
                {response_list}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                <ToolTip
                  width="200px"
                  text={
                    "Select the Greenwich Mean Time (GMT) zone where you reside. It will let the student configure his time availability conducting lessons with you, when in a different time zone. "
                  }
                />{" "}
                Time Zone
              </label>
              <select
                className="form-select m-0"
                onInput={(e) => set_timeZone(e.target.value)}
                id="timeZone"
                disabled={!editMode}
                value={timeZone}
                required
              >
                {GMTList}
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ width: "25%" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <label
                className="input-group-text w-50"
                htmlFor=""
                style={{ fontSize: "14px" }}
              >
                Address 1
              </label>
              <input
                className="form-control m-0"
                onInput={(e) => set_add1(e.target.value)}
                placeholder="Address 1"
                value={add1}
                type="text"
                id="add1"
                required
                disabled={!editMode}
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Address 2
              </label>
              <input
                className="form-control m-0"
                onInput={(e) => set_add2(e.target.value)}
                placeholder="Optional"
                value={add2}
                disabled={!editMode}
                type="text"
                id="add2"
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                margin: "0 0 10px 0",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                City/Town
              </label>
              <input
                className="form-control m-0"
                onInput={(e) => set_city(e.target.value)}
                placeholder="City"
                type="text"
                required
                value={city}
                id="city"
                disabled={!editMode}
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                margin: "0 0 10px 0",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="country">
                Country
              </label>
              <select
                required
                className="form-select m-0"
                onInput={(e) => set_country(e.target.value)}
                id="country"
                value={country}
                disabled={!editMode}
              >
                {countryList}
              </select>
            </div>
            {(options[country] ?? [])?.length ? (
              <div
                className="mb-2"
                style={{
                  display: (options[country] ?? [])?.length ? "flex" : "none",
                  width: "100%",

                  alignItems: "center",

                  whiteSpace: "nowrap",
                }}
              >
                <label className="input-group-text w-50" htmlFor="">
                  State/Province
                </label>

                {(options[country] ?? [])?.length ? (
                  <select
                    className="form-select "
                    onInput={(e) => set_state(e.target.value)}
                    id="state"
                    disabled={!editMode}
                    value={state}
                    required
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {(options[country] ?? []).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-control m-0"
                    disabled
                    type="text"
                    value={state}
                    onChange={(e) => set_state(e.target.value)}
                  />
                )}
              </div>
            ) : (
              ""
            )}

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",

                whiteSpace: "nowrap",
              }}
            >
              <span className="input-group-text w-50" htmlFor="">
                Zip Code
              </span>
              <input
                className="form-control m-0"
                onInput={(e) => set_zipCode(e.target.value)}
                value={zipCode}
                disabled={!editMode}
                placeholder="Zip Code"
                type="text"
                required
                id="zip"
              />
            </div>

            {!!timeZone && (
              <div
                style={{
                  display: "flex",
                  width: "100%",

                  alignItems: "center",

                  whiteSpace: "nowrap",
                }}
              >
                <label className="input-group-text w-50" htmlFor="">
                  <ToolTip
                    width="200px"
                    text={
                      "Coordinated Universal Time or 'UTC' is the primary time standard by which the world regulate local time. "
                    }
                  />{" "}
                  UTC
                </label>
                <input
                  className="form-control m-0"
                  disabled
                  value={typeof dateTime === "object" ? "" : dateTime}
                />
              </div>
            )}
          </div>

          <div
            className=" "
            style={{
              float: "right",
              width: "30%",
              height: "250px",
              border: "1px solid dotted",
            }}
          >
            <h6>Tutor's introduction video</h6>
            <div className="mb-2">
              {isLoading && (
                <Loading
                  height="10px"
                  iconSize="20px"
                  loadingText="uploading video ..."
                />
              )}
            </div>
            {selectedVideoOption === "record" ? (
              <div className="d-flex justify-content-center align-item-center w-100 h-100 border shadow">
                <WebcamCapture
                  user_id={tutor.AcademyId}
                  record_duration={60000}
                />

                {/* {newVideo &&
                  <video width="320" height="240" autoplay controls>
                    <source id="video_path" src={newVideo} type="video/mp4" />
                  </video>
                } */}
              </div>
            ) : selectedVideoOption === "upload" && video?.length ? (
              <div className="d-flex justify-content-center align-item-center w-100 h-100 border shadow">
                <video
                  src={video}
                  className="w-100 h-100 m-0 p-0 videoLive"
                  controls
                  autoPlay={false}
                />
              </div>
            ) : (
              <div className="tutor-tab-video-frame p-2 card">
                <div style={{ textAlign: "justify", fontSize: "12px" }}>
                  {" "}
                  Providing your video, is mandatory. Your registration is at
                  the stage of 'pending' until you upload it. An introduction
                  video is a great way to showcase your personality, skills and
                  teaching style for potential students. It can help you stand
                  out from other tutors and attract more atudents. Creating your
                  video, briefly introduce yourself, your experience and your
                  approach to tutoring. Mention what subjects and levels you can
                  teach, and how you can help students achieve their goals. You
                  should speak clearly, and confidently. A good introduction
                  video can make a lasting impression and increase your chances
                  of getting hired. View samples; <br />
                  <Link to="https://www.youtube.com/watch?v=tZ3ndrKQXN8">
                    Sample 1: Intro Video
                  </Link>{" "}
                  <br />
                  <Link to="https://www.youtube.com/watch?v=sxa2C6UmrNQ">
                    Sample 2: How to make an Introduction Video
                  </Link>{" "}
                  <br />
                  <Link to="https://www.heygen.com">
                    Sample 3: Create your free AI Introduction Video, in 3
                    minutes or less.
                  </Link>
                </div>
              </div>
            )}

            <div className=" mt-2">
              <div
                className="row justify-content-center align-items-center"
                onClick={() =>
                  !editMode &&
                  toast.info(
                    'Please click the "Edit" button to activate the "Upload", or "Record" video buttons!'
                  )
                }
              >
                <div className="col-md-4">
                  <div className="">
                    <Button
                      className="action-btn btn btn-sm "
                      style={{ width: "100%", fontSize: "12px" }}
                      disabled={!editMode}
                      onClick={() => window.open("https://www.heygen.com")}
                    >
                      <div className="button__content">
                        <div className="button__icon">
                          <RiRobot2Fill size={18} />
                        </div>
                        <p className="button__text"> Create AI intro</p>
                      </div>
                    </Button>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="">
                    <button
                      style={{ width: "100%", fontSize: "10px" }}
                      type="button"
                      className={`action-btn btn small ${
                        selectedVideoOption === "record" ? "active" : ""
                      }`}
                      disabled={!editMode}
                      onClick={() => {
                        set_video("");
                        handleOptionClick("record");
                        setIsRecording(!isRecording);
                      }}
                    >
                      <div className="button__content">
                        <div className="button__icon">
                          <BsCameraVideo size={15} />
                        </div>
                        <p className="button__text">Record Video </p>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="">
                    <input
                      data-type="file"
                      defaultValue={""}
                      onChange={handleVideo}
                      type="file"
                      name="video"
                      disabled={!editMode}
                      style={{ display: "none" }}
                      id="video"
                    />
                    <label
                      id="btn"
                      onClick={() => handleOptionClick("upload")}
                      type="button"
                      htmlFor="video"
                      style={{
                        width: "100%",
                        // pointerEvents: !editMode ? "none" : "auto",
                        fontSize: "10px",
                      }}
                      className={`action-btn btn ${
                        selectedVideoOption === "upload" ? "active" : ""
                      }`}
                    >
                      <div className="button__content">
                        <div className="button__icon">
                          <BsCloudUpload size={15} /> <br />
                        </div>
                        <p className="button__text"> Upload Video</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 ">
          <div
            className="d-flex justify-content-center"
            style={{ gap: "10px", width: "86%" }}
          >
            <div
              className="border rounded p-2 shadow d-flex flex-column justify-content-between"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                width: "40%",
                height: "120px",
              }}
            >
              <label>Grades I teach</label>
              <div className="tutor-grades">
                <ul className="grades-sec">
                  {grades.map((item, index) => {
                    const isChecked = tutorGrades.includes(item.grade);
                    return (
                      <li key={index}>
                        <div
                          className="input-cnt"
                          style={{
                            width: "fit-content",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            style={{
                              background: "blue",
                              color: "blue",
                              height: "25px",
                              width: "25px",
                            }}
                            type="checkbox"
                            checked={isChecked}
                            disabled={!editMode}
                            id={item.grade}
                            onChange={() => handleTutorGrade(item.grade)}
                            className=" grades"
                          />
                          &nbsp;
                          <label htmlFor={item.grade}>{item.grade}</label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div
              className="border p-2 shadow rounded"
              style={{ width: "40%", height: "120px" }}
            >
              <div
                className="form-check form-switch d-flex gap-3"
                style={{ fontSize: "16px " }}
              >
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  style={{
                    width: "30px",
                    height: "15px",
                  }}
                  onChange={() => set_vacation_mode(!vacation_mode)}
                  checked={vacation_mode}
                />
                <label
                  className="form-check-label mr-3"
                  htmlFor="flexSwitchCheckChecked"
                >
                  Vacation Mode
                </label>
                <ToolTip
                  text="Turn the switch to 'On' to block the period of time you do not want to tutor. A light green color will indicate your selected period on your calendar. 
                Then students will not be able to book lessons with you for that period. 
                By the end date, the switch will turn to 'Off' automatically."
                  width="200px"
                />
              </div>
              {vacation_mode && (
                <div>
                  <h6 className="text-start">Enter Start and end Date</h6>
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "10px" }}
                  >
                    <ReactDatePicker
                      disabled={!editMode}
                      selected={
                        new Date(
                          start
                            ? start
                            : moment(new Date()).toDate().getTime() +
                              (gmtInInt + getLocalGMT) * 60 * 60 * 1000
                        )
                      }
                      onChange={(date) => {
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        const originalMoment = moment
                          .tz(date, tutor.timeZone)
                          .startOf("day");
                        const utcMomentStartDate = originalMoment.clone();
                        // utcMomentStartDate.utc()
                        // console.log(originalMoment.get('hour'), utcMomentStartDate.get('hour'), originalMoment.get('date'), date.getDate(), date.getHours())
                        setStart(utcMomentStartDate);
                      }}
                      minDate={new Date()}
                      dateFormat="MMM d, yyyy"
                      className="form-control"
                    />

                    <h6 className="m-0">and</h6>
                    <ReactDatePicker
                      disabled={!editMode}
                      minDate={new Date(start)}
                      selected={moment(end ? end : new Date()).toDate()}
                      onChange={(date) => {
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        const originalMoment = moment(date).endOf("day").utc();
                        setEnd(originalMoment.toISOString());
                      }}
                      dateFormat="MMM d, yyyy"
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ width: "86%" }}>

            <div
              className="mt-2"
              style={{
                fontWeight: "bold",
                margin: "auto",

                textAlign: "center",
                width: "60%",
              }}
            >
              <label htmlFor="headline">Headline</label>
              <br />
              <input
                className="form-control m-0 shadow w-100"
                value={headline}
                required
                spellCheck="true"
                disabled={!editMode}
                placeholder="Write A Catchy Headline.. Example: 21 years experienced nuclear science professor."
                onChange={(e) =>
                  counter(e.target.value, e.target, set_headline, 80)
                }
                type="text"
              />
              <div className="inputValidator">
                Your have reached the max limit of 80 characters.
              </div>
            </div>

            <div
              className="tutor-setup-bottom-field d-flex justify-content-between"
              style={{ gap: "20px" }}
            >
              <div
                className="profile-headline"
                style={{ textAlign: "center", float: "left" }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="intro">
                  Introduction
                </label>
                <br />
                <textarea
                  className="form-control m-0 shadow"
                  value={intro}
                  maxLength={500}
                  required
                  placeholder="The Academy mandates the tutor uploading a self introductionary video. 
                    It's important for the student to check if the tutor accent is clear for him.
                    A self-introduction video is a great way to showcase your personality and teaching style to potential students. 
                    Here are some tips on how to create a self-introduction video of tutor to students.
                    
                    - Start with a friendly greeting and introduce yourself by name, location and subject you teach.
                    - Explain why you are passionate about teaching and what you can offer to your students, such as your qualifications, experience, teaching methods and goals.
                    - Give some examples of how you make your lessons engaging, interactive and fun, such as using multimedia, games, quizzes or real-life scenarios.
                    - End with a call to action, such as inviting the students to book a trial lesson with you or to check out your profile for more information.
                    - Keep your video short and concise, ideally between 45-90 seconds.
                    - Use a clear and professional tone, avoid slang, jargon or filler words.
                    - Record your video in a quiet and well-lit place, with a neutral background and good audio quality.
                    - Review your video before uploading it and make sure it is error-free and reflects your best self.
                    "
                  onInput={(e) =>
                    counter(e.target.value, e.target, set_intro, 500)
                  }
                  style={{ width: "100%", padding: "10px", height: "160px" }}
                  name=""
                  spellCheck="true"
                  disabled={!editMode}
                  id=""
                ></textarea>
                <div className="inputValidator">
                  Your have reached the max limit of 1500 characters.
                </div>
              </div>

              <div
                className="profile-motivation"
                style={{ textAlign: "center", float: "right" }}
              >
                <label style={{ fontWeight: "bold" }} htmlFor="intro">
                  Motivate
                </label>
                <br />
                <textarea
                  className="form-control m-0 shadow"
                  value={motivation}
                  disabled={!editMode}
                  maxLength={500}
                  required
                  placeholder='Write Something That will motivate Your Students. 
                Use the "Motivate" tab to set up your promotions. 
                Like up to 30 minutes introductionary session. Discount for multi students tutoring, or paid 
                subscription for multi lessons...If you hold a teacher certificate, and wish to provide your
                 profession to a full class of students in a public school, you can charge the school a premium.'
                  onInput={(e) =>
                    counter(e.target.value, e.target, set_motivation, 500)
                  }
                  spellCheck="true"
                  style={{ width: "100%", padding: "10px", height: "160px" }}
                  name=""
                  id=""
                ></textarea>
                <div className="inputValidator">
                  Your have reached the max limit of 500 characters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Actions
        nextDisabled={!tutor.AcademyId}
        onEdit={handleEditClick}
        saveDisabled={!editMode}
        editDisabled={editMode}
        unSavedChanges={unSavedChanges}
        loading={savingRecord}
      />
    </form>
  );
};

export default TutorSetup;
