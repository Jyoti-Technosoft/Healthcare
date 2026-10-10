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
        {/* TOP BAR WITH BREADCRUMB & BACK ACTION */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-circle p-2 shadow-sm"
              style={{ width: "38px", height: "38px", justifyContent: "center" }}
              onClick={() => dispatch(setActiveTab("showAppointments"))}
              title="Return to Appointments"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
            </button>
            <div>
              <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>calendar_add_on</span>
                Scheduling Desk
              </div>
              <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Book Clinical Appointment
              </h2>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: "12px" }}>
            AegisHealth Care Dispatch
          </span>
        </div>

        <div className="appointment-content">
          {/* --- SEARCH PATIENT --- */}
          <div className="form-grid-full mb-4">
            <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>person_search</span>
              Patient Lookup
            </label>
            <div className="position-relative">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <span className="material-symbols-outlined text-muted" style={{ fontSize: "18px" }}>search</span>
                </span>
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
                  placeholder="Search registered patients by name or contact number..."
                  className="form-control border-start-0 py-2"
                  style={{ fontSize: "14px" }}
                />
              </div>
              {suggestions.length > 0 && (
                <div
                  className="position-absolute w-100 mt-1 bg-white border rounded-3 shadow-lg"
                  style={{ zIndex: 1050, maxHeight: "240px", overflowY: "auto" }}
                >
                  {suggestions.map((patient, index) => (
                    <div
                      key={patient.id || index}
                      onClick={() => {
                        setSearchQuery(patient);
                        handleSuggestionClick(patient);
                        setSuggestions([]);
                      }}
                      className="p-3 border-bottom d-flex align-items-center justify-content-between hover-bg-light cursor-pointer"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
                          style={{ width: "32px", height: "32px", fontSize: "12px" }}
                        >
                          {patient.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{patient.name}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>{patient.contact} &bull; {patient.gender || "Patient"}</div>
                        </div>
                      </div>
                      <span className="badge bg-light text-secondary border">Select</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- PATIENT DETAILS --- */}
          {clickedPatient && (
            <div className="p-3 mb-4 rounded-3 border bg-light d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary fw-bold"
                  style={{ width: "42px", height: "42px", fontSize: "16px" }}
                >
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <div className="fw-bold text-dark">{clickedPatient.name}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    Patient ID: #{clickedPatient.id} &bull; Contact: {clickedPatient.contact}
                  </div>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill">
                Verified Patient
              </span>
            </div>
          )}

          {/* --- DOCTOR SELECTION --- */}
          <div className="form-grid-full mt-4">
            <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>stethoscope</span>
              Consulting Physician &amp; Department
            </label>
          </div>

          <div className="form-grid">
            <div>
              <label className="form-label text-secondary" style={{ fontSize: "13px" }}>Medical Department</label>
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
              <label className="form-label text-secondary" style={{ fontSize: "13px" }}>Attending Doctor</label>
              <select
                className="form-select input-field"
                value={selectedDoctor}
                onChange={(e) => handleDoctorSelect(e.target.value)}
                disabled={!selectedDepartment}
              >
                <option value="" disabled>
                  {selectedDepartment ? "Select Doctor" : "Select Department First"}
                </option>
                {doctors
                  .filter((doc) => doc.department === selectedDepartment)
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* --- CALENDAR & SLOTS --- */}
          {doctorSelected && (
            <div className="form-grid-full mt-4">
              <div className="form-grid booking-calendar-container">
                {/* 1. Calendar */}
                <div className="calendar-wrapper border rounded-3 p-3 bg-white shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>calendar_today</span>
                    <label className="form-label mb-0 fw-bold text-dark">Schedule &amp; Leave Calendar</label>
                  </div>
                  <LeaveCalendar
                    date={selectedDate}
                    onChange={handleDateSelect}
                    doctorId={selectedDoctor}
                    doctors={doctors}
                    pastLeaves={leaveRequests}
                  />
                </div>

                {/* 2. Slots Table */}
                <div className="slots-wrapper border rounded-3 p-3 bg-white shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined text-info" style={{ fontSize: "20px" }}>schedule</span>
                      <label className="form-label mb-0 fw-bold text-dark">Available Time Windows</label>
                    </div>
                    <span className="badge bg-light text-secondary border">30 Min Consultation</span>
                  </div>

                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th style={{ width: "45%" }}>Time Slot</th>
                        <th>Slot Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSlots &&
                      Object.keys(availableSlots).length > 0 ? (
                        Object.entries(availableSlots).map(([slot, count]) => {
                          const isHalfDayBlocked = isSlotBlocked(slot);
                          const isFullyBooked = count === 0;
                          const isDisabled = isHalfDayBlocked || isFullyBooked;
                          const isSelected = selectedTimeSlot?.target?.value === slot;

                          return (
                            <tr
                              key={slot}
                              style={{
                                backgroundColor: isSelected ? "#eef6fc" : "transparent",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="material-symbols-outlined text-muted" style={{ fontSize: "16px" }}>schedule</span>
                                  <strong className="text-dark">{slot}</strong>
                                </div>
                              </td>
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
                                    checked={isSelected}
                                  />

                                  {/* Status Badge */}
                                  {isHalfDayBlocked ? (
                                    <span
                                      className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill"
                                      style={{ minWidth: "100px" }}
                                    >
                                      On Leave
                                    </span>
                                  ) : (
                                    <span
                                      className={`badge px-2.5 py-1.5 rounded-pill border ${
                                        count > 0
                                          ? "bg-success-subtle text-success border-success-subtle"
                                          : "bg-secondary-subtle text-secondary border-secondary-subtle"
                                      }`}
                                      style={{ minWidth: "100px" }}
                                    >
                                      {count > 0
                                        ? `Available (${count})`
                                        : "Booked Out"}
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
                              padding: "40px 20px",
                              color: "#dc3545",
                            }}
                          >
                            <span className="material-symbols-outlined text-danger mb-2" style={{ fontSize: "36px" }}>
                              event_busy
                            </span>
                            <div className="fw-bold">Doctor Not Available / On Leave</div>
                            <small className="text-muted">Please select another date on the calendar</small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- CONSULTATION CHARGE CARD --- */}
          {consultationCharge && (
            <div className="form-grid-full mt-4">
              <div className="p-3 border rounded-3 bg-primary-subtle border-primary-subtle d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>payments</span>
                  <div>
                    <div className="fw-bold text-dark">Standard Consultation Fee</div>
                    <small className="text-secondary">Official institutional tariff for selected physician</small>
                  </div>
                </div>
                <div className="text-end">
                  <div className="fs-4 fw-bold text-primary">₹ {consultationCharge}</div>
                  <span className="badge bg-white text-primary border border-primary-subtle">Payment at Reception</span>
                </div>
              </div>
            </div>
          )}

          {selectedTimeSlot && (
            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-3 fw-bold shadow-sm"
                style={{ backgroundColor: "#006194", borderColor: "#006194" }}
                type="button"
                onClick={handleSubmit}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>check_circle</span>
                <span>Confirm &amp; Schedule Appointment</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
