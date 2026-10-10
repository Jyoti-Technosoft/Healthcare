import React, { useState } from 'react';
import { changePassword } from './Api';
import { ToastContainer, toast } from 'react-toastify';

function ResetPassword({ email, backToLogin }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false); 
    const [showPassword2, setShowPassword2] = useState(false); 
    const [loading, setLoading] = useState(false);

    // Password strength evaluator
    const getStrength = (pwd) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = getStrength(newPassword);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            await changePassword(email, newPassword);
            toast.success("Password changed successfully!");
            setTimeout(() => {
                backToLogin();
            }, 1500);
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to update password"); 
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
                        Set New Security Credential
                    </h2>
                    <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>
                        Step 4 of 4: NIST SP 800-63B &amp; HIPAA Compliant Complexity
                    </p>
                </div>
            </div>

            <form onSubmit={handlePasswordChange} className="d-flex flex-column gap-3">
                {/* New Password Input */}
                <div>
                    <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                        New Clinical Password
                    </label>
                    <div className="aegis-input-group mb-1">
                        <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>lock_reset</span>
                        <input
                            id="newPassword1"
                            value={newPassword}
                            type={showPassword1 ? "text" : "password"}
                            className="form-control"
                            placeholder="Minimum 6+ characters, numbers & symbols"
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="aegis-pwd-toggle"
                            onClick={() => setShowPassword1(!showPassword1)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                                {showPassword1 ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>

                    {/* Complexity Standard Meter */}
                    <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "11px" }}>
                            <span className="text-secondary">Complexity Standard:</span>
                            <span className={`fw-bold ${strength >= 3 ? "text-success" : strength === 2 ? "text-warning" : "text-danger"}`}>
                                {strength >= 3 ? "Strong (HIPAA Valid)" : strength === 2 ? "Medium" : "Weak"}
                            </span>
                        </div>
                        <div className="d-flex gap-1" style={{ height: "4px" }}>
                            <div className="flex-grow-1 rounded-pill" style={{ backgroundColor: strength >= 1 ? (strength >= 3 ? "#006947" : "#eab308") : "#e2e8f0" }}></div>
                            <div className="flex-grow-1 rounded-pill" style={{ backgroundColor: strength >= 2 ? (strength >= 3 ? "#006947" : "#eab308") : "#e2e8f0" }}></div>
                            <div className="flex-grow-1 rounded-pill" style={{ backgroundColor: strength >= 3 ? "#006947" : "#e2e8f0" }}></div>
                            <div className="flex-grow-1 rounded-pill" style={{ backgroundColor: strength >= 4 ? "#006947" : "#e2e8f0" }}></div>
                        </div>
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                    <label className="form-label fw-bold text-secondary mb-1" style={{ fontSize: "12px" }}>
                        Confirm New Password
                    </label>
                    <div className="aegis-input-group mb-1">
                        <span className="material-symbols-outlined aegis-input-icon" style={{ fontSize: "20px" }}>lock</span>
                        <input
                            id="newPassword2"
                            value={confirmPassword}
                            type={showPassword2 ? "text" : "password"}
                            className="form-control"
                            placeholder="Re-enter password identically"
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="aegis-pwd-toggle"
                            onClick={() => setShowPassword2(!showPassword2)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                                {showPassword2 ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>

                    {confirmPassword && (
                        <div className="d-flex align-items-center gap-1 mt-1" style={{ fontSize: "11px" }}>
                            <span className={`material-symbols-outlined ${passwordsMatch ? "text-success" : "text-danger"}`} style={{ fontSize: "14px" }}>
                                {passwordsMatch ? "check_circle" : "cancel"}
                            </span>
                            <span className={passwordsMatch ? "text-success fw-semibold" : "text-danger"}>
                                {passwordsMatch ? "Credentials match perfectly" : "Passwords do not match"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Guidance Pill */}
                <div className="p-2.5 rounded-3 d-flex flex-column gap-1" style={{ backgroundColor: "#eff4ff", fontSize: "11px", color: "#565e74" }}>
                    <div className="d-flex align-items-center gap-1 text-success">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>
                        <span>Cannot reuse the last 3 previous clinical passkeys</span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-success">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>
                        <span>Auto-invalidates all active secondary sessions upon change</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !passwordsMatch}
                    className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ backgroundColor: "#006194", borderColor: "#006194", height: "48px" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>security_update_good</span>
                    <span>{loading ? "Updating Credential..." : "Save Credential & Return"}</span>
                </button>
            </form>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default ResetPassword;
