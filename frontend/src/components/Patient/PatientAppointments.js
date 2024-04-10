import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllAppointmentsForPatient, getPatientApi } from '../Api'; 
import Cookies from 'js-cookie';
import { dateFormatter } from '../Validations';
import PatientHealthreport from './PatientHealthreport';
export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showHealthreport, setShowHealthreport] = useState(true);
    function formatAppointmentDate(dateString) {
        return dateFormatter(dateString);
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPatientApi(userId, authToken);
                const patientId = response.id;
                setPatients(response);
                const data = await getAllAppointmentsForPatient(patientId, authToken);
                setAppointments(data);
                setFilteredAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [userId, authToken]);
    const setReportPage = (appointment) => {
        setSelectedAppointment(appointment);
        setShowHealthreport(false);
    }
    const columns = [
        
        { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '200px' },
        { name: 'Appointment ID', selector: (row) => row.id, sortable: true, maxWidth: '200px' },
        { name: 'Appointment Date', selector: (row) => formatAppointmentDate(row.appointmentDate), sortable: true, maxWidth: '250px' },
        { name: 'Appointment time', selector: (row) => row.appointmentTime, sortable: true, maxWidth: '250px' },
        { name: 'Consultancy charge', selector: (row) => row.consultationCharge, sortable: true,maxWidth:'200px'},
        {
            name: '', selector: (row) => (
                <div>
                    <i
                        className="bi bi-eye-fill reportEyeIcon"
                        onClick={() => setReportPage(row)}
                    ></i>
                </div>
            ), sortable: true, maxWidth: '100px'
        },
    ];
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = appointments.filter((appointment) =>
            appointment.id.toString().includes(keyword)
        );
        setFilteredAppointments(filteredData);
    };
    return (
        <>
            {showHealthreport ? (
                <div className='background_part mt-3'>
                    <div className="container ">
                        <div className="row flex-lg-nowrap">
                            <div className="col">
                                <div className="row">
                                    <div className="col mb-3">
                                        <div className="card border-0 mb-3 shadow  bg-white rounded">
                                            <div className="card-body">
                                                <div className="">
                                                    <div className='mt-4'>
                                                        <h5><b className='contentHeadings' style={{ color: 'black' }}>Patient Details</b></h5>
                                                        <br />
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <ul>
                                                                    <li><strong>Patient ID:</strong> <span style={{ fontSize: '14px' }}> {patients.id}</span></li>
                                                                    <li><strong>Patient Name:</strong> <span style={{ fontSize: '14px' }}> {patients.name}</span></li>
                                                                    <li><strong>Contact:</strong> <span style={{ fontSize: '14px' }}> {patients.contact}</span></li>

                                                                </ul>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <ul>
                                                                    <li><strong>Gender:</strong> <span style={{ fontSize: '14px' }}> {patients.gender}</span></li>
                                                                    <li><strong>Date of Birth:</strong> <span style={{ fontSize: '14px' }}> {patients.dateOfBirth}</span></li>
                                                                    <li><strong>Age:</strong> <span style={{ fontSize: '14px' }}> {patients.age}</span></li>

                                                                </ul>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <hr style={{ color: 'grey' }} />
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>{appointments.length} Appointments</b></h3>
                                                        <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                                                    </div>
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredAppointments}
                                                        pagination
                                                        highlightOnHover
                                                        noDataComponent="No appointments found"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <PatientHealthreport
                    appointment={selectedAppointment}
                    patient={patients}
                />
            )}
        </>
    )
}
