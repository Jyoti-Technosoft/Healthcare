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
import UserList from './UserList';
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
    case 'usersList':
      return <UserList />
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

  console.log("Name: " + name);

  return (
    <div style={{ width: '200px' }}>
      <nav className="adminSidebar shadow-lg d-none d-md-block">
        <div className="container adminSidebarContainer">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex sidebarHeading flex-column align-items-center">
                {userRole === 'Receptionist' ? (
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
                {(userRole === 'SuperAdmin' || userRole === 'Admin') && (
                  <div className='sidebarProfileImg'>
                    <img src="img/maleRecep.png" alt="maleProfile" />
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



                  {userRole === 'SuperAdmin' && (
                    <>

                      <li className="nav-item sidebarNavLinks">
                        <Link
                          className={`nav-link ${activeTab === 'usersList' ? 'Active' : ''}`}
                          onClick={() => setMenu('usersList')}
                        >
                          <i class="bi bi-people sidebarIcon"></i>Users
                        </Link>
                      </li>
                      {/* <li className="nav-item sidebarNavLinks">
                        <Link
                          className={`dropdown-item ${activeTab === 'showAppointments' ? 'Active' : ''}`}
                          onClick={() => setMenu('showAppointments')}
                        >
                          <i class="bi bi-calendar-week sidebarIcon"></i>Appointments
                        </Link>
                      </li> */}
                    </>
                  )}

                  

                  {(userRole === 'Receptionist' || userRole === 'Admin') && (
                    <>

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


    </div>
  );
}
