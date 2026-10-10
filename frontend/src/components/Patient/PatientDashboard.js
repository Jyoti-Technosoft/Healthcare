import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getAllAppointmentsForPatient,
  getPatientApi,
  getAllDoctors,
} from "../Api";
import { dateFormatter } from "../Validations";
import "../../assets/css/Patient/patientDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../actions/submenuActions";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const userId = Cookies.get("userId");
  const token = Cookies.get("authToken");

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.submenu.activeTab);

  const setMenu = (menu) => {
    if (activeTab !== menu) dispatch(setActiveTab(menu));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const patientInfo = await getPatientApi(userId, token);
        const pid = patientInfo.id;

        const appts = await getAllAppointmentsForPatient(pid, token);
        setAppointments(appts || []);

        const docs = await getAllDoctors(token);
        setDoctors(docs || []);
      } catch (err) {
        console.error("Failed to load patient dashboard:", err);
      }
    };
    loadData();
  }, [userId, token]);

  const today = new Date().toISOString().slice(0, 10);

  const todaysAppointments = appointments
    .filter((a) => a.appointmentDate === today)
    .sort(
      (a, b) =>
        new Date("1970/01/01 " + a.appointmentTime) -
        new Date("1970/01/01 " + b.appointmentTime)
    );

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.appointmentDate) > new Date(today))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const totalPages = Math.ceil(todaysAppointments.length / rowsPerPage);
  const paginatedData = todaysAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const cards = [
    {
      title: "Total Appointments",
      value: appointments.length,
      color: "#006194",
      icon: "calendar_month",
      badgeText: "Historical",
      badgeClass: "bg-primary-subtle text-primary border border-primary-subtle",
    },
    {
      title: "Today's Schedule",
      value: todaysAppointments.length,
      color: "#16a34a",
      icon: "event_available",
      badgeText: todaysAppointments.length > 0 ? "Active Today" : "None Today",
      badgeClass: "bg-success-subtle text-success border border-success-subtle",
    },
    {
      title: "Upcoming Consults",
      value: upcomingAppointments.length,
      color: "#0284c7",
      icon: "schedule",
      badgeText: "Upcoming",
      badgeClass: "bg-info-subtle text-info border border-info-subtle",
    },
    {
      title: "Attending Doctors",
      value: doctors.length,
      color: "#f59e0b",
      icon: "medical_services",
      badgeText: "Specialists",
      badgeClass: "bg-warning-subtle text-warning border border-warning-subtle",
    },
  ];

  return (
    <div className="patient-dash-container">
      {/* HEADER BANNER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>health_and_safety</span>
            AegisHealth Patient Portal
          </div>
          <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Clinical Appointments &amp; Care Timeline
          </h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => setMenu("bookAppointment")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span>
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="pd-top-grid">
        {cards.map((card, index) => (
          <div key={index} className="flat-card">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div
                className="flat-card-icon"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                  {card.icon}
                </span>
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

      {/* MIDDLE GRID */}
      <div className="pd-middle-grid">
        {/* Today's Appointments Table */}
        <div className="pd-box">
          <div className="pd-header">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>today</span>
              <h3 className="mb-0">Today's Appointments</h3>
            </div>
            <button
              className="btn btn-sm btn-link text-decoration-none fw-semibold p-0"
              style={{ color: "#006194" }}
              onClick={() => setMenu("patientAppointments")}
            >
              View Full History &rarr;
            </button>
          </div>

          <div className="pd-table-wrapper">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Appointment Ref</th>
                  <th>Consulting Doctor</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((a, i) => (
                    <tr key={a.id}>
                      <td className="fw-semibold text-muted">{(page - 1) * rowsPerPage + (i + 1)}</td>
                      <td>
                        <span className="badge font-monospace text-dark bg-light border">
                          #APT-{a.id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "#006194",
                              fontSize: "12px",
                            }}
                          >
                            {a.doctor?.name ? a.doctor.name.charAt(0).toUpperCase() : "D"}
                          </div>
                          <span className="fw-semibold text-dark">
                            Dr. {a.doctor?.name || "Specialist"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-inline-flex align-items-center gap-1.5 text-secondary">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
                          <span>{dateFormatter(a.appointmentDate)} &bull; {a.appointmentTime}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="pd-no-data">
                      <div className="py-4 text-center">
                        <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: "36px", opacity: 0.6 }}>
                          event_busy
                        </span>
                        <div className="fw-medium text-muted">No appointments scheduled for today</div>
                        <small className="text-secondary">Your upcoming consultations will appear here</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pd-pagination">
              <button onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                &lsaquo;
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                &rsaquo;
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&raquo;</button>
            </div>
          )}
        </div>

        {/* Upcoming List */}
        <div className="pd-box">
          <div className="pd-header">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info" style={{ fontSize: "20px" }}>upcoming</span>
              <h3 className="mb-0">Upcoming Consultations</h3>
            </div>
            <button
              className="btn btn-sm btn-link text-decoration-none fw-semibold p-0"
              style={{ color: "#006194" }}
              onClick={() => setMenu("patientAppointments")}
            >
              All &rarr;
            </button>
          </div>

          <div className="upcoming-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((a) => (
                <div className="up-item" key={a.id}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "#0284c7",
                      fontSize: "14px",
                    }}
                  >
                    {a.doctor?.name ? a.doctor.name.charAt(0).toUpperCase() : "D"}
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="mb-1 text-dark fw-bold" style={{ fontSize: "14px" }}>
                      Dr. {a.doctor?.name || "Attending Doctor"}
                    </h4>
                    <div className="d-flex align-items-center gap-1.5 text-muted" style={{ fontSize: "12px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>calendar_today</span>
                      <span>{dateFormatter(a.appointmentDate)} &bull; {a.appointmentTime}</span>
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-light text-secondary border px-2 py-1" style={{ fontSize: "11px" }}>
                    #APT-{a.id}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-upcoming py-4 text-center">
                <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: "36px", opacity: 0.6 }}>
                  calendar_month
                </span>
                <div className="fw-medium text-muted">No upcoming appointments</div>
                <small className="text-secondary">Click "Book New Appointment" to schedule</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
