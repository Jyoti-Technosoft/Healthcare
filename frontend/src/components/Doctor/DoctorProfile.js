import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { format } from 'date-fns'; // Import format function from date-fns
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { updateDoctorProfileApi, getDoctorsWithIdApi } from '../Api';
import { validateRequireEmail, validatePatternEmail, validateRequirePassword, validatePatternPassword, validateRequireName, validateRequireContact, validateRequireDob, validateRequireGender, validateRequireAddress, validateRequireWorkingDays, validateRequireShiftTime, validateRequireJoiningDate } from '../Validations';

export default function DoctorProfile() {
    const userId = Cookies.get("userId");
    const authToken = Cookies.get('authToken');
    const totalSteps = 3;
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [dateOfBirth, setDob] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState("");

    const [role, setRole] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [receptionistId, setReceptionistId] = useState("");
    const [editMode, setEditMode] = useState(false); // State to track whether fields are in edit mode

    const [passwordFromDatabase, setPasswordFromDatabase] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(true);
    const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const [qualification, setQualification] = useState("");
    const [designation, setDesignation] = useState("");
    const [specialities, setSpecialities] = useState("");
    const [department, setDepartment] = useState("");
    const [morningTime, setMorningTime] = useState("");
    const [eveningTiming, setEveningTiming] = useState("");
    const [visitingDays, setVisitingDays] = useState("");


    const [emailError, setEmailError] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [nameError, setNameError] = useState("");
    const [contactError, setContactError] = useState("");
    const [dobError, setDobError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [addressError, setAddressError] = useState("");

    const capitalizeName = (name) => {
        return name.toLowerCase().replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
    };
    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };
    const toggleCurrentPasswordVisibility = () => {
        setCurrentPasswordVisibility(!currentPasswordVisibility);
    };
    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisibility(!newPasswordVisibility);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisibility(!confirmPasswordVisibility);
    };

    useEffect(() => {

        async function fetchData() {
            try {
                const userData = await getDoctorsWithIdApi(userId,authToken);
                //console.log(userData.user.password);
                // console.log(userData);
                setEmail(userData.user.email);
                setReceptionistId(userData.id);
                setName(userData.name);
                setRole(userData.user.role);
                setPasswordFromDatabase(userData.user.password);
                setContact(userData.contact);
                const formattedJoiningDate = format(new Date(userData.joiningDate), 'dd MMM yyyy');
                setJoiningDate(formattedJoiningDate);
                setDob(userData.dateOfBirth);
                setAge(userData.age);
                setGender(userData.gender);
                setAddress(userData.address);
                setQualification(userData.qualification);
                setDesignation(userData.designation);
                setSpecialities(userData.specialities);
                setDepartment(userData.department);
                setMorningTime(userData.morningTiming);
                setEveningTiming(userData.eveningTiming);
                setVisitingDays(userData.visitingDays);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError("");
        setPasswordError("");
        setPasswordMatchError("");
        setNameError("");
        setContactError("");
        setDobError("");
        setGenderError("");
        setAddressError("");
        setCurrentPasswordError("");
        const emailRequireValidation = validateRequireEmail(email);
        const emailPatternValidation = validatePatternEmail(email);
        const passwordRequireValidation = validateRequirePassword(password);
        const passwordPatternValidation = validatePatternPassword(password);
        const nameRequireValidation = validateRequireName(name);
        const contactRequireValidation = validateRequireContact(contact);
        const dobRequireValidation = validateRequireDob(dateOfBirth);
        const genderRequireValidation = validateRequireGender(gender);
        const addressRequireValidation = validateRequireAddress(address);
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
            setPasswordMatchError("Passwords does not match");
            return;
        }
        if (nameRequireValidation) {
            setNameError(nameRequireValidation);
            return;
        }
        if (contactRequireValidation) {
            setContactError(contactRequireValidation);
            return;
        }
        if (dobRequireValidation) {
            setDobError(dobRequireValidation);
            return;
        }
        if (!gender) {
            setGenderError('Please select a gender');
            return;
        }
        if (addressRequireValidation) {
            setAddressError(addressRequireValidation);
            return;
        }

        try {
            await updateDoctorProfileApi(receptionistId, email, currentPassword, password, name, contact, gender, dateOfBirth, address, age);
        } catch (error) {
            setCurrentPasswordError("Current password is incorrect");
        }
    };

    return (
        <div className='background_part padding_top'>
            <div className="container updateProfileContainer">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-3">
                                <div className="card border-0 mb-3 shadow  bg-white rounded">
                                    <div className="card-body">
                                        <div className="e-profile">
                                            <div className="row">
                                                {/* <div className="col-12 col-sm-auto mb-3">
                            <div className="mx-auto" style={{ width: '140px' }}>
                              <div className="d-flex justify-content-center align-items-center rounded" style={{ height: '140px', backgroundColor: 'rgb(233, 236, 239)' }}>
                                <span style={{ color: 'rgb(166, 168, 170)', font: 'bold 8pt Arial' }}>140x140</span>
                              </div>
                            </div>
                          </div> */}
                                                <div className="col d-flex flex-column flex-sm-row justify-content-between mb-3">
                                                    <div className="text-center text-sm-left mb-2 mb-sm-0">
                                                        <h4 className="pt-sm-2 pb-1 mb-0 updateProfileHeading"><b className='contentHeadings' style={{ color: 'black' }}>Update profile</b></h4>

                                                        {/* <div className="mt-2">
                                <button className="btn btn-primary" style={{ width: '125px', fontSize: '12px' }} type="button">
                                  <i className="fa fa-fw fa-camera"></i> &nbsp;
                                  <span>Change Photo</span>
                                </button>
                              </div> */}
                                                    </div>
                                                    <div className="text-center text-sm-right profileHead">
                                                        <span className="badge badge-secondary">{role}</span>
                                                        <div className="text-muted"><small>Joined on {joiningDate}</small></div>


                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between">
                                                <ul className="nav nav-tabs flex-grow-1">
                                                    <li className="nav-item">
                                                        <a className="active nav-link profileTab">
                                                            <i class="bi bi-person"></i> Profile
                                                        </a>
                                                    </li>
                                                </ul>

                                                <div className="">
                                                    <button className="btn" style={{ width: '70px', fontSize: '13px' }} type="button" onClick={() => setEditMode(true)} >
                                                        <FontAwesomeIcon icon={faPencilAlt} /> Edit
                                                    </button>
                                                </div>
                                            </div>




                                            <div className="tab-content pt-3">
                                                {[...Array(totalSteps).keys()].map((index) => (
                                                    <div className={`tab-pane ${step === index + 1 ? 'active' : ''}`} key={index + 1}>
                                                        {step === index + 1 && (
                                                            <form className="form" onSubmit={handleSubmit}>

                                                                <>
                                                                    <br />
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="mb-2"><b className='contentHeadings'>Personal details</b></div>
                                                                            <div className="row g-3">
                                                                                <div className="col-md-6">
                                                                                    <label htmlFor="name" className="form-label">Name</label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <input
                                                                                        id="name"
                                                                                        type="text"
                                                                                        className={`form-control input-field form-control-lg bg-light  ${nameError && 'is-invalid'} `}
                                                                                        placeholder="Name"
                                                                                        value={capitalizeName(name)}
                                                                                        onChange={(event) => {
                                                                                            setName(event.target.value);
                                                                                        }}
                                                                                        readOnly={!editMode}
                                                                                    />
                                                                                    {nameError && <div className="text-danger">{nameError}</div>}

                                                                                </div>

                                                                                <div className="col-md-6">
                                                                                    <label htmlFor="phone" className="form-label">Contact</label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <input
                                                                                        id="phone"
                                                                                        type="number"
                                                                                        className={`form-control input-field form-control-lg bg-light  ${contactError && 'is-invalid'} `}
                                                                                        placeholder="Phone Number"
                                                                                        value={contact}
                                                                                        onChange={(event) => {
                                                                                            setContact(event.target.value);
                                                                                        }}
                                                                                        readOnly={!editMode}
                                                                                    />
                                                                                    {contactError && <div className="text-danger">{contactError}</div>}

                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <input
                                                                                        id="dateOfBirth"
                                                                                        type="date"
                                                                                        value={dateOfBirth}
                                                                                        className={`form-control input-field form-control-lg bg-light  ${dobError && 'is-invalid'} `}
                                                                                        onChange={(event) => {
                                                                                            setDob(event.target.value);
                                                                                            setAge(calculateAge(event.target.value)); // Calculate age

                                                                                        }}
                                                                                        readOnly={!editMode}
                                                                                    />
                                                                                    {dobError && <div className="text-danger">{dobError}</div>}

                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                    <label htmlFor="age" className="form-label">Age</label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <input
                                                                                        id="age"
                                                                                        type="number"
                                                                                        className="form-control input-field form-control-lg bg-light "
                                                                                        placeholder="Age"
                                                                                        value={age}
                                                                                        readOnly // Prevent user input
                                                                                    />
                                                                                </div>

                                                                                <div className="col-md-12 ">
                                                                                    <label className="form-label" htmlFor="gender">
                                                                                        Gender
                                                                                    </label>
                                                                                    <span style={{ color: 'red', marginLeft: '3px' }}>*</span> &nbsp;
                                                                                    <div className="form-check me-2">
                                                                                        <input
                                                                                            className="form-check-input "
                                                                                            type="radio"
                                                                                            name="gender"
                                                                                            id="male"
                                                                                            value="male"
                                                                                            checked={gender === "male"}
                                                                                            onChange={handleGenderChange}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor="male">
                                                                                            Male
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="form-check me-3">
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="radio"
                                                                                            name="gender"
                                                                                            id="female"
                                                                                            value="female"
                                                                                            checked={gender === "female"}
                                                                                            onChange={handleGenderChange}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor="female">
                                                                                            Female
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="radio"
                                                                                            name="gender"
                                                                                            id="other"
                                                                                            value="other"
                                                                                            checked={gender === "other"}
                                                                                            onChange={handleGenderChange}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor="other">
                                                                                            Other
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                {genderError && <div className="text-danger">{genderError}</div>}


                                                                                <div className="col-12">
                                                                                    <label htmlFor="address" className="form-label">Address</label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <textarea
                                                                                        id="address"
                                                                                        className={`form-control input-field form-control-lg bg-light ${addressError && 'is-invalid'} `}
                                                                                        placeholder="Address"
                                                                                        value={address}
                                                                                        onChange={(event) => {
                                                                                            setAddress(event.target.value);
                                                                                        }}
                                                                                        readOnly={!editMode}
                                                                                    />
                                                                                    {addressError && <div className="text-danger">{addressError}</div>}


                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="mb-2"><b className='contentHeadings'>Account details</b></div>
                                                                            <div className="row g-3">
                                                                                <div className="col-md-6">

                                                                                    <div className="form-group ">
                                                                                        <label htmlFor="email" className="form-label">Email</label>
                                                                                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                        <input
                                                                                            id="email"
                                                                                            type="email"
                                                                                            className={`form-control input-field form-control-lg bg-light  ${emailError && 'is-invalid'} `}
                                                                                            placeholder="Email"
                                                                                            value={email}
                                                                                            onChange={(event) => {
                                                                                                setEmail(event.target.value);
                                                                                            }}
                                                                                            readOnly={!editMode}
                                                                                        />
                                                                                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col">
                                                                                    <div className="form-group">
                                                                                        <label className='form-label'>Current Password</label>
                                                                                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                        <input
                                                                                            id="current-password"
                                                                                            className={`form-control input-field form-control-lg bg-light  ${currentPasswordError && 'is-invalid'} `}
                                                                                            type={currentPasswordVisibility ? 'password' : 'text'}
                                                                                            value={currentPassword}
                                                                                            placeholder="••••••"
                                                                                            onChange={(event) => {
                                                                                                setCurrentPassword(event.target.value);
                                                                                            }}
                                                                                            readOnly={!editMode}
                                                                                        />
                                                                                        {currentPasswordError && <div className="invalid-feedback">{currentPasswordError}</div>}

                                                                                        <button
                                                                                            className="btn btn-password-toggle1"
                                                                                            type="button"
                                                                                            onClick={toggleCurrentPasswordVisibility}
                                                                                        >
                                                                                            <FontAwesomeIcon icon={currentPasswordVisibility ? faEyeSlash : faEye} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col">
                                                                                    <label htmlFor="new-password" className="form-label"> New Password </label>
                                                                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                    <input
                                                                                        id="new-password"
                                                                                        className={`form-control input-field form-control-lg bg-light  ${passwordError && 'is-invalid'} `}
                                                                                        type={newPasswordVisibility ? 'password' : 'text'}
                                                                                        placeholder="••••••"
                                                                                        value={password}
                                                                                        onChange={(event) => {
                                                                                            setNewPassword(event.target.value);
                                                                                        }}
                                                                                        readOnly={!editMode}
                                                                                    />
                                                                                    <button
                                                                                        className="btn btn-password-toggle1"
                                                                                        type="button"
                                                                                        onClick={toggleNewPasswordVisibility}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={newPasswordVisibility ? faEyeSlash : faEye} />
                                                                                    </button>
                                                                                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}

                                                                                </div>

                                                                                <div className="col">
                                                                                    <div className="form-group">
                                                                                        <label className='form-label'>Confirm <span className="d-none d-xl-inline ">Password</span></label>
                                                                                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                                        <input
                                                                                            id="confirm-password"
                                                                                            className={`form-control input-field form-control-lg bg-light  ${passwordMatchError && 'is-invalid'} `}
                                                                                            type={confirmPasswordVisibility ? 'password' : 'text'}
                                                                                            placeholder="••••••"
                                                                                            value={confirmPassword}
                                                                                            onChange={(event) => {
                                                                                                setConfirmPassword(event.target.value);
                                                                                            }}
                                                                                            readOnly={!editMode}
                                                                                        />
                                                                                        <button
                                                                                            className="btn btn-password-toggle1"
                                                                                            type="button"
                                                                                            onClick={toggleConfirmPasswordVisibility}
                                                                                        >
                                                                                            <FontAwesomeIcon icon={confirmPasswordVisibility ? faEyeSlash : faEye} />
                                                                                        </button>
                                                                                        {passwordMatchError && <div className="text-danger">{passwordMatchError}</div>}

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                </>
                                                                <>
                                                                    <div className="row">
                                                                        <div className="col"></div>
                                                                        <div className="mb-2"><b className='contentHeadings'>Work details</b></div>
                                                                        <div className="row g-3">
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="qualification" input-field className="form-label">Qualification</label>
                                                                                <input
                                                                                    id="dayOfWork"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Qualification"
                                                                                    value={qualification}
                                                                                    readOnly
                                                                                />
                                                                            </div>

                                                                            <div className="col-md-6">
                                                                                <label htmlFor="designation" className="form-label">Designation</label>
                                                                                <input
                                                                                    id="designation"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Designation"
                                                                                    value={designation}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row g-3">
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="specialities" input-field className="form-label">Specialities</label>
                                                                                <input
                                                                                    id="dayOfWork"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Specialities"
                                                                                    value={specialities}
                                                                                    readOnly
                                                                                />
                                                                            </div>

                                                                            <div className="col-md-6">
                                                                                <label htmlFor="designation" className="form-label">Department</label>
                                                                                <input
                                                                                    id="department"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="department"
                                                                                    value={department}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row g-3">
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="specialities" input-field className="form-label">Morning time</label>
                                                                                <input
                                                                                    id="morningTime"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Morning time"
                                                                                    value={morningTime}
                                                                                    readOnly
                                                                                />
                                                                            </div>

                                                                            <div className="col-md-6">
                                                                                <label htmlFor="eveningTiming" className="form-label">Evening Time</label>
                                                                                <input
                                                                                    id="eveningTime"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Evening time"
                                                                                    value={eveningTiming}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row g-3">                                                                       
                                                                            <div className="col-md-6">
                                                                                <label htmlFor="visitingDays" className="form-label">Visiting Days</label>
                                                                                <input
                                                                                    id="visitingDays"
                                                                                    type="text"
                                                                                    className="form-control input-field form-control-lg bg-light"
                                                                                    placeholder="Visiting Days"
                                                                                    value={visitingDays}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {editMode && (
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <div className="col-12 mt-3">
                                                                                    <button type="submit" className="btn btn-primary float-end" style={{ backgroundColor: '#1977cc' }}>Update</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>

                                                            </form>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
