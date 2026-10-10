import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getReceptionistApi, updateReceptionistProfileApi } from "../Api";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    // Optional password update
    if (password || currentPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Required to change password";
      }
      if (!password) {
        newErrors.password = "Required";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

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
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch {
        toast.error("Failed to update profile. Please verify your current password.");
        setErrors({ currentPassword: "Invalid current password" });
      }
    } else {
      toast.warn("Please check the form for errors before saving.");
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-card">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>badge</span>
              Admissions &amp; Front Desk Registry
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {name || "Receptionist Profile"}
            </h2>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill">
                {role || "Receptionist"}
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
                    setErrors({});
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
