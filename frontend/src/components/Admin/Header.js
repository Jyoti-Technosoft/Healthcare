import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUsersApi } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../actions/submenuActions';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Header() {
    const userRole = Cookies.get('role');
    const userId = Cookies.get('userId');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    const [showLogoutCard, setShowLogoutCard] = useState(false);
    const navigate = useNavigate();
    const logoutRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Define windowWidth state

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
        // Function to close logout card when clicked outside
        function handleClickOutside(event) {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogoutCard(false);
            }
        }

        // Adding event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
            <header className="main_menu home_menu shadow p-3 mb-5 bg-body rounded">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light adminNavbar">
                                <Link className="navbar-brand mb-6 navbarLogo" to="/">
                                    <img src="img/logo.png" alt="logo" />
                                </Link>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                {windowWidth > 1023 && (
                                    <>
                                        <div className='headerProfileImg' onClick={() => setShowLogoutCard(!showLogoutCard)} style={{ cursor: 'pointer' }}>
                                            {gender.toLowerCase() === 'female' && (
                                                <img src="img/female2.png" alt="femaleProfile" />
                                            )}
                                            {gender.toLowerCase() !== 'female' && (
                                                <img src="img/maleRecep.png" alt="maleProfile" />
                                            )}
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col">
                                                <div ref={logoutRef} className='logoutCardContainer'>
                                                    {showLogoutCard && (
                                                        <div className="card mt-4 position-absolute translate-middle-x border-0" style={{ width: '130px', height: '80px' }}>
                                                            <ul className="list-group list-group-flush">
                                                                <li className='listHeader1'>

                                                                    <Link
                                                                        onClick={() => setMenu('doctorProfile')}
                                                                        style={{ color: 'black' }}
                                                                        className={`nav-link ${activeTab === 'doctorProfile' ? 'active' : ''}`}
                                                                    >
                                                                        <i className="bi bi-person headerIcon"  ></i>
                                                                        Profile
                                                                    </Link>
                                                                </li>
                                                                <li className='listHeader2 d-flex justify-content-between align-items-center'> {/* Added d-flex and justify-content-between classes */}
                                                                    <button className="btn" onClick={handleLogout} style={{ width: '200px', fontSize: '14px', color: 'black' }}>
                                                                        <i className="bi bi-box-arrow-left headerIcon"></i>Logout
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </nav>
                            <div class="collapse navbar-collapse main-menu-item justify-content-center" id="navbarSupportedContent">
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
                                                    className={`nav-link ${activeTab === 'doctorList' ? 'active' : ''}`}
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
