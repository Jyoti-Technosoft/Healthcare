import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { validateRequireEmail, validateRequirePassword } from "./Validations";
import { handleAdminLogin } from "./AdminAuthHelper";
import ForgotPassword from "./ForgotPassword";
import OTPVerification from "./OTPVerification";
import ResetPassword from "./ResetPassword";
import "../assets/css/Global/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 1 = Login, 2 = Forgot, 3 = OTP, 4 = Reset
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  async function login(event) {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");

    const emailRequireValidation = validateRequireEmail(email);
    const passwordRequireValidation = validateRequirePassword(password);

    if (emailRequireValidation) {
      setEmailError(emailRequireValidation);
      return;
    }

    if (passwordRequireValidation) {
      setPasswordError(passwordRequireValidation);
      return;
    }

    await handleAdminLogin(email, password, navigate, setLoginError);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  }

  // Navigation Helpers
  const goToForgot = () => setActivePage(2);
  const backToLogin = () => setActivePage(1);
  const goToOTP = () => setActivePage(3);
  const goToReset = () => setActivePage(4);

  return (
    <>
      <Header />
      <div className="banner_part">
        <div className="container d-flex justify-content-center align-items-center loginBox">
          {/* Main Card Wrapper */}
          <div className="row border-0 rounded-5 bg-white shadow box-area">
            {/* --- LEFT SIDE (Static) --- */}
            <div className="col-md-6 d-flex justify-content-center align-items-center flex-column left-box">
              <div className="featured-image mb-3">
                <img
                  alt="card2"
                  src="img/ability_img.png"
                  className="img-fluid"
                />
              </div>
              <p className="text-white fs-2">Be Verified</p>
            </div>

            {/* --- RIGHT SIDE (Dynamic) --- */}
            <div className="col-md-6 right-box">
              {/* VIEW 1: LOGIN FORM */}
              {activePage === 1 && (
                <div className="row align-items-center">
                  <div className="header-text mb-4">
                    <h2>Hello, Again</h2>
                    <p>We are happy to have you back.</p>
                  </div>

                  <div className="input-group mb-3">
                    <input
                      id="email"
                      type="email"
                      className={`form-control form-control-lg fs-6 ${
                        emailError && "is-invalid"
                      }`}
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                    />
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>

                  <div className="input-group mb-1">
                    <input
                      id="password"
                      type="password"
                      className={`form-control form-control-lg fs-6 ${
                        passwordError && "is-invalid"
                      }`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                    />
                    {passwordError && (
                      <div className="invalid-feedback">{passwordError}</div>
                    )}
                  </div>

                  <div className="input-group mb-4 d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label
                        htmlFor="formCheck"
                        className="form-check-label text-secondary"
                      >
                        <small>Remember Me</small>
                      </label>
                    </div>
                    <div className="forgot">
                      <button type="button" onClick={goToForgot}>
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="error-message mb-3 text-danger">
                      {loginError}
                    </div>
                  )}

                  <div className="input-group mb-3">
                    <button
                      style={{ background: "#1977cc", color: "#fff" }}
                      className="btn btn-lg w-100 fs-6"
                      onClick={login}
                    >
                      Login
                    </button>
                  </div>

                  <div className="input-group mb-3">
                    <button className="btn btn-lg btn-light w-100 fs-6 border">
                      <img
                        alt="google-png"
                        src="img/google.png"
                        style={{ width: "20px" }}
                        className="me-2"
                      />
                      <small>Sign In with Google</small>
                    </button>
                  </div>

                  <div className="row text-center">
                    <small>
                      Don't have account?{" "}
                      <span className="nav-link">Sign Up</span>
                    </small>
                  </div>
                </div>
              )}

              {/* VIEW 2: FORGOT PASSWORD */}
              {activePage === 2 && (
                <ForgotPassword
                  setEmail={setEmail}
                  sendOTPCompo={goToOTP}
                  backToLogin={backToLogin}
                />
              )}

              {/* VIEW 3: OTP */}
              {activePage === 3 && (
                <OTPVerification
                  email={email}
                  verifyOTPCompo={goToReset}
                  backToLogin={backToLogin}
                />
              )}

              {/* VIEW 4: RESET PASSWORD */}
              {activePage === 4 && (
                <ResetPassword email={email} backToLogin={backToLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
