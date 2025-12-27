import React, { useEffect, useState } from "react";
// REMOVED: import DataTable from "react-data-table-component";
import { getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from "../Api";
import Cookies from "js-cookie";
import ConsultancyModal from "./ConsultancyModal";
import { dateFormatter } from "../Validations";
import "../../assets/css/Doctor/Appointments.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const userId = Cookies.get("userId");
  const authToken = Cookies.get("authToken");

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showCloseButton, setShowCloseButton] = useState(false);

  function formatAppointmentDate(dateString) {
    return dateFormatter(dateString);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, authToken);
        const fetchedDoctorId = doctorInfo.id;
        const data = await getAppointmentWithoutHealthReport(
          fetchedDoctorId,
          authToken
        );
        setAppointments(data);
        setFilteredAppointments(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, authToken]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredAppointments.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredData = appointments.filter(
      (appointment) =>
        appointment.patient.id.toString().includes(keyword) ||
        appointment.patient.name.toLowerCase().includes(keyword) ||
        appointment.patient.contact.toLowerCase().includes(keyword) ||
        appointment.appointmentDate.toLowerCase().includes(keyword) ||
        appointment.appointmentTime.toLowerCase().includes(keyword)
    );
    setFilteredAppointments(filteredData);
    setPage(1);
  };

  const handleToggleModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setPrescriptions([]);
    setShowCloseButton(false);
  };

  const handleAddPrescription = () => {
    const newPrescription = { medicineName: "", dosage: "", timing: "" };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  const handleRemovePrescription = (indexToRemove) => {
    const updatedPrescriptions = prescriptions.filter(
      (_, index) => index !== indexToRemove
    );
    setPrescriptions(updatedPrescriptions);
  };

  const handleCloseButtonClick = () => {
    setShowCloseButton(false);
    setPrescriptions([]);
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* Top Header */}
        <div className="top-header">
          <p className="total-patient">
            Total Appointments: <strong>{filteredAppointments.length}</strong>
          </p>
        </div>

        <hr className="divider-line" />

        {/* Title & Search */}
        <div className="title-row">
          <h3>Appointments</h3>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (REPLACES DATATABLE) --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
          ) : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Appointment ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Charge</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr key={row.id}>
                      {/* Index */}
                      <td>{startIndex + index + 1}</td>

                      {/* Appt ID */}
                      <td>{row.id}</td>

                      {/* Patient ID */}
                      <td>{row.patient.id}</td>

                      {/* Patient Name */}
                      <td>{row.patient.name}</td>

                      {/* Date */}
                      <td>{formatAppointmentDate(row.appointmentDate)}</td>

                      {/* Time */}
                      <td>{row.appointmentTime}</td>

                      {/* Charge */}
                      <td>{row.consultationCharge}</td>

                      {/* Action Button */}
                      <td>
                        <button
                          className="btn-report-icon"
                          onClick={() => handleToggleModal(row)}
                          title="View Report"
                        >
                          <i className="bi bi-clipboard2-pulse"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION FOOTER */}
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
        )}

        {/* MODAL */}
        {selectedAppointment && (
          <ConsultancyModal
            appointment={selectedAppointment}
            prescriptions={prescriptions}
            setPrescriptions={setPrescriptions}
            showCloseButton={showCloseButton}
            setShowCloseButton={setShowCloseButton}
            handleAddPrescription={handleAddPrescription}
            handleRemovePrescription={handleRemovePrescription}
            handleCloseButtonClick={handleCloseButtonClick}
            handleCloseModal={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
