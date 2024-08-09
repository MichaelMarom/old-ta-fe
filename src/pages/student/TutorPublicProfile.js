import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TAButton from "../../components/common/TAButton";
import {
  get_my_data,
  get_my_edu,
  get_tutor_discount_form,
  get_tutor_setup,
  get_tutor_subjects,
} from "../../axios/tutor";
import { create_chat } from "../../axios/chat";
import { apiClient } from "../../axios/config";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import {
  FaCalendar,
  FaComment,
  FaPlayCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";

import { convertGMTOffsetToLocalString, showDate } from "../../utils/moment";
import { useParams } from "react-router";
import Avatar from "../../components/common/Avatar";
import { capitalizeFirstLetter } from "../../utils/common";
import Loading from "../../components/common/Loading";
import { FaLocationDot, FaRegCirclePlay } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import GradePills from "../../components/tutor/GradePills";
import ToolTip from "../../components/common/ToolTip";
import { toast } from "react-toastify";
import Actions from "../../components/common/Actions";
import { monthFormatWithYYYY } from "../../constants/constants";
import TutorScheduleModal from "../../components/tutor/TutorScheduleModal";
import ScreenRecording from "../../components/common/ScreenRecording";
import { useSelector } from "react-redux";
import CenteredModal from "../../components/common/Modal";
import StudentLayout from "../../layouts/StudentLayout";

const TutorProfile = () => {
  const videoRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = localStorage.getItem("student_user_id");
  const [data, setProfileData] = useState({});
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("bach");
  const userRole = localStorage.getItem("user_role");
  const isStudentLoggedIn = location.pathname.split("/")[1] === "student";
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [subjectsWithRates, setSubjectsWithRates] = useState([]);
  const [edu, setEdu] = useState({});
  const [disc, setDis] = useState({});
  const [tutor, setTutor] = useState({});
  const [video, setVideo] = useState("");

  //   const { education } = useSelector((state) => state.edu);
  //   const { discount } = useSelector((state) => state.discount);
  //   const { tutor } = useSelector((state) => state.tutor);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const toggleSize = () => {
    setIsEnlarged((prev) => !prev);
  };

  useEffect(() => {
    console.log(!isEnlarged, videoRef.current);
    if (videoRef.current) {
      if (isEnlarged) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isEnlarged, videoRef]);

  useEffect(() => {
    params.id &&
      get_tutor_subjects(params.id).then(
        (result) => !result?.response?.data && setSubjectsWithRates(result)
      );
  }, [params.id]);

  const customSortForSubjectsGrades = (a, b) => {
    const getOrder = (value) => {
      if (value === "K-3") return 1;
      if (value === "University") return Infinity;
      const range = value.split("-");
      return parseInt(range[0]);
    };

    const orderA = getOrder(a);
    const orderB = getOrder(b);

    return orderA - orderB;
  };

  const handleScheduleClick = () => {
    setScheduleModalOpen(true);
    // if (!studentId)
    //   return toast.error("You need to select 1 student from students-list!");
    // navigate("/student/faculties");
  };

  // TODO: fix data.CHATID to getting chatid from reduc chats
  const handleChatClick = async () => {
    if (data.ChatID) {
      navigate(`/student/chat/${data.ChatID}`);
    }
    if (!studentId)
      return toast.error("You need  to select 1 student from student list!");
    else {
      const result = await create_chat({
        User1ID: studentId,
        User2ID: data.AcademyId,
      });
      result?.[0]?.ChatID && navigate(`/student/chat/${result?.[0]?.ChatID}`);
    }
  };

  useEffect(() => {
    if (params.id) {
      const fetch_profile = async () => {
        const res = await apiClient.get("/tutor/setup/intro", {
          params: { user_id: params.id.replace(/[.\s]/g, "") },
        });

        setVideo(res?.data?.url);
      };

      fetch_profile();
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      setFetching(true);
      get_tutor_setup({ AcademyId: params.id })
        .then((res) => {
          !res?.response?.data && res && setTutor(res[0]);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [params.id]);
  useEffect(() => {
    if (params.id) {
      get_tutor_discount_form(params.id).then((res) => {
        !res?.response?.data && res && setDis(res[0]);
      });
    }
  }, [params.id]);
  useEffect(() => {
    if (params.id) {
      get_my_edu(params.id).then((res) => {
        !res?.response?.data && setEdu(res[0]);
      });
    }
  }, [params.id]);

  // useEffect(() => {
  //   if (education.AcademyId) {
  //     setProfileData({ ...data, ...education });
  //   }
  // }, [education.AcademyId]);

  // useEffect(() => {
  //   if (discount.AcademyId) {
  //     setProfileData({ ...data, ...discount });
  //   }
  // }, [discount.AcademyId]);
  console.log(edu)

  if (fetching) return <Loading />;
  else if (!tutor.AcademyId)
    return (
      <h5 className="text-danger p-5">
        In order to view your profile, Please first must to complete uploading
        your Photo, Video, Diploma or Certification!
      </h5>
    );
  return (
    <StudentLayout>
      <div
        style={{
          background: "lightGray",
          height: isStudentLoggedIn
            ? "calc(100vh - 50px)"
            : "calc(100vh - 150px)",
          overflowY: "auto",
        }}
      >
        {/* <ScreenRecording /> */}
        <div className="container">
          <div className="">
            <div className="d-flex flex-wrap align-items-center justify-content-between w-100 mt-4 rounded  bg-white ">
              <div className="d-flex align-items-start ">
                <div
                  className="p-1 bg-white rounded-circle border shadow d-flex justify-content-center align-items-center m-1"
                  style={{ width: "180px", height: "180px" }}
                >
                  <Avatar
                    avatarSrc={tutor.Photo}
                    size="150px"
                    indicSize="15px"
                    positionInPixle={10}
                  />
                </div>
                <div
                  className="text-start p-2 d-flex flex-column"
                  style={{ gap: "5px" }}
                >
                  <div>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <h2 className="m-0">
                        {capitalizeFirstLetter(tutor.TutorScreenname)}
                      </h2>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "20px" }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <div
                        className="d-flex align-items-end"
                        style={{ gap: "10px" }}
                      >
                        <FaLocationDot size={20} />
                        <h6 className="m-0"> {tutor.Country}</h6>
                        <h6 className="m-0">GMT: {tutor.GMT}</h6>
                      </div>
                    </div>
                  </div>
                  <div
                    className="d-flex align-items-end"
                    style={{ gap: "10px" }}
                  >
                    <IoTime size={20} />
                    <h6 className="m-0">
                      {convertGMTOffsetToLocalString(tutor.GMT)}
                    </h6>
                  </div>
                  <div className="m-2 ">
                    <div className="d-flex ">
                      <TAButton
                        buttonText={"Chat"}
                        onClick={handleChatClick}
                        disabled={!isStudentLoggedIn}
                      />
                      <TAButton
                        buttonText={"See Schedule"}
                        style={{ width: "100px" }}
                        handleClick={handleScheduleClick}
                        disabled={!isStudentLoggedIn}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className=" d-flex flex-column p-4 justfy-content-between h-100"
                style={{
                  gap: "10px",
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={
                      "The number of hours the tutor will respond to a student (within tutor UTC business time)."
                    }
                  />

                  <div
                    className="text-primary"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Response Time -
                  </div>
                  <h6 className="m-0">{tutor.ResponseHrs}</h6>
                </div>

                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={
                      "The number of hours before the lesson starts where student can cancel the lesson with no penalty."
                    }
                  />

                  <div
                    className="text-primary"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Cancellation Policy -
                  </div>
                  <h6 className="m-0">
                    {disc.CancellationPolicy ? (
                      `${disc.CancellationPolicy} Hour`
                    ) : (
                      <span className="text-danger">not set</span>
                    )}
                  </h6>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={
                      "When the tutor provide a discount of 50% for the student booking the INTRODUCTION lesson, the on/off switch is showing green color. "
                    }
                  />
                  <div
                    className="text-primary d-flex align-items-center"
                    style={{
                      gap: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    <h6 className="m-0">50% Off on Intro Lesson</h6>
                    {disc.IntroSessionDiscount === "1" ? (
                      <IoIosCheckmarkCircle size={20} color="green" />
                    ) : (
                      <IoIosCloseCircle size={20} color="red" />
                    )}
                    {/* <div
                    className="form-check form-switch"
                    style={{ marginBottom: "-10px" }}
                  >
                    <input
                      className="form-check-input border border-dark"
                      type="checkbox"
                      role="switch"
                      disabled={true}
                      defaultChecked={data.IntroSessionDiscount === "1"}
                    />
                  </div> */}
                  </div>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={
                      "The Tutor Identity is verified by the academy in various ways."
                    }
                  />

                  <div
                    className="text-primary"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Verified Tutor
                  </div>
                  <IoIosCheckmarkCircle size={20} color="green" />
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={
                      "Tutor Diploma is uploaded to the academy servers. The student can view the Diploma by clicking on the PDF symbol below."
                    }
                  />

                  <div
                    className="text-primary"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Verified Diploma
                  </div>
                  {edu.DegFileName ? (
                    <IoIosCheckmarkCircle size={20} color="green" />
                  ) : (
                    <FaRegTimesCircle size={20} color="red" />
                  )}
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <ToolTip
                    width="300px"
                    text={`Tutor Certificate was uploaded to the academy 
                                servers for verification. Due to privecy concern, the certificate is not published to the public. `}
                  />

                  <div
                    className="text-primary"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    Verified Certificate
                  </div>
                  {edu.CertFileName ? (
                    <IoIosCheckmarkCircle size={20} color="green" />
                  ) : (
                    <FaRegTimesCircle size={20} color="red" />
                  )}
                </div>
              </div>

              <div className=" h-100">
                <div className="" style={{ paddingRight: "20px" }}>
                  <video
                    loop
                    src={video}
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.paused) {
                          videoRef.current.play();
                        } else {
                          videoRef.current.pause();
                        }
                      }
                    }}
                    className={`rounded-4  shadow-lg`}
                    muted
                    style={{ width: "200px", height: "auto" }}
                    autoPlay
                  />
                </div>
                <div
                  className="d-flex justify-content-between align-items-center mt-2"
                  style={{ width: "200px" }}
                >
                  <FaRegCirclePlay
                    size={35}
                    color="lightgray"
                    onClick={toggleSize}
                  />
                  <div className="d-flex justify-content-center align-items-center gap-1">
                    <CiClock2 color="lightgray" />{" "}
                    <p className="fw-bold" style={{ color: "lightgrey" }}>
                      {"1min video"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="p-2 "
              style={{ margin: "10px 0", background: "white" }}
            >
              <div>
                <h5 className="">Headline</h5>
                <p className="border p-2">{tutor.HeadLine}</p>
              </div>
            </div>
            <div className="d-flex mt-4" style={{ gap: "20px" }}>
              <div className="col-4">
                <div
                  className="bg-white rounded p-4 d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  {!!data?.NativeLang?.length ? (
                    <div className="d-flex flex-column align-items-start">
                      <h5 className="m-0">Languages</h5>
                      <div className="d-flex align-items-center">
                        <GradePills
                          grades={[]}
                          grade={JSON.parse(edu.NativeLang).value}
                          editable={false}
                          hasIcon={false}
                        />
                        - Native
                      </div>
                      {JSON.parse(edu.NativeLangOtherLang).map((lang) => (
                        <div
                          className="d-flex align-items-center"
                          key={lang.value}
                        >
                          <GradePills
                            grades={[]}
                            grade={lang.value}
                            editable={false}
                            hasIcon={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div>
                    <h5 className="">Introduction</h5>
                    <p className="border p-2">{tutor.Introduction}</p>
                  </div>
                </div>
              </div>
              <div className="" style={{ width: "calc(100% - 33.33% - 20px)" }}>
                <div className="bg-white p-4 rounded">
                  <div>
                    <h5 className="">Motivate</h5>
                    <p className="border p-2">{tutor.Motivate}</p>
                  </div>
                  {edu.WorkExperience && (
                    <div>
                      <h5 className="">
                        Work Experience (Total Experience -{" "}
                        {edu.EducationalLevelExperience})
                      </h5>
                      <div
                        className="border p-2"
                        dangerouslySetInnerHTML={{ __html: edu.WorkExperience }}
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <h5 className="">Education</h5>
                    <div className="border p-2 d-flex ">
                      <ul
                        className="vertical-tabs flex-column p-0 align-items-start"
                        style={{
                          width: "20%",
                          borderRight: "1px solid lightblue",
                        }}
                      >
                        <li className="nav-item w-100 p-0">
                          <p
                            className={`nav-link m-0 ${
                              activeTab === "bach" ? "text-bg-primary" : ""
                            } w-100`}
                            aria-current="page"
                            onClick={() => setActiveTab("bach")}
                          >
                            Bachelor
                          </p>
                        </li>
                        <li className="nav-item w-100 p-0">
                          <p
                            className={`nav-link m-0 ${
                              activeTab === "mast" ? "text-bg-primary" : ""
                            } w-100`}
                            aria-current="page"
                            onClick={() => setActiveTab("mast")}
                          >
                            Master
                          </p>
                        </li>
                        <li className="nav-item w-100 p-0">
                          <p
                            className={`nav-link m-0 ${
                              activeTab === "doc" ? "text-bg-primary" : ""
                            } w-100`}
                            aria-current="page"
                            onClick={() => setActiveTab("doc")}
                          >
                            Doctorate
                          </p>
                        </li>
                        <li className="nav-item w-100 p-0">
                          <p
                            className={`nav-link m-0 ${
                              activeTab === "cert" ? "text-bg-primary" : ""
                            } w-100`}
                            aria-current="page"
                            onClick={() => setActiveTab("cert")}
                          >
                            Certificate
                          </p>
                        </li>
                        <li className="nav-item w-100 p-0">
                          <p
                            className={`nav-link m-0 m-0 ${
                              activeTab === "deg" ? "text-bg-primary" : ""
                            } w-100`}
                            aria-current="page"
                            onClick={() => setActiveTab("deg")}
                          >
                            Degree
                          </p>
                        </li>
                      </ul>

                      <div className="px-2 w-75 d-flex justify-content-end">
                        {activeTab === "bach" && (
                          <div className="d-flex border shadow flex-column w-75  p-4 justify-content-between">
                            <h5 className=" text-center">Bachelor Info</h5>

                            {edu.BachCountry ? (
                              <>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Country -
                                  </div>
                                  <h6 className="m-0">{edu.BachCountry}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    College -
                                  </div>
                                  <h6 className="m-0">{edu.Bach_College}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    State -
                                  </div>
                                  <h6 className="m-0">{edu.Bach_College_State}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Year of Graduation -
                                  </div>
                                  <h6 className="m-0">{edu.Bach_College_Year}</h6>
                                </div>
                              </>
                            ) : (
                              <h5 className="text-danger">
                                {" "}
                                No Bachlors record found!
                              </h5>
                            )}
                          </div>
                        )}
                        {activeTab === "mast" && (
                          <div className="d-flex border shadow flex-column w-75  p-4 justify-content-between">
                            <h5 className=" text-center">Master Info</h5>
                            {edu.MastCountry ? (
                              <>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Country -
                                  </div>
                                  <h6 className="m-0">{edu.MastCountry}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    University -
                                  </div>
                                  <h6 className="m-0">{edu.Mast_College}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    State -
                                  </div>
                                  <h6 className="m-0">{edu.Mast_College_State}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Year of Graduation -
                                  </div>
                                  <h6 className="m-0">{edu.Mast_College_StateYear}</h6>
                                </div>
                              </>
                            ) : (
                              <h5 className="text-danger">
                                {" "}
                                No Master's record found!
                              </h5>
                            )}
                          </div>
                        )}
                        {activeTab === "doc" && (
                          <div className="d-flex border shadow flex-column w-75  p-4 justify-content-between">
                            <h5 className=" text-center">Doctorate Info</h5>

                            {edu.DocCountry ? (
                              <>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Country -
                                  </div>
                                  <h6 className="m-0">{edu.DocCountry}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    University -
                                  </div>
                                  <h6 className="m-0">{edu.DoctorateCollege}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    State -
                                  </div>
                                  <h6 className="m-0">{edu.DoctorateState}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Year of Graduation -
                                  </div>
                                  <h6 className="m-0">{edu.DoctorateGradYr}</h6>
                                </div>
                              </>
                            ) : (
                              <h5 className="text-danger">
                                {" "}
                                No Doctorate record found!
                              </h5>
                            )}
                          </div>
                        )}
                        {activeTab === "cert" && (
                          <div className="d-flex border shadow flex-column w-75  p-4 justify-content-between">
                            <div className="d-flex justify-content-between  align-items-center">
                              <h5 className=" text-center">Certificate Info</h5>
                              {/* {edu.CertFileName && <FaFilePdf size={32} color='red'
                                style={{ cursor: "pointer" }}
                                onClick={() => window.open(`${process.env.REACT_APP_FILES_BASE_PATH}/${edu.CertFileName}`, '_blank')}
                            />} */}
                            </div>
                            {edu.CertCountry ? (
                              <>
                                {" "}
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Country -
                                  </div>
                                  <h6 className="m-0">{edu.CertCountry}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Name -
                                  </div>
                                  <h6 className="m-0">{edu.Certificate}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Expiration Date -
                                  </div>
                                  <h6 className="m-0">
                                    {showDate(
                                      edu.CertificateExpiration,
                                      monthFormatWithYYYY
                                    )}
                                  </h6>
                                </div>
                              </>
                            ) : (
                              <h5 className="text-danger">
                                {" "}
                                Certificate is on record, was verified but not
                                shown to public!
                              </h5>
                            )}
                          </div>
                        )}
                        {activeTab === "deg" && (
                          <div className="d-flex border shadow flex-column w-75  p-4 justify-content-between">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="text-center">Degree Info</h5>
                              {/* {edu.DegFileName && < FaFilePdf size={32} color='red' style={{ cursor: "pointer" }}
                                onClick={() => window.open(`${process.env.REACT_APP_FILES_BASE_PATH}/${edu.DegFileName}`, '_blank')}
                            />} */}
                            </div>

                            {edu.DegCountry ? (
                              <>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Country -
                                  </div>
                                  <h6 className="m-0">{edu.DegCountry}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Name -
                                  </div>
                                  <h6 className="m-0">
                                    {edu.EducationalLevel}
                                  </h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    State -
                                  </div>
                                  <h6 className="m-0">{edu.DegreeState}</h6>
                                </div>
                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: "15px" }}
                                >
                                  <div
                                    className="text-primary"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Year -
                                  </div>
                                  <h6 className="m-0">{edu.DegreeYear}</h6>
                                </div>
                              </>
                            ) : (
                              <h5 className="text-danger">
                                {" "}
                                Diploma is on record, was verified but not shown
                                to public!
                              </h5>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {subjectsWithRates.length ? (
                    <div className="mt-4">
                      <h5 className="">Subjects I Teach</h5>
                      <div className="">
                        {subjectsWithRates.map((item, index) => {
                          const subjectGrades = JSON.parse(
                            !item.grades ? "[]" : item.grades
                          ).sort(customSortForSubjectsGrades);
                          return (
                            <div
                              className={`border p-2 rounded d-flex justify-content-between align-items-center `}
                              key={index}
                              style={{ background: "#d8d8d8" }}
                            >
                              <h5
                                className="m-0 text-start col-2"
                                style={{ fontSize: "14px" }}
                              >
                                {item.subject}
                              </h5>
                              <div className="d-flex col-9 flex-wrap">
                                {subjectGrades.map((option) => (
                                  <GradePills
                                    key={option}
                                    editable={false}
                                    grade={option}
                                    grades={subjectGrades}
                                    hasIcon={false}
                                  />
                                ))}
                              </div>
                              <h6 className="m-0 text-start col-1">
                                {item.rate}
                              </h6>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CenteredModal
          showHeader={false}
          show={isEnlarged}
          handleClose={() => setIsEnlarged(false)}
          minHeight="200px"
        >
          <div className="h-100 m-auto">
            <div className="">
              <video
                src={video}
                ref={videoRef}
                className=" rounded-4  shadow-lg"
                controls
                style={{
                  maxWidth: "470px",
                  height: "auto",
                }}
                autoPlay
              />
            </div>
          </div>
        </CenteredModal>

        <TutorScheduleModal
          id={params.id}
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
        />

        {!isStudentLoggedIn && (
          <Actions saveDisabled={true} editDisabled={true} />
        )}
      </div>
    </StudentLayout>
  );
};

export default TutorProfile;