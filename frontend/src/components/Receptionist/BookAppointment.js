import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSearchPatientsApi, getDoctorsApi, getAvailableSlots, bookAppointmentApi, fetchConsultationChargeApi } from '../Api';
import 'react-calendar/dist/Calendar.css'; // Import calendar CSS
import Calendar from 'react-calendar'; // Import react-calendar
import { FaTimes } from 'react-icons/fa'; // Import the close icon or any other icon library you prefer
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import {
    setBookAppointmentMenu,
    setShowAppointmentsMenu,
    setActiveTab,
} from '../../actions/submenuActions';

export default function BookAppointment() {
    const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [clickedPatient, setClickedPatient] = useState(null);
    const [clickedPatientId, setClickedPatientId] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // Track the current step of the form
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [consultationCharge, setConsultationCharge] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [doctorSelected, setDoctorSelected] = useState(false);
    const authToken = Cookies.get('authToken');
    const navigate = useNavigate();
    const showAppointmentsMenu = useSelector((state) => state.submenu.showAppointments);
    const dispatch = useDispatch();

    const setMenu = (submenu) => {
        
        if (submenu === 'showAppointments') {
            dispatch(setActiveTab('showAppointments'));
        }
    };


    const handleInputChange = async (event) => {
        const { value } = event.target;
        setSearchQuery(value); // Update search query state

        try {
            // Call API to fetch suggestions based on the search query
            const data = await getSearchPatientsApi(value, authToken);
            if (value.trim() === '') {
                // If search query is empty, reset suggestions
                setSuggestions([]);
            } else {
                setSuggestions(data); // Update suggestions state with the fetched data
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    useEffect(() => {
        // Fetch doctors data from API
        const fetchDoctors = async () => {
            try {
                const response = await getDoctorsApi();
                console.log(response); // Log the entire response for debugging
                if (response) {
                    // Store doctors with their details including consultation charge
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

    const handleSuggestionClick = (patient) => {
        // Handle click on a suggestion item
        setClickedPatient(patient);
        setClickedPatientId(patient.id);
        setSuggestions([]);
        setCurrentStep(2); // Move to the next step after clicking on a suggestion
    };



    const handleDoctorSelect = async (doctorId) => {
        setSelectedDoctor(doctorId);
        setDoctorSelected(true);
        // Find the selected doctor object
        const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(doctorId)); // Parse doctorId to ensure it's a number
        console.log(selectedDoc); // Log the selected doctor object for debugging
        // Set the consultation charge of the selected doctor
        try {
            const response = await fetchConsultationChargeApi(clickedPatientId, selectedDoctor, selectedDate);
            setConsultationCharge(response); // Update consultation charge state with the fetched value
        } catch (error) {
            console.error('Error fetching consultation charge:', error);
        }

        try {
            // Fetch available slots for the selected doctor and selected date
            const response = await getAvailableSlots(doctorId, selectedDate);
            console.log('Available Slots Response:', response);
            setAvailableSlots(response); // Assuming the response is in the format { data: { timeSlot1: slotsCount1, timeSlot2: slotsCount2, ... } }

            const response1 = await fetchConsultationChargeApi(clickedPatientId, selectedDoctor, selectedDate);
            setConsultationCharge(response1); // Update consultation charge state with the fetched value
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const getDayIndex = (dayName) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.findIndex((day) => day.toLowerCase() === dayName.toLowerCase());
    };

    // Function to convert the numeric day returned by date.getDay() to the corresponding day name
    const getDayName = (dayIndex) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    };

    // Function to get time slots based on selected tab (AM/PM)
    const getTimeSlots = (tab) => {
        const amSlots = ['9:00 AM', '10:00 AM', '11:00 AM'];
        const pmSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
        return tab === 'AM' ? amSlots : pmSlots;
    };

    const handleTabChange = (tab) => {
        const slots = getTimeSlots(tab);
        setTimeSlots(slots);
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
    };

    const handleDateSelect = async (date) => {
        const selectedDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); // Convert to UTC
        setSelectedDate(selectedDateUTC);



        try {
            // Fetch available slots for the selected doctor and newly selected date
            const response = await getAvailableSlots(selectedDoctor, selectedDateUTC);
            console.log('Available Slots Response:', response);
            setAvailableSlots(response); // Assuming the response is in the format { data: { timeSlot1: slotsCount1, timeSlot2: slotsCount2, ... } }

            const response1 = await fetchConsultationChargeApi(clickedPatientId, selectedDoctor, selectedDateUTC);
            setConsultationCharge(response1); // Update consultation charge state with the fetched value
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Ensure selectedTimeSlot is a string, not an event object
            const slot = selectedTimeSlot.target.value;
            const [startTime, endTime] = slot.split(' - ');
            const formattedSlot = `${convertTo12Hour(startTime)} to ${convertTo12Hour(endTime)}`;

            const year = selectedDate.getFullYear();
            // Add 1 to month because months are zero-indexed (January is 0, February is 1, etc.)
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
            const day = selectedDate.getDate().toString().padStart(2, '0'); // Ensure two digits
            const formattedDate = `${year}-${month}-${day}`;

            // Log the data being passed to bookAppointmentApi for debugging
            console.log('Selected Doctor:', selectedDoctor);
            console.log('Clicked Patient ID:', clickedPatientId);
            console.log('Selected Date:', formattedDate);
            console.log('Selected Time Slot:', formattedSlot);

            // Call bookAppointmentApi with the extracted slot value
            await bookAppointmentApi(selectedDoctor, clickedPatientId, formattedDate, formattedSlot, navigate);
            window.location.reload();
        } catch (error) {
            // Handle error
        }
    }
    const convertTo12Hour = (time) => {
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert 0 to 12
        const formattedHour = hour.toString().padStart(2, '0'); // Add leading zero if single-digit hour
        return `${formattedHour}:${minutes} ${suffix}`;
    }

    return (
        <div className='background_part'> 
            <div className="container bookAppointmentContainer" style={{ fontSize: '14px' }}>
                <div className="row ">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-3">
                                <div className="card border-0 mb-3 shadow  bg-white rounded">
                                    <div className="card-body">
                                        {/* <!-- ======= Appointment Section ======= --> */}
                                        <section id="appointment" className="appointment "> 
                                            <div className="container">
                                                <i className="bi bi-arrow-left"
                                                    style={{ fontSize: '25px', cursor: 'pointer', color: 'silver', fontWeight:'bold', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s' }}
                                                    onClick={() => setMenu('showAppointments')}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                ></i>
                                                <div class="section-title">

                                                    <label className='contentHeadings appointmentHeading' style={{ color: 'black' }}>Make an Appointment</label>
                                                </div>

                                                <div id="footer" style={{ marginTop: '-105px' }}>
                                                    <div class="footer-top">
                                                        <div>
                                                            <div style={{ position: 'relative' }} className="col-lg-4 col-md-6 footer-newsletter">
                                                                <form action="" method="post">
                                                                    <div style={{ position: 'relative' }}>
                                                                        <input
                                                                            type="text"
                                                                            name="search"
                                                                            placeholder='Search by patient id, name & contact'
                                                                            value={searchQuery}
                                                                            onChange={handleInputChange}
                                                                            style={{ fontSize: '13px' }}
                                                                            autoComplete='off'
                                                                        />
                                                                        <i style={{ position: 'absolute', right: '5px', bottom: '7px', zIndex: '1', fontSize: '14px', color: '#1977cc' }} className="fas fa-search"></i>
                                                                    </div>
                                                                </form>
                                                                <ul className='suggestion-list'>
                                                                    {suggestions.map((patient, index) => (
                                                                        <li key={index} onClick={() => handleSuggestionClick(patient)}>
                                                                            <div>{patient.id}</div>
                                                                            <div> {patient.name}</div>
                                                                            <div>{patient.contact}</div>
                                                                            {/* Render other fields as needed */}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>



                                                {/* Add more steps and conditions for rendering other sections */}
                                                {/* For example: */}

                                                <>
                                                    <div className='regervation_content' style={{ border: '1px solid #ccc', padding: '30px', marginBottom: '20px' }}>
                                                        {clickedPatient ? (
                                                            <fieldset className="regervation_content">
                                                                <label className='mt-2'><b className='contentHeadings' style={{ fontWeight: 'bold', color: '#1977cc' }} > Patient Details </b></label>
                                                                <div className="row">
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient id:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value={clickedPatient.id} disabled id="name" placeholder="Patient id" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient Name:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value={clickedPatient.name} disabled id="name" placeholder="Patient id" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient contact:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value={clickedPatient.contact} disabled id="name" placeholder="Patient id" />
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                        ) : (
                                                            <fieldset className="regervation_content">
                                                                <label className='mt-2'><b className='contentHeadings' style={{ fontWeight: 'bold', color: '#1977cc' }} > Patient Details </b></label>
                                                                <div className="row">
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient id:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value="" disabled id="name" placeholder="Patient id" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient Name:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value="" disabled id="name" placeholder="Patient name" />
                                                                    </div>
                                                                    <div className="col-md-4 form-group mt-3">
                                                                        <label>Patient contact:</label>
                                                                        <input type="text" name="id" className="form-control input-field" value="" disabled id="name" placeholder="Patient contact" />
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                        )}

                                                        <label className='mt-4'><b className='contentHeadings ' style={{ fontWeight: 'bold', color: '#1977cc' }} >Appointments </b></label>

                                                        <div onClick={handleSubmit} className="php-email-form" >
                                                            <div className="row">
                                                                <div className="col-md-6 form-group mt-1">
                                                                    <select
                                                                        value={selectedDepartment}
                                                                        className="form-select input-field"
                                                                        onChange={(e) => {
                                                                            setSelectedDepartment(e.target.value);
                                                                            // Clear the selected doctor when changing the department
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
                                                                </div>
                                                                <div className="col-md-6 form-group mt-1">
                                                                    <select
                                                                        value={selectedDoctor}
                                                                        className="form-select input-field"
                                                                        onChange={(e) => handleDoctorSelect(e.target.value)}
                                                                        required
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select Doctor
                                                                        </option>
                                                                        {/* Filter doctors based on the selected department */}
                                                                        {doctors
                                                                            .filter((doctor) => doctor.department === selectedDepartment)
                                                                            .map((doctor) => (
                                                                                <option key={doctor.id} value={doctor.id}>
                                                                                    {doctor.name}
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            {doctorSelected && (
                                                                <>
                                                                    <div className="row">
                                                                        <div className="col-md-6 form-group mt-3">
                                                                            <label className='form-label'>Appointment Date</label>
                                                                            <Calendar
                                                                                onChange={handleDateSelect}
                                                                                value={selectedDate}

                                                                                tileClassName={({ date, view }) => {
                                                                                    // Find the selected doctor object
                                                                                    const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(selectedDoctor));

                                                                                    // Check if the selected doctor is available on this date
                                                                                    if (selectedDoc && view === 'month' && selectedDoc.visitingDays) {
                                                                                        const day = date.getDay();
                                                                                        const visitingDaysArray = selectedDoc.visitingDays.split(',');

                                                                                        // Check if the day is not included in visiting days
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

                                                                                        // Return the appropriate class based on availability
                                                                                        return isAvailable ? 'custom-tile-green' : 'custom-tile-red';
                                                                                    }
                                                                                    return null;
                                                                                }}
                                                                                tileDisabled={({ date, view }) => {
                                                                                    // Find the selected doctor object
                                                                                    const selectedDoc = doctors.find((doctor) => doctor.id === parseInt(selectedDoctor));

                                                                                    // Check if the selected doctor is available on this date
                                                                                    if (selectedDoc && view === 'month' && selectedDoc.visitingDays) {
                                                                                        const day = date.getDay();
                                                                                        const visitingDaysArray = selectedDoc.visitingDays.split(',');

                                                                                        // Check if the day is not included in visiting days
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

                                                                                        // Disable the tile if it's not available
                                                                                        return !isAvailable;
                                                                                    }
                                                                                    return false;
                                                                                }}

                                                                            />


                                                                        </div>

                                                                        <div className="col-md-6 form-group mt-3">
                                                                            <label className='form-label'>Available Slots</label>
                                                                            <table className="table custom-table">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Time Slots</th>
                                                                                        <th>Available Slots</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {availableSlots && Object.entries(availableSlots).map(([timeSlot, slotsCount]) => (
                                                                                        <tr key={timeSlot}>
                                                                                            <td>{timeSlot}</td>
                                                                                            <td >
                                                                                                <div className="form-check d-flex justify-content-center align-items-center">
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        id={timeSlot}
                                                                                                        name="availableSlots"
                                                                                                        value={timeSlot}
                                                                                                        className="form-check-input"
                                                                                                        style={{ marginRight: '125px' }}
                                                                                                        onChange={handleTimeSlotSelect}
                                                                                                    />
                                                                                                    <label htmlFor={timeSlot} >{`${slotsCount} slots available`}</label>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
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

                                                                    </div>
                                                                    <button className='text-center appointmentButton mt-3' type="submit">Make an Appointment</button>
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                    {/* <button className="btn btn-secondary mt-3 previousButton" onClick={handlePreviousButtonClick}>Previous</button> */}
                                                </>

                                                {/* Render the "Previous" button if not on the first step */}
                                            </div>
                                        </section>
                                        {/* <!-- End Appointment Section --> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
