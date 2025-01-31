import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getReceptionistApi } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../actions/submenuActions';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Header() {
    const userRole = Cookies.get('role');
    const userId = Cookies.get('userId');
    const [gender, setGender] = useState('');
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    const [showLogoutCard, setShowLogoutCard] = useState(false);
    const navigate = useNavigate();
    const logoutRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); 

    const setMenu = (menu) => {
        if (activeTab !== menu) {
            dispatch(setActiveTab(menu));
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getReceptionistApi(userId);
                setGender(userData.gender);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchData();
    }, [userId]);

    useEffect(() => {
       const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        updateWindowWidth();

        window.addEventListener('resize', updateWindowWidth);

        function handleClickOutside(event) {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogoutCard(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener('resize', updateWindowWidth);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleLogout = () => {
        Cookies.remove('email');
        Cookies.remove('authToken');
        Cookies.remove('userId');
        navigate('/login');
        window.location.reload();
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
                                {windowWidth >= 992 && (
                                    <>
                                        <div className='headerProfileImg ' onClick={() => setShowLogoutCard(!showLogoutCard)} style={{ cursor: 'pointer' }}>
                                            {gender.toLowerCase() === 'female' && (
                                                <img src="img/female2.png" alt="femaleProfile" />
                                            )}
                                            {gender.toLowerCase() !== 'female' && (
                                                <img src="img/maleRecep.png" alt="maleProfile" />
                                            )}
                                            <div className="row translate-middle-x">
                                                <div className="col">
                                                    <div ref={logoutRef}>
                                                        {showLogoutCard && (
                                                            <div className="card mt-3 border-0 p-2" style={{ width: '140px', marginLeft: '-80px' }}>

                                                                <ul className="list-group list-group-flush" >
                                                                    {userRole === 'Doctor' && (
                                                                        <li className=' d-flex  align-items-center'>
                                                                            <i className="bi bi-person ml-2"></i>
                                                                            <button className="btn" onClick={() => setMenu('doctorProfile')} style={{ fontSize: '14px', color: 'black' }}>
                                                                                Profile
                                                                            </button>
                                                                        </li>                                                                        
                                                                    )}
                                                                    {userRole === 'Receptionist' && (
                                                                        <li className='  d-flex  align-items-center'>
                                                                            <i className="bi bi-person ml-2"></i>
                                                                            <button className="btn" onClick={() => setMenu('receptionistProfile')} style={{ fontSize: '14px', color: 'black' }}>
                                                                                Profile
                                                                            </button>
                                                                        </li>                                    
                                                                    )}
                                                                    {userRole === 'Patient' && (
                                                                        <li className='  d-flex  align-items-center'>
                                                                            <i className="bi bi-person ml-2"></i>
                                                                            <button className="btn" onClick={() => setMenu('patientProfile')} style={{ fontSize: '14px', color: 'black' }}>
                                                                                Profile
                                                                            </button>
                                                                        </li>                                    
                                                                    )}
                                                                    
                                                                    <li className='  d-flex  align-items-center'>
                                                                        <i className="bi bi-box-arrow-left ml-2"></i>
                                                                        <button className="btn" onClick={handleLogout} style={{ fontSize: '14px', color: 'black' }}>
                                                                            Logout
                                                                        </button>                                                                       
                                                                    </li>
                                                                </ul>


                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                )}
                            </nav>
                            <div className="collapse navbar-collapse main-menu-item justify-content-center" id="navbarSupportedContent">
                                <ul className="navbar-nav d-flex flex-column bd-highlight mb-3">
                                    <li className="nav-item ">
                                        <Link className="nav-link dashboardLink" to="/adminDashboard">Dashboard</Link>
                                    </li>
                                    {userRole === 'SuperAdmin' && (
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
                                            <li className="nav-item sidebarNavLinks">
                                                <Link
                                                    className={`nav-link ${activeTab === 'receptionistProfile' ? 'Active' : ''}`}
                                                    onClick={() => setMenu('receptionistProfile')}
                                                >
                                                    Profile
                                                </Link>
                                            </li>

                                            <li className="nav-item sidebarNavLinks">
                                                <Link

                                                    className={`nav-link ${activeTab === 'doctorList' ? 'Active' : ''}`}
                                                    onClick={() => setMenu('doctorList')}
                                                >
                                                    Doctor
                                                </Link>
                                            </li>

                                            <li className="nav-item sidebarNavLinks">
                                                <Link
                                                    className={`nav-link ${activeTab === 'patientsList' ? 'Active' : ''}`}
                                                    onClick={() => setMenu('patientsList')}
                                                >
                                                    Patient
                                                </Link>
                                            </li>

                                            <li className="nav-item sidebarNavLinks">
                                                <Link
                                                    className={`nav-link ${activeTab === 'showAppointments' ? 'Active' : ''}`}
                                                    onClick={() => setMenu('showAppointments')}
                                                >
                                                    Appointments
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
                                                    Appointments
                                                </Link>
                                            </li>

                                            <li className="nav-item sidebarNavLinks">
                                                <Link
                                                    className={`nav-link ${activeTab === 'patientsWithAppointment' ? 'Active' : ''}`}
                                                    onClick={() => setMenu('patientsWithAppointment')}
                                                >
                                                    Patients
                                                </Link>
                                            </li>

                                        </>
                                    )}
                                    <li className="nav-item sidebarNavLinks">
                                        <Link
                                            className="nav-link"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
