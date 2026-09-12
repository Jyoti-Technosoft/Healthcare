import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getPatientApi, updatePatientProfileApi } from "../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/Patient/patientProfile.css";
import { ToastContainer, toast } from "react-toastify";

export default function PatientProfile() {
  const userId = Cookies.get("userId");
  const authToken = Cookies.get("authToken");

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  // Form fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [role, setRole] = useState("");
  const [patientId, setPatientId] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(true);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const dobDate = new Date(birthDate);
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getPatientApi(userId, authToken);
        setEmail(data.user.email);
        setName(data.name);
        setContact(data.contact);
        setDob(new Date(data.dateOfBirth).toISOString().substr(0, 10));
        setAge(data.age);
        setGender(data.gender);
        setAddress(data.address);
        setWeight(data.weight);
        setHeight(data.height);
        setRole(data.user.role);
        setPatientId(data.id);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!name) validationErrors.name = "Required";
    if (!contact) validationErrors.contact = "Required";
    if (!dob) validationErrors.dob = "Required";
    if (!gender) validationErrors.gender = "Required";
    if (!address) validationErrors.address = "Required";
    if (!email) validationErrors.email = "Required";
    if (!password) validationErrors.password = "Required";
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      await updatePatientProfileApi(
        patientId,
        email,
        currentPassword,
        password,
        name,
        contact,
        gender,
        dob,
        address,
        age,
        weight,
        height
      );
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update. Check credentials.");
    }
  };

  return (
    <>
      <div className="patient-profile-dashboard">
        <div className="patient-profile-card">
          <div className="profile-title-row">
            <h3>Patient Profile</h3>
          </div>

          <hr className="divider-line" />

          <div className="role-info">
            <span className="role-badge">{role}</span>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Name <span className="req">*</span></label>
                <input
                  className={errors.name ? "input error" : "input"}
                  value={name}
                  readOnly={!editMode}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div>
                <label>Contact <span className="req">*</span></label>
                <input
                  className={errors.contact ? "input error" : "input"}
                  value={contact}
                  readOnly={!editMode}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div>
                <label>Date of Birth <span className="req">*</span></label>
                <input
                  type="date"
                  className={errors.dob ? "input error" : "input"}
                  value={dob}
                  readOnly={!editMode}
                  onChange={(e) => {
                    setDob(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                />
              </div>

              <div>
                <label>Age</label>
                <input className="input" value={age} readOnly />
              </div>

              <div>
                <label>Weight (kg)</label>
                <input
                  className="input"
                  value={weight}
                  readOnly={!editMode}
                  placeholder="eg. 72"
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div>
                <label>Height (cm)</label>
                <input
                  className="input"
                  value={height}
                  readOnly={!editMode}
                  placeholder="eg. 176"
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="form-full">
                <label>Gender <span className="req">*</span></label>
                <div className="gender-toggle">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      type="button"
                      key={g}
                      disabled={!editMode}
                      className={`gender-btn ${gender === g ? "active" : ""}`}
                      onClick={() => setGender(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-full">
                <label>Address <span className="req">*</span></label>
                <textarea
                  className={errors.address ? "input error" : "input"}
                  value={address}
                  readOnly={!editMode}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label>Email <span className="req">*</span></label>
                <input
                  className={errors.email ? "input error" : "input"}
                  value={email}
                  readOnly={!editMode}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label>Current Password <span className="req">*</span></label>
                <div className="password-box">
                  <input
                    type={currentPasswordVisibility ? "password" : "text"}
                    disabled={!editMode}
                    className={errors.currentPassword ? "input error" : "input"}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <span className="pw-icon" onClick={() => setCurrentPasswordVisibility(!currentPasswordVisibility)}>
                    <FontAwesomeIcon icon={currentPasswordVisibility ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>

              <div>
                <label>New Password <span className="req">*</span></label>
                <div className="password-box">
                  <input
                    type={newPasswordVisibility ? "password" : "text"}
                    disabled={!editMode}
                    className="input"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span className="pw-icon" onClick={() => setNewPasswordVisibility(!newPasswordVisibility)}>
                    <FontAwesomeIcon icon={newPasswordVisibility ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>

              <div>
                <label>Confirm Password <span className="req">*</span></label>
                <div className="password-box">
                  <input
                    type={confirmPasswordVisibility ? "password" : "text"}
                    disabled={!editMode}
                    className={errors.confirmPassword ? "input error" : "input"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="pw-icon" onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}>
                    <FontAwesomeIcon icon={confirmPasswordVisibility ? faEyeSlash : faEye} />
                  </span>
                  {errors.confirmPassword && (
                    <p className="error-text">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-footer">
              {!editMode ? (
                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit
                </button>
              ) : (
                <button type="submit" className="update-btn">
                  Update
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
