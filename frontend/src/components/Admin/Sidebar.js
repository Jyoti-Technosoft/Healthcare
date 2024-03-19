import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterUsers from './RegisterUsers';
import RegisterPatient from './RegisterPatient';
import ReceptionistProfile from '../Receptionist/ReceptionistProfile';
import BookAppointment from '../Receptionist/BookAppointment';
import PatientList from '../Receptionist/PatientList';
import DoctorList from '../Receptionist/DoctorList';
import DoctorProfile from '../Doctor/DoctorProfile';
import ShowAppointments from '../Receptionist/ShowAppointments';
import MainDashboard from '../MainDashboard';
import Dashboard from '../Dashboard';
import Cookies from 'js-cookie';
import { getDoctorsWithIdApi, getUsersApi } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import Appointments from '../Doctor/Appointments';
import Patients from '../Doctor/Patients';
import {
  setActiveTab,
} from '../../actions/submenuActions';
import { faClipboardQuestion, faDisplay } from '@fortawesome/free-solid-svg-icons';

export function renderSidebarComponent(activeTab) {
  switch (activeTab) {
    case 'dashboard':
      return <MainDashboard />;
    case 'registerUsers':
      return <RegisterUsers />;
    case 'registerPatient':
      return <RegisterPatient />;
    case 'receptionistProfile':
      return <ReceptionistProfile />;
    case 'bookAppointment':
      return <BookAppointment />;
    case 'patientsList':
      return <PatientList />;
    case 'doctorList':
      return <DoctorList />;
    case 'doctorProfile':
      return <DoctorProfile />;
    case 'doctorAppointments':
      return <Appointments />;
    case 'showAppointments':
      return <ShowAppointments />;
    case 'patientsWithAppointment':
      return <Patients />;
    default:
      return <MainDashboard />;
  }
}

export default function Sidebar() {
  const userId = Cookies.get('userId');
  const userRole = Cookies.get('role');
  const authToken = Cookies.get('authToken');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [doctorImage, setDoctorImage] = useState([]);
  const [designation, setDesignation] = useState([]);
  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();
  const setMenu = (menu) => {
    if (activeTab !== menu) {
      dispatch(setActiveTab(menu));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUsersApi(userId);
        setName(userData.name);
        setGender(userData.gender);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchDoctorsWithId() {
      try {
        const userData = await getDoctorsWithIdApi(userId, authToken);
        setName(userData.name);
        setDoctorImage(userData.doctorImageData);
        setDesignation(userData.designation);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchDoctorsWithId();
  }, []);
  const decodeBase64Image = (base64String) => {
    return `data:image/png;base64,${base64String}`;
  };

  

  return (
    <>
      <nav className="adminSidebar shadow-lg d-none d-md-block">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex sidebarHeading flex-column align-items-center">
                {userRole === 'Receptionist' || userRole === 'admin' ? (
                  <div className='sidebarProfileImg'>
                    {gender.toLowerCase() === 'female' ? (
                      <img src="img/female2.png" alt="femaleProfile" />
                    ) : (
                      <img src="img/maleRecep.png" alt="maleProfile" />
                    )}
                  </div>
                ) : (
                  <div className='sidebarDoctorProfileImg'>
                    {userRole === 'Doctor' && (
                      <img
                        src={decodeBase64Image(doctorImage)}
                        className="rounded"
                        alt="Doctor image"
                        style={{ marginTop: '-10px', width: '250px' }}
                      />
                    )}
                  </div>
                )}

                <h5><b className='contentHeadings'>{name}</b></h5>
                <h6 style={{ fontFamily: 'Poppins', fontWeight: 'normal', fontSize: '13px' }}>{userRole}</h6>
                {userRole === 'Doctor' && (
                  <>
                    <h6 style={{ fontFamily: 'Poppins', fontWeight: 'normal', fontSize: '10px' }}>{designation}</h6>
                  </>
                )}
                <hr className="w-100" style={{ color: 'grey' }} />
              </div>

              
                <div>
                  <ul className="flex-column sidebarNav bd-highlight mb-3">
                    <li className="nav-item sidebarNavLinks">
                      <Link
                        className={`nav-link ${activeTab === 'dashboard' ? 'Active' : ''}`}
                        onClick={() => setMenu('dashboard')}>
                        <i className="bi bi-speedometer2 sidebarIcon"></i>Dashboard
                      </Link>
                    </li>

                    {userRole === 'Admin' && (
                      <>
                        <li className="dropdown nav-item sidebarNavLinks">
                          <Link
                            className="nav-link dropdown-toggle"
                            to="#"
                            id="navbarDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="bi bi-person sidebarIcon"></i>
                            Users
                          </Link>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link
                              className={`dropdown-item ${activeTab === 'patientsList' ? '' : ''}`}
                              onClick={() => setMenu('patientsList')}
                            >
                              All Users
                            </Link>
                            <Link
                              className={`dropdown-item ${activeTab === 'registerUsers' ? 'active' : ''}`}
                              onClick={() => setMenu('registerUsers')}
                            >
                              Register Users
                            </Link>
                          </div>
                        </li>
                      </>
                    )}
                    {userRole === 'Receptionist' && (
                      <>
                        <li className="nav-item sidebarNavLinks">
                          <Link
                            className={`nav-link ${activeTab === 'receptionistProfile' ? 'Active' : ''}`}
                            onClick={() => setMenu('receptionistProfile')}
                          >
                            <i class="bi bi-person-badge sidebarIcon"></i>Profile
                          </Link>
                        </li>

                        <li className="nav-item sidebarNavLinks">
                          <Link

                            className={`nav-link ${activeTab === 'doctorList' ? 'Active' : ''}`}
                            onClick={() => setMenu('doctorList')}
                          >
                            <i class="fas fa-user-md sidebarIcon"></i>Doctor
                          </Link>
                        </li>

                        <li className="nav-item sidebarNavLinks">
                          <Link
                            className={`dropdown-item ${activeTab === 'patientsList' ? 'Active' : ''}`}
                            onClick={() => setMenu('patientsList')}
                          >
                            <i className="bi bi-person-plus sidebarIcon"></i>Patient
                          </Link>
                        </li>

                        <li className="nav-item sidebarNavLinks">
                          <Link
                            className={`dropdown-item ${activeTab === 'showAppointments' ? 'Active' : ''}`}
                            onClick={() => setMenu('showAppointments')}
                          >
                            <i class="bi bi-calendar-week sidebarIcon"></i>Appointments
                          </Link>
                        </li>
                      </>
                    )}
                    {userRole === 'Doctor' && (
                      <>
                        <li className="nav-item sidebarNavLinks">
                          <Link
                            className={`nav-link ${activeTab === 'doctorAppointments' ? 'Active' : ''}`}
                            onClick={() => setMenu('doctorAppointments')}
                          >
                            <i class="bi bi-calendar-week sidebarIcon"></i>Appointments
                          </Link>
                        </li>

                        <li className="nav-item sidebarNavLinks">
                          <Link
                            className={`nav-link ${activeTab === 'patientsWithAppointment' ? 'Active' : ''}`}
                            onClick={() => setMenu('patientsWithAppointment')}
                          >
                            <i class="bi bi-people sidebarIcon"></i>Patients
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              
            </div>
          </div>
        </div>
      </nav>

      
    </>
  );
}
