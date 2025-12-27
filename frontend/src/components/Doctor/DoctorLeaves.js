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
        <div className="top-header">
          <p className="total-count">
            Total Leaves: <strong>{pastLeaves.length}</strong>
          </p>

          <button
            type="button"
            className="btn-add"
            onClick={() => setMenu("addDoctorLeaves")}
          >
            <i className="bi bi-plus"></i> Apply Leave
          </button>
        </div>

        <hr className="divider-line" />

        {/* TITLE ROW */}
        <div className="title-row">
          <h3 className="register-title">Past Leaves</h3>
        </div>

        {/* --- STANDARD HTML TABLE --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
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
