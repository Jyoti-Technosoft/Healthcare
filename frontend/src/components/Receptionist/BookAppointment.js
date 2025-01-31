import React, { useState, useEffect } from 'react';
import { getSearchPatientsApi, getDoctorsApi, getAvailableSlots, bookAppointmentApi, fetchConsultationChargeApi, getDoctorLeaveRequest } from '../Api';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startOfDay } from 'date-fns';

export default function BookAppointment() {
    const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [clickedPatient, setClickedPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [consultationCharge, setConsultationCharge] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [doctorSelected, setDoctorSelected] = useState(false);
    const authToken = Cookies.get('authToken');
    const dispatch = useDispatch();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");

    const [idError, setIdError] = useState("");
    const [nameError, setNameError] = useState("");
    const [contactError, setContactError] = useState("");
    const [departmentError, setDepartmentError] = useState("");
    const [doctorError, setDoctorError] = useState("");
    const [availableSlotsError, setAvailableSlotsError] = useState("");

    const setMenu = (submenu) => {
        if (submenu === 'showAppointments') {
            dispatch(setActiveTab('showAppointments'));
        }
    };

    const handleInputChange = async (event) => {
        const value = event?.target?.value;
        try {
            if (value.trim() === '') {
                setSuggestions([]);

            } else {
                const data = await getSearchPatientsApi(value, authToken);
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSuggestionClick = (patient) => {
        setClickedPatient(patient);
        setSuggestions([]);
    };

    const handleDoctorSelect = async (doctorId) => {
        setSelectedDoctor(doctorId);
        setDoctorSelected(true);
        try {
            const response = await fetchConsultationChargeApi(clickedPatient.id, doctorId, selectedDate, authToken);
            setConsultationCharge(response);
        } catch (error) {
            console.error('Error fetching consultation charge:', error);
        }
        try {
            const response = await getAvailableSlots(doctorId, selectedDate, authToken);
            setAvailableSlots(response);
            const response1 = await fetchConsultationChargeApi(clickedPatient.id, doctorId, selectedDate, authToken);
            setConsultationCharge(response1);
        } catch (error) {
        }
        try {
            const fetchedLeaveRequests = await getDoctorLeaveRequest(doctorId, authToken);
            setLeaveRequests(fetchedLeaveRequests);
        } catch (error) {
        }
    };

    const getDayIndex = (dayName) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.findIndex((day) => day.toLowerCase() === dayName.toLowerCase());
    };

    const getDayName = (dayIndex) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
    };

    const handleDateSelect = async (date) => {
        const selectedDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        setSelectedDate(selectedDateUTC);
        try {
            const response = await getAvailableSlots(selectedDoctor, selectedDateUTC, authToken);
            setAvailableSlots(response);

            const response1 = await fetchConsultationChargeApi(clickedPatient.id, selectedDoctor, selectedDateUTC, authToken);
            setConsultationCharge(response1);
        } catch (error) {
        }
    };

    const handleSubmit = async (event) => {
        try {
            const slot = selectedTimeSlot.target.value;
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            await bookAppointmentApi(selectedDoctor, clickedPatient.id, formattedDate, slot, authToken);
            setAvailableSlots([]);
            setSelectedTimeSlot('');
            setConsultationCharge('');
            setDoctorSelected('');
            setSelectedDepartment('');
            setClickedPatient('');
            setSearchQuery('');
            toast.success('Appointment schedule!');
        } catch (error) {
            toast.error('Failed to schedule appointment!');
        }
    }

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
        setId("");
        setName("");
        setContact("");
        setIdError("");
        setNameError("");
        setContactError("");
        setDepartmentError("");
        setDoctorError("");
        setAvailableSlotsError("");
    }, []);

    return (
        <div className='background_part mt-3'>
            <div className="container ">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-3">
                                <div className="card border-0 mb-3 shadow  bg-white rounded">
                                    <div className="card-body">
                                        <section id="appointment" className="appointment">
                                            <div className="container">
                                                <i className="bi bi-arrow-left"
                                                    style={{ fontSize: '25px', cursor: 'pointer', color: 'silver', fontWeight: 'bold', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s', marginLeft: '-10px' }}
                                                    onClick={() => setMenu('showAppointments')}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                ></i>
                                                <div className="section-title">
                                                    <label className='contentHeadings appointmentHeading' style={{ color: 'black' }}>Make an Appointment</label>
                                                </div>
                                                <>
                                                    <div className='regervation_content'>
                                                        <div id="search" >
                                                            <div className="search-top">
                                                                <div className='row'>
                                                                    <div style={{ position: 'relative' }} className="col-lg-4 col-md-6 search-section">
                                                                        <Autocomplete
                                                                            value={searchQuery}
                                                                            onChange={(event, newValue) => {
                                                                                setSearchQuery(newValue);
                                                                                handleSuggestionClick(newValue);
                                                                            }}
                                                                            onInputChange={handleInputChange}
                                                                            options={suggestions}
                                                                            getOptionLabel={(option) => option ? option.name : ''}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Search patient"
                                                                                    variant="outlined"
                                                                                    InputProps={{
                                                                                        ...params.InputProps,
                                                                                        endAdornment: (
                                                                                            <>
                                                                                                {params.InputProps.endAdornment}
                                                                                            </>
                                                                                        ),
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {clickedPatient ? (
                                                            <>
                                                                <label className='mt-2'><b className='contentHeadings' style={{ fontWeight: 'bold', color: '#1977cc' }} > Patient Details </b></label>
                                                                <div className="row">
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient id:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value={clickedPatient.id} disabled id="id" placeholder="Patient id" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient Name:</label>
                                                                        <input type="text" name="name" className="form-control input-field" value={clickedPatient.name} disabled id="name" placeholder="Patient id" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient contact:</label>
                                                                        <input type="text" name="contact" className="form-control input-field" value={clickedPatient.contact} disabled id="contact" placeholder="Patient id" />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <label className='mt-2'><b className='contentHeadings' style={{ fontWeight: 'bold', color: '#1977cc' }} > Patient Details </b></label>
                                                                <div className="row">
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient id:</label>
                                                                        <input type="text" name="id" className={`form-control input-field form-control-lg bg-light  ${idError && 'is-invalid'} `} value={id} disabled id="id" placeholder="Patient id" />
                                                                        {idError && <div className="invalid-feedback">{idError}</div>}
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient Name:</label>
                                                                        <input type="text" name="name" className={`form-control input-field form-control-lg bg-light  ${nameError && 'is-invalid'} `} value={name} disabled id="name" placeholder="Patient name" />
                                                                        {nameError && <div className="invalid-feedback">{nameError}</div>}
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient contact:</label>
                                                                        <input type="text" name="contact" className={`form-control input-field form-control-lg bg-light  ${contactError && 'is-invalid'} `} value={contact} disabled id="contact" placeholder="Patient contact" />
                                                                        {contactError && <div className="invalid-feedback">{contactError}</div>}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        <label className='mt-4'><b className='contentHeadings ' style={{ fontWeight: 'bold', color: '#1977cc' }} >Appointments </b></label>

                                                        <div className="" >
                                                            <div className="row">
                                                                <div className="col-md-6 form-group mt-1">
                                                                    <select
                                                                        value={selectedDepartment}
                                                                        className={`form-select input-field form-control-lg bg-light  ${departmentError && 'is-invalid'} `}
                                                                        onChange={(e) => {
                                                                            setSelectedDepartment(e.target.value);
                                                                            setSelectedDoctor('');
                                                                        }}
                                                                        required
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select Department
                                                                        </option>
                                                                        {[...new Set(doctors.map((doctor) => doctor.department))].map((department, index) => (
                                                                            <option key={index} value={department}>
                                                                                {department}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {departmentError && <div className="invalid-feedback">{departmentError}</div>}
                                                                </div>
                                                                <div className="col-md-6 form-group mt-1">
                                                                    <select
                                                                        value={selectedDoctor}
                                                                        className={`form-select input-field form-control-lg bg-light  ${doctorError && 'is-invalid'} `}
                                                                        onChange={(e) => handleDoctorSelect(e.target.value)}
                                                                        required
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select Doctor
                                                                        </option>
                                                                        {doctors
                                                                            .filter((doctor) => doctor.department === selectedDepartment)
                                                                            .map((doctor) => (
                                                                                <option key={doctor.id} value={doctor.id}>
                                                                                    {doctor.name}
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                    {doctorError && <div className="invalid-feedback">{doctorError}</div>}
                                                                </div>
                                                            </div>
                                                            {doctorSelected && (
                                                                <>
                                                                    <div className="row">
                                                                        <div className="col-md-6 form-group mt-3 ">
                                                                            <label className='form-label'>Appointment Date</label> <br />
                                                                            <h6 className='text-center mt-4' style={{ fontSize: '14px', color: '#1977cc' }}>Slots Available. Click on preferrable date to book slot</h6>
                                                                            <div className='card  border-0'>
                                                                                <Calendar
                                                                                    onChange={handleDateSelect}
                                                                                    value={selectedDate}
                                                                                    className="reactCalender"
                                                                                    tileClassName={({ date, view }) => {
                                                                                        const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(selectedDoctor));
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
                                                                                            const isDateWithinLeavePeriod = leaveRequests.some(request => {
                                                                                                let fromTime = new Date(request.fromDate);
                                                                                                let endTime = new Date(request.toDate);
                                                                                                fromTime.setHours(0, 0, 0);
                                                                                                endTime.setHours(23, 59, 59);

                                                                                                return request.doctor.id === selectedDoctor &&
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
                                                                                        return null;
                                                                                    }}
                                                                                    tileDisabled={({ date, view }) => {
                                                                                        const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(selectedDoctor));
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

                                                                                            const isDateWithinLeavePeriod = leaveRequests.some(request => {
                                                                                                let fromTime = new Date(request.fromDate);
                                                                                                fromTime.setHours(0, 0, 0);

                                                                                                return request.doctor.id === selectedDoctor &&
                                                                                                    date.getTime() >= fromTime.getTime() && date.getTime() <= new Date(request.toDate).getTime() &&
                                                                                                    !(request.fromDate === request.toDate && request.fromTime != null && request.toTime != null && request.fromTime !== request.toTime); // Check if fromTime and toTime are equal
                                                                                            });

                                                                                            return (!isAvailable || isPastDate || isDateWithinLeavePeriod);
                                                                                        }
                                                                                        return false;
                                                                                    }}

                                                                                />
                                                                                <div className="indicators">
                                                                                    <div className="indicator green">Slots Available</div>
                                                                                    <div className="indicator red">No Slots Available</div>
                                                                                    <div className="indicator leave">On Leave</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-6 form-group mt-3" style={{ fontSize: '13px' }}>
                                                                            <label className='form-label'>Available Slots</label>
                                                                            <h6 className='text-center mt-4' style={{ fontSize: '16px', color: '#1977cc' }}>Select the time slot and click Make an appointment button </h6>
                                                                            {selectedDate && <h6 className='text-center mt-2' style={{ fontSize: '14px' }}>Available time slots for <b style={{ color: 'black' }}> {selectedDate.getDate().toString().padStart(2, '0')}-{(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-{selectedDate.getFullYear()}</b></h6>}
                                                                            <table className=" custom-table-new">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Time Slots</th>
                                                                                        <th>Available Slots</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {availableSlots &&
                                                                                        Object.entries(availableSlots).map(([timeSlot, slotsCount]) => {
                                                                                            const isDisabled = leaveRequests.some(request => {
                                                                                                const requestFromDate = request.fromDate;
                                                                                                const requestToDate = request.toDate;
                                                                                                const requestFromTime = request.fromTime;
                                                                                                const requestToTime = request.toTime;

                                                                                                const isOnSelectedDate = selectedDate.toISOString().split('T')[0] === requestFromDate && selectedDate.toISOString().split('T')[0] === requestToDate;
                                                                                                const [slotStartTime, slotEndTime] = timeSlot.split(' to ');

                                                                                                const isTimeSlotOverlap = isOnSelectedDate && requestFromTime && requestToTime &&
                                                                                                    slotStartTime >= requestFromTime &&
                                                                                                    slotEndTime <= requestToTime;

                                                                                                return isTimeSlotOverlap;
                                                                                            }) || slotsCount === 0;

                                                                                            return (
                                                                                                <tr key={timeSlot}>
                                                                                                    <td>{timeSlot}</td>
                                                                                                    <td>
                                                                                                        <div className="form-check d-flex ml-3 availability">
                                                                                                            <input
                                                                                                                type="radio"
                                                                                                                id={timeSlot}
                                                                                                                name="availableSlots"
                                                                                                                value={timeSlot}
                                                                                                                style={{ cursor: 'pointer' }}
                                                                                                                className={`form-check-input justify-content-start ${availableSlotsError && 'is-invalid'} `}
                                                                                                                onChange={handleTimeSlotSelect}
                                                                                                                disabled={isDisabled}
                                                                                                            />
                                                                                                            <label htmlFor={timeSlot} className="form-check-label mt-1">{`${slotsCount} slots available`}</label>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        })
                                                                                    }

                                                                                </tbody>
                                                                            </table>
                                                                            {availableSlotsError && <div className="invalid-feedback">{availableSlotsError}</div>}

                                                                        </div>

                                                                        <div className="col-md-6 form-group mt-3" style={{ display: 'inline-block' }}>
                                                                            <label className='form-label'>Consultancy charge:</label>
                                                                            <input
                                                                                type="text"
                                                                                name="charge"
                                                                                className="form-control input-field"
                                                                                id="charge"
                                                                                placeholder="Consultancy charge"
                                                                                value={consultationCharge}
                                                                                disabled
                                                                            />
                                                                            <div className="validate"></div>
                                                                        </div>
                                                                        <div className="col-md-6 form-group mt-4 text-center" style={{ display: 'inline-block' }}>
                                                                            <button onClick={handleSubmit} className='text-center appointmentButton mt-3' type="submit">Make an Appointment</button>
                                                                        </div>

                                                                    </div>
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                </>
                                            </div>
                                        </section>
                                    </div>
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
