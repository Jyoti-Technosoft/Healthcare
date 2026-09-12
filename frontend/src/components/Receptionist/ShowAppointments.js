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
        setAppointments(data);
        setFilteredAppointments(data);
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
        <div className="top-header">
          <p className="total-patient">
            Total Appointments: <strong>{appointments.length}</strong>
          </p>

          <button
            type="button"
            className="btn-add"
            onClick={() => dispatch(setActiveTab("bookAppointment"))}
          >
            <i className="bi bi-plus"></i> Add
          </button>
        </div>

        <hr className="divider-line" />

        {/* TITLE + SEARCH */}
        <div className="title-row">
          <h3>Appointments</h3>

          <div className="search-box">
            <input type="text" placeholder="Search" onChange={handleSearch} />
            <i className="bi bi-search search-icon"></i>
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
