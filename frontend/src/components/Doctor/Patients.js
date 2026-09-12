import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getDoctorsWithIdApi, getPatientsListForDoctor } from "../Api";
import PatientDetailPage from "./PatientDetailPage";
import "../../assets/css/Doctor/Appointments.css";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState(true); // true = List, false = Detail

  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId");

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, token);
        const doctorId = doctorInfo.id;
        const data = await getPatientsListForDoctor(doctorId, token);
        setPatients(data || []);
        setFilteredPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredPatients.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredData = patients.filter(
      (patient) =>
        patient.id.toString().includes(keyword) ||
        patient.name.toLowerCase().includes(keyword) ||
        patient.user.email.toLowerCase().includes(keyword) ||
        patient.address.toLowerCase().includes(keyword) ||
        patient.gender.toLowerCase().includes(keyword) ||
        patient.age.toString().includes(keyword)
    );
    setFilteredPatients(filteredData);
    setPage(1); // Reset to first page on search
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setActiveTab(false);
  };

  return (
    <>
      {activeTab ? (
        <div className="doctor-dashboard">
          <div className="doctor-list-card">
            {/* Top Header */}
            <div className="top-header">
              <p className="total-patient">
                Total Patients: <strong>{filteredPatients.length}</strong>
              </p>
            </div>

            <hr className="divider-line" />

            {/* Title & Search */}
            <div className="title-row">
              <h3>Patients</h3>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <i className="bi bi-search search-icon"></i>
              </div>
            </div>

            {/* --- STANDARD HTML TABLE --- */}
            <div className="table-responsive doctor-table-container mt-3">
              {loading ? (
                <p className="text-center text-muted py-3">Loading...</p>
              ) : (
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((patient, index) => (
                        <tr key={patient.id}>
                          {/* Index */}
                          <td>{startIndex + index + 1}</td>

                          {/* Patient ID */}
                          <td>{patient.id}</td>

                          {/* Name */}
                          <td>{patient.name}</td>

                          {/* Email */}
                          <td title={patient.user.email}>
                            {patient.user.email}
                          </td>

                          {/* Gender */}
                          <td>{patient.gender}</td>

                          {/* Age */}
                          <td>{patient.age}</td>

                          {/* Address */}
                          <td title={patient.address}>{patient.address}</td>

                          {/* Action Button */}
                          <td>
                            <button
                              className="btn-report-icon"
                              onClick={() => handleRowClick(patient)}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          No patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION FOOTER */}
            {!loading && filteredPatients.length > 0 && (
              <div className="pagination-footer">
                <label>Rows per page: </label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>

                <span>
                  {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)}{" "}
                  of {filteredPatients.length}
                </span>

                <div className="pagination-controls">
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
              </div>
            )}
          </div>
        </div>
      ) : (
        <PatientDetailPage
          patient={selectedPatient}
          setActiveTab={setActiveTab}
        />
      )}
    </>
  );
}
