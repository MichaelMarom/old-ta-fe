import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BsCameraVideo, BsCloudUpload } from "react-icons/bs";
import { moment } from "../../config/moment";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

import { toast } from "react-toastify";
import { RiRobot2Fill } from "react-icons/ri";

import { post_tutor_setup, updateTutorSetup } from "../../axios/tutor";
import { apiClient } from "../../axios/config";
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
import {
  capitalizeFirstLetter,
  unsavedChangesHelper,
} from "../../utils/common";
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
import { setMissingFeildsAndTabs } from "../../redux/tutor/missingFieldsInTabs";

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
  let [video, set_video] = useState("");
  const [videoError, setVideoError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
  const [userId, setUserId] = useState(user.SID);
  const [picUploading, setPicUploading] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [vacation_mode, set_vacation_mode] = useState(false);
  const [start, setStart] = useState(moment(new Date()).toDate());
  const [end, setEnd] = useState(moment(new Date()).endOf("day").toDate());

  const [dbCountry, setDBCountry] = useState(null);

  const { tutor, isLoading: tutorDataLoading } = useSelector(
    (state) => state.tutor
  );
  const [nameFieldsDisabled, setNameFieldsDisabled] = useState(false);
  let [isRecording, setIsRecording] = useState(false);
  const toastId = "pending-status-toast";

  useEffect(() => {
    if (user.role && tutor.AcademyId && tutor.Status === "pending") {
      if (!toast.isActive(toastId)) {
        toast.success(
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
  }, [user.role, tutor.AcademyId, tutor.Status]);

  // video fetching from azure
  // useEffect(() => {
  //   tutor.AcademyId &&
  //     apiClient
  //       .get("/tutor/setup/intro", {
  //         params: { user_id: tutor.AcademyId.replace(/[.\s]/g, "") },
  //       })
  //       .then((res) => {
  //         res?.data?.url && set_video(res.data.url);
  //       })
  //       .catch((err) => console.log(err));
  // }, [tutor]);

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
      dispatch(setTutor({ ...tutor, vacation_mode: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor, userId]);

  useEffect(() => {
    if (tutor.AcademyId) {
      setEditMode(false);
      setNameFieldsDisabled(true);
    } else {
      setEditMode(true);
      setNameFieldsDisabled(false);
    }
  }, [tutor]);

  // useEffect(() => {
  //   set_email(user?.email);
  // }, [user]);

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
        // await post_tutor_setup({ photo, fname, lname, mname, userId });

        setUploadPhotoClicked(false);
        // dispatch(setTutor({ ...tutor, photo }));
      }
    };
    postImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo, userExist, fname, lname, mname, userId, uploadPhotoClicked]);

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
        set_fname(data.FirstName);
        set_sname(data.LastName);
        set_mname(data.MiddleName);
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
        setTutorGrades(JSON.parse(data?.Grades ?? "[]"));

        // set_video(data.Video);
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

    setSavingRecord(true);
    let response = await saver();
    setSavingRecord(false);
    dispatch(setMissingFeildsAndTabs());
    if (response && response.status === 200) {
      dispatch(setTutor());
      localStorage.setItem(
        "tutor_screen_name",
        response.data?.[0]?.TutorScreenname
      );
      localStorage.setItem("tutor_user_id", response.data?.[0]?.AcademyId);
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
        {item.Response}
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
        `Please setup Firstname, Lastname and MiddleName(optional) first!`
      );

    setUploadPhotoClicked(true);

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

        const result = await uploadTutorImage(
          tutor.AcademyId,
          e.target.files[0]
        );

        if (result.data?.url) {
          await updateTutorSetup(tutor.AcademyId, {
            Photo: result.data.url,
          });
          dispatch(setTutor({ ...tutor, Photo: result.data.url }));
        }

        setPicUploading(false);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  let handleVideo = async (e) => {
    if (!tutor.AcademyId)
      return toast.error(
        `Please setup Firstname, Lastname and MiddleName(optional) first!`
      );
    const file = e.target.files[0];
    setVideoError(false);
    if (file.size > 10485760)
      return toast.warning("Video size should be less than 10MB");
    if (!file?.type || file.type.split("/")?.[0] !== "video") {
      alert("Only Video Can Be Uploaded To This Field");
    } else {
      setVideoUploading(true);
      let reader = new FileReader({});

      reader.onload = (result) => {
        set_video(reader.result);
      };
      reader.readAsDataURL(file);

      const { data } = await uploadVideoToAzure(
        file,
        tutor.AcademyId,
        selectedVideoOption
      );
      updateTutorSetup(tutor.AcademyId, { Video: data.url });
      toast.success("Video Succesfully Uploaded!");
      dispatch(setTutor({ ...tutor, Video: data.url }));
      console.log(data.url);
      setVideoUploading(false);
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
    { name: "fname", filled: !!fname.length, value: fname },
    { name: "lname", filled: !!lname.length, value: lname },
    { name: "phone", filled: !!cell.length, value: cell },
    { name: "rtime", filled: !!response_zone.length, value: response_zone },
    { name: "country", filled: !!country.length, value: country },
    { name: "state", filled: !!state.length, value: state },
    { name: "photo", filled: !!photo?.length, value: photo },
    { name: "video", filled: !!video.length, value: video },
    { name: "timezone", filled: !!timeZone.length, value: timeZone },
    { name: "motivate", filled: !!motivation.length, value: motivation },
    { name: "intro", filled: !!intro.length, value: intro },
    { name: "headline", filled: !!headline.length, value: headline },
  ];

  if (tutorDataLoading) return <Loading height="calc(100vh - 150px" />;
  return (
    <form onSubmit={saveTutorSetup}>
      <div
        style={{
          overflowY: "auto",
          height: "calc(100vh - 150px)",
          background: editMode ? "inherit" : "rgb(233, 236, 239)",
        }}
      >
        <div
          className="d-flex justify-content-between flex-column"
          style={{
            gap: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            marginTop: "0",
          }}
        >
          <div className="highlight w-100 m-0 justify-content-start text-sm">
            <span
              className="text-danger"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              *
            </span>{" "}
            = Mandatory Fields
          </div>

          <div className="d-flex flex-column">
            <div
              className="d-flex justify-content-between"
              style={{ gap: "20px" }}
            >
              <div
                className="d-flex flex-column align-items-center"
                style={{ width: "15%" }}
              >
                <h6
                  className={`text-start m-0 ${
                    mandatoryFields.find((item) => item.name === "photo").filled
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
                    <p
                      className="button__text"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Upload{" "}
                    </p>
                  </div>
                </label>
                <div className="border p-2 shadow rounded w-100 mb-3">
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
                      //  checked={vacation_mode}
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
                  {/* {vacation_mode && (
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
              )} */}
                </div>
              </div>

              <div className="" style={{ width: "23%" }}>
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
                  <Input
                    label={
                      <MandatoryFieldLabel
                        text="First Name"
                        editMode={!nameFieldsDisabled}
                      />
                    }
                    setValue={set_fname}
                    value={fname}
                    editMode={!nameFieldsDisabled}
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
                  <Input
                    label={
                      <OptionalFieldLabel
                        label={"Middle Name"}
                        editMode={!nameFieldsDisabled}
                      />
                    }
                    required={false}
                    setValue={set_mname}
                    value={mname}
                    editMode={!nameFieldsDisabled}
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
                  <Input
                    label={
                      <MandatoryFieldLabel
                        text="Last Name"
                        editMode={!nameFieldsDisabled}
                      />
                    }
                    setValue={set_sname}
                    value={lname}
                    editMode={!nameFieldsDisabled}
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
                  <Input
                    editMode={false}
                    label={
                      <GeneralFieldLabel editMode={editMode} label={"Email"} />
                    }
                    value={email}
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
                      value={cell}
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

              <div className="" style={{ width: "23%" }}>
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
                        label={"Adress 1"}
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
                        label={"Adress 2"}
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

                {!!timeZone && (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",

                      alignItems: "center",

                      whiteSpace: "nowrap",
                    }}
                  >
                    <Input
                      label={
                        <GeneralFieldLabel
                          editMode={editMode}
                          label={"UTC"}
                          tooltipText="Coordinated Universal Time, or 
                        'UTC,' is the primary time standard by which the world regulates clocks and time.
                         It's important to ensure that your PC's clock matches the UTC because discrepancies
                          can lead to issues with scheduling, such as your booked lessons not synchronizing with your local time. To avoid any inconvenience, please verify that your computer's time settings are correctly adjusted to reflect UTC.."
                        />
                      }
                      value={typeof dateTime === "object" ? "" : dateTime}
                      editMode={false}
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
                <h6
                  className={`${
                    !!video.length && !videoError
                      ? ""
                      : "blinking-button text-success"
                  }`}
                >
                  Elective Tutor's introduction video
                </h6>
                <div className="mb-2">
                  {videoUploading && (
                    <Loading
                      height="10px"
                      iconSize="20px"
                      smallerIcon
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
                  </div>
                ) : selectedVideoOption === "upload" &&
                  video?.length &&
                  !videoError ? (
                  <div className="d-flex justify-content-center flex-column m-auto align-items-center w-100 h-100 border shadow">
                    <video
                      src={video}
                      onError={() => setVideoError(true)}
                      className="w-100 h-100 m-0 p-0 videoLive"
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
                      increase your chances of getting hired. View samples;{" "}
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

                <div className=" mt-5">
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
                            border: " 1px solid #e1e1e1",
                          }}
                          className={`action-btn btn ${
                            selectedVideoOption === "upload" ? "active" : ""
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

        <div className="mt-1 ">
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
            >
              <div className="input w-100">
                <div
                  style={{
                    fontWeight: "900",
                    fontSize: "14px",
                    float: "right",
                  }}
                >
                  {headline.length}/80
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
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div
              className=" d-flex justify-content-center "
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
                  {intro.length}/500
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
                  {motivation.length}/500
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
        saveDisabled={!editMode}
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
    <div className="roboto-medium">
      <span
        style={{
          background: editMode ? "white" : "rgb(233 236 239)",
        }}
      >
        {!!toolTipText.length && (
          <ToolTip
            text={toolTipText}
            direction={direction}
            width={width}
            iconSize={10}
          />
        )}
        <span className={`${blinkMe() ? "blink_me" : ""}`}> {text}</span>:
      </span>
      <span className="text-danger" style={{ fontSize: "13px" }}>
        *
      </span>
    </div>
  );
};

export const OptionalFieldLabel = ({ label, editMode = true }) => (
  <p
    className="roboto-medium"
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
    <div className="roboto-medium">
      <span
        style={{
          background: editMode ? "white" : "rgb(233 236 239)",
        }}
      >
        {!!tooltipText.length && (
          <ToolTip
            text={tooltipText}
            direction={direction}
            width={width}
            iconSize={10}
          />
        )}
        <span> {label}</span>:
      </span>
    </div>
  );
};

export default TutorSetup;
