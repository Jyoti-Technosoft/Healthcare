import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getAllAppointmentsForPatient } from "../Api";
import Cookies from "js-cookie";
import { dateFormatter } from "../Validations";
import Patients from "./Patients";
import PatientHealthReport from "./PatientHealthReport";
import "../../assets/css/Doctor/PatientDetailPage.css";

const PatientDetailPage = ({ patient }) => {
  const authToken = Cookies.get("authToken");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientId = patient.id;
        const data = await getAllAppointmentsForPatient(patientId, authToken);
        setAppointments(data);
        setFilteredAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const setBackMenu = () => {
    setActiveTab(2);
  };

  const setReportPage = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveTab(3);
  };

  function formatAppointmentDate(dateString) {
    return dateFormatter(dateString);
  }

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredAppointments.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredData = appointments.filter((appointment) =>
      appointment.id.toString().includes(keyword)
    );
    setFilteredAppointments(filteredData);
    setPage(1);
  };

  const columns = [
    {
      name: "Index",
      selector: (row, index) => startIndex + index + 1,
      sortable: true,
      maxWidth: "80px",
      center: true,
    },
    {
      name: "Appt ID",
      selector: (row) => row.id,
      sortable: true,
      minWidth: "120px",
      center: true,
    },
    {
      name: "Date",
      selector: (row) => formatAppointmentDate(row.appointmentDate),
      sortable: true,
      minWidth: "150px",
      center: true,
    },
    {
      name: "Time",
      selector: (row) => row.appointmentTime,
      sortable: true,
      minWidth: "150px",
      center: true,
    },
    {
      name: "Charge",
      selector: (row) => row.consultationCharge,
      sortable: true,
      center: true,
    },
    {
      name: "Action",
      center: true,
      selector: (row) => (
        <button
          className="btn-action-icon"
          onClick={() => setReportPage(row)}
          title="View Report"
        >
          <i className="bi bi-eye-fill"></i>
        </button>
      ),
      sortable: false,
    },
  ];

  if (activeTab === 2) return <Patients />;
  if (activeTab === 3)
    return (
      <PatientHealthReport
        appointment={selectedAppointment}
        patient={patient}
      />
    );

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* HEADER WITH BACK BUTTON */}
        <div className="detail-header">
          <button className="btn-back" onClick={setBackMenu}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <p className="total-counter">
            Total Appointments: <strong>{filteredAppointments.length}</strong>
          </p>
        </div>

        <hr className="divider-line" />

        {/* PATIENT DETAILS CARD SECTION */}
        {patient && (
          <div className="patient-info-section">
            {/* HEADER ROW: Title Left, Search Right */}
            <div className="patient-header-row">
              <h4 className="section-title">Patient Details</h4>

              {/* MOVED SEARCH BOX HERE */}
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search ID..."
                  onChange={handleSearch}
                />
                <i className="bi bi-search search-icon"></i>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Patient ID:</label>
                <span>{patient.id}</span>
              </div>
              <div className="info-item">
                <label>Name:</label>
                <span>{patient.name}</span>
              </div>
              <div className="info-item">
                <label>Contact:</label>
                <span>{patient.contact}</span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{patient.gender}</span>
              </div>
              <div className="info-item">
                <label>Date of Birth:</label>
                <span>{patient.dateOfBirth}</span>
              </div>
              <div className="info-item">
                <label>Age:</label>
                <span>{patient.age}</span>
              </div>
            </div>
          </div>
        )}

        {/* TABLE TITLE ONLY (Search moved up) */}
        <div className="title-row mt-4">
          <h3>Appointment History</h3>
        </div>

        {/* TABLE */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
          ) : (
            <DataTable
              columns={columns}
              data={paginatedData}
              pagination={false}
              highlightOnHover
              noDataComponent="No appointments found"
            />
          )}
        </div>

        {/* CUSTOM PAGINATION FOOTER */}
        {!loading && filteredAppointments.length > 0 && (
          <div className="pagination-footer">
            <label>Rows per page: </label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
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
        )}
      </div>
    </div>
  );
};

export default PatientDetailPage;
