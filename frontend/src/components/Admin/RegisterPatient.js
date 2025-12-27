import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UsersAuthHelper } from "./UsersAuthHelper";

import {
  validateRequireEmail,
  validatePatternEmail,
  validateRequirePassword,
  validatePatternPassword,
  validateRequireName,
  validateRequireContact,
  validateRequireDob,
  validateRequireAddress,
  validateRequireWeight,
  validateRequireHeight,
  calculateAge
} from "../Validations";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../assets/css/Admin/RegisterPatient.css";
import BackArrow from "../../assets/img/back-arrow.png";

export default function RegisterPatient() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [address, setAddress] = useState("");

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmVisibility, setConfirmVisibility] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();


useEffect(() => {
  dispatch(setActiveTab("registerPatient"));
}, [dispatch]);



  /* VALIDATION STATES */
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

  const capitalizeName = (val) =>
    val.toLowerCase().replace(/(^|\s)\S/g, (s) => s.toUpperCase());

  const handleDateChange = (e) => {
    setDob(e.target.value);
    setAge(calculateAge(e.target.value));
  };

  const togglePassword = () => setPasswordVisibility(!passwordVisibility);
  const toggleConfirmPassword = () =>
    setConfirmVisibility(!confirmVisibility);

  async function handleSubmit(e) {
    e.preventDefault();

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

    const emailRequired = validateRequireEmail(email);
    const emailPattern = validatePatternEmail(email);
    const passwordRequired = validateRequirePassword(password);
    const passwordPattern = validatePatternPassword(password);
    const nameRequired = validateRequireName(name);
    const contactRequired = validateRequireContact(contact);
    const dobRequired = validateRequireDob(dateOfBirth);
    const addressRequired = validateRequireAddress(address);
    const weightRequired = validateRequireWeight(weight);
    const heightRequired = validateRequireHeight(height);

    if (emailRequired) return setEmailError(emailRequired);
    if (emailPattern) return setEmailError(emailPattern);
    if (passwordRequired) return setPasswordError(passwordRequired);
    if (passwordPattern) return setPasswordError(passwordPattern);
    if (password !== confirmPassword)
      return setPasswordMatchError("Passwords do not match");
    if (nameRequired) return setNameError(nameRequired);
    if (contactRequired) return setContactError(contactRequired);
    if (dobRequired) return setDobError(dobRequired);
    if (!gender) return setGenderError("Please select a gender");
    if (addressRequired) return setAddressError(addressRequired);
    if (weightRequired) return setWeightError(weightRequired);
    if (heightRequired) return setHeightError(heightRequired);

    try {
      await UsersAuthHelper(
        email,
        password,
        "Patient",
        name,
        contact,
        dateOfBirth,
        age,
        gender,
        address,
        "",
        "",
        "",
        weight,
        height,
        navigate
      );

      toast.success("Patient registered successfully");
      handleClear();
    } catch (err) {
      toast.error("Failed to register patient!");
    }
  }

  const handleClear = () => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setContact("");
    setEmail("");
    setDob("");
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setAddress("");
  };

  return (
    <div className="background_part">
      <div className="register-card">
        <img
          src={BackArrow}
          className="register-back-btn"
          alt="back"
          onClick={() => dispatch(setActiveTab("patientsList"))}
        />

        <h3 className="register-title">Register Patient</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* EMAIL */}
          <div className="form-grid-full">
            <label className="form-label">
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              className={`form-control input-field ${
                emailError ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-danger">{emailError}</div>}
          </div>

          {/* PASSWORD */}
          <div className="input-wrapper">
            <label className="form-label">
              Password <span className="req">*</span>
            </label>
            <input
              type={passwordVisibility ? "password" : "text"}
              className={`form-control input-field ${
                passwordError ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-eye"
              onClick={togglePassword}
            >
              <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
            </button>
            {passwordError && (
              <div className="text-danger">{passwordError}</div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-wrapper">
            <label className="form-label">
              Confirm Password <span className="req">*</span>
            </label>
            <input
              type={confirmVisibility ? "password" : "text"}
              className={`form-control input-field ${
                passwordMatchError ? "is-invalid" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-eye"
              onClick={toggleConfirmPassword}
            >
              <FontAwesomeIcon icon={confirmVisibility ? faEyeSlash : faEye} />
            </button>
            {passwordMatchError && (
              <div className="text-danger">{passwordMatchError}</div>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="form-label">
              Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`form-control input-field ${
                nameError ? "is-invalid" : ""
              }`}
              value={capitalizeName(name)}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <div className="text-danger">{nameError}</div>}
          </div>

          {/* CONTACT */}
          <div>
            <label className="form-label">
              Contact <span className="req">*</span>
            </label>
            <input
              type="number"
              className={`form-control input-field ${
                contactError ? "is-invalid" : ""
              }`}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            {contactError && <div className="text-danger">{contactError}</div>}
          </div>

          {/* DOB */}
          <div>
            <label className="form-label">
              Date of Birth <span className="req">*</span>
            </label>
            <input
              type="date"
              className={`form-control input-field ${
                dobError ? "is-invalid" : ""
              }`}
              value={dateOfBirth}
              onChange={handleDateChange}
            />
            {dobError && <div className="text-danger">{dobError}</div>}
          </div>

          {/* AGE */}
          <div>
            <label className="form-label">
              Age <span className="req">*</span>
            </label>
            <input
              type="number"
              readOnly
              value={age}
              className="form-control input-field"
            />
          </div>

          {/* GENDER */}
          <div className="form-grid-full gender-row">
            <label className="form-label gender-label">
              Gender <span className="req">*</span>
            </label>

            <div className="gender-group">
              <label className="gender-option">
                <input
                  type="radio"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="custom-radio"></span>
                Male
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="custom-radio"></span>
                Female
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  value="other"
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="custom-radio"></span>
                Other
              </label>
            </div>

            {genderError && (
              <div className="text-danger gender-error">{genderError}</div>
            )}
          </div>

          {/* WEIGHT */}
          <div>
            <label className="form-label">
              Weight <span className="req">*</span>
            </label>
            <input
              type="number"
              className={`form-control input-field ${
                weightError ? "is-invalid" : ""
              }`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            {weightError && <div className="text-danger">{weightError}</div>}
          </div>

          {/* HEIGHT */}
          <div>
            <label className="form-label">
              Height <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`form-control input-field ${
                heightError ? "is-invalid" : ""
              }`}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            {heightError && <div className="text-danger">{heightError}</div>}
          </div>

          {/* ADDRESS */}
          <div className="form-grid-full">
            <label className="form-label">
              Address <span className="req">*</span>
            </label>
            <textarea
              className={`form-control input-field ${
                addressError ? "is-invalid" : ""
              }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {addressError && <div className="text-danger">{addressError}</div>}
          </div>

          {/* BUTTON ROW */}
          <div className="button-row">
            <button type="submit" className="register-btn">
              Register
            </button>
            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
