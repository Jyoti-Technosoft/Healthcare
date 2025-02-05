import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Cookies from 'js-cookie';
import { getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from '../Api';
import ConsultancyModal from './ConsultancyModal';
import { dateFormatter } from '../Validations';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import { useSelector, useDispatch } from 'react-redux';

export default function DoctorDashboard() {

    const [appointment, setAppointment] = useState([]);
    const userId = Cookies.get("userId");
    const token = Cookies.get("authToken");
    const [prescriptions, setPrescriptions] = useState([]);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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
        const arrivedAppointments = appointment.filter(appointment => appointment.appointmentDate === today && appointment.arrive === 1);
        const notArrivedAppointments = appointment.filter(appointment => appointment.appointmentDate === today && appointment.arrive !== 1);
        const sortedArrivedAppointments = arrivedAppointments.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        return [...sortedArrivedAppointments, ...notArrivedAppointments];
    };

    const upcomingAppointments = appointment
        .filter(appointment => new Date(appointment.appointmentDate) >= new Date())
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 10);


    const handleToggleModal = (appointment) => {
        setSelectedAppointment(appointment);
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

    const columns = [
        {
            cell: (row) => {
                if (row.arrive === 1) {
                    return <div style={{ width: '8px', height: '8px', backgroundColor: '#77dd77', borderRadius: '50%', display: 'inline-block' }}></div>;
                }
            },
            maxWidth: '40px',
            allowOverflow: true,
            ignoreRowClick: true,
            button: true,
        },
        {
            name: '', selector: (row) => (
                <div>
                    <i
                        className="bi bi-clipboard2-pulse reportIcon"
                        onClick={() => handleToggleModal(row)}
                    ></i>
                </div>
            ), sortable: true, maxWidth: '40px'
        },
        { name: 'Appointment Id', selector: row => row.id, sortable: true, maxWidth: '110px' },
        { name: 'Patient Id', selector: row => row.patient.id, sortable: true, maxWidth: '100px' },
        { name: 'Patient Name', selector: row => row.patient.name, sortable: true, maxWidth: '125px' },
        { name: 'Appointment Date', selector: row => formatAppointmentDate(row.appointmentDate), sortable: true },
        { name: 'Appointment Time', selector: row => row.appointmentTime, sortable: true }
    ];


    return (
        <div className=''>
            <div className=''>
                <div className="d-flex justify-content-center align-items-center ">
                    <div className="container ">
                        <div className="row row-cols-1 row-cols-md-4">
                            <div className="col mb-4">
                                <div className="card  h-100 rounded border-0 justify-content-center" >
                                    <div className="card-body p-1">
                                        <h1 className='text-center'>{appointment.length}</h1>
                                        <p className='text-center'>Total Appointments</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-4">
                                <div className="card  h-100 rounded border-0 justify-content-center" >
                                    <div className="card-body p-1">
                                        <h1 className='text-center'>{countTodaysAppointmentsDoctor()}</h1>
                                        <p className='text-center'>Today's Appointments</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-4">
                                <div className="card h-100  rounded border-0 justify-content-center" >
                                    <div className="card-body p-1">
                                        <p className='text-center'>Top Doctors</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-4">
                                <div className="card h-100  rounded border-0 justify-content-center" >
                                    <div className="card-body p-1">
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
                                            paginationRowsPerPageOptions={[5]}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="card upcoming-appointments  mb-4 rounded border-0 justify-content-end">
                                    <div className="card-body" style={{ height: '500px', overflowY: 'auto' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className=''><b className='contentHeadings' style={{ color: 'black' }}> Upcoming Appointments</b> </h6>
                                            <a
                                                href="#"
                                                role="button"
                                                style={{ cursor: 'pointer', fontSize: '12px' }}
                                                onClick={() => setMenu('doctorAppointments')}
                                            >
                                                See all
                                                <i className="bi bi-chevron-right" style={{ fontSize: '10px' }}></i>
                                            </a>
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
                                                            <p style={{ fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{appointment.patient.gender}, {appointment.patient.age} <span className='ml-2'>  {formatAppointmentDate(appointment.appointmentDate)}, {appointment.appointmentTime}</span></p>

                                                        </div>
                                                    </div>
                                                    <hr className="flex-grow-1" style={{ color: 'grey' }} />
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
