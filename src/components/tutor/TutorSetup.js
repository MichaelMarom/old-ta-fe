import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsCameraVideo, BsCloudUpload } from "react-icons/bs";
import { moment } from "../../config/moment";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

import { toast } from "react-toastify";
import { RiRobot2Fill } from "react-icons/ri";

import { updateTutorSetup } from "../../axios/tutor";
import { useDispatch } from "react-redux";
import { convertGMTOffsetToLocalString, showDate } from "../../utils/moment";
import WebcamCapture from "./Recorder/VideoRecorder";
import Loading from "../common/Loading";
import ToolTip from "../common/ToolTip";

import Actions from "../common/Actions";
import {
  AUST_STATES,
  CAN_STATES,
  Countries,
  GMT,
  RESPONSE,
  UK_STATES,
  US_STATES,
} from "../../constants/constants";
import { setTutor } from "../../redux/tutor/tutorData";
import { unsavedChangesHelper } from "../../utils/common";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { IoPersonCircle } from "react-icons/io5";
import { convertToDate } from "../common/Calendar/Calendar";
import { uploadVideoToAzure } from "../../utils/uploadVideo";
import Avatar from "../common/Avatar";
import Input from "../common/Input";
import Select from "../common/Select";

import VacationSettingModal from "./VacationSettingModal";
import { uploadTutorImage } from "../../axios/file";
import { FaExclamationCircle } from "react-icons/fa";
import { socket } from "../../config/socket";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};
export const options = {
  Australia: AUST_STATES,
  USA: US_STATES,
  Canada: CAN_STATES,
  "United Kingdom": UK_STATES,
  UnitedKingdom: UK_STATES,
};

