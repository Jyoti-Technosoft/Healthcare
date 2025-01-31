import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getDoctorsWithIdApi, getPatientsListForDoctor } from '../Api';
import Cookies from 'js-cookie';
import PatientDetailPage from './PatientDetailPage';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState(true);
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
                const fetchedDoctorId = doctorInfo.id;
                const data = await getPatientsListForDoctor(fetchedDoctorId, token);
                setPatients(data);
                setFilteredPatients(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = patients.filter((patient) =>
            patient.id === keyword ||
            patient.name.toLowerCase().includes(keyword) ||
            patient.user.email.toLowerCase().includes(keyword) ||
            patient.address.toLowerCase().includes(keyword)
        );
        setFilteredPatients(filteredData);
    };

    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '70px', center: true },
        { name: 'Patient Id', selector: (row) => row.id, sortable: true, center: true },
        { name: 'Name', selector: (row) => row.name, sortable: true, minWidth: '150px', center: true },
        { name: 'Email', selector: (row) => row.user.email, sortable: true, minWidth: '200px', center: true },
        { name: 'Gender', selector: (row) => row.gender, sortable: true, center: true },
        { name: 'Age', selector: (row) => row.age, sortable: true, center: true },
        { name: 'Address', selector: (row) => row.address, sortable: true, minWidth: '250px', center: true },
    ];
    return (
        <>
            {activeTab ? (

                <div className='background_part mt-3'>
                    <div className="container ">
                        <div className="row flex-lg-nowrap">
                            <div className="col">
                                <div className="row">
                                    <div className="col mb-3">
                                        <div className="card border-0 mb-3 shadow  bg-white rounded">
                                            <div className="card-body">
                                                <div className="row">
                                                    <>
                                                        <h6> {patients.length} Patients</h6>
                                                        <hr style={{ color: 'grey' }} />
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
                                                                }}


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
                </div>

            ) : (
                <PatientDetailPage patient={selectedPatient} />
            )}
        </>
    )
}
