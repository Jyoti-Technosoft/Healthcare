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

    // Inside your Header component
    useEffect(() => {
        // Define a function to update window width
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        // Call the function once when the component mounts to set the initial window width
        updateWindowWidth();

        // Add event listener to update window width whenever the window is resized
        window.addEventListener('resize', updateWindowWidth);

        // Function to close logout card when clicked outside
        function handleClickOutside(event) {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                setShowLogoutCard(false);
            }
        }
        // Adding event listener to the document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function to remove event listener when the component unmounts
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
                                                    <div ref={logoutRef} className='logoutCardContainer '>
                                                        {showLogoutCard && (
                                                            <div className="card mt-3 border-0" style={{ width: '140px', height: '80px', marginLeft: '-90px' }}>

                                                                <ul className="list-group list-group-flush" style={{ marginTop: '-12px' }}>
                                                                    {userRole === 'Doctor' && (
                                                                        <li className='listHeader1 d-flex justify-content-between align-items-center'>
                                                                            <i className="bi bi-person "></i>
                                                                            <button className={`btn ${activeTab === 'doctorProfile' ? 'active' : ''}`} onClick={() => setMenu('doctorProfile')} style={{ width: '100px', fontSize: '14px', color: 'black' }}>
                                                                                Profile
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    {userRole === 'Receptionist' && (
                                                                        <li className='listHeader1 d-flex justify-content-between align-items-center'>
                                                                            <i className="bi bi-person "></i>
                                                                            <button className={`btn ${activeTab === 'receptionistProfile' ? 'Active' : ''}`} onClick={() => setMenu('receptionistProfile')} style={{ width: '100px', fontSize: '14px', color: 'black' }}>
                                                                                Profile
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    <li className='listHeader1 d-flex justify-content-between align-items-center'>
                                                                        <i className="bi bi-box-arrow-left "></i>
                                                                        <button className="btn" onClick={handleLogout} style={{ width: '100px', fontSize: '14px', color: 'black' }}>
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
                            <div class="collapse navbar-collapse main-menu-item justify-content-center" id="navbarSupportedContent">
                                <ul class="navbar-nav d-flex flex-column bd-highlight mb-3">
                                    <li class="nav-item ">
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
