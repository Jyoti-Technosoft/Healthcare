import React, { useState } from 'react';
import Header from './Header';
import { useNavigate, Link } from 'react-router-dom';
import {
  validateRequireEmail,
  validatePatternEmail,
  validateRequirePassword,
  validatePatternPassword
} from './Validations';
import { handleAdminRegistration } from './AdminAuthHelper';
import Cookies from 'js-cookie';
import '../assets/css/Global/Login.css';

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Role metadata for registration
  const roleContexts = {
    patient: {
      title: "Patient Telehealth & Care",
      desc: "Create your verified AegisHealth account to access digital prescriptions, booking, and lab charts.",
      placeholder: "e.g. patient@gmail.com",
    },
    doctor: {
      title: "Physician & Clinical Staff",
      desc: "Register with your hospital-issued identity or verified clinician email for provider onboarding.",
      placeholder: "e.g. dr.name@aegishealth.org",
    },
    receptionist: {
      title: "Front Desk & Administration",
      desc: "Staff onboarding portal for patient scheduling, triage handling, and reception access.",
      placeholder: "e.g. staff@aegishealth.org",
    },
    superadmin: {
      title: "Enterprise Governance",
      desc: "Authorized institution administrators overseeing department access and clinical controls.",
      placeholder: "e.g. admin@aegishealth.org",
    },
  };

  async function register(event) {
    if (event) event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setRegistrationError("");

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
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setRegistrationError("You must accept the HIPAA Privacy Standard & Terms of Service.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      await handleAdminRegistration(email, password, navigate, setRegistrationError, token);
    } catch (err) {
      setRegistrationError("Registration encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="aegis-auth-page">
        {/* Unified Split-Card Authentication Shell */}
        <div className="aegis-auth-card">
          {/* ================= LEFT COLUMN: Brand & Clinical Trust Showcase ================= */}
          <section className="aegis-auth-left">
            <div className="aegis-auth-left-content">
              {/* Brand Logo & Live Uptime Badge */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-white shadow"
                    style={{ width: "42px", height: "42px", backgroundColor: "#006194" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>local_hospital</span>
                  </div>
                  <div>
                    <span className="text-white fw-bold fs-5 d-block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      AegisHealth
                    </span>
                    <span className="text-secondary fw-semibold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px", color: "#94a3b8" }}>
                      Enterprise Gateway
                    </span>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill fw-semibold"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#6ee7b7", fontSize: "11px" }}
                >
                  <span className="rounded-circle bg-success pulse-beacon" style={{ width: "6px", height: "6px" }}></span>
                  HIPAA Ready
                </div>
              </div>

              {/* Hero Statement */}
              <div className="pt-2">
                <div className="d-inline-flex align-items-center gap-1 fw-bold text-uppercase mb-2" style={{ color: "#38bdf8", fontSize: "11px", letterSpacing: "1px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>badge</span>
                  Credential Onboarding
                </div>
                <h1 className="text-white fw-bold leading-tight mb-2" style={{ fontSize: "26px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Join the Integrated AegisHealth Clinical Network
                </h1>
                <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6" }} className="mb-0">
                  Secure single-identity onboarding for clinicians, healthcare staff, and patients with instant EHR connectivity.
                </p>
              </div>

              {/* Role Scope Pill Indicators */}
              <div>
                <span className="d-block text-uppercase fw-bold mb-2" style={{ fontSize: "10px", letterSpacing: "1px", color: "#94a3b8" }}>
                  Available Onboarding Roles
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-warning" style={{ fontSize: "14px" }}>person</span>
                    Patient
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-info" style={{ fontSize: "14px" }}>stethoscope</span>
                    Physician / MD
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-success" style={{ fontSize: "14px" }}>support_agent</span>
                    Front Desk
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-danger" style={{ fontSize: "14px" }}>security</span>
                    SuperAdmin
                  </span>
                </div>
              </div>

              {/* Institutional Safeguards */}
              <div className="pt-2 d-flex flex-column gap-2" style={{ fontSize: "12px", color: "#cbd5e1" }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>End-to-End Cryptographic Patient Privacy</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>Direct Integration with HL7&reg; FHIR&reg; Pipelines</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>Certified SOC2 Type II Data Vault</span>
                </div>
              </div>
            </div>

            {/* 24/7 Clinical Helpdesk Card */}
            <div className="aegis-auth-helpdesk">
              <div className="aegis-helpdesk-box">
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: "36px", height: "36px", backgroundColor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>headset_mic</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-white" style={{ fontSize: "12px" }}>Onboarding Support</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>1-800-AEGIS-MD (Ext 4)</span>
                  </div>
                </div>
                <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", fontSize: "11px" }}
                >
                  Live Help
                </span>
              </div>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: Interactive Registration Form ================= */}
          <section className="aegis-auth-right">
            <div>
              {/* Role Navigation Selector Tabs */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  Registration Target Role
                </span>
                <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: "#eff4ff", color: "#006194", border: "1px solid #dce9ff", fontSize: "11px" }}
                >
                  {roleContexts[selectedRole].title}
                </span>
              </div>

              <div className="aegis-role-grid" role="tablist">
                <button
                  type="button"
                  className={`aegis-role-btn ${selectedRole === "patient" ? "active" : ""}`}
                  onClick={() => setSelectedRole("patient")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>personal_injury</span>
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  className={`aegis-role-btn ${selectedRole === "doctor" ? "active" : ""}`}
                  onClick={() => setSelectedRole("doctor")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>stethoscope</span>
                  <span>Doctor / MD</span>
                </button>
                <button
                  type="button"
                  className={`aegis-role-btn ${selectedRole === "receptionist" ? "active" : ""}`}
                  onClick={() => setSelectedRole("receptionist")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>support_agent</span>
                  <span>Reception</span>
                </button>
                <button
                  type="button"
                  className={`aegis-role-btn ${selectedRole === "superadmin" ? "active" : ""}`}
                  onClick={() => setSelectedRole("superadmin")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>security</span>
                  <span>SuperAdmin</span>
                </button>
              </div>

              {/* Form Header */}
              <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px" }}>
                  Create New Account
                </h2>
                <p className="text-secondary mb-0" style={{ fontSize: "13px" }}>
                  {roleContexts[selectedRole].desc}
                </p>
              </div>

              {registrationError && (
                <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3" style={{ fontSize: "13px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
                  <span>{registrationError}</span>
                </div>
              )}

              <form onSubmit={register} className="d-flex flex-column gap-3">
                {/* Email Address */}
                <div>
                  <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                    Account Email Address
                  </label>
                  <div className="aegis-input-group mb-0">
                    <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>mail</span>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      placeholder={roleContexts[selectedRole].placeholder}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      required
                    />
                  </div>
                  {emailError && <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{emailError}</div>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                    Security Password
                  </label>
                  <div className="aegis-input-group mb-0">
                    <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>lock</span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${passwordError ? "is-invalid" : ""}`}
                      placeholder="Minimum 6+ characters, numbers & symbols"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="aegis-pwd-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {passwordError && <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{passwordError}</div>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                    Confirm Password
                  </label>
                  <div className="aegis-input-group mb-0">
                    <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>lock_reset</span>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
                      placeholder="Re-enter password identically"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError("");
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="aegis-pwd-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {confirmPasswordError && <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{confirmPasswordError}</div>}
                </div>

                {/* Terms Acceptance */}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="termsCheck" className="form-check-label text-secondary" style={{ fontSize: "12px" }}>
                    I agree to the <span className="fw-semibold text-dark">HIPAA Compliance &amp; Patient Privacy Standards</span>
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ backgroundColor: "#006194", borderColor: "#006194", height: "48px" }}
                >
                  <span>{loading ? "Processing Registration..." : "Complete Registration"}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                </button>
              </form>

              {/* Already have an account link */}
              <div className="text-center pt-3 mt-1">
                <span className="text-secondary" style={{ fontSize: "13px" }}>
                  Already have an AegisHealth account?{" "}
                </span>
                <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#006194", fontSize: "13px" }}>
                  Log In to Portal
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Registration;
