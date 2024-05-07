import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { calculateTotalDays, highlightDateRange, getCurrentDate, convertTo12HourFormat, getDayIndex, getDayName } from '../Validations';
import { startOfDay } from 'date-fns';
import { doctorLeaveRequest, getDoctorsWithIdApi, getDoctorLeaveRequest, getDoctorsApi } from '../Api';
import { ToastContainer, toast } from 'react-toastify';
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
                                                        <button type="submit" className={`btn btn-primary float-end ${activeTab === 'addDoctorLeaves' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('addDoctorLeaves')}><i class="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ color: 'grey' }} />

                                            <>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Past leaves</b></h3>
                                                    {/* <input type="text" className='form-control input-field w-25' placeholder="Search..."  /> */}
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

            {/* <div className="d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="card rounded border-0 justify-content-end">
                                <h3 className='mt-2'><span><i class="bi bi-file-earmark-text mr-4" ></i></span>Leave Request</h3>
                                <div className="card-body" style={{ height: '490px' }}>
                                    <div className='container'>
                                        <div className='row'>
                                            <div className="col-sm-5 ">
                                                <div className='row'>
                                                    <div className='col-sm'>
                                                        <div className='card border-0 '>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-sm">
                                                <div className="row mt-3">
                                                    <div className="col-4">
                                                        <div className="form-group">
                                                            <label htmlFor="fromDate" className="form-label">From date</label>
                                                            <input type="date" name="fromDate" id="fromDate" className="form-control input-field form-control-lg bg-light mb-2" placeholder="From date" onChange={handleFromDateChange} min={getCurrentDate()} />
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="form-group">
                                                            <label htmlFor="toDate" className="form-label">To date</label>
                                                            <input type="date" name="toDate" id="toDate" className="form-control input-field form-control-lg bg-light mb-2" placeholder="To date" onChange={handleToDateChange} min={getCurrentDate()} />
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="form-group">
                                                            <label htmlFor="totalDays" className="form-label">Total days</label>
                                                            <input type="text" name="totalDays" id="totalDays" className="form-control input-field form-control-lg bg-light mb-2" placeholder="Total Days" value={totalDays} disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mt-3'>
                                                    {fromDate && toDate && isSameDate && (
                                                        <>
                                                            <div className="col-6">
                                                                <label className="form-label">Leave Type</label>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="leaveType"
                                                                        id="fullDay"
                                                                        value="fullDay"
                                                                        checked={!isHalfDay}
                                                                        onChange={handleLeaveTypeChange}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="fullDay">
                                                                        Full Day
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="leaveType"
                                                                        id="halfDay"
                                                                        value="halfDay"
                                                                        checked={isHalfDay}
                                                                        onChange={handleLeaveTypeChange}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="halfDay">
                                                                        Half Day
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='row mt-3'>
                                                    {fromDate && toDate && isSameDate && isHalfDay && (
                                                        <>
                                                            <div className="col-6">
                                                                <label htmlFor="fromTime" className="form-label">From time</label>
                                                                <input type="time" name="fromTime" id="fromTime" className="form-control input-field form-control-lg bg-light mb-2" onChange={(e) => setFromTime(e.target.value)} placeholder="From time" value={fromTime} />
                                                            </div>
                                                            <div className="col-6">
                                                                <label htmlFor="toTime" className="form-label">To time</label>
                                                                <input type="time" name="toTime" id="toTime" className="form-control input-field form-control-lg bg-light mb-2" onChange={(e) => setToTime(e.target.value)} placeholder="To time" value={toTime} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='row mt-3'>
                                                    <label htmlFor="reason" className="form-label">Reason</label>
                                                    <textarea
                                                        id="reason"
                                                        className="form-control input-field form-control-lg bg-light"
                                                        placeholder="Leave reason"
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                        maxLength={70}
                                                    />
                                                    <div className="form-group mt-4 text-center">
                                                        <button onClick={handleSubmit} className='text-center appointmentButton mt-2' type="submit">Apply leave</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card upcoming-appointments mb-4 rounded border-0 justify-content-end">
                                <div className="card-body" style={{ height: '540px', overflowY: 'auto' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className=''><b className='contentHeadings' style={{ color: 'black' }}>Past leaves</b></h6>
                                    </div>
                                    <div className="mt-3">
                                        <table className="table" style={{ fontSize: '10px' }}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">From Date</th>
                                                    <th scope="col">To Date</th>
                                                    <th scope="col">From Time</th>
                                                    <th scope="col">To Time</th>
                                                    <th scope="col">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pastLeaves.map((leave, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(leave.fromDate).toLocaleDateString('en-US', { day: '2-digit', year: 'numeric', month: 'short' })}</td>
                                                        <td>{new Date(leave.toDate).toLocaleDateString('en-US', { day: '2-digit', year: 'numeric', month: 'short' })}</td>
                                                        <td>{leave.fromTime ? convertTo12HourFormat(leave.fromTime) : '-'}</td>
                                                        <td>{leave.toTime ? convertTo12HourFormat(leave.toTime) : '-'}</td>
                                                        <td>{leave.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div> */}


        </>
    );
}
