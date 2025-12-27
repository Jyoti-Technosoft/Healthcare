import React, { useEffect, useState } from "react";
// Removed DataTable import
import { getAllUsers } from "../Api";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import Cookies from "js-cookie";
import "../../assets/css/Admin/UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = Cookies.get("authToken");
  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers(token);
        setUsers(Array.isArray(response) ? response : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const setMenu = (submenu) => {
    if (activeTab === "usersList") {
      dispatch(setActiveTab(submenu));
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = users.slice(startIndex, endIndex);

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* HEADER */}
        <div className="top-header">
          <p className="total-patient">
            Total Users: <strong>{users.length}</strong>
          </p>

          <button
            type="button"
            className="btn-add"
            onClick={() => setMenu("registerUsers")}
          >
            <i className="bi bi-plus"></i> Add
          </button>
        </div>

        <hr className="divider-line" />

        {/* TITLE + SEARCH */}
        <div className="title-row">
          <h3>Users List</h3>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>User Id</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((user, index) => (
                    <tr key={user.id || index}>
                      {/* Index Calculation */}
                      <td>{startIndex + index + 1}</td>

                      {/* User ID */}
                      <td>{user.id}</td>

                      {/* Email */}
                      <td>{user.email || "-"}</td>

                      {/* Role */}
                      <td>{user.role || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* CUSTOM PAGINATION FOOTER */}
        {!loading && users.length > 0 && (
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
              {startIndex + 1}-{Math.min(endIndex, users.length)} of{" "}
              {users.length}
            </span>

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
        )}
      </div>
    </div>
  );
}
