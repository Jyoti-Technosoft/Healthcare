import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  getSearchPatientsApi,
  getDoctorsApi,
  getAvailableSlots,
  bookAppointmentApi,
  fetchConsultationChargeApi,
  getDoctorLeaveRequest,
} from "../Api";
import LeaveCalendar from "../Doctor/LeaveCalendar";
import { setActiveTab } from "../../actions/submenuActions";
import "../../assets/css/Receptionist/BookAppointment.css";
import BackArrow from "../../assets/img/back-arrow.png";

export default function BookAppointment() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clickedPatient, setClickedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [consultationCharge, setConsultationCharge] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [doctorSelected, setDoctorSelected] = useState(false);

  const authToken = Cookies.get("authToken");
  const dispatch = useDispatch();

  // --- SEARCH & PATIENT ---
  const handleInputChange = async (event) => {
    const value = event?.target?.value;
    try {
      setSuggestions(
        value?.trim() ? await getSearchPatientsApi(value, authToken) : []
      );
    } catch {}
  };

  const handleSuggestionClick = (patient) => {
    setClickedPatient(patient);
    setSuggestions([]);
  };

  // --- DOCTOR SELECTION ---
  const handleDoctorSelect = async (doctorId) => {
    const docIdInt = parseInt(doctorId);
    setSelectedDoctor(docIdInt);
    setDoctorSelected(true);

    // Fetch Charge
    try {
      setConsultationCharge(
        await fetchConsultationChargeApi(
          clickedPatient?.id,
          doctorId,
          selectedDate,
          authToken
        )
      );
    } catch {}

    // Fetch Slots
    try {
      setAvailableSlots(
        await getAvailableSlots(doctorId, selectedDate, authToken)
      );
    } catch {}

    // Fetch Leaves for Calendar
    try {
      const leaves = await getDoctorLeaveRequest(doctorId, authToken);
      setLeaveRequests(leaves || []);
    } catch {
      setLeaveRequests([]);
    }
  };

  const handleDateSelect = async (date) => {
    // Normalize Date
    const formattedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setSelectedDate(formattedDate);

    // Re-fetch Slots
    try {
      setAvailableSlots(
        await getAvailableSlots(selectedDoctor, formattedDate, authToken)
      );
    } catch {}
  };

  // --- SLOT BLOCKING LOGIC (HALF DAY) ---
  const isSlotBlocked = (slotString) => {
    if (!selectedDate || !leaveRequests.length) return false;

    // Find active leave for this date
    const activeLeave = leaveRequests.find((leave) => {
      const leaveStart = new Date(leave.fromDate).setHours(0, 0, 0, 0);
      const leaveEnd = new Date(leave.toDate).setHours(0, 0, 0, 0);
      const current = new Date(selectedDate).setHours(0, 0, 0, 0);
      return current >= leaveStart && current <= leaveEnd;
    });

    if (!activeLeave) return false;

    // If Full Day Leave, block everything (Calendar should alert this, but safety check)
    if (activeLeave.fromTime === activeLeave.toTime) return true;

    // Parse "09:00 to 10:00"
    const [slotStartStr] = slotString.split(" to ");
    if (!slotStartStr) return false;

    const [slotH, slotM] = slotStartStr.split(":").map(Number);
    const slotTimeValue = slotH * 60 + slotM;

    // Parse Leave Times
    const [leaveStartH, leaveStartM] = activeLeave.fromTime
      .split(":")
      .map(Number);
    const [leaveEndH, leaveEndM] = activeLeave.toTime.split(":").map(Number);

    const leaveStartValue = leaveStartH * 60 + leaveStartM;
    const leaveEndValue = leaveEndH * 60 + leaveEndM;

    // Check if slot starts inside the leave window
    return slotTimeValue >= leaveStartValue && slotTimeValue < leaveEndValue;
  };

  const handleSubmit = async () => {
    try {
      const slot = selectedTimeSlot.target.value;
      const formattedDate = selectedDate.toISOString().split("T")[0];
      await bookAppointmentApi(
        selectedDoctor,
        clickedPatient.id,
        formattedDate,
        slot,
        authToken
      );
      toast.success("Appointment Scheduled!");
      // Reset
      setAvailableSlots([]);
      setSelectedTimeSlot("");
      setConsultationCharge("");
      setDoctorSelected(false);
      setSelectedDepartment("");
      setClickedPatient(null);
      setSearchQuery("");
    } catch {
      toast.error("Failed to schedule appointment");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setDoctors((await getDoctorsApi()) ?? []);
      } catch {}
    })();
  }, []);

  return (
    <div className="background_part">
      <div className="register-card">
        <img
          src={BackArrow}
          className="register-back-btn"
          alt="back"
          onClick={() => dispatch(setActiveTab("showAppointments"))}
        />

        <h3 className="register-title">Book Appointment</h3>

        <div className="appointment-content" style={{ marginTop: "30px" }}>
          {/* --- SEARCH PATIENT --- */}
          <div className="form-grid-full" style={{ marginBottom: "20px" }}>
            <label className="form-label">Search Patient</label>
            <div className="relative">
              <input
                type="text"
                value={typeof searchQuery === 'string' ? searchQuery : (searchQuery?.name || '')}
                onChange={handleInputChange}
                onFocus={() => {
                  if (searchQuery?.trim()) {
                    handleInputChange({ target: { value: searchQuery } });
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setSuggestions([]), 200);
                }}
                placeholder="Type to search patients..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((patient, index) => (
                    <div
                      key={patient.id || index}
                      onClick={() => {
                        setSearchQuery(patient);
                        handleSuggestionClick(patient);
                        setSuggestions([]);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.contact}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- PATIENT DETAILS --- */}
          {clickedPatient && (
            <div className="form-grid">
              <div>
                <label className="form-label">ID</label>
                <input
                  className="form-control input-field"
                  disabled
                  value={clickedPatient.id}
                />
              </div>
              <div>
                <label className="form-label">Name</label>
                <input
                  className="form-control input-field"
                  disabled
                  value={clickedPatient.name}
                />
              </div>
              <div>
                <label className="form-label">Contact</label>
                <input
                  className="form-control input-field"
                  disabled
                  value={clickedPatient.contact}
                />
              </div>
            </div>
          )}

          {/* --- DOCTOR SELECTION --- */}
          <div className="form-grid-full" style={{ marginTop: "30px" }}>
            <label className="form-label">Appointment Details</label>
          </div>

          <div className="form-grid">
            <div>
              <label className="form-label">Department</label>
              <select
                className="form-select input-field"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedDoctor("");
                  setDoctorSelected(false);
                }}
              >
                <option value="" disabled>
                  Select Department
                </option>
                {[...new Set(doctors.map((d) => d.department))].map(
                  (dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="form-label">Doctor</label>
              <select
                className="form-select input-field"
                value={selectedDoctor}
                onChange={(e) => handleDoctorSelect(e.target.value)}
              >
                <option value="" disabled>
                  Select Doctor
                </option>
                {doctors
                  .filter((doc) => doc.department === selectedDepartment)
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* --- CALENDAR & SLOTS --- */}
          {doctorSelected && (
            <div className="form-grid-full" style={{ marginTop: "30px" }}>
              <div className="form-grid booking-calendar-container">
                {/* 1. Calendar */}
                <div className="calendar-wrapper">
                  <label className="form-label">Availability Calendar</label>
                  <LeaveCalendar
                    date={selectedDate}
                    onChange={handleDateSelect}
                    doctorId={selectedDoctor}
                    doctors={doctors}
                    pastLeaves={leaveRequests}
                  />
                </div>

                {/* 2. Slots Table */}
                <div className="slots-wrapper">
                  <label className="form-label">Available Time Slots</label>
                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Time Slot</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSlots &&
                      Object.keys(availableSlots).length > 0 ? (
                        Object.entries(availableSlots).map(([slot, count]) => {
                          const isHalfDayBlocked = isSlotBlocked(slot);
                          const isFullyBooked = count === 0;
                          const isDisabled = isHalfDayBlocked || isFullyBooked;

                          return (
                            <tr key={slot}>
                              <td>{slot}</td>
                              <td>
                                <label
                                  className={`availability ${
                                    isDisabled ? "disabled" : ""
                                  }`}
                                  onClick={(e) => {
                                    if (isDisabled) {
                                      e.preventDefault();
                                      if (isHalfDayBlocked)
                                        toast.error(
                                          "Doctor is on leave during this time."
                                        );
                                      else
                                        toast.error(
                                          "This slot is fully booked."
                                        );
                                    }
                                  }}
                                >
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    name="slot"
                                    value={slot}
                                    disabled={isDisabled}
                                    onChange={(e) => setSelectedTimeSlot(e)}
                                    checked={
                                      selectedTimeSlot?.target?.value === slot
                                    }
                                  />

                                  {/* Status Badge */}
                                  {isHalfDayBlocked ? (
                                    <span
                                      className="text-danger"
                                      style={{ minWidth: "120px" }}
                                    >
                                      <i className="bi bi-clock-history me-1"></i>{" "}
                                      On Leave
                                    </span>
                                  ) : (
                                    <span
                                      className={
                                        count > 0
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {count > 0
                                        ? `Available (${count})`
                                        : "Full"}
                                    </span>
                                  )}
                                </label>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              padding: "50px",
                              color: "#dc3545",
                              fontWeight: "bold",
                            }}
                          >
                            <i
                              className="bi bi-calendar-x me-2"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                            <br />
                            Doctor Not Available / On Leave
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {consultationCharge && (
            <div className="form-grid-full" style={{ marginTop: "25px" }}>
              <label className="form-label">Consultation Charge</label>
              <input
                className="form-control input-field"
                disabled
                value={consultationCharge}
              />
            </div>
          )}

          {selectedTimeSlot && (
            <div className="button-row" style={{ marginTop: "30px" }}>
              <button
                className="register-btn"
                type="button"
                onClick={handleSubmit}
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
