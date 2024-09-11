import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get_user_detail, getToken as tokenApi } from "../axios/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/auth/auth";
import { ForgetPasswordModal } from "../components/auth/ForgetPasswordModal";
import "../styles/auth.css";
import { useAuth, useSignIn, useSession, useClerk } from "@clerk/clerk-react";
import { DEFAULT_URL_AFTER_LOGIN } from "../constants/constants";
import TAButton from "../components/common/TAButton";
import { redirect_to_login } from "../utils/auth";
import { setTutor } from "../redux/tutor/tutorData";
import { setStudent } from "../redux/student/studentData";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const [showPassword, setShowPassword] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const [modalOpen, setOpenModel] = useState(false);
  const token = localStorage.getItem("access_token");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    isSignedIn && user?.role && navigate(DEFAULT_URL_AFTER_LOGIN[user.role]);
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: loginForm.email,
        password: loginForm.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      let user = localStorage.getItem("user");
      if (user) user = JSON.parse(user);
      if (err.errors[0].code.includes("session_exists") && user?.SID) {
        fetchUser(user?.SID);
      } else toast.error(err.errors[0].message || err.message);
    }
    localStorage.removeItem("tutor_user_id");
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("student_screen_name");
    localStorage.removeItem("tutor_screen_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("logged_user");
    setLoading(false);
  };

  let fetchUser = useCallback(async (userId) => {
    if (isLoaded && userId) {
      setLoading(true);
      const user = await get_user_detail(userId);
      setLoading(false);
      if (user?.role) {
        dispatch(setUser(user));
        localStorage.setItem("user", JSON.stringify(user));

        const token = await tokenApi(user);
        if (token) {
          localStorage.setItem("access_token", token);
          navigate(DEFAULT_URL_AFTER_LOGIN[user.role]);
        }
      } else {
        toast.error("User not found!");
        redirect_to_login(
          navigate,
          signOut,
          dispatch,
          setTutor,
          setStudent,
          setUser
        );
      }
    }
  }, [isLoaded,])

  useEffect(() => {
    if (userId && isSignedIn) {
      fetchUser(userId);
    } else {
      dispatch(setUser({}))
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [userId, isSignedIn, isLoaded, fetchUser]);

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
                <h3 className="mt-3 text-center"> Login</h3>
                <div className="card-body pb-5 px-md-5">
                  <form onSubmit={handleLogin}>
                    <div className="form-outline mb-4">
                      <input
                        required
                        type="email"
                        id="form3Example3"
                        className="form-control"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        id="form3Example4"
                        className="form-control"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                      />
                      <div className=" mt-2" style={{ marginBottom: "-10px" }}>
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
                    </div>
                    <div className="w-100 d-flex justify-content-end text-primary">
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpenModel(true)}
                      >
                        forgot password?
                      </div>
                    </div>
                    <div className="text-center">
                      <TAButton
                        className=""
                        type="submit"
                        loading={loading}
                        buttonText="Login"
                      />
                    </div>

                    <div className="text-center">
                      <p>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                      </p>
                    </div>
                  </form>
                </div>
                <ForgetPasswordModal
                  setOpenModel={setOpenModel}
                  modalOpen={modalOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
