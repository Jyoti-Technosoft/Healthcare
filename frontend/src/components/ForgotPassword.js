import React, { useState } from 'react';
import { sendOTP } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import { validateRequireEmail } from './Validations';

function ForgotPassword({ setEmail, sendOTPCompo, backToLogin }) {
    const [emailForOTP, setEmailForOTP] = useState("");
    const [emailForOTPError, setEmailForOTPError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSendOTP = async (event) => {
        event.preventDefault();
        setEmailForOTPError("");
        const emailForOTPRequireValidation = validateRequireEmail(emailForOTP);
        if (emailForOTPRequireValidation) {
            setEmailForOTPError(emailForOTPRequireValidation);
            return;
        }
        try {
            setLoading(true);
            const response = await sendOTP(emailForOTP);
            setEmail(emailForOTP);
            if (response === "User with email ID " + emailForOTP + " does not exist!") {
                toast.error(response);
                setLoading(false);
                return;
            }
            sendOTPCompo();
        } catch (error) {
            toast.error('Failed to send OTP code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header with Back button */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <button
                    type="button"
                    className="btn btn-light rounded-3 p-2 d-flex align-items-center justify-content-center"
                    onClick={backToLogin}
                    style={{ backgroundColor: "#eff4ff", border: "1px solid #bfc7d2" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                </button>
                <div>
                    <h2 className="fw-bold text-dark mb-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px" }}>
                        Recovery &amp; Verification
                    </h2>
                    <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>
                        Step 2 of 4: Enter verified clinical email for high-assurance token
                    </p>
                </div>
            </div>

            {/* HIPAA Token Protocol Notice */}
            <div className="p-3 rounded-3 mb-3 d-flex align-items-start gap-2.5" style={{ backgroundColor: "#eff4ff", border: "1px solid #bfc7d2" }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>info</span>
                <p className="mb-0 text-secondary" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Due to HIPAA credential protocols, one-time verification tokens expire in 10 minutes. A cryptographic 6-digit OTP will be dispatched to your hospital inbox.
                </p>
            </div>

            <form onSubmit={handleSendOTP} className="d-flex flex-column gap-3">
                <div>
                    <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                        Registered Hospital Email
                    </label>
                    <div className="aegis-input-group mb-0">
                        <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>alternate_email</span>
                        <input
                            id="email"
                            type="email"
                            className={`form-control ${emailForOTPError ? 'is-invalid' : ''}`}
                            placeholder="e.g. clinician@aegishealth.org"
                            value={emailForOTP}
                            onChange={(event) => {
                                setEmailForOTP(event.target.value);
                                setEmailForOTPError("");
                            }}
                            required
                        />
                    </div>
                    {emailForOTPError && <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{emailForOTPError}</div>}
                </div>

                {/* Medical Intranet Assurance Badge */}
                <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ borderColor: "#bfc7d2" }}>
                    <label className="d-flex align-items-center gap-2 mb-0" style={{ fontSize: "12px", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked required className="form-check-input" />
                        <span className="text-dark fw-medium">Verifying from an authorized medical intranet terminal</span>
                    </label>
                    <span className="material-symbols-outlined text-success" style={{ fontSize: "20px" }}>verified</span>
                </div>

                {/* Action Buttons */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ backgroundColor: "#006194", borderColor: "#006194", height: "48px" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
                    <span>{loading ? "Dispatching Token..." : "Send 6-Digit OTP Code"}</span>
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none text-secondary fw-semibold p-0"
                        style={{ fontSize: "13px" }}
                        onClick={backToLogin}
                    >
                        Cancel &amp; Return to Standard Login
                    </button>
                </div>
            </form>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default ForgotPassword;
