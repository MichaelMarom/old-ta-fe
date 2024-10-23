import { useEffect, useRef, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

import { updateTutorSetup } from "../../../axios/tutor";
import { upload_file, uploadTutorDocs } from "../../../axios/file";
import { moment } from "../../../config/moment";

import Select from "react-select";
import Actions from "../../common/Actions";
import { FaFileUpload, FaRegTimesCircle, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../../common/Loading";
import TAButton from "../../common/TAButton";

import {
  AUST_STATES,
  CAN_STATES,
  CERTIFICATES,
  Countries,
  EXPERIENCE,
  LEVEL,
  UK_STATES,
  US_STATES,
  LANGUAGES,
} from "../../../constants/constants";
import { compareStates } from "../../../utils/common";
import Button from "../../common/Button";
import Tooltip from "../../common/ToolTip";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../../redux/tutor/tutorData";
import DebounceInput from "../../common/DebounceInput";
import { MandatoryFieldLabel } from "../TutorSetup";
import FormSelect from "../../common/Select";
import _ from "lodash";
import { setMissingFieldsAndTabs } from "../../../redux/tutor/missingFieldsInTabs";
import { postEducation } from "../../../redux/tutor/education";
import ThreeDotsLoader from "../../common/ThreeDotsLoader";

const languageOptions = LANGUAGES.map((language) => ({
  value: language,
  label: language,
}));

const Education = () => {
  const [editMode, setEditMode] = useState(false);
  const [unSavedChanges, setUnSavedChanges] = useState(false);
  let [level, set_level] = useState("");
  let [uni_bach, set_uni_bach] = useState("");
  let [uni_mast, set_mast_uni] = useState("");
  let [doc_uni, set_doc_uni] = useState("");
  let [degree, set_degree] = useState([]);
  let [certificate, set_certificate] = useState("");
  let [language, set_language] = useState({});
  const [countryForAssociate, setCountryForAssoc] = useState("");
  const [countryForCert, setCountryForCert] = useState("");
  const [countryForMast, setCountryForMast] = useState("");
  const [countryForDoc, setCountryForDoc] = useState("");
  const [countryForDeg, setCountryForDeg] = useState("");
  let [bach_state, set_bach_state] = useState("");
  let [mast_state, set_mast_state] = useState("");
  let [deg_state, set_deg_state] = useState("");
  let [cert_state, set_cert_state] = useState("");
  let [doctorateState, set_doctorateState] = useState("");
  let [experience, set_experience] = useState("");
  let [bach_yr, set_bach_year] = useState("");
  let [mast_yr, set_mast_year] = useState("");
  let [degree_yr, set_degree_year] = useState("");
  let [doctorateGraduateYear, setDoctorateGraduateYear] = useState("");
  let [expiration, set_expiration] = useState(null);
  let [othelang, set_othelang] = useState([]);
  let [workExperience, set_workExperience] = useState("");
  let [exp, set_exp] = useState("");
  let [level_list, set_level_list] = useState("");
  let [certificate_list, set_certificate_list] = useState("");
  let [d_list, set_d_list] = useState([]);
  const [degreeFile, setDegreeFile] = useState(null);
  const [resumePath, set_resumePath] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  let [db_edu_level, set_db_edu_level] = useState("");
  let [db_edu_cert, set_db_edu_cert] = useState("");
  const [fetchingEdu, setFetchingEdu] = useState(false);

  const [deg_file_name, set_deg_file_name] = useState("");
  const [cert_file_name, set_cert_file_name] = useState("");
  const [degUploading, setDegUploading] = useState(false)
  const [certUploading, setCertUploading] = useState(false)


  const [addReference, setAddReference] = useState(false);
  const [references, setReferences] = useState("");
  const [saving, setSaving] = useState(false);
  const [recordFetched, setRecordFetched] = useState(false);
  const { tutor } = useSelector((state) => state.tutor);
  const dispatch = useDispatch();
  const { education } = useSelector((state) => state.edu);
  const [editClicked, setEditClicked] = useState(false);


  let [dbValues, setDbValues] = useState({});

  //private info protection notice
  let toastId = useRef();
  useEffect(() => {
    toastId.current =
      !toastId.current &&
      recordFetched &&
      !dbValues.EducationalLevel?.length &&
      !(cert_file_name || deg_file_name) &&
      toast(
        `If You graduated from an academic institute, then upload the highest diploma you earned. The academy only verifies your
         credentials, and guard your privecy by not publishing it on the portal.`,
        {
          hideProgressBar: true,
          autoClose: false,
          draggable: true,
          className: "setup-private-info center-center",
        }
      );

    if (toastId && (cert_file_name || deg_file_name)) {
      toast.dismiss();
    }

    return () => {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null; // Ensure the toast is cleared when unmounting
      }
    };
  }, [recordFetched, dbValues, cert_file_name, deg_file_name]);

  useEffect(() => {
    if (education.AcademyId && !editClicked) {
      setEditMode(false);
    }
    // if (education.AcademyId) {
    //   setEditMode(false);
    // } else {
    //   setEditMode(true);
    // }
  }, [education]);

  useEffect(() => {
    if (dataFetched && db_edu_level !== level) {
      set_mast_year("");
      set_bach_year("");
      setCountryForAssoc("");
      setCountryForDeg("");
      setCountryForDoc("");
      setCountryForMast("");
      setDoctorateGraduateYear("");
      set_degree_year("");
      set_uni_bach("");
      set_mast_uni("");
      set_doc_uni("");
      set_bach_state("");
      set_mast_state("");
      set_doctorateState("");
      set_deg_state("");
      set_deg_file_name("");
    }
  }, [level, db_edu_level, dataFetched]);

  useEffect(() => {
    if (dataFetched && db_edu_cert !== certificate) {
      setCountryForCert("");
      set_cert_state("");
      set_expiration(null);
      set_cert_file_name("");
    }
  }, [certificate, db_edu_cert, dataFetched]);

  const options = {
    Australia: AUST_STATES,
    USA: US_STATES,
    Canada: CAN_STATES,
    UnitedKingdom: UK_STATES,
  };

  useEffect(() => {
    if (dataFetched && db_edu_level !== level) {
      setDegreeFile(null);
      // setDegreeFileContent(null)
    }
    if (dataFetched && db_edu_cert !== certificate) {
      setCertificateFile(null);
      // setCertFileContent(null)
    }
    if (level === "Undergraduate Student") {
      set_bach_year("current");
    }

    // eslint-disable-next-line
  }, [level, certificate, dataFetched]);

  const handleLanguageChange = (selectedOption) => {
    set_othelang(selectedOption);
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    let d = range(currentYear, currentYear - 50, -1);
    let list = d.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
    list.unshift(<option value="">Select Year</option>);

    set_d_list(d);
  }, []);

  const jsonFields = ["NativeLang", "NativeLangOtherLang"];
  const dynamicSave = async (key, value) => {
    if (jsonFields.includes(key)) value = JSON.stringify(value);
    if (key && tutor.AcademyId && (tutor.Status !== "active" || value)) {
      dispatch(
        postEducation({
          AcademyId: tutor.AcademyId,
          [key]: value,
        })
      );
    }
  };

  const markSecondEduStepCompleted = () => {
    const fieldsForThirdStep = {
      level: { validate: true, value: level },
      experience: { validate: true, value: experience },
      uni_bach: {
        value: uni_bach,
        validate: level !== "No Academic Education",
      },
      bach_yr: {
        value: bach_yr,
        validate:
          level !== "No Academic Education" &&
          level !== "Undergraduate Student",
      },
      bach_state: {
        value: bach_state,
        validate:
          level !== "No Academic Education" && options[countryForAssociate],
      },
      countryForAssociate: {
        value: countryForAssociate,
        validate: level !== "No Academic Education",
      },
      countryForMast: {
        value: countryForMast,
        validate:
          level !== "No Academic Education" &&
          level !== "Undergraduate Student" &&
          level !== "Associate Degree" &&
          level !== "Bachelor Degree",
      },
      uni_mast: {
        value: uni_mast,
        validate:
          level !== "No Academic Education" &&
          level !== "Undergraduate Student" &&
          level !== "Associate Degree" &&
          level !== "Bachelor Degree",
      },
      mast_yr: {
        value: mast_yr,
        validate:
          level !== "No Academic Education" &&
          level !== "Undergraduate Student" &&
          level !== "Associate Degree" &&
          level !== "Bachelor Degree",
      },
      mast_state: {
        value: mast_state,
        validate:
          level !== "No Academic Education" &&
          level !== "Undergraduate Student" &&
          level !== "Associate Degree" &&
          level !== "Bachelor Degree" &&
          options[countryForAssociate],
      },
      countryForDoc: {
        value: countryForDoc,
        validate:
          level === "Doctorate Degree" ||
          level === "Post Doctorate Degree" ||
          level === "Professor",
      },
      doc_uni: {
        value: doc_uni,
        validate:
          level === "Doctorate Degree" ||
          level === "Post Doctorate Degree" ||
          level === "Professor",
      },
      doctorateGraduateYear: {
        value: doctorateGraduateYear,
        validate:
          level === "Doctorate Degree" ||
          level === "Post Doctorate Degree" ||
          level === "Professor",
      },
      doctorateState: {
        value: doctorateState,
        validate:
          (level === "Doctorate Degree" ||
            level === "Post Doctorate Degree" ||
            level === "Professor") &&
          options[countryForAssociate],
      },
      certificate: { validate: false },
      expiration: {
        value: expiration,
        validate: certificate && certificate !== "Not Certified",
      },
      cert_state: {
        value: cert_state,
        validate:
          certificate &&
          certificate !== "Not Certified" &&
          options[countryForAssociate],
      },
      // countryForCert: {
      //   value: countryForCert,
      //   validate: certificate && certificate !== "Not Certified",
      // },
      NativeLang: { validate: true, value: language },
      NativeLangOtherLang: { validate: false },
      workExperience: { validate: true, value: workExperience },
      references: { validate: false },
    };
    let flag = { value: null, valid: 1 };

    Object.keys(fieldsForThirdStep).map((field) => {
      if (fieldsForThirdStep[field].validate) {
        const validated = jsonFields.includes(field)
          ? !!Object.keys(fieldsForThirdStep[field]?.value)?.length
          : !!fieldsForThirdStep[field].value?.length;

        if (!validated) {
          flag.valid = 0;
          flag.value = field;
        }
      }
      return flag;
    });
    return flag;
  };

  let saver = async () => {
    let Step = 3;
    dispatch(setMissingFieldsAndTabs(tutor));
    await updateTutorSetup(tutor.AcademyId, {
      Step,
    });
    dispatch(setTutor({ ...Step, ...tutor }));
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
    setEditClicked(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let fieldValues = {
    EducationalLevel: level,
    Bach_College: uni_bach,
    Mast_College: uni_mast,
    DoctorateCollege: doc_uni,
    Certificate: certificate,
    BachCountry: countryForAssociate,
    CertCountry: countryForCert,
    MastCountry: countryForMast,
    DocCountry: countryForDoc,
    DegCountry: countryForDeg,
    Bach_College_State: bach_state,
    Mast_College_State: mast_state,
    DegreeState: deg_state,
    CertificateState: cert_state,
    DoctorateState: doctorateState,
    EducationalLevelExperience: experience,
    Bach_College_Year: bach_yr,
    Mast_College_StateYear: mast_yr,
    DegreeYear: degree_yr,
    DoctorateGradYr: doctorateGraduateYear,
    CertificateExpiration: expiration,
    WorkExperience: workExperience,
    Resume: resumePath,
    ThingsReferences: references,
    CertFileName: cert_file_name,
    DegFileName: deg_file_name,
    NativeLang: language,
    NativeLangOtherLang: othelang,
  };
  // comparing DB, Local
  useEffect(() => {
    setUnSavedChanges(compareStates(dbValues, fieldValues));
  }, [dbValues, fieldValues]);

  const fetchEdu = () => {
    try {
      // get_my_edu(window.localStorage.getItem("tutor_user_id"))
      //   .then((result) => {
      if (education.AcademyId) {
        let NativeLang = JSON.parse(education.NativeLang ?? "{}");
        let NativeLangOtherLang = JSON.parse(
          education.NativeLangOtherLang ?? "[]"
        );
        setDbValues({ ...education, NativeLang, NativeLangOtherLang });

        set_workExperience(education.WorkExperience);
        set_uni_bach(education.Bach_College);
        set_mast_uni(education.Mast_College);
        set_doc_uni(education.DoctorateCollege);

        set_language(JSON.parse(education.NativeLang ?? "{}"));
        set_othelang(JSON.parse(education.NativeLangOtherLang ?? "[]"));

        set_bach_year(education.Bach_College_Year);
        set_mast_year(education.Mast_College_StateYear);
        set_degree_year(education.DegreeYear);

        setCountryForAssoc(education.BachCountry);
        setCountryForCert(education.CertCountry);
        setCountryForDeg(education.DegCountry);
        setCountryForDoc(education.DocCountry);
        setCountryForMast(education.MastCountry);
        set_bach_state(education.Bach_College_State);
        set_mast_state(education.Mast_College_State);
        set_deg_state(education.DegreeState);
        set_cert_state(education.CertificateState);
        set_doctorateState(education.DoctorateState);

        setDoctorateGraduateYear(education.DoctorateGradYr);
        setReferences(education.ThingsReferences);
        // setAddReference(education.ThingsReferences?.length)

        set_doctorateState(education.DoctorateState);

        set_degree(education.Degree);
        set_certificate(education.Certificate);
        set_db_edu_cert(education.Certificate);

        // setDegreeFileContent(education.DegreeFile)
        // setCertFileContent(education.CertificateFile)

        set_level(education.EducationalLevel);
        set_db_edu_level(education.EducationalLevel);

        set_expiration(education.CertificateExpiration || null);
        set_experience(education.EducationalLevelExperience);

        set_resumePath(education.Resume);
        set_deg_file_name(education.DegFileName);
        set_cert_file_name(education.CertFileName);

        setDataFetched(true);
      } else {
        setDbValues({
          EducationalLevel: level,
          College1: uni_bach,
          College2: uni_mast,
          DoctorateCollege: doc_uni,
          Certificate: certificate,
          BachCountry: countryForAssociate,
          CertCountry: countryForCert,
          MastCountry: countryForMast,
          DocCountry: countryForDoc,
          DegCountry: countryForDeg,
          College1State: bach_state,
          College2State: mast_state,
          DegreeState: deg_state,
          CertificateState: cert_state,
          DoctorateState: doctorateState,
          EducationalLevelExperience: experience,
          College1Year: bach_yr,
          College2StateYear: mast_yr,
          DegreeYear: degree_yr,
          DoctorateGradYr: doctorateGraduateYear,
          CertificateExpiration: expiration,
          WorkExperience: workExperience,
          ThingsReferences: references,
          NativeLangOtherLang: othelang,
          NativeLang: language,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingEdu(false);
      setRecordFetched(true);
    }
  };
  //fetching DB
  useEffect(() => {
    !editMode && setFetchingEdu(true);
    fetchEdu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [education]);

  useEffect(() => {
    let experiences = EXPERIENCE.map((item, index) => (
      <option key={index} className={item} value={item}>
        {item}
      </option>
    ));
    let head = (
      <option value="" disabled={tutor.Status === "active"}>
        Select
      </option>
    );

    experiences.unshift(head);
    set_exp(experiences);

    let eduLevels = LEVEL.map((item, index) => (
      <option key={index} className={item} value={item}>
        {item}
      </option>
    ));
    set_level_list(eduLevels);

    let certificatesOptions = CERTIFICATES.map((item) => (
      <option key={item} className={item} value={item}>
        {item}
      </option>
    ));
    set_certificate_list(certificatesOptions);
  }, [certificate, degree, experience, level, tutor.Status]);

  const handleDegFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => { };
      reader.readAsDataURL(file);
      setDegreeFile(file);
    }
  };

  const handleCertUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { };
      reader.readAsDataURL(file);
      setCertificateFile(file);
    }
  };

  useEffect(() => {
    if (degreeFile && level) {
      handleUploadDegreeToServer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degreeFile, level]);

  useEffect(() => {
    if (certificate && certificateFile) {
      handleUploadCertificateToServer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificate, certificateFile]);

  const handleUploadDegreeToServer = async () => {
    if (degreeFile) {
      const formData = new FormData();
      formData.append("file", degreeFile);
      try {
        const existingFile = deg_file_name
          ? deg_file_name.substring(
            deg_file_name.lastIndexOf("/") + 1,
            deg_file_name.length
          )
          : "";

        setDegUploading(true)
        const { data } = await uploadTutorDocs(
          tutor.AcademyId,
          degreeFile,
          "degree",
          existingFile
        );
        setDegUploading(false)

        set_deg_file_name(data.url);
        dynamicSave("DegFileName", data.url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUploadCertificateToServer = async () => {
    if (certificateFile) {
      try {
        const existingFile = cert_file_name
          ? cert_file_name.substring(
            cert_file_name.lastIndexOf("/") + 1,
            cert_file_name.length
          )
          : "";
        setCertUploading(true)
        const { data } = await uploadTutorDocs(
          tutor.AcademyId,
          certificateFile,
          "certificate",
          existingFile
        );
        setCertUploading(false)

        set_cert_file_name(data.url);
        dynamicSave("CertFileName", data.url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !workExperience ||
      workExperience === "<p><br></p>" ||
      !workExperience.length ||
      !markSecondEduStepCompleted().valid
    )
      toast.warning(
        `Some mandatory fields are not filled. You can return later and complete ${markSecondEduStepCompleted().value
        }`
      );

    // if (!markSecondEduStepCompleted().valid) {
    //   if (!markSecondEduStepCompleted().value === 'expiration')
    //     return toast.warning(`Please fill required field ${markSecondEduStepCompleted().value}
    //   and Epxpiration Date cannot be set to today Date.`)
    //   return;
    // }

    if (
      level !== "No Academic Education" &&
      !cert_file_name &&
      certificate &&
      certificate !== "Not Certified"
    )
      toast.warning(
        'You selected academic education, but did not upload your certificate. Hence your Profile will stay in "Pending" status and cannot be activated until you upload your certificate!'
      );
    if (
      level !== "No Academic Education" &&
      level !== "Undergraduate Student" &&
      !deg_file_name
    )
      toast.warning(
        'You selected academic education, but did not upload your diploma. Hence,your Profile will stay in "Pending" status and cannot be activated until you upload your diploma!'
      );

    setSaving(true);
    tutor.Status === "pending" && (await saver());
    setSaving(false);
    fetchEdu();
    setEditClicked(false);
    setEditMode(false);
  };

  const mandatoryFields = [
    { name: "level", filled: !!level?.length, value: level },
    { name: "experience", filled: !!experience?.length, value: experience },
    { name: "bcollege", filled: !!uni_bach?.length, value: uni_bach },
    { name: "byear", filled: !!bach_yr?.length, value: bach_yr },
    {
      name: "bcountry",
      filled: !!countryForAssociate?.length,
      value: countryForAssociate,
    },
    { name: "bstate", filled: !!bach_state?.length, value: bach_state },
    { name: "mcollege", filled: !!uni_mast?.length, value: uni_mast },
    { name: "mstate", filled: !!mast_state?.length, value: mast_state },
    {
      name: "mcountry",
      filled: !!countryForMast?.length,
      value: countryForMast,
    },
    { name: "myear", filled: !!mast_yr?.length, value: mast_yr },
    { name: "dcollege", filled: !!doc_uni?.length, value: doc_uni },
    { name: "dstate", filled: !!doctorateState?.length, value: doctorateState },
    { name: "dcountry", filled: !!countryForDoc?.length, value: countryForDoc },
    {
      name: "dyear",
      filled: !!doctorateGraduateYear?.length,
      value: doctorateGraduateYear,
    },
    { name: "degreeYear", filled: !!degree_yr?.length, value: degree_yr },
    {
      name: "degreeFile",
      filled: !!deg_file_name?.length,
      value: deg_file_name,
    },
    { name: "degreeState", filled: !!deg_state?.length },
    { name: "degreeCountry", filled: !!countryForDeg?.length },
    { name: "certification", filled: !!certificate?.length },
    { name: "certificateExpire", filled: !!expiration },
    { name: "nativeLang", filled: !!language && !_.isEmpty(language) },
    {
      name: "aboutExperience",
      filled: !!workExperience?.length && workExperience !== "<p><br></p>",
    },
  ];

  console.log(degUploading, certUploading)
  if (fetchingEdu) return <Loading loadingText="Fetching Tutor Eduction..." />;
  return (
    <div
      style={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="container tutor-tab-education">
        <p className="tutor-tab-education-notice highlight">
          In the realm of tutoring, possessing a formal tutor's degree is not a
          prerequisite for imparting knowledge. Nevertheless, for the purpose of
          validating tutor's educational background, it is mandatory to submit
          diploma or certificate. Initially, an "X" icon will be displayed next
          to the relevant field, indicating the pending status of document
          submission. Upon successful upload of the credentials, this icon will
          transform into a green "Verified" emblem, thereby providing assurance
          to students and parents during the tutor selection process.
        </p>
        <form action="" onSubmit={handleSave}>
          <div className="tutor-tab-education-info pt-4 ">
            <div
              className="d-flex  row border p-3 shadow "
              style={{ background: editMode ? "inherit" : "rgb(233, 236, 239)" }}
            >
              <h6 className="border-bottom">Experience</h6>
              <div className="d-flex justify-content-between">
                <div className="col-md-4" style={{ fontSize: "14px" }}>
                  <div className="d-flex justify-content-between">
                    {/* <label
                      className="text-secondary text-start"
                      htmlFor="level"
                    >
                      Education Level:
                    </label> */}
                  </div>
                  <FormSelect
                    label={
                      <MandatoryFieldLabel
                        toolTipText="Please indicate the highest level of education from which you have obtained a diploma, which may include high school. It is
                           essential to provide proof of your academic qualifications in the form of a diploma when requested. Failure to do so may result 
                           in the rejection of your application. We appreciate your understanding and cooperation in this matter to ensure a smooth and 
                           efficient application process.."
                        editMode={editMode}
                        direction="bottomright"
                        text={"Education Level"}
                        name="level"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    className="form-select m-0"
                    onChange={(e) => {
                      set_level(e.target.value);
                      dynamicSave("EducationalLevel", e.target.value);
                    }}
                    value={level}
                    editMode={editMode}
                  >
                    <option value="" disabled={tutor.Status === "active"}>
                      Select highest Education
                    </option>
                    {level_list}
                  </FormSelect>
                </div>

                <div className="col-md-4" style={{ fontSize: "14px" }}>
                  <FormSelect
                    label={
                      <MandatoryFieldLabel
                        editMode={editMode}
                        text={"Experience"}
                        name="experience"
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    id="experience"
                    className="form-select m-0"
                    onChange={(e) => {
                      set_experience(e.target.value);
                      dynamicSave("EducationalLevelExperience", e.target.value);
                    }}
                    value={experience}
                    editMode={editMode}
                  >
                    {exp}
                  </FormSelect>
                </div>
              </div>
            </div>

            {level && level !== "No Academic Education" && level.length ? (
              <>
                <div
                  className="row mt-3 p-3 shadow  border shadow"
                  style={{
                    background: editMode ? "inherit" : "rgb(233 236 239)",
                  }}
                >
                  {
                    <h6 className="border-bottom">
                      {level === "Associate Degree" ||
                        level === "Undergraduate Student"
                        ? "College"
                        : "Bachelor Degree"}
                    </h6>
                  }
                  <div className="d-flex justify-content-between mt-3">
                    <div className="col-md-4" style={{ fontSize: "14px" }}>
                      <DebounceInput
                        label={
                          <MandatoryFieldLabel
                            editMode={editMode}
                            name="bcollege"
                            mandatoryFields={mandatoryFields}
                            text={
                              level === "Associate Degree" ||
                                level === "Undergraduate Student"
                                ? "College Name"
                                : "College Name"
                            }
                          />
                        }
                        editMode={editMode}
                        required={tutor.Status === "active"}
                        delay={2000}
                        element="app-input"
                        value={uni_bach}
                        setInputValue={set_uni_bach}
                        debounceCallback={() =>
                          dynamicSave("Bach_College", uni_bach)
                        }
                        onChange={(e) => set_uni_bach(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3" style={{ fontSize: "14px" }}>
                      <div>
                        <FormSelect
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              name="bcountry"
                              mandatoryFields={mandatoryFields}
                              text={
                                level === "Associate Degree"
                                  ? "Associate degree"
                                  : "Bachelor"
                              }
                            />
                          }
                          onChange={(e) => {
                            setCountryForAssoc(e.target.value);
                            dynamicSave("BachCountry", e.target.value);
                          }}
                          value={countryForAssociate}
                          editMode={editMode}
                        >
                          <option
                            value={""}
                            disabled={tutor.Status === "active"}
                          >
                            Select Country
                          </option>
                          {Countries.map((option) => (
                            <option value={option.Country} key={option.Country}>
                              {option.Country}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                      {options[countryForAssociate] && (
                        <div>
                          <FormSelect
                            label={
                              <MandatoryFieldLabel
                                editMode={editMode}
                                text={"State/Province"}
                                name="bstate"
                                mandatoryFields={mandatoryFields}
                              />
                            }
                            id="state1"
                            className="form-select m-0 w-100"
                            onChange={(e) => {
                              set_bach_state(e.target.value);
                              dynamicSave("Bach_College_State", e.target.value);
                            }}
                            value={bach_state}
                            editMode={editMode}
                          >
                            <option
                              value=""
                              disabled={tutor.Status === "active"}
                            >
                              Select State
                            </option>
                            {options[countryForAssociate].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </FormSelect>
                        </div>
                      )}
                    </div>

                    <div className="col-md-4" style={{ fontSize: "14px" }}>
                      {level === "Undergraduate Student" ? (
                        <div>{bach_yr}</div>
                      ) : (
                        <FormSelect
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text={"Graduation Year"}
                              name="byear"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          id="yr1"
                          className="form-select m-0 w-100"
                          onChange={(e) => {
                            set_bach_year(e.target.value);
                            dynamicSave("Bach_College_Year", e.target.value);
                          }}
                          value={bach_yr}
                          editMode={editMode}
                        >
                          <option value="" disabled={tutor.Status === "active"}>
                            Select Year
                          </option>
                          {d_list.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </FormSelect>
                      )}
                    </div>
                  </div>
                </div>
                {level !== "Bachelor Degree" &&
                  level !== "Undergraduate Student" &&
                  level !== "Associate Degree" ? (
                  <div
                    className="row mt-3 border p-3 shadow "
                    style={{
                      background: editMode ? "inherit" : "rgb(233 236 239)",
                    }}
                  >
                    <h6 className="border-bottom">Master Degree</h6>
                    <div className="d-flex justify-content-between mt-3">
                      <div className="col-md-4" style={{ fontSize: "14px" }}>
                        <DebounceInput
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Institute Name"
                              name="mcollege"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          element="app-input"
                          required={tutor.Status === "active"}
                          editMode={editMode}
                          delay={2000}
                          value={uni_mast}
                          setInputValue={set_mast_uni}
                          debounceCallback={() =>
                            dynamicSave("Mast_College", uni_mast)
                          }
                          onChange={(e) => set_mast_uni(e.target.value)}
                        />
                      </div>

                      <div className="col-md-3" style={{ fontSize: "14px" }}>
                        <div>
                          <FormSelect
                            label={
                              <MandatoryFieldLabel
                                editMode={editMode}
                                text="Country for Master"
                                name="mcountry"
                                mandatoryFields={mandatoryFields}
                              />
                            }
                            onChange={(e) => {
                              setCountryForMast(e.target.value);
                              dynamicSave("MastCountry", e.target.value);
                            }}
                            editMode={editMode}
                            value={countryForMast}
                          >
                            <option
                              value={""}
                              disabled={tutor.Status === "active"}
                            >
                              Select Country
                            </option>
                            {Countries.map((option) => (
                              <option
                                value={option.Country}
                                key={option.Country}
                              >
                                {option.Country}
                              </option>
                            ))}
                          </FormSelect>
                        </div>
                        {options[countryForMast] && (
                          <div>
                            <FormSelect
                              label={
                                <MandatoryFieldLabel
                                  editMode={editMode}
                                  text=" State/Province"
                                  name="mstate"
                                  mandatoryFields={mandatoryFields}
                                />
                              }
                              className="form-select m-0 w-100"
                              onChange={(e) => {
                                set_mast_state(e.target.value);
                                dynamicSave(
                                  "Mast_College_State",
                                  e.target.value
                                );
                              }}
                              value={mast_state}
                              editMode={editMode}
                            >
                              <option
                                value=""
                                disabled={tutor.Status === "active"}
                              >
                                Select State
                              </option>
                              {options[countryForMast].map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </FormSelect>
                          </div>
                        )}
                      </div>

                      <div className="col-md-4" style={{ fontSize: "14px" }}>
                        <FormSelect
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Graduation Year"
                              name="myear"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          id="yr2"
                          required={tutor.Status === "active"}
                          className="form-select m-0 w-100"
                          onChange={(e) => {
                            set_mast_year(e.target.value);
                            dynamicSave(
                              "Mast_College_StateYear",
                              e.target.value
                            );
                          }}
                          value={mast_yr}
                          editMode={editMode}
                        >
                          <option value="" disabled={tutor.Status == "active"}>
                            Select Year
                          </option>
                          {d_list.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                    </div>
                  </div>
                ) : null}
                {level !== "Undergraduate Student" &&
                  level !== "Bachelor Degree" &&
                  level !== "Master Degree" &&
                  level !== "Associate Degree" ? (
                  <div
                    className="row mt-3 border p-3 shadow "
                    style={{
                      background: editMode ? "inherit" : "rgb(233 236 239)",
                    }}
                  >
                    <h6 className="border-bottom">Doctorate Degree</h6>
                    <div className="d-flex justify-content-between mt-3">
                      <div className="col-md-4" style={{ fontSize: "14px" }}>
                        {/* <DebounceInput
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Institute Name"
                              name="mcollege"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          element="app-input"
                          required={tutor.Status === "active"}
                          editMode={editMode}
                          delay={2000}
                          value={uni_mast}
                          setInputValue={set_mast_uni}
                          debounceCallback={() =>
                            dynamicSave("Mast_College", uni_mast)
                          }
                          onChange={(e) => set_mast_uni(e.target.value)}
                        /> */}
                        <DebounceInput
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Institute Name"
                              name="dcollege"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          element="app-input"
                          delay={2000}
                          required={tutor.Status === "active"}
                          value={doc_uni}
                          setInputValue={set_doc_uni}
                          editMode={editMode}
                          debounceCallback={() =>
                            dynamicSave("DoctorateCollege", doc_uni)
                          }
                        />
                      </div>

                      <div className="col-md-3" style={{ fontSize: "14px" }}>
                        <div>
                          <FormSelect
                            label={
                              <MandatoryFieldLabel
                                editMode={editMode}
                                text="Country For Doctorate"
                                name="dcountry"
                                mandatoryFields={mandatoryFields}
                              />
                            }
                            required={tutor.Status === "active"}
                            onChange={(e) => {
                              setCountryForDoc(e.target.value);
                              dynamicSave("DocCountry", e.target.value);
                            }}
                            editMode={editMode}
                            value={countryForDoc}
                          >
                            <option
                              value={""}
                              disabled={tutor.Status === "active"}
                            >
                              Select Country
                            </option>
                            {Countries.map((option) => (
                              <option
                                value={option.Country}
                                key={option.Country}
                              >
                                {option.Country}
                              </option>
                            ))}
                          </FormSelect>
                        </div>
                        {options[countryForDoc] && (
                          <div>
                            <FormSelect
                              label={
                                <MandatoryFieldLabel
                                  editMode={editMode}
                                  text="State/Province"
                                  name="dstate"
                                  mandatoryFields={mandatoryFields}
                                />
                              }
                              className="form-select m-0 w-100"
                              onChange={(e) => {
                                set_doctorateState(e.target.value);
                                dynamicSave("DoctorateState", e.target.value);
                              }}
                              value={doctorateState}
                              editMode={editMode}
                            >
                              <option
                                value=""
                                disabled={tutor.Status === "active"}
                              >
                                Select State
                              </option>
                              {options[countryForDoc].map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </FormSelect>
                          </div>
                        )}
                      </div>

                      <div className="col-md-4" style={{ fontSize: "14px" }}>
                        <FormSelect
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Graduation Year"
                              name="dyear"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          className="form-select m-0 w-100"
                          onChange={(e) => {
                            setDoctorateGraduateYear(e.target.value);
                            dynamicSave("DoctorateGradYr", e.target.value);
                          }}
                          value={doctorateGraduateYear}
                          editMode={editMode}
                        >
                          <option value="" disabled={tutor.Status === "active"}>
                            Select Year
                          </option>
                          {d_list.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div
                  className="row mt-3 border p-3 shadow"
                  style={{
                    background: editMode ? "inherit" : "rgb(233 236 239)",
                  }}
                >
                  <h6 className="border-bottom">Degree Document</h6>
                  <div className="d-flex justify-content-between align-items-end mt-3">
                    <div className="col-md-4" style={{ fontSize: "14px" }}>
                      <div className="d-flex align-items-end">
                        <MandatoryFieldLabel
                          editMode={editMode}
                          text="Upload Degree"
                          direction="top"
                          name="degreeFile"
                          toolTipText="Your document is used solely for the purpose of verifying your status and is not disclosed to the public. Once verified, your profile will be 
                          distinguished with a green verification badge."
                          mandatoryFields={mandatoryFields}
                        />
                      </div>
                      <p
                        style={{ fontSize: "10px", color: "#aaaaaa" }}
                        className="fw-bold "
                      >
                        Files Supported: PDF, JPG, PNG, JPEG
                      </p>
                      <div className="d-flex align-items-end gap-2">
                        {deg_file_name && deg_file_name.length ? (
                          <>
                            <div className="form-outline w-25">


                              <label
                                htmlFor="deg_file"
                                style={{
                                  border: "1px solid #ced4da",
                                  height: "50px",
                                }}
                                className="rounded p-2 cursor-pointer d-flex align-items-center p-2 justify-content-center"
                              >
                                <FaUpload size={15} />{" "}
                              </label>

                              <input
                                type="file"
                                accept=".pdf, .jpeg, .png, .jpg"
                                id="deg_file"
                                className="form-control m-0 mr-2 d-none"
                                onChange={handleDegFileUpload}
                                disabled={!editMode}
                              />
                            </div>
                            <div className="d-flex justify-content-between align-items-center  border rounded p-2 gap-2 w-100" style={{ height: "50px" }}>
                              {degUploading ? <ThreeDotsLoader /> :
                                <>
                                  <div>Degree uploaded</div>
                                  <div className="tick-icon d-flex align-items-center">
                                    <IoIosCheckmarkCircle size={20} color="green" />
                                  </div>
                                </>
                              }
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-outline w-100">
                              <label
                                htmlFor="degreeFile"
                                style={{
                                  border: "1px solid #ced4da",
                                  height: "50px",
                                }}
                                className=" cursor-pointer rounded d-flex align-items-center p-2 justify-content-center"
                              >
                                <FaUpload size={15} />{" "}
                                <p
                                  style={{ fontSize: "12px" }}
                                  className="mx-1 fw-bold"
                                >
                                  Upload Highest Degree Diploma
                                </p>
                              </label>

                              <input
                                type="file"
                                accept=".pdf, .jpeg, .png, .jpg"
                                id="degreeFile"
                                className="d-none"
                                disabled={!editMode}
                                onChange={handleDegFileUpload}
                              />
                            </div>
                            {/* <div className="cross-icon w-25 ">
                              <FaRegTimesCircle size={20} color="red" />
                            </div> */}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3" style={{ fontSize: "14px" }}>
                      <div>
                        <FormSelect
                          label={
                            <MandatoryFieldLabel
                              editMode={editMode}
                              text="Country For Degree"
                              name="degreeCountry"
                              mandatoryFields={mandatoryFields}
                            />
                          }
                          editMode={editMode}
                          value={countryForDeg}
                          onChange={(e) => {
                            setCountryForDeg(e.target.value);
                            dynamicSave("DegCountry", e.target.value);
                          }}
                        >
                          <option
                            value={""}
                            disabled={tutor.Status === "active"}
                          >
                            Select Country
                          </option>
                          {Countries.map((option) => (
                            <option value={option.Country} key={option.Country}>
                              {option.Country}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                      {options[countryForDeg] && (
                        <div>
                          <FormSelect
                            label={
                              <MandatoryFieldLabel
                                editMode={editMode}
                                text="State/Province"
                                name="degreeState"
                                mandatoryFields={mandatoryFields}
                              />
                            }
                            className="form-select m-0 w-100"
                            onChange={(e) => {
                              set_deg_state(e.target.value);
                              dynamicSave("DegreeState", e.target.value);
                            }}
                            value={deg_state}
                            editMode={editMode}
                          >
                            <option
                              value=""
                              disabled={tutor.Status === "active"}
                            >
                              Select State
                            </option>
                            {options[countryForDeg].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </FormSelect>
                        </div>
                      )}
                    </div>

                    <div className="col-md-4" style={{ fontSize: "14px" }}>
                      <FormSelect
                        label={
                          <MandatoryFieldLabel
                            editMode={editMode}
                            text="Diploma Earned Year"
                            name="degreeYear"
                            mandatoryFields={mandatoryFields}
                          />
                        }
                        className="form-select m-0 w-100"
                        onChange={(e) => {
                          set_degree_year(e.target.value);
                          dynamicSave("DegreeYear", e.target.value);
                        }}
                        value={degree_yr}
                        editMode={editMode}
                      >
                        <option value="" disabled={tutor.Status === "active"}>
                          Select Year
                        </option>
                        {d_list.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div
              className="row mt-3 align-items-start border p-3 shadow "
              style={{ background: editMode ? "inherit" : "rgb(233 236 239)" }}
            >
              <h6 className="border-bottom">Certification</h6>
              <div className="d-flex justify-content-between align-items-end mt-3">
                <div className="col-md-4" style={{ fontSize: "14px" }}>
                  <div className="d-flex justify-content-between"></div>
                  <FormSelect
                    label={
                      <MandatoryFieldLabel
                        editMode={editMode}
                        text="Certification"
                        direction="top"
                        name="certification"
                        toolTipText="Your uploaded document is utilized solely for the purpose of verifying your certification. Rest assured, it will not be made 
                          public. Once verified, your profile will be distinguished with the certification Verification Symbol, indicating the authenticity 
                          of your credentials."
                        mandatoryFields={mandatoryFields}
                      />
                    }
                    id="certificate"
                    name="certificate"
                    className="form-select m-0"
                    onChange={(e) => {
                      set_certificate(e.target.value);
                      dynamicSave("Certificate", e.target.value);
                    }}
                    value={certificate}
                    editMode={editMode}
                  >
                    <option value="" disabled={tutor.Status === "active"}>
                      Select Certificate
                    </option>
                    {certificate_list}
                  </FormSelect>
                </div>
                {certificate &&
                  certificate.length &&
                  certificate !== "Not Certified" ? (
                  <>
                    <div className="col-md-3" style={{ fontSize: "14px" }}>
                      <p
                        style={{ fontSize: "10px", color: "#aaaaaa" }}
                        className="fw-bold "
                      >
                        Files Supported: PDF, JPG, PNG, JPEG
                      </p>
                      {certificate &&
                        certificate.length &&
                        certificate !== "Not Certified" ? (
                        <div className="d-flex justify-content-center align-items-end gap-2">
                          {cert_file_name?.length ? (
                            <>
                              <div className="form-outline w-100">
                                <label
                                  htmlFor="cert_file"
                                  style={{
                                    border: "1px solid #ced4da",
                                    height: "50px",
                                  }}
                                  className="rounded p-2 cursor-pointer d-flex align-items-center p-2 justify-content-center"
                                >
                                  <FaUpload size={15} />{" "}
                                  {/* <p
                                    style={{ fontSize: "12px" }}
                                    className="mx-1 fw-bold"
                                  >
                                    Upload Certificate
                                  </p> */}
                                </label>

                                <input
                                  type="file"
                                  accept=".pdf, .jpeg, .png, .jpg"
                                  id="cert_file"
                                  className="form-control m-0 mr-2 d-none"
                                  onChange={handleCertUpload}
                                  disabled={!editMode}
                                />
                              </div>

                              <div className="d-flex w-100 justify-content-between border rounded p-2">
                                {certUploading ? <ThreeDotsLoader /> : <> <div>Certificate Uploaded</div>
                                  <div className="tick-icon d-flex align-items-center">
                                    <IoIosCheckmarkCircle size={20} color="green" />
                                  </div>
                                </>}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="form-outline w-100">

                                <label
                                  htmlFor="certificateFile"
                                  style={{
                                    border: "1px solid #ced4da",
                                    height: "50px",
                                  }}
                                  className="rounded p-2 cursor-pointer d-flex align-items-center p-2 justify-content-center"
                                >
                                  <FaUpload size={15} />{" "}
                                  <p
                                    style={{ fontSize: "12px" }}
                                    className="mx-1 fw-bold"
                                  >
                                    Upload Certificate
                                  </p>
                                </label>

                                <input
                                  type="file"
                                  accept=".pdf, .jpeg, .png, .jpg"
                                  id="certificateFile"
                                  className="form-control m-0 mr-2 d-none"
                                  onChange={handleCertUpload}
                                  disabled={!editMode}
                                />
                              </div>
                              {/* <div className="cross-icon w-25">
                                <FaRegTimesCircle size={20} color="red" />
                              </div> */}
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-4" style={{ fontSize: "14px" }}>
                      <MandatoryFieldLabel
                        editMode={editMode}
                        text="Certificate Expiration"
                        name="certificateExpire"
                        mandatoryFields={mandatoryFields}
                      />

                      <ReactDatePicker
                        selected={moment
                          .tz(
                            expiration ? expiration : new Date(),
                            tutor.timeZone
                          )
                          .toDate()}
                        onChange={(date) => {
                          if (date) {
                            date.setHours(23);
                            date.setMinutes(59);
                            date.setSeconds(59);
                            const originalMoment = moment(date);
                            set_expiration(originalMoment);
                            dynamicSave(
                              "CertificateExpiration",
                              originalMoment
                            );
                          } else {
                            set_expiration(null);
                            dynamicSave("CertificateExpiration", null);
                          }
                        }}
                        minDate={moment().toDate()}
                        dateFormat="MMM d, yyyy"
                        className="form-control mx-2"
                        readOnly={!editMode}
                        placeholder="Expiration Date"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div
              className="row mt-3 justify-content-between border p-3 shadow "
              style={{ background: editMode ? "inherit" : "rgb(233 236 239)" }}
            >
              <h6 className="border-bottom">Languages</h6>
              <div className="d-flex justify-content-between align-items-end">
                <div className="col-md-5">
                  <MandatoryFieldLabel
                    editMode={editMode}
                    edit
                    text="Select Native (Primary) Language"
                    name="nativeLang"
                    mandatoryFields={mandatoryFields}
                  />
                  <Select
                    isMulti={false}
                    placeholder="Select Native Languages"
                    className="language-selector w-100"
                    id="native-language"
                    onChange={(selectedOption) => {
                      set_language(selectedOption);
                      dynamicSave("NativeLang", selectedOption);
                    }}
                    defaultValue={language}
                    required={tutor.Status === "active"}
                    value={language}
                    options={languageOptions}
                    isDisabled={!editMode}
                  />
                </div>

                <div className="col-md-5">
                  <label className="text-secondary" htmlFor="other-languages">
                    Select Secondary language(s):
                  </label>
                  <Select
                    isMulti
                    placeholder="Select other language(s)"
                    className="language-selector w-100"
                    id="other-languages"
                    value={othelang}
                    onChange={(selectedOption) => {
                      handleLanguageChange(selectedOption);
                      dynamicSave("NativeLangOtherLang", selectedOption);
                    }}
                    options={languageOptions}
                    isDisabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div style={{ height: "100px" }}></div>
          </div>
          <div className="tutor-tab-education-experience">
            <div style={{ width: "450px", fontWeight: "bold" }}>
              <MandatoryFieldLabel
                // editMode={editMode}
                text="Work Experience"
                name="aboutExperience"
                mandatoryFields={mandatoryFields}
              />
              <DebounceInput
                delay={2000}
                className="work-exp"
                required={tutor.Status === "active"}
                value={workExperience}
                setInputValue={set_workExperience}
                readOnly={!editMode}
                placeholder="Enter Your Work Experience"
                height="500px"
                debounceCallback={() =>
                  dynamicSave("WorkExperience", workExperience)
                }
                element="user-rich-editor"
              />
            </div>

            <div>
              <TAButton
                buttonText={"Add Resources"}
                style={{ width: "40%" }}
                handleClick={() => setAddReference(true)}
                disabled={!editMode}
              />
              {/* <Button
                className="action-btn btn"
                style={{ width: "40%" }}
                disabled={!editMode}
                handleClick={() => setAddReference(true)}
              >
                <div className="button__content">
                  <p className="button__text">Add Resources</p>
                </div>
              </Button> */}
            </div>
            {(!!dbValues.ThingsReferences?.length || addReference) && (
              <div className="form-outline my-3" style={{ width: "450px" }}>
                <DebounceInput
                  delay={2000}
                  className="references"
                  value={references}
                  setInputValue={setReferences}
                  readOnly={!editMode}
                  debounceCallback={() =>
                    dynamicSave("ThingsReferences", references)
                  }
                  placeholder={`Tutoring academy recommends using a digital pen made by Wacom for the collaboration tab whiteboard. Basic models are CTL-4100 & 6100. Check their official website www.wacom.com
                               Cost: $50 or less
                               `}
                  element="rich-editor"
                  height="400px"
                />
              </div>
            )}
          </div>
          <Actions
            editDisabled={editMode}
            // saveDisabled={!editMode}
            onEdit={handleEditClick}
            unSavedChanges={unSavedChanges}
            loading={saving}
          />
        </form>
      </div>
    </div>
  );
};

export default Education;
