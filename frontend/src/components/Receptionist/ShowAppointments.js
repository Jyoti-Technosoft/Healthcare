import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'; 
import { getAllAppointments } from '../Api';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import {
    setBookAppointmentMenu,
    setShowAppointmentsMenu,
    setActiveTab,
} from '../../actions/submenuActions';
export default function ShowAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const userId = Cookies.get('userId');
    const token = Cookies.get('authToken');

    const activeBookAppointmentMenu = useSelector((state) => state.submenu.activeBookAppointmentMenu);
    const dispatch = useDispatch();

    const setMenu = (submenu) => {
        if (submenu === 'bookAppointment') {
            dispatch(setActiveTab('bookAppointment'));
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllAppointments(token);
                setAppointments(data); // Set the fetched patients to the state
                setFilteredAppointments(data); // Initially set filtered patients same as all patients
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = appointments.filter((appointment) =>
            appointment.id == keyword ||
            appointment.patient.name.toLowerCase().includes(keyword) ||
            appointment.patient.contact.toLowerCase().includes(keyword) ||
            appointment.patient.user.email.toLowerCase().includes(keyword)

        );
        setFilteredAppointments(filteredData); 
    };

    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, sortable: true },
        { name: 'Appointment ID', selector: (row) => row.id, sortable: true },
        { name: 'Patient Name', selector: (row) => row.patient.name, sortable: true, minWidth: '150px' },
        { name: 'Email', selector: (row) => row.patient.user.email, sortable: true, minWidth: '200px' },
        { name: 'Contact', selector: (row) => row.patient.contact, sortable: true, minWidth: '150px' },
        { name: 'Gender', selector: (row) => row.patient.gender, sortable: true },
        { name: 'Age', selector: (row) => row.patient.age, sortable: true },
        { name: 'Weight', selector: (row) => row.patient.weight, sortable: true },
        { name: 'Height', selector: (row) => row.patient.height, sortable: true },
        { name: 'Address', selector: (row) => row.patient.address, sortable: true, minWidth: '250px' },
        { name: 'Doctor name', selector: (row) => row.doctor.name, sortable: true, minWidth: '150px' },
        { name: 'Department', selector: (row) => row.doctor.department, sortable: true, minWidth: '150px' },
        { name: 'Appointment Date', selector: (row) => row.appointmentDate, sortable: true, minWidth: '160px' },
        { name: 'Appointment Time', selector: (row) => row.appointmentTime, sortable: true, minWidth: '180px' },
        { name: 'Consultation charge', selector: (row) => row.consultationCharge, sortable: true, minWidth: '150px' },
        { name: 'Payment mode', selector: (row) => row.paymentMode, sortable: true, minWidth: '150px' },


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
                                                <div className="col">
                                                    <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                                                        <h6> {appointments.length} Appointments</h6>
                                                        <button type="submit" className={`btn btn-primary float-end ${activeBookAppointmentMenu === 'bookAppointment' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('bookAppointment')}><i class="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ color: 'grey' }} />

                                            <>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Appointments</b></h3>
                                                    <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                                                </div>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredAppointments}
                                                        pagination
                                                        highlightOnHover
                                                        noDataComponent="No patients found"
                                                    />
                                                )}
                                            </>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>

    )
}
