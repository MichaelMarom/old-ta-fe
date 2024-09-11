import { useState } from "react";
import { useEffect } from "react";
import { get_tutor_subjects, updateTutorSetup } from "../../axios/tutor";
import { IoMdCopy, IoMdRefresh } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip from "../common/ToolTip";
import TAButton from "../common/TAButton";
import { compareStates, copyToClipboard } from "../../utils/common";
import Actions from "../common/Actions";
import "../../styles/common.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../redux/tutor/tutorData";
import Select from "../common/Select";
import SendCodeModal from "./SendCodeModal";
import { GeneralFieldLabel, MandatoryFieldLabel } from "./TutorSetup";
import { setMissingFieldsAndTabs } from "../../redux/tutor/missingFieldsInTabs";
import { postDiscount, updateDiscount } from "../../redux/tutor/discount";

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

const Discounts = () => {
  const dispatch = useDispatch();
  const { discount } = useSelector((state) => state.discount);
  const { tutor } = useSelector((state) => state.tutor);

  let [MultiStudentHourlyRate, setMultiStudentHourlyRate] = useState(null);
  let [FreeDemoLesson, setFreeDemoLesson] = useState("");
  let [ActivateSubscriptionOption, setActivateSubscriptionOption] =
    useState("");
  let [SubscriptionPlan, setSubscriptionPlan] = useState("");
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


  console.log("rendering")
  const fetchTutorRateRecord = () => {
    try {
      if (discount.AcademyId) {
        setDbState(discount);
        setMultiStudentHourlyRate(discount.MutiStudentHourlyRate);
        setSelectedCancPolicy(discount.CancellationPolicy);
        setFreeDemoLesson(discount.FreeDemoLesson);
        setConsentRecordingLesson(discount.ConsentRecording);
        setActivateSubscriptionOption(discount.ActivateSubscriptionOption);
        setSubscriptionPlan(discount.SubscriptionPlan);
        setDiscountCode(discount.DiscountCode);
        setClassTeaching(discount.MultiStudent);
        setDiscountEnabled(discount.CodeShareable);
        setIntroSessionDiscount(discount.IntroSessionDiscount);
        // let subscriptionPlan = document.querySelector("#subscription-plan");
        // ActivateSubscriptionOption === "true"
        //   ? (subscriptionPlan.checked = true)
        //   : (subscriptionPlan.checked = false);

        // let multiStudent = [...document.querySelectorAll("#multi-student")];

        // multiStudent.map((item) => {
        //   if (
        //     MultiStudentHourlyRate.split(" ").splice(-1)[0] ===
        //     item.value.split(" ").splice(-1)[0]
        //   ) {
        //     item.checked = true;
        //   }
        //   return item;
        // });

        // let studentSubscription = [
        //   ...document.querySelectorAll("#student-subscription"),
        // ];

        // studentSubscription.map((item) => {
        //   if (
        //     SubscriptionPlan.split(" ").splice(-1)[0] ===
        //     item.value.split(" ").splice(-1)[0]
        //   ) {
        //     item.checked = true;
        //   }
        //   return item;
        // });
      }
    } catch (err) {
      // })
      console.log(err);
    }
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
        result?.length && setSubjects(result.map(subs=>subs.subject));
      })
      .catch((err) => toast.error(err.message));
  }, []);

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
  }, [discount]);

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
    if (discount.AcademyId)
      return dispatch(
        await updateDiscount(discount.id, {
          MutiStudentHourlyRate: MultiStudentHourlyRate,
          CancellationPolicy: selectedCancellationPolicy,
          ActivateSubscriptionOption,
          SubscriptionPlan,
          DiscountCode: discountCode,
          CodeSubject: subject,
          MultiStudent: classTeaching,
          IntroSessionDiscount,
          CodeStatus: codeUsed,
          ConsentRecording: ConsentRecordingLesson
        })
      );
    else {
      return dispatch(
        await postDiscount({
          MutiStudentHourlyRate: MultiStudentHourlyRate,
          CancellationPolicy: selectedCancellationPolicy,
          ActivateSubscriptionOption,
          SubscriptionPlan,
          DiscountCode: discountCode,
          CodeSubject: subject,
          MultiStudent: classTeaching,
          IntroSessionDiscount,
          CodeStatus: codeUsed,
          AcademyId: tutor.AcademyId,
          ConsentRecording: ConsentRecordingLesson
        })
      );
    }
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
    dispatch(setMissingFieldsAndTabs(tutor));
    if (Step) {
      await updateTutorSetup(tutor.AcademyId, { Step });
      dispatch(setTutor({ ...tutor, Step }));
    }
    if (res) {
      setChangesMade(false);
      // fetchTutorRateRecord();
      toast.success(res.mssg);
      setEditMode(false);
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
    { name: "cancPolicy", filled: !!selectedCancellationPolicy },
  ];

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
                <Select
                  value={selectedCancellationPolicy}
                  setValue={setSelectedCancPolicy}
                  editMode={editMode}
                  label={
                    <MandatoryFieldLabel
                    toolTipText= "How many hours before the lesson, you allow the student to cancel without penalty?"
                 direction="bottomright"
                      text="Cancellation Policy"
                      mandatoryFields={mandatoryFields}
                      name={"cancPolicy"}
                    />
                  }
                >
                  <option value={""} disabled={tutor.Status === "active"}>
                    Select
                  </option>
                  <option value={4}>4hr</option>
                  <option value={8}>8hr</option>
                  <option value={12}>12hr</option>
                  <option value={24}>24hr</option>
                  <option value={48}>48hr</option>
                </Select>
              </div>
              <div className="form-check form-switch d-flex gap-3">
                <input
                  disabled={!editMode}
                  className="form-check-input border border-dark "
                  type="checkbox"
                  role="switch"
                  id="introDiscount"
                  onChange={() =>
                    setIntroSessionDiscount(!IntroSessionDiscount)
                  }
                  checked={IntroSessionDiscount}
                />
                <label
                  className="form-check-label mr-3"
                  htmlFor="introDiscount"
                >
                  50% Intro Session
                </label>
                <Tooltip
                  direction="bottomleft"
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
                  className="form-check-input border border-dark "
                  type="checkbox"
                  role="switch"
                  id="recordingSession"
                  onChange={() =>
                    setConsentRecordingLesson(!ConsentRecordingLesson)
                  }
                  checked={ConsentRecordingLesson}
                />
                <label
                  className="form-check-label"
                  htmlFor="recordingSession"
                >
                  Consent Recording Session
                </label>
                <Tooltip
                  direction="bottomleft"
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
                  id="subscription-plan1"
                />{" "}
                &nbsp;
                <label htmlFor="subscription-plan1">
                Activate subscription option
                </label>
              </div>

              <div className="highlight">
                Please ensure to select the checkbox above to enable this
                feature. Your student can choose a payment option from the
                following table to benefit from savings by paying in advance for
                multiple sessions. The Academy will remit 50% of the discounted
                total to you upfront, with the remaining balance provided after
                completion. For instance, if a student opts for the 12-hour
                package and your rate is $60.00 per hour, the calculation would
                be $60.00 x 12 hours, totaling $720.00, less a 10% discount,
                resulting in a final amount of $648.00.
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
              <h6 className="text-center">Tutor's Own Students</h6>
              <div className="highlight">
                To assist your current students on this platform, please provide
                the following code to each student for use during their
                registration process. It is important to generate a unique code
                for every student..
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2">
                <input
                  disabled={!editMode}
                  className="form-check-input border border-dark "
                  type="checkbox"
                  role="switch"
                  id="studentCode"
                  onChange={() =>
                    !!subjects.length
                      ? setDiscountEnabled(!discountEnabled)
                      : toast.warning(
                          "Please select subject from Subjects Tab, after that you can share code with your students!"
                        )
                  }
                  checked={discountEnabled}
                />
                <label
                  className="form-check-label"
                  htmlFor="studentCode"
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
                  <div className="d-flex flex-column w-100 justify-content-end ">
                    <div className="d-flex align-items-end">
                      <h6 className="mt-4 d-inline text-center">Your Student's new code</h6>
                      <Tooltip text="Generate New Code">
                        <IoMdRefresh
                          size={20}
                          className="d-inline mb-2"
                          onClick={() =>
                            editMode && setDiscountCode(generateDiscountCode())
                          }
                        />
                      </Tooltip>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex ">
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
                      <div className="input-group ">
                        <Select
                          editMode={editMode}
                          label={<GeneralFieldLabel label={"Subject"} />}
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
                  </div>
                  <TAButton
                    className="w-auto"
                    buttonText={"Send Code"}
                    handleClick={() =>
                      !!subject.length
                        ? setSendCodeModalOpen(true)
                        : toast.warning(
                            "Please Seelct subject First before sending code to your students!"
                          )
                    }
                  />
                </div>
              )}
            </div>
            <div className="rounded shadow border m-2 p-4">
              <h6 className="text-center">School class Students</h6>

              <div className="p-2 mt-4 highlight">
                American public schools are currently experiencing a severe
                shortage of teachers. If you possess a teaching certificate and
                are willing to instruct online a full class of students, you
                have the opportunity to advertise your services on our portal's
                message board. This platform allows you to set a competitive
                rate for your expertise. Likewise, schools in need of a
                substitute teacher can easily locate your profile, which is
                marked to indicate your availability.
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2 mt-4 justify-content-between">
                <input
                  disabled={!editMode}
                  className="form-check-input border border-dark "
                  type="checkbox"
                  role="switch"
                  id="hourlyCharge"
                  onChange={() => setClassTeaching(!classTeaching)}
                  checked={classTeaching}
                />
                <label
                  className="form-check-label w-75 "
                  htmlFor="hourlyCharge"
                >
                  My hourly Charge for teaching a public or private school class
                  (up to 30 students). Only tutors that fill up this field are
                  being shown to schools.
                </label>

                <Tooltip
                  width="200px"
                  text="Fill in your hourly amount for teaching a public 0r private school class (up to 30 students)."
                  direction="top"
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
                    Tutor must hold teaching certificate from his state to teach
                    in American public, private or charters' schools.{" "}
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
                 Activate multi students option
                </label>
              </div>

              <div className="highlight">
                You or your student may form a group to take advantage of the
                discounts listed in the table below. For instance, if your
                hourly rate is $60 and the group includes 6 students, each
                student would receive a 39% discount per hour. A single student
                will be accountable for managing the account. Please note, if a
                student from the group misses a session, the payment for that
                session is non-refundable.
              </div>

              <h6 className="text-center">Multi Students hourly rate</h6>
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
        <SendCodeModal
          isOpen={sendCodeModalOpen}
          onClose={() => setSendCodeModalOpen(false)}
          subject={subject}
          code={discountCode}
        />
      </div>
    </div>
  );
};

export default Discounts;
