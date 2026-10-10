import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { getDoctorsApi } from "./Api";
import "../assets/css/Global/Doctors.css";

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");

  // Helper to decode Base64 image
  const decodeBase64Image = (base64String) => {
    if (!base64String) {
      return "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80";
    }
    return `data:image/png;base64,${base64String}`;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (response && Array.isArray(response)) {
          setDoctors(response);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Compute distinct specialties with counts
  const specialtyList = useMemo(() => {
    const counts = {};
    doctors.forEach((doc) => {
      const spec = doc.specialities ? doc.specialities.trim() : "General Practice";
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [doctors]);

  // Filtered Doctors list
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        (doc.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.specialities && doc.specialities.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.qualification && doc.qualification.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty =
        selectedSpecialty === "all" ||
        (doc.specialities && doc.specialities.trim().toLowerCase() === selectedSpecialty.toLowerCase());

      const matchesShift =
        selectedShift === "all" ||
        (doc.shiftTime && doc.shiftTime.toLowerCase().includes(selectedShift.toLowerCase()));

      return matchesSearch && matchesSpecialty && matchesShift;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedShift]);

  // Navigate to booking or login flow
  const handleBookAppointment = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/patient");
    }
  };

  return (
    <div className="aegis-doctors-page">
      <Header />

      {/* ================= 1. HERO & SEARCH OMNIBOX ================= */}
      <section className="aegis-directory-hero">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
            <div>
              <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>groups</span>
                Accredited Clinical Network
              </div>
              <h1 className="fw-bold text-dark mb-2" style={{ fontSize: "32px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Find Board-Certified Specialists
              </h1>
              <p className="text-secondary mb-0" style={{ fontSize: "14px", maxWidth: "600px" }}>
                Access verified physicians, department leaders, and telemedicine practitioners with real-time consultation scheduling.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge px-3 py-2 rounded-pill bg-white text-dark border d-flex align-items-center gap-2" style={{ borderColor: "#bfc7d2", fontSize: "12px" }}>
                <span className="aegis-online-dot"></span>
                <span>{doctors.length} Verified Specialists</span>
              </span>
            </div>
          </div>

          {/* Quick Search Omnibox */}
          <div className="aegis-search-omnibox">
            <div className="row g-3">
              <div className="col-lg-5 col-md-12">
                <label className="form-label text-secondary fw-semibold mb-1 d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>person_search</span>
                  Search Doctor or Keyword
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control aegis-omnibox-input"
                    placeholder="e.g. Dr. John, Cardiology, MBBS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none me-2"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1 d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>stethoscope</span>
                  Filter by Specialty
                </label>
                <select
                  className="form-select aegis-omnibox-input"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="all">All Specialties ({doctors.length})</option>
                  {specialtyList.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} ({item.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1 d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>schedule</span>
                  Shift Time
                </label>
                <select
                  className="form-select aegis-omnibox-input"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  <option value="all">All Shifts</option>
                  <option value="morning">Morning Shift</option>
                  <option value="evening">Evening Shift</option>
                  <option value="night">Night / On-Call</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. SPECIALTY QUICK PILLS & GRID ================= */}
      <section className="py-5">
        <div className="container">
          {/* Filter Bar Pills */}
          <div className="aegis-filter-bar d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 overflow-auto py-1">
              <button
                type="button"
                className={`aegis-pill-btn ${selectedSpecialty === "all" ? "active" : ""}`}
                onClick={() => setSelectedSpecialty("all")}
              >
                <span>All Specialists</span>
                <span className="pill-count">({doctors.length})</span>
              </button>
              {specialtyList.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`aegis-pill-btn ${selectedSpecialty.toLowerCase() === item.name.toLowerCase() ? "active" : ""}`}
                  onClick={() => setSelectedSpecialty(item.name)}
                >
                  <span>{item.name}</span>
                  <span className="pill-count">({item.count})</span>
                </button>
              ))}
            </div>

            <span className="text-secondary" style={{ fontSize: "12px" }}>
              Showing <strong>{filteredDoctors.length}</strong> of {doctors.length} doctors
            </span>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading specialists...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <div key={doctor.id || index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <div className="aegis-doctor-card">
                      <div>
                        {/* Image wrap with badges */}
                        <div className="aegis-card-img-wrap">
                          <img
                            src={decodeBase64Image(doctor.doctorImageData)}
                            alt={doctor.name}
                          />
                          <div className="aegis-verified-chip">
                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>verified</span>
                            <span>Board Certified</span>
                          </div>
                          <div className="aegis-specialty-chip">
                            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>medical_services</span>
                            <span>{doctor.specialities || "General Practice"}</span>
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {doctor.name}
                        </h4>
                        <p className="text-secondary mb-2" style={{ fontSize: "12px" }}>
                          {doctor.designation || "Senior Clinical Specialist"}
                        </p>

                        <div className="d-flex align-items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-warning" style={{ fontSize: "17px" }}>star</span>
                          <span className="fw-bold text-dark" style={{ fontSize: "13px" }}>4.95</span>
                          <span className="text-secondary" style={{ fontSize: "11px" }}>(120+ reviews)</span>
                        </div>

                        <div className="py-2 my-2 border-top border-bottom text-secondary" style={{ fontSize: "12px" }}>
                          <div className="mb-1 d-flex align-items-center gap-1.5">
                            <span className="material-symbols-outlined text-secondary" style={{ fontSize: "15px" }}>workspace_premium</span>
                            <span className="text-truncate">{doctor.qualification || "MD, MBBS Specialist"}</span>
                          </div>
                          <div className="text-success fw-semibold d-flex align-items-center gap-1.5">
                            <span className="material-symbols-outlined text-success" style={{ fontSize: "15px" }}>schedule</span>
                            <span>Shift: {doctor.shiftTime || "Regular Hours"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2">
                        <div className="d-flex justify-content-between align-items-baseline mb-3">
                          <span className="text-secondary" style={{ fontSize: "12px" }}>Consultation Fee</span>
                          <div className="text-end">
                            <span className="fw-bold fs-5 text-dark">${doctor.consultationCharge || "100"}</span>
                            <span className="text-secondary" style={{ fontSize: "11px" }}> / visit</span>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDoctorModal(doctor)}
                            className="btn btn-outline-secondary btn-sm flex-grow-1 fw-semibold rounded-3 py-2"
                            style={{ borderColor: "#bfc7d2", fontSize: "13px" }}
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={handleBookAppointment}
                            className="btn btn-primary btn-sm flex-grow-1 fw-bold rounded-3 py-2"
                            style={{ backgroundColor: "#006194", borderColor: "#006194", fontSize: "13px" }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-4 bg-white rounded-3 border d-inline-block text-center" style={{ maxWidth: "450px", borderColor: "#bfc7d2" }}>
                    <span className="material-symbols-outlined text-secondary mb-2" style={{ fontSize: "40px" }}>search_off</span>
                    <h5 className="fw-bold text-dark mb-1">No Specialists Found</h5>
                    <p className="text-secondary mb-3" style={{ fontSize: "13px" }}>
                      We could not find any doctors matching your search query or specialty filter.
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSpecialty("all");
                        setSelectedShift("all");
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= 3. DOCTOR PROFILE DETAIL MODAL ================= */}
      {selectedDoctorModal && (
        <div
          className="modal show d-block aegis-doc-modal"
          tabIndex="-1"
          style={{ zIndex: 1055 }}
          onClick={() => setSelectedDoctorModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
                  <span className="material-symbols-outlined text-primary">person</span>
                  Physician Credentials &amp; Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDoctorModal(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <img
                    src={decodeBase64Image(selectedDoctorModal.doctorImageData)}
                    alt={selectedDoctorModal.name}
                    className="rounded-circle border shadow-sm mb-3"
                    style={{ width: "110px", height: "110px", objectFit: "cover", borderColor: "#bfc7d2" }}
                  />
                  <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "20px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedDoctorModal.name}
                  </h4>
                  <span className="badge rounded-pill px-3 py-1 text-white" style={{ backgroundColor: "#006194", fontSize: "12px" }}>
                    {selectedDoctorModal.specialities || "General Practice"}
                  </span>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3 border" style={{ borderColor: "#bfc7d2", fontSize: "13px" }}>
                  <div className="d-flex justify-content-between py-1.5 border-bottom">
                    <span className="text-secondary fw-semibold">Designation:</span>
                    <span className="text-dark fw-bold">{selectedDoctorModal.designation || "Senior Specialist"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom">
                    <span className="text-secondary fw-semibold">Qualification:</span>
                    <span className="text-dark">{selectedDoctorModal.qualification || "MD, MBBS"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom">
                    <span className="text-secondary fw-semibold">Shift Hours:</span>
                    <span className="text-dark">{selectedDoctorModal.shiftTime || "Regular Clinic Hours"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom">
                    <span className="text-secondary fw-semibold">Working Days:</span>
                    <span className="text-dark">{selectedDoctorModal.dayOfWorking || "Monday - Saturday"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1.5">
                    <span className="text-secondary fw-semibold">Consultation Fee:</span>
                    <span className="text-success fw-bold">${selectedDoctorModal.consultationCharge || "100"}</span>
                  </div>
                </div>

                {selectedDoctorModal.biography && (
                  <div>
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: "13px" }}>Clinical Background</h6>
                    <p className="text-secondary mb-0" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                      {selectedDoctorModal.biography}
                    </p>
                  </div>
                )}
              </div>

              <div className="modal-footer border-top pt-3">
                <button
                  type="button"
                  className="btn btn-secondary rounded-3"
                  onClick={() => setSelectedDoctorModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-3 fw-bold"
                  style={{ backgroundColor: "#006194", borderColor: "#006194" }}
                  onClick={() => {
                    setSelectedDoctorModal(null);
                    handleBookAppointment();
                  }}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. UNIFIED AEGISHEALTH FOOTER ================= */}
      <footer className="pt-5 pb-4 border-top" style={{ backgroundColor: "#ffffff", borderColor: "#bfc7d2" }}>
        <div className="container">
          <div className="row g-4 pb-4">
            {/* Col 1: Brand & Clinical Accreditation */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center text-white"
                  style={{ width: "32px", height: "32px", backgroundColor: "#006194" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_hospital</span>
                </div>
                <span className="fw-bold fs-5 text-dark" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  AegisHealth
                </span>
              </div>
              <p className="text-secondary mb-3" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                Enterprise Hospital Information System and Telehealth Platform connecting certified clinicians with integrated diagnostics and EHR record vaults.
              </p>
              <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: "12px" }}>
                <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>verified</span>
                <span>HIPAA &amp; HL7® FHIR® Compliant Clinical Network</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Portal Navigation
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
                <li>
                  <a href="/" className="text-secondary text-decoration-none">
                    Home Portal
                  </a>
                </li>
                <li>
                  <a href="/doctors" className="text-primary fw-semibold text-decoration-none">
                    Our Specialists
                  </a>
                </li>
                <li>
                  <a href="/#calculators" className="text-secondary text-decoration-none">
                    Health Calculators
                  </a>
                </li>
                <li>
                  <a href="tel:18002344763" className="text-danger fw-semibold text-decoration-none">
                    Emergency 24/7 Hotline
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Compliance & Legal */}
            <div className="col-lg-3 col-md-6 col-6">
              <h6 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Compliance &amp; Governance
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
                <li>
                  <a href="/#about" className="text-secondary text-decoration-none">
                    Clinical Quality Standards
                  </a>
                </li>
                <li>
                  <span className="text-secondary">Privacy Practices</span>
                </li>
                <li>
                  <span className="text-secondary">Terms of Service</span>
                </li>
                <li>
                  <span className="text-secondary">Medical Records Request</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Hours & Emergency Contacts */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Hours &amp; Immediate Triage
              </h6>
              <div className="text-secondary d-flex flex-column gap-1 mb-3" style={{ fontSize: "13px" }}>
                <div className="d-flex justify-content-between">
                  <span>Emergency Trauma:</span>
                  <strong className="text-danger">24/7 / 365</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Outpatient Consults:</span>
                  <span className="text-dark">Mon–Sat: 7am–8pm</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Virtual Telehealth:</span>
                  <span className="text-dark">Always Active</span>
                </div>
              </div>
              <div className="pt-2 border-top" style={{ borderColor: "#bfc7d2" }}>
                <span className="text-secondary d-block" style={{ fontSize: "11px" }}>Urgent Dispatch:</span>
                <span className="fw-bold text-danger fs-6">1-800-AEGIS-MD</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 pt-4 border-top text-secondary" style={{ borderColor: "#bfc7d2", fontSize: "12px" }}>
            <div className="d-inline-flex align-items-center gap-2 bg-light px-3 py-1.5 rounded-3 border" style={{ borderColor: "#bfc7d2" }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>accessibility</span>
              <span>WCAG 2.1 AA Compliant Clinical Telemetry Interface</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} AegisHealth Clinical Systems. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
