import React from 'react';
import Cookies from 'js-cookie';
import ReceptionistDashboard from './Receptionist/ReceptionistDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
export default function MainDashboard() {
    const userRole = Cookies.get('role');
    return ( 
        <div>
            {userRole === 'Receptionist' && (
                <ReceptionistDashboard/>
            )}
            {userRole === 'Doctor' && (
                <DoctorDashboard/>
            )}
        </div>
    )
}
