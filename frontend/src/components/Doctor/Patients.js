import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllPatientsApi, getAllAppointmentsApi, getDoctorsWithIdApi } from '../Api';

import { useSelector, useDispatch } from 'react-redux';
import {

    setActiveTab,
} from '../../actions/submenuActions';
import Cookies from 'js-cookie';
export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]);

    const activeTab = useSelector((state) => state.submenu.activeTab);
    const activePatientMenu = useSelector((state) => state.submenu.activePatientMenu);
    const dispatch = useDispatch();
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const setMenu = (submenu) => {
        // if (submenu === 'registerPatient') {
        //     // If the submenu is registerPatient, dispatch actions to reset the previous state to null

        //     dispatch(setActiveTab('registerPatient'));
        // } else {
        //     // If the submenu is not registerPatient, set the activePatientMenu state
        //     dispatch(setActivePatientMenu(submenu));
        // }

        if (activeTab === 'patientsWithAppointment') {
            dispatch(setActiveTab(submenu));
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, token);
                const fetchedDoctorId = doctorInfo.id; // Store doctorId in a local variable
                console.log("Doctor id: " + fetchedDoctorId);
    
                const data = await getAllAppointmentsApi(fetchedDoctorId, token);
    
                // Create a Set to store unique patient IDs
                const uniquePatientIds = new Set();
    
                // Filter the data array to include only unique patients
                const uniquePatients = data.filter(appointment => {
                    // Check if the patient ID is already in the Set
                    if (uniquePatientIds.has(appointment.patient.id)) {
                        return false; // Skip if the ID is already in the Set
                    } else {
                        uniquePatientIds.add(appointment.patient.id); // Add the ID to the Set
                        return true; // Include the patient in the filtered list
                    }
                });
    
                setPatients(uniquePatients); // Set the fetched patients to the state
                setFilteredPatients(uniquePatients); // Initially set filtered patients same as all patients
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
            patient.patient.id == keyword ||
            patient.patient.id == keyword ||
            patient.patient.name.toLowerCase().includes(keyword) ||
            patient.patient.user.email.toLowerCase().includes(keyword) ||
            // patient.contact.toLowerCase().includes(keyword) ||
            patient.patient.address.toLowerCase().includes(keyword)
        );
        setFilteredPatients(filteredData);
    };


    const columns = [
        { name: 'Patient Id', selector: (row) => row.patient.id, sortable: true },
        { name: 'Name', selector: (row) => row.patient.name, sortable: true, minWidth: '150px' },
        { name: 'Email', selector: (row) => row.patient.user.email, sortable: true, minWidth: '200px' },
        // { name: 'Contact', selector: (row) => row.patient.contact, sortable: true, minWidth: '150px' },
        { name: 'Gender', selector: (row) => row.patient.gender, sortable: true },
        { name: 'Age', selector: (row) => row.patient.age, sortable: true },
        // { name: 'Weight', selector: (row) => row.weight, sortable: true },
        // { name: 'Height', selector: (row) => row.height, sortable: true },
        { name: 'Address', selector: (row) => row.patient.address, sortable: true, minWidth: '250px' },
    ];
    return (
        <div className='background_part '>
            <div className="container patintListContainer">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-5">
                                <div className="card border-0 rounded">
                                    <div className="card-body">
                                        {/* <div className="row">
                                            <div className="col">
                                                <div className="col-12 ">

                                                    <button type="submit" className={`btn btn-primary float-end ${activePatientMenu === 'registerPatient' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('registerPatient')}><i class="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{ color: 'grey' }} /> */}

                                        <>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Patient List</b></h3>
                                                <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                                            </div>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                <DataTable
                                                    columns={columns}
                                                    data={filteredPatients}
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
    )
}
