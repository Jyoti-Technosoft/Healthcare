import React from 'react';
import Header from './Admin/Header';
import Sidebar from './Admin/Sidebar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const token = Cookies.get("authToken");
    const navigate = useNavigate();
    if (!token) {
        console.log('User not authenticated. Redirecting to login...');
        navigate('/login');
        return;
    }
    
    return (        
        <>        
            <Header/>
            <Sidebar/>
           
        </>
    );
}
