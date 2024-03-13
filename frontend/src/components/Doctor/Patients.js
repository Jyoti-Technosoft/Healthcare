import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllPatientsApi, getAllAppointmentsApi, getDoctorsWithIdApi, getPatientsListForDoctor } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import Cookies from 'js-cookie';
import ConsultancyPage from './PatientDetailPage';
export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // const activeTab = useSelector((state) => state.submenu.activeTab);
    const [activeTab, setActiveTab] = useState(true);

    const activePatientMenu = useSelector((state) => state.submenu.activePatientMenu);
    const dispatch = useDispatch();
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    const handleRowClick = (patient) => {
        setSelectedPatient(patient);
        setActiveTab(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, token);
                const fetchedDoctorId = doctorInfo.id; // Store doctorId in a local variable
                const data = await getPatientsListForDoctor(fetchedDoctorId, token);
                setPatients(data); // Set the fetched patients to the state
                setFilteredPatients(data); // Initially set filtered patients same as all patients
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        console.log("Searching...");
        const keyword = e.target.value.toLowerCase();
        const filteredData = patients.filter((patient) =>
            patient.id == keyword ||
            patient.id == keyword ||
            patient.name.toLowerCase().includes(keyword) ||
            patient.user.email.toLowerCase().includes(keyword) ||
            patient.address.toLowerCase().includes(keyword)
        );
        setFilteredPatients(filteredData);
    };

    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '70px' },
        { name: 'Patient Id', selector: (row) => row.id, sortable: true },
        { name: 'Name', selector: (row) => row.name, sortable: true, minWidth: '150px' },
        { name: 'Email', selector: (row) => row.user.email, sortable: true, minWidth: '200px' },
        { name: 'Gender', selector: (row) => row.gender, sortable: true },
        { name: 'Age', selector: (row) => row.age, sortable: true },
        { name: 'Address', selector: (row) => row.address, sortable: true, minWidth: '250px' },
    ];
    return (
        <>
            {activeTab ? (

                <div className='background_part '>
                    <div className="container patintListContainer">
                        <div className="row flex-lg-nowrap">
                            <div className="col">
                                <div className="row">
                                    <div className="col mb-5">
                                        <div className="card border-0 rounded">
                                            <div className="card-body">
                                                <>
                                                    <h6> {patients.length} Patients</h6>
                                                    <hr style={{color:'grey'}}/>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Patient List</b></h3>
                                                        <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                                                    </div>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    ) : (
                                                        <DataTable
                                                            className="patients-table"
                                                            columns={columns}
                                                            data={filteredPatients}
                                                            pagination
                                                            highlightOnHover
                                                            noDataComponent="No patients found"
                                                            onRowClicked={handleRowClick}
                                                            customStyles={{
                                                                rows: {
                                                                    style: {
                                                                        cursor: 'pointer'
                                                                    }
                                                                }
                                                            }} />
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
            ) : (
                <ConsultancyPage patinet={selectedPatient} />
            )}
        </>
    )
}
