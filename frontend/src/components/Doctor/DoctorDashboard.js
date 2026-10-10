import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { getDoctorsWithIdApi, getAppointmentWithoutHealthReport } from "../Api";
import ConsultancyModal from "./ConsultancyModal";
import { dateFormatter } from "../Validations";
import { setActiveTab } from "../../actions/submenuActions";
import { useSelector, useDispatch } from "react-redux";
import "../../assets/css/Doctor/doctorDashboard.css";

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
      name: "Consultation",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2.5 rounded-3 fw-semibold"
          onClick={() => handleToggleModal(row)}
          title="Start Clinical Consultation"
          style={{ fontSize: "12px", borderColor: "#006194", color: "#006194" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>clinical_notes</span>
          <span>Consult</span>
        </button>
      ),
      width: "120px",
      center: true,
    },
    {
      name: "Appt ID",
      selector: (row) => row.id,
      cell: (row) => <span className="fw-semibold text-secondary">#{row.id}</span>,
      sortable: true,
      width: "110px",
    },
    {
      name: "Patient Name",
      selector: (row) => row.patient?.name,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-primary"
            style={{ width: "28px", height: "28px", backgroundColor: "#e0f2fe", fontSize: "11px", fontWeight: "700" }}
          >
            {row.patient?.name ? row.patient.name.charAt(0).toUpperCase() : "P"}
          </div>
          <span className="fw-semibold text-dark">{row.patient?.name}</span>
        </div>
      ),
      sortable: true,
      grow: 1,
      minWidth: "180px",
    },
    {
      name: "Date",
      selector: (row) => formatAppointmentDate(row.appointmentDate),
      sortable: true,
      grow: 1,
    },
    {
      name: "Time Slot",
      selector: (row) => row.appointmentTime,
      cell: (row) => (
        <span className="badge bg-light text-dark border px-2.5 py-1" style={{ fontSize: "12px", borderColor: "#cbd5e1" }}>
          {row.appointmentTime}
        </span>
      ),
      sortable: true,
      grow: 1,
    },
  ];

  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        minHeight: "48px",
        color: "#475569",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      },
    },
    headCells: {
      style: {
        textTransform: "uppercase",
        fontSize: "12px",
        letterSpacing: "0.5px",
        fontWeight: "600",
      },
    },
    rows: {
      style: {
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        color: "#1e293b",
        minHeight: "56px",
        borderBottom: "1px solid #f1f5f9",
      },
    },
  };

  const statCards = [
    {
      title: "Total Appointments",
      value: appointment.length,
      badgeText: "All Time",
      badgeClass: "text-primary bg-primary-subtle",
      icon: "calendar_month",
      color: "#006194",
    },
    {
      title: "Today's Patient Queue",
      value: countTodaysAppointmentsDoctor(),
      badgeText: "Active Today",
      badgeClass: "text-success bg-success-subtle",
      icon: "event_available",
      color: "#006947",
    },
    {
      title: "Unique Patients Treated",
      value: uniquePatientCount,
      badgeText: "EHR Directory",
      badgeClass: "text-info bg-info-subtle",
      icon: "groups",
      color: "#0284c7",
    },
    {
      title: "Clinical Rounds Status",
      value: "Normal",
      badgeText: "On Schedule",
      badgeClass: "text-success bg-success-subtle",
      icon: "health_and_safety",
      color: "#006947",
    },
  ];

  return (
    <div className="doctor-dashboard-container">
      {/* SECTION HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>stethoscope</span>
            Physician Clinical Telemetry
          </div>
          <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Doctor Clinical Operations
          </h2>
        </div>
      </div>

      {/* ========== Top Stats ========== */}
      <div className="doctor-top-grid">
        {statCards.map((card, index) => (
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
