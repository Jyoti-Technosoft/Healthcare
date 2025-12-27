import React, { useEffect, useState } from "react";
import { getAllUsers } from "../Api";
import Cookies from "js-cookie";
import "../../assets/css/Admin/adminDashboard.css";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faUserNurse,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";

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
      title: "Total Users",
      value: users.length,
      color: "#6F42C1",
      icon: faUsers,
    },
    {
      title: "Today's Users",
      value: todayUsersCount(), // Calling the fixed function
      color: "#4CAF50",
      icon: faUserPlus,
    },
    {
      title: "Total Receptionists",
      value: receptionist.length,
      color: "#FD7E14",
      icon: faUserNurse,
    },
    {
      title: "Total Doctors",
      value: doctor.length,
      color: "#2196F3",
      icon: faUserMd,
    },
  ];

  return (
    <div className="admin-dashboard-container">
      {/* TOP GRID */}
      <div className="admin-top-grid">
        {cards.map((card, index) => (
          <div key={index} className="flat-card">
            <div className="flat-card-icon" style={{ background: card.color }}>
              <FontAwesomeIcon icon={card.icon} size="lg" color="#fff" />
            </div>
            <div className="flat-card-info">
              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE GRID */}
      <div className="admin-middle-grid">
        <div className="appointments-box">
          <div className="appointments-header">
            <h3>Total Users List</h3>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenu("usersList");
              }}
            >
              Show all
            </a>
          </div>

          {/* --- HTML TABLE (Standard Structure) --- */}
          <div className="box-content">
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email || "-"}</td>
                        <td>{user.role || "-"}</td>
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