import React, { useEffect, useState } from "react";
import { getAllUsers } from "../Api";
import Cookies from "js-cookie";
import "../../assets/css/Admin/adminDashboard.css";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [receptionist, setReceptionist] = useState([]);
  const [doctor, setDoctor] = useState([]);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = Cookies.get("authToken");
  const dispatch = useDispatch();

  const setMenu = (menu) => {
    dispatch(setActiveTab(menu));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers(token);
        const data = Array.isArray(response) ? response : [];
        setUsers(data);
        setReceptionist(data.filter((u) => u.role === "Receptionist"));
        setDoctor(data.filter((u) => u.role === "Doctor"));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [token]);

  // --- UPDATED LOGIC FOR TODAY'S USERS ---
  const todayUsersCount = () => {
    // Get today's date string (e.g., "Fri Nov 21 2025") based on local time
    const today = new Date().toDateString(); 

    return users.filter((user) => {
      // Ensure createdTime exists
      if (!user.createdTime) return false; 
      
      // Convert the DB timestamp to a date string
      const userDate = new Date(user.createdTime).toDateString();
      
      // Compare only the date part (ignoring time)
      return userDate === today;
    }).length;
  };

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = users.slice(startIndex, endIndex);

  const cards = [
    {
      title: "Total Registered Users",
      value: users.length,
      badgeText: "All Roles",
      badgeClass: "text-primary bg-primary-subtle",
      icon: "groups",
      color: "#006194",
    },
    {
      title: "New Users Registered Today",
      value: todayUsersCount(),
      badgeText: "Active Today",
      badgeClass: "text-success bg-success-subtle",
      icon: "person_add",
      color: "#006947",
    },
    {
      title: "Active Front Desk Staff",
      value: receptionist.length,
      badgeText: "Clinical Front Desk",
      badgeClass: "text-warning bg-warning-subtle",
      icon: "support_agent",
      color: "#92400e",
    },
    {
      title: "Verified Clinical MDs",
      value: doctor.length,
      badgeText: "Board Certified",
      badgeClass: "text-info bg-info-subtle",
      icon: "stethoscope",
      color: "#0284c7",
    },
  ];

  return (
    <div className="admin-dashboard-container">
      {/* SECTION HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>admin_panel_settings</span>
            AegisHealth Enterprise Administration
          </div>
          <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Clinical User &amp; Access Governance
          </h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => setMenu("registerUsers")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person_add</span>
            <span>Register New User</span>
          </button>
        </div>
      </div>

      {/* TOP BENTO STAT GRID */}
      <div className="admin-top-grid">
        {cards.map((card, index) => (
          <div key={index} className="flat-card">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="flat-card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>{card.icon}</span>
              </div>
              <span className={`badge rounded-pill px-2.5 py-1 ${card.badgeClass}`} style={{ fontSize: "11px" }}>
                {card.badgeText}
              </span>
            </div>
            <div className="flat-card-info">
              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE GRID: AUDIT TABLE */}
      <div className="admin-middle-grid">
        <div className="appointments-box">
          <div className="appointments-header">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>manage_accounts</span>
              <h3 className="mb-0">Directory Audit &amp; System Accounts</h3>
            </div>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              style={{ color: "#006194", fontSize: "13px" }}
              onClick={() => setMenu("usersList")}
            >
              View Full User Roster &rarr;
            </button>
          </div>

          {/* TABLE CONTENT */}
          <div className="box-content">
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Clinical Email / Identity</th>
                    <th>System Scope / Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-semibold text-secondary">#{user.id}</td>
                        <td className="fw-medium text-dark">{user.email || "-"}</td>
                        <td>
                          <span
                            className="badge px-2.5 py-1 rounded-pill"
                            style={{
                              backgroundColor:
                                user.role === "Doctor"
                                  ? "#e0f2fe"
                                  : user.role === "Receptionist"
                                  ? "#fef3c7"
                                  : user.role === "SuperAdmin"
                                  ? "#fee2e2"
                                  : "#f1f5f9",
                              color:
                                user.role === "Doctor"
                                  ? "#0284c7"
                                  : user.role === "Receptionist"
                                  ? "#b45309"
                                  : user.role === "SuperAdmin"
                                  ? "#b91c1c"
                                  : "#475569",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {user.role || "User"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- PAGINATION FOOTER --- */}
          {users.length > 0 && (
            <div className="pagination-footer">
              <label>Rows per page:</label>
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
                {startIndex + 1}–{Math.min(endIndex, users.length)} of{" "}
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
    </div>
  );
}