import React, { useEffect, useState } from "react";
// REMOVED: import DataTable from "react-data-table-component";
import { getAllAppointments } from "../Api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import { convertTo12Hour } from "../Validations";
import "../../assets/css/Receptionist/AppointmentList.css";

export default function ShowAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Pagination states
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const token = Cookies.get("authToken");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveTab("showAppointments"));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAppointments(token);
        const appointmentsData = Array.isArray(data) ? data : [];
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();

    const filtered = appointments.filter(
      (item) =>
        item.id.toString().includes(keyword) ||
        item.patient.name.toLowerCase().includes(keyword) ||
        item.patient.contact.toLowerCase().includes(keyword) ||
        item.patient.user.email.toLowerCase().includes(keyword)
    );

    setFilteredAppointments(filtered);
    setPage(1);
  };

  // Pagination Calculations
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredAppointments.slice(startIndex, endIndex);

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>event_note</span>
              Master Schedule Hub
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Clinical Appointments Directory
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              Total Records: <strong className="text-dark">{appointments.length}</strong> appointments registered
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => dispatch(setActiveTab("bookAppointment"))}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span>
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
              Showing {filteredAppointments.length} matching entries
            </span>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search patient, email, contact..." onChange={handleSearch} />
            <span className="material-symbols-outlined search-icon" style={{ fontSize: "18px" }}>search</span>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (LEFT ALIGNED) --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
          ) : (
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>Address</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Fees</th>
                  <th>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{row.id}</td>
                      <td>{row.patient.name}</td>
                      <td title={row.patient.user.email}>
                        {row.patient.user.email}
                      </td>
                      <td>{row.patient.contact}</td>
                      <td>{row.patient.gender}</td>
                      <td>{row.patient.age}</td>
                      <td>{row.patient.weight}</td>
                      <td>{row.patient.height}</td>
                      <td title={row.patient.address}>{row.patient.address}</td>
                      <td>{row.doctor.name}</td>
                      <td>{row.doctor.department}</td>
                      <td>{row.appointmentDate}</td>
                      <td>{convertTo12Hour(row.appointmentTime)}</td>
                      <td>{row.consultationCharge}</td>
                      <td>{row.paymentMode}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="no-data">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION FOOTER */}
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
      </div>
    </div>
  );
}
