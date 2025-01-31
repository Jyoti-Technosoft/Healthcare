import React from 'react';
import Header from './Admin/Header';
import Sidebar from './Admin/Sidebar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { renderSidebarComponent } from './Admin/Sidebar';
import { useSelector } from 'react-redux';

export default function Dashboard() {
    const token = Cookies.get("authToken");
    const navigate = useNavigate();
    const activeTab = useSelector((state) => state.submenu.activeTab);
    if (!token) {
        navigate('/login');
        return;
    }

    return (

        <div>
            
            <div style={{ height: '100px' }}>
                <Header />
            </div>

            <div style={{ width:'200px'}}>
                <Sidebar />
            </div>
            
            <div className='dashboardComponents'>
                {renderSidebarComponent(activeTab)}
            </div>

        </div>

    );
}
