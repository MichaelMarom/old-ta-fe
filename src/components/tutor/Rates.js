import { useState } from "react";
import { useEffect } from "react";
import {
  get_tutor_rates,
  get_tutor_subjects,
  post_tutor_setup,
  upload_tutor_rates_form,
} from "../../axios/tutor";
import { IoMdCopy, IoMdRefresh } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip from "../common/ToolTip";
import TAButton from '../common/TAButton';
import {
  compareStates,
  copyToClipboard,
} from "../../utils/common";
import Actions from "../common/Actions";
import "../../styles/common.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../redux/tutor/tutorData";
import Select from "../common/Select";
import SendCodeModal from "./SendCodeModal";
import { MandatoryFieldLabel } from "./TutorSetup";

const generateDiscountCode = () => {
  const length = 8;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

const Rates = () => {
  const { tutor } = useSelector((state) => state.tutor);
  let [MultiStudentHourlyRate, setMultiStudentHourlyRate] = useState("");
  let [FreeDemoLesson, setFreeDemoLesson] = useState("");
  let [ActivateSubscriptionOption, setActivateSubscriptionOption] =
    useState("");
  let [SubscriptionPlan, setSubscriptionPlan] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sendCodeModalOpen, setSendCodeModalOpen] = useState(false);

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [classTeaching, setClassTeaching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState(generateDiscountCode());
  const [loading, setLoading] = useState(false);

  const [changesMade, setChangesMade] = useState(false);
  const [selectedCancellationPolicy, setSelectedCancPolicy] = useState("");
  const [ConsentRecordingLesson, setConsentRecordingLesson] = useState(true);
  const [IntroSessionDiscount, setIntroSessionDiscount] = useState(true);
  const [dbState, setDbState] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [codeUsed, setCodeUsed] = useState("new");
  const dispatch = useDispatch();

  const fetchTutorRateRecord = () => {
    get_tutor_rates(window.localStorage.getItem("tutor_user_id"))
      .then((result) => {
        if (result?.length) {
          setDbState(result[0]);
          setMultiStudentHourlyRate(result[0].MutiStudentHourlyRate);
          setSelectedCancPolicy(result[0].CancellationPolicy);
          setFreeDemoLesson(result[0].FreeDemoLesson);
          setConsentRecordingLesson(
            result[0].ConsentRecordingLesson === "true"
          );
          setActivateSubscriptionOption(result[0].ActivateSubscriptionOption);
          setSubscriptionPlan(result[0].SubscriptionPlan);
          setDiscountCode(result[0].DiscountCode);
          setClassTeaching(result[0].MultiStudent);
          setDiscountEnabled(result[0].CodeShareable);
          setIntroSessionDiscount(result[0].IntroSessionDiscount);
          let subscriptionPlan = document.querySelector("#subscription-plan");
          ActivateSubscriptionOption === "true"
            ? (subscriptionPlan.checked = true)
            : (subscriptionPlan.checked = false);

          let multiStudent = [...document.querySelectorAll("#multi-student")];

          multiStudent.map((item) => {
            if (
              MultiStudentHourlyRate.split(" ").splice(-1)[0] ===
              item.value.split(" ").splice(-1)[0]
            ) {
              item.checked = true;
            }
            return item;
          });

          let studentSubscription = [
            ...document.querySelectorAll("#student-subscription"),
          ];

          studentSubscription.map((item) => {
            if (
              SubscriptionPlan.split(" ").splice(-1)[0] ===
              item.value.split(" ").splice(-1)[0]
            ) {
              item.checked = true;
            }
            return item;
          });

        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!dbState.AcademyId) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [dbState]);

  useEffect(() => {
    get_tutor_subjects(tutor.AcademyId)
      .then((result) => {
        result?.length && setSubjects(result);
      })
      .catch((err) => toast.error(err.message));
  }, [])

  useEffect(() => {
    if (discountEnabled) {
      setDiscountCode(generateDiscountCode());
      setSubject("");
      setCodeUsed("new");
      // get_tutor_subjects(tutor.AcademyId)
      //   .then((result) => {
      //     result?.length && setSubjects(result);
      //   })
      //   .catch((err) => toast.error(err.message));
    }
  }, [discountEnabled, tutor]);

  useEffect(() => {
    fetchTutorRateRecord();
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  const currentState = {
    MutiStudentHourlyRate: MultiStudentHourlyRate,
    CancellationPolicy: selectedCancellationPolicy,
    FreeDemoLesson,
    ConsentRecordingLesson,
    ActivateSubscriptionOption,
    SubscriptionPlan,
    CodeShareable: discountEnabled,
    MultiStudent: classTeaching,
    IntroSessionDiscount: IntroSessionDiscount,
    // DiscountCode: discountCode,
  };

  useEffect(() => {
    setChangesMade(compareStates(dbState, currentState));
    // eslint-disable-next-line
  }, [currentState, dbState]);

  let saver = async () => {
    let response = await upload_tutor_rates_form(
      MultiStudentHourlyRate,
      selectedCancellationPolicy,
      FreeDemoLesson,
      ConsentRecordingLesson,
      ActivateSubscriptionOption,
      SubscriptionPlan,
      window.localStorage.getItem("tutor_user_id"),
      discountCode,
      subject,
      discountEnabled,
      classTeaching,
      IntroSessionDiscount,
      codeUsed
    );
    return response;
  };

  let subscription_cols = [
    { Header: "Hours" },
    { Header: "Select" },
    { Header: "Discount" },
  ];

  let subscription_discount = [
    { discount: "0%", hours: "1-5" },
    { discount: "5.0%", hours: "6-11" },
    { discount: "10.0%", hours: "12-17" },
    { discount: "15.0%", hours: "18-23" },
    { discount: "20.0%", hours: "24+" },
  ];

  let multi_students_col = [
    { Header: "students" },
    { Header: "Select" },
    { Header: "Discount" },
  ];

  let multi_students_discount = [
    { total: 2, disc: "25" },
    { total: 3, disc: "30" },
    { total: 4, disc: "33" },
    { total: 5, disc: "36" },
    { total: 6, disc: "39" },
    { total: 7, disc: "42" },
    { total: 8, disc: "45" },
    { total: 9, disc: "48" },
    { total: 10, disc: "51" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let Step = null;
    if (!dbState.AcademyId) Step = 4;
    setLoading(true);

    let res = await saver();
    if (Step) {
      await post_tutor_setup({
        Step,
        fname: tutor.FirstName,
        lname: tutor.LastName,
        mname: tutor.MiddleName,
        userId: tutor.userId,
      });
      dispatch(setTutor());
    }
    if (res.bool) {
      setChangesMade(false);
      fetchTutorRateRecord();
      toast.success(res.mssg);
      setEditMode(false);
    } else {
      toast.error("Failed to save record");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 7000);
  }, [copied]);

  useEffect(() => {
    if (dbState.CodeStatus === "used") {
      setDiscountEnabled(false);
    }
  }, [dbState.CodeStatus]);


  const mandatoryFields = [
    {name:"cancPolicy", filled:!!selectedCancellationPolicy.length},
  ]

  return (
    <div className="tutor-tab-rates">
      <div
        className="tutor-tab-rate-section"
        style={{ height: "80vh", overflowY: "auto" }}
      >
        <form
          onSubmit={handleSubmit}
          className="d-flex justify-content-center"
          style={{ width: "100%", gap: "3%" }}
        >
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div className="rounded shadow border m-2 p-4">
              <div
                className="dropdown d-flex align-items-center mb-4"
                style={{ width: "100%" }}
              >
                {/* <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  <MandatoryFieldLabel text="Tutor Cancellation Policy" />

                </div>
                <Tooltip direction="bottomleft"
                  text="How many hours before the lesson, you allow the student to cancel without penalty?"
                  width="200px"
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip> */}
                <Select
                  value={selectedCancellationPolicy}
                  setValue={setSelectedCancPolicy}
                  editMode={editMode}
                  TooltipText={"How many hours before the lesson, you allow the student to cancel without penalty?"}
                  label={<MandatoryFieldLabel text="Cancellation Policy" mandatoryFields={mandatoryFields} name={"cancPolicy"} />}
                >
                  <option value={""}>Select</option>
                  <option value={4} >4hr</option>
                  <option value={8} >8hr</option>
                  <option value={12} >12hr</option>
                  <option value={24} >24hr</option>
                  <option value={48} >48hr</option>

                </Select>

                {/* <button
                  style={{ pointerEvents: editMode ? "auto" : "none" }}
                  className={`btn ${selectedCancellationPolicy.length
                    ? "btn-success"
                    : "btn-secondary"
                    } dropdown-toggle my-0 mx-3`}
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedCancellationPolicy.length
                    ? `${selectedCancellationPolicy}hr`
                    : " Select"}
                </button>

                {isOpen && (
                  <div
                    className="dropdown-menu show"
                    style={{ left: "90px", top: "43px" }}
                  >
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedCancPolicy("4");
                        setIsOpen(false);
                      }}
                    >
                      4hr.
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedCancPolicy("8");
                        setIsOpen(false);
                      }}
                    >
                      8hr.
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedCancPolicy("12");
                        setIsOpen(false);
                      }}
                    >
                      12hr.
                    </div>

                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedCancPolicy("24");
                        setIsOpen(false);
                      }}
                    >
                      24hr
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedCancPolicy("48");
                        setIsOpen(false);
                      }}
                    >
                      48 hr.
                    </div>
                  </div>
                )} */}
              </div>
              <div className="form-check form-switch d-flex gap-3">
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  onChange={() =>
                    setIntroSessionDiscount(!IntroSessionDiscount)
                  }
                  checked={IntroSessionDiscount}
                />
                <label
                  className="form-check-label mr-3"
                  htmlFor="flexSwitchCheckChecked"
                >
                  50% Intro Session
                </label>
                <Tooltip direction="bottomleft"
                  text="The academy mandate an |intro| sessions for new student as a 
                  prerequisite to book further sessions with the tutor. The 50% discount should motivate 
                  the student to select you."
                  width="200px"
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              <div className="form-check form-switch d-flex gap-3">
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  onChange={() =>
                    setConsentRecordingLesson(!ConsentRecordingLesson)
                  }
                  checked={ConsentRecordingLesson}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked"
                >
                  Consent Recording Session
                </label>
                <Tooltip direction="bottomleft"
                  width="200px"
                  text="We record the lesson for learning purpose (or complains).
                     Students or parents can view the recorded lesson. You consent to the recording of the lesson with the student. The recording be saved on the academy servers for 30 days, then be deleted."
                >
                  <FaInfoCircle size={20} color="#0096ff" className=" mr-3" />
                </Tooltip>
              </div>
            </div>
            <div className=" border m-2 shadow rounded p-4">
              <div
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <input
                  disabled={!editMode}
                  type="checkbox"
                  onChange={(e) =>
                    setActivateSubscriptionOption(
                      e.target.checked ? true : false
                    )
                  }
                  checked={
                    ActivateSubscriptionOption === "true" ||
                    ActivateSubscriptionOption === true
                  }
                  style={{ cursor: "pointer", height: "20px", width: "20px" }}
                  name="subscription-plan"
                  id="subscription-plan"
                />{" "}
                &nbsp;
                <label htmlFor="subscription-plan">
                  <h6>Activate subscription option</h6>
                </label>
              </div>

              <div className="highlight">
                Please ensure to select the checkbox above to enable this feature. Your student can choose a payment option from the following table to benefit
                from savings by paying in advance for multiple sessions. The Academy will remit 50% of the discounted total to you upfront, with the remaining
                balance provided after completion. For instance, if a student opts for the 12-hour package and your rate is $60.00 per hour, the calculation
                would be $60.00 x 12 hours, totaling $720.00, less a 10% discount, resulting in a final amount of $648.00.
              </div>

              <div
                className="rate-table m-0 d-flex justify-content-center w-100"
                style={{
                  pointerEvents:
                    ActivateSubscriptionOption === "true" ||
                      ActivateSubscriptionOption === true
                      ? "auto"
                      : "none",
                  opacity: "0.5",
                }}
              >
                <table className="m-0">
                  <thead>
                    <tr>
                      {subscription_cols.map((item) => (
                        <th key={item.Header}>{item.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscription_discount.map((item, index) => (
                      <tr key={index}>
                        <td>{item.hours}</td>
                        <td>
                          <input
                            disabled={!editMode}
                            onInput={(e) => {
                              setSubscriptionPlan(e.target.value);
                            }}
                            type="radio"
                            value={item.hours}
                            checked={item.hours === "1-5"}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                          />
                        </td>

                        <td>{item.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div className="p-4  float-end rounded shadow border m-2 ">
              <h6>Tutor's Own Students</h6>
              <div className="highlight">
                To assist your current students on this platform, please provide the following code to each student for use during their registration process. It is important to generate a unique code for every student..
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2">
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => !!subjects.length ? setDiscountEnabled(!discountEnabled) :
                    toast.warning("Please select subject from Subjects Tab, after that you can share code with your students!")
                  }
                  checked={discountEnabled}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked"
                >
                  My Student's code
                </label>

                <Tooltip
                  width="300px"
                  text="To link your student to your profile, please utilize 
                  the unique code provided below during the account setup 
                  process. This code is essential to ensure that each 
                  student is accurately linked to your profile. It's 
                  important to generate a separate code for each student to
                   preserve individual connections and maintain the integrity
                    of the tracking system."
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>

              {discountEnabled && (
                <div>
                  <div className="d-flex w-100 justify-content-between align-items-end">
                    <div>
                      <h6 className="mt-4 d-inline">Your Student's new code</h6>
                      <Tooltip text="Generate New Code">
                        <IoMdRefresh
                          size={20}
                          className="d-inline"
                          onClick={() =>
                            editMode && setDiscountCode(generateDiscountCode())
                          }
                        />
                      </Tooltip>
                      <div className="input-group">
                        <input
                          disabled={!editMode}
                          type="text"
                          className="form-control m-0 h-100 p-2"
                          value={discountCode}
                          readOnly
                        />

                        <label
                          className="m-0 input-group-text"
                          type="button"
                          id="inputGroupFileAddon04"
                        >
                          <IoMdCopy
                            size={20}
                            color="#0096ff"
                            onClick={() => {
                              copyToClipboard(discountCode);
                              setCopied(true);
                            }}
                          />
                        </label>
                      </div>
                      {copied && (
                        <p className="text-success d-block">
                          Code copied to clipboard!
                        </p>
                      )}
                    </div>
                    <div className="input-group w-50">
                      <Select
                        editMode={editMode}
                        label={"Subject"}
                        value={subject}
                        setValue={setSubject}

                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {subjects.map((subject) => (
                          <option value={subject}>{subject}</option>
                        ))}
                      </Select>

                    </div>
                  </div>
                  <TAButton className="w-auto" buttonText={"Send Code"} handleClick={() => !!subject.length ?
                    setSendCodeModalOpen(true) : toast.warning("Please Seelct subject First before sending code to your students!")} />

                </div>
              )}
            </div>
            <div className="rounded shadow border m-2 p-4">
              <h6>School class Students</h6>

              <div className="p-2 mt-4 highlight">
                American public schools are currently experiencing a severe shortage of teachers. If you possess a teaching certificate and are willing to
                instruct online a full class of students, you have the opportunity to advertise your services on our portal's message board. This platform allows you
                to set a competitive rate for your expertise. Likewise, schools in need of a substitute teacher can easily locate your profile, which is marked
                to indicate your availability.
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2 mt-4">
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => setClassTeaching(!classTeaching)}
                  checked={classTeaching}
                />
                <label
                  className="form-check-label w-75 "
                  htmlFor="flexSwitchCheckChecked"
                >
                  My hourly Charge for teaching a public or private school class
                  (up to 30 students). Only tutors that fill up this field are
                  being shown to schools.
                </label>

                <Tooltip
                  width="200px"
                  text="Fill in your hourly amount for teaching a public 0r private school class (up to 30 students)."
                  direction="left"
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              {classTeaching && (
                <>
                  <div className="input-group  w-50">
                    <span className="input-group-text">$</span>
                    <input
                      disabled={!editMode}
                      type="text"
                      required
                      className="form-control m-0 py-4"
                      aria-label="Amount (to the nearest dollar)"
                      value={MultiStudentHourlyRate}
                      onChange={(e) => {
                        if (e.target.value < 1000)
                          setMultiStudentHourlyRate(e.target.value);
                      }}
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                  <span className="small text-secondary bg-light">
                    Tutor must hold teaching certificate from his state to teach in American public, private or charters' schools.{" "}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div className=" border m-2 shadow rounded p-4">
              <h6 className="text-start text-danger">Coming Soon!</h6>
              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <input
                  disabled={!editMode || true}
                  type="checkbox"
                  // onChange={(e) =>
                  //   setActivateSubscriptionOption(e.target.checked ? true : false)
                  // }
                  // checked={ActivateSubscriptionOption === "true" || ActivateSubscriptionOption === true}
                  style={{ cursor: "pointer", height: "20px", width: "20px" }}
                  name="subscription-plan"
                  id="subscription-plan"
                />{" "}
                &nbsp;
                <label htmlFor="subscription-plan">
                  <h6>Activate multi students option</h6>
                </label>
              </div>

              <div className="highlight">
                You or your student may form a group to take advantage of the discounts listed in the table below. For instance, if your hourly rate is $60 and
                the group includes 6 students, each student would receive a 39% discount per hour. A single student will be accountable for managing the account.
                Please note, if a student from the group misses a session, the payment for that session is non-refundable.
              </div>

              <h6>Multi Students hourly rate</h6>
              <div
                className="rate-table d-flex w-100 justify-content-center m-0"
                style={{
                  pointerEvents:
                    ActivateSubscriptionOption === "true" ||
                      ActivateSubscriptionOption === true
                      ? "auto"
                      : "none",
                  opacity: "0.5",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      {multi_students_col.map((item) => (
                        <th key={item.Header}>{item.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {multi_students_discount.map((item, index) => (
                      <tr key={index}>
                        <td>{item.total}</td>
                        <td>
                          <input
                            disabled={!editMode}
                            type="radio"
                            value={item.disc}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                          />
                        </td>

                        <td>{item.disc} %</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Actions
            unSavedChanges={changesMade}
            loading={loading}
            onEdit={() => setEditMode(true)}
            editDisabled={editMode}
            saveDisabled={!editMode}
          />
        </form>
        <SendCodeModal isOpen={sendCodeModalOpen}
          onClose={() => setSendCodeModalOpen(false)}
          subject={subject}
          code={discountCode} />
      </div>
    </div>
  );
};

export default Rates;
