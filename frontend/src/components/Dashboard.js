import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

/* --- Layout Components --- */
import Header from "./Admin/Header";

/* UPDATED IMPORT: 
  Goes into 'common' -> 'Sidebar' folder -> 'Sidebar.js' file 
*/
import Sidebar from "./common/Sidebar/Sidebar";

/* UPDATED IMPORT: 
  Goes into 'common' -> 'Sidebar' folder -> 'SidebarRenderer.js' file 
*/
import { renderSidebarComponent } from "./common/Sidebar/SidebarRenderer";

/* --- CSS --- */
import "../assets/css/Admin/header.css";
import "../assets/css/Admin/sidebar.css";
import "../assets/css/Receptionist/receptionistDashboard.css";

export default function Dashboard() {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  const activeTab = useSelector((state) => state.submenu.activeTab);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Section */}
      <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </aside>

      {/* Header Section */}
      <header className="header-container">
        <Header toggleSidebar={toggleSidebar} />
      </header>

      {/* Main Content Section */}
      <main className="dashboard-content">
        {/* Logic determines which component to show */}
        {renderSidebarComponent(activeTab)}
      </main>
    </div>
  );
}
