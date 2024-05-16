import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { get_user_detail, signup } from '../axios/auth';
import { toast } from 'react-toastify';
import { useSignUp, useAuth } from "@clerk/clerk-react";

import TAButton from '../components/common/TAButton'
import { setUser } from '../redux/auth/auth';
import { setTutor } from '../redux/tutor/tutorData';
import { get_student_setup_by_userId } from '../axios/student';
import { setStudent } from '../redux/student/studentData';
import { useDispatch } from 'react-redux';

const Signup = () => {
  const [signupFormValues, setSignupFormValues] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false)
  const { isLoaded, signUp, setActive } = useSignUp();
  const dispatch = useDispatch()

  const { getToken } = useAuth();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isLoaded) return
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: signupFormValues.email,
        password: signupFormValues.password,
        unsafeMetadata: {
          role: signupFormValues.role,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    }
    catch (err) {
      console.log(err.errors[0].message)
      toast.error(err.errors[0].message)
    }
    setLoading(false)
  };

  const handleVerification = async (e) => {
    setVerifying(true);
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const token = await getToken({ template: "tutoring-academy-jwt-template" });
        if (token) {
          // localStorage.setItem("access_token", token);
          const result = await signup({
            email: signupFormValues.email,
            SID: completeSignUp.createdUserId,
            role: signupFormValues.role
          })

          const data = await get_user_detail(completeSignUp.createdUserId)
          if (data) {
            dispatch(setUser(data));
            localStorage.setItem("user", JSON.stringify(data));

            // data.SID && data.role === "tutor" && dispatch(setTutor());
            // if (data.role === "student") {
            //   const result = await get_student_setup_by_userId(data.SID);
            //   if (result?.[0] && result[0].AcademyId) {
            //     dispatch(setStudent(result[0]));
            //     localStorage.setItem("student_user_id", result[0].AcademyId);
            //   }
            // }
          }
          if (result.status === 200) {
            setSignupFormValues({ role: '', email: '', password: '' })
            toast.success('Registration Succesfull')
          }
          else {
            toast.error("Error: Please contact support!");
          }
        } else {
          toast.error("Could not retrieve token from clerk");
        }
      } else {
        toast.error("Unable to complete sign up. Please contact support");
      }
    } catch (err) {
      // setErrors(err.errors);
    } finally {
      setVerifying(false);
      setPendingVerification(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormValues({ ...signupFormValues, [name]: value });
  };

  return (
    <section>
      <div
        className="px-4 py-5 px-md-5 text-center text-lg-start"
        style={{
          backgroundColor: 'hsl(0, 0%, 96%)',
          height: '100vh',
        }}
      >
        <div className="container m-auto h-100">
          <div className="row m-auto h-100 gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="my-5  fw-bold ls-tight">
                Start your tutoring <br />business, join <br />
                <span className="text-primary"> Tutoring Academy</span>
              </h1>
              <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                Welcome to Tutoring Academy, where knowledge knows no bounds!
                Our platform is designed to ignite the flames of curiosity, empower minds, and pave the way for academic triumph.
                With a diverse array of subjects and dedicated tutors, we're here to guide you on your journey to greatness.
              </p>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card m-auto">
                <h3 className="mt-3 text-center"> Signup</h3>

                <div className="card-body py-5 px-md-5">
                  {!pendingVerification ? <form onSubmit={handleSignup}>

                    <div className='row ' style={{ gap: "10px" }}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control m-0"
                        placeholder="Email"
                        value={signupFormValues.email}
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control m-0"
                        placeholder="Password"
                        value={signupFormValues.password}
                        onChange={handleInputChange}
                      />

                      <select className="form-select"
                        name="role"
                        value={signupFormValues.role}
                        aria-label="Default select example" onChange={handleInputChange}>
                        <option selected>Select Role</option>
                        <option value="tutor">Tutor</option>
                        {/* //  <option value=""></option>
                      //  <option value=""></option>
                      //  <option value=""></option>
                      //  <option value=""></option> */}
                      </select>
                    </div>
                    <div className='text-center'>
                      <TAButton type="submit" loading={loading} buttonText={'Sign Up'} className="saving-btn blinking-button mb-4" />
                    </div>

                    <div className="text-center">
                      <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>

                  </form> :
                    <div>
                      <form className='d-flex justify-content-between flex-column'>
                        <input type='text' onBlur={() => { }}
                          onChange={(e) => setCode(e.target.value)} className='form-control' placeholder='Enter Verification Code here' />
                        <TAButton buttonText={"Verify Email"} loading={verifying} handleClick={handleVerification} />
                      </form>
                    </div>
                  }
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
