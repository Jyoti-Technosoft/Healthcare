import React, { useState } from 'react'
import { handlePatientRegistration } from './PatientDoctorAuthHelper';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UsersAuthHelper } from './UsersAuthHelper';


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
  const stepLabels = ["Personal details"];
  const roleCookie = Cookies.get('role');
  const totalSteps = 1;

  
  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const capitalizeName = (name) => {
    return name.toLowerCase().replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
  };
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    await UsersAuthHelper(email, password, 'Patient', name, contact, dateOfBirth, age, gender, address, '', '', '', weight, height, navigate);
    

  };
  return (

    <div className='banner_part'>
      <div className="container updateProfileContainer" style={{ fontSize: '14px' }}>
        <div className="row flex-lg-nowrap">
          <div className="col">
            <div className="row">
              <div className="col mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="col-12">
                      <h3 className="fw-normal text-secondary fs-4 mb-4">Register Patient</h3>
                    </div>
                    <ul className="nav nav-tabs mb-4">
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
                            {stepLabels[index]}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <form action="" onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="row g-3">
                          <div className="col-12">
                            <label htmlFor="email" className="form-label">Email</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="email"
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={email}
                              onChange={(event) => {
                                setEmail(event.target.value);
                              }}
                            />
                            {/* {emailError && <div className="invalid-feedback">{emailError}</div>} */}
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="password"
                              type="password"
                              className="form-control"
                              placeholder="Password"
                              value={password}
                              onChange={(event) => {
                                setPassword(event.target.value);
                              }}
                            />
                            {/* <button
                              className="btn btn-password-toggle"
                              type="button"
                              onClick={togglePasswordVisibility}
                            >
                              <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
                            </button>
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>} */}

                          </div>

                          <div className="col-md-6">
                            <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                            <input
                              id="confirmpassword"
                              type="password"
                              className="form-control"
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(event) => {
                                setConfirmPassword(event.target.value);
                              }}
                            />
                            {/* <button
                              className="btn btn-password-toggle"
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              <FontAwesomeIcon icon={confirmpasswordVisibility ? faEyeSlash : faEye} />
                            </button>

                            {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>} */}

                          </div>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Name</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={capitalizeName(name)}
                            onChange={(event) => {
                              setName(event.target.value);
                            }}
                          />
                          {/* {nameError && <div className="text-danger">{nameError}</div>} */}

                        </div>

                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Contact</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="phone"
                            type="number"
                            className="form-control"
                            placeholder="Phone Number"
                            value={contact}
                            onChange={(event) => {
                              setContact(event.target.value);
                            }}
                          />
                          {/* {contactError && <div className="text-danger">{contactError}</div>} */}

                        </div>

                        <div className="col-md-6">
                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="dateOfBirth"
                            type="date"
                            value={dateOfBirth}
                            className="form-control "
                            onChange={(event) => {
                              setDob(event.target.value);
                              setAge(calculateAge(event.target.value)); // Calculate age

                            }}
                          />
                          {/* {dobError && <div className="text-danger">{dobError}</div>} */}
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="age" className="form-label">Age</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="age"
                            type="number"
                            className="form-control form-control-lg bg-light fs-6"
                            placeholder="Age"
                            value={age}
                            readOnly // Prevent user input
                          />
                        </div>

                        <div className="col-12 d-flex align-items-center">
                          <label className="form-check-label me-3" htmlFor="gender">
                            Gender:
                          </label>
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

                        <div className="col-md-6">
                          <label htmlFor="weight" className="form-label">Weight</label>
                          <input
                            id="weight"
                            type="number"
                            className="form-control"
                            placeholder="Weight"
                            value={weight}
                            onChange={(event) => {
                              setWeight(event.target.value);
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="height" className="form-label">Height</label>
                          <input
                            id="height"
                            type="text"
                            className="form-control"
                            placeholder="Height"
                            value={height}
                            onChange={(event) => {
                              setHeight(event.target.value);
                            }}
                          />
                        </div>

                    
                        <div className="col-12">
                          <label htmlFor="address" className="form-label">Address</label>
                          <textarea
                            id="weight"
                            className="form-control"
                            placeholder="Address"
                            value={address}
                            onChange={(event) => {
                              setAddress(event.target.value);
                            }}
                          />
                        </div>
                        <div className="col-12 mt-5">
                          <button type="submit" className="btn btn-primary float-end">Register</button>
                          <button type="button" className="btn btn-outline-secondary float-end me-2">Cancel</button>
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
