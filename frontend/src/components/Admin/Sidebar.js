import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterUsers from './RegisterUsers';
import RegisterPatient from './RegisterPatient';
import ReceptionistProfile from '../Receptionist/ReceptionistProfile'
import BookAppointment from '../Receptionist/BookAppointment';
import Cookies from 'js-cookie';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveRegisterUsers, setActiveProfileSubMenu, setActivePatientMenu,setBookAppointmentMenu } from '../../actions/submenuActions';

export default function Sidebar() {
  const activeRegisterUsers = useSelector((state) => state.submenu.activeRegisterUsers);
  const activeProfileSubMenu = useSelector((state)=>state.submenu.activeProfileSubMenu);
  const activePatientMenu = useSelector((state)=>state.submenu.activePatientMenu);
  const activeBookAppointmentMenu = useSelector((state)=>state.submenu.activeBookAppointmentMenu);
  const userRole = Cookies.get('role');
  const dispatch = useDispatch();

  const toggleSubMenu = (submenu) => {
    dispatch(setActiveRegisterUsers(submenu));
    dispatch(setActiveProfileSubMenu(submenu));
    dispatch(setActivePatientMenu(submenu));
    dispatch(setBookAppointmentMenu(submenu));

  };


  return (
    <>
      <div className="adminSidebar shadow-sm">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex flex-column align-items-center adminLogo">
                <Link className="navbar-brand mb-4 mt-3 " to="/">
                  <img src="img/logo.png" alt="logo" />
                </Link>
                <hr className="w-100" style={{ color: 'grey' }} />
              </div>

              <nav className="navbar navbar-expand-lg navbar-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                  data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                  aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav flex-column">
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminDashboard">Dashboard</Link>
                    </li>
                    {userRole === 'Admin' && (
                      <>
                        <li className="nav-item">
                          <button
                            className={`nav-link btn btn-link ${activeRegisterUsers === 'registerUsers' ? 'active' : ''}`}
                            onClick={() => toggleSubMenu('registerUsers')}
                          >
                            Register Users
                          </button>
                        </li>

                      </>
                    )}
                    {userRole === 'Receptionist' && (
                      <>
                        <li className="nav-item">
                          <button
                            className={`nav-link btn btn-link ${activeProfileSubMenu === 'receptionistProfile' ? 'active' : ''}`}
                            onClick={() => toggleSubMenu('receptionistProfile')}
                          >
                            Profile
                          </button>
                        </li>
                        <li className="nav-item dropdown">
                          <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Patient
                          </Link>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className={`dropdown-item ${activePatientMenu === 'patientsList' ? 'active' : ''}`} to="/patientsList">Receptionist List</Link>
                            <button className={`dropdown-item ${activePatientMenu === 'registerPatient' ? 'active' : ''}`} onClick={() => toggleSubMenu('registerPatient')}>Add Patient</button>
                          </div>
                        </li>
                        <li className="nav-item dropdown">
                          <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Appointments
                          </Link>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className={`dropdown-item ${activeBookAppointmentMenu === 'patientsList' ? 'active' : ''}`} to="/patientsList">Receptionist List</Link>
                            <button className={`dropdown-item ${activeBookAppointmentMenu === 'bookAppointment' ? 'active' : ''}`} onClick={() => toggleSubMenu('bookAppointment')}>Book Appointments</button>

                          </div>
                        </li>
                      </>

                    )}

                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {activeRegisterUsers === 'registerUsers' && <RegisterUsers />}
      {activePatientMenu === 'registerPatient' && <RegisterPatient />}
      {activeProfileSubMenu === 'receptionistProfile' && <ReceptionistProfile />}
      {activeProfileSubMenu === 'bookAppointment' && <BookAppointment />}


    </>
  );
}
