import React, { useRef, useState, useEffect } from 'react';
import { focusNextInput } from './Validations';
import { verifyOTP } from './Api';
import { ToastContainer, toast } from 'react-toastify';
function OTP_Verification({ email, verifyOTPCompo, backToLogin }) {
    const inputs = useRef([]);
    const [timer, setTimer] = useState(120); // Initial time in seconds
    const [timerExpired, setTimerExpired] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(interval); // Stop the timer when it reaches 0
                    setTimerExpired(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format the timer into minutes and seconds
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const newOtp = [...otp];

    const handleInput = (event, index) => {
        const value = event.target.value;
        if (/^[0-9]$/.test(value)) {
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5 && value) {
                focusNextInput(index, inputs);
            }
        }else if (value === "") {
            newOtp[index] = ""; 
            setOtp(newOtp);
        }
    };
    const handleVerifyOTP = async (event) => {
        event.preventDefault();
        const otpString = otp.join('');
        try {
            const response = await verifyOTP(email, otpString);
            if (response === "Invalid or expired OTP!") {
                toast.error(response);
                return;
            }
            verifyOTPCompo();
        } catch (error) {
            toast.error('Invalid or expired OTP!'); 
        }
    };
    return (
        <div className="col-md-6 right-box mt-5">
            <div className="row align-items-center">
                <div className="header-text mb-4">
                    <h2 className='text-center'>Enter your Verification code</h2>
                    <p className='text-center'>We have send you an One Time Passcode via this email address</p>
                </div>
                {/* OTP Blocks */}
                <div class="form-group">
                    {/* <label for="otp">OTP</label> */}
                    <div className="input-group-new mb-3">
                        {[...Array(6)].map((_, index) => (
                            <React.Fragment key={index}>
                                <input
                                    ref={(input) => (inputs.current[index] = input)}
                                    type="text"
                                    className="form-control text-center otp-input"
                                    maxLength={1}
                                    pattern="[0-9]"
                                    value={otp[index]}
                                    onChange={(event) => handleInput(event, index)}
                                />
                                {index < 5 && <div className="spacer" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            <p> <span style={{ color: 'black', fontSize: '13px' }}>Didn't get it? </span> &nbsp; <button type="button" disabled={!timerExpired} className="btn reset-button-border">Resend OTP</button></p>
                        </div>
                        <div>
                            <p style={{ color: 'black', fontSize: '13px' }}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                        </div>
                    </div>
                </div>
                <div className="input-group mb-3">
                    <button style={{ background: '#1977cc ', borderColor: 'white' }} onClick={handleVerifyOTP} className="btn btn-lg btn-primary w-100 fs-6" > Verify OTP </button>
                </div>
                <div>
                    <p className='text-center' style={{ color: '#1977cc', cursor: 'pointer', fontSize: '14px' }} onClick={backToLogin}><i class="bi bi-chevron-left"></i>&nbsp;Back to Login</p>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default OTP_Verification;
