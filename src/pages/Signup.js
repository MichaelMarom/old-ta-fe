import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { get_user_detail, signup } from "../axios/auth";
import { toast } from "react-toastify";
import { useSignUp, useAuth, useClerk } from "@clerk/clerk-react";

import TAButton from "../components/common/TAButton";
import { setUser } from "../redux/auth/auth";
// import { setTutor } from '../redux/tutor/tutorData';
// import { get_student_setup_by_userId } from '../axios/student';
// import { setStudent } from '../redux/student/studentData';
import { useDispatch } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Input from "../components/common/Input";
import { post_tutor_setup } from "../axios/tutor";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");
  const [showPassword, setShowPassword] = useState(false);
  const { user, signOut } = useClerk()
  const [showPassConditions, setShowPassConditions] = useState(false);
  const [passValid, setPassValid] = useState(false);
  const [regError, setRegError] = useState(false)
  const [passConditions, setPassConditions] = useState([
    {
      condition: "Must contain at least 8 characters",
      status: false,
    },
    {
      condition: "Must contain at least 1 number",
      status: false,
    },
    {
      condition: "Must contain at least 1 uppercase letter",
      status: false,
    },
    {
      condition: "Must contain at least 1 lowercase letter",
      status: false,
    },
    {
      condition: "Must contain at least 3 special character",
      status: false,
    },
    {
      condition: "Password and ConfirmPassword must be same",
      status: false,
    },
  ]);

  const [signupFormValues, setSignupFormValues] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    role: "tutor",
    confirmPass: "",
  });

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (role === "student") setSignupFormValues({ ...signupFormValues, role });
  }, [role]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!passValid) return;
    if (
      !signupFormValues?.email ||
      !signupFormValues?.password ||
      !signupFormValues?.role
    )
      return toast.error("Please fill all the fields");

    if (signupFormValues?.password !== signupFormValues?.confirmPass) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const adminEmail =
        signupFormValues.email.split("@")[1] === "tutoring-academy.com";
      await signUp.create({
        emailAddress: signupFormValues.email,
        password: signupFormValues.password,
        unsafeMetadata: {
          role: adminEmail ? "admin" : signupFormValues.role,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.log(err.errors[0].message);
      toast.error(err.errors[0].message);
    }
    setLoading(false);
  };

  const handleVerification = async (e) => {
    setVerifying(true);
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const token = await getToken({
          template: process.env.REACT_APP_CLERK_JWT_TEMP,
        });
        if (token) {
          // localStorage.setItem("access_token", token);
          const adminEmail =
            signupFormValues.email.split("@")[1] === "tutoring-academy.com";
          const userBody = {
            email: signupFormValues.email,
            SID: completeSignUp.createdUserId,
            role: adminEmail ? "admin" : signupFormValues.role,
          }

          try {
            const result = await signup(userBody);
            const newTutorSetup = await post_tutor_setup({
              userId: completeSignUp.createdUserId,
              fname: signupFormValues.fname, mname: signupFormValues.mname, lname: signupFormValues.lname
            })
            console.log(newTutorSetup, 'newUser');
            if (result.status === 200) {
              setSignupFormValues({ role: "", email: "", password: "" });
              dispatch(setUser(userBody));
              localStorage.setItem("user", JSON.stringify(userBody));
              setPendingVerification(false);
              navigate("/login");
              toast.success("Registration Successfull");
            } else {
              toast.error("Error: Please contact support!");
            }
          }
          catch (e) {
            toast.error(e.message)
            setRegError(true)
          }

        } else {
          toast.error("Could not retrieve token from clerk");
        }
      } else {
        toast.error("Unable to complete sign up. Please contact support");
      }
    } catch (err) {
      toast.error(err.message)
      // setErrors(err.errors);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (user && regError) {
      user.delete()
      signOut();
    }
  }, [user, regError])

  useEffect(() => {
    if (passConditions.find((con) => !con.status)) setPassValid(false);
    else setPassValid(true);
  }, [passConditions]);

  useEffect(() => {
    if (!!signupFormValues.password.length) {
      setShowPassConditions(true);
      const checkConditions = () => {
        return [
          {
            condition: "Must contain at least 8 characters",
            status: signupFormValues.password.length >= 8,
          },
          {
            condition: "Must contain at least 1 number",
            status: /\d/.test(signupFormValues.password),
          },
          {
            condition: "Must contain at least 1 uppercase letter",
            status: /[A-Z]/.test(signupFormValues.password),
          },
          {
            condition: "Must contain at least 1 lowercase letter",
            status: /[a-z]/.test(signupFormValues.password),
          },
          {
            condition: "Password and ConfirmPassword must be same",
            status: signupFormValues.password === signupFormValues.confirmPass,
          },
          {
            condition: "Must contain at least 3 special characters",
            status:
              (signupFormValues.password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [])
                .length >= 3,
          },
        ];
      };
      setPassConditions(checkConditions());
    } else setShowPassConditions(false);
  }, [signupFormValues.password, signupFormValues.confirmPass]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormValues({ ...signupFormValues, [name]: value });
  };

  return (
    <section>
      <div
        className="px-4 py-5 px-md-5 text-center text-lg-start"
        style={{
          backgroundColor: "hsl(0, 0%, 96%)",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div className="container m-auto h-100">
          <div className="row m-auto h-100 gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="my-5  fw-bold ls-tight">
                Start your tutoring <br />
                business, join <br />
                <span className="text-primary"> Tutoring Academy</span>
              </h1>
              <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                Welcome to Tutoring Academy, where knowledge knows no bounds!
                Our platform is designed to ignite the flames of curiosity,
                empower minds, and pave the way for academic triumph. With a
                diverse array of subjects and dedicated tutors, we're here to
                guide you on your journey to greatness.
              </p>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card m-auto">
                <h3 className="mt-3 text-center">
                  Signup {role == "student" && 'as "Student"'}
                </h3>

                <div className="card-body pb-5 px-md-5">
                  {!pendingVerification ? (
                    <div>
                      <p
                        className="text-start  text-secondary mb-2"
                        style={{ fontSize: "12px", fontWeight: "400" }}
                      >
                        An 6 digit code will be sent to your email after signup
                      </p>
                      <form onSubmit={handleSignup}>
                        <div className="row " style={{ gap: "10px" }}>
                          <input
                            type="text"
                            id="fname"
                            name="fname"
                            required
                            className="form-control m-0"
                            placeholder="First Name"
                            value={signupFormValues.fname}
                            onChange={handleInputChange}
                          />
                          <input
                            type="text"
                            id="mname"
                            name="mname"
                            className="form-control m-0"
                            placeholder="Middle Name"
                            value={signupFormValues.mname}
                            onChange={handleInputChange}
                          />
                          <input
                            type="text"
                            id="lname"
                            name="lname"
                            required
                            className="form-control m-0"
                            placeholder="Last Name"
                            value={signupFormValues.lname}
                            onChange={handleInputChange}
                          />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="form-control m-0"
                            placeholder="Email"
                            value={signupFormValues.email}
                            onChange={handleInputChange}
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="form-control m-0"
                            placeholder="Password"
                            value={signupFormValues.password}
                            onChange={handleInputChange}
                          />
                          {showPassConditions && (
                            <div className="d-flex flex-column">
                              {passConditions.map((cond) => {
                                return (
                                  <div
                                    className={`${cond.status
                                      ? "text-success"
                                      : "text-danger"
                                      } d-flex`}
                                  >
                                    <div className="mx-1">
                                      {cond.status ? <FaCheck /> : <RxCross1 />}
                                    </div>
                                    <p>{cond.condition}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPass"
                            required
                            className="form-control m-0"
                            placeholder="Confirm Password"
                            value={signupFormValues.confirmPass}
                            onChange={handleInputChange}
                          />
                          <div
                            className=" mt-2"
                            style={{ marginBottom: "-10px" }}
                          >
                            <input
                              className="form-check-input border border-dark d-inline-block"
                              type="checkbox"
                              id="show"
                              role="switch"
                              onChange={() => setShowPassword(!showPassword)}
                              checked={showPassword}
                            />
                            <label
                              htmlFor="show"
                              className="d-inline-block cursor-pointer"
                              style={{ marginLeft: "5px" }}
                            >
                              Show password
                            </label>
                          </div>
                          {/* {role !== "student" && <select className="form-select"
                            name="role"
                            required
                            value={signupFormValues.role}
                            aria-label="Default select example" onChange={handleInputChange}>
                            <option value="" disabled>Select Role</option>
                            <option value="tutor">Tutor</option>
                          </select>} */}
                        </div>
                        <div className="text-center">
                          <TAButton
                            type="submit"
                            loading={loading}
                            buttonText={"Sign Up"}
                            className=" mb-4"
                          />
                        </div>

                        <div className="text-center">
                          <p>
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <h6 className="text-start">
                        An 6 digit code was sent to your email
                      </h6>
                      <form
                        className="d-flex justify-content-between flex-column "
                        onSubmit={handleVerification}
                      >
                        <input
                          type="text"
                          onBlur={() => { }}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          className="form-control"
                          placeholder="Enter Verification Code here"
                        />
                        <TAButton
                          buttonText={"Verify Email"}
                          loading={verifying}
                          type="submit"
                          className="w-50"
                        />
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
