import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <>
            <header className="main_menu home_menu shadow p-3 mb-5 bg-body rounded" >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light adminNavbar">



                                <form className="d-flex adminDashboardSearch">
                                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-outline-primary" type="submit">Search</button>
                                </form>
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>



                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
