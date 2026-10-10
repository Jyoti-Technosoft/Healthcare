import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getHealthreportsByAppointmentId } from "../Api";
import Cookies from "js-cookie";
import { dateFormatter } from "../Validations";
import PatientAppointments from "./PatientAppointments";
import "../../assets/css/Patient/PatientHealthReport.css";

const PatientHealthreport = ({ appointment, patient }) => {
  const authToken = Cookies.get("authToken");

  const [healthReport, setHealthReport] = useState([]);
  const [activeTab, setActiveTab] = useState(true);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const setBackMenu = () => setActiveTab(false);

  function formatAppointmentDate(dateString) {
    return dateFormatter(dateString);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentId = appointment.id;
        const data = await getHealthreportsByAppointmentId(
          appointmentId,
          authToken
        );
        setHealthReport(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // pagination logic
  const totalPages = Math.ceil(healthReport.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = healthReport.slice(startIndex, endIndex);

  const columns = [
    {
      name: "Index",
      selector: (row, index) => startIndex + index + 1,
      sortable: true,
      maxWidth: "70px",
    },
    {
      name: "Healthreport ID",
      selector: (row) => row.id,
      sortable: true,
      minWidth: "110px",
    },
    {
      name: "Disease",
      selector: (row) => row.disease,
      sortable: true,
      minWidth: "160px",
    },
    {
      name: "Prescription",
      selector: (row) => (
        <ul className="prescription-list">
          {row.prescriptions.map((prescription) => (
            <li key={prescription.id} className="prescription-item">
              <strong>{prescription.medicineName}</strong> - Dosage:{" "}
              {prescription.dosage}, Timing: {prescription.timing}
            </li>
          ))}
        </ul>
      ),
      minWidth: "400px",
    },
    {
      name: "Note",
      selector: (row) => row.notes,
      sortable: true,
      minWidth: "200px",
    },
  ];

  return activeTab ? (
    <div className="patient-app-container">
      <div className="app-card">
        {/* Top Back Action & Title */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 rounded-circle p-2 shadow-sm"
              style={{ width: "38px", height: "38px", justifyContent: "center" }}
              onClick={setBackMenu}
              title="Return to Appointments"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
            </button>
            <div>
              <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>description</span>
                Clinical Record
              </div>
              <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Patient Medical &amp; Prescription Report
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>print</span>
            <span>Print Report</span>
          </button>
        </div>

        {/* Patient info */}
        {patient && (
          <div className="p-3 mb-4 rounded-3 border bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
              <span className="fw-bold text-dark d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>badge</span>
                Patient Encounter Summary
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                Encounter #{appointment.id}
              </span>
            </div>
            <div className="row g-2">
              <div className="col-md-3 col-6">
                <small className="text-secondary d-block">Patient Name</small>
                <strong className="text-dark">{patient.name}</strong>
              </div>
              <div className="col-md-3 col-6">
                <small className="text-secondary d-block">Patient ID</small>
                <strong className="text-dark">#{patient.id}</strong>
              </div>
              <div className="col-md-3 col-6">
                <small className="text-secondary d-block">Consultation Date</small>
                <strong className="text-dark">{formatAppointmentDate(appointment.appointmentDate)}</strong>
              </div>
              <div className="col-md-3 col-6">
                <small className="text-secondary d-block">Session Time</small>
                <strong className="text-dark">{appointment.appointmentTime}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>clinical_notes</span>
          <h4 className="fw-bold text-dark mb-0">Physician Diagnosis &amp; Prescribed Regimen</h4>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={displayedData}
              pagination={false}
              highlightOnHover
              noDataComponent="No health report found"
            />

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
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>

              <span>
                {startIndex + 1}-{Math.min(endIndex, healthReport.length)} of{" "}
                {healthReport.length}
              </span>

              <button onClick={() => setPage(1)}>|&lt;</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
                &lt;
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                &gt;
              </button>
              <button onClick={() => setPage(totalPages)}>&gt;|</button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <PatientAppointments />
  );
};

export default PatientHealthreport;
