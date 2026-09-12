import React, { useState, useEffect } from "react";
import "../../assets/css/Receptionist/doctor-dashboard.css";
import listIcon from "../../assets/img/list-icon.png";
import gridIcon from "../../assets/img/grid-icon.png";
import searchIcon from "../../assets/img/search-icon.png";
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
        <div className="doctor-header">
          <p className="total-docs">
            Total Doctor: <strong>{filtered.length}</strong>
          </p>

          <div className="view-buttons">
            <button
              className={`toggle-btn ${!isGrid ? "active" : ""}`}
              onClick={() => setIsGrid(false)}
            >
              <img src={listIcon} alt="List" />
            </button>

            <button
              className={`toggle-btn ${isGrid ? "active" : ""}`}
              onClick={() => setIsGrid(true)}
            >
              <img src={gridIcon} alt="Grid" />
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* TITLE + SEARCH */}
        <div className="doctor-list-header">
          <h3>Doctor List</h3>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />
            <img src={searchIcon} alt="Search" />
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

            <div className="pagination-footer">
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
