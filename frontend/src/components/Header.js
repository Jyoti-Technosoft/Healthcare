import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export default function Header() {
    const userEmail = Cookies.get('email');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the cookie
        Cookies.remove('email');
        Cookies.remove('authToken');
        Cookies.remove('userId');
        
        navigate('/login');
    };
    return (
        <>
            {/* header part start:: */}
            <header class="main_menu home_menu">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-12">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <Link className="nav-link" to="/"> <img src="img/logo.png" alt="logo" /> </Link>

                                <button class="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span> 
                                </button>

                                <div class="collapse navbar-collapse main-menu-item justify-content-center"
                                    id="navbarSupportedContent">
                                    <ul class="navbar-nav align-items-center">
                                        <li class="nav-item active">
                                            <Link className="nav-link" to="/">Home</Link>
                                        </li>

                                        <li class="nav-item">
                                            <Link className="nav-link" to="/findDoctors">Doctors</Link>
                                        </li>

                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown"
                                                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Pages
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <a class="dropdown-item" href="services.html">services</a>
                                                <a class="dropdown-item" href="dep.html">depertments</a>
                                                <a class="dropdown-item" href="elements.html">Elements</a>
                                            </div>
                                        </li>
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown_1"
                                                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                blog
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown_1">
                                                <a class="dropdown-item" href="blog.html">blog</a>
                                                <a class="dropdown-item" href="single-blog.html">Single blog</a>
                                            </div>
                                        </li>

                                        <li class="nav-item">
                                            <a class="nav-link" href="about.html">about</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="contact.html">Contact</a>
                                        </li>
                                        {userEmail ? (
                                            <li className="nav-item dropdown">
                                                <a class="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown_1"
                                                    role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    {userEmail}
                                                </a>
                                                <div class="dropdown-menu" aria-labelledby="navbarDropdown_1">
                                                    <a class="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</a>

                                                </div>
                                            </li>
                                        ) : (
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/login">Login</Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <a class="btn_2 d-none d-lg-block" href="#">HOT LINE- 09856</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {/* Header part end */}
        </>
    );
}
