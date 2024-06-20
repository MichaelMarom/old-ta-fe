import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { get_user_detail } from "../../axios/auth";
import Modal from "../common/Modal";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TAButton from "../common/TAButton";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

export const ForgetPasswordModal = ({ modalOpen, setOpenModel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const token = localStorage.getItem("access_token");

  const { isLoaded, signIn, setActive } = useSignIn();

  const { getToken, userId, isSignedIn } = useAuth();
  const [showPassConditions, setShowPassConditions] = useState(false)
  const [passValid, setPassValid] = useState(false)
  const [passConditions, setPassConditions] = useState([{
    condition: "Must contain at least 8 characters",
    status: false
  }, {
    condition: "Must contain at least 1 number",
    status: false
  }, {
    condition: "Must contain at least 1 uppercase letter",
    status: false
  }, {
    condition: "Must contain at least 1 lowercase letter",
    status: false
  }, {
    condition: "Must contain at least 1 special character",
    status: false
  }, {
    condition: "Password and ConfirmPassword must be same",
    status: false
  }])

  useEffect(() => {
    if (passConditions.find(con => !con.status))
      setPassValid(false)
    else setPassValid(true)
  }, [passConditions])

  useEffect(() => {
    if (!!password.length) {
      setShowPassConditions(true)
      const checkConditions = () => {
        return [
          { condition: "Must contain at least 8 characters", status: password.length >= 8 },
          { condition: "Must contain at least 1 number", status: /\d/.test(password) },
          { condition: "Must contain at least 1 uppercase letter", status: /[A-Z]/.test(password) },
          { condition: "Must contain at least 1 lowercase letter", status: /[a-z]/.test(password) },
          { condition: "Password and ConfirmPassword must be same", status: password === confirmPassword },
          { condition: "Must contain at least 3 special characters", status: (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 3 }
        ];
      };
      setPassConditions(checkConditions());
    }
    else setShowPassConditions(false)
  }, [password, confirmPassword])

  async function sendResetCode(e) {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
      })
      .catch((err) => {
        toast.error(err.errors[0].longMessage);
        console.error("error", err.errors[0].longMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function reset(e) {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (!passValid) return
    if (!code.length) return toast.error("Please fill code field")
    if (!isLoaded) return;
    setLoading(true);
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then(async (result) => {
        if (result.status === "needs_second_factor") {
          //   setSecondFactor(true);
        } else if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          const token = await getToken({
            template: "tutoring-academy-jwt-template",
          });
          setComplete(true);
          if (token) {
            localStorage.setItem("access_token", token);
            setOpenModel(false);
            toast.success("Password Reset Succesfully");
          }
        } else {
          toast.error(
            "Could not log you in. Please try again or contact support."
          );
        }
      })
      .catch((err) => {
        console.log(err.errors)
        toast.error(err.errors[0].longMessage);

        // setErrors(err.errors);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (userId && isSignedIn) {
      let fetchUser = async () => {
        if (token && isLoaded) {
          const userDetails = await get_user_detail(userId, token);
          if (userDetails?.role) {
            dispatch(setUser(userDetails));
            localStorage.setItem("user", JSON.stringify(userDetails));
            userDetails.role !== "admin"
              ? navigate(`/${userDetails.role}/intro`)
              : navigate(`/${userDetails.role}/tutor-data`);
          }
        }
      };
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isLoaded, token, isSignedIn]);

  return (
    <Modal
      show={modalOpen}
      handleClose={() => setOpenModel(false)}
      title={"Change Password"}
    >
      <div className="container">
        {!successfulCreation && !complete && (
          <>
            <div className="form-group">
              <label htmlFor="password">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between">
              <TAButton
                buttonText="Close"
                handleClick={() => setOpenModel(false)}
              />

              <TAButton
                buttonText="Send Code"
                className="blinking-button saving-btn"
                handleClick={sendResetCode}
                loading={loading}
              />
            </div>
          </>
        )}
        {successfulCreation && !complete && (
          <>
            <div className="form-group">
              <label htmlFor="password">Code:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {showPassConditions &&
              <div className='d-flex flex-column'>
                {passConditions.map(cond => {
                  return <div className={`${cond.status ? 'text-success' : 'text-danger'} d-flex`}>
                    <div className='mx-1'>
                      {cond.status ? <FaCheck /> : <RxCross1 />}
                    </div>
                    <p>
                      {cond.condition}
                    </p>
                  </div>
                })}
              </div>
            }

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <hr className="mt-4" />
            <div className="d-flex justify-content-between">
              <TAButton
                buttonText="Close"
                handleClick={() => setOpenModel(false)}
              />
              <TAButton
                buttonText="Reset"
                className="saving-btn blinking button"
                handleClick={reset} 
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};


