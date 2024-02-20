import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UsersAuthHelper, DoctorAuthHelper } from './UsersAuthHelper';
import { validateRequireEmail, validatePatternEmail, validateRequirePassword, validatePatternPassword, validateRequireName, validateRequireContact, validateRequireDob, validateRequireGender, validateRequireAddress, validateRequireWorkingDays, validateRequireShiftTime, validateRequireJoiningDate } from '../Validations';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function RegisterUsers() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState("");
  const [step, setStep] = useState(1);
  const [joiningDate, setJoiningDate] = useState("");
  const [dayOfWorking, setDayOfWorking] = useState("");
  const [shiftTime, setShiftTime] = useState("");


  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [department, setDepartment] = useState("");
  const [morningTiming, setMorningTiming] = useState("");
  const [eveningTiming, setEveningTiming] = useState("");
  const [doctorImageData, setDoctorImageData] = useState(null);
  



  const [passwordVisibility, setPasswordVisibility] = useState(true); // State to toggle password visibility
  const [confirmpasswordVisibility, setConfirmPasswordVisibility] = useState(true); // State to toggle password visibility
  const navigate = useNavigate();
  const stepLabels = ["Account details", "Personal details", "Working details"];
  const roleCookie = Cookies.get('role');
  const totalSteps = 3; // Update with the total number of steps in your form


  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [joiningDateError, setJoiningDateError] = useState("");
  const [dayOfWorkError, setDayOfWorkError] = useState("");
  const [shiftTimeError, setShiftTimeError] = useState("");

  const handleNext = () => {

    if (step === 1) {
      setEmailError("");
      setPasswordError("");
      setPasswordMatchError("");
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
      if (password !== confirmPassword) {
        setPasswordMatchError("Passwords does not match");
        return;
      }
    } else if (step === 2 && role === 'Receptionist') {
      setNameError("");
      setContactError("");
      setDobError("");
      setGenderError("");
      setAddressError("");

      const nameRequireValidation = validateRequireName(name);
      const contactRequireValidation = validateRequireContact(contact);
      const dobRequireValidation = validateRequireDob(dateOfBirth);
      const genderRequireValidation = validateRequireGender(gender);
      const addressRequireValidation = validateRequireAddress(address);
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
    } else if (step === 3 && role === 'Receptionist') {
      setDayOfWorkError("");
      setShiftTimeError("");
      setJoiningDateError("");
      const daysOfWorkRequireValidation = validateRequireWorkingDays(dayOfWorking);
      const shiftTimingRequireValidation = validateRequireShiftTime(shiftTime);
      const joiningDateRequireValidation = validateRequireJoiningDate(joiningDate);
      if (daysOfWorkRequireValidation) {
        setDayOfWorkError(daysOfWorkRequireValidation);
        return;
      }
      if (shiftTimingRequireValidation) {
        setShiftTimeError(shiftTimingRequireValidation);
        return;
      }
      if (joiningDateRequireValidation) {
        setJoiningDateError(joiningDateRequireValidation);
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
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

  const capitalizeName = (name) => {
    return name.toLowerCase().replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmpasswordVisibility);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setDoctorImageData(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(role === 'Doctor'){
      await DoctorAuthHelper(email, password, role, name, contact, dateOfBirth, age, gender, address, joiningDate,qualification,designation,specialities,department,morningTiming,eveningTiming,doctorImageData,navigate);
    }else{
      await UsersAuthHelper(email, password, role, name, contact, dateOfBirth, age, gender, address, joiningDate, dayOfWorking, shiftTime, navigate);       
    }   
  };

  return (
    <>
      <div className='banner_part'>
        <div className="container registerPatientForm">
          <div className="row flex-lg-nowrap">
            <div className="col">
              <div className="row">
                <div className="col mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="col-12">
                        <h3 className="fw-normal text-secondary fs-4 text-uppercase mb-4">Register Users</h3>
                      </div>


                      <ul className="nav nav-tabs mb-4">
                        {[...Array(totalSteps).keys()].map((index) => (
                          <li className="nav-item" key={index + 1}>
                            <button
                              className={`nav-link btn ${step === index + 1 ? 'active' : ''}`}
                              onClick={() => {
                                if (role || index === 0) {
                                  setStep(index + 1);
                                }
                              }}
                              disabled={!role && index !== 0}
                            >
                              {stepLabels[index]}
                            </button>
                          </li>
                        ))}
                      </ul>


                      <form onSubmit={handleSubmit}>
                        {step === 1 && (
                          <>
                            {/* Step 1 */}
                            {/* Your Step 1 Form Fields */}
                            <div className="row g-3">
                              <div className="col-12">
                                <label htmlFor="email" className="form-label">Email</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <input
                                  id="email"
                                  type="email"
                                  className={`form-control form-control-lg bg-light fs-6 ${emailError && 'is-invalid'} `}
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
                                  className={`form-control form-control-lg bg-light fs-6 ${passwordError && 'is-invalid'} `}
                                  placeholder="Password"
                                  value={password}
                                  onChange={(event) => {
                                    setPassword(event.target.value);
                                  }}
                                />
                                <button
                                  className="btn btn-password-toggle"
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
                                  className={`form-control form-control-lg bg-light fs-6 ${passwordMatchError && 'is-invalid'} `}
                                  placeholder="Confirm Password"
                                  value={confirmPassword}
                                  onChange={(event) => {
                                    setConfirmPassword(event.target.value);
                                  }}
                                />
                                <button
                                  className="btn btn-password-toggle"
                                  type="button"
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  <FontAwesomeIcon icon={confirmpasswordVisibility ? faEyeSlash : faEye} />
                                </button>

                                {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>}

                              </div>

                              <div className="col-12">
                                <label style={{ fontSize: '14px' }} for="exampleInputPassword1" >Select Your role</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  className="form-select form-control-lg bg-light fs-6"
                                  id="role"
                                  aria-label="Default select example"

                                  value={role}
                                  onChange={(e) => {
                                    setRole(e.target.value);
                                  }}
                                >
                                  <option style={{ fontSize: '14px' }} value="" disabled>Select role</option>
                                  <option style={{ fontSize: '14px' }} value="Doctor">Doctor</option>
                                  <option style={{ fontSize: '14px' }} value="Receptionist">Receptionist</option>
                                  <option style={{ fontSize: '14px' }} value="Super Admin">Super Admin</option>
                                </select>
                              </div>

                            </div>
                          </>
                        )}
                        {step === 2 && (role === 'Receptionist' || role === 'Doctor') && (
                          <>
                            {/* Step 2 */}
                            {/* Your Step 2 Form Fields for Receptionist */}
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label htmlFor="name" className="form-label">Name</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <input
                                  id="name"
                                  type="text"
                                  className={`form-control form-control-lg bg-light fs-6 ${nameError && 'is-invalid'} `}
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
                                  className={`form-control form-control-lg bg-light fs-6 ${contactError && 'is-invalid'} `}
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
                                  className={`form-control form-control-lg bg-light fs-6 ${dobError && 'is-invalid'} `}
                                  onChange={(event) => {
                                    setDob(event.target.value);
                                    setAge(calculateAge(event.target.value)); // Calculate age

                                  }}
                                />
                                {dobError && <div className="text-danger">{dobError}</div>}
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
                                <span style={{ color: 'red' }}>*</span>
                                <div className="form-check me-2">
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

                              <div className="col-12">
                                <label htmlFor="address" className="form-label">Address</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <textarea
                                  id="address"
                                  className={`form-control form-control-lg bg-light fs-6 ${addressError && 'is-invalid'} `}
                                  placeholder="Address"
                                  value={address}
                                  onChange={(event) => {
                                    setAddress(event.target.value);
                                  }}
                                />
                                {addressError && <div className="text-danger">{addressError}</div>}

                              </div>
                              {role === 'Doctor' && (
                                <>
                                  <div className="col-md-4">
                                    <label htmlFor="image" className="form-label">Upload image</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <input
                                      type="file"
                                      className="form-control"
                                      id="imageUpload"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}

                        {step === 3 && role === 'Receptionist' && (
                          <>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label htmlFor="joiningDate" className="form-label">Joining date</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <input
                                  id="joiningDate"
                                  type="date"
                                  value={joiningDate}
                                  className={`form-control form-control-lg bg-light fs-6 ${joiningDateError && 'is-invalid'} `}
                                  onChange={(event) => {
                                    setJoiningDate(event.target.value);
                                  }}
                                />
                                {joiningDateError && <div className="text-danger">{joiningDateError}</div>}
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="dayOfWorking" className="form-label">Days of Working</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="dayOfWorking"
                                  className="form-select"
                                  value={dayOfWorking}
                                  onChange={(event) => setDayOfWorking(event.target.value)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <option value="" disabled>Select days of working</option>
                                  <option value="Monday - Sunday">Monday - Sunday</option>
                                  <option value="Monday - Saturday">Monday - Saturday</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="shiftTiming" className="form-label">Shift Timing</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="shiftTiming"
                                  className="form-select"
                                  value={shiftTime}
                                  style={{ fontSize: '14px' }}
                                  onChange={(event) => setShiftTime(event.target.value)}
                                >
                                  <option value="" disabled>Select shift time</option>
                                  <option value="8am-12pm">8:00 AM - 12:00 PM</option>
                                  <option value="9am-1pm">9:00 AM - 1:00 PM</option>
                                  <option value="10am-3pm">10:00 AM - 3:00 PM</option>
                                  {/* Add more options for shift timings */}
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {step === 3 && role === 'Doctor' && (
                          <>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label htmlFor="joiningDate" className="form-label">Joining date</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <input
                                  id="joiningDate"
                                  type="date"
                                  value={joiningDate}
                                  className={`form-select form-control-lg bg-light fs-6 ${joiningDateError && 'is-invalid'} `}
                                  onChange={(event) => {
                                    setJoiningDate(event.target.value);
                                  }}
                                />
                                {joiningDateError && <div className="text-danger">{joiningDateError}</div>}
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="qualification" className="form-label">Qualification</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="qualification"
                                  className="form-select"
                                  value={qualification}
                                  onChange={(event) => setQualification(event.target.value)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <option value="" disabled>Select Qualification</option>
                                  <option value="Bachelor of Medicine">Bachelor of Medicine</option>
                                  <option value="Bachelor of Surgery (MBBS)"> Bachelor of Surgery (MBBS)</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="designation" className="form-label">Designation</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="designation"
                                  className="form-select"
                                  value={designation}
                                  onChange={(event) => setDesignation(event.target.value)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <option value="" disabled>Select Designation</option>
                                  <option value="Specialist/Specialty Physician">Specialist/Specialty Physician</option>
                                  <option value="Consultant"> Consultant</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="speciality" className="form-label">Speciality</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="speciality"
                                  className="form-select"
                                  value={specialities}
                                  onChange={(event) => setSpecialities(event.target.value)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <option value="" disabled>Select Speciality</option>
                                  <option value="Pediatrics">Pediatrics</option>
                                  <option value="Surgery"> Surgery</option>
                                  <option value="Radiology"> Radiology</option>

                                </select>
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="department" className="form-label">Department</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="department"
                                  className="form-select"
                                  value={department}
                                  onChange={(event) => setDepartment(event.target.value)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <option value="" disabled>Select Department</option>
                                  <option value="Emergency Department (ED)">Emergency Department (ED)</option>
                                  <option value="Medical/Surgical"> Medical/Surgical</option>
                                  <option value="Orthopedics"> Orthopedics</option>

                                </select>
                              </div>


                            </div>
                            <div className="row g-3 mt-1">
                              <div className="col-md-6">
                                <label htmlFor="morningTiming" className="form-label">Morning Timing</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="morningTiming"
                                  className="form-select"
                                  value={morningTiming}
                                  style={{ fontSize: '14px' }}
                                  onChange={(event) => setMorningTiming(event.target.value)}
                                >
                                  <option value="" disabled>Select morning time</option>
                                  <option value="10:00 AM to 1:30 PM">10:00 AM to 1:30 PM</option>
                                  <option value="9:00 AM to 1:00 PM">9:00 AM to 12:30 PM</option>
                                  <option value="N/A">N/A</option>
                                  {/* Add more options for shift timings */}
                                </select>
                              </div>


                              <div className="col-md-6">
                                <label htmlFor="eveningTiming" className="form-label">Evening Timing</label>
                                <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                <select
                                  id="eveningTiming"
                                  className="form-select"
                                  value={eveningTiming}
                                  style={{ fontSize: '14px' }}
                                  onChange={(event) => setEveningTiming(event.target.value)}
                                >
                                  <option value="" disabled>Select Evening time</option>
                                  <option value="2:30 PM to 6:00 PM">2:30 PM to 6:00 PM</option>
                                  <option value="9:00 AM to 1:00 PM">1:30 AM to 5:00 PM</option>
                                  <option value="N/A">N/A</option>
                                  {/* Add more options for shift timings */}
                                </select>
                              </div>
                            </div>
                          </>
                        )}
                        {/* Add more steps as needed */}

                        <div className="col-12 mt-5">
                          {step > 1 && (
                            <button type="button" className="btn btn-outline-secondary float-start me-2" onClick={handlePrevious}>Previous</button>
                          )}
                          {step < totalSteps && (
                            <button type="button" className="btn btn-primary float-end" onClick={handleNext}>Next</button>
                          )}
                          {step === totalSteps && (
                            <button type="submit" className="btn btn-primary float-end">Register</button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
