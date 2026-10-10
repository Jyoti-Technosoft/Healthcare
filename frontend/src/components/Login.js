import React, { useState, useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { validateRequireEmail, validateRequirePassword } from "./Validations";
import { handleAdminLogin } from "./AdminAuthHelper";
import ForgotPassword from "./ForgotPassword";
import OTPVerification from "./OTPVerification";
import ResetPassword from "./ResetPassword";
import "../assets/css/Global/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("doctor");

  // 1 = Login, 2 = Forgot, 3 = OTP, 4 = Reset
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  async function login(event) {
    if (event) event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const emailRequireValidation = validateRequireEmail(email);
    const passwordRequireValidation = validateRequirePassword(password);

    if (emailRequireValidation) {
      setEmailError(emailRequireValidation);
      return;
    }

    if (passwordRequireValidation) {
      setPasswordError(passwordRequireValidation);
      return;
    }

    await handleAdminLogin(email, password, navigate, setLoginError);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  }

  // Navigation Helpers
  const goToForgot = () => setActivePage(2);
  const backToLogin = () => setActivePage(1);
  const goToOTP = () => setActivePage(3);
  const goToReset = () => setActivePage(4);

  // Role metadata
  const roleContexts = {
    doctor: {
      title: "Physician & Staff Level",
      desc: "Sign in to access EHR, real-time patient charts, diagnostic feeds, and rounds schedule.",
      placeholder: "e.g. dr.chen@aegishealth.org or Staff ID",
    },
    receptionist: {
      title: "Front Desk & Triage",
      desc: "Access patient check-in queues, insurance verifications, and clinic calendar schedules.",
      placeholder: "e.g. reception@aegishealth.org",
    },
    patient: {
      title: "Patient Telehealth & Records",
      desc: "Access personal medical history, lab results, prescriptions, and scheduled appointments.",
      placeholder: "e.g. patient@gmail.com or Patient ID",
    },
    superadmin: {
      title: "Enterprise Governance",
      desc: "Hospital systems configuration, security audits, staff onboarding, and access control.",
      placeholder: "e.g. admin@aegishealth.org",
    },
  };

  return (
    <>
      <Header />
      <div className="aegis-auth-page">
        {/* Step Progress / Context Pill for Password Recovery */}
        {activePage > 1 && (
          <div className="aegis-flow-strip">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>security</span>
              <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Credential Recovery Progress:
              </span>
            </div>

            <div className="aegis-flow-pills" role="tablist">
              <button
                type="button"
                className={`aegis-flow-pill ${activePage === 1 ? "active" : ""}`}
                onClick={() => setActivePage(1)}
              >
                <span className="aegis-flow-num">1</span>
                Sign In
              </button>
              <button
                type="button"
                className={`aegis-flow-pill ${activePage === 2 ? "active" : ""}`}
                onClick={() => setActivePage(2)}
              >
                <span className="aegis-flow-num">2</span>
                Request OTP
              </button>
              <button
                type="button"
                className={`aegis-flow-pill ${activePage === 3 ? "active" : ""}`}
                onClick={() => setActivePage(3)}
              >
                <span className="aegis-flow-num">3</span>
                Verify Code
              </button>
              <button
                type="button"
                className={`aegis-flow-pill ${activePage === 4 ? "active" : ""}`}
                onClick={() => setActivePage(4)}
              >
                <span className="aegis-flow-num">4</span>
                Set Password
              </button>
            </div>

            <div className="d-none d-md-flex align-items-center gap-1 text-success fw-semibold" style={{ fontSize: "12px" }}>
              <span className="rounded-circle bg-success pulse-beacon me-1" style={{ width: "8px", height: "8px" }}></span>
              Encrypted Session
            </div>
          </div>
        )}

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
                  99.99% Up
                </div>
              </div>

              {/* Hero Statement */}
              <div className="pt-2">
                <div className="d-inline-flex align-items-center gap-1 fw-bold text-uppercase mb-2" style={{ color: "#38bdf8", fontSize: "11px", letterSpacing: "1px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>shield</span>
                  Federated Identity Provider
                </div>
                <h1 className="text-white fw-bold leading-tight mb-2" style={{ fontSize: "26px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Secure Access to Enterprise Clinical Systems &amp; Patient Telemetry
                </h1>
                <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.6" }} className="mb-0">
                  Unified electronic medical records, real-time HL7 FHIR pipelines, diagnostic imaging, and multi-tenant department routing.
                </p>
              </div>

              {/* Role Scope Pill Indicators */}
              <div>
                <span className="d-block text-uppercase fw-bold mb-2" style={{ fontSize: "10px", letterSpacing: "1px", color: "#94a3b8" }}>
                  Authorized Clinical Scopes
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-info" style={{ fontSize: "14px" }}>stethoscope</span>
                    Physician / MD
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-success" style={{ fontSize: "14px" }}>support_agent</span>
                    Front Desk
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-warning" style={{ fontSize: "14px" }}>person</span>
                    Patient
                  </span>
                  <span className="aegis-scope-chip">
                    <span className="material-symbols-outlined text-danger" style={{ fontSize: "14px" }}>security</span>
                    SuperAdmin
                  </span>
                </div>
              </div>

              {/* Safeguards */}
              <div className="pt-2 d-flex flex-column gap-2" style={{ fontSize: "12px", color: "#cbd5e1" }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>HIPAA Omnibus &amp; SOC2 Type II Certified Vault</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>HL7&reg; FHIR&reg; Release 4.01 API compliant</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>check_circle</span>
                  <span>256-Bit SSL Encrypted Session Telemetry</span>
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
                    <span className="fw-bold d-block text-white" style={{ fontSize: "12px" }}>24/7 Clinical Helpdesk</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>1-800-AEGIS-MD (Ext 4)</span>
                  </div>
                </div>
                <span
                  className="badge px-2 py-1"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", fontSize: "11px" }}
                >
                  Avg &lt; 45s
                </span>
              </div>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: Interactive Multi-Step Auth Forms ================= */}
          <section className="aegis-auth-right">
            <div>
              {/* Role Navigation Selector Tabs */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  Select Portal Target
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
                  className={`aegis-role-btn ${selectedRole === "patient" ? "active" : ""}`}
                  onClick={() => setSelectedRole("patient")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>personal_injury</span>
                  <span>Patient</span>
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

              {/* Dynamic View 1: Sign In */}
              {activePage === 1 && (
                <div>
                  <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px" }}>
                      Welcome Back
                    </h2>
                    <p className="text-secondary mb-0" style={{ fontSize: "13px" }}>
                      {roleContexts[selectedRole].desc}
                    </p>
                  </div>

                  {loginError && (
                    <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3" style={{ fontSize: "13px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={login} className="d-flex flex-column gap-3">
                    {/* Identifier Input */}
                    <div>
                      <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                        Clinical Email or NPI / Staff ID
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
                        />
                      </div>
                      {emailError && <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{emailError}</div>}
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label fw-bold text-secondary mb-0" style={{ fontSize: "12px" }}>
                          Password
                        </label>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          style={{ color: "#006194", fontSize: "12px" }}
                          onClick={goToForgot}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="aegis-input-group mb-0">
                        <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>key</span>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${passwordError ? "is-invalid" : ""}`}
                          placeholder="Enter your security credential"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                          }}
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

                    {/* Remember Checkbox & Station Auto-Lock Badge */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="form-check mb-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMeCheck"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMeCheck" className="form-check-label text-secondary" style={{ fontSize: "12px" }}>
                          Remember this workstation (30 days)
                        </label>
                      </div>
                      <span className="text-secondary d-none d-sm-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>timer</span>
                        Auto-Lock 15m
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      style={{ backgroundColor: "#006194", borderColor: "#006194", height: "48px" }}
                    >
                      <span>Sign In to Portal</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                    </button>
                  </form>

                  {/* SSO Divider */}
                  <div className="position-relative text-center my-3">
                    <hr className="my-0" style={{ borderColor: "#bfc7d2" }} />
                    <span
                      className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-secondary fw-semibold text-uppercase"
                      style={{ fontSize: "10px", letterSpacing: "0.5px" }}
                    >
                      Enterprise Federated SSO
                    </span>
                  </div>

                  {/* SSO Options */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: "12px", borderColor: "#bfc7d2", color: "#3f4850" }}
                        onClick={() => alert("Redirecting to Epic Systems SSO provider...")}
                      >
                        <span className="rounded-circle bg-danger" style={{ width: "8px", height: "8px" }}></span>
                        <span>Epic Systems SSO</span>
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: "12px", borderColor: "#bfc7d2", color: "#3f4850" }}
                        onClick={() => alert("SMART on FHIR Gateway integration active")}
                      >
                        <span className="rounded-circle bg-primary" style={{ width: "8px", height: "8px" }}></span>
                        <span>SMART on FHIR</span>
                      </button>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center pt-2">
                    <span className="text-secondary" style={{ fontSize: "13px" }}>
                      New patient or clinician without credentials?{" "}
                    </span>
                    <Link to="/registration" className="fw-bold text-decoration-none" style={{ color: "#006194", fontSize: "13px" }}>
                      Register Portal Account
                    </Link>
                  </div>
                </div>
              )}

              {/* Dynamic View 2: Forgot Password */}
              {activePage === 2 && (
                <ForgotPassword
                  setEmail={setEmail}
                  sendOTPCompo={goToOTP}
                  backToLogin={backToLogin}
                />
              )}

              {/* Dynamic View 3: OTP Verification */}
              {activePage === 3 && (
                <OTPVerification
                  email={email}
                  verifyOTPCompo={goToReset}
                  backToLogin={backToLogin}
                />
              )}

              {/* Dynamic View 4: Reset Password */}
              {activePage === 4 && (
                <ResetPassword email={email} backToLogin={backToLogin} />
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;
