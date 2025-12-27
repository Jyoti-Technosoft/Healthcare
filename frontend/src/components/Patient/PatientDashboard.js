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
//fontawesome 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCalendarDay,
  faClock,
  faUserDoctor, // Alternative: faStethoscope
} from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="patient-dash-container">
      {/* TOP CARDS USING FONTAWESOME ICONS */}
      <div className="pd-top-grid">
        {[
          {
            title: "Total Appointments",
            value: appointments.length,
            color: "#6F42C1",
            icon: faCalendarCheck,
          },
          {
            title: "Today's Appointments",
            value: todaysAppointments.length,
            color: "#4CAF50",
            icon: faCalendarDay,
          },
          {
            title: "Upcoming Appointments",
            value: upcomingAppointments.length,
            color: "#2196F3",
            icon: faClock,
          },
          {
            title: "Total Doctors",
            value: doctors.length,
            color: "#FD7E14",
            icon: faUserDoctor,
          },
        ].map((card, index) => (
          <div key={index} className="flat-card">
            <div className="flat-card-icon" style={{ background: card.color }}>
              <FontAwesomeIcon icon={card.icon} size="2x" color="#fff" />
            </div>
            <div className="flat-card-info">
              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MIDDLE GRID ---------------- */}
      <div className="pd-middle-grid">
        <div className="pd-box">
          <div className="pd-header">
            <h3>Today's Appointments</h3>
            <a href="#" onClick={() => setMenu("patientAppointments")}>
              Show all
            </a>
          </div>

          <div className="pd-table-wrapper">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Appointment ID</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((a, i) => (
                    <tr key={a.id}>
                      <td>{(page - 1) * rowsPerPage + (i + 1)}</td>
                      <td>{a.id}</td>
                      <td>{a.doctor?.name}</td>
                      <td>
                        {dateFormatter(a.appointmentDate)} | {a.appointmentTime}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="pd-no-data">
                      No appointments for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pd-pagination">
              <button onClick={() => setPage(1)}>&laquo;</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
                &lsaquo;
              </button>
              <span>{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                &rsaquo;
              </button>
              <button onClick={() => setPage(totalPages)}>&raquo;</button>
            </div>
          )}
        </div>

        <div className="pd-box">
          <div className="pd-header">
            <h3>Upcoming</h3>
            <a href="#" onClick={() => setMenu("patientAppointments")}>
              Show all
            </a>
          </div>

          <div className="upcoming-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((a) => (
                <div className="up-item" key={a.id}>
                  <img
                    src={
                      a.patient?.gender?.toLowerCase() === "female"
                        ? "img/female2.png"
                        : "img/maleRecep.png"
                    }
                    alt="profile"
                  />
                  <div>
                    <h4>{a.patient?.name}</h4>
                    <p>
                      {dateFormatter(a.appointmentDate)} | {a.appointmentTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-upcoming">No upcoming appointments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
