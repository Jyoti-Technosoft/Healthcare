import React, { useState, useEffect } from 'react'
import Header from './Header'
import { useNavigate } from 'react-router-dom';
import { validateRequireEmail, validateRequirePassword } from './Validations';
import { handleAdminLogin } from './AdminAuthHelper';
import ForgotPassword from './ForgotPassword';
import OTPVerification from './OTPVerification';
import ResetPassword from './ResetPassword';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
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
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
  }

  const fortgotPassword = (e) => {
    setActivePage(2);
  };
  const backToLogin = (e) => {
    setActivePage(1);
  }
  const sendOTPCompo = (e) => {
    setActivePage(3);
  }
  const verifyOTPCompo = (e) => {
    setActivePage(4);
  }

  return (
    <>
      <Header />
      <div className='banner_part'>
        <div className="container d-flex justify-content-center align-items-center min-vh-100 loginBox">
          <div className="row border-0 rounded-5 p-3 bg-white shadow box-area">
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#1977cc ' }}>
              <div className="featured-image mb-3">
                <img alt="card2" src="img/ability_img.png" className="img-fluid" style={{ width: '220px' }} />
              </div>
              <p className="text-white fs-2" style={{ fontFamily: 'Courier New, Courier, monospace', fontWeight: '600' }}>Be Verified</p>
            </div>
            {activePage === 1 ? (
              <div className="col-md-6 right-box">
                <div className="row align-items-center">
                  <div className="header-text mb-4">
                    <h2>Hello, Again</h2>
                    <p>We are happy to have you back.</p>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      id="email"
                      type="email"
                      className={`form-control form-control-lg  fs-6 ${emailError && 'is-invalid'} `}
                      placeholder="Email address"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError("");
                      }}
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}

                  </div>
                  <div className="input-group mb-1">
                    <input
                      id="password"
                      type="password"
                      className={`form-control form-control-lg  fs-6 ${passwordError && 'is-invalid'} `}
                      placeholder="Password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setPasswordError("");
                      }}
                    />
                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>
                  <div className="input-group mb-5 d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                      />
                      <label htmlFor="formCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
                    </div>
                    <div className="forgot">
                      <small><button  onClick={fortgotPassword}>Forgot Password?</button></small>
                    </div>
                  </div>
                  <div>
                    {loginError && <div className="error-message mb-4" style={{ color: 'red' }}>{loginError}</div>}
                  </div>

                  <div className="input-group mb-3">
                    <button style={{ background: '#1977cc ' }} className="btn btn-lg btn-primary w-100 fs-6" onClick={login}> Login </button>
                  </div>
                  <div className="input-group mb-3">
                    <button className="btn btn-lg btn-light w-100 fs-6"><img alt='google-png' src="img/google.png" style={{ width: '20px' }} className="me-2" /><small>Sign In with Google</small></button>
                  </div>
                  <div className="row text-center">
                    <small>Don't have account? <p className="nav-link">Sign Up</p></small>
                  </div>
                </div>
              </div>
            ) : activePage === 2 ? (
              <ForgotPassword
                setEmail={setEmail}
                sendOTPCompo={sendOTPCompo}
                backToLogin={backToLogin}
              />
            ) : activePage === 3 ? (
              <OTPVerification
                email={email}
                verifyOTPCompo={verifyOTPCompo}
                backToLogin={backToLogin}
              />
            ) : activePage === 4 ? (
              <ResetPassword
                email={email}
                backToLogin={backToLogin}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

