import { useEffect, useState } from "react";
import RichTextEditor from "../common/RichTextEditor/RichTextEditor";
import Actions from "../common/Actions";
import {
  // get_adminConstants,
  //  post_termsOfUse,
  send_sms
} from "../../axios/admin";
import {
  setAgreementDateToNullForAll,
  updateTutorSetup,
} from "../../axios/tutor";
import Loading from "../common/Loading";
import { setTutor } from "../../redux/tutor/tutorData";
import { useDispatch, useSelector } from "react-redux";
import { showDate } from "../../utils/moment";
import { convertToDate } from "../common/Calendar/Calendar";
import {
  PROFILE_STATUS,
  applicationMandatoryFields,
} from "../../constants/constants";
import { toast } from "react-toastify";
import _ from "lodash";
import { MandatoryFieldLabel } from "./TutorSetup";
import { setMissingFieldsAndTabs } from "../../redux/tutor/missingFieldsInTabs";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BsNutFill } from "react-icons/bs";

const TermOfUse = () => {
  const [unSavedChanges, setUnSavedChanges] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const { tutor } = useSelector((state) => state.tutor);
  const { user } = useSelector((state) => state.user);
  const { missingFields } = useSelector((state) => state.missingFields);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const storedUserRole = user.role;
  //       const result = await get_adminConstants();
  //       if (result?.data?.[0]?.TermContent) {
  //         set_terms(result.data[0].TermContent);
  //         set_db_terms(result.data[0].TermContent);
  //       }
  //       setUserRole(storedUserRole);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //     setFetching(false);
  //   };
  //   fetchData();
  // }, [user]);

  useEffect(() => {
    if (tutor.AgreementDate) setAgreed(true);
  }, [tutor]);

  useEffect(() => {
    if (
      (!tutor.AgreementDate && agreed)
    ) {
      setUnSavedChanges(true);
    } else {
      setUnSavedChanges(false);
    }
  }, [agreed, tutor, editMode]);

  // const handleEditorChange = (value) => {
  //   set_terms(value);
  // };

  // const handleSaveTerms = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const response = await post_termsOfUse({ TermContent: terms });
  //   await setAgreementDateToNullForAll();
  //   response?.data?.TermContent && set_db_terms(response.data.TermContent);
  //   setEditMode(false);
  //   setLoading(false);
  // };

  const handleSaveAgreement = async (e) => {
    e.preventDefault();

    if (user.role === "tutor") {
      const missingFieldsExceptTOU = _.chain(missingFields).filter((item) => item.tab !== "Terms Of Use").map(item => `"${item.tab}" `).value()
      if (missingFieldsExceptTOU.length)
        return toast.warning(
          `Mandatory fields are missing from ${_.uniq(
            _.chain(missingFields).filter((item) => item.tab !== "Terms Of Use").map(item => `"${item.tab}" `).value()
          )} Tab`
        );

      setLoading(true);
      let body = {
        AgreementDate: new Date(),
      };
      if (tutor.Status === PROFILE_STATUS.PENDING)
        body.Status = PROFILE_STATUS.UNDER_REVIEW;
      await updateTutorSetup(tutor.AcademyId, body);

      dispatch(setMissingFieldsAndTabs({ ...tutor, ...body }));
      tutor.CellPhone.startsWith("+1") && await send_sms({ message: "Your Account is Currently Under Review,. You will get response within 24 hrs", numbers: [tutor.CellPhone.replace("+", "")], id: tutor.AcademyId })
      setLoading(false);
      dispatch(setTutor({ ...tutor, ...body }));
    }
  };

  return (
    <div className="form-term-of-use h-100">
      <form
        onSubmit={handleSaveAgreement}
      >
        <div className="d-block p-5">
          <h4 style={{ fontSize: "16px" }}>
            <span
              className="text-danger"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              *
            </span>{" "}
            CHECKING THE BOX BELOW, CONSITUTES YOUR ACCPETANCE OF THESE TERMS OF
            USE
          </h4>

          <div
            className="form-check "
            onClick={() =>
              !editMode &&
              toast.info(
                "Please click Edit button from bototm to enable editing!"
              )
            }
          >
            <input
              className="form-check-input border border-dark"
              style={{
                width: "30px",
                height: "30px",
                marginRight: "10px",
                border: "4px solid black",
              }}
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(true)}
              disabled={
                tutor.AgreementDate || user.role !== "tutor" || !editMode
              }
              required={user.role === "tutor"}
            />
            <label className="form-check-label fs-6">
              By checking the box you agree with the terms of the tutoring
              academy service.
            </label>
          </div>
          {tutor.AgreementDate && (
            <div className="text-success">
              Agreed on - {showDate(convertToDate(tutor.AgreementDate))}
            </div>
          )}
        </div>
        <div className="px-4 tutor-tos">
          <div className="container my-5 border shadow rounded"
            style={{ maxHeight: "calc(100vh - 380px)", overflow: "auto", height: "auto" }}>
            <div className='w-100 text-center p-1'>
              <img className='' src={`${process.env.REACT_APP_BASE_URL}/logo1.png`} width={350} height={100} alt="logo" />
            </div>
            <h4 className="text-center mb-4">Terms of Use</h4>

            <h5>Chapter 1: Introduction</h5>
            <p>
              This chapter explains the purpose and scope of the terms of use and
              defines some key terms and concepts, such as the tutoring academy, the
              platform, the services, the tutors, and the users.
            </p>

            <h5>Chapter 2: Platform and Services</h5>
            <p>
              This chapter describes the features and functions of the platform and
              the services.
            </p>

            <ol>
              <li>
                <FaCheckCircle className="text-success" /> Accessing the platform
                through a web browser or a mobile app
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Registering as a tutor and
                creating a profile that showcases your qualifications, experience, and
                availability
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Selecting the subjects that
                you are proficient in and setting your hourly rates
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Scheduling sessions with
                students who request your services or browse through open requests
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Communicating with students
                via chat, voice, or video before, during, and after the sessions
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Receiving payments securely
                and conveniently through the platform's payment system
              </li>
            </ol>

            <h6>As a tutor, you are expected to:</h6>
            <ol>
              <li>Provide high-quality tutoring that meets the student's needs</li>
              <li>Follow the platform's policies on professionalism and ethics</li>
              <li>Respect the privacy and confidentiality of the students</li>
              <li>Give feedback and ratings to the students after each session</li>
              <li>
                Resolve any issues or disputes with students or the platform
                courteously
              </li>
            </ol>

            <h5>Chapter 3: Verification and Background Checks</h5>
            <p>
              This chapter outlines the requirements for verifying tutors’
              credentials and conducting background checks.
            </p>

            <ol>
              <li>
                <FaTimesCircle className="text-danger" /> Providing false or inaccurate
                information may result in contract termination or legal action.
              </li>
              <li>
                <FaCheckCircle className="text-success" /> Background checks screen
                tutors for criminal records or other issues.
              </li>
              <li>
                <FaCheckCircle className="text-success" /> The process may take up to
                two weeks depending on document availability.
              </li>
            </ol>

            <h5>Chapter 4: Privacy and Data Protection</h5>
            <p>
              This chapter covers privacy policies on the collection, use, storage,
              and sharing of personal information of tutors and users.
            </p>

            <h5>Chapter 5: Intellectual Property Rights</h5>
            <p>
              This chapter clarifies the ownership and usage of intellectual property
              rights, such as trademarks, logos, images, videos, and other materials.
            </p>

            <h5>Chapter 6: User Conduct and Content</h5>
            <p>
              This chapter defines rules for user and tutor behavior and content
              during tutoring sessions and interactions on the platform.
            </p>

            <ol>
              <li>Prohibited behaviors include abusive, harassing, or fraudulent actions.</li>
              <li>
                Acceptable content includes feedback, ratings, and personal
                information in compliance with platform standards.
              </li>
              <li>
                Violators may face consequences such as warnings, suspensions, or
                legal actions.
              </li>
            </ol>

            <h5>Chapter 7: Fees and Payments</h5>
            <p>
              This chapter covers fees and payment procedures, including billing,
              taxes, deductions, and disputes.
            </p>

            <h5>Chapter 8: Cancellation and Termination</h5>
            <p>
              This chapter outlines how users or tutors can cancel their accounts or
              sessions and the consequences of such actions.
            </p>

            <h5>Chapter 9: Warranty and Liability</h5>
            <p>
              This chapter provides warranty and liability statements, disclaimers,
              and limitations of liability for platform and services use.
            </p>

            <h5>Chapter 10: Dispute Resolution and Governing Law</h5>
            <p>
              This chapter discusses methods for resolving disputes, such as
              arbitration and mediation, and the applicable governing laws.
            </p>
          </div>
          {/* <RichTextEditor
            value={terms}
            onChange={handleEditorChange}
            readOnly={!editMode || user.role !== "admin" || !editMode}
            placeholder="Enter Term Of  Service"
            height="calc(100vh - 190px)"
            className="mb-5"
          /> */}
        </div>

        <Actions
          loading={loading}
          saveDisabled={
            !editMode || (tutor.AgreementDate && user.role === "tutor")
          }
          editDisabled={editMode}
          onEdit={() => setEditMode(true)}
          unSavedChanges={unSavedChanges}
          nextDisabled={!tutor.AgreementDate}
        />
      </form>
    </div>
  );
};

export default TermOfUse;