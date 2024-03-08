import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllAppointmentsApi, getAllPatientsApi, getDoctorsWithIdApi } from '../Api';
import Cookies from 'js-cookie';
import AppointmentModal from './ConsultancyModal';
import {
    setActiveTab,
    setMiddleCompo,
    setPreviousTab,
} from '../../actions/submenuActions';
import { useSelector, useDispatch } from 'react-redux';
import ConsultancyPage from './ConsultancyPage';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Added state to store selected appointment
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");

    const [brandNames, setBrandNames] = useState([]);
    const [medications, setMedications] = useState([]);
    const [error, setError] = useState(null);

    const activeTab = useSelector((state) => state.submenu.activeTab);


    const middleCompo = useSelector((state) => state.submenu.middleCompo);
    const dispatch = useDispatch();

    const setMenu = (submenu) => {
        if (activeTab === 'doctorAppointments') {
            dispatch(setMiddleCompo(submenu));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, authToken);
                const fetchedDoctorId = doctorInfo.id; // Store doctorId in a local variable
                console.log("Doctor id: " + fetchedDoctorId);

                const data = await getAllAppointmentsApi(fetchedDoctorId, authToken); // Use fetchedDoctorId directly
                setAppointments(data);
                setFilteredAppointments(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, authToken, middleCompo]);

    useEffect(() => {
        const fetchBrandNames = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.fda.gov/drug/label.json?count=openfda.brand_name.exact&limit=1000');
                if (!response.ok) {
                    throw new Error('Failed to fetch brand names');
                }
                const data = await response.json();
                setBrandNames(data.results.map(result => result.term));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand names:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchBrandNames();
    }, []);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = appointments.filter((appointment) =>
            appointment[1].toString().includes(keyword) || // Assuming ID is the first element
            appointment[2].toLowerCase().includes(keyword) || // Patient name
            appointment[3].toLowerCase().includes(keyword) || // Contact
            appointment[10].toLowerCase().includes(keyword) || // Appointment Date
            appointment[11].toLowerCase().includes(keyword)  // Appointment time
        );
        setFilteredAppointments(filteredData);
    };

    const handleIconClick = (appointment) => {
        setSelectedAppointment(appointment); // Set selected appointment
        setMenu('consultancyPage'); // Update middleCompo state when icon is clicked
    };

    const columns = [
        {
            name: '', selector: (row) => (
                <div>
                    <i
                        className={`bi bi-clipboard2-pulse reportIcon ${middleCompo === 'consultancyPage' ? 'active' : ''}`}
                        onClick={() => handleIconClick(row)}
                    ></i>
                </div>
            ), sortable: true
        },
        { name: 'Patient ID', selector: (row) => row[1], sortable: true, minWidth: '110px' },
        { name: 'Patient name', selector: (row) => row[2], sortable: true, minWidth: '150px' },
        { name: 'Contact', selector: (row) => row[3], sortable: true, minWidth: '150px' },
        { name: 'Appointment Date', selector: (row) => row[10], sortable: true, minWidth: '160px' },
        { name: 'Appointment time', selector: (row) => row[11], sortable: true, minWidth: '180px' },
        { name: 'Consultancy charge', selector: (row) => row[12], sortable: true, minWidth: '200px' },
    ];

    return (
        <>
            <div>
                {middleCompo !== 'consultancyPage' ? (
                    <div className='background_part '>
                        <div className="container patintListContainer">
                            <div className="row flex-lg-nowrap">
                                <div className="col">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <div className="card border-0 rounded">
                                                <div className="card-body">
                                                    <h6> {appointments.length} Appointments</h6>
                                                    <hr />
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
                                                                    data={appointments}
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
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <ConsultancyPage appointment={selectedAppointment} />
                )}
            </div>
        </>
    )
}
