import React, { useState, useEffect } from "react";
import Header from "./Header";
import { getDoctorsApi } from "./Api";
import "../assets/css/Global/Doctors.css"; // Ensure this file exists

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Open Modal Logic
  const handleReadMoreClick = (doctor) => {
    setSelectedDoctor(doctor);
    if (window.bootstrap) {
      const modalElement = document.getElementById("doctorModal");
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Bootstrap JS is not loaded.");
    }
  };

  // Helper to decode images safely
  const decodeBase64Image = (base64String) => {
    if (!base64String)
      return "https://via.placeholder.com/300x300?text=No+Image";
    return `data:image/png;base64,${base64String}`;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (response) {
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

  return (
    <>
      <Header />

      {/* --- Breadcrumb Section --- */}
      <section className="breadcrumb_part breadcrumb_bg doctorStartingPart">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Our Specialists</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Doctors Grid Section --- */}
      <section id="doctors" className="doctors-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Doctors</h2>
            <p>
              Dedicated professionals committed to your health and recovery.
            </p>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            /* Bootstrap Row with Gaps (gy-4 = vertical gap, gx-4 = horizontal gap) */
            <div className="row gy-4 gx-4">
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  /* GRID LOGIC: col-lg-4 = 3 cards per row on desktop */
                  <div className="col-lg-4 col-md-6 col-12" key={index}>
                    <div
                      className="doctor-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-img-wrapper">
                        <img
                          src={decodeBase64Image(doctor.doctorImageData)}
                          alt={doctor.name}
                        />
                      </div>
                      <div className="card-content">
                        <h4 className="doctor-name">{doctor.name}</h4>
                        <span className="doctor-badge">
                          {doctor.specialities}
                        </span>
                        <p className="doctor-designation">
                          {doctor.designation}
                        </p>

                        <button
                          onClick={() => handleReadMoreClick(doctor)}
                          className="btn-read-more"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>No doctors found available at this time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- Modal Section --- */}
      <div
        className="modal fade"
        id="doctorModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content doctor-modal-content">
            <div className="modal-header modal-header-custom">
              <h5 className="modal-title">Doctor Profile</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedDoctor && (
                <div className="container-fluid">
                  <div className="row">
                    {/* Left Side: Image & Name */}
                    <div className="col-md-4 text-center border-end profile-sidebar">
                      <img
                        src={decodeBase64Image(selectedDoctor.doctorImageData)}
                        className="modal-img"
                        alt={selectedDoctor.name}
                      />
                      <h4 className="modal-doc-name">{selectedDoctor.name}</h4>
                      <p className="modal-doc-desig">
                        {selectedDoctor.designation}
                      </p>
                      <div className="badge bg-primary mt-2">
                        {selectedDoctor.department}
                      </div>
                    </div>

                    {/* Right Side: Details & Schedule */}
                    <div className="col-md-8 profile-details">
                      <div className="detail-group">
                        <h6 className="detail-title">Qualification</h6>
                        <p className="detail-text">
                          {selectedDoctor.qualification}
                        </p>
                      </div>

                      <div className="schedule-box mt-3">
                        <h6 className="detail-title mb-2">OPD Schedule</h6>
                        <div className="d-flex justify-content-between">
                          <div className="time-block">
                            <span className="icon">☀️</span>
                            <strong>Morning:</strong> <br />
                            {selectedDoctor.morningTiming || "Not Available"}
                          </div>
                          <div className="time-block">
                            <span className="icon">⛅</span>
                            <strong>Evening:</strong> <br />
                            {selectedDoctor.eveningTiming || "Not Available"}
                          </div>
                        </div>
                      </div>

                      <div className="detail-group mt-3">
                        <h6 className="detail-title">About</h6>
                        <p className="bio-text">
                          {selectedDoctor.biography
                            ? selectedDoctor.biography
                            : `Dr. ${selectedDoctor.name} is a highly skilled ${selectedDoctor.specialities} with extensive experience in treating complex cases.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
