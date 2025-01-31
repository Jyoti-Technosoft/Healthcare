import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import {  convertTo12HourFormat } from '../Validations';
import {  getDoctorsWithIdApi, getDoctorLeaveRequest } from '../Api';
import Cookies from 'js-cookie';
import DataTable from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveTab,
} from '../../actions/submenuActions';

export default function DoctorLeaves() {
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    const [pastLeaves, setPastLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const setMenu = (submenu) => {

        if (activeTab === 'doctorLeaves') {
            dispatch(setActiveTab(submenu));
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, token);
                const fetchedDoctorId = doctorInfo.id;
                const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
                setPastLeaves(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, token]);

    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, maxWidth: '20px', sortable: true },
        { name: 'From date', selector: (row) => row.fromDate, sortable: true, maxWidth: '150px' },
        { name: 'To date', selector: (row) => row.toDate, sortable: true, maxWidth: '150px' },
        { name: 'From time', selector: (row) => row.fromTime ? convertTo12HourFormat(row.fromTime) : '-', sortable: true, maxWidth: '150px' },
        { name: 'To time', selector: (row) => row.toTime ? convertTo12HourFormat(row.toTime) : '-', sortable: true, maxWidth: '150px' },
        { name: 'Reason', selector: (row) => row.reason, sortable: true },

    ];
    return (
        <>
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
                                                        <h6> {pastLeaves.length} leaves</h6>
                                                        <button type="submit" className={`btn btn-primary float-end ${activeTab === 'addDoctorLeaves' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('addDoctorLeaves')}><i className="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ color: 'grey' }} />
                                            <>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Past leaves</b></h3>
                                                </div>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    <DataTable
                                                        columns={columns}
                                                        data={pastLeaves}
                                                        pagination
                                                        highlightOnHover
                                                        noDataComponent="No past leave found"
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
    );
}
