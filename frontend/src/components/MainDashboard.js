import React from 'react';
import Cookies from 'js-cookie';
import ReceptionistDashboard from './Receptionist/ReceptionistDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import PatientDashboard from './Patient/PatientDashboard';

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
            {userRole === 'SuperAdmin' && (
                <AdminDashboard/>
            )}
            {userRole === 'Patient' && (
                <PatientDashboard/>
            )}
        </div>
    )
}
