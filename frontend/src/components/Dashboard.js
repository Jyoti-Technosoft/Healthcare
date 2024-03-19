import React from 'react';
import Header from './Admin/Header';
import Sidebar from './Admin/Sidebar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { renderSidebarComponent } from './Admin/Sidebar';
import {
    setActiveTab,
} from '../actions/submenuActions';
import { useSelector, useDispatch } from 'react-redux';

export default function Dashboard() {
    const token = Cookies.get("authToken");
    const navigate = useNavigate();
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const userRole = Cookies.get('role');
    if (!token) {
        console.log('User not authenticated. Redirecting to login...');
        navigate('/login');
        return;
    }

    return (

        <div>
            <div style={{ height: '130px' }}>
                <Header />
            </div>
            <div className='sideBar'>
                <Sidebar />
            </div>
            <div>
                {renderSidebarComponent(activeTab)}
            </div>

        </div>

    );
}
