import React, { useState } from 'react';
import { sendOTP } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import { validateRequireEmail } from './Validations';

function ForgotPassword({ setEmail, sendOTPCompo, backToLogin }) {
    const [emailForOTP, setEmailForOTP] = useState("");
    const [emailForOTPError, setEmailForOTPError] = useState("");
    
    const handleSendOTP = async (event) => {
        event.preventDefault();
        setEmailForOTPError("");
        const emailForOTPRequireValidation = validateRequireEmail(emailForOTP);
        if (emailForOTPRequireValidation) {
            setEmailForOTPError(emailForOTPRequireValidation);
            return;
        }
        try {
            const response = await sendOTP(emailForOTP);
            setEmail(emailForOTP);
            if (response === "User with email ID " + emailForOTP + " does not exist!") {
                toast.error(response);
                return;
            }
            sendOTPCompo();
        } catch (error) {
            toast.error('Failed to send otp!!');
        }
    }

    return (
        <div className="col-md-6 right-box mt-5">
            <div className="row align-items-center">
                <div className="header-text mb-4">
                    <h2 className='text-center'>OTP Verifiaction</h2>
                    <p className='text-center'>Enter your email and we'll send you OTP to reset your password</p>
                </div>
                <div className="input-group mb-3">
                    <input
                        id="email"
                        type="email"
                        className={`form-control form-control-lg  fs-6 ${emailForOTPError && 'is-invalid'} `}
                        placeholder="Email address"
                        value={emailForOTP}
                        onChange={(event) => {
                            setEmailForOTP(event.target.value);
                            setEmailForOTPError("");
                        }}
                        required
                    />
                    {emailForOTPError && <div className="invalid-feedback">{emailForOTPError}</div>}
                </div>
                <div className="input-group mb-3">
                    <button style={{ background: '#1977cc ', borderColor: 'white' }} className="btn btn-lg btn-primary w-100 fs-6" onClick={handleSendOTP}> Send OTP </button>
                </div>
                <div>
                    <p className='text-center' style={{ color: '#1977cc', cursor: 'pointer' }} onClick={backToLogin}><i className="bi bi-chevron-left"></i>&nbsp;Back to Login</p>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default ForgotPassword;
