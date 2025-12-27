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
      <header className="main_menu home_menu">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <nav className="navbar navbar-expand-lg navbar-light">
                <Link className="nav-link" to="/" onClick={closeMenu}>
                  <img src="img/logo.png" alt="logo" />
                </Link>

                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleMenu}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                {/* Overlay Backdrop */}
                <div
                  className={`menu-backdrop ${
                    isMenuOpen ? "show-backdrop" : ""
                  }`}
                  onClick={closeMenu}
                ></div>

                {/* Side Drawer */}
                <div
                  className={`collapse navbar-collapse main-menu-item justify-content-center ${
                    isMenuOpen ? "show-menu" : ""
                  }`}
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav align-items-center">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/" onClick={closeMenu}>
                        Home
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/findDoctors"
                        onClick={closeMenu}
                      >
                        Doctors
                      </Link>
                    </li>

                    {/* PAGES DROPDOWN 
                        Links changed to to="/..." so they trigger the 404 Page
                    */}
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Pages
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <Link
                          className="dropdown-item"
                          to="/services" 
                          onClick={closeMenu}
                        >
                          Services
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="/departments"
                          onClick={closeMenu}
                        >
                          Departments
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="/elements"
                          onClick={closeMenu}
                        >
                          Elements
                        </Link>
                      </div>
                    </li>

                    {/* BLOG DROPDOWN */}
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown_1"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Blog
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown_1"
                      >
                        <Link
                          className="dropdown-item"
                          to="/blog"
                          onClick={closeMenu}
                        >
                          Blog
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="/single-blog"
                          onClick={closeMenu}
                        >
                          Single Blog
                        </Link>
                      </div>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/about"
                        onClick={closeMenu}
                      >
                        About
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/contact"
                        onClick={closeMenu}
                      >
                        Contact
                      </Link>
                    </li>

                    {/* LOGIN / PROFILE LOGIC (UNCHANGED) */}
                    {userEmail ? (
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          href="#"
                          id="navbarDropdown_1"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {userEmail}
                        </a>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="navbarDropdown_1"
                        >
                          <Link
                            className="dropdown-item"
                            to="/dashboard"
                            onClick={closeMenu}
                          >
                            Dashboard
                          </Link>
                          <a
                            href="#"
                            className="dropdown-item"
                            style={{ cursor: "pointer" }}
                            onClick={handleLogout}
                          >
                            Logout
                          </a>
                        </div>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/login"
                          onClick={closeMenu}
                        >
                          Login
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                <p className="btn_2 d-none d-lg-block">HOT LINE- 09856</p>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}