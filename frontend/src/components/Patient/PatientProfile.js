import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getPatientApi } from "../Api";
import { format } from 'date-fns'; // Import format function from date-fns
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { updatePatientProfileApi } from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function PatientProfile() {
  const userId = Cookies.get("userId");
  const roleCookie = Cookies.get('role');
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
  const [weight,setWeight]=useState("");
  const [height,setHeight]=useState("");
  const [patientId, setPatientId] = useState("");
  const [editMode, setEditMode] = useState(false); // State to track whether fields are in edit mode

  const [passwordFromDatabase, setPasswordFromDatabase] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(true);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);

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
        const userData = await getPatientApi(userId,authToken);
        console.log(userData);
        setEmail(userData.user.email);
        setPatientId(userData.id);
        setName(userData.name);
        setRole(userData.user.role);
        setPasswordFromDatabase(userData.user.password);
        setContact(userData.contact);
        const formattedDate = new Date(userData.dateOfBirth).toISOString().substr(0, 10);
        setDob(formattedDate);
        setAge(userData.age);
        setGender(userData.gender);
        setAddress(userData.address);
        setWeight(userData.weight);
        setHeight(userData.height);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updatePatientProfileApi(patientId, email, currentPassword, password, name, contact, gender, dateOfBirth, address, age, weight, height);    
      toast.success('Profile updated successfully');
      //window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };
  return (
    <div className='background_part mt-3'>
      <div className="container">
        <div className="row flex-lg-nowrap">
          <div className="col">
            <div className="row">
              <div className="col mb-3">
                <div className="card border-0 mb-3 shadow  bg-white rounded">
                  <div className="card-body">
                    <div className="">
                      <div className="row">                 
                        <div className="col d-flex flex-column flex-sm-row justify-content-between mb-3">
                          <div className="text-center text-sm-left mb-2 mb-sm-0">
                            <h4 className="pt-sm-2 pb-1 mb-0 updateProfileHeading"><b className='contentHeadings' style={{ color: 'black' }}>Patient Profile</b></h4>
                          </div>
                          <div className="text-center text-sm-right profileHead">
                            <span className="badge badge-secondary">{role}</span>
                            
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
                              <form className="form">
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
                                            className="form-control input-field form-control-lg bg-light "                                            
                                            placeholder="Name"
                                            value={capitalizeName(name)}
                                            onChange={(event) => {
                                              setName(event.target.value);
                                            }}
                                            readOnly={!editMode}
                                          />
                                          

                                        </div>

                                        <div className="col-md-6">
                                          <label htmlFor="phone" className="form-label">Contact</label>
                                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                          <input
                                            id="phone"
                                            type="number"
                                            className="form-control input-field form-control-lg bg-light "                                            
                                            placeholder="Phone Number"
                                            value={contact}
                                            onChange={(event) => {
                                              setContact(event.target.value);
                                            }}
                                            readOnly={!editMode}
                                          />

                                        </div>
                                        <div className="col-md-6">
                                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                          <input
                                            id="dateOfBirth"
                                            type="date"
                                            value={dateOfBirth}
                                            className="form-control input-field form-control-lg bg-light "                                            
                                            onChange={(event) => {
                                              setDob(event.target.value);
                                              setAge(calculateAge(event.target.value)); // Calculate age

                                            }}
                                            readOnly={!editMode}
                                          />

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

                                        <div className="col-md-6">
                                          <label htmlFor="weight" className="form-label">Weight</label>
                                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                          <input
                                            id="weight"
                                            type="text"
                                            className="form-control input-field form-control-lg bg-light "                                            
                                            placeholder="Weight"
                                            value={weight}
                                            onChange={(event) => {
                                              setWeight(event.target.value);
                                            }}
                                            readOnly={!editMode}
                                          />

                                        </div>
                                        <div className="col-md-6">
                                          <label htmlFor="height" className="form-label">Height</label>
                                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                          <input
                                            id="height"
                                            type="text"
                                            className="form-control input-field form-control-lg bg-light "
                                            placeholder="Height"
                                            value={height}
                                            onChange={(event) => {
                                              setHeight(event.target.value);
                                            }}
                                            readOnly={!editMode}
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
                                              value="Male"
                                              checked={gender === "Male"}
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
                                              value="Female"
                                              checked={gender === "Female"}
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

                                        <div className="col-12">
                                          <label htmlFor="address" className="form-label">Address</label>
                                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                          <textarea
                                            id="address"
                                            className="form-control input-field form-control-lg bg-light "                                            placeholder="Address"
                                            value={address}
                                            onChange={(event) => {
                                              setAddress(event.target.value);
                                            }}
                                            readOnly={!editMode}
                                          />
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
                                              className="form-control input-field form-control-lg bg-light "                                              placeholder="Email"
                                              value={email}
                                              onChange={(event) => {
                                                setEmail(event.target.value);
                                              }}
                                              readOnly={!editMode}
                                            />
                                          </div>
                                        </div>
                                        <div className="col">
                                          <div className="form-group">
                                            <label className='form-label'>Current Password</label>
                                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                            <input
                                              id="current-password"
                                              className="form-control input-field form-control-lg bg-light "                                              type={currentPasswordVisibility ? 'password' : 'text'}
                                              value={currentPassword}
                                              placeholder="••••••"
                                              onChange={(event) => {
                                                setCurrentPassword(event.target.value);
                                              }}
                                              readOnly={!editMode}
                                            />

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
                                            className="form-control input-field form-control-lg bg-light "                                            type={newPasswordVisibility ? 'password' : 'text'}
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

                                        </div>

                                        <div className="col">
                                          <div className="form-group">
                                            <label className='form-label'>Confirm <span className="d-none d-xl-inline ">Password</span></label>
                                            <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                            <input
                                              id="confirm-password"
                                              className="form-control input-field form-control-lg bg-light "                                              type={confirmPasswordVisibility ? 'password' : 'text'}
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

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />
                                </>
                                <>                  
                                  {editMode && (
                                    <div className="row">
                                      <div className="col">
                                        <div className="col-12 mt-3">
                                          <button type="submit" onClick={handleSubmit} className="btn btn-primary float-end" style={{ backgroundColor: '#1977cc' }}>Update</button>
                                          
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
      <ToastContainer position="bottom-right"/>
    </div>
  )
}
