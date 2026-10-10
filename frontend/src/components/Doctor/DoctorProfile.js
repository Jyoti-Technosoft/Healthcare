import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
        if (userData) {
          setEmail(userData.user?.email || "");
          setDoctorId(userData.id || "");
          setName(userData.name || "");
          setRole(userData.user?.role || "");
          setContact(userData.contact || "");
          if (userData.joiningDate) {
            try {
              const formattedJoiningDate = format(
                new Date(userData.joiningDate),
                "dd MMM yyyy"
              );
              setJoiningDate(formattedJoiningDate);
            } catch {
              setJoiningDate(userData.joiningDate);
            }
          }
          setDob(userData.dateOfBirth || "");
          setAge(userData.age || "");
          setGender(userData.gender || "");
          setAddress(userData.address || "");
          setQualification(userData.qualification || "");
          setDesignation(userData.designation || "");
          setSpecialities(userData.specialities || "");
          setDepartment(userData.department || "");
          setMorningTime(userData.morningTiming || "");
          setEveningTiming(userData.eveningTiming || "");
          setVisitingDays(userData.visitingDays || "");
        }
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
    const nameRequireValidation = validateRequireName(name);
    const contactRequireValidation = validateRequireContact(contact);
    const dobRequireValidation = validateRequireDob(dateOfBirth);
    const addressRequireValidation = validateRequireAddress(address);

    let hasError = false;

    if (emailRequireValidation) {
      setEmailError(emailRequireValidation);
      hasError = true;
    } else if (emailPatternValidation) {
      setEmailError(emailPatternValidation);
      hasError = true;
    }

    // Password validation - only if user enters new password or current password
    if (password || currentPassword || confirmPassword) {
      if (!currentPassword) {
        setCurrentPasswordError("Current password is required to change password");
        hasError = true;
      }
      const passwordRequireValidation = validateRequirePassword(password);
      const passwordPatternValidation = validatePatternPassword(password);
      if (passwordRequireValidation) {
        setPasswordError(passwordRequireValidation);
        hasError = true;
      } else if (passwordPatternValidation) {
        setPasswordError(passwordPatternValidation);
        hasError = true;
      }
      if (password !== confirmPassword) {
        setPasswordMatchError("Passwords do not match");
        hasError = true;
      }
    }

    if (nameRequireValidation) {
      setNameError(nameRequireValidation);
      hasError = true;
    }
    if (contactRequireValidation) {
      setContactError(contactRequireValidation);
      hasError = true;
    }
    if (dobRequireValidation) {
      setDobError(dobRequireValidation);
      hasError = true;
    }
    if (!gender) {
      setGenderError("Please select a gender");
      hasError = true;
    }
    if (addressRequireValidation) {
      setAddressError(addressRequireValidation);
      hasError = true;
    }

    if (hasError) {
      toast.warn("Please check the form for errors before saving.");
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
        age,
        qualification,
        designation,
        specialities,
        department,
        morningTime,
        eveningTiming,
        visitingDays
      );
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update profile. Please verify your current password if changing it.");
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-card">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>person_outline</span>
              Physician Credentials &amp; Registry
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Dr. {name ? capitalizeName(name) : "Doctor Profile"}
            </h2>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill">
                {role || "Physician"}
              </span>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                Joined on {joiningDate}
              </span>
            </div>
          </div>

          <div>
            {!editMode ? (
              <button
                type="button"
                className="btn btn-outline-primary d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-3 fw-semibold shadow-sm"
                onClick={() => setEditMode(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill fw-semibold">
                Editing Mode Active
              </span>
            )}
          </div>
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
                readOnly={!editMode}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Qualification (e.g. MBBS, MD)"
              />
            </div>

            <div>
              <label>Designation</label>
              <input
                className="input"
                value={designation}
                readOnly={!editMode}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Designation (e.g. Senior Consultant)"
              />
            </div>

            <div>
              <label>Specialities</label>
              <input
                className="input"
                value={specialities}
                readOnly={!editMode}
                onChange={(e) => setSpecialities(e.target.value)}
                placeholder="Specialities (e.g. Cardiology)"
              />
            </div>

            <div>
              <label>Department</label>
              <input
                className="input"
                value={department}
                readOnly={!editMode}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department (e.g. Cardiology)"
              />
            </div>

            <div>
              <label>Morning Time</label>
              <input
                className="input"
                value={morningTime}
                readOnly={!editMode}
                onChange={(e) => setMorningTime(e.target.value)}
                placeholder="Morning time (e.g. 09:00 - 13:00)"
              />
            </div>

            <div>
              <label>Evening Time</label>
              <input
                className="input"
                value={eveningTiming}
                readOnly={!editMode}
                onChange={(e) => setEveningTiming(e.target.value)}
                placeholder="Evening time (e.g. 17:00 - 21:00)"
              />
            </div>

            <div className="form-full">
              <label>Visiting Days</label>
              <input
                className="input"
                value={visitingDays}
                readOnly={!editMode}
                onChange={(e) => setVisitingDays(e.target.value)}
                placeholder="Visiting Days (e.g. Mon, Wed, Fri)"
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
          <div className="form-footer d-flex align-items-center justify-content-end gap-2 mt-4 pt-3 border-top">
            {!editMode ? (
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-1.5 px-4 py-2 rounded-3 fw-semibold shadow-sm"
                style={{ backgroundColor: "#006194", borderColor: "#006194" }}
                onClick={() => setEditMode(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-3 fw-semibold"
                  onClick={() => {
                    setEditMode(false);
                    setEmailError("");
                    setNameError("");
                    setContactError("");
                    setDobError("");
                    setGenderError("");
                    setAddressError("");
                    setCurrentPasswordError("");
                    setPasswordError("");
                    setPasswordMatchError("");
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-success d-inline-flex align-items-center gap-1.5 px-4 py-2 rounded-3 fw-semibold shadow-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
                  <span>Save Changes</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
