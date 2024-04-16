import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  get_user_detail,
  getToken as tokenApi,
} from "../axios/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/auth_state/auth";
import { ForgetPasswordModal } from "../components/auth/ForgetPasswordModal";
import "../styles/auth.css";
import {
  useAuth,
  useSignIn,
  useSession,
} from "@clerk/clerk-react";
import { DEFAULT_URL_AFTER_LOGIN } from "../constants/constants";
import TAButton from "../components/common/TAButton";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { signIn, setActive, isLoaded } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const { session, isSignedIn: sessionSignedIn } = useSession();
  console.log(session, isSignedIn, "session info");
  const [modalOpen, setOpenModel] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     console.log(isSignedIn, user, isLoaded, session, sessionSignedIn)
  //     isSignedIn && user.role && navigate(DEFAULT_URL_AFTER_LOGIN[user.role])
  // }, [isSignedIn, user])

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    isSignedIn && user.role && navigate(DEFAULT_URL_AFTER_LOGIN[user.role]);
    console.log(isSignedIn, user, sessionSignedIn);
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: loginForm.email,
        password: loginForm.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // const token = await getToken({ template: 'tutoring-academy-jwt-template' });
        // if (token) {
        //     // localStorage.setItem("access_token", token);
        // } else {
        //     toast.error("Could not retrieve token!");
        // }
      }
    } catch (err) {
      let user = localStorage.getItem("user");
      if (user) user = JSON.parse(user);
      dispatch(setUser(user));
      console.log(err.errors[0].message, user?.role);
      if (err.errors[0].code.includes("session_exists")) {
        fetchUser(user?.SID);
        // navigate(DEFAULT_URL_AFTER_LOGIN[user.role])
        // toast.error('Please Signout First, If you want to Login!')
      } else toast.error(err.errors[0].message || err.message);
    }
    // const result = await login(loginForm);
    localStorage.removeItem("tutor_user_id");
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("student_screen_name");
    localStorage.removeItem("tutor_screen_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("logged_user");

    // if (result.status === 200) {
    //     toast.success("Login Successfull!");
    //     setLoginForm({});
    //     localStorage.setItem('user', JSON.stringify(result.data));
    //     localStorage.setItem('user_role', result.data[0].role)

    //     const getUserSetup = await get_user_setup_detail(result.data[0].role, result.data[0].SID);
    //     dispatch(setUser(result.data))
    //     if (result.data[0].role === 'admin') {
    //         return navigate(`/${result.data[0].role}/tutor-data`);

    //     }
    //     localStorage.setItem(`${result.data[0].role}_user_id`, getUserSetup.AcademyId)
    //     navigate(`/${result.data[0].role}/intro`);
    // }
    // else {
    //     toast.warning(result.message)
    // }
    setLoading(false);
  };

  let fetchUser = async (userId) => {
    if (isLoaded) {
      const user = await get_user_detail(userId);
      if (user?.role) {
        dispatch(setUser(user));
        localStorage.setItem("user", JSON.stringify(user));

        const token = await tokenApi(user);
        if (token) {
          localStorage.setItem("access_token", token);
          navigate(DEFAULT_URL_AFTER_LOGIN[user.role]);
        }
      }
    }
  };

  useEffect(() => {
    if (userId && isSignedIn) {
      fetchUser(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [userId, isLoaded, isSignedIn]);

  return (
    <section>
      <div
        className="px-4 py-5 px-md-5 text-center text-lg-start"
        style={{
          backgroundColor: "hsl(0, 0%, 96%)",
          height: "100vh",
        }}
      >
        <div className="container m-auto h-100">
          <div className="row m-auto h-100 gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="my-5 display-3 fw-bold ls-tight">
                The best offer <br />
                <span className="text-primary">for your business</span>
              </h1>
              <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                quibusdam tempora at cupiditate quis eum maiores libero
                veritatis? Dicta facilis sint aliquid ipsum atque?
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card">
                <div className="card-body py-5 px-md-5">
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
                          className="form-check-input d-inline-block"
                          type="checkbox"
                          id="show"
                          role="switch"
                          onChange={() => setShowPassword(!showPassword)}
                          checked={showPassword}
                        />
                        <label htmlFor="show" className="d-inline-block cursor-pointer" style={{ marginLeft: "5px" }}>
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

                    <TAButton
                      className="saving-btn blinking-button"
                      type="submit"
                      loading={loading}
                      buttonText="Login"
                    />

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
