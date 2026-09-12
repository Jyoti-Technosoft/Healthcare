import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getReceptionistApi, updateReceptionistProfileApi } from "../Api";
import { format } from "date-fns";
import "../../assets/css/Receptionist/receptionistProfile.css"; // ← NEW CSS FILE

export default function ReceptionistProfile() {
  const userId = Cookies.get("userId");

  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [dayOfWorking, setDayOfWorking] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);
  const [currentPasswordVisibility, setCurrentPasswordVisibility] =
    useState(true);

  const [errors, setErrors] = useState({});

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const r = await getReceptionistApi(userId);
        setEmail(r.user.email);
        setName(r.name);
        setContact(r.contact);
        setDob(r.dateOfBirth);
        setAge(r.age);
        setGender(r.gender);
        setAddress(r.address);
        setDayOfWorking(r.dayOfWork);
        setShiftTime(r.shiftTiming);
        setRole(r.user.role);
        setJoiningDate(format(new Date(r.joiningDate), "dd MMM yyyy"));
      } catch (err) {
        console.log("Fetch error", err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "Required";
    if (!name) newErrors.name = "Required";
    if (!contact) newErrors.contact = "Required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Required";
    if (!gender) newErrors.gender = "Required";
    if (!address) newErrors.address = "Required";
    if (!password) newErrors.password = "Required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await updateReceptionistProfileApi(
          userId,
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
        setEditMode(false);
      } catch {
        setErrors({ currentPassword: "Invalid current password" });
      }
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-title-row">
          <h3>Receptionist Profile</h3>
        </div>

        <hr className="divider-line" />

        {/* Info Tag */}
        <div className="role-info">
          <span className="role-badge">{role}</span>
          <span className="join-date">Joined on {joiningDate}</span>
        </div>

        {/* Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Grid */}
          <div className="form-grid">
            <div>
              <label>
                Name <span className="req">*</span>
              </label>
              <input
                className={errors.name ? "input error" : "input"}
                value={name}
                readOnly={!editMode}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div>
              <label>
                Contact <span className="req">*</span>
              </label>
              <input
                className={errors.contact ? "input error" : "input"}
                value={contact}
                readOnly={!editMode}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <p className="error-text">{errors.contact}</p>}
            </div>

            <div>
              <label>
                Date of Birth <span className="req">*</span>
              </label>
              <input
                type="date"
                className={errors.dateOfBirth ? "input error" : "input"}
                value={dateOfBirth}
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
                    onClick={() => setGender(g)}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="error-text">{errors.gender}</p>}
            </div>

            <div className="form-full">
              <label>
                Address <span className="req">*</span>
              </label>
              <textarea
                className={errors.address ? "input error" : "input"}
                value={address}
                readOnly={!editMode}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label>
                Email <span className="req">*</span>
              </label>
              <input
                className={errors.email ? "input error" : "input"}
                value={email}
                readOnly={!editMode}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label>
                Current Password <span className="req">*</span>
              </label>
              <input
                type={currentPasswordVisibility ? "password" : "text"}
                disabled={!editMode}
                className={errors.currentPassword ? "input error" : "input"}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {errors.currentPassword && (
                <p className="error-text">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label>
                New Password <span className="req">*</span>
              </label>
              <input
                type={newPasswordVisibility ? "password" : "text"}
                disabled={!editMode}
                className={errors.password ? "input error" : "input"}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label>
                Confirm Password <span className="req">*</span>
              </label>
              <input
                type={confirmPasswordVisibility ? "password" : "text"}
                disabled={!editMode}
                className={errors.confirmPassword ? "input error" : "input"}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
                Edit
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
    </div>
  );
}
