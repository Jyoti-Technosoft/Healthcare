import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getDoctorsApi } from "./Api";
import "../assets/css/Global/Home.css";

export default function Banner() {
  const navigate = useNavigate();

  // --- Real Doctors Data from Backend ---
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  // --- Doctor Directory Filter States ---
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- BMI Calculator State ---
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(68.5);
  const [age, setAge] = useState(34);
  const [sex, setSex] = useState("male");
  const [unitSystem, setUnitSystem] = useState("metric");

  // Dynamic BMI Calculation
  const bmiValue = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#d97706", badgeClass: "bg-warning-subtle text-warning" };
    if (bmi <= 24.9) return { category: "Normal / Healthy Weight", color: "#006947", badgeClass: "bg-success-subtle text-success" };
    if (bmi <= 29.9) return { category: "Overweight", color: "#d97706", badgeClass: "bg-warning-subtle text-warning" };
    return { category: "Obese", color: "#ba1a1a", badgeClass: "bg-danger-subtle text-danger" };
  };

  const bmiMeta = getBmiCategory(bmiValue);

  // --- Caloric & IBW Calculator State ---
  const [caloricHeight, setCaloricHeight] = useState(175);
  const [frameSize, setFrameSize] = useState("medium");
  const [activityLevel, setActivityLevel] = useState("moderate");

  // Calculation: Devine Formula
  const heightInchesOver5ft = Math.max(0, (caloricHeight / 2.54) - 60);
  const baseIbw = 50 + (2.3 * heightInchesOver5ft);
  const ibwKg = baseIbw.toFixed(1);

  // Mifflin-St Jeor Daily Caloric Target
  const activityMultipliers = { sedentary: 1.2, moderate: 1.55, active: 1.725 };
  const bmrEstimate = (10 * ibwKg) + (6.25 * caloricHeight) - (5 * 30) + 5;
  const targetCalories = Math.round(bmrEstimate * (activityMultipliers[activityLevel] || 1.55));

  // Helper to decode Base64 doctor image safely
  const decodeBase64Image = (base64String) => {
    if (!base64String) return "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";
    return `data:image/png;base64,${base64String}`;
  };

  // Fetch real doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (response && Array.isArray(response) && response.length > 0) {
          setDoctorsList(response);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter real doctors dynamically
  const filteredDoctors = doctorsList.filter((doc) => {
    const specialty = (doc.specialities || "").toLowerCase();
    const name = (doc.name || "").toLowerCase();
    const designation = (doc.designation || "").toLowerCase();

    const matchesSpecialty = selectedSpecialty === "all" || specialty.includes(selectedSpecialty.toLowerCase());
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || designation.includes(searchQuery.toLowerCase()) || specialty.includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  // Extract unique specialties for tabs
  const availableSpecialties = Array.from(
    new Set(doctorsList.map((d) => d.specialities).filter(Boolean))
  );

  // Handle appointment booking redirect based on auth
  const handleBookAppointment = () => {
    const role = Cookies.get("role");
    if (role === "PATIENT") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="aegis-home-wrapper" style={{ backgroundColor: "#f8f9ff", color: "#0b1c30", fontFamily: "'Inter', sans-serif" }}>

      {/* ================= 1. HERO & OMNIBOX BANNER ================= */}
      <section className="py-5 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f8f9ff 0%, #eff4ff 50%, #f8f9ff 100%)" }}>
        <div className="container py-3">

          {/* Trust Header Badge */}
          <div className="d-flex justify-content-center justify-content-md-start mb-4">
            <div className="stitch-trust-badge">
              <span className="position-relative d-flex" style={{ width: "10px", height: "10px" }}>
                <span className="position-absolute w-100 h-100 rounded-circle bg-success opacity-75 animate-ping"></span>
                <span className="position-relative w-100 h-100 rounded-circle bg-success"></span>
              </span>
              <span>HIPAA Certified &amp; Integrated Hospital Network</span>
            </div>
          </div>

          {/* Main Headline & Subheading */}
          <div className="row">
            <div className="col-lg-9">
              <h1 className="fw-extrabold text-dark tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "calc(1.8rem + 1.5vw)", lineHeight: "1.2" }}>
                Smart Healthcare Management for <span style={{ color: "#006194" }}>Modern Hospitals</span> &amp; Patients
              </h1>
              <p className="lead text-secondary mb-5" style={{ fontSize: "1.1rem", maxWidth: "680px" }}>
                Connecting over 120,000 verified patients with board-certified specialists, instant teleconsultations, and real-time clinical diagnostics.
              </p>
            </div>
          </div>

          {/* Multi-field Quick Search Omnibox (Elevated Bento Card) */}
          <div className="stitch-bento-card p-4 mb-5">
            <form onSubmit={(e) => e.preventDefault()} className="row g-3 items-end">
              
              {/* Field 1: Doctor Name or Keyword */}
              <div className="col-lg-4 col-md-6">
                <label className="form-label fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  <span className="material-symbols-outlined align-middle text-primary me-1" style={{ fontSize: "16px" }}>person_search</span>
                  Doctor Name or Keyword
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg fs-6 rounded-3"
                  placeholder="e.g. Dr. Jenkins, Cardiology"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ backgroundColor: "#eff4ff", border: "1px solid #bfc7d2" }}
                />
              </div>

              {/* Field 2: Specialty Selector */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  <span className="material-symbols-outlined align-middle text-primary me-1" style={{ fontSize: "16px" }}>stethoscope</span>
                  Clinical Specialty
                </label>
                <select
                  className="form-select form-select-lg fs-6 rounded-3"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{ backgroundColor: "#eff4ff", border: "1px solid #bfc7d2" }}
                >
                  <option value="all">All Specialties</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedics">Orthopedics</option>
                </select>
              </div>

              {/* Field 3: Symptoms or Condition */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  <span className="material-symbols-outlined align-middle text-primary me-1" style={{ fontSize: "16px" }}>monitor_heart</span>
                  Symptoms or Condition
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg fs-6 rounded-3"
                  placeholder="e.g. Chest pain, Migraine"
                  style={{ backgroundColor: "#eff4ff", border: "1px solid #bfc7d2" }}
                />
              </div>

              {/* Action Button */}
              <div className="col-lg-2 col-md-6 d-grid">
                <Link
                  to="/findDoctors"
                  className="btn btn-primary btn-lg rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: "#006194", borderColor: "#006194" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
                  <span>Search</span>
                </Link>
              </div>
            </form>

            {/* Omnibox Quick Chips */}
            <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center gap-2 text-secondary" style={{ fontSize: "12px" }}>
              <span className="fw-bold">Frequent Searches:</span>
              <button type="button" onClick={() => setSearchQuery("Cardiology")} className="stitch-chip">Heart Palpitations</button>
              <button type="button" onClick={() => setSearchQuery("Pediatric")} className="stitch-chip">Pediatric Wellness</button>
              <button type="button" onClick={() => setSearchQuery("Neurology")} className="stitch-chip">Spine MRI Review</button>
              <button type="button" onClick={() => setSearchQuery("Orthopedics")} className="stitch-chip">Post-Op Telehealth</button>
            </div>
          </div>

          {/* Quick Stats Ribbon (4 metric cards matching Stitch) */}
          <div className="row g-3">
            <div className="col-xl-3 col-sm-6">
              <div className="stitch-stat-card">
                <div className="stitch-icon-box" style={{ backgroundColor: "#cce5ff", color: "#006194" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>medical_services</span>
                </div>
                <div className="stitch-stat-content">
                  <div className="stitch-stat-num">1,450+</div>
                  <div className="stitch-stat-title text-primary">Verified Specialists</div>
                  <div className="stitch-stat-sub">99.4% Board Certified</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="stitch-stat-card">
                <div className="stitch-icon-box" style={{ backgroundColor: "#dae2fd", color: "#565e74" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>diversity_1</span>
                </div>
                <div className="stitch-stat-content">
                  <div className="stitch-stat-num">320,000+</div>
                  <div className="stitch-stat-title text-primary">Active Patients Served</div>
                  <div className="stitch-stat-sub">Across 42 Clinical Facilities</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="stitch-stat-card">
                <div className="stitch-icon-box" style={{ backgroundColor: "#6ffbbe", color: "#006947" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>check_circle</span>
                </div>
                <div className="stitch-stat-content">
                  <div className="stitch-stat-num">99.8%</div>
                  <div className="stitch-stat-title" style={{ color: "#006947" }}>Clinical Accuracy</div>
                  <div className="stitch-stat-sub">5-Star Satisfaction Rating</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="stitch-stat-card">
                <div className="stitch-icon-box" style={{ backgroundColor: "#ffdad6", color: "#ba1a1a" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>health_and_safety</span>
                </div>
                <div className="stitch-stat-content">
                  <div className="stitch-stat-num">24/7 / 365</div>
                  <div className="stitch-stat-title" style={{ color: "#ba1a1a" }}>Emergency Support</div>
                  <div className="stitch-stat-sub">Instant On-Demand Triage</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* ================= 2. SEARCHABLE DOCTOR DIRECTORY SECTION ================= */}
      <section className="py-5" id="directory" style={{ backgroundColor: "#f8f9ff" }}>
        <div className="container">

          {/* Section Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <div className="text-primary fw-bold text-uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>groups</span>
                Accredited Physician Network
              </div>
              <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px" }}>
                Find Board-Certified Specialists
              </h2>
              <p className="text-secondary mb-0" style={{ fontSize: "14px", maxWidth: "600px" }}>
                Browse our network of accredited clinicians ready for in-person or virtual consultation with real-time calendar syncing.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill bg-white text-dark border px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ fontSize: "12px" }}>
                <span className="rounded-circle bg-success" style={{ width: "8px", height: "8px" }}></span>
                {doctorsList.length > 0 ? `${doctorsList.length} Clinicians Online Now` : "14 Clinicians Online Now"}
              </span>
            </div>
          </div>

          {/* Filter Controls Bar */}
          <div className="card border-0 shadow-sm rounded-3 p-3 mb-4" style={{ backgroundColor: "#ffffff", border: "1px solid #bfc7d2" }}>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
              
              {/* Dynamic Specialty Filter Tabs */}
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpecialty("all")}
                  className={`stitch-tab-btn ${selectedSpecialty === "all" ? "active" : "inactive"}`}
                >
                  All Specialists <span className="opacity-75">({doctorsList.length})</span>
                </button>
                {availableSpecialties.map((spec, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`stitch-tab-btn ${selectedSpecialty === spec ? "active" : "inactive"}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {/* View Doctor Directory Link */}
              <Link to="/findDoctors" className="btn btn-outline-primary btn-sm fw-semibold rounded-3 px-3">
                Full Specialist Directory &rarr;
              </Link>
            </div>
          </div>

          {/* Doctor Cards Grid (Responsive Columns with Real Backend Data) */}
          {loadingDoctors ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading doctors...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <div key={doctor.id || index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <div className="stitch-bento-card h-100 overflow-hidden d-flex flex-column justify-content-between p-3">
                      <div>
                        <div className="position-relative mb-3">
                          <img
                            src={decodeBase64Image(doctor.doctorImageData)}
                            alt={doctor.name}
                            className="w-100 rounded-3"
                            style={{ height: "220px", objectFit: "cover", border: "1px solid rgba(191, 199, 210, 0.4)" }}
                          />
                          <div className="position-absolute top-0 end-0 m-2.5 stitch-verified-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span>
                            <span>Verified MD</span>
                          </div>
                          <div className="position-absolute bottom-0 start-0 m-2.5 stitch-specialty-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>medical_services</span>
                            <span>{doctor.specialities || "General Practice"}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{doctor.name}</h4>
                          <p className="text-secondary mb-2" style={{ fontSize: "12px" }}>{doctor.designation || "Senior Specialist"}</p>

                          <div className="d-flex align-items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-warning" style={{ fontSize: "18px" }}>star</span>
                            <span className="fw-bold text-dark" style={{ fontSize: "13px" }}>4.95</span>
                            <span className="text-secondary" style={{ fontSize: "12px" }}>(120+ reviews)</span>
                          </div>

                          <div className="py-2 my-2 border-top border-bottom text-secondary" style={{ fontSize: "12px" }}>
                            <div className="mb-1 d-flex align-items-center gap-1.5">
                              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>workspace_premium</span>
                              <span>{doctor.qualification || "Board Certified Specialist"}</span>
                            </div>
                            <div className="text-success fw-semibold d-flex align-items-center gap-1.5">
                              <span className="material-symbols-outlined text-success" style={{ fontSize: "16px" }}>schedule</span>
                              <span>Shift: {doctor.shiftTime || "Regular Hours"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="d-flex justify-content-between align-items-baseline mb-3">
                          <span className="text-secondary" style={{ fontSize: "12px" }}>Consultation Fee</span>
                          <div className="text-end">
                            <span className="fw-bold fs-5 text-dark">${doctor.consultationCharge || "100"}</span>
                            <span className="text-secondary" style={{ fontSize: "12px" }}> / session</span>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDoctorModal(doctor)}
                            className="btn btn-outline-secondary btn-sm flex-grow-1 fw-semibold rounded-3 py-2"
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={handleBookAppointment}
                            className="btn btn-primary btn-sm flex-grow-1 fw-bold rounded-3 py-2"
                            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
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
                  <p className="text-secondary">No doctors found matching the search criteria.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ================= 3. HEALTH CALCULATORS PREVIEW WIDGET ================= */}
      <section className="py-5 border-top border-bottom" id="calculators" style={{ backgroundColor: "#eff4ff" }}>
        <div className="container">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-5">
            <div className="text-primary fw-bold text-uppercase mb-1" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: "18px" }}>calculate</span>
              Clinical Decision Support
            </div>
            <h2 className="fw-bold text-dark mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px" }}>
              Preventative Health &amp; Clinical Calculators
            </h2>
            <p className="text-secondary" style={{ fontSize: "14px" }}>
              Assess vital health indices in seconds with medically calibrated tools vetted by AegisHealth cardiology and metabolic teams.
            </p>
          </div>

          {/* 2-Column Side-by-Side Interactive Widget Cards */}
          <div className="row g-4">
            
            {/* WIDGET A: BMI Calculator */}
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#ffffff" }}>
                <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-primary d-flex align-items-center justify-content-center" style={{ backgroundColor: "#cce5ff", width: "42px", height: "42px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>monitor_weight</span>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>Body Mass Index (BMI)</h3>
                      <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>WHO &amp; CDC Calibrated Scale</p>
                    </div>
                  </div>

                  <div className="btn-group btn-group-sm">
                    <button onClick={() => setUnitSystem("metric")} className={`btn ${unitSystem === "metric" ? "btn-primary" : "btn-outline-secondary"}`}>Metric</button>
                    <button onClick={() => setUnitSystem("imperial")} className={`btn ${unitSystem === "imperial" ? "btn-primary" : "btn-outline-secondary"}`}>Imperial</button>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Height (cm)</label>
                    <input type="number" className="form-control" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Weight (kg)</label>
                    <input type="number" step="0.5" className="form-control" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Age</label>
                    <input type="number" className="form-control" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Biological Sex</label>
                    <select className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Calculation Visual Gauge Container */}
                <div className="rounded-3 p-3 mb-4 border" style={{ backgroundColor: "#eff4ff" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-secondary" style={{ fontSize: "12px" }}>Calculated Index</span>
                    <span className={`badge rounded-pill px-3 py-1 ${bmiMeta.badgeClass}`} style={{ fontSize: "11px" }}>
                      {bmiMeta.category}
                    </span>
                  </div>

                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <span className="fw-bold fs-2 text-dark">{bmiValue}</span>
                    <span className="text-secondary" style={{ fontSize: "14px" }}>kg/m²</span>
                    <span className="ms-auto text-secondary" style={{ fontSize: "12px" }}>(Healthy: 18.5 – 24.9)</span>
                  </div>

                  <div className="progress" style={{ height: "10px" }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: "18.5%" }}></div>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: "30%" }}></div>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: "25%" }}></div>
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: "26.5%" }}></div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-primary fw-bold w-100 rounded-3 py-2" 
                    style={{ backgroundColor: "#006194", borderColor: "#006194" }}
                    onClick={() => {
                      // Smooth scroll or trigger calculation refresh
                      const el = document.getElementById("calculators");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Recalculate BMI Risk
                  </button>
                </div>
              </div>
            </div>

            {/* WIDGET B: Ideal Body Weight & Daily Caloric Target */}
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#ffffff" }}>
                <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 text-secondary d-flex align-items-center justify-content-center" style={{ backgroundColor: "#dae2fd", width: "42px", height: "42px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>nutrition</span>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-0" style={{ fontSize: "18px" }}>Metabolic &amp; Caloric Target</h3>
                      <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>Devine &amp; Mifflin-St Jeor Formulations</p>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Height (cm)</label>
                    <input type="number" className="form-control" value={caloricHeight} onChange={(e) => setCaloricHeight(Number(e.target.value))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Frame Size</label>
                    <select className="form-select" value={frameSize} onChange={(e) => setFrameSize(e.target.value)}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: "12px" }}>Activity Level</label>
                    <select className="form-select" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                      <option value="sedentary">Sedentary (Desk work, little exercise)</option>
                      <option value="moderate">Moderately Active (3-5 days/week)</option>
                      <option value="active">Very Active (Heavy training 6-7 days/week)</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 rounded-3 border bg-light">
                      <span className="text-secondary d-block mb-1" style={{ fontSize: "11px" }}>Ideal Body Weight (IBW)</span>
                      <span className="fw-bold fs-4 text-dark">{ibwKg} kg</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 border bg-light">
                      <span className="text-secondary d-block mb-1" style={{ fontSize: "11px" }}>Daily Caloric Target</span>
                      <span className="fw-bold fs-4 text-primary">{targetCalories} <small className="fs-6 text-secondary font-normal">kcal</small></span>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-primary fw-bold w-100 rounded-3 py-2"
                    onClick={() => {
                      const el = document.getElementById("calculators");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Update Caloric Target
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. ACCREDITATION & INSTITUTIONAL COMPLIANCE STRIP ================= */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-3">
            <span className="text-uppercase fw-bold text-secondary" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              Institutional Compliance &amp; Hospital Standards
            </span>
          </div>

          <div className="row g-3 align-items-center text-center">
            <div className="col-md-3 col-6">
              <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "24px" }}>award_star</span>
                <div className="text-start">
                  <div className="fw-bold text-dark" style={{ fontSize: "12px" }}>Joint Commission</div>
                  <div className="text-secondary" style={{ fontSize: "10px" }}>Accredited Hospital</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-center gap-2">
                <span className="material-symbols-outlined text-success" style={{ fontSize: "24px" }}>shield</span>
                <div className="text-start">
                  <div className="fw-bold text-dark" style={{ fontSize: "12px" }}>HIPAA Verified</div>
                  <div className="text-secondary" style={{ fontSize: "10px" }}>Privacy Standard</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-center gap-2">
                <span className="material-symbols-outlined text-info" style={{ fontSize: "24px" }}>hub</span>
                <div className="text-start">
                  <div className="fw-bold text-dark" style={{ fontSize: "12px" }}>FHIR Interoperable</div>
                  <div className="text-secondary" style={{ fontSize: "10px" }}>EHR Integration</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-center gap-2">
                <span className="material-symbols-outlined text-danger" style={{ fontSize: "24px" }}>verified_user</span>
                <div className="text-start">
                  <div className="fw-bold text-dark" style={{ fontSize: "12px" }}>ISO 27001 Certified</div>
                  <div className="text-secondary" style={{ fontSize: "10px" }}>Data Protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. FOOTER (Exact Match with Stitch Specification) ================= */}
      <footer className="border-top py-5" style={{ backgroundColor: "#f2f4fc", color: "#3f4850" }}>
        <div className="container">
          {/* Top 4-Column Grid */}
          <div className="row g-4 pb-4 border-bottom" style={{ borderColor: "#bfc7d2" }}>
            {/* Col 1: Medical center brand overview & central address */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-white"
                  style={{ width: "36px", height: "36px", backgroundColor: "#006194" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_hospital</span>
                </div>
                <span className="fw-bold fs-5" style={{ color: "#006194", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  AegisHealth
                </span>
              </div>
              <p className="text-secondary mb-3 leading-relaxed" style={{ fontSize: "13px" }}>
                Integrated clinical hospital system offering certified patient telemetry, on-demand physician consulting, and diagnostic accuracy.
              </p>
              <div className="text-secondary" style={{ fontSize: "13px" }}>
                <strong className="text-dark d-block">Central Campus:</strong>
                742 Evergreen Health Blvd,<br />Medical District, Suite 400
              </div>
            </div>

            {/* Col 2: Clinical Services Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                Clinical Services
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
                <li>
                  <a href="#directory" className="text-secondary text-decoration-none hover-primary">
                    Find Doctors
                  </a>
                </li>
                <li>
                  <a href="#calculators" className="text-secondary text-decoration-none hover-primary">
                    Health Calculators
                  </a>
                </li>
                <li>
                  <a href="#directory" className="text-secondary text-decoration-none hover-primary">
                    Specialties
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
                  <a href="#about" className="text-secondary text-decoration-none hover-primary">
                    Clinical Quality &amp; Compliance
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

          {/* Lower Disclaimers & Accessibility Badge */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 pt-4 text-secondary" style={{ fontSize: "12px" }}>
            <div className="d-inline-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border" style={{ borderColor: "#bfc7d2" }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>accessibility</span>
              <span className="fw-semibold">WCAG 2.1 AA Compliant • High Contrast Mode Ready • Screen Reader Optimized</span>
            </div>
            <div className="text-center text-md-end">
              &copy; 2025 AegisHealth Clinical Network. All rights reserved. HIPAA &amp; WCAG 2.1 AA Compliant.
            </div>
          </div>
        </div>
      </footer>

      {/* ================= 6. DOCTOR DETAIL MODAL ================= */}
      {selectedDoctorModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Doctor Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDoctorModal(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <img
                    src={decodeBase64Image(selectedDoctorModal.doctorImageData)}
                    alt={selectedDoctorModal.name}
                    className="rounded-circle border shadow-sm"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <h4 className="fw-bold text-dark mt-3 mb-1">{selectedDoctorModal.name}</h4>
                  <span className="badge rounded-pill bg-primary px-3 py-1" style={{ backgroundColor: "#006194" }}>
                    {selectedDoctorModal.specialities || "General Practice"}
                  </span>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary fw-semibold">Designation:</span>
                    <span className="text-dark fw-bold">{selectedDoctorModal.designation || "Senior Specialist"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary fw-semibold">Qualification:</span>
                    <span className="text-dark">{selectedDoctorModal.qualification || "MD, MBBS"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary fw-semibold">Shift Hours:</span>
                    <span className="text-dark">{selectedDoctorModal.shiftTime || "Regular Hours"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary fw-semibold">Working Days:</span>
                    <span className="text-dark">{selectedDoctorModal.dayOfWorking || "Mon - Sat"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-secondary fw-semibold">Consultation Fee:</span>
                    <span className="text-success fw-bold">${selectedDoctorModal.consultationCharge || "100"}</span>
                  </div>
                </div>
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

    </div>
  );
}


