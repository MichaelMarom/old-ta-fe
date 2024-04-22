import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { get_user_detail } from "../../axios/auth";
import Modal from "../common/Modal";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth_state/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TAButton from "../common/TAButton";

export const ForgetPasswordModal = ({ modalOpen, setOpenModel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const token = localStorage.getItem("access_token");

  const { isLoaded, signIn, setActive } = useSignIn();

  const { getToken, userId, isSignedIn } = useAuth();

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
        toast.error(err.errors[0].long_message);

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
          if (userDetails.role) {
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
            {password !== confirmPassword && (
              <div className="alert alert-danger">Passwords do not match.</div>
            )}
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
