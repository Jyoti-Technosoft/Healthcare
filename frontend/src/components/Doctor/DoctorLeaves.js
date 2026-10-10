import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { convertTo12HourFormat } from "../Validations";
import { getDoctorsWithIdApi, getDoctorLeaveRequest } from "../Api";
import Cookies from "js-cookie";
// REMOVED: import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import "../../assets/css/Doctor/DoctorLeaves.css";
import AddDoctorLeaves from "./AddDoctorLeaves";

export default function DoctorLeaves() {
  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();
  const [pastLeaves, setPastLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId");

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const setMenu = (submenu) => {
    dispatch(setActiveTab(submenu));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, token);
        const fetchedDoctorId = doctorInfo.id;
        const data = await getDoctorLeaveRequest(fetchedDoctorId, token);
        setPastLeaves(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(pastLeaves.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = pastLeaves.slice(startIndex, endIndex);

  if (activeTab === "addDoctorLeaves") {
    return <AddDoctorLeaves />;
  }

  return (
    <div className="background_part">
      <div className="register-card">
        {/* TOP HEADER: Total Count + Add Button */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>event_busy</span>
              Physician Scheduling &amp; Leaves
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Leave History &amp; Time-Off Registry
            </h2>
            <p className="text-muted mb-0 mt-1" style={{ fontSize: "13px" }}>
              Total Requests: <strong className="text-dark">{pastLeaves.length}</strong> recorded leaves
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-3 fw-semibold shadow-sm"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => setMenu("addDoctorLeaves")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span>
            <span>Apply For Leave</span>
          </button>
        </div>

        {/* TITLE ROW */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>Leave Schedule Logs</h4>
          <span className="badge bg-light text-secondary border px-2.5 py-1.5">
            Showing {paginatedData.length} entries
          </span>
        </div>

        {/* --- STANDARD HTML TABLE --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-4">Loading leave records...</p>
          ) : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>From Time</th>
                  <th>To Time</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr key={index}>
                      {/* Index */}
                      <td>{startIndex + index + 1}</td>

                      {/* From Date */}
                      <td>{row.fromDate}</td>

                      {/* To Date */}
                      <td>{row.toDate}</td>

                      {/* From Time */}
                      <td>
                        {row.fromTime
                          ? convertTo12HourFormat(row.fromTime)
                          : "-"}
                      </td>

                      {/* To Time */}
                      <td>
                        {row.toTime ? convertTo12HourFormat(row.toTime) : "-"}
                      </td>

                      {/* Reason */}
                      <td title={row.reason}>{row.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No past leave found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* CUSTOM PAGINATION FOOTER */}
        {!loading && pastLeaves.length > 0 && (
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
              {startIndex + 1}-{Math.min(endIndex, pastLeaves.length)} of{" "}
              {pastLeaves.length}
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
}
