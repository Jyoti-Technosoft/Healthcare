import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllPatientsApi } from '../Api';
import { useSelector, useDispatch } from 'react-redux'; 
import {
    setActiveTab,
} from '../../actions/submenuActions';
import Cookies from 'js-cookie';

export default function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]); 

    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    const token = Cookies.get('authToken');
    const setMenu = (submenu) => {
        if(activeTab==='patientsList'){
            dispatch(setActiveTab(submenu));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllPatientsApi(token);
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
            patient.contact.toLowerCase().includes(keyword) ||
            patient.address.toLowerCase().includes(keyword)
        );
        setFilteredPatients(filteredData);
    };

    const columns = [
        { name: 'ID', selector: (row) => row.id, sortable: true },
        { name: 'Name', selector: (row) => row.name, sortable: true, minWidth: '150px' },
        { name: 'Email', selector: (row) => row.user.email, sortable: true, minWidth: '200px' },
        { name: 'Contact', selector: (row) => row.contact, sortable: true, minWidth: '150px' },
        { name: 'Gender', selector: (row) => row.gender, sortable: true },
        { name: 'Age', selector: (row) => row.age, sortable: true },
        { name: 'Weight', selector: (row) => row.weight, sortable: true },
        { name: 'Height', selector: (row) => row.height, sortable: true },
        { name: 'Address', selector: (row) => row.address, sortable: true, minWidth: '250px' },
    ];

    return (
        <div className='background_part mt-3'> 
            <div className="container patintListContainer">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-5">
                                <div className="card border-0 rounded">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                                                    <h6> {patients.length} Patients</h6>
                                                    <button type="submit" className={`btn btn-primary float-end ${activeTab === 'registerPatient' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('registerPatient')}><i className="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{ color: 'grey' }} /> 

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
