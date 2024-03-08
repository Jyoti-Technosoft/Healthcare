import React, { useState } from 'react'
import { handlePatientRegistration } from './PatientDoctorAuthHelper';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UsersAuthHelper } from './UsersAuthHelper';
import { validateRequireEmail, validatePatternEmail, validateRequirePassword, validatePatternPassword, validateRequireName, validateRequireContact, validateRequireDob, validateRequireGender, validateRequireAddress, validateRequireWeight, validateRequireHeight, calculateAge } from '../Validations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  
  setActiveTab,
} from '../../actions/submenuActions';

export default function RegisterPatient() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState(1);
  const stepLabels = ["Register Patient"];
  const [passwordVisibility, setPasswordVisibility] = useState(true); // State to toggle password visibility
  const [confirmpasswordVisibility, setConfirmPasswordVisibility] = useState(true); // State to toggle password visibility
  const roleCookie = Cookies.get('role'); 
  const totalSteps = 1;
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const setMenu = (submenu) => {
  
    if (submenu === 'patientsList') {
      // If the submenu is registerPatient, dispatch actions to reset the previous state to null
      dispatch(setActiveTab('patientsList'));
    } 
  };

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");



  const handleGenderChange = (event) => { 
    setGender(event.target.value);
  };
  const capitalizeName = (name) => {
    return name.toLowerCase().replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
  };
  const handleDateOfBirthChange = (event) => {
    const dob = event.target.value;
    setDob(dob); // Update date of birth state
    setAge(calculateAge(dob)); // Calculate and update age state
  };
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmpasswordVisibility);
  };

  async function handleSubmit(event) {
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");
    setNameError("");
    setContactError("");
    setDobError("");
    setGenderError("");
    setAddressError("");
    setWeightError("");
    setHeightError("");
    event.preventDefault();

    const emailRequireValidation = validateRequireEmail(email);
    const emailPatternValidation = validatePatternEmail(email);
    const passwordRequireValidation = validateRequirePassword(password);
    const passwordPatternValidation = validatePatternPassword(password);
    const nameRequireValidation = validateRequireName(name);
    const contactRequireValidation = validateRequireContact(contact);
    const dobRequireValidation = validateRequireDob(dateOfBirth);
    const genderRequireValidation = validateRequireGender(gender);
    const addressRequireValidation = validateRequireAddress(address);
    const weightRequireValidation = validateRequireWeight(weight);
    const heightRequireValidation = validateRequireHeight(height);



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
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords does not match");
      return;
    }

    if (nameRequireValidation) {
      setNameError(nameRequireValidation);
      return;
    }
    if (contactRequireValidation) {
      setContactError(contactRequireValidation);
      return;
    }
    if (dobRequireValidation) {
      setDobError(dobRequireValidation);
      return;
    }
    if (!gender) {
      setGenderError('Please select a gender');
      return;
    }
    if (addressRequireValidation) {
      setAddressError(addressRequireValidation);
      return;
    }
    if (weightRequireValidation) {
      setWeightError(weightRequireValidation);
      return;
    }
    if (heightRequireValidation) {
      setHeightError(heightRequireValidation);
      return;
    }
    try {
      await UsersAuthHelper(email, password, 'Patient', name, contact, dateOfBirth, age, gender, address, '', '', '', weight, height, navigate);
    } catch (error) {
      alert(error)
    }
  };
  function handleClear() {
    // Clear all form fields by setting their respective state to an empty string
    setName("");
    setPassword("");
    setConfirmPassword("");
    setContact("");
    setEmail("");
    setDob("");
    setAge("");
    setGender('');
    setWeight("");
    setHeight("");
    setAddress("");
  }
  return (
    <div className='background_part padding_top'>
      <div className="container updateProfileContainer" style={{ fontSize: '14px' }}>
        <div className="row flex-lg-nowrap">
          <div className="col">
            <div className="row">
              <div className="col mb-3">
                <div className="card border-0 mb-3 shadow  bg-white rounded">
                  <div className="card-body">
                    <div className="col-12">
                      <i className="bi bi-arrow-left" 
                        style={{ fontSize: '25px', cursor: 'pointer', color: 'grey', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s' }}
                        onClick={() => setMenu('patientsList')}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      ></i>
                    </div>
                    <ul className="nav nav-tabs mt-3 mb-4">
                      {[...Array(totalSteps).keys()].map((index) => (
                        <li className="nav-item" key={index + 1}>
                          <button
                            className={`nav-link btn ${step === index + 1 ? 'active' : ''}`}
                            onClick={() => {
                              if (index === 0) {
                                setStep(index + 1);
                              }
                            }}
                            disabled={index !== 0}
                          >
                            <FontAwesomeIcon icon={faUser} className="me-1" aria-hidden="true" />  {stepLabels[index]}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <form className="form" onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="row g-3">
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">Email</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="email"
                              type="email"
                              className={`form-control input-field form-control-lg bg-light  ${emailError && 'is-invalid'} `}
                              placeholder="Email"
                              value={email}
                              onChange={(event) => {
                                setEmail(event.target.value);
                              }}
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="password"
                              type={passwordVisibility ? 'password' : 'text'}
                              className={`form-control input-field form-control-lg bg-light  ${passwordError && 'is-invalid'} `}
                              placeholder="••••••"
                              value={password}
                              onChange={(event) => {
                                setPassword(event.target.value);
                              }}
                            />
                            <button
                              className="btn btn-password-toggle1"
                              type="button"
                              onClick={togglePasswordVisibility}
                            >
                              <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
                            </button>
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}

                          </div>

                          <div className="col-md-6">
                            <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="confirmpassword"
                              type={confirmpasswordVisibility ? 'password' : 'text'}
                              className={`form-control input-field form-control-lg bg-light  ${passwordMatchError && 'is-invalid'} `}
                              placeholder="••••••"
                              value={confirmPassword}
                              onChange={(event) => {
                                setConfirmPassword(event.target.value);
                              }}
                            />
                            <button
                              className="btn btn-password-toggle1"
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              <FontAwesomeIcon icon={confirmpasswordVisibility ? faEyeSlash : faEye} />
                            </button>

                            {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>}

                          </div>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Name</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className={`form-control input-field form-control-lg bg-light  ${nameError && 'is-invalid'} `}
                            placeholder="Name"
                            value={capitalizeName(name)}
                            onChange={(event) => {
                              setName(event.target.value);
                            }}
                          />
                          {nameError && <div className="text-danger">{nameError}</div>}

                        </div>

                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Contact</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="phone"
                            type="number"
                            className={`form-control input-field form-control-lg bg-light  ${contactError && 'is-invalid'} `}
                            placeholder="Phone Number"
                            value={contact}
                            onChange={(event) => {
                              setContact(event.target.value);
                            }}
                          />
                          {contactError && <div className="text-danger">{contactError}</div>}

                        </div>

                        <div className="col-md-6">
                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="dateOfBirth"
                            type="date"
                            value={dateOfBirth}
                            className={`form-control input-field form-control-lg bg-light  ${dobError && 'is-invalid'} `}
                            onChange={handleDateOfBirthChange}
                          />
                          {dobError && <div className="text-danger">{dobError}</div>}
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="age" className="form-label">Age</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="age"
                            type="number"
                            className="form-control input-field "
                            placeholder="Age"
                            value={age}
                            readOnly // Prevent user input
                          />
                        </div>

                        <div className="col-md-12 ">
                          <label className="form-label" htmlFor="gender">
                            Gender
                          </label>
                          <span style={{ color: 'red', marginLeft: '3px' }}>*</span> &nbsp;
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="male"
                              value="male"
                              checked={gender === "male"}
                              onChange={handleGenderChange}
                            />
                            <label className="form-check-label" htmlFor="male">
                              Male
                            </label>
                          </div>
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="female"
                              value="female"
                              checked={gender === "female"}
                              onChange={handleGenderChange}
                            />
                            <label className="form-check-label" htmlFor="female">
                              Female
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="other"
                              value="other"
                              checked={gender === "other"}
                              onChange={handleGenderChange}
                            />
                            <label className="form-check-label" htmlFor="other">
                              Other
                            </label>
                          </div>
                        </div>
                        {genderError && <div className="text-danger">{genderError}</div>}

                        <div className="col-md-6">
                          <label htmlFor="weight" className="form-label">Weight</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="weight"
                            type="number"
                            className={`form-control input-field form-control-lg bg-light ${weightError && 'is-invalid'} `}
                            placeholder="Weight"
                            value={weight}
                            onChange={(event) => {
                              setWeight(event.target.value);
                            }}
                          />
                          {weightError && <div className="text-danger">{weightError}</div>}

                        </div>
                        <div className="col-md-6">
                          <label htmlFor="height" className="form-label">Height</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="height"
                            type="text"
                            className={`form-control input-field form-control-lg bg-light ${heightError && 'is-invalid'} `}
                            placeholder="Height"
                            value={height}
                            onChange={(event) => {
                              setHeight(event.target.value);
                            }}
                          />
                          {heightError && <div className="text-danger">{heightError}</div>}

                        </div>


                        <div className="col-12">
                          <label htmlFor="address" className="form-label">Address</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <textarea
                            id="weight"
                            className={`form-control input-field form-control-lg bg-light ${addressError && 'is-invalid'} `}
                            placeholder="Address"
                            value={address}
                            onChange={(event) => {
                              setAddress(event.target.value);
                            }}
                          />
                          {addressError && <div className="text-danger">{addressError}</div>}

                        </div>
                        <div className="col-12 mt-5">
                          <button type="submit" className="btn btn-primary float-end" style={{ backgroundColor: '#1977cc' }}>Register</button>
                          <button type="button" className="btn btn-outline-secondary float-end me-2" onClick={handleClear}>Clear</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
