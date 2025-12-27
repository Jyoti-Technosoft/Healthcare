import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersAuthHelper, DoctorAuthHelper } from "./UsersAuthHelper";
import {
  validateRequireEmail,
  validatePatternEmail,
  validateRequirePassword,
  validatePatternPassword,
  validateRequireName,
  validateRequireContact,
  validateRequireDob,
  validateRequireAddress,
  validateRequireWorkingDays,
  validateRequireShiftTime,
  validateRequireJoiningDate,
  validateRequireConsultancyCharge,
  calculateAge,
  validateRequireQualification,
  validateRequireDesignation,
  validateRequireSpeciality,
  validateRequireDepartment,
  validateRequireMorningTime,
  validateRequireEveningTime,
  validateRequireVisitingDays,
} from "../Validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the new CSS file (Make sure to save the CSS provided below as RegisterUsers.css)
import "../../assets/css/Admin/registerUser.css";

export default function RegisterUsers() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmpasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stepLabels = ["Account details", "Personal details", "Working details"];
  const totalSteps = 3;

  // Error States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");

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
    if (submenu === "usersList") {
      dispatch(setActiveTab("usersList"));
    }
  };

  const options = [
    { value: "Monday-Saturday", label: "Monday-Saturday" },
    { value: "Monday-Friday", label: "Monday-Friday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
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
    } else if (step === 2 && (role === "Receptionist" || role === "Admin")) {
      setNameError("");
      setContactError("");
      setDobError("");
      setGenderError("");
      setAddressError("");
      event.preventDefault();
      const nameRequireValidation = validateRequireName(name);
      const contactRequireValidation = validateRequireContact(contact);
      const dobRequireValidation = validateRequireDob(dateOfBirth);
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
        setGenderError("Please select a gender");
        return;
      }
      if (addressRequireValidation) {
        setAddressError(addressRequireValidation);
        return;
      }
    } else if (step === 3 && (role === "Receptionist" || role === "Doctor")) {
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

      const daysOfWorkRequireValidation =
        validateRequireWorkingDays(dayOfWorking);
      const shiftTimingRequireValidation = validateRequireShiftTime(shiftTime);
      const joiningDateRequireValidation =
        validateRequireJoiningDate(joiningDate);
      const qualificationRequireValidation =
        validateRequireQualification(qualification);
      const designationRequireValidation =
        validateRequireDesignation(designation);
      const specialitiesRequireValidation =
        validateRequireSpeciality(specialities);
      const departmentRequireValidation = validateRequireDepartment(department);
      const consultancyRequireValidation =
        validateRequireConsultancyCharge(consultationCharge);
      const morningTimeRequireValidation =
        validateRequireMorningTime(morningTiming);
      const eveningTimeRequireValidation =
        validateRequireEveningTime(eveningTiming);
      const selectedDaysRequireValidation =
        validateRequireVisitingDays(selectedDays);

      if (daysOfWorkRequireValidation) return;
      if (shiftTimingRequireValidation) return;
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
    setDob(dob);
    setAge(calculateAge(dob));
  };

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
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
      if (role === "Doctor") {
        let formattedSelectedDays = selectedDays
          .map((day) => day.value)
          .join(",");
        await DoctorAuthHelper(
          email,
          password,
          role,
          name,
          contact,
          dateOfBirth,
          age,
          gender,
          address,
          joiningDate,
          qualification,
          designation,
          specialities,
          department,
          morningTiming,
          eveningTiming,
          formattedSelectedDays,
          doctorImageData,
          consultationCharge,
          navigate
        );
      } else {
        await UsersAuthHelper(
          email,
          password,
          role,
          name,
          contact,
          dateOfBirth,
          age,
          gender,
          address,
          joiningDate,
          dayOfWorking,
          shiftTime,
          navigate
        );
      }
      clearFormInputs();
      toast.success("User register successfully");
      setStep(1);
    } catch (error) {
      toast.error("Failed to register user!");
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
    setGender("");
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
    <div className="background_part">
      <div className="register-card">
        {/* Back Button (Using same class as reference but with Icon) */}
        <div className="register-back-btn" onClick={() => setMenu("usersList")}>
          <i
            className="bi bi-arrow-left"
            style={{ fontSize: "20px", color: "#373737" }}
          ></i>
        </div>

        <h3 className="register-title">REGISTER USERS</h3>

        <div style={{ marginTop: "20px" }}>
          {/* Tabs */}
          {(role !== "Admin" || (role === "Admin" && step !== 3)) &&
            step > 1 && (
              <ul
                className="nav nav-tabs mb-4"
                style={{ borderBottom: "1px solid #e0e0e0" }}
              >
                {[...Array(totalSteps).keys()].map((index) =>
                  role === "Receptionist" ||
                  role === "Doctor" ||
                  index !== 2 ? (
                    <li className="nav-item" key={index + 1}>
                      <button
                        className={`nav-link ${
                          step === index + 1 ? "active" : ""
                        }`}
                        style={{
                          color: step === index + 1 ? "#0150B5" : "#6c757d",
                          fontWeight: step === index + 1 ? "600" : "400",
                          border: "none",
                          borderBottom:
                            step === index + 1 ? "2px solid #0150B5" : "none",
                          background: "transparent",
                        }}
                        onClick={() => {
                          setStep(index + 1);
                        }}
                      >
                        {stepLabels[index]}
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
            )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: ACCOUNT DETAILS */}
            {step === 1 && (
              <>
                <div
                  className="form-grid-full"
                  style={{ marginBottom: "20px" }}
                >
                  <label htmlFor="email" className="form-label">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control input-field ${
                      emailError && "is-invalid"
                    }`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <div className="form-grid">
                  <div>
                    <label htmlFor="password" className="form-label">
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="password"
                        type={passwordVisibility ? "password" : "text"}
                        className={`form-control input-field ${
                          passwordError && "is-invalid"
                        }`}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ borderRight: "none" }}
                      />
                      <span
                        className="input-group-text bg-white"
                        style={{
                          borderLeft: "none",
                          borderColor: "#D9D9D9",
                          cursor: "pointer",
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={passwordVisibility ? faEyeSlash : faEye}
                          color="#6c757d"
                        />
                      </span>
                    </div>
                    {passwordError && (
                      <div className="invalid-feedback d-block">
                        {passwordError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmpassword" className="form-label">
                      Confirm Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="confirmpassword"
                        type={confirmpasswordVisibility ? "password" : "text"}
                        className={`form-control input-field ${
                          passwordMatchError && "is-invalid"
                        }`}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ borderRight: "none" }}
                      />
                      <span
                        className="input-group-text bg-white"
                        style={{
                          borderLeft: "none",
                          borderColor: "#D9D9D9",
                          cursor: "pointer",
                        }}
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={confirmpasswordVisibility ? faEyeSlash : faEye}
                          color="#6c757d"
                        />
                      </span>
                    </div>
                    {passwordMatchError && (
                      <div
                        className="text-danger mt-2"
                        style={{ fontSize: "13px" }}
                      >
                        {passwordMatchError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-grid-full" style={{ marginTop: "20px" }}>
                  <label htmlFor="role" className="form-label">
                    Select Your Role <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-select input-field"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="Doctor">Doctor</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 2: PERSONAL DETAILS */}
            {step === 2 &&
              (role === "Receptionist" ||
                role === "Doctor" ||
                role === "Admin") && (
                <>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`form-control input-field ${
                          nameError && "is-invalid"
                        }`}
                        placeholder="Name"
                        value={capitalizeName(name)}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {nameError && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "13px" }}
                        >
                          {nameError}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        Contact <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        id="phone"
                        type="number"
                        className={`form-control input-field ${
                          contactError && "is-invalid"
                        }`}
                        placeholder="Phone Number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                      {contactError && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "13px" }}
                        >
                          {contactError}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        className={`form-control input-field ${
                          dobError && "is-invalid"
                        }`}
                        value={dateOfBirth}
                        onChange={handleDateOfBirthChange}
                      />
                      {dobError && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "13px" }}
                        >
                          {dobError}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="age" className="form-label">
                        Age <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        id="age"
                        type="number"
                        className="form-control input-field"
                        placeholder="Age"
                        value={age}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-grid-full" style={{ marginTop: "20px" }}>
                    <label className="form-label">
                      Gender <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="male"
                          value="male"
                          checked={gender === "male"}
                          onChange={handleGenderChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="male"
                          style={{ fontFamily: "Roboto", fontSize: "15px" }}
                        >
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="female"
                          value="female"
                          checked={gender === "female"}
                          onChange={handleGenderChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="female"
                          style={{ fontFamily: "Roboto", fontSize: "15px" }}
                        >
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
                        <label
                          className="form-check-label"
                          htmlFor="other"
                          style={{ fontFamily: "Roboto", fontSize: "15px" }}
                        >
                          Other
                        </label>
                      </div>
                    </div>
                    {genderError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {genderError}
                      </div>
                    )}
                  </div>

                  <div className="form-grid-full" style={{ marginTop: "20px" }}>
                    <label htmlFor="address" className="form-label">
                      Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      id="address"
                      className={`form-control input-field ${
                        addressError && "is-invalid"
                      }`}
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ height: "80px" }}
                    />
                    {addressError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {addressError}
                      </div>
                    )}
                  </div>

                  {role === "Doctor" && (
                    <div
                      className="form-grid-full"
                      style={{ marginTop: "20px" }}
                    >
                      <label htmlFor="imageUpload" className="form-label">
                        Upload Image <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control input-field"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ paddingTop: "8px" }}
                      />
                    </div>
                  )}
                </>
              )}

            {/* STEP 3: WORKING DETAILS - RECEPTIONIST */}
            {step === 3 && role === "Receptionist" && (
              <div className="form-grid">
                <div>
                  <label htmlFor="joiningDate" className="form-label">
                    Joining Date <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="joiningDate"
                    type="date"
                    className={`form-control input-field ${
                      joiningDateError && "is-invalid"
                    }`}
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                  />
                  {joiningDateError && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      {joiningDateError}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="dayOfWorking" className="form-label">
                    Days of Working <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="dayOfWorking"
                    className="form-select input-field"
                    value={dayOfWorking}
                    onChange={(e) => setDayOfWorking(e.target.value)}
                  >
                    <option value="" disabled>
                      Select days
                    </option>
                    <option value="Monday - Sunday">Monday - Sunday</option>
                    <option value="Monday - Saturday">Monday - Saturday</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="shiftTiming" className="form-label">
                    Shift Timing <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="shiftTiming"
                    className="form-select input-field"
                    value={shiftTime}
                    onChange={(e) => setShiftTime(e.target.value)}
                  >
                    <option value="" disabled>
                      Select shift time
                    </option>
                    <option value="8am-12pm">8:00 AM - 12:00 PM</option>
                    <option value="9am-1pm">9:00 AM - 1:00 PM</option>
                    <option value="10am-3pm">10:00 AM - 3:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: WORKING DETAILS - DOCTOR */}
            {step === 3 && role === "Doctor" && (
              <>
                <div className="form-grid">
                  <div>
                    <label htmlFor="joiningDate" className="form-label">
                      Joining Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      id="joiningDate"
                      type="date"
                      className={`form-control input-field ${
                        joiningDateError && "is-invalid"
                      }`}
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                    {joiningDateError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {joiningDateError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="qualification" className="form-label">
                      Qualification <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="qualification"
                      className={`form-select input-field ${
                        qualificationError && "is-invalid"
                      }`}
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Qualification
                      </option>
                      <option value="Bachelor of Medicine">
                        Bachelor of Medicine
                      </option>
                      <option value="Bachelor of Surgery (MBBS)">
                        {" "}
                        Bachelor of Surgery (MBBS)
                      </option>
                    </select>
                    {qualificationError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {qualificationError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="designation" className="form-label">
                      Designation <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="designation"
                      className={`form-select input-field ${
                        designationError && "is-invalid"
                      }`}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Designation
                      </option>
                      <option value="Specialist/Specialty Physician">
                        Specialist/Specialty Physician
                      </option>
                      <option value="Consultant"> Consultant</option>
                    </select>
                    {designationError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {designationError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="speciality" className="form-label">
                      Speciality <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="speciality"
                      className={`form-select input-field ${
                        specialityError && "is-invalid"
                      }`}
                      value={specialities}
                      onChange={(e) => setSpecialities(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Speciality
                      </option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Surgery"> Surgery</option>
                      <option value="Radiology"> Radiology</option>
                    </select>
                    {specialityError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {specialityError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="department" className="form-label">
                      Department <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="department"
                      className={`form-select input-field ${
                        departmentError && "is-invalid"
                      }`}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      <option value="Emergency Department (ED)">
                        Emergency Department (ED)
                      </option>
                      <option value="Medical/Surgical">
                        {" "}
                        Medical/Surgical
                      </option>
                      <option value="Orthopedics"> Orthopedics</option>
                    </select>
                    {departmentError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "13px" }}
                      >
                        {departmentError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="consultancyFees" className="form-label">
                      Consultancy Fees <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      id="consultancyFees"
                      type="text"
                      className={`form-control input-field ${
                        consultancyError && "is-invalid"
                      }`}
                      placeholder="Fees"
                      value={consultationCharge}
                      onChange={(e) => setConsultationCharge(e.target.value)}
                    />
                    {consultancyError && (
                      <div className="invalid-feedback">{consultancyError}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="morningTiming" className="form-label">
                      Morning Timing <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="morningTiming"
                      className={`form-select input-field ${
                        morningTimeError && "is-invalid"
                      }`}
                      value={morningTiming}
                      onChange={(e) => setMorningTiming(e.target.value)}
                    >
                      <option value="" disabled>
                        Select time
                      </option>
                      <option value="10:00 AM to 1:00 PM">
                        10:00 AM to 1:00 PM
                      </option>
                      <option value="9:00 AM to 12:00 PM">
                        9:00 AM to 12:00 PM
                      </option>
                      <option value="N/A">N/A</option>
                    </select>
                    {morningTimeError && (
                      <div className="invalid-feedback">{morningTimeError}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="eveningTiming" className="form-label">
                      Evening Timing <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="eveningTiming"
                      className={`form-select input-field ${
                        eveningTimeError && "is-invalid"
                      }`}
                      value={eveningTiming}
                      onChange={(e) => setEveningTiming(e.target.value)}
                    >
                      <option value="" disabled>
                        Select time
                      </option>
                      <option value="2:00 PM to 6:00 PM">
                        2:00 PM to 6:00 PM
                      </option>
                      <option value="1:00 AM to 5:00 PM">
                        1:00 AM to 5:00 PM
                      </option>
                      <option value="N/A">N/A</option>
                    </select>
                    {eveningTimeError && (
                      <div className="invalid-feedback">{eveningTimeError}</div>
                    )}
                  </div>
                </div>

                <div className="form-grid-full" style={{ marginTop: "20px" }}>
                  <label htmlFor="visitingDays" className="form-label">
                    Visiting Days <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="visitingDays"
                    className={`${visitingDaysError && "is-invalid"} `}
                    value={selectedDays}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "1px solid #D9D9D9",
                        borderRadius: "6px",
                        minHeight: "44px",
                        fontSize: "15px",
                        fontFamily: "Roboto, sans-serif",
                        boxShadow: "none",
                      }),
                    }}
                  />
                  {visitingDaysError && (
                    <div className="invalid-feedback d-block">
                      {visitingDaysError}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* BUTTONS ROW */}
            <div
              className="d-flex justify-content-between align-items-center mt-4 pt-3"
              style={{ borderTop: "1px solid #f0f0f0" }}
            >
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    className="register-btn"
                    onClick={handlePrevious}
                    style={{
                      background: "#6c757d",
                      color: "#fff",
                      width: "140px",
                      margin: 0,
                    }}
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {step === 2 && role === "Admin" ? (
                  <button
                    type="submit"
                    className="register-btn"
                    style={{ margin: 0 }}
                  >
                    Register
                  </button>
                ) : step !== 2 && step !== totalSteps ? (
                  <button
                    type="button"
                    className="register-btn"
                    onClick={handleNext}
                    style={{ margin: 0 }}
                  >
                    Next
                  </button>
                ) : step === 2 && role !== "Admin" ? (
                  <button
                    type="button"
                    className="register-btn"
                    onClick={handleNext}
                    style={{ margin: 0 }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="register-btn"
                    style={{ margin: 0 }}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
