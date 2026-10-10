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

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    return (
      (u.email && u.email.toLowerCase().includes(search)) ||
      (u.role && u.role.toLowerCase().includes(search)) ||
      String(u.id).includes(search)
    );
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>admin_panel_settings</span>
              User Access Management
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              System Users Directory
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              Total Records: <strong className="text-dark">{users.length}</strong> registered system accounts
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => setMenu("registerUsers")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person_add</span>
            <span>Register New User</span>
          </button>
        </div>

        {/* SEARCH ROW */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
              Showing {filteredUsers.length} matching accounts
            </span>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search user ID, email, role..."
              value={search}
              onChange={handleSearch}
            />
            <span className="material-symbols-outlined search-icon" style={{ fontSize: "18px" }}>search</span>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-4">Loading user records...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Index</th>
                  <th style={{ width: "120px" }}>User ID</th>
                  <th>Email Account</th>
                  <th style={{ width: "160px" }}>Access Role</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((user, index) => {
                    const roleBadgeClass =
                      user.role === "Doctor"
                        ? "bg-primary-subtle text-primary border-primary-subtle"
                        : user.role === "Receptionist"
                        ? "bg-warning-subtle text-dark border-warning-subtle"
                        : user.role === "Admin"
                        ? "bg-danger-subtle text-danger border-danger-subtle"
                        : "bg-success-subtle text-success border-success-subtle";

                    return (
                      <tr key={user.id || index}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <span className="badge bg-light text-secondary border">#{user.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined text-muted" style={{ fontSize: "18px" }}>account_circle</span>
                            <span className="fw-medium text-dark">{user.email || "-"}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge border px-2.5 py-1 rounded-pill fw-semibold ${roleBadgeClass}`}>
                            {user.role || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No system users found matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* CUSTOM PAGINATION FOOTER */}
        {!loading && filteredUsers.length > 0 && (
          <div className="pagination-footer d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
              <span>Rows per page:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px", height: "32px" }}
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
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted" style={{ fontSize: "13px" }}>
                {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
              </span>

              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="First Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>first_page</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Previous Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  title="Next Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  title="Last Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>last_page</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
