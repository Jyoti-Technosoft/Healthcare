import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Cookies from 'js-cookie';
import { getAllAppointmentsApi, getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from '../Api';
import ConsultancyModal from './ConsultancyModal';
import { dateFormatter } from '../Validations';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import { useSelector, useDispatch } from 'react-redux';

export default function DoctorDashboard() {

    const [appointment, setAppointment] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const userId = Cookies.get("userId");
    const token = Cookies.get("authToken");
    const [prescriptions, setPrescriptions] = useState([]);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [paginationPerPage, setPaginationPerPage] = useState(5); // Default rows per page

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
                const doctorInfo = await getDoctorsWithIdApi(userId, token);
                const fetchedDoctorId = doctorInfo.id;

                const data = await getAppointmentWithoutHealthReport(fetchedDoctorId, token);
                setAppointment(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [userId, token]);

    const countTodaysAppointmentsDoctor = () => {
        const today = new Date().toISOString().slice(0, 10);
        return appointment.filter(appointment => appointment.appointmentDate === today).length;
    };
    const todaysAppointments = () => {
        const today = new Date().toISOString().slice(0, 10);
        return appointment.filter(appointment => appointment.appointmentDate === today);
    }


    const upcomingAppointments = appointment
        .filter(appointment => new Date(appointment.appointmentDate) >= new Date())
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)) // Sort appointments in ascending order of the date
        .slice(0, 10); // Take the first 10 appointments


    const handleToggleModal = (appointment) => {
        setSelectedAppointment(appointment); // Set selected appointment
        // Show the modal using Bootstrap's modal API
        const modal = new window.bootstrap.Modal(document.getElementById('consultancyModal'));
        modal.show();
    };
    const handleAddPrescription = () => {
        const newPrescription = { medicineName: '', dosage: '', timing: '' };
        setPrescriptions([...prescriptions, newPrescription]);
    };

    const handleRemovePrescription = (indexToRemove) => {
        const updatedPrescriptions = prescriptions.filter((_, index) => index !== indexToRemove);
        setPrescriptions(updatedPrescriptions);
    };
    const handleCloseButtonClick = () => {
        setShowCloseButton(false);
        setPrescriptions([]);
    };

    // Define columns for the data table
    const columns = [
        {
            name: '', selector: (row) => (
                <div>
                    <i
                        className="bi bi-clipboard2-pulse reportIcon"
                        onClick={() => handleToggleModal(row)}
                    ></i>
                </div>
            ), sortable: true, maxWidth: '10px'
        },
        { name: 'Appointment Id', selector: row => row.id, sortable: true, maxWidth: '110px' },
        { name: 'Patient Id', selector: row => row.patient.id, sortable: true, maxWidth: '100px' },
        { name: 'Patient Name', selector: row => row.patient.name, sortable: true, maxWidth: '125px' },
        { name: 'Appointment Date', selector: row => formatAppointmentDate(row.appointmentDate), sortable: true },
        { name: 'Appointment Time', selector: row => row.appointmentTime, sortable: true }
    ];


    return (
        <div className=''>
            <div className='dashboard'>
                <div className="d-flex justify-content-center align-items-center ">
                    <div className="container ">
                        <div className="row">
                            <div className="col-md-3"> {/* Adjusted column size */}
                                <div className="card  mb-4 rounded border-0 justify-content-center" style={{ height: '190px' }}>
                                    <div className="card-body p-4">
                                        <h1 className='text-center'>{appointment.length}</h1>
                                        <p className='text-center'>Total Appointments</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3"> {/* Adjusted column size */}
                                <div className="card  mb-4 rounded border-0 justify-content-center" style={{ height: '190px' }}>
                                    <div className="card-body p-4">
                                        <h1 className='text-center'>{countTodaysAppointmentsDoctor()}</h1>
                                        <p className='text-center'>Today's Appointments</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3"> {/* Adjusted column size */}
                                <div className="card  mb-4 rounded border-0 justify-content-center" style={{ height: '190px' }}>
                                    <div className="card-body p-4">
                                        <h1 className='text-center'>{doctors.length}</h1>
                                        <p className='text-center'>Top Doctors</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3"> {/* Adjusted column size */}
                                <div className="card  mb-4 rounded border-0 justify-content-center" style={{ height: '190px' }}>
                                    <div className="card-body p-4">
                                        <h1 className='text-center'>{patients.length}</h1>
                                        <p className='text-center'>Total Patients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center ">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 "> {/* Adjusted column size */}
                                <div className="card todayAppointmentCard  mb-4 rounded border-0 justify-content-end" style={{ height: '550px' }}>
                                    <div className="card-body">
                                        <h6><b className='contentHeadings' style={{ color: 'black' }}> Todays Appointments</b> </h6>
                                        <br />
                                        <DataTable

                                            columns={columns}
                                            data={todaysAppointments()}
                                            pagination
                                            highlightOnHover
                                            noDataComponent="No todays appointments found"
                                            paginationPerPage={paginationPerPage}
                                            paginationRowsPerPageOptions={[5]} // Only one option for rows per page

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5"> {/* Adjusted column size */}
                                <div className="card upcoming-appointments mb-4 rounded border-0 justify-content-end" style={{ height: '550px' }}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className=''><b className='contentHeadings' style={{ color: 'black' }}> Upcoming Appointments</b> </h6>
                                            <a style={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => setMenu('doctorAppointments')}>See all<i class="bi bi-chevron-right" style={{ fontSize: '10px' }}></i></a>
                                        </div>
                                        <div className=" mt-3">

                                            {upcomingAppointments.slice(0, 5).map(appointment => (
                                                <>
                                                    <div key={appointment.id} className="appointment-item" >
                                                        <div className='dashboardPatientImg mt-1'>
                                                            {appointment.patient.gender.toLowerCase() === 'female' && (
                                                                <img src="img/female2.png" alt="femaleProfile" />
                                                            )}
                                                            {appointment.patient.gender.toLowerCase() !== 'female' && (
                                                                <img src="img/maleRecep.png" alt="maleProfile" />
                                                            )}
                                                        </div>
                                                        <div className='ml-5'>
                                                            <span style={{ fontSize: '14px' }}><strong>{appointment.patient.name}</strong></span>
                                                            <p style={{ fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{appointment.patient.gender}, {appointment.patient.age} <span className='ml-2'>  {formatAppointmentDate(appointment.appointmentDate)}, {appointment.appointmentTime}</span></p>

                                                        </div>
                                                        <hr style={{ color: 'grey' }} />
                                                    </div>

                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConsultancyModal
                    appointment={selectedAppointment}
                    prescriptions={prescriptions}
                    setPrescriptions={setPrescriptions}
                    showCloseButton={showCloseButton}
                    setShowCloseButton={setShowCloseButton}
                    handleAddPrescription={handleAddPrescription}
                    handleRemovePrescription={handleRemovePrescription}
                    handleCloseButtonClick={handleCloseButtonClick}
                />
            </div>
        </div>
    )
}
