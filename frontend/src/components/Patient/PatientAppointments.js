import React, { useEffect, useState } from "react";
// REMOVED: import DataTable from "react-data-table-component";
import {
  getAllAppointmentsForPatient,
  getPatientApi,
  getAllHealthreports,
} from "../Api";
import Cookies from "js-cookie";
import { dateFormatter } from "../Validations";
import PatientHealthreport from "./PatientHealthreport";
import "../../assets/css/Patient/PatientDetail.css";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [healthReport, setHealthReport] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showHealthreport, setShowHealthreport] = useState(true);

  const userId = Cookies.get("userId");
  const authToken = Cookies.get("authToken");

  const formatDate = (d) => dateFormatter(d);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const patientData = await getPatientApi(userId, authToken);
      setPatients(patientData);

      const appointmentsData = await getAllAppointmentsForPatient(
        patientData.id,
        authToken
      );
      const appointmentsList = Array.isArray(appointmentsData) ? appointmentsData : [];
      setAppointments(appointmentsList);
      setFilteredAppointments(appointmentsList);

      const reports = await getAllHealthreports(authToken);
      setHealthReport(reports || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = appointments.filter((a) =>
      a.id.toString().toLowerCase().includes(value)
    );
    setFilteredAppointments(filtered);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = filteredAppointments.slice(startIndex, endIndex);

  const viewReport = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHealthreport(false);
  };

  return showHealthreport ? (
    <div className="patient-app-container">
      <div className="app-card">
        {/* Patient Info Section */}
        <div className="p-4 mb-4 rounded-3 border bg-light">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>person</span>
              <h4 className="mb-0 fw-bold text-dark">{patients.name || "Patient Record"}</h4>
            </div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill">
              Patient ID: #{patients.id}
            </span>
          </div>

          <div className="row g-3">
            <div className="col-md-3 col-6">
              <small className="text-secondary d-block">Contact Phone</small>
              <strong className="text-dark">{patients.contact || "-"}</strong>
            </div>
            <div className="col-md-3 col-6">
              <small className="text-secondary d-block">Gender</small>
              <strong className="text-dark text-capitalize">{patients.gender || "-"}</strong>
            </div>
            <div className="col-md-3 col-6">
              <small className="text-secondary d-block">Age</small>
              <strong className="text-dark">{patients.age ? `${patients.age} Years` : "-"}</strong>
            </div>
            <div className="col-md-3 col-6">
              <small className="text-secondary d-block">Total Consultations</small>
              <strong className="text-dark">{appointments.length} Visits</strong>
            </div>
          </div>
        </div>

        {/* Header + Search */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>history</span>
              Encounter History
            </div>
            <h3 className="fw-bold text-dark mb-0" style={{ fontSize: "20px" }}>Medical Appointments Timeline</h3>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Appointment ID..."
              onChange={handleSearch}
            />
            <span className="material-symbols-outlined search-icon" style={{ fontSize: "18px" }}>search</span>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (Replaces DataTable) --- */}
        <div className="table-responsive mt-3">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Appointment Ref</th>
                <th>Scheduled Date</th>
                <th>Consultation Time</th>
                <th>Fee Tariff</th>
                <th>Medical Report</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.length > 0 ? (
                displayedData.map((row) => {
                  const hasReport = healthReport.some(
                    (r) => r.appointment.id === row.id
                  );

                  return (
                    <tr key={row.id}>
                      {/* ID */}
                      <td>
                        <span className="badge font-monospace text-dark bg-light border">
                          #APT-{row.id}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="d-flex align-items-center gap-1.5 text-dark fw-medium">
                          <span className="material-symbols-outlined text-muted" style={{ fontSize: "16px" }}>calendar_today</span>
                          {formatDate(row.appointmentDate)}
                        </div>
                      </td>

                      {/* Time */}
                      <td>
                        <div className="d-flex align-items-center gap-1.5 text-secondary">
                          <span className="material-symbols-outlined text-muted" style={{ fontSize: "16px" }}>schedule</span>
                          {row.appointmentTime}
                        </div>
                      </td>

                      {/* Charge */}
                      <td>
                        <strong className="text-dark">₹ {row.consultationCharge}</strong>
                      </td>

                      {/* Report Action */}
                      <td>
                        {hasReport ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill"
                            onClick={() => viewReport(row)}
                            title="View Health Report"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>description</span>
                            <span>View Report</span>
                          </button>
                        ) : (
                          <span className="badge bg-light text-muted border">Pending Notes</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="no-data text-center py-4 text-muted">
                    <span className="material-symbols-outlined d-block mb-1 text-muted" style={{ fontSize: "32px", opacity: 0.6 }}>
                      calendar_month
                    </span>
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-footer">
          <label>Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>

          <span>
            {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)}{" "}
            of {filteredAppointments.length}
          </span>

          <div className="pagination-controls">
            <button onClick={() => setPage(1)} disabled={page === 1}>
              |&lt;
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              &lt;
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              &gt;
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              &gt;|
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <PatientHealthreport
      appointment={selectedAppointment}
      patient={patients}
      onBack={() => setShowHealthreport(true)} // Optional: if you have a back button in child
    />
  );
}
