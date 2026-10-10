import React, { useRef, useState, useEffect } from 'react';
import { focusNextInput } from './Validations';
import { verifyOTP } from './Api';
import { ToastContainer, toast } from 'react-toastify';

function OTPVerification({ email, verifyOTPCompo, backToLogin }) {
    const inputs = useRef([]);
    const [timer, setTimer] = useState(120);
    const [timerExpired, setTimerExpired] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const handleInput = (event, index) => {
        const value = event.target.value;
        const newOtp = [...otp];
        if (/^[0-9]$/.test(value)) {
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5 && value) {
                focusNextInput(index, inputs);
            }
        } else if (value === "") {
            newOtp[index] = ""; 
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (event) => {
        event.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) {
            toast.error("Please enter complete 6-digit OTP code");
            return;
        }
        try {
            setLoading(true);
            const response = await verifyOTP(email, otpString);
            if (response === "Invalid or expired OTP!") {
                toast.error(response);
                setLoading(false);
                return;
            }
            verifyOTPCompo();
        } catch (error) {
            toast.error('Invalid or expired OTP!'); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval); 
                    setTimerExpired(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
                        Two-Factor Authentication
                    </h2>
                    <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>
                        Step 3 of 4: Enter 6-digit code dispatched to <strong className="text-dark">{email || "your registered inbox"}</strong>
                    </p>
                </div>
            </div>

            {/* Live Countdown Validity Banner */}
            <div className="d-flex align-items-center justify-content-between p-2.5 rounded-3 mb-4" style={{ backgroundColor: "#eff4ff", border: "1px solid #cce5ff" }}>
                <div className="d-flex align-items-center gap-2 text-dark fw-medium" style={{ fontSize: "12px" }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>nest_clock_farsight_analog</span>
                    <span>Code Validity Window:</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-pill fw-bold font-monospace" style={{ backgroundColor: "#cce5ff", color: "#006194", fontSize: "12px" }}>
                    {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </div>
            </div>

            <form onSubmit={handleVerifyOTP} className="d-flex flex-column gap-3">
                <div>
                    <label className="form-label fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                        Secure 6-Digit Passcode
                    </label>
                    <div className="aegis-otp-grid">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                ref={(input) => (inputs.current[index] = input)}
                                type="text"
                                className="aegis-otp-cell"
                                maxLength={1}
                                pattern="[0-9]"
                                value={otp[index]}
                                autoFocus={index === 0}
                                onChange={(event) => handleInput(event, index)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                            />
                        ))}
                    </div>
                    <small className="text-secondary text-center d-block" style={{ fontSize: "11px" }}>
                        Check spam directory or hospital mobile pager if code is delayed
                    </small>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ backgroundColor: "#006194", borderColor: "#006194", height: "48px" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>task_alt</span>
                    <span>{loading ? "Validating Code..." : "Verify Token & Proceed"}</span>
                </button>

                <div className="d-flex align-items-center justify-content-between pt-1" style={{ fontSize: "12px" }}>
                    <span className="text-secondary">Didn't receive code?</span>
                    <button
                        type="button"
                        disabled={!timerExpired}
                        className="btn btn-link p-0 text-decoration-none fw-semibold"
                        style={{ color: timerExpired ? "#006194" : "#94a3b8", fontSize: "12px" }}
                        onClick={() => {
                            if (timerExpired) {
                                setTimer(120);
                                setTimerExpired(false);
                                toast.info("New verification code dispatched.");
                            }
                        }}
                    >
                        Resend Code {timer > 0 ? `in ${seconds}s` : ""}
                    </button>
                </div>
            </form>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default OTPVerification;
