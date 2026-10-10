import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/css/Global/Header.css";

export default function Header() {
  const userEmail = Cookies.get("email");
  const navigate = useNavigate();

  // State for Side Drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    Cookies.remove("email");
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("role");
    navigate("/login");
    closeMenu();
  };

  return (
    <>
      {/* ================= TOP EMERGENCY BANNER ================= */}
      <div 
        className="px-4 py-2 text-center d-flex items-center justify-content-center gap-3 border-bottom"
        style={{
          backgroundColor: "#dce9ff",
          borderColor: "rgba(191, 199, 210, 0.4)",
          fontSize: "12px",
          color: "#3f4850"
        }}
      >
        <div className="d-inline-flex align-items-center gap-1 fw-semibold" style={{ color: "#006194" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#006194" }}>verified</span>
          <span>Accredited Clinical Network</span>
        </div>
        <span style={{ color: "#bfc7d2" }}>|</span>
        <span className="d-none d-sm-inline">Immediate Medical Care Required?</span>
        <a 
          className="d-inline-flex align-items-center gap-1 fw-semibold text-decoration-none" 
          href="tel:18002344763"
          style={{ color: "#ba1a1a" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#ba1a1a" }}>emergency</span>
          <span>24/7 Hotline: 1-800-AEGIS-MD</span>
        </a>
      </div>

      {/* ================= STITCH HEADER (TopNavBar) ================= */}
      <header 
        className="sticky-top border-bottom shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#bfc7d2",
          zIndex: 1030
        }}
      >
        <div className="container d-flex justify-content-between align-items-center" style={{ height: "76px" }}>
          
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="d-flex align-items-center gap-3 text-decoration-none">
            <div 
              className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#006194",
                boxShadow: "0 2px 8px rgba(0, 97, 148, 0.25)"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>local_hospital</span>
            </div>
            <div className="d-flex flex-column">
              <span 
                className="fw-bold tracking-tight lh-1" 
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "20px",
                  color: "#006194",
                  letterSpacing: "-0.5px"
                }}
              >
                Aegis<span style={{ color: "#0b1c30" }}>Health</span>
              </span>
              <span 
                className="text-uppercase fw-semibold" 
                style={{
                  fontSize: "10px",
                  color: "#565e74",
                  letterSpacing: "1px"
                }}
              >
                Clinical Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link 
              to="/" 
              onClick={closeMenu} 
              className="text-decoration-none fw-semibold pb-1"
              style={{
                fontSize: "14px",
                color: "#006194",
                borderBottom: "2px solid #006194"
              }}
            >
              Home
            </Link>
            <Link 
              to="/findDoctors" 
              onClick={closeMenu} 
              className="text-decoration-none fw-semibold pb-1"
              style={{
                fontSize: "14px",
                color: "#3f4850",
                borderBottom: "2px solid transparent"
              }}
            >
              Find Doctors
            </Link>
            <a 
              href="/#calculators" 
              className="text-decoration-none fw-semibold pb-1"
              style={{
                fontSize: "14px",
                color: "#3f4850",
                borderBottom: "2px solid transparent"
              }}
            >
              Health Calculators
            </a>
            <a 
              href="/#about" 
              className="text-decoration-none fw-semibold pb-1"
              style={{
                fontSize: "14px",
                color: "#3f4850",
                borderBottom: "2px solid transparent"
              }}
            >
              About
            </a>
          </nav>

          {/* Trailing Action Cluster */}
          <div className="d-flex align-items-center gap-2">
            
            {/* Quick Support Icon Button */}
            <a 
              href="tel:18002344763"
              className="btn btn-light btn-sm rounded-3 p-2 d-none d-sm-inline-flex align-items-center text-secondary border-0"
              title="Clinical Support"
              style={{ backgroundColor: "#eff4ff" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>help</span>
            </a>

            {/* User State */}
            {userEmail ? (
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-3 d-inline-flex align-items-center gap-2 border"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: "#eff4ff", fontSize: "13px" }}
                >
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>account_circle</span>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: "120px" }}>{userEmail}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border rounded-3 p-2" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item rounded-2 py-2" to="/dashboard" onClick={closeMenu}>
                      <span className="material-symbols-outlined align-middle me-2" style={{ fontSize: "18px" }}>dashboard</span>
                      Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button className="dropdown-item rounded-2 py-2 text-danger" onClick={handleLogout}>
                      <span className="material-symbols-outlined align-middle me-2" style={{ fontSize: "18px" }}>logout</span>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-secondary d-none d-sm-inline-flex align-items-center justify-content-center px-3 py-2 rounded-3 fw-semibold text-decoration-none"
                  style={{
                    fontSize: "13px",
                    borderColor: "#bfc7d2",
                    color: "#0b1c30"
                  }}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>

                <Link
                  to="/login"
                  className="btn btn-primary d-inline-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-semibold text-white shadow-sm text-decoration-none"
                  style={{
                    backgroundColor: "#006194",
                    borderColor: "#006194",
                    fontSize: "13px"
                  }}
                  onClick={closeMenu}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock</span>
                  <span>Portal Access</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="btn btn-light d-md-none p-2 rounded-3"
              type="button"
              onClick={toggleMenu}
              aria-label="Open navigation"
              style={{ backgroundColor: "#eff4ff" }}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="d-md-none border-top p-3 bg-white">
            <div className="d-flex flex-column gap-2">
              <Link to="/" onClick={closeMenu} className="btn btn-light text-start py-2 px-3 fw-semibold text-primary">
                Home
              </Link>
              <Link to="/findDoctors" onClick={closeMenu} className="btn btn-light text-start py-2 px-3 fw-semibold text-dark">
                Find Doctors
              </Link>
              <a href="/#calculators" onClick={closeMenu} className="btn btn-light text-start py-2 px-3 fw-semibold text-dark">
                Health Calculators
              </a>
              <a href="/#about" onClick={closeMenu} className="btn btn-light text-start py-2 px-3 fw-semibold text-dark">
                About &amp; Accreditations
              </a>
              {!userEmail && (
                <Link to="/login" onClick={closeMenu} className="btn btn-primary text-center py-2 px-3 fw-bold text-white mt-2" style={{ backgroundColor: "#006194" }}>
                  Sign In / Portal Access
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}