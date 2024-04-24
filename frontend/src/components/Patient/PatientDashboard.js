import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllAppointmentsForPatient, getPatientApi, getAllDoctors } from '../Api';
import Cookies from 'js-cookie';
import { dateFormatter } from '../Validations';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import { useSelector, useDispatch } from 'react-redux';
export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");
    const [doctors, setDoctors] = useState([]);
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    const setMenu = (menu) => {
        if (activeTab !== menu) {
            dispatch(setActiveTab(menu));
        }
    };
    function formatAppointmentDate(dateString) {
        return dateFormatter(dateString);
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPatientApi(userId, authToken);
                const patientId = response.id;
                const data = await getAllAppointmentsForPatient(patientId, authToken);
                setAppointments(data);

                const doctor = await getAllDoctors(authToken);
                setDoctors(doctor);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [userId, authToken]);
    const upcomingAppointments = appointments
        .filter(appointment => new Date(appointment.appointmentDate) >= new Date());
    const todaysAppointments = () => {
        const today = new Date().toISOString().slice(0, 10);
        return appointments.filter(appointment => appointment.appointmentDate === today);
    };
    const columns = [
        { name: 'SR.NO', selector: (row, index) => index + 1, sortable: true, maxWidth: '20px' },
        { name: 'Appointment Id', selector: row => row.id, sortable: true, maxWidth: '110px' },
        { name: 'Patient Id', selector: row => row.patient.id, sortable: true, maxWidth: '100px' },
        { name: 'Patient Name', selector: row => row.patient.name, sortable: true, maxWidth: '125px' },
        { name: 'Appointment Date', selector: row => formatAppointmentDate(row.appointmentDate), sortable: true },
        { name: 'Appointment Time', selector: row => row.appointmentTime, sortable: true },
        { name: 'Doctor Name', selector: row => row.doctor.name, sortable: true },
    ];
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center ">
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-4">
                        <div className="col mb-4"> 
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1 ">
                                    <h1 className='text-center'>{appointments.length}</h1>
                                    <p className='text-center'>Total Appointments</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4"> 
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1">
                                    <h1 className='text-center'>{todaysAppointments().length}</h1>
                                    <p className='text-center'>Todays Appointments</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4"> 
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1">
                                    <h1 className='text-center'>{upcomingAppointments.length}</h1>
                                    <p className='text-center'>Upcoming Appointments</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4"> 
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1">
                                    <h1 className='text-center'>{doctors.length}</h1>
                                    <p className='text-center'>Total Doctors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center ">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 ">
                            <div className="card todayAppointmentCard  mb-4 rounded border-0 justify-content-end">
                                <div className="card-body" style={{ height: '500px', overflowY: 'auto' }}>
                                    <h6><b className='contentHeadings' style={{ color: 'black' }}> Todays Appointments</b> </h6>
                                    <br />
                                    <DataTable
                                        columns={columns}
                                        data={todaysAppointments()}
                                        pagination
                                        highlightOnHover
                                        noDataComponent="No todays appointments found"
                                        // paginationPerPage={paginationPerPage}
                                        paginationRowsPerPageOptions={[5]} // Only one option for rows per page

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="card upcoming-appointments  mb-4 rounded border-0 justify-content-end">
                                <div className="card-body" style={{ height: '500px', overflowY: 'auto' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className=''><b className='contentHeadings' style={{ color: 'black' }}> Upcoming Appointments</b> </h6>
                                        <a style={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => setMenu('patientAppointments')}>See all<i class="bi bi-chevron-right" style={{ fontSize: '10px' }}></i></a>
                                    </div>
                                    <div className=" mt-3">

                                        {upcomingAppointments.slice(0, 5).map(appointment => (
                                            <>
                                                <div key={appointment.id} className="d-flex align-items-center" >
                                                    <div className='dashboardPatientImg'>
                                                        {appointment.patient.gender.toLowerCase() === 'female' && (
                                                            <img src="img/female2.png" alt="femaleProfile" />
                                                        )}
                                                        {appointment.patient.gender.toLowerCase() !== 'female' && (
                                                            <img src="img/maleRecep.png" alt="maleProfile" />
                                                        )}
                                                    </div>
                                                    <div className='ml-3'>
                                                        <span style={{ fontSize: '14px' }}><strong>{appointment.patient.name}</strong></span>
                                                        <p style={{ fontSize: '12px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{appointment.patient.gender}, {appointment.patient.age} <span className='ml-2'>{appointment.doctor.name}</span>  <span className='ml-2'>  {formatAppointmentDate(appointment.appointmentDate)}, {appointment.appointmentTime}</span></p>

                                                    </div>
                                                    
                                                </div>
                                                <hr style={{ color: 'grey' }} />
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    )
}
