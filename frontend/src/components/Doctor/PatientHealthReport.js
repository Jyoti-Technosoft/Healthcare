import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getHealthreportsByAppointmentId } from "../Api";
import Cookies from "js-cookie";
import { dateFormatter } from "../Validations";
import PatientDetailPage from "./PatientDetailPage";
import "../../assets/css/Doctor/PatientHealthReport.css"; // New CSS file

const PatientHealthReport = ({ appointment, patient }) => {
  const authToken = Cookies.get("authToken");
  const [healthReport, setHealthReport] = useState([]);
  const [activeTab, setActiveTab] = useState(true); // True = Show Report, False = Go Back
  const [loading, setLoading] = useState(true);

  // Handle Back Navigation
  const setBackMenu = () => {
    setActiveTab(false);
  };

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
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  function formatAppointmentDate(dateString) {
    return dateFormatter(dateString);
  }

  // --- COLUMNS ---
  const columns = [
    {
      name: "Index",
      selector: (row, index) => index + 1,
      sortable: true,
      maxWidth: "80px",
      center: true,
    },
    {
      name: "Report ID",
      selector: (row) => row.id,
      sortable: true,
      minWidth: "100px",
      center: true,
      style: { fontWeight: "bold", color: "#0150b5" },
    },
    {
      name: "Diagnosis / Disease",
      selector: (row) => row.disease,
      sortable: true,
      minWidth: "180px",
      style: { fontWeight: "600", color: "#333" },
    },
    {
      name: "Prescribed Medication",
      selector: (row) => (
        <div className="prescription-cell">
          {row.prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-tag">
              <span className="med-name">{prescription.medicineName}</span>
              <span className="med-detail">
                {prescription.dosage} | {prescription.timing}
              </span>
            </div>
          ))}
        </div>
      ),
      minWidth: "350px",
      wrap: true, // Allows text to wrap nicely
    },
    {
      name: "Doctor's Note",
      selector: (row) => row.notes,
      sortable: true,
      minWidth: "200px",
      wrap: true,
    },
  ];

  // If Back is clicked, render the parent component
  // Note: We pass the patient prop back so it doesn't crash
  if (!activeTab) {
    return <PatientDetailPage patient={patient} />;
  }

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* --- HEADER --- */}
        <div className="detail-header">
          <button className="btn-back" onClick={setBackMenu}>
            <i className="bi bi-arrow-left"></i> Back to History
          </button>
          <p className="report-id-label">
            Appointment ID: <strong>{appointment.id}</strong>
          </p>
        </div>

        <hr className="divider-line" />

        {/* --- SUMMARY SECTION (Matches Consultancy Form Style) --- */}
        <div className="patient-info-section">
          <h4 className="section-title">
            <i className="bi bi-person-vcard me-2"></i>Appointment & Patient
            Summary
          </h4>

          <div className="info-grid">
            <div className="info-item">
              <label>Patient Name</label>
              <span>{patient.name}</span>
            </div>
            <div className="info-item">
              <label>Contact</label>
              <span>{patient.contact}</span>
            </div>
            <div className="info-item">
              <label>Date</label>
              <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
            </div>
            <div className="info-item">
              <label>Time</label>
              <span>{appointment.appointmentTime}</span>
            </div>
            <div className="info-item">
              <label>Consultation Fee</label>
              <span className="text-success fw-bold">
                ₹{appointment.consultationCharge}
              </span>
            </div>
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="title-row mt-4 mb-3">
          <h3>Health Reports</h3>
        </div>

        <div className="table-responsive doctor-table-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading report...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={healthReport}
              pagination
              highlightOnHover
              noDataComponent={
                <div className="p-4 text-center text-muted bg-light rounded">
                  <i className="bi bi-file-earmark-medical fs-3 d-block mb-2"></i>
                  No health reports found for this appointment.
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHealthReport;
