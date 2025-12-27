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
      setAppointments(appointmentsData || []);
      setFilteredAppointments(appointmentsData || []);

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
        <div className="patient-info-card">
          <div className="patient-info-header">
            <span className="label">Patient :</span>
            <span className="value name">{patients.name}</span>
          </div>

          <hr />

          <div className="patient-info-grid">
            <div>
              <p>
                <span className="label">ID:</span>{" "}
                <span className="value">{patients.id}</span>
              </p>
              <p>
                <span className="label">Contact:</span>{" "}
                <span className="value">{patients.contact}</span>
              </p>
            </div>

            <div>
              <p>
                <span className="label">Gender:</span>{" "}
                <span className="value text-capitalize">{patients.gender}</span>
              </p>
              <p>
                <span className="label">Age:</span>{" "}
                <span className="value">{patients.age}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Header + Search */}
        <div className="title-row">
          <h3>Appointments</h3>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Appointment ID"
              onChange={handleSearch}
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (Replaces DataTable) --- */}
        <div className="table-responsive mt-3">
          <table className="patient-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Charge</th>
                <th>Report</th>
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
                      <td>{row.id}</td>

                      {/* Date */}
                      <td>{formatDate(row.appointmentDate)}</td>

                      {/* Time */}
                      <td>{row.appointmentTime}</td>

                      {/* Charge */}
                      <td>{row.consultationCharge}</td>

                      {/* Report Action */}
                      <td>
                        {hasReport && (
                          <i
                            className="bi bi-eye-fill report-eye"
                            onClick={() => viewReport(row)}
                            title="View Report"
                          ></i>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
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
