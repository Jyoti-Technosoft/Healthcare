import React, { useEffect, useState } from "react";
// REMOVED: import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { getAllPatientsApi } from "../Api";
import { setActiveTab } from "../../actions/submenuActions";
import "../../assets/css/Receptionist/PatientList.css";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const activeTab = useSelector((state) => state.submenu.activeTab);
  const dispatch = useDispatch();
  const token = Cookies.get("authToken");

  useEffect(() => {
    if (activeTab !== "registerPatient") {
      dispatch(setActiveTab("patientsList"));
    }
  }, [dispatch, activeTab]);

  const handleChangeTab = (submenu) => {
    dispatch(setActiveTab(submenu));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPatientsApi(token);
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredPatients.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.user.email.toLowerCase().includes(keyword) ||
        p.contact.toLowerCase().includes(keyword) ||
        p.address.toLowerCase().includes(keyword)
    );
    setFilteredPatients(filtered);
    setPage(1);
  };

  // Helper for Gender Badge
  const renderGender = (gender) => {
    const genderText = gender
      ? gender.charAt(0).toUpperCase() + gender.slice(1)
      : "Other";
    const genderClass =
      genderText.toLowerCase() === "male"
        ? "gender-male"
        : genderText.toLowerCase() === "female"
        ? "gender-female"
        : "gender-other";

    return <span className={`gender-badge ${genderClass}`}>{genderText}</span>;
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-list-card">
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div>
            <div className="d-inline-flex align-items-center gap-1.5 text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>personal_injury</span>
              Patient Registry
            </div>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "22px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Clinical Patient Records
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              Total Records: <strong className="text-dark">{patients.length}</strong> registered patients
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
            style={{ backgroundColor: "#006194", borderColor: "#006194" }}
            onClick={() => handleChangeTab("registerPatient")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person_add</span>
            <span>Register New Patient</span>
          </button>
        </div>

        {/* SEARCH ROW */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1.5 fw-semibold" style={{ fontSize: "12px" }}>
              Showing {filteredPatients.length} matching patients
            </span>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search patient, contact, email..." onChange={handleSearch} />
            <span className="material-symbols-outlined search-icon" style={{ fontSize: "18px" }}>search</span>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (ALL LEFT ALIGNED) --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-4">Loading patient records...</p>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <tr key={row.id}>
                      {/* ID */}
                      <td>
                        <span className="badge bg-light text-secondary border">#{row.id}</span>
                      </td>

                      {/* Name */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary fw-bold"
                            style={{ width: "28px", height: "28px", fontSize: "11px", flexShrink: 0 }}
                          >
                            {row.name ? row.name.charAt(0).toUpperCase() : "P"}
                          </div>
                          <span className="fw-semibold text-dark">{row.name}</span>
                        </div>
                      </td>

                      {/* Gender (With Badge) */}
                      <td>{renderGender(row.gender)}</td>

                      {/* Age */}
                      <td>{row.age ? `${row.age} yrs` : "-"}</td>

                      {/* Weight */}
                      <td>{row.weight ? `${row.weight} kg` : "-"}</td>

                      {/* Height */}
                      <td>{row.height ? `${row.height} cm` : "-"}</td>

                      {/* Contact */}
                      <td>{row.contact || "-"}</td>

                      {/* Email */}
                      <td title={row.user?.email}>{row.user?.email || "-"}</td>

                      {/* Address */}
                      <td title={row.address}>{row.address || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No registered patients found matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        {!loading && filteredPatients.length > 0 && (
          <div className="pagination-footer d-flex align-items-center justify-content-between pt-3 mt-3 border-top">
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
              <span>Rows per page:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: "70px", height: "32px" }}
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
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted" style={{ fontSize: "13px" }}>
                {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)} of{" "}
                {filteredPatients.length}
              </span>

              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="First Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>first_page</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Previous Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  title="Next Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  title="Last Page"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>last_page</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
