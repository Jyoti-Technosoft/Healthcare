import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import { getReceptionistApi, getDoctorsWithIdApi, getPatientApi } from "../Api";
import Cookies from "js-cookie";
import "../../assets/css/Admin/header.css";

/* Images Imports for Mobile Menu */
import dashboardIcon from "../../assets/img/dashboard-icon.png";
import doctorIcon from "../../assets/img/doctor-icon.png";
import patientsIcon from "../../assets/img/patients-icon.png";
import appointmentIcon from "../../assets/img/appointment-icon.png";
import roomIcon from "../../assets/img/room-icon.png";

export default function Header() {
  const userRole = Cookies.get("role");
  const userId = Cookies.get("userId");
  const [gender, setGender] = useState("");
  const [userName, setUserName] = useState(Cookies.get("name") || "");
  const [userImage, setUserImage] = useState("");
  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();

  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logoutRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const setMenu = (menu) => {
    if (activeTab !== menu) dispatch(setActiveTab(menu));
    if (windowWidth < 992) setMenuOpen(false); // Close mobile menu on click
  };

  const goToProfile = () => {
    if (userRole === "Receptionist") setMenu("receptionistProfile");
    else if (userRole === "Doctor") setMenu("doctorProfile");
    else if (userRole === "Patient") setMenu("patientProfile");
    else setMenu("adminProfile");
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = Cookies.get("authToken");
        if (userRole === "Receptionist") {
          const data = await getReceptionistApi(userId);
          setGender(data.gender);
          setUserName(data.name);
        } else if (userRole === "Doctor") {
          const data = await getDoctorsWithIdApi(userId, token);
          setGender(data.gender);
          setUserName(data.name);
          if (data.doctorImageData)
            setUserImage(`data:image/png;base64,${data.doctorImageData}`);
        } else if (userRole === "Patient") {
          const data = await getPatientApi(userId, token);
          setGender(data.gender);
          setUserName(data.name);
        } else {
          setUserName("Admin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, [userId, userRole]);

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateWindowWidth);

    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target))
        setShowLogoutCard(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("email");
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("role");
    Cookies.remove("name");
    navigate("/login");
    window.location.reload();
  };

  const defaultImg =
    gender?.toLowerCase() === "female"
      ? "/img/female2.png"
      : "/img/maleRecep.png";

  // --- UPDATED HELPER COMPONENT ---
  // Now accepts 'isActive' boolean. If not provided, defaults to id match.
  const MenuItem = ({ id, icon, label, isActive }) => {
    // Determine active state: Use passed prop if available, else check ID match
    const activeState = isActive !== undefined ? isActive : activeTab === id;

    return (
      <li className={activeState ? "active" : ""} onClick={() => setMenu(id)}>
        <img src={icon} alt="" />
        <span>{label}</span>
      </li>
    );
  };

  return (
    <>
      <header
        className="navbar navbar-light fixed-top custom-header"
        style={{
          height: windowWidth >= 992 ? "80px" : "65px",
          width: windowWidth >= 992 ? "calc(100% - 266px)" : "100%",
          left: windowWidth >= 992 ? "266px" : "0",
        }}
      >
        <div className="container-fluid header-content px-4">
          {windowWidth < 992 && (
            <>
              <Link
                className="navbar-brand"
                to="#"
                onClick={() => setMenu("dashboard")}
              >
                <img src="img/logo.png" alt="Medico" className="header-logo" />
              </Link>

              <button
                className="navbar-toggler border-0"
                type="button"
                onClick={() => setMenuOpen(true)}
              >
                <i className="bi bi-list toggle-icon"></i>
              </button>
            </>
          )}

          {windowWidth >= 992 && (
            <div className="header-right-box">
              <button className="bell-btn">
                <i className="bi bi-bell"></i>
                <span></span>
              </button>
              <span className="header-username">{userName}</span>
              <div className="profile-box" ref={logoutRef}>
                <img
                  src={userImage || defaultImg}
                  alt="Profile"
                  className="avatar-img"
                  onClick={() => setShowLogoutCard(!showLogoutCard)}
                />
                {showLogoutCard && (
                  <div className="logout-menu">
                    <button onClick={goToProfile}>
                      <i className="bi bi-person"></i> Profile
                    </button>
                    <button onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER (Right Side) */}
      {windowWidth < 992 && (
        <>
          {/* Overlay Backdrop */}
          <div
            className={`mobile-overlay ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar Content */}
          <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
            {/* 1. Header Section: Profile */}
            <div className="ms-header">
              <div className="ms-profile-info" onClick={goToProfile}>
                <img src={userImage || defaultImg} alt="Profile" />
                <div>
                  <h4>{userName}</h4>
                  <p>{userRole}</p>
                </div>
              </div>
              <button
                className="ms-close-btn"
                onClick={() => setMenuOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* 2. Scrollable Menu List */}
            <div className="ms-body">
              <ul className="ms-menu-list">
                <MenuItem
                  id="dashboard"
                  icon={dashboardIcon}
                  label="Dashboard"
                />

                {userRole === "SuperAdmin" && (
                  <MenuItem id="usersList" icon={patientsIcon} label="Users" />
                )}

                {/* --- RECEPTIONIST & ADMIN --- */}
                {(userRole === "Receptionist" || userRole === "Admin") && (
                  <>
                    <MenuItem
                      id="doctorList"
                      icon={doctorIcon}
                      label="Doctor"
                    />
                    {/* UPDATED: Matches Sidebar Logic for Patients */}
                    <MenuItem
                      id="patientsList"
                      icon={patientsIcon}
                      label="Patients"
                      isActive={
                        activeTab === "patientsList" ||
                        activeTab === "registerPatient"
                      }
                    />
                    {/* UPDATED: Matches Sidebar Logic for Appointments */}
                    <MenuItem
                      id="showAppointments"
                      icon={appointmentIcon}
                      label="Appointments"
                      isActive={
                        activeTab === "showAppointments" ||
                        activeTab === "bookAppointment"
                      }
                    />
                  </>
                )}

                {/* --- DOCTOR --- */}
                {userRole === "Doctor" && (
                  <>
                    <MenuItem
                      id="doctorAppointments"
                      icon={appointmentIcon}
                      label="Appointments"
                    />
                    <MenuItem
                      id="patientsWithAppointment"
                      icon={patientsIcon}
                      label="Patients"
                    />
                    {/* UPDATED: Matches Sidebar Logic for Leaves */}
                    <MenuItem
                      id="doctorLeaves"
                      icon={roomIcon}
                      label="Leave Management"
                      isActive={
                        activeTab === "doctorLeaves" ||
                        activeTab === "addDoctorLeaves"
                      }
                    />
                  </>
                )}

                {/* --- PATIENT --- */}
                {userRole === "Patient" && (
                  <>
                    <MenuItem
                      id="doctorList"
                      icon={doctorIcon}
                      label="Doctors"
                    />
                    <MenuItem
                      id="patientAppointments"
                      icon={appointmentIcon}
                      label="Appointments"
                    />
                    <MenuItem
                      id="healthCalculator"
                      icon={roomIcon}
                      label="Health Calculator"
                    />
                  </>
                )}
              </ul>
            </div>

            {/* 3. Footer: Logout */}
            <div className="ms-footer">
              <button onClick={handleLogout} className="ms-logout-btn">
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
