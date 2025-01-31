import React, { memo, useState } from 'react'
import Header from './Header' 
import { useNavigate, Link } from 'react-router-dom';
import { validateRequireEmail, validatePatternEmail, validateRequirePassword, validatePatternPassword } from './Validations';
import { handleAdminRegistration } from './AdminAuthHelper';
import Cookies from 'js-cookie';

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  async function register(event) {

    event.preventDefault();
    setEmailError("");
    setPasswordError("");

    // Validation checks
    const emailRequireValidation = validateRequireEmail(email);
    const emailPatternValidation = validatePatternEmail(email);
    const passwordRequireValidation = validateRequirePassword(password);
    const passwordPatternValidation = validatePatternPassword(password);

    if (emailRequireValidation) {
      setEmailError(emailRequireValidation);
      return;
    } else if (emailPatternValidation) {
      setEmailError(emailPatternValidation);
      return;
    }

    if (passwordRequireValidation) {
      setPasswordError(passwordRequireValidation);
      return;
    } else if (passwordPatternValidation) {
      setPasswordError(passwordPatternValidation);
      return;
    }
    const token = Cookies.get('authToken');
    // const token1 = localStorage.getItem('authToken');
    await handleAdminRegistration(email, password, navigate, setRegistrationError,token);

  }

  return (
    <>
      <Header />
      {/* <!----------------------- Main Container --------------------------> */}
      <div className='banner_part'>
        <div className="container d-flex justify-content-center align-items-center min-vh-100 registrationBox">
          {/* <!----------------------- Login Container --------------------------> */}
          <div className="row border rounded-5 p-3 bg-white shadow box-area">
            {/* <!-------------------- ------ Right Box ----------------------------> */}
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
                    className={`form-control form-control-lg bg-light fs-6 ${emailError && 'is-invalid'} `}
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}

                </div>
                <div className="input-group mb-3">
                  <input
                    id="password"
                    type="password"
                    className={`form-control form-control-lg bg-light fs-6 ${passwordError && 'is-invalid'} `}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                    }}
                  />
                  {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                </div>
              
                <div className="input-group mb-3">
                  <button style={{ background: '#1977cc' }} className="btn btn-lg btn-primary w-100 fs-6" onClick={register}> Sign up </button>
                </div>
                <div className="input-group mb-3">
                  <button className="btn btn-lg btn-light w-100 fs-6"><img src="img/google.png" style={{ width: '20px' }} className="me-2" /><small>Sign Up with Google</small></button>
                </div>
                <div className="row text-center">
                  <small>Already have an account? <Link className="nav-link" to="/login">Log in</Link></small>
                </div>
              </div>
            </div>
            {registerationError && <div className="error-message" style={{ color: 'red' }}>{registerationError}</div>}


            {/* <!--------------------------- Left Box -----------------------------> */}
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#1977cc' }}>
              <div className="featured-image mb-3">
                <img src="img/ability_img.png" className="img-fluid" style={{ width: '220px' }} />
              </div>
              <p className="text-white fs-2" style={{ fontFamily: 'Courier New, Courier, monospace', fontWeight: '600' }}>Be Verified</p>
              <small className="text-white text-wrap text-center" style={{ width: '17rem', fontFamily: 'Courier New, Courier, monospace' }}>Join experienced Designers on this platform.</small>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Registration;
