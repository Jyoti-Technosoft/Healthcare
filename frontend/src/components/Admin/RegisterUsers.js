import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UsersAuthHelper, DoctorAuthHelper } from './UsersAuthHelper';
import { validateRequireEmail, validatePatternEmail, validateRequirePassword, validatePatternPassword, validateRequireName, validateRequireContact, validateRequireDob, validateRequireGender, validateRequireAddress, validateRequireWorkingDays, validateRequireShiftTime, validateRequireJoiningDate, validateRequireConsultancyCharge, calculateAge, validateRequireQualification, validateRequireDesignation, validateRequireSpeciality, validateRequireDepartment, validateRequireMorningTime, validateRequireEveningTime, validateRequireVisitingDays } from '../Validations';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveTab,
} from '../../actions/submenuActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [consultationCharge, setConsultationCharge] = useState("");
  const [morningTiming, setMorningTiming] = useState("");
  const [eveningTiming, setEveningTiming] = useState("");
  const [doctorImageData, setDoctorImageData] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState(true); // State to toggle password visibility
  const [confirmpasswordVisibility, setConfirmPasswordVisibility] = useState(true); // State to toggle password visibility
  const [selectedDays, setSelectedDays] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stepLabels = ["Account details", "Personal details", "Working details"];
  const roleCookie = Cookies.get('role');
  const totalSteps = 3; // Update with the total number of steps in your form

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [dayOfWorkError, setDayOfWorkError] = useState("");
  const [shiftTimeError, setShiftTimeError] = useState("");

  const [joiningDateError, setJoiningDateError] = useState("");
  const [qualificationError, setQualificationError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [specialityError, setSpecialityError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [consultancyError, setConsultancyError] = useState("");
  const [morningTimeError, setmorningTimeError] = useState("");
  const [eveningTimeError, setEveningTimeError] = useState("");
  const [visitingDaysError, setVisitingDaysError] = useState("");

  const setMenu = (submenu) => {
    if (submenu === 'usersList') {
      dispatch(setActiveTab('usersList'));
    }
  };

  const options = [
    { value: 'Monday-Saturday', label: 'Monday-Saturday' },
    { value: 'Monday-Friday', label: 'Monday-Friday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
  ];

  const handleChange = (selectedOptions) => {
    setSelectedDays(selectedOptions);
  };

  const handleNext = (event) => {

    if (step === 1) {
      event.preventDefault();
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
    } else if (step === 2 && (role === 'Receptionist' || role === 'Admin')) {
      setNameError("");
      setContactError("");
      setDobError("");
      setGenderError("");
      setAddressError("");
      event.preventDefault();
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
    } else if (step === 3 && (role === 'Receptionist' || role === 'Doctor')) {

      setDayOfWorkError("");
      setShiftTimeError("");

      setJoiningDateError("");
      setQualificationError("");
      setDesignationError("");
      setSpecialityError("");
      setDepartmentError("");
      setConsultancyError("");

      setmorningTimeError("");
      setEveningTimeError("");
      setVisitingDaysError("");
      event.preventDefault();

      const daysOfWorkRequireValidation = validateRequireWorkingDays(dayOfWorking);
      const shiftTimingRequireValidation = validateRequireShiftTime(shiftTime);

      const joiningDateRequireValidation = validateRequireJoiningDate(joiningDate);
      const qualificationRequireValidation = validateRequireQualification(qualification);
      const designationRequireValidation = validateRequireDesignation(designation);
      const specialitiesRequireValidation = validateRequireSpeciality(specialities);
      const departmentRequireValidation = validateRequireDepartment(department);
      const consultancyRequireValidation = validateRequireConsultancyCharge(consultationCharge);

      const morningTimeRequireValidation = validateRequireMorningTime(morningTiming);
      const eveningTimeRequireValidation = validateRequireEveningTime(eveningTiming);
      const selectedDaysRequireValidation = validateRequireVisitingDays(selectedDays);

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
      if (qualificationRequireValidation) {
        setQualificationError(qualificationRequireValidation);
        return;
      }
      if (designationRequireValidation) {
        setDesignationError(designationRequireValidation);
        return;
      }
      if (specialitiesRequireValidation) {
        setSpecialityError(specialitiesRequireValidation);
        return;
      }
      if (departmentRequireValidation) {
        setDepartmentError(departmentRequireValidation);
        return;
      }
      if (consultancyRequireValidation) {
        setConsultancyError(consultancyRequireValidation);
        return;
      }

      if (morningTimeRequireValidation) {
        setmorningTimeError(morningTimeRequireValidation);
        return;
      }
      if (eveningTimeRequireValidation) {
        setEveningTimeError(eveningTimeRequireValidation);
        return;
      }
      if (selectedDaysRequireValidation) {
        setVisitingDaysError(selectedDaysRequireValidation);
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

  const handleDateOfBirthChange = (event) => {
    const dob = event.target.value;
    setDob(dob); // Update date of birth state
    setAge(calculateAge(dob)); // Calculate and update age state
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
    try {
      if (role === 'Doctor') {
        let formattedSelectedDays = selectedDays.map(day => day.value).join(","); // Convert array to comma-separated string
        await DoctorAuthHelper(email, password, role, name, contact, dateOfBirth, age, gender, address, joiningDate, qualification, designation, specialities, department, morningTiming, eveningTiming, formattedSelectedDays, doctorImageData, consultationCharge, navigate);
      } else {
        await UsersAuthHelper(email, password, role, name, contact, dateOfBirth, age, gender, address, joiningDate, dayOfWorking, shiftTime, navigate);
      }
      // Clear form inputs
      clearFormInputs();
      toast.success('User register successfully');
      setStep(1);
    } catch (error) {
      toast.error('Failed to register user!');
    }
  };
  const clearFormInputs = () => {
    setName("");
    setContact("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setDob("");
    setAge("");
    setGender('');
    setAddress("");
    setJoiningDate("");
    setDayOfWorking("");
    setShiftTime("");
    setQualification("");
    setDesignation("");
    setSpecialities("");
    setDepartment("");
    setConsultationCharge("");
    setMorningTiming("");
    setEveningTiming("");
    setDoctorImageData(null);
    setSelectedDays([]);
  };

  return (
    <>
      <div className='background_part mt-3'>
        <div className="container">
          <div className="row flex-lg-nowrap">
            <div className="col">
              <div className="row">
                <div className="col mb-3">
                  <div className="card border-0 mb-3 shadow  bg-white rounded">
                    <div className="card-body">
                      <div className="">
                        <div className="">
                          <i className="bi bi-arrow-left"
                            style={{ fontSize: '25px', cursor: 'pointer', color: 'silver', fontWeight: 'bold', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s', marginLeft: '-10px' }}
                            onClick={() => setMenu('usersList')}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          ></i>
                          <div className="col-12 mt-3">
                            <h3 className="fw-normal text-secondary fs-4 text-uppercase mb-4"><b className='contentHeadings' style={{ color: 'black' }}>Register Users</b></h3>
                          </div>
                          {(role !== "Admin" || (role === "Admin" && step !== 3)) && step > 1 && (
                            <ul className="nav nav-tabs mb-4">
                              {[...Array(totalSteps).keys()].map((index) => (
                                (role === "Receptionist" || role === "Doctor") || index !== 2 ? (
                                  <li className="nav-item" key={index + 1}>
                                    <button
                                      className={`nav-link btn ${step === index + 1 ? 'active' : ''}`}
                                      onClick={() => {
                                        setStep(index + 1);
                                      }}
                                    >
                                      {stepLabels[index]}
                                    </button>
                                  </li>
                                ) : null
                              ))}
                            </ul>
                          )}
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
                                      className={`form-control input-field form-control-lg bg-light ${passwordError && 'is-invalid'} `}
                                      placeholder="Password"
                                      value={password}
                                      onChange={(event) => {
                                        setPassword(event.target.value);
                                      }}
                                    />
                                    <button
                                      className="btn btn-password-toggle1 mt-2"
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
                                      placeholder="Confirm Password"
                                      value={confirmPassword}
                                      onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                      }}
                                    />
                                    <button
                                      className="btn btn-password-toggle1 mt-2"
                                      type="button"
                                      onClick={toggleConfirmPasswordVisibility}
                                    >
                                      <FontAwesomeIcon icon={confirmpasswordVisibility ? faEyeSlash : faEye} />
                                    </button>

                                    {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>}

                                  </div>

                                  <div className="col-12">
                                    <label style={{ fontSize: '14px' }} for="exampleInputPassword1" className="form-label">Select Your role</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      className="form-select input-field form-control-lg bg-light "
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
                                      <option style={{ fontSize: '14px' }} value="Admin">Admin</option>
                                    </select>
                                  </div>

                                </div>
                              </>
                            )}
                            {step === 2 && (role === 'Receptionist' || role === 'Doctor' || role === 'Admin') && (
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
                                      className="form-control input-field form-control-lg bg-light "
                                      placeholder="Age"
                                      value={age}
                                      readOnly // Prevent user input
                                    />
                                  </div>

                                  <div className="col-12 d-flex align-items-center">
                                    <label className="form-label" htmlFor="gender">
                                      Gender
                                    </label>
                                    <span style={{ color: 'red', marginLeft: '3px' }}>*</span> &nbsp;&nbsp;&nbsp;&nbsp;
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
                                      className={`form-control input-field form-control-lg bg-light  ${addressError && 'is-invalid'} `}
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
                                          className="form-control input-field"
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

                            {step === 3 && (role === 'Receptionist') && (
                              <>
                                <div className="row g-3">
                                  <div className="col-md-6">
                                    <label htmlFor="joiningDate" className="form-label">Joining date</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <input
                                      id="joiningDate"
                                      type="date"
                                      value={joiningDate}
                                      className={`form-control input-field form-control-lg bg-light  ${joiningDateError && 'is-invalid'} `}
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
                                      className="form-select input-field"
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
                                      className="form-select input-field"
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

                            {step === 3 && (role === 'Doctor') && (
                              <>
                                <div className="row g-3">
                                  <div className="col-md-6">
                                    <label htmlFor="joiningDate" className="form-label">Joining date</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <input
                                      id="joiningDate"
                                      type="date"
                                      value={joiningDate}
                                      className={`form-control input-field form-control-lg bg-light  ${joiningDateError && 'is-invalid'} `}
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

                                      className={`form-select input-field form-control-lg bg-light  ${qualificationError && 'is-invalid'} `}
                                      value={qualification}
                                      onChange={(event) => setQualification(event.target.value)}
                                      style={{ fontSize: '14px' }}
                                    >
                                      <option value="" disabled>Select Qualification</option>
                                      <option value="Bachelor of Medicine">Bachelor of Medicine</option>
                                      <option value="Bachelor of Surgery (MBBS)"> Bachelor of Surgery (MBBS)</option>
                                    </select>
                                    {qualificationError && <div className="text-danger">{qualificationError}</div>}

                                  </div>

                                  <div className="col-md-6">
                                    <label htmlFor="designation" className="form-label">Designation</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      id="designation"
                                      className={`form-select input-field form-control-lg bg-light  ${designationError && 'is-invalid'} `}
                                      value={designation}
                                      onChange={(event) => setDesignation(event.target.value)}
                                      style={{ fontSize: '14px' }}
                                    >
                                      <option value="" disabled>Select Designation</option>
                                      <option value="Specialist/Specialty Physician">Specialist/Specialty Physician</option>
                                      <option value="Consultant"> Consultant</option>
                                    </select>
                                    {designationError && <div className="text-danger">{designationError}</div>}
                                  </div>

                                  <div className="col-md-6">
                                    <label htmlFor="speciality" className="form-label">Speciality</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      id="speciality"
                                      className={`form-select input-field form-control-lg bg-light  ${specialityError && 'is-invalid'} `}
                                      value={specialities}
                                      onChange={(event) => setSpecialities(event.target.value)}
                                      style={{ fontSize: '14px' }}
                                    >
                                      <option value="" disabled>Select Speciality</option>
                                      <option value="Pediatrics">Pediatrics</option>
                                      <option value="Surgery"> Surgery</option>
                                      <option value="Radiology"> Radiology</option>

                                    </select>
                                    {specialityError && <div className="text-danger">{specialityError}</div>}

                                  </div>
                                  <div className="col-md-6">
                                    <label htmlFor="department" className="form-label">Department</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      id="department"
                                      className={`form-select input-field form-control-lg bg-light  ${departmentError && 'is-invalid'} `}
                                      value={department}
                                      onChange={(event) => setDepartment(event.target.value)}
                                      style={{ fontSize: '14px' }}
                                    >
                                      <option value="" disabled>Select Department</option>
                                      <option value="Emergency Department (ED)">Emergency Department (ED)</option>
                                      <option value="Medical/Surgical"> Medical/Surgical</option>
                                      <option value="Orthopedics"> Orthopedics</option>
                                    </select>
                                    {departmentError && <div className="text-danger">{departmentError}</div>}

                                  </div>

                                  <div className="col-md-6">
                                    <label htmlFor="consultancyFees" className="form-label">Consultancy fees</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <input
                                      id="consultancyFees"
                                      type="text"
                                      className={`form-control input-field form-control-lg bg-light  ${consultancyError && 'is-invalid'} `}
                                      placeholder="Consultancy fees"
                                      value={consultationCharge}
                                      onChange={(event) => {
                                        setConsultationCharge(event.target.value);
                                      }}
                                    />
                                    {consultancyError && <div className="invalid-feedback">{consultancyError}</div>}
                                  </div>
                                </div>
                                <div className="row g-3 mt-1">
                                  <div className="col-md-6">
                                    <label htmlFor="morningTiming" className="form-label">Morning Timing</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      id="morningTiming"
                                      className={`form-select input-field form-control-lg bg-light  ${morningTimeError && 'is-invalid'} `}
                                      value={morningTiming}
                                      style={{ fontSize: '14px' }}
                                      onChange={(event) => setMorningTiming(event.target.value)}
                                    >
                                      <option value="" disabled>Select morning time</option>
                                      <option value="10:00 AM to 1:00 PM">10:00 AM to 1:00 PM</option>
                                      <option value="9:00 AM to 12:00 PM">9:00 AM to 12:00 PM</option>
                                      <option value="N/A">N/A</option>
                                      {/* Add more options for shift timings */}
                                    </select>
                                    {morningTimeError && <div className="invalid-feedback">{morningTimeError}</div>}

                                  </div>
                                  <div className="col-md-6">
                                    <label htmlFor="eveningTiming" className="form-label">Evening Timing</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <select
                                      id="eveningTiming"
                                      className={`form-select input-field form-control-lg bg-light  ${eveningTimeError && 'is-invalid'} `}
                                      value={eveningTiming}
                                      style={{ fontSize: '14px' }}
                                      onChange={(event) => setEveningTiming(event.target.value)}
                                    >
                                      <option value="" disabled>Select Evening time</option>
                                      <option value="2:00 PM to 6:00 PM">2:00 PM to 6:00 PM</option>
                                      <option value="1:00 AM to 5:00 PM">1:00 AM to 5:00 PM</option>
                                      <option value="N/A">N/A</option>
                                      {/* Add more options for shift timings */}
                                    </select>
                                    {eveningTimeError && <div className="invalid-feedback">{eveningTimeError}</div>}

                                  </div>
                                </div>
                                <div className="row g-3 mt-1">
                                  <div className="col-md-6">
                                    <label htmlFor="visitingDays" className="form-label">Visiting days</label>
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    <Select
                                      id="visitingDays"
                                      className={`${visitingDaysError && 'is-invalid'} `}
                                      value={selectedDays}
                                      onChange={handleChange}
                                      options={options}
                                      isMulti
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          border: 'none',
                                          borderBottom: '1px solid #1977cc',
                                          transition: 'border-bottom-color 0.3s ease-in-out',
                                          fontSize: '14px',
                                        }),
                                      }}
                                    />
                                    {visitingDaysError && <div className="invalid-feedback">{visitingDaysError}</div>}

                                  </div>
                                </div>
                              </>
                            )}
                            {/* Add more steps as needed */}

                            <div className="col-12 mt-5">
                              {step > 1 && (
                                <button type="button" className="btn btn-outline-secondary float-start me-2" onClick={handlePrevious}>Previous</button>
                              )}
                              {step === 2 && role === 'Admin' && (
                                <button type="submit" className="btn btn-primary float-end" style={{ backgroundColor: '#1977cc' }}>Register</button>
                              )}
                              {step === 2 && role !== 'Admin' && (
                                <button type="button" className="btn btn-primary float-end" onClick={handleNext} style={{ backgroundColor: '#1977cc' }}>Next</button>
                              )}
                              {step !== 2 && step !== totalSteps && (
                                <button type="button" className="btn btn-primary float-end" onClick={handleNext} style={{ backgroundColor: '#1977cc' }}>Next</button>
                              )}
                              {step === totalSteps && (
                                <button type="submit" className="btn btn-primary float-end" style={{ backgroundColor: '#1977cc' }}>Register</button>
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
        </div>
        <ToastContainer position="bottom-right" />
      </div>


    </>
  );
}
