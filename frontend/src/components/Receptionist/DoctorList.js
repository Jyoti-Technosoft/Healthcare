import React, { useState, useEffect } from "react";
import "../../assets/css/Receptionist/doctor-dashboard.css";
import defaultMale from "../../assets/img/maleRecep.png";
import { getDoctorsApi } from "../Api";

export default function DoctorDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isGrid, setIsGrid] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");

 
  // DEFAULT SPECIALITY DESCRIPTIONS
  
  const specialityDescriptions = {
    Cardiology:
      `Dedicated and experienced Cardiologist with deep expertise in diagnosing 
      and treating heart-related conditions. Skilled in managing hypertension, 
      coronary artery disease, arrhythmias, and preventive cardiac care. Focused 
      on delivering accurate diagnoses through modern medical technology and 
      patient-centered care.`,

    Pediatrics:
      `Compassionate Pediatric specialist providing medical care to infants, 
      children, and adolescents. Skilled in diagnosing childhood illnesses, 
      growth concerns, immunization planning, and preventive pediatric health.`,

    Radiology:
      `Expert Radiologist experienced in interpreting X-rays, CT scans, MRIs, 
      and ultrasounds. Committed to providing precise diagnostic insights and 
      supporting accurate medical decisions across departments.`,

    Orthopedic:
      `Experienced Orthopedic specialist skilled in treating fractures, joint 
      disorders, arthritis, and sports injuries. Dedicated to restoring mobility, 
      reducing pain, and improving musculoskeletal health.`,

    Dermatology:
      `Qualified Dermatologist skilled in treating acne, eczema, pigmentation 
      issues, hair fall, and nail disorders. Provides effective skincare solutions 
      using modern dermatological techniques.`,

    Neurology:
      `Experienced Neurologist specializing in migraines, epilepsy, stroke, 
      neuropathy, and neurodegenerative conditions. Focused on accurate diagnosis 
      and long-term neurological wellness.`,
  };


  // FETCH DOCTORS
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsApi();
        setDoctors(res || []);
        setFiltered(res || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const decodeBase64Image = (b64) =>
    b64 ? `data:image/png;base64,${b64}` : defaultMale;


  // SEARCH

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);

    if (!val) return setFiltered(doctors);

    const result = doctors.filter(
      (doc) =>
        doc.name?.toLowerCase().includes(val) ||
        doc.department?.toLowerCase().includes(val) ||
        doc.specialities?.toLowerCase().includes(val)
    );

    setFiltered(result);
  };


  // RENDER

  return (
    <div className="doctor-container">
      <div className="doctor-card-wrapper">

        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>clinical_notes</span>
              Medical Roster &bull; Staff Directory
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Attending Physicians Directory
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              Total Records: <strong className="text-dark">{filtered.length}</strong> active medical specialists
            </p>
          </div>

          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1 ${!isGrid ? "btn-primary" : "btn-outline-secondary"}`}
              style={!isGrid ? { backgroundColor: "#006194", borderColor: "#006194" } : {}}
              onClick={() => setIsGrid(false)}
              title="Table View"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>table_rows</span>
              <span>Table</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1 ${isGrid ? "btn-primary" : "btn-outline-secondary"}`}
              style={isGrid ? { backgroundColor: "#006194", borderColor: "#006194" } : {}}
              onClick={() => setIsGrid(true)}
              title="Roster Card View"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>grid_view</span>
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* SEARCH ROW */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
              Showing {filtered.length} matching physicians
            </span>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search doctor, department, specialty..."
              value={search}
              onChange={handleSearch}
            />
            <span className="material-symbols-outlined search-icon" style={{ fontSize: "18px" }}>search</span>
          </div>
        </div>

        {/* TABLE VIEW */}
        {!isGrid ? (
          <div className="table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Specializations</th>
                  <th>Status</th>
                  <th>Fees</th>
                  <th>Contact</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.id}</td>

                      <td className="doctor-name-cell">
                        <img
                          src={decodeBase64Image(doc.doctorImageData)}
                          alt={doc.name}
                          className="doc-img"
                        />
                        {doc.name}
                      </td>

                      <td>{doc.department || "-"}</td>
                      <td>{doc.specialities || "-"}</td>

                      <td>
                        <span
                          className={`status ${
                            doc.status?.toLowerCase() === "available"
                              ? "arrived"
                              : "canceled"
                          }`}
                        >
                          {doc.status || "Unavailable"}
                        </span>
                      </td>

                      <td>{doc.consultationCharge || "-"}</td>
                      <td>{doc.contact || "-"}</td>
                      <td>{doc.user?.email || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination-footer d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
                <span>Rows per page:</span>
                <select className="form-select form-select-sm" style={{ width: "70px", height: "32px" }}>
                  <option>10</option>
                  <option>20</option>
                  <option>30</option>
                </select>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: "13px" }}>1–{filtered.length} of {filtered.length}</span>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>first_page</span>
                  </button>
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
                  </button>
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
                  </button>
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>last_page</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="doctor-grid-wrapper">
            <div className="doctor-grid">
              {filtered.length > 0 ? (
                filtered.map((doc, index) => (
                  <div className="doctor-card" key={index}>
                    <img
                      src={decodeBase64Image(doc.doctorImageData)}
                      alt={doc.name}
                      className="doc-photo"
                    />

                    <h4>Dr. {doc.name}</h4>

                    <p className="specialization">{doc.specialities}</p>

                    <p
                      className={`availability ${
                        doc.status?.trim().toLowerCase() === "available"
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {doc.status?.trim() || "Unavailable"}
                    </p>

                    <button
                      className="read-btn"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      Read more
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data">No doctors found</p>
              )}
            </div>

            <div className="pagination-footer grid-footer">
              <label>Rows per page:</label>

              <select>
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>

              <span>1–10 of 10</span>

              <button>|&lt;</button>
              <button>&lt;</button>
              <button>&gt;</button>
              <button>&gt;|</button>
            </div>
          </div>
        )}
      </div>

      {/* 
          POPUP MODAL
      */}
      {selectedDoctor && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="doctor-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP SECTION */}
<div className="popup-top">

  {/* LEFT SECTION */}
  <div className="popup-left">
    <img
      src={decodeBase64Image(selectedDoctor.doctorImageData)}
      alt={selectedDoctor.name}
      className="popup-photo-large"
    />

    <p className="popup-doctor-name">Dr. {selectedDoctor.name}</p>
  </div>

  {/* RIGHT SIDE DETAILS */}
  <div className="popup-right-info">
    <p className="popup-label">Department</p>
    <p className="popup-value">{selectedDoctor.department || "-"}</p>

    <p className="popup-label">Mobile</p>
    <p className="popup-value">{selectedDoctor.contact || "-"}</p>

    <p className="popup-label">Email</p>
    <p className="popup-value">{selectedDoctor.user?.email || "-"}</p>
  </div>

</div>



            {/* DESCRIPTION */}
            <p className="popup-description">
              {selectedDoctor.description?.trim()
                ? selectedDoctor.description.trim()
                : specialityDescriptions[selectedDoctor.specialities] ||
                  `Experienced ${selectedDoctor.specialities} specialist.`}
            </p>

            {/* CLOSE BUTTON */}
            <button
              className="popup-close-btn"
              onClick={() => setSelectedDoctor(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
