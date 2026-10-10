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
                className="navbar-brand d-flex align-items-center gap-2"
                to="#"
                onClick={() => setMenu("dashboard")}
              >
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center text-white"
                  style={{ width: "28px", height: "28px", backgroundColor: "#006194" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>local_hospital</span>
                </div>
                <span className="fw-bold text-dark" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px" }}>
                  AegisHealth
                </span>
              </Link>

              <button
                className="navbar-toggler border-0"
                type="button"
                onClick={() => setMenuOpen(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#006194" }}>menu</span>
              </button>
            </>
          )}

          {windowWidth >= 992 && (
            <div className="d-flex align-items-center justify-content-between w-100">
              {/* Left Title: Clean Clinical Facility Indicator */}
              <div className="d-flex align-items-center gap-2.5">
                <span className="fw-bold text-dark" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", letterSpacing: "-0.2px" }}>
                  City Central Hospital
                </span>
                <span
                  className="badge rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1.5"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    color: "#059669",
                    fontSize: "11px",
                    fontWeight: "600",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <span className="rounded-circle bg-success d-inline-block" style={{ width: "6px", height: "6px" }}></span>
                  Telemetry Online
                </span>
              </div>

              {/* Right User Controls Cluster */}
              <div className="d-flex align-items-center gap-3">
                {/* Role Workspace Badge */}
                <span
                  className="badge px-3 py-1.5 rounded-pill"
                  style={{
                    backgroundColor: "#eff4ff",
                    color: "#006194",
                    border: "1px solid #dce9ff",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {userRole} Workspace
                </span>

                {/* Notifications Icon Button */}
                <button
                  type="button"
                  className="btn p-0 d-flex align-items-center justify-content-center text-secondary position-relative"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    transition: "all 0.15s ease",
                  }}
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: "20px" }}>notifications</span>
                  <span
                    className="position-absolute rounded-circle bg-danger"
                    style={{ width: "6px", height: "6px", top: "8px", right: "8px" }}
                  ></span>
                </button>

                {/* Profile Pill Trigger */}
                <div className="position-relative" ref={logoutRef}>
                  <button
                    type="button"
                    className="btn d-flex align-items-center gap-2.5 py-1.5 px-2.5 rounded-3 bg-white border"
                    style={{
                      borderColor: "#e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => setShowLogoutCard(!showLogoutCard)}
                  >
                    <img
                      src={userImage || defaultImg}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "32px", height: "32px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                    />
                    <div className="text-start d-none d-sm-block">
                      <span className="d-block text-dark fw-bold leading-tight" style={{ fontSize: "13px", lineHeight: "1.2" }}>
                        {userName}
                      </span>
                      <span className="text-secondary d-block" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {userRole}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>
                      expand_more
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showLogoutCard && (
                    <div
                      className="position-absolute bg-white rounded-3 shadow-lg border p-1"
                      style={{
                        top: "calc(100% + 6px)",
                        right: 0,
                        minWidth: "160px",
                        zIndex: 1100,
                        borderColor: "#e2e8f0",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-sm text-start w-100 d-flex align-items-center gap-2 py-2 px-3 rounded-2 text-dark"
                        style={{ fontSize: "13px", fontWeight: "500" }}
                        onClick={() => {
                          setShowLogoutCard(false);
                          goToProfile();
                        }}
                      >
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>account_circle</span>
                        <span>My Profile</span>
                      </button>
                      <div className="dropdown-divider my-1"></div>
                      <button
                        type="button"
                        className="btn btn-sm text-start w-100 d-flex align-items-center gap-2 py-2 px-3 rounded-2 text-danger"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                        onClick={handleLogout}
                      >
                        <span className="material-symbols-outlined text-danger" style={{ fontSize: "18px" }}>logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
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
