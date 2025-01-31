import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { calculateTotalDays, highlightDateRange, getCurrentDate, getDayIndex, getDayName } from '../Validations';
import { startOfDay } from 'date-fns';
import { doctorLeaveRequest, getDoctorsWithIdApi, getDoctorLeaveRequest, getDoctorsApi } from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import {
    setActiveTab,
} from '../../actions/submenuActions';
export default function AddDoctorLeaves() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [pastLeaves, setPastLeaves] = useState([]);
    const [doctorId, setDoctorId] = useState([]);
    const [isHalfDay, setIsHalfDay] = useState(false);
    const isSameDate = fromDate === toDate;
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const [doctors, setDoctors] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);

    const onChange = (newDate) => {
        setDate(newDate);
    };
    const dispatch = useDispatch();

    const setMenu = (submenu) => {

        if (submenu === 'doctorLeaves') {
            dispatch(setActiveTab('doctorLeaves'));
        }
    };

    const handleFromDateChange = (event) => {
        const selectedDate = event.target.value;
        setFromDate(selectedDate);
        setToDate(selectedDate);
        calculateTotalDays(selectedDate, toDate);
        highlightDateRange(selectedDate, toDate, setHighlightedDates);
    };

    const handleToDateChange = (event) => {
        const selectedDate = event.target.value;
        setToDate(selectedDate);
        calculateTotalDays(fromDate, selectedDate);
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
                setDoctorId(fetchedDoctorId);
                const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
                setPastLeaves(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [userId, token]);
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctorsApi();
                if (response) {
                    setDoctors(response);
                } else {
                    console.error('Empty response from the API');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleLeaveTypeChange = (event) => {
        setIsHalfDay(event.target.value === 'halfDay');
        if (event.target.value === 'fullDay') {
            setFromTime('');
            setToTime('');
        }
    };

    useEffect(()=>{
        setLeaveRequests([])
    },[])
    
    return (
        <div className='background_part mt-3'>
            <div className="container ">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-3">
                                <div className="card border-0 mb-3 shadow  bg-white rounded">
                                    <div className="card-body">
                                        <div className="col ">
                                            <i className="bi bi-arrow-left"
                                                style={{ fontSize: '25px', cursor: 'pointer', color: 'grey', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s', marginLeft: '-22px' }}
                                                onClick={() => setMenu('doctorLeaves')}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            ></i>
                                        </div>
                                        <div className="row g-3 mt-1">
                                            <div className="col-md-6">
                                                <div className='card border-0'>
                                                    <Calendar
                                                        onChange={onChange}
                                                        value={date}
                                                        className="reactCalender"
                                                        tileClassName={({ date, view }) => {

                                                            const isHighlighted = highlightedDates.includes(date.toLocaleDateString('en-GB'));
                                                            const isBetween = date > fromDate && date < toDate; 
                                                            const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();

                                                            const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(doctorId));

                                                            if (selectedDoc && view === 'month' && selectedDoc.visitingDays) {
                                                                const day = date.getDay();
                                                                const visitingDaysArray = selectedDoc.visitingDays.split(',');

                                                                let isAvailable = false;
                                                                for (let visitingDaysString of visitingDaysArray) {
                                                                    const visitingDays = visitingDaysString.split('-');
                                                                    if (visitingDays.length === 2) {
                                                                        const startDayIndex = getDayIndex(visitingDays[0]);
                                                                        const endDayIndex = getDayIndex(visitingDays[1]);
                                                                        if (day >= startDayIndex && day <= endDayIndex) {
                                                                            isAvailable = true;
                                                                            break;
                                                                        }
                                                                    } else {
                                                                        const dayName = getDayName(day);
                                                                        if (visitingDays.includes(dayName)) {
                                                                            isAvailable = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                }

                                                                const isDateWithinLeavePeriod = leaveRequests?.some(request => {
                                                                    let fromTime = new Date(request.fromDate);
                                                                    let endTime = new Date(request.toDate);
                                                                    fromTime.setHours(0, 0, 0);
                                                                    endTime.setHours(23, 59, 59);

                                                                    return request.doctor.id === doctorId &&
                                                                        date >= fromTime && date <= endTime;
                                                                });

                                                                if (isDateWithinLeavePeriod) {
                                                                    return 'custom-tile-leave'; 
                                                                } else if (isAvailable) {
                                                                    return 'custom-tile-green'; 
                                                                } else {
                                                                    return 'custom-tile-red'; 
                                                                }
                                                            }
                                                            return isHighlighted ? 'highlighted-date' : isBetween ? 'between-date' : isToday ? 'today-date' : null;
                                                        }}
                                                        tileDisabled={({ date, view }) => {
                                                            const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(doctorId));
                                                            const isPastDate = date < startOfDay(new Date());
                                                            if (selectedDoc && view === 'month' && selectedDoc.visitingDays) {
                                                                const day = date.getDay();
                                                                const visitingDaysArray = selectedDoc.visitingDays.split(',');
                                                                let isAvailable = false;
                                                                for (let visitingDaysString of visitingDaysArray) {
                                                                    const visitingDays = visitingDaysString.split('-');
                                                                    if (visitingDays.length === 2) {
                                                                        const startDayIndex = getDayIndex(visitingDays[0]);
                                                                        const endDayIndex = getDayIndex(visitingDays[1]);
                                                                        if (day >= startDayIndex && day <= endDayIndex) {
                                                                            isAvailable = true;
                                                                            break;
                                                                        }
                                                                    } else {
                                                                        const dayName = getDayName(day);
                                                                        if (visitingDays.includes(dayName)) {
                                                                            isAvailable = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                }

                                                                const isDateWithinLeavePeriod = pastLeaves.some(request => {
                                                                    let fromTime = new Date(request.fromDate);
                                                                    fromTime.setHours(0, 0, 0);

                                                                    return request.doctor.id === doctorId &&
                                                                        date.getTime() >= fromTime.getTime() && date.getTime() <= new Date(request.toDate).getTime() &&
                                                                        !(request.fromDate === request.toDate && request.fromTime !== null && request.toTime !== null && request.fromTime !== request.toTime); // Check if fromTime and toTime are equal
                                                                });

                                                                return (!isAvailable || isPastDate || isDateWithinLeavePeriod);
                                                            }
                                                            return false;
                                                        }}
                                                    />
                                                    <div className="indicators">
                                                        <div className="indicator green">Available</div>
                                                        <div className="indicator red">Not Available</div>
                                                        <div className="indicator leave">Leave</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row mt-3 ml-1">
                                                    <div className="">
                                                        <div className="form-group">
                                                            <label htmlFor="fromDate" className="form-label">From date</label>
                                                            <input type="date" name="fromDate" id="fromDate" className="form-control input-field form-control-lg bg-light mb-2" placeholder="From date" value={fromDate} onChange={handleFromDateChange} min={getCurrentDate()} />
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div className="form-group">
                                                            <label htmlFor="toDate" className="form-label">To date</label>
                                                            <input type="date" name="toDate" id="toDate" className="form-control input-field form-control-lg bg-light mb-2" value={toDate} placeholder="To date" onChange={handleToDateChange} min={getCurrentDate()} />
                                                        </div>
                                                    </div>
    
                                                </div>
                                                <div className='row mt-3 ml-1'>
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
                                                <div className='row mt-3 ml-1'>
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
                                                <div className='row mt-3 ml-2'>
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
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    )
}
