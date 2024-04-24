import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { calculateTotalDays, highlightDateRange, getCurrentDate, convertTo12HourFormat } from '../Validations';
import { startOfDay } from 'date-fns';
import { doctorLeaveRequest, getDoctorsWithIdApi, getDoctorLeaveRequest } from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
export default function DoctorLeaves() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [totalDays, setTotalDays] = useState(0);
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [pastLeaves, setPastLeaves] = useState([]);
    const [doctorId, setDoctorId] = useState([]);
    const isSameDate = fromDate === toDate;
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const onChange = (newDate) => {
        setDate(newDate);
    };

    const handleFromDateChange = (event) => {
        const selectedDate = event.target.value;
        setFromDate(selectedDate);
        calculateTotalDays(selectedDate, toDate, setTotalDays);
        highlightDateRange(selectedDate, toDate, setHighlightedDates);
    };

    const handleToDateChange = (event) => {
        const selectedDate = event.target.value;
        setToDate(selectedDate);
        calculateTotalDays(fromDate, selectedDate, setTotalDays);
        highlightDateRange(fromDate, selectedDate, setHighlightedDates);
    };
    const handleSubmit = async (event) => {
        try {
            const doctorInfo = await getDoctorsWithIdApi(userId, token);
            const fetchedDoctorId = doctorInfo.id;
            await doctorLeaveRequest(fromDate, toDate, fromTime, toTime, reason, fetchedDoctorId, token);
            toast.success('Leave apply succesfully!!');
        } catch (error) {
            toast.error('Leave request failed!');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorInfo = await getDoctorsWithIdApi(userId, token);
                const fetchedDoctorId = doctorInfo.id;
                const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
                setPastLeaves(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [userId, token, pastLeaves]);

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <div className="card rounded border-0 justify-content-end">
                            <h3 className='mt-3'><span><i class="bi bi-file-earmark-text mr-4" ></i></span>Leave Request</h3>
                            <div className="card-body" style={{ height: '500px' }}>
                                <div className='container'>
                                    <div className='row'>
                                        <div className="col-sm-5 ">
                                            <div className='row'>
                                                <div className='col-sm'>
                                                    <div className='card leaveCalenderCard border-0 '>
                                                        <Calendar
                                                            onChange={onChange}
                                                            value={date}
                                                            tileDisabled={({ date }) => date < startOfDay(new Date())}
                                                            className="reactCalender"
                                                            tileClassName={({ date, view }) => {
                                                                const isHighlighted = highlightedDates.includes(date.toLocaleDateString('en-GB'));
                                                                const isBetween = date > fromDate && date < toDate; // Check if date is between from and to dates
                                                                const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
                                                                return isHighlighted ? 'highlighted-date' : isBetween ? 'between-date' : isToday ? 'today-date' : null;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-sm mt-5">
                                            <div className="row">
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
                                                    <button onClick={handleSubmit} className='text-center appointmentButton mt-3' type="submit">Apply leave</button>
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
                            <div className="card-body" style={{ height: '550px', overflowY: 'auto' }}>
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
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}
