import { useState } from "react";
import { useEffect } from "react";
import {
  get_tutor_rates,
  get_tutor_subjects,
  post_tutor_setup,
  upload_tutor_rates_form
} from "../../axios/tutor";
import { IoMdCopy, IoMdRefresh } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip from "../common/ToolTip";
import { compareStates, copyToClipboard } from "../../helperFunctions/generalHelperFunctions";
import Actions from "../common/Actions";
import '../../styles/common.css'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../redux/tutor_store/tutorData";

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
  const { tutor } = useSelector(state => state.tutor);
  let [MultiStudentHourlyRate, setMultiStudentHourlyRate] = useState("");
  let [FreeDemoLesson, setFreeDemoLesson] = useState("");
  let [ActivateSubscriptionOption, setActivateSubscriptionOption] =
    useState("");
  let [SubscriptionPlan, setSubscriptionPlan] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [classTeaching, setClassTeaching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState(generateDiscountCode());
  const [loading, setLoading] = useState(false);

  const [changesMade, setChangesMade] = useState(false);
  const [selectedCancellationPolicy, setSelectedCancPolicy] = useState('')
  const [ConsentRecordingLesson, setConsentRecordingLesson] = useState(true)
  const [IntroSessionDiscount, setIntroSessionDiscount] = useState(true)
  const [dbState, setDbState] = useState({});
  const [editMode, setEditMode] = useState(false)
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [codeUsed, setCodeUsed] = useState('new')
  const dispatch = useDispatch();

  const fetchTutorRateRecord = () => {
    get_tutor_rates(window.localStorage.getItem("tutor_user_id"))
      .then((result) => {
        if (result?.length) {
          setDbState(result[0]);
          setMultiStudentHourlyRate(result[0].MutiStudentHourlyRate);
          setSelectedCancPolicy(result[0].CancellationPolicy);
          setFreeDemoLesson(result[0].FreeDemoLesson);
          setConsentRecordingLesson(result[0].ConsentRecordingLesson);
          setActivateSubscriptionOption(result[0].ActivateSubscriptionOption);
          setSubscriptionPlan(result[0].SubscriptionPlan);
          setDiscountCode(result[0].DiscountCode)
          setClassTeaching(result[0].MultiStudent)
          setDiscountEnabled(result[0].CodeShareable)
          setIntroSessionDiscount(result[0].IntroSessionDiscount)
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

          if (result[0].FreeDemoLesson === "yes") {
            document.querySelector("#freeDemoYes").checked = true;
            document.querySelector("#freeDemoNo").checked = false;
          } else {
            document.querySelector("#freeDemoYes").checked = false;
            document.querySelector("#freeDemoNo").checked = true;
          }

        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (!dbState.AcademyId) {
      setEditMode(true)
    } else {
      setEditMode(false)
    }
  }, [dbState])

  useEffect(() => {
    if (discountEnabled) {
      setDiscountCode(generateDiscountCode())
      setSubject('')
      setCodeUsed('new')
      get_tutor_subjects(tutor.AcademyId).then(result => {
        result?.length && setSubjects(result)
      }).catch(err => toast.error(err.message))
    }
  }, [discountEnabled, tutor])

  useEffect(() => {
    fetchTutorRateRecord()
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
    { discount: "0%", hours: '1-5' },
    { discount: "6.0%", hours: '6-11' },
    { discount: "12.0%", hours: '12-17' },
    { discount: "18.0%", hours: '18-23' },
    { discount: "24.0%", hours: '24+' }
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
    e.preventDefault()
    if (!selectedCancellationPolicy.length) return toast.warning('Please select Tutor Cancellation Policy');

    let Step = null;
    if (!dbState.AcademyId) Step = 4;
    setLoading(true)

    let res = await saver()
    if (Step) {
      await post_tutor_setup({
        Step, fname: tutor.FirstName,
        lname: tutor.LastName, mname: tutor.MiddleName, userId: tutor.userId
      })
      dispatch(setTutor())
    }
    if (res.bool) {
      setChangesMade(false)
      fetchTutorRateRecord()
      toast.success(res.mssg)
      setEditMode(false)
    }
    else {
      toast.error("Failed to save record")
    }
    setLoading(false)
  }

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 7000);
  }, [copied]);

  useEffect(() => {
    if (dbState.CodeStatus === 'used') {
      setDiscountEnabled(false)
    }
  }, [dbState.CodeStatus])

  return (
    <div className="tutor-tab-rates">
      <div className="tutor-tab-rate-section" style={{ height: "80vh", overflowY: "auto" }}>
        <form onSubmit={handleSubmit} className="d-flex justify-content-center" style={{ width: "100%", gap: "3%" }}>
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div className="rounded shadow border m-2 p-4" >
              <div className="dropdown d-flex align-items-center mb-4" style={{ width: "75%" }} >
                <label>Tutor Cancellation Policy</label>
                <button
                  style={{ pointerEvents: editMode ? "auto" : "none" }}
                  className={`btn ${selectedCancellationPolicy.length ? 'btn-success' : "btn-secondary"} dropdown-toggle my-0 mx-3`}
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedCancellationPolicy.length ? `${selectedCancellationPolicy}hr   ` : " Select"}
                </button>
                {isOpen && (
                  <div className="dropdown-menu show" style={{ left: "90px", top: "43px" }}>
                    <div className="dropdown-item" onClick={() => {
                      setSelectedCancPolicy('4')
                      setIsOpen(false)
                    }}>
                      4hr.

                    </div>
                    <div className="dropdown-item" onClick={() => {
                      setSelectedCancPolicy('8')
                      setIsOpen(false)
                    }}>
                      8hr.

                    </div>
                    <div className="dropdown-item" onClick={() => {
                      setSelectedCancPolicy('12')
                      setIsOpen(false)
                    }}>
                      12hr.
                    </div>

                    <div className="dropdown-item" onClick={() => {
                      setSelectedCancPolicy('24')
                      setIsOpen(false)
                    }}>
                      24hr
                    </div>
                    <div className="dropdown-item" onClick={() => {
                      setSelectedCancPolicy('48')
                      setIsOpen(false)
                    }}>
                      48 hr.
                    </div>
                  </div>
                )}
                <Tooltip text="How many hours before the lesson, you allow the student to cancel without penalty?" width="200px">
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              <div className="form-check form-switch d-flex gap-3">
                <input disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  onChange={() => setIntroSessionDiscount(!IntroSessionDiscount)}
                  checked={IntroSessionDiscount}
                />
                <label className="form-check-label mr-3" htmlFor="flexSwitchCheckChecked">
                  50% Intro Session
                </label>
                <Tooltip text="The academy mandate an |intro| sessions for new student as a 
                  prerequisite to book further sessions with the tutor. The 50% discount should motivate 
                  the student to select you."
                  width="200px">
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              <div className="form-check form-switch d-flex gap-3">
                <input disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  onChange={() => setConsentRecordingLesson(!ConsentRecordingLesson)}
                  checked={ConsentRecordingLesson}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                  Consent Recording Session
                </label>
                <Tooltip width="200px"
                  text="We record the lesson for learning purpose (or complains).
                     Students or parents can view the recorded lesson. You consent to the recording of the lesson with the student. The recording be saved on the academy servers for 30 days, then be deleted.">
                  <FaInfoCircle size={20} color="#0096ff" className=" mr-3" />
                </Tooltip>
              </div>
            </div>
            <div className=" border m-2 shadow rounded p-4" >
              <div
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <input disabled={!editMode}
                  type="checkbox"
                  onChange={(e) =>
                    setActivateSubscriptionOption(e.target.checked ? true : false)
                  }
                  checked={ActivateSubscriptionOption === "true" || ActivateSubscriptionOption === true}
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
                You must check the box above to activate this option. Your student
                will select one option from the table below when he/she want to
                save by paying upfront for multi sessions. The Academy will forward
                you 50% from the discounted amount upfront, and the balance upon completion. For example; student
                selects the 12 hours option, and you charge $45.00/hr, then $45.00
                X 12 = $540 -12% = $475.20 .
              </div>

              <div
                className="rate-table m-0 d-flex justify-content-center w-100"
                style={{
                  pointerEvents: ActivateSubscriptionOption === "true"
                    || ActivateSubscriptionOption === true ? "auto" : "none",
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
                          <input disabled={!editMode}
                            onInput={(e) => { setSubscriptionPlan(e.target.value) }}
                            type="radio"
                            value={item.hours}
                            checked={item.hours === "1-5"}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: '20px',
                              width: '20px',
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
                In order for you tutoring your own current students on this plateform,
                forward the Code below to your students to be used with thier registration.
                You need to generate new code for each one of your students.

              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2">
                <input disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => setDiscountEnabled(!discountEnabled)}
                  checked={discountEnabled}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                  My Student's code
                </label>

                <Tooltip width="200px" text="Provide the code below to be used by your student for this platform. The code will pair your student to your profile upon the setup of student's account. You must generate new code for each one of your students">
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>

              {
                discountEnabled &&
                <div className="d-flex w-100 justify-content-between align-items-end">
                  <div>
                    <h6 className="mt-4 d-inline">Your Student's new code</h6>
                    <Tooltip text="Generate New Code">
                      <IoMdRefresh
                        size={20}
                        className="d-inline"
                        onClick={() => editMode && setDiscountCode(generateDiscountCode())}
                      />
                    </Tooltip>
                    <div className="input-group">
                      <input disabled={!editMode}
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
                      <p className="text-success d-block">Code copied to clipboard!</p>
                    )}
                  </div>
                  <div className="input-group w-50">
                    <label
                      className="m-0 input-group-text"
                      type="button"
                      id="inputGroupFileAddon04"
                    >
                      Subject
                    </label>
                    <select required className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                      <option value='' disabled>Select</option>
                      {subjects.map(subject =>
                        <option value={subject} >{subject}</option>
                      )}
                    </select>
                  </div>
                </div>
              }

            </div>
            <div className="rounded shadow border m-2 p-4">
              <h6>School class Students</h6>

              <div className="p-2 mt-4 highlight">

                The American public schools are suffering from accute shortage of teachers. if you hold teacher's certificate, and willing to teach full class of students, you are able to post your ad on the portal message board. and charge higher rate for your skills. Similarly, a school in a need for a substitute teacher, can find your account which is flagged accordingly.
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2 mt-4">
                <input disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => setClassTeaching(!classTeaching)}
                  checked={classTeaching}
                />
                <label className="form-check-label w-75 " htmlFor="flexSwitchCheckChecked">
                  My hourly Charge for teaching a public or private school class (up to 30 students).
                  Only tutors that fill up this field are being shown to schools.
                </label>



                <Tooltip
                  width="200px" text="Fill in your hourly amount for teaching a public 0r private school class (up to 30 students)."
                  direction="left"
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              {
                classTeaching &&
                <>
                  <div className="input-group  w-50">
                    <span className="input-group-text">$</span>
                    <input disabled={!editMode}
                      type="text"
                      required
                      className="form-control m-0 py-4"
                      aria-label="Amount (to the nearest dollar)"
                      value={MultiStudentHourlyRate}
                      onChange={(e) => {
                        if (e.target.value < 1000)
                          setMultiStudentHourlyRate(e.target.value)
                      }}
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                  <span className="small text-secondary bg-light">Amount should be less than $999 </span>
                </>
              }
            </div>
          </div>
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div className=" border m-2 shadow rounded p-4" >
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
                <input disabled={!editMode || true}
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
                You or your student can create a group that reflects the discount from the table below.
                Example; if you charge $50/hr then, and the group contain 6 students, then each student pays $30.50
                Only one student responsible for the account. if one of the group is missing a session,
                there is no refund.
              </div>

              <h6>Multi Students hourly rate</h6>
              <div
                className="rate-table d-flex w-100 justify-content-center m-0"
                style={{
                  pointerEvents: ActivateSubscriptionOption === "true"
                    || ActivateSubscriptionOption === true ? "auto" : "none",
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
                          <input disabled={!editMode}
                            type="radio"
                            value={item.disc}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: '20px',
                              width: '20px',
                            }} />
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
      </div >
    </div >
  );
};

export default Rates;
