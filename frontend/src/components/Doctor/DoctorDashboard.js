import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from "../Api";
import ConsultancyModal from "./ConsultancyModal";
import { dateFormatter } from "../Validations";
import { setActiveTab } from "../../actions/submenuActions";
import { useSelector, useDispatch } from "react-redux";
import "../../assets/css/Doctor/doctorDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCalendarDay,
  faUsers,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";

export default function DoctorDashboard() {
  const [appointment, setAppointment] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Refs for Height Syncing
  const todayRef = useRef(null);
  const upcomingRef = useRef(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const userId = Cookies.get("userId");
  const token = Cookies.get("authToken");

  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();

  const setMenu = (menu) => {
    if (activeTab !== menu) dispatch(setActiveTab(menu));
  };

  const formatAppointmentDate = (dateString) => dateFormatter(dateString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, token);
        const doctorId = doctorInfo.id;

        const data = await getAppointmentWithoutHealthReport(doctorId, token);
        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchData();
  }, [userId, token]);

  // --- Height Sync Logic ---
  useEffect(() => {
    const syncHeight = () => {
      if (todayRef.current && upcomingRef.current) {
        upcomingRef.current.style.height = `${todayRef.current.clientHeight}px`;
      }
    };
    setTimeout(syncHeight, 100);
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [appointment, page]);

  // --- Logic ---
  const countTodaysAppointmentsDoctor = () => {
    const today = new Date().toISOString().slice(0, 10);
    return appointment.filter((a) => a.appointmentDate === today).length;
  };

  // NEW: Logic to count Unique Patients from the appointment list
  const uniquePatientCount = new Set(
    appointment.map((item) => item.patient?.id || item.patient?.name)
  ).size;

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().slice(0, 10);
    const arrived = appointment.filter(
      (a) => a.appointmentDate === today && a.arrive === 1
    );
    const notArrived = appointment.filter(
      (a) => a.appointmentDate === today && a.arrive !== 1
    );
    const sortedArrived = arrived.sort(
      (a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)
    );
    return [...sortedArrived, ...notArrived];
  };

  const upcomingAppointments = appointment
    .filter(
      (a) =>
        new Date(a.appointmentDate) >=
        new Date(new Date().toISOString().slice(0, 10))
    )
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // --- Pagination Logic ---
  const todaysData = getTodaysAppointments();
  const totalPages = Math.ceil(todaysData.length / rowsPerPage);
  const paginatedData = todaysData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // --- Handlers ---
  const handleToggleModal = (appt) => {
    setSelectedAppointment(appt);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setPrescriptions([]);
    setShowCloseButton(false);
  };

  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: "", dosage: "", timing: "" },
    ]);
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleCloseButtonClick = () => {
    setShowCloseButton(false);
    setPrescriptions([]);
  };

  const columns = [
    {
      name: "Report",
      cell: (row) => (
        <i
          className="bi bi-clipboard2-pulse report-icon-btn"
          onClick={() => handleToggleModal(row)}
          title="Consult"
          style={{ fontSize: "1.3rem", cursor: "pointer", color: "#0d6efd" }}
        ></i>
      ),
      width: "80px",
      center: true,
    },
    {
      name: "Appt ID",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Patient Name",
      selector: (row) => row.patient.name,
      sortable: true,
      grow: 1,
      minWidth: "180px",
      style: { fontWeight: "500", color: "#333", fontSize: "14px" },
    },
    {
      name: "Date",
      selector: (row) => formatAppointmentDate(row.appointmentDate),
      sortable: true,
      grow: 1,
    },
    {
      name: "Time",
      selector: (row) => row.appointmentTime,
      sortable: true,
      grow: 1,
    },
  ];

  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: "#F0F8FF",
        borderBottom: "1px solid #e6edf5",
        minHeight: "50px",
        color: "#373737",
        fontFamily: "'Roboto', sans-serif",
      },
    },
    headCells: {
      style: {
        textTransform: "none",
        fontSize: "15px",
        fontWeight: "600",
      },
    },
    rows: {
      style: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: "14px",
        color: "#333",
        minHeight: "55px",
        borderBottom: "1px solid #f0f2f5",
      },
    },
  };

  return (
    <div className="doctor-dashboard-container">
      {/* ========== Top Stats ========== */}
      <div className="doctor-top-grid">
        {[
          {
            title: "Total Appointments",
            value: appointment.length,
            color: "#6F42C1",
            icon: faCalendarCheck,
          },
          {
            title: "Today's Appointments",
            value: countTodaysAppointmentsDoctor(),
            color: "#4CAF50",
            icon: faCalendarDay,
          },
          {
            title: "Top Doctors",
            value: "-", // Usually not relevant for a specific doctor dashboard
            color: "#FD7E14",
            icon: faUserDoctor,
          },
          {
            title: "Total Patients",
            value: uniquePatientCount, // UPDATED HERE
            color: "#2196F3",
            icon: faUsers,
          },
        ].map((card, index) => (
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

      {/* ========== Middle Section ========== */}
      <div className="doctor-middle-grid">
        <div ref={todayRef} className="doctor-today-box">
          <div className="doctor-box-header">
            <h3>Today's Appointments</h3>
          </div>

          <div className="doctor-table-wrapper table-responsive">
            <DataTable
              columns={columns}
              data={paginatedData}
              pagination={false}
              highlightOnHover
              customStyles={customTableStyles}
              noDataComponent={
                <div className="p-4 text-center text-muted">
                  No appointments for today
                </div>
              }
            />
          </div>

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

              <span className="page-number">
                {page} / {totalPages}
              </span>

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

        <div ref={upcomingRef} className="doctor-upcoming-box">
          <div className="doctor-box-header">
            <h3>Upcoming</h3>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenu("doctorAppointments");
              }}
            >
              See all
            </a>
          </div>

          <div className="doctor-upcoming-list">
            {upcomingAppointments.length ? (
              upcomingAppointments.map((appt) => (
                <div className="doctor-upcoming-item" key={appt.id}>
                  <img
                    src={
                      appt.patient.gender.toLowerCase() === "female"
                        ? "img/female2.png"
                        : "img/maleRecep.png"
                    }
                    alt="patient"
                  />
                  <div className="doctor-upcoming-details">
                    <h4>{appt.patient.name}</h4>
                    <p className="meta-info">
                      {appt.patient.gender}, {appt.patient.age} yrs
                    </p>
                    <p className="date-info">
                      {formatAppointmentDate(appt.appointmentDate)} |{" "}
                      {appt.appointmentTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="doctor-no-upcoming">No upcoming appointments</div>
            )}
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <ConsultancyModal
          appointment={selectedAppointment}
          prescriptions={prescriptions}
          setPrescriptions={setPrescriptions}
          showCloseButton={showCloseButton}
          setShowCloseButton={setShowCloseButton}
          handleAddPrescription={handleAddPrescription}
          handleRemovePrescription={handleRemovePrescription}
          handleCloseButtonClick={handleCloseButtonClick}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
