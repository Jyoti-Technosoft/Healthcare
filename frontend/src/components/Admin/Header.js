import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterUsers from './RegisterUsers';
import RegisterPatient from './RegisterPatient';
import ReceptionistProfile from '../Receptionist/ReceptionistProfile'
import BookAppointment from '../Receptionist/BookAppointment';
import Cookies from 'js-cookie';
import { getUsersApi } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveRegisterUsers, setActiveProfileSubMenu, setActivePatientMenu, setBookAppointmentMenu, setDoctorListMenu, setActiveTab } from '../../actions/submenuActions';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const userRole = Cookies.get('role');
    const userId = Cookies.get('userId');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const activeRegisterUsers = useSelector((state) => state.submenu.activeRegisterUsers);
    const activeProfileSubMenu = useSelector((state) => state.submenu.activeProfileSubMenu);
    const activePatientMenu = useSelector((state) => state.submenu.activePatientMenu);
    const activeBookAppointmentMenu = useSelector((state) => state.submenu.activeBookAppointmentMenu);
    const doctorListMenu = useSelector((state) => state.submenu.doctorListMenu);
    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showLogoutCard, setShowLogoutCard] = useState(false);
    const navigate = useNavigate();
    const activeTab = useSelector((state) => state.submenu.activeTab);
    
    const setMenu = (menu) => {
        debugger
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

    const handleLogout = () => {
        // Remove the cookie
        Cookies.remove('email');
        Cookies.remove('authToken');
        Cookies.remove('userId');
        navigate('/login');
    };
    return (
        <>
            <header className="main_menu home_menu shadow p-3 mb-5 bg-body rounded" >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light adminNavbar">
                                {/* Logo */}
                                <Link className="navbar-brand mb-6 navbarLogo" to="/">
                                    <img src="img/logo.png" alt="logo" />
                                </Link>

                                {/* Hamburger button */}
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                {windowWidth > 1023 && (
                                    <>
                                        {/* <form className="d-flex mainSeachHeader">
                                            <div className="input-group">
                                                <input className="form-control me-2 searchInput" style={{ width: '550px' }} type="search" placeholder="Search" aria-label="Search" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                                </div>
                                            </div>
                                        </form> */}

                                        <div className='headerProfileImg ' onClick={() => setShowLogoutCard(!showLogoutCard)} style={{ cursor: 'pointer' }}>
                                            {gender.toLowerCase() === 'female' && (
                                                <img src="img/female2.png" alt="femaleProfile" />
                                            )}
                                            {gender.toLowerCase() !== 'female' && (
                                                <img src="img/maleRecep.png" alt="maleProfile" />
                                            )}
                                        </div>

                                        {showLogoutCard && (
                                            <div className="logoutCardContainer">
                                                <div className="card border-0 logoutCard">
                                                    <i class="bi bi-box-arrow-right"></i>
                                                    <div className="card-body logoutBtn">
                                                        <button className="btn " onClick={handleLogout}>Logout</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </nav>


                            <div class="collapse navbar-collapse main-menu-item justify-content-center"
                                id="navbarSupportedContent">
                                <ul class="navbar-nav d-flex flex-column bd-highlight mb-3">
                                    <li class="nav-item ">
                                        <Link className="nav-link dashboardLink" to="/adminDashboard">Dashboard</Link>
                                    </li>
                                    {userRole === 'Admin' && (
                                        <>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link btn btn-link ${activeTab === 'registerUsers' ? 'active' : ''}`}
                                                    onClick={() => setMenu('registerUsers')}
                                                >
                                                    Register Users
                                                </button>
                                            </li>
                                        </>
                                    )}
                                    {userRole === 'Receptionist' && (
                                        <>
                                            <li className="nav-item">
                                                <Link className={`nav-link profileLink ${activeTab === 'receptionistProfile' ? 'active' : ''}`}
                                                    onClick={() => setMenu('receptionistProfile')}>Profile</Link>
                                            </li>
                                            <li className="nav-item sidebarNavLinks">
                                                <Link

                                                    className={`nav-link ${doctorListMenu === 'doctorList' ? 'active' : ''}`}
                                                    onClick={() => setMenu('doctorList')}
                                                >
                                                    Doctor
                                                </Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Patient
                                                </Link>
                                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                    <Link className={`dropdown-item ${activeTab === 'patientsList' ? 'active' : ''}`} to="/patientsList">Receptionist List</Link>
                                                    <Link className={`dropdown-item ${activeTab === 'registerPatient' ? 'active' : ''}`} onClick={() => setMenu('registerPatient')}>Add Patient</Link>
                                                </div>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Appointments
                                                </Link>
                                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                    <Link className={`dropdown-item ${activeTab === 'patientsList' ? 'active' : ''}`} to="/patientsList">Receptionist List</Link>
                                                    <Link className={`dropdown-item ${activeTab === 'bookAppointment' ? 'active' : ''}`} onClick={() => setMenu('bookAppointment')}>Book Appointments</Link>
                                                </div>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>
    );
}
