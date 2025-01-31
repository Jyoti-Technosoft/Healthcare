import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {  getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from '../Api';
import Cookies from 'js-cookie';
import ConsultancyModal from './ConsultancyModal';
import { dateFormatter } from '../Validations';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null); 
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");
    const [prescriptions, setPrescriptions] = useState([]);
    const [showCloseButton, setShowCloseButton] = useState(false);

    function formatAppointmentDate(dateString) {
        return dateFormatter(dateString);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, authToken);
                const fetchedDoctorId = doctorInfo.id; 
                const data = await getAppointmentWithoutHealthReport(fetchedDoctorId, authToken); 
                setAppointments(data);
                setFilteredAppointments(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, authToken]);

    useEffect(() => {
        const fetchBrandNames = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.fda.gov/drug/label.json?count=openfda.brand_name.exact&limit=1000');
                if (!response.ok) {
                    throw new Error('Failed to fetch brand names');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand names:', error);
                setLoading(false);
            }
        };
        fetchBrandNames();
    }, []);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = appointments.filter((appointment) =>
            appointment.patient.id.toString().includes(keyword) || 
            appointment.patient.name.toLowerCase().includes(keyword) || 
            appointment.patient.contact.toLowerCase().includes(keyword) || 
            appointment.appointmentDate.toLowerCase().includes(keyword) || 
            appointment.appointmentTime.toLowerCase().includes(keyword)  
        );
        setFilteredAppointments(filteredData);
    };

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
        { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '70px', center: true },
        { name: 'Appointment ID', selector: (row) => row.id, sortable: true, minWidth: '150px', center: true },
        { name: 'Patient ID', selector: (row) => row.patient.id, sortable: true, minWidth: '110px', center: true },
        { name: 'Patient name', selector: (row) => row.patient.name, sortable: true, minWidth: '150px' , center: true},
        { name: 'Appointment Date', selector: (row) => formatAppointmentDate(row.appointmentDate), sortable: true, minWidth: '160px', center: true },
        { name: 'Appointment time', selector: (row) => row.appointmentTime, sortable: true, minWidth: '180px', center: true },
        { name: 'Consultancy charge', selector: (row) => row.consultationCharge, sortable: true, minWidth: '150px', center: true },
        {
            name: '', selector: (row) => (
                <div>
                    <i
                        className="bi bi-clipboard2-pulse reportIcon"
                        onClick={() => handleToggleModal(row)}
                    ></i>
                </div>
            ), sortable: true
        },
    ];

    return (
        <>
            <div className='background_part mt-3'> 
                <div className="container ">
                    <div className="row flex-lg-nowrap">
                        <div className="col">
                            <div className="row">
                                <div className="col mb-3">
                                    <div className="card border-0 mb-3 shadow  bg-white rounded">
                                        <div className="card-body">
                                            <div className="row">
                                                <h6> {appointments.length} Appointments</h6>
                                                <hr style={{ color: 'grey' }} />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Appointments</b></h3>
                                                    <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                                                </div>
                                                <div>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    ) : (
                                                        <>
                                                            <DataTable
                                                                columns={columns}
                                                                data={filteredAppointments}
                                                                pagination
                                                                highlightOnHover
                                                                noDataComponent="No appointments found"
                                                            />
                                                        </>
                                                    )}
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
                    </div>
                </div>
            </div>
        </>
    )
}
