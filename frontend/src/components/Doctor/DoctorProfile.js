import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { updateDoctorProfileApi, getDoctorsWithIdApi } from "../Api";
import {
  validateRequireEmail,
  validatePatternEmail,
  validateRequirePassword,
  validatePatternPassword,
  validateRequireName,
  validateRequireContact,
  validateRequireDob,
  validateRequireAddress,
} from "../Validations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Make sure to import the CSS file
import "../../assets/css/Doctor/DoctorProfile.css";

export default function DoctorProfile() {
  const userId = Cookies.get("userId");
  const authToken = Cookies.get("authToken");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordVisibility, setCurrentPasswordVisibility] =
    useState(true);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [department, setDepartment] = useState("");
  const [morningTime, setMorningTime] = useState("");
  const [eveningTiming, setEveningTiming] = useState("");
  const [visitingDays, setVisitingDays] = useState("");

  // Error States
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Kept original logic, but adapted UI to buttons (see JSX)
  const handleGenderChange = (val) => {
    setGender(val);
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisibility(!currentPasswordVisibility);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisibility(!newPasswordVisibility);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getDoctorsWithIdApi(userId, authToken);
        setEmail(userData.user.email);
        setDoctorId(userData.id);
        setName(userData.name);
        setRole(userData.user.role);
        setContact(userData.contact);
        const formattedJoiningDate = format(
          new Date(userData.joiningDate),
          "dd MMM yyyy"
        );
        setJoiningDate(formattedJoiningDate);
        setDob(userData.dateOfBirth);
        setAge(userData.age);
        setGender(userData.gender);
        setAddress(userData.address);
        setQualification(userData.qualification);
        setDesignation(userData.designation);
        setSpecialities(userData.specialities);
        setDepartment(userData.department);
        setMorningTime(userData.morningTiming);
        setEveningTiming(userData.eveningTiming);
        setVisitingDays(userData.visitingDays);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");
    setNameError("");
    setContactError("");
    setDobError("");
    setGenderError("");
    setAddressError("");
    setCurrentPasswordError("");

    const emailRequireValidation = validateRequireEmail(email);
    const emailPatternValidation = validatePatternEmail(email);
    const passwordRequireValidation = validateRequirePassword(password);
    const passwordPatternValidation = validatePatternPassword(password);
    const nameRequireValidation = validateRequireName(name);
    const contactRequireValidation = validateRequireContact(contact);
    const dobRequireValidation = validateRequireDob(dateOfBirth);
    const addressRequireValidation = validateRequireAddress(address);

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
      setGenderError("Please select a gender");
      return;
    }
    if (addressRequireValidation) {
      setAddressError(addressRequireValidation);
      return;
    }

    try {
      await updateDoctorProfileApi(
        doctorId,
        email,
        currentPassword,
        password,
        name,
        contact,
        gender,
        dateOfBirth,
        address,
        age
      );
      toast.success("Profile updated successfully");
      setEditMode(false); // Exit edit mode on success
    } catch (error) {
      toast.error("Failed to update profile");
      // Assuming API error related to current password validation could be caught here
      // setErrors({ currentPassword: "Invalid current password" }); // Adapted from receptionist logic
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-title-row">
          <h3>Doctor Profile</h3>
        </div>

        <hr className="divider-line" />

        {/* Info Tag */}
        <div className="role-info">
          <span className="role-badge">{role}</span>
          <span className="join-date">Joined on {joiningDate}</span>
        </div>

        {/* Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Details Section */}
            <div className="form-full">
              <h6
                style={{
                  color: "#0150b5",
                  fontWeight: "600",
                  marginTop: "10px",
                }}
              >
                Personal Details
              </h6>
            </div>

            <div>
              <label>
                Name <span className="req">*</span>
              </label>
              <input
                className={nameError ? "input error" : "input"}
                value={capitalizeName(name)}
                readOnly={!editMode}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              {nameError && <p className="error-text">{nameError}</p>}
            </div>

            <div>
              <label>
                Contact <span className="req">*</span>
              </label>
              <input
                type="number"
                className={contactError ? "input error" : "input"}
                value={contact}
                readOnly={!editMode}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone Number"
              />
              {contactError && <p className="error-text">{contactError}</p>}
            </div>

            <div>
              <label>
                Date of Birth <span className="req">*</span>
              </label>
              <input
                type="date"
                className={dobError ? "input error" : "input"}
                value={dateOfBirth}
                readOnly={!editMode}
                onChange={(e) => {
                  setDob(e.target.value);
                  setAge(calculateAge(e.target.value));
                }}
              />
              {dobError && <p className="error-text">{dobError}</p>}
            </div>

            <div>
              <label>
                Age <span className="req">*</span>
              </label>
              <input
                type="number"
                className="input"
                value={age}
                readOnly
                placeholder="Age"
              />
            </div>

            {/* Gender Toggle */}
            <div className="form-full">
              <label>
                Gender <span className="req">*</span>
              </label>
              <div className="gender-toggle">
                {["male", "female", "other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    disabled={!editMode}
                    className={`gender-btn ${gender === g ? "active" : ""}`}
                    onClick={() => handleGenderChange(g)}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
              {genderError && <p className="error-text">{genderError}</p>}
            </div>

            <div className="form-full">
              <label>
                Address <span className="req">*</span>
              </label>
              <textarea
                className={addressError ? "input error" : "input"}
                value={address}
                readOnly={!editMode}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
              {addressError && <p className="error-text">{addressError}</p>}
            </div>

            {/* Work Details Section */}
            <div className="form-full">
              <hr className="divider-line" style={{ margin: "20px 0" }} />
              <h6 style={{ color: "#0150b5", fontWeight: "600" }}>
                Work Details
              </h6>
            </div>

            <div>
              <label>Qualification</label>
              <input
                className="input"
                value={qualification}
                readOnly
                placeholder="Qualification"
              />
            </div>

            <div>
              <label>Designation</label>
              <input
                className="input"
                value={designation}
                readOnly
                placeholder="Designation"
              />
            </div>

            <div>
              <label>Specialities</label>
              <input
                className="input"
                value={specialities}
                readOnly
                placeholder="Specialities"
              />
            </div>

            <div>
              <label>Department</label>
              <input
                className="input"
                value={department}
                readOnly
                placeholder="Department"
              />
            </div>

            <div>
              <label>Morning Time</label>
              <input
                className="input"
                value={morningTime}
                readOnly
                placeholder="Morning time"
              />
            </div>

            <div>
              <label>Evening Time</label>
              <input
                className="input"
                value={eveningTiming}
                readOnly
                placeholder="Evening time"
              />
            </div>

            <div className="form-full">
              <label>Visiting Days</label>
              <input
                className="input"
                value={visitingDays}
                readOnly
                placeholder="Visiting Days"
              />
            </div>

            {/* Account Details Section */}
            <div className="form-full">
              <hr className="divider-line" style={{ margin: "20px 0" }} />
              <h6 style={{ color: "#0150b5", fontWeight: "600" }}>
                Account Details
              </h6>
            </div>

            <div>
              <label>
                Email <span className="req">*</span>
              </label>
              <input
                type="email"
                className={emailError ? "input error" : "input"}
                value={email}
                readOnly={!editMode}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              {emailError && <p className="error-text">{emailError}</p>}
            </div>

            <div>
              <label>
                Current Password <span className="req">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={currentPasswordVisibility ? "password" : "text"}
                  className={currentPasswordError ? "input error" : "input"}
                  value={currentPassword}
                  readOnly={!editMode}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={toggleCurrentPasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  <FontAwesomeIcon
                    icon={currentPasswordVisibility ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {currentPasswordError && (
                <p className="error-text">{currentPasswordError}</p>
              )}
            </div>

            <div>
              <label>
                New Password <span className="req">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={newPasswordVisibility ? "password" : "text"}
                  className={passwordError ? "input error" : "input"}
                  value={password}
                  readOnly={!editMode}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  <FontAwesomeIcon
                    icon={newPasswordVisibility ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>

            <div>
              <label>
                Confirm Password <span className="req">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={confirmPasswordVisibility ? "password" : "text"}
                  className={passwordMatchError ? "input error" : "input"}
                  value={confirmPassword}
                  readOnly={!editMode}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  <FontAwesomeIcon
                    icon={confirmPasswordVisibility ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {passwordMatchError && (
                <p className="error-text">{passwordMatchError}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-footer">
            {!editMode && (
              <button
                type="button"
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                <FontAwesomeIcon icon={faPencilAlt} /> Edit
              </button>
            )}
            {editMode && (
              <button type="submit" className="update-btn">
                Update
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