const TutorSetup = () => {
  const [editMode, setEditMode] = useState(false);
  let [cell, set_cell] = useState("");
  let [add1, set_add1] = useState("");
  let [add2, set_add2] = useState("");
  let [city, set_city] = useState("");
  let [state, set_state] = useState("");
  let [zipCode, set_zipCode] = useState("");
  let [country, set_country] = useState("");
  let [timeZone, set_timeZone] = useState("");
  let [dateTime, setDateTime] = useState(null);
  let [response_zone, set_response_zone] = useState("");
  let [intro, set_intro] = useState("");
  let [motivation, set_motivation] = useState("");
  let [headline, set_headline] = useState("");
  let [photo, set_photo] = useState("");
  let [video, set_video] = useState("");
  const [videoError, setVideoError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
  const [userId, setUserId] = useState(user.SID);
  const [picUploading, setPicUploading] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [vacation_mode, set_vacation_mode] = useState(false);
  const [start, setStart] = useState(moment(new Date()).toDate());
  const [end, setEnd] = useState(moment(new Date()).endOf("day").toDate());
  const [uploadProgress, setUploadProgress] = useState(0);

  const [dbCountry, setDBCountry] = useState(null);

  const { tutor, isLoading: tutorDataLoading } = useSelector(
    (state) => state.tutor
  );
  let [isRecording, setIsRecording] = useState(false);
  const toastId = "pending-status-toast";
  let toastRef = useRef();

  useEffect(() => {
    if (user.role && tutor.AcademyId && tutor.Status === "pending") {
      if (!toast.isActive(toastId)) {
        toastRef.current = toast.success(
          `Please note that your application is currently in 'pending' status. 
          Use the 'Next' or 'Back' buttons at the page footer to navigate between pages. 
          The menu tabs will become active once you complete all mandatory fields as marked by red blinking text.`,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
            autoClose: false,
            draggable: true,
            className: "setup-private-info center-center",
            toastId: toastId,
          }
        );
      }
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null; // Ensure the toast is cleared when unmounting
      }
    };
  }, [user.role, tutor.AcademyId, tutor.Status]);

  useEffect(() => {
    socket.on("uploadProgress", (data) => {
      console.log(data);
      setUploadProgress(data.progress);
    });

    return () => {
      socket.off("uploadProgress");
    };
  }, []);

  useEffect(() => {
    if (
      convertToDate(tutor.EndVacation).getTime() < new Date().getTime() &&
      tutor.VacationMode
    ) {
      updateTutorSetup(tutor.AcademyId, {
        VacationMode: false,
      });
      // TODO:
      // dispatch(setTutor({ ...tutor, vacation_mode: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor, userId]);

  useEffect(() => {
    if (tutor.AcademyId) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  }, [tutor]);

  //reset state on country change
  useEffect(() => {
    if (country !== dbCountry) {
      set_state("");
    }
  }, [country, dbCountry]);

  const [selectedVideoOption, setSelectedVideoOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedVideoOption(option);
  };

  //upload photo
  useEffect(() => {
    const postImage = async () => {
      if (uploadPhotoClicked && userExist) {
        setUploadPhotoClicked(false);
      }
    };
    postImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExist, uploadPhotoClicked]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  // fetching tutor setup
  useEffect(() => {
    const fetchTutorSetup = async () => {
      if (tutor.AcademyId) {
        let data = tutor;

        setUserId(tutor.userId);
        setUserExist(true);
        // set_fname(data.FirstName);
        // set_sname(data.LastName);
        // set_mname(data.MiddleName);
        set_photo(data.Photo);
        set_video(data.Video || "");

        set_cell(data.CellPhone);
        set_state(data.StateProvince);
        set_email(data.Email);
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
        // setTutorGrades(JSON.parse(data?.Grades ?? "[]"));

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
        // FirstName: "",
        // MiddleName: "",
        // LastName: "",
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
        VacationMode: false,
      };
    }
    let formValues = {
      // fname,
      // mname,
      // lname,
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
      vacation_mode,
    };
    setUnsavedChanges(
      unsavedChangesHelper(formValues, tutor.AcademyId ? tutor : newTutor)
    );
  }, [
    // fname,
    // mname,
    // lname,
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
    tutor,
    vacation_mode,
  ]);

  const saveTutorSetup = async (e) => {
    e.preventDefault();
    // if (_.some(errors, (value) => typeof value === "string"))
    //   return toast.error("Please fix validation errors!");

    if (!isValid) {
      return toast.warning("Please enter the correct phone number");
    }

    setSavingRecord(true);
    await saver();
    setSavingRecord(false);

    dispatch(
      setTutor({
        ...tutor,
        CellPhone: cell,
        Address1: add1,
        Address2: add2,
        CityTown: city,
        StateProvince: state,
        ZipCode: zipCode,
        Country: country,
        GMT: timeZone,
        ResponseHrs: response_zone,
        Introduction: intro,
        Motivate: motivation,
        HeadLine: headline,
        StartVacation: vacation_mode ? start : moment().toDate(),
        EndVacation: vacation_mode ? end : moment().endOf().toDate(),
        VacationMode: vacation_mode,
        Step: 2,
        Video: video,
        Photo: photo,
      })
    );

    localStorage.setItem("tutor_user_id", tutor.AcademyId);
    setEditMode(false);
    toast.success("Data saved successfully");
  };

  let saver = async () => {
    const body = {
      // fname,
      // mname,
      // lname,
      CellPhone: cell,
      Address1: add1,
      Address2: add2,
      CityTown: city,
      StateProvince: state,
      ZipCode: zipCode,
      Country: country,
      GMT: timeZone,
      ResponseHrs: response_zone,
      Introduction: intro,
      Motivate: motivation,
      HeadLine: headline,
      StartVacation: vacation_mode ? start : moment().toDate(),
      EndVacation: vacation_mode ? end : moment().endOf().toDate(),
      VacationMode: vacation_mode,
      Step: 2,
      Video: video,
      Photo: photo,
    };

    let response = await updateTutorSetup(tutor.AcademyId, body);
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
        value={""}
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        disabled={tutor.Status === "active"}
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
        disabled={tutor.Status === "active"}
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
        {item.Response} Hours
      </option>
    ));
    let response_head = (
      <option
        key=""
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        value=""
        disabled={tutor.Status === "active"}
      >
        Select
      </option>
    );

    response_list.unshift(response_head);
    set_response_list(response_list);
  }, [tutor.Status]);

  let handleImage = async (e) => {
    if (!tutor.AcademyId)
      return toast.error(
        `Please setup First Name, Last Name and Middle Name(optional) first!`
      );
    if (e.target.files[0]) {
      setUploadPhotoClicked(true);

      if (e.target?.files?.[0]?.type.split("/")?.[0] !== "image") {
        alert("Only Image Can Be Uploaded To This Field");
      } else {
        try {
          setPicUploading(true);
          let reader = new FileReader();

          reader.onload = (result) => {
            // set_photo(reader.result);
          };
          reader.readAsDataURL(e.target.files[0]);

          const result = await uploadTutorImage(
            tutor.AcademyId,
            e.target.files[0]
          );

          if (result.data?.url) {
            await updateTutorSetup(tutor.AcademyId, {
              Photo: result.data.url,
            });
            set_photo(result.data.url);
            // dispatch(setTutor({ ...tutor, Photo: result.data.url,
            //   CellPhone: cell,
            //   Address1: add1,
            //   Address2: add2,
            //   CityTown: city,
            //   StateProvince: state,
            //   ZipCode: zipCode,
            //   Country: country,
            //   GMT: timeZone,
            //   ResponseHrs: response_zone,
            //   Introduction: intro,
            //   Motivate: motivation,
            //   HeadLine: headline,
            //   StartVacation: vacation_mode ? start : moment().toDate(),
            //   EndVacation: vacation_mode ? end : moment().endOf().toDate(),
            //   VacationMode: vacation_mode,
            //   Step: 2,
            //   Video: video,
            //  }));
          }

          setPicUploading(false);
        } catch (err) {
          toast.error(err.message);
        }
      }
    }
  };

  const handleVideo = async (e) => {
    if (!tutor.AcademyId) {
      return toast.error(
        `Please setup Firstname, Lastname, and MiddleName(optional) first!`
      );
    }
    setVideoError(false);
    const file = e.target.files[0];

    if (!file?.type || file.type.split("/")[0] !== "video") {
      alert("Only Video Can Be Uploaded To This Field");
    } else {
      setVideoUploading(true);
      setUploadProgress(0);

      let reader = new FileReader();
      reader.onload = async () => {
        try {
          const videoElement = document.createElement("video");
          videoElement.src = reader.result;

          videoElement.onloadedmetadata = async () => {
            if (videoElement.duration <= 59.59) {
              // Call the upload function with progress tracking
              const { data = {} } = await uploadVideoToAzure(
                file,
                tutor.AcademyId,
                "tutor-intro-video",
                selectedVideoOption,
                (progressEvent) => {
                  // const percentCompleted = Math.round(
                  //   (progressEvent.loaded * 100) / progressEvent.total
                  // );
                  // setUploadProgress(percentCompleted);
                }
              );

              updateTutorSetup(tutor.AcademyId, { Video: data.url });
              toast.success("Video Successfully Uploaded!");
              set_video(data.url);
            } else {
              toast.error("Video duration should be less than 1 minute");
            }
            setVideoUploading(false);
          };
        } catch (err) {
          setVideoUploading(false);
          setVideoError(true);
        }
      };
      reader.readAsDataURL(file);
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

  const mandatoryFields = [
    // { name: "fname", filled: !!fname.length, value: fname },
    // { name: "lname", filled: !!lname.length, value: lname },
    { name: "phone", filled: !!cell?.length, value: cell },
    { name: "rtime", filled: !!response_zone?.length, value: response_zone },
    { name: "country", filled: !!country?.length, value: country },
    { name: "state", filled: !!state?.length, value: state },
    { name: "photo", filled: !!photo?.length, value: photo },
    { name: "video", filled: !!video?.length, value: video },
    { name: "timezone", filled: !!timeZone?.length, value: timeZone },
    { name: "motivate", filled: !!motivation?.length, value: motivation },
    { name: "intro", filled: !!intro?.length, value: intro },
    { name: "headline", filled: !!headline?.length, value: headline },
  ];

  if (tutorDataLoading) return <Loading height="calc(100vh - 150px" />;
  return (
    <form onSubmit={saveTutorSetup}  >
      <div
        onClick={() =>
          !editMode &&
          toast.info(
            'Please click the "Edit" to activate the Tab!', {
            className: "setup-private-info "
          }
          )
        }
        style={{
          overflowY: "auto",
          height: "calc(100vh - 150px)",
          background: editMode ? "inherit" : "rgb(233, 236, 239)",
        }}
      >
        <div
          className="container mt-2 d-flex justify-content-between flex-column"
          style={{
            gap: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            marginTop: "0",
            margin: "auto",
          }}
        >
          {!!tutor.StatusReason?.length && (
            <div className="highlight w-100 m-0 justify-content-start text-sm">
              <div className=" text-danger w-auto">
                <FaExclamationCircle color="red" /> {tutor.StatusReason}
              </div>
              {/* <p>
              <span
              className="text-danger"
              style={{ fontSize: "20px", fontWeight: "bold" }}
              >
              *
              </span>{" "}
              = Mandatory Fields
            </p> */}
            </div>
          )}

          <div className="d-flex flex-column">
            <div
              className="d-flex justify-content-between"
              style={{ gap: "20px" }}
            >
              <div
                className="d-flex flex-column align-items-center"
                style={{ width: "20%" }}
              >
                <div>
                  <h6 className="m-0 text-center">
                    {" "}
                    <span className="text-primary">
                      {tutor.FirstName} {tutor.MiddleName} {tutor.LastName}
                    </span>
                  </h6>
                  <p className="text-center" style={{ fontSize: "12px" }}>
                    ({email})
                  </p>
                  <p className="text-center" style={{ fontSize: "12px" }}>
                    {dateTime}
                  </p>
                </div>
                <h6
                  className={`text-start m-0 ${mandatoryFields.find((item) => item.name === "photo").filled
                    ? ""
                    : "blink_me"
                    }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Profile Photo
                  <span
                    className="text-danger "
                    style={{ fontSize: "25px", fontWeight: "bold" }}
                  >
                    *
                  </span>
                </h6>
                {picUploading && (
                  <div className="mb-2">
                    <Loading
                      height="10px"
                      iconSize={20}
                      smallerIcon
                      loadingText="uploading picture ..."
                    />
                  </div>
                )}
                <div
                  className="border rounded-circle shadow "
                  style={{ width: "215px", height: "215px" }}
                >
                  {photo ? (
                    <Avatar
                      className="m-0"
                      avatarSrc={photo}
                      showOnlineStatus={false}
                      size="200"
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "justify",
                        fontSize: "12px",
                        padding: "50px 20px",
                      }}
                    >
                      You must upload your picture, and video on this tab. You
                      are permitted to move to next tabs without validating
                      that, but your account will not be activated until it’s
                      done
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  data-type="file"
                  name="photo"
                  onChange={handleImage}
                  style={{ display: "none" }}
                  id="profilePicture"
                  disabled={!editMode}
                />
                <label
                  id="btn"
                  style={{
                    width: "50%",
                    border: editMode ? "" : "2px solid #e1e1e1 ",
                    opacity: editMode ? "1" : "0.7"
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
                    <p
                      className="button__text"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Upload
                    </p>
                  </div>
                </label>

                {/* <div className="border p-2 shadow rounded w-100 mb-3">
                  <div
                    className="form-check form-switch d-flex gap-2  mt-2"
                    style={{ fontSize: "12px " }}
                  >
                    <input
                      disabled={!editMode}
                      className="form-check-input border border-dark "
                      type="checkbox"
                      role="switch"
                      style={{
                        width: "30px",
                        height: "15px",
                      }}
                      onChange={() =>
                        toast.info(
                          "Tutor must conduct 40 hours before can activate “Franchise” option."
                        )
                      }
                    />
                    <label
                      className="form-check-label mr-3"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      My Franchise
                    </label>
                    <ToolTip
                      text="The Tutoring Academy platform presents a unique 'Franchisey' opportunity, 
                  enabling you to enhance your business by recruiting and supervising other 
                  tutors. This model allows for scalability by setting a markup for each tutor's 
                  services, thereby creating a potential revenue stream. It's an innovative 
                  approach to expand your educational services while managing and growing a team 
                  of skilled tutors."
                      width="200px"
                    />
                  </div>
                </div>

                <div className="border p-2 shadow rounded w-100">
                  <div className="d-flex gap-1 flex-column">
                    <div
                      className="form-check form-switch d-flex gap-2 w-100"
                      style={{ fontSize: "12px " }}
                    >
                      <input
                        disabled={!editMode}
                        className="form-check-input border border-dark "
                        type="checkbox"
                        role="switch"
                        style={{
                          width: "30px",
                          height: "15px",
                        }}
                        onChange={() => {
                          set_vacation_mode(!vacation_mode);
                          !vacation_mode && !isOpen && setIsOpen(true);
                        }}
                        checked={vacation_mode}
                      />
                      <label
                        className="form-check-label mr-3"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        Vacation Mode
                      </label>
                      <ToolTip
                        text="To set your unavailable days for tutoring, simply turn the switch to 'On'.
                  This action allows you to choose the days you wish to take off. 
                  Your selected dates will be highlighted in green on your calendar, signaling to
                  students that you are not available for lessons during this time. Once the end 
                  date is reached, the switch will automatically revert to 'Off', making you 
                  available for bookings again."
                        width="200px"
                      />
                    </div>
                    {vacation_mode && (
                      <div className="" style={{ fontSize: "12px" }}>
                        <div>
                          <span style={{ fontWeight: "bold" }}>
                            Start Date:{" "}
                          </span>{" "}
                          {showDate(tutor.StartVacation)}
                        </div>
                        <div>
                          <span style={{ fontWeight: "bold" }}>End Date: </span>{" "}
                          {showDate(tutor.EndVacation)}
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
              <div
                className="d-flex flex-column gap-2"
                style={{ width: "40%" }}
              >
                <p className="highlight my-2 p-1" style={{ fontSize: "12px" }}>
                  <span
                    className="text-danger"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    *
                  </span>{" "}
                  = Mandatory Fields
                </p>
                <div className="d-flex gap-3">
                  <div className="" style={{ width: "100%" }}>
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
                      <Input
                        label={
                          <OptionalFieldLabel
                            label={"Address 1"}
                            editMode={editMode}
                          />
                        }
                        required={false}
                        value={add1}
                        setValue={set_add1}
                        editMode={editMode}
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
                      <Input
                        label={
                          <OptionalFieldLabel
                            label={"Address 2"}
                            editMode={editMode}
                          />
                        }
                        value={add2}
                        required={false}
                        setValue={set_add2}
                        editMode={editMode}
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
                      <Input
                        label={
                          <OptionalFieldLabel
                            label={"City/Town"}
                            editMode={editMode}
                          />
                        }
                        value={city}
                        required={false}
                        setValue={set_city}
                        editMode={editMode}
                      />
                    </div>
                    <div
                      className="w-100"
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        margin: "0 0 10px 0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Select
                        setValue={set_country}
                        value={country}
                        mandatory={true}
                        editMode={editMode}
                        label={
                          <MandatoryFieldLabel
                            name="country"
                            mandatoryFields={mandatoryFields}
                            text="Country"
                            editMode={editMode}
                          />
                        }
                      >
                        {countryList}
                      </Select>
                    </div>
                    {(options[country] ?? [])?.length ? (
                      <div
                        className="mb-2"
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Select
                          setValue={set_state}
                          value={state}
                          editMode={editMode}
                          required={tutor.Status === "active"}
                          label={
                            <MandatoryFieldLabel
                              name="state"
                              mandatoryFields={mandatoryFields}
                              text="State/Province"
                              editMode={editMode}
                            />
                          }
                        >
                          <option value="" disabled>
                            Select State
                          </option>
                          {options[country].map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </Select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",

                        alignItems: "center",
                        margin: "0 0 10px 0",

                        whiteSpace: "nowrap",
                      }}
                    >
                      <Input
                        label={
                          <OptionalFieldLabel
                            label={"Zip Code"}
                            editMode={editMode}
                          />
                        }
                        value={zipCode}
                        required={false}
                        setValue={set_zipCode}
                        editMode={editMode}
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
                      <div className="input w-100">
                        <PhoneInput
                          defaultCountry="us"
                          value={cell || ""}
                          onChange={(cell) => set_cell(cell)}
                          disabled={!editMode}
                          style={{ width: "100%" }}
                        />
                        <span
                          className="input__label roboto-medium"
                          style={{
                            top: "7px",
                            zIndex: "99",
                            fontSize: "14px",
                            padding: "2px",
                            color: "black",
                            background: "transparent",
                            transform: " translate(0.25rem, -65%) scale(0.8)",
                          }}
                        >
                          {" "}
                          <MandatoryFieldLabel
                            name="phone"
                            mandatoryFields={mandatoryFields}
                            editMode={editMode}
                            text={"Phone"}
                          />
                        </span>
                      </div>
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
                      <Select
                        setValue={set_response_zone}
                        value={response_zone}
                        editMode={editMode}
                        label={
                          <MandatoryFieldLabel
                            name="rtime"
                            toolTipText={
                              "Select your response time answering the student during business time in your time zone. Please take notice that the student take this fact as one of the considurations of selecting you as tutor."
                            }
                            mandatoryFields={mandatoryFields}
                            text="Response Time"
                            editMode={editMode}
                          />
                        }
                      >
                        {response_list}
                      </Select>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",

                          alignItems: "center",

                          whiteSpace: "nowrap",
                        }}
                      >
                        <Select
                          setValue={set_timeZone}
                          value={timeZone}
                          editMode={editMode}
                          label={
                            <MandatoryFieldLabel
                              toolTipText={
                                "Select the Greenwich Mean Time (GMT) zone where you reside. It will let the student configure his time availability conducting lessons with you, when in a different time zone. "
                              }
                              name="timezone"
                              mandatoryFields={mandatoryFields}
                              text="Timezone"
                              editMode={editMode}
                            />
                          }
                        >
                          {GMTList}
                        </Select>
                      </div>
                      <Link
                        className="m-0"
                        style={{ fontSize: "12px" }}
                        target="_blank"
                        to={"https://24timezones.com/timezone-map"}
                      >
                        See your timezone from map.
                      </Link>
                    </div>
                  </div>
                </div>
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
                <h6
                  className={`${!!video.length && !videoError
                    ? ""
                    : "blinking-button text-success"
                    }`}
                >
                  Elective Tutor's introduction video
                </h6>
                <div className="mb-2">
                  {videoUploading && (

                    <div class="w3-light-grey">
                      <div id="myBar" class="w3-container w3-green w3-center"
                        style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
                    </div>
                  )}
                </div>
                {selectedVideoOption === "record" ? (
                  <div className="d-flex justify-content-center align-item-center w-100 h-100 border shadow">
                    <WebcamCapture
                      user_id={tutor.AcademyId}
                      record_duration={60000}
                    />
                  </div>
                ) : selectedVideoOption === "upload" &&
                  video?.length &&
                  !videoError ? (
                  <div className="d-flex justify-content-center flex-column m-auto align-items-center w-100 h-100">
                    <video
                      controlsList="nodownload noremoteplayback"
                      src={video}
                      preload="auto"
                      onError={() => setVideoError(true)}
                      className="w-100 h-100 m-0 p-0 videoLive border shadow-lg rounded-5"
                      loop
                      controls
                      autoPlay={false}
                    />
                  </div>
                ) : (
                  <div
                    className="tutor-tab-video-frame p-2 card"
                    style={{ overflowY: "auto" }}
                  >
                    <div style={{ textAlign: "justify", fontSize: "12px" }}>
                      Providing your video is elective. Create a 30-60 seconds
                      clip 'limit 10Mb'. An introduction video is a great way to
                      showcase your personality, skills and teaching style for
                      potential students. It can help you stand out from other
                      tutors and attract more atudents. Creating your video,
                      briefly introduce yourself, your experience and your
                      approach to tutoring. Mention what subjects and levels you
                      can teach, and how you can help students achieve their
                      goals. You should speak clearly, and confidently. A good
                      introduction video can make a lasting impression and
                      increase your chances of getting hired. View samples:
                      <br />
                      <Link
                        to="https://www.youtube.com/watch?v=tZ3ndrKQXN8"
                        target="_blank"
                      >
                        Sample 1: Intro Video
                      </Link>{" "}
                      <br />
                      <Link
                        to="https://www.youtube.com/watch?v=sxa2C6UmrNQ"
                        target="_blank"
                      >
                        Sample 2: How to make an Introduction Video
                      </Link>{" "}
                      <br />
                      <Link to="https://www.heygen.com" target="_blank">
                        Sample 3: Create your free AI Introduction Video, in 3
                        minutes or less.
                      </Link>
                    </div>
                  </div>
                )}

                <div className=" mt-1">
                  <div
                    className="row justify-content-center align-items-center"
                    onClick={() =>
                      !editMode &&
                      toast.info(
                        'Please click the "Edit" button to activate the "Upload", or "Record" video buttons!',
                        {
                          className: "setup-private-info "
                        }
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
                            <p
                              className="button__text"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              Create AI intro
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="">
                        <button
                          style={{ width: "100%", fontSize: "10px" }}
                          type="button"
                          className={`action-btn btn small ${selectedVideoOption === "record" ? "active" : ""
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
                            <p
                              className="button__text"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Record Video{" "}
                            </p>
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
                            borderColor: "none",
                            pointerEvents: !editMode ? "none" : "auto",
                            fontSize: "10px",
                            opacity: editMode ? 1 : 0.7,
                            border: editMode ? "" : "   2px solid #e1e1e1"
                          }}
                          className={`action-btn btn ${selectedVideoOption === "upload" ? "active" : ""
                            }`}
                        >
                          <div className="button__content">
                            <div className="button__icon">
                              <BsCloudUpload size={15} /> <br />
                            </div>
                            <p
                              className="button__text"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Upload Video
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 container">
          <div className="d-flex gap-3 align-items-end">
            <div
              style={{ width: "20%", height: "50px" }}
              className="border p-2 shadow rounded"
            >
              <div className="d-flex gap-1 flex-column mt-2">
                <div
                  className="form-check form-switch d-flex gap-2 w-100"
                  style={{ fontSize: "12px " }}
                >
                  <input
                    disabled={!editMode}
                    className="form-check-input border border-dark "
                    type="checkbox"
                    role="switch"
                    style={{
                      width: "30px",
                      height: "15px",
                    }}
                    onChange={() => {
                      set_vacation_mode(!vacation_mode);
                      !vacation_mode && !isOpen && setIsOpen(true);
                    }}
                    checked={vacation_mode}
                  />
                  <label
                    className="form-check-label mr-3"
                    htmlFor="flexSwitchCheckChecked"
                  >
                    Vacation Mode
                  </label>
                  <ToolTip
                    text="To set your unavailable days for tutoring, simply turn the switch to 'On'.
                  This action allows you to choose the days you wish to take off. 
                  Your selected dates will be highlighted in green on your calendar, signaling to
                  students that you are not available for lessons during this time. Once the end 
                  date is reached, the switch will automatically revert to 'Off', making you 
                  available for bookings again."
                    width="200px"
                  />
                </div>
                {vacation_mode && (
                  <div className="" style={{ fontSize: "12px" }}>
                    <div>
                      <span style={{ fontWeight: "bold" }}>Start Date: </span>{" "}
                      {showDate(tutor.StartVacation)}
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>End Date: </span>{" "}
                      {showDate(tutor.EndVacation)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="input" style={{ width: "50%" }}>
              <div
                style={{
                  fontWeight: "900",
                  fontSize: "14px",
                  float: "right",
                }}
              >
                {headline?.length}/80
              </div>
              <input
                className="input__field m-0 shadow form-control"
                value={headline}
                maxLength={80}
                spellCheck="true"
                disabled={!editMode}
                placeholder="Write A Catchy Headline.. Example: 21 years experienced nuclear science professor."
                onChange={(e) => set_headline(e.target.value)}
                type="text"
                required={tutor.Status === "active"}
              />
              <span
                className=""
                style={{
                  position: "absolute",
                  top: "-5px",
                  left: "10px",
                  padding: "2px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <MandatoryFieldLabel
                  name="headline"
                  mandatoryFields={mandatoryFields}
                  text={"Profile Headline"}
                  editMode={editMode}
                />
              </span>
            </div>
            <div
              className="border p-2 shadow rounded "
              style={{ width: "20%", height: "50px" }}
            >
              <div
                className="form-check form-switch d-flex gap-2  mt-2"
                style={{ fontSize: "12px " }}
              >
                <input
                  disabled={!editMode}
                  className="form-check-input border border-dark "
                  type="checkbox"
                  role="switch"
                  style={{
                    width: "30px",
                    height: "15px",
                  }}
                  onChange={() =>
                    toast.info(
                      "Tutor must conduct 40 hours before can activate “Franchise” option."
                    )
                  }
                />
                <label
                  className="form-check-label mr-3"
                  htmlFor="flexSwitchCheckChecked"
                >
                  My Franchise
                </label>
                <ToolTip
                  text="The Tutoring Academy platform presents a unique 'Franchisey' opportunity, 
                  enabling you to enhance your business by recruiting and supervising other 
                  tutors. This model allows for scalability by setting a markup for each tutor's 
                  services, thereby creating a potential revenue stream. It's an innovative 
                  approach to expand your educational services while managing and growing a team 
                  of skilled tutors."
                  width="200px"
                />
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ gap: "20px", width: "100%" }}
          >
            <div
              className="mt-2"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                width: "50%",
              }}
            ></div>
          </div>

          <div style={{ width: "100%" }}>
            <div
              className=" d-flex justify-content-center mt-3"
              style={{ gap: "20px" }}
            >
              <div
                className="profile-headline"
                style={{
                  textAlign: "center",
                  float: "left",
                  fontWeight: "bold",
                  width: "  40%",
                }}
              >
                <div
                  className="w-100 text-end"
                  style={{
                    fontWeight: "900",
                    fontSize: "14px",
                    float: "right",
                  }}
                >
                  {" "}
                  {intro?.length}/500
                </div>
                <div className="input w-100">
                  <textarea
                    className="form-control m-0 shadow input__field"
                    value={intro}
                    placeholder="Type here your introduction. Can click the icon above for a guideline."
                    maxLength={500}
                    onInput={(e) => set_intro(e.target.value)}
                    style={{ width: "100%", padding: "10px", height: "160px" }}
                    spellCheck="true"
                    disabled={!editMode}
                    required={tutor.Status === "active"}
                  ></textarea>

                  <span
                    className="d-flex "
                    style={{
                      position: "absolute",
                      background: "transparent",
                      top: "10px",
                      left: "10px",
                      padding: "2px",
                      fontSize: "12px",
                    }}
                  >
                    <MandatoryFieldLabel
                      name="intro"
                      mandatoryFields={mandatoryFields}
                      direction="bottom"
                      text={"Introduction"}
                      width="300px"
                      toolTipText="Hello students, Welcome to the online course on Introduction to Programming. My name is John Smith and I will be your tutor for this course. I have been teaching programming for over 10 years and I am passionate about helping you learn the basics of coding. In this course, you will learn how to write simple programs in Python, a popular and easy-to-learn programming language. You will also learn how to use various tools and libraries to make your programs more interactive and fun. "
                      editMode={editMode}
                    />
                  </span>
                </div>
              </div>

              <div
                className="profile-motivation"
                style={{
                  textAlign: "center",
                  float: "right",
                  fontWeight: "bold",
                  width: "40%",
                }}
              >
                <div
                  className="w-100 text-end"
                  style={{
                    fontWeight: "900",
                    fontSize: "14px",
                    float: "right",
                  }}
                >
                  {motivation?.length}/500
                </div>
                <div className="input w-100">
                  <textarea
                    className="form-control m-0 shadow input__field"
                    value={motivation}
                    required={tutor.Status === "active"}
                    disabled={!editMode}
                    placeholder="Type here your Motivation Text. Can click the icon above for a guideline."
                    maxLength={500}
                    onInput={(e) => set_motivation(e.target.value)}
                    spellCheck="true"
                    style={{ width: "100%", padding: "10px", height: "160px" }}
                    name=""
                    id=""
                  ></textarea>
                  <span
                    className=""
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      padding: "2px",
                      fontSize: "12px",
                      background: "transparent",
                    }}
                  >
                    <MandatoryFieldLabel
                      width={"300px"}
                      toolTipText='Type here Something that will motivate Your Students. Use the "Motivate" tab to set up your promotions. Offering an 
                    introductory session for half price can spark curiosity and engagement 
                among students. Discount for multi students tutoring, or paid subscription for multi lessons, 
                is motivating factor.
                If you hold a teacher certificate, and wish to provide your profession to a full
                class of students in a public school, you can charge the school a premium.'
                      name="motivate"
                      mandatoryFields={mandatoryFields}
                      text={"Motivate"}
                      editMode={editMode}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VacationSettingModal
        isOpen={isOpen}
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        timeZone={timeZone}
        editMode={editMode}
        handleClose={() => setIsOpen(false)}
      />
      <Actions
        nextDisabled={!tutor.AcademyId}
        onEdit={handleEditClick}
        saveDisabled={!editMode || picUploading || videoUploading}
        editDisabled={editMode}
        unSavedChanges={unSavedChanges}
        loading={savingRecord}
      />
    </form>
  );
};

export const MandatoryFieldLabel = ({
  text,
  editMode = true,
  mandatoryFields = [],
  name,
  toolTipText = "",
  width = "200px",
  direction = "bottomleft",
}) => {
  const blinkMe = () => {
    if (!name) return false;
    const filled = mandatoryFields.find((item) => item.name === name)?.filled;
    return !filled;
  };

  return (
    <div className="d-flex ">
      <span
        className="d-flex gap-2"
        style={{
          background: editMode ? "white" : "rgb(233 236 239)",
        }}
      >
        {!!toolTipText.length && (
          <ToolTip
            text={toolTipText}
            direction={direction}
            width={width}
            iconSize={13}
          />
        )}
        <span className={` ${blinkMe() ? "blink_me" : ""}`}> {text}</span>
      </span>
      <span className="text-danger" style={{ fontSize: "13px" }}>
        *
      </span>
    </div>
  );
};

export const OptionalFieldLabel = ({ label, editMode = true }) => (
  <p
    className=""
    style={{ background: editMode ? "white" : "rgb(233 236 239)" }}
  >
    {label}: <span className="text-sm">(optional)</span>
  </p>
);

export const GeneralFieldLabel = ({
  label,
  editMode = true,
  tooltipText = "",
  direction = "bottomleft",
  width = "200px",
}) => {
  return (
    <div className="">
      <span
        className="d-flex gap-2"
        style={{
          background: editMode ? "white" : "rgb(233 236 239)",
        }}
      >
        {!!tooltipText.length && (
          <ToolTip
            text={tooltipText}
            direction={direction}
            width={width}
            iconSize={15}
          />
        )}
        <span> {label}</span>
      </span>
    </div>
  );
};

export default TutorSetup;
