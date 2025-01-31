import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs'; 
import { changePassword } from './Api';
import { ToastContainer, toast } from 'react-toastify';

function ResetPassword({ email, backToLogin }) {
    const [newPassword,setNewPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false); 
    const [showPassword2, setShowPassword2] = useState(false); 

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        try {
            await changePassword(email,newPassword);
            toast.success("Password change succesfully!!!");
            setTimeout(() => {
                backToLogin();
            }, 2000);
        } catch (error) {
            toast.error(error); 
        }
    }

    return (
        <div className="col-md-6 right-box mt-5">
            <div className="row align-items-center">
                <div className="header-text mb-4">
                    <h2 className='text-center'>Create New Password</h2>
                    <p className='text-center'>This password should be different from the previous password</p>
                </div>
                <div className="input-group mb-3">
                    <input
                        id="newPassword1"
                        value={newPassword}
                        type={showPassword1 ? "text" : "password"}
                        className="form-control form-control-lg fs-6"
                        placeholder="New Password"
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                        }}
                    />
                    <button
                        className="btn "
                        type="button"
                        onClick={togglePasswordVisibility1}
                        style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        {showPassword1 ? <BsEyeSlash /> : <BsEye />}
                    </button>
                </div>
                <div className="input-group mb-3">
                    <input
                        id="newPassword2"
                        type={showPassword2 ? "text" : "password"}
                        className="form-control form-control-lg  fs-6"
                        placeholder="Confirm Password"
                    />
                    <button
                        className="btn "
                        type="button"
                        onClick={togglePasswordVisibility2}
                        style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        {showPassword2 ? <BsEyeSlash /> : <BsEye />}
                    </button>
                </div>
                <div className="input-group mb-3">
                    <button style={{ background: '#1977cc ', borderColor: 'white' }} onClick={handlePasswordChange} className="btn btn-lg btn-primary w-100 fs-6"> Change Password </button>
                </div>
                <div>
                    <p className='text-center' style={{ color: '#1977cc', cursor: 'pointer' }} onClick={backToLogin}><i className="bi bi-chevron-left"></i>&nbsp;Back to Login</p>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default ResetPassword;
