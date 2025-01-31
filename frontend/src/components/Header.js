import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export default function Header() {
    const userEmail = Cookies.get('email');
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('email');
        Cookies.remove('authToken');
        Cookies.remove('userId');
        
        navigate('/login');
    };
    return (
        <>
            <header className="main_menu home_menu">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <Link className="nav-link" to="/"> <img src="img/logo.png" alt="logo" /> </Link>

                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span> 
                                </button>

                                <div className="collapse navbar-collapse main-menu-item justify-content-center"
                                    id="navbarSupportedContent">
                                    <ul className="navbar-nav align-items-center">
                                        <li className="nav-item active">
                                            <Link className="nav-link" to="/">Home</Link>
                                        </li>

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/findDoctors">Doctors</Link>
                                        </li>

                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown"
                                                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Pages
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <a className="dropdown-item" href="services.html">services</a>
                                                <a className="dropdown-item" href="dep.html">depertments</a>
                                                <a className="dropdown-item" href="elements.html">Elements</a>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown_1"
                                                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                blog
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="navbarDropdown_1">
                                                <a className="dropdown-item" href="blog.html">blog</a>
                                                <a className="dropdown-item" href="single-blog.html">Single blog</a>
                                            </div>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="about.html">about</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="contact.html">Contact</a>
                                        </li>
                                        {userEmail ? (
                                            <li className="nav-item dropdown">
                                                <a className="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown_1"
                                                    role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    {userEmail}
                                                </a>
                                                <div className="dropdown-menu" aria-labelledby="navbarDropdown_1">
                                                    <a href='#' className="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</a>
                                                </div>
                                            </li>
                                        ) : (
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/login">Login</Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <p  className="btn_2 d-none d-lg-block" >HOT LINE- 09856</p>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
