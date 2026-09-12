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
        {/* Back button */}
        <i className="bi bi-arrow-left go-back-btn" onClick={setBackMenu}></i>

        {/* Patient info */}
        {patient && (
          <div className="patient-info-card">
            <h5 className="fw-bold">Appointment Details</h5>
            <br />
            <div className="patient-info-grid">
              <div>
                <p>
                  <span className="label">Patient ID:</span>{" "}
                  <span className="value">{patient.id}</span>
                </p>
                <p>
                  <span className="label">Name:</span>{" "}
                  <span className="value">{patient.name}</span>
                </p>
                <p>
                  <span className="label">Contact:</span>{" "}
                  <span className="value">{patient.contact}</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="label">Date:</span>{" "}
                  <span className="value">
                    {formatAppointmentDate(appointment.appointmentDate)}
                  </span>
                </p>
                <p>
                  <span className="label">Time:</span>{" "}
                  <span className="value">{appointment.appointmentTime}</span>
                </p>
                <p>
                  <span className="label">Charge:</span>{" "}
                  <span className="value">
                    ₹{appointment.consultationCharge}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <h3 className="fw-normal text-secondary fs-4 mt-4 mb-3">
          <b style={{ color: "black" }}>Health Reports</b>
        </h3>

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
