import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { getAllAppointments, getAllDoctors, getAllPatientsApi } from "../Api";
import { dateFormatter } from "../Validations";
import { setActiveTab } from "../../actions/submenuActions";
import "../../assets/css/Receptionist/receptionistDashboard.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ProgressBar from "progressbar.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseMedical } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(ArcElement, Tooltip, Legend);

/* -------------------------------------------------------------------------- */
/* ROW ACTION MENU                                                            */
/* -------------------------------------------------------------------------- */
function RowActionsMenu({ rowId, onStatusChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 120,
    });
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const onDocClick = () => setShowMenu(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleSelect = (newStatus) => {
    onStatusChange(rowId, newStatus);
    setShowMenu(false);
  };

  return (
    <>
      <button ref={btnRef} className="menu-btn" onClick={toggleMenu}>
        <i className="bi bi-three-dots-vertical" />
      </button>

      {showMenu &&
        ReactDOM.createPortal(
          <ul
            className="status-dropdown"
            style={{
              top: `${menuPos.top}px`,
              left: `${menuPos.left}px`,
            }}
          >
            {[
              { text: "Mark as Arrived", color: "#16a34a", value: "Arrived" },
              { text: "Mark as Pending", color: "#2563eb", value: "Pending" },
              {
                text: "Mark as Cancelled",
                color: "#dc2626",
                value: "Cancelled",
              },
            ].map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => handleSelect(item.value)}
                  style={{ color: item.color }}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD PAGE                                                        */
/* -------------------------------------------------------------------------- */
export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const token = Cookies.get("authToken");
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.submenu.activeTab);

  const appointmentsRef = useRef(null);
  const upcomingRef = useRef(null);

  const setMenu = (menu) => {
    if (activeTab !== menu) dispatch(setActiveTab(menu));
  };

  const handleStatusChange = (rowId, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rowId
          ? { ...a, status: newStatus, arrive: newStatus === "Arrived" ? 1 : 0 }
          : a
      )
    );
  };

  const todaysAppointments = () => {
    const today = new Date().toISOString().slice(0, 10);
    return appointments
      .filter((a) => a.appointmentDate === today)
      .sort(
        (a, b) =>
          new Date("1970/01/01 " + a.appointmentTime) -
          new Date("1970/01/01 " + b.appointmentTime)
      );
  };

  const countTodaysAppointments = () => todaysAppointments().length;

  const upcomingAppointments = appointments
    .filter((a) => {
      const appt = new Date(a.appointmentDate);
      const today = new Date();
      appt.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return appt > today;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [apps, docs, pats] = await Promise.all([
          getAllAppointments(token),
          getAllDoctors(token),
          getAllPatientsApi(token),
        ]);

        setAppointments(apps || []);
        setDoctors(docs || []);
        setPatients(pats || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    };
    fetchAll();
  }, [token]);

  useEffect(() => {
    const syncHeight = () => {
      if (appointmentsRef.current && upcomingRef.current) {
        upcomingRef.current.style.height =
          appointmentsRef.current.clientHeight + "px";
      }
    };
    setTimeout(syncHeight, 300);
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [appointments]);

  useEffect(() => {
    const admitEl = document.querySelector("#admitBar");
    const dischargeEl = document.querySelector("#dischargeBar");
    if (!admitEl || !dischargeEl) return;

    admitEl.innerHTML = "";
    dischargeEl.innerHTML = "";

    const admitBar = new ProgressBar.Line(admitEl, {
      strokeWidth: 5,
      easing: "easeInOut",
      duration: 1400,
      color: "#f3c062",
      trailColor: "transparent",
      trailWidth: 0,
    });

    const dischargeBar = new ProgressBar.Line(dischargeEl, {
      strokeWidth: 5,
      easing: "easeInOut",
      duration: 1400,
      color: "#ea74c2",
      trailColor: "transparent",
      trailWidth: 0,
    });

    admitBar.animate(0.75);
    dischargeBar.animate(0.55);
  }, []);

  const todays = todaysAppointments();
  const totalPages = Math.ceil(todays.length / rowsPerPage);
  const paginatedData = todays.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="dashboard-container">
      {/* ------------------------- Top Cards -------------------------- */}
      <div className="top-grid">
        {[
          {
            title: "Today's Appointments",
            value: countTodaysAppointments(),
            color: "#6F42C1",
            icon: "img/Person Calendar.png",
          },
          {
            title: "Operations for Today",
            value: 1,
            color: "#4CAF50",
            icon: "img/Clinic.png",
          },
          {
            title: "Doctor Availability",
            value: doctors.length,
            color: "#2196F3",
            icon: "img/Medical Doctor.png",
          },
          {
            title: "Room Availability",
            value: 4,
            color: "#FD7E14",
            icon: "img/Hospital Room.png",
          },
        ].map((card, i) => (
          <div key={i} className="flat-card">
            <div className="flat-card-icon" style={{ background: card.color }}>
              <img src={card.icon} alt={card.title} />
            </div>
            <div className="flat-card-info">
              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------- Middle Section ------------------------- */}
      <div className="middle-grid">
        {/* ------------------- Today's Appointments (HTML TABLE) ------------------- */}
        <div ref={appointmentsRef} className="appointments-box">
          <div className="appointments-header">
            <h3>Today's Appointments</h3>
            <a href="#" onClick={() => setMenu("showAppointments")}>
              Show all
            </a>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.doctor?.name || "-"}</td>
                      <td>
                        {dateFormatter(row.appointmentDate)} |{" "}
                        {row.appointmentTime}
                      </td>
                      <td>
                        <span
                          className={`status ${
                            row.status === "Arrived"
                              ? "arrived"
                              : row.status === "Cancelled"
                              ? "canceled"
                              : "pending"
                          }`}
                        >
                          {row.status || "Pending"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <RowActionsMenu
                          rowId={row.id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No appointments for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-footer">
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

        {/* ------------------- Upcoming Appointments ------------------- */}
        <div ref={upcomingRef} className="upcoming-box">
          <div className="upcoming-header">
            <h3>Upcoming Appointments</h3>
            {/* EXACT COPY OF THE SHOW ALL LINK */}
            <a href="#" onClick={() => setMenu("showAppointments")}>
              Show all
            </a>
          </div>

          <div className="upcoming-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((a) => (
                <div key={a.id} className="upcoming-item">
                  <img
                    src={
                      a.patient?.gender?.toLowerCase() === "female"
                        ? "img/female2.png"
                        : "img/maleRecep.png"
                    }
                    alt={a.patient?.name}
                  />
                  <div className="upcoming-info">
                    <h4>{a.patient?.name}</h4>
                    <p className="date">
                      {dateFormatter(a.appointmentDate)} | {a.appointmentTime}
                    </p>
                    <p className="doctor">Assigned Doctor: {a.doctor?.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-upcoming">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------ Bottom Section ------------------------ */}
      <div className="bottom-grid">
        {/* Admit + Discharge */}
        <div className="admit-discharge-column">
          <div className="bottom-box">
            <div className="box-header">
              <h3>Admit Patient</h3>
            </div>
            <div className="box-stats">
              <div>
                <span className="label">Today</span>
                <div className="value">10</div>
              </div>
              <div>
                <span className="label">This Week</span>
                <div className="value">82</div>
              </div>
              <div>
                <span className="label">This Month</span>
                <div className="value">220</div>
              </div>
            </div>
            <div className="progress-wrapper">
              <div id="admitBar" className="progress-container" />
            </div>
          </div>

          <div className="bottom-box">
            <div className="box-header">
              <h3>Discharge Patient</h3>
            </div>
            <div className="box-stats">
              <div>
                <span className="label">Today</span>
                <div className="value">6</div>
              </div>
              <div>
                <span className="label">This Week</span>
                <div className="value">62</div>
              </div>
              <div>
                <span className="label">This Month</span>
                <div className="value">120</div>
              </div>
            </div>
            <div className="progress-wrapper">
              <div id="dischargeBar" className="progress-container" />
            </div>
          </div>
        </div>

        {/* Room Status */}
        <div className="room-status bottom-box">
          <h3>Room Status</h3>
          <div className="donut-chart-container">
            <Doughnut
              data={{
                labels: ["Occupied", "Available"],
                datasets: [
                  {
                    data: [60, 40],
                    backgroundColor: ["#ff8b7a", "#e0e0e0"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                cutout: "75%",
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }}
            />
            <div className="donut-center-text">60%</div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="dot occupied" />
              Occupied
            </div>
            <div className="legend-item">
              <span className="dot available" />
              Available
            </div>
          </div>
        </div>

        {/* Today's Operation */}
        <div className="operation-box bottom-box">
          <h3>Today's Operation</h3>
          <div className="op-card-content">
            <div className="op-icon-container">
              <FontAwesomeIcon icon={faHouseMedical} />
            </div>
            <div className="op-details">
              <div className="op-name">John Doe</div>
              <div className="op-row">
                Surgery Type: <b>Appendectomy</b>
              </div>
              <div className="op-row">Assigned Doctor: Dr. Smith</div>
              <div className="op-row">Operation Room: OR 1</div>
              <div className="op-row">Scheduled Time: 09:00 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
