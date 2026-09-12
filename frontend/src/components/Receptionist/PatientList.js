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
        <div className="top-header">
          <p className="total-patient">
            Total Patient: <strong>{patients.length}</strong>
          </p>
          <button
            type="button"
            className="btn-add"
            onClick={() => handleChangeTab("registerPatient")}
          >
            <i className="bi bi-plus"></i> Add
          </button>
        </div>

        <hr className="divider-line" />

        <div className="title-row">
          <h3>Patient List</h3>
          <div className="search-box">
            <input type="text" placeholder="Search" onChange={handleSearch} />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        {/* --- STANDARD HTML TABLE (ALL LEFT ALIGNED) --- */}
        <div className="table-responsive doctor-table-container mt-3">
          {loading ? (
            <p className="text-center text-muted py-3">Loading...</p>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
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
                      <td>{row.id}</td>

                      {/* Name */}
                      <td>{row.name}</td>

                      {/* Gender (With Badge) */}
                      <td>{renderGender(row.gender)}</td>

                      {/* Age */}
                      <td>{row.age}</td>

                      {/* Weight */}
                      <td>{row.weight}</td>

                      {/* Height */}
                      <td>{row.height}</td>

                      {/* Contact */}
                      <td>{row.contact}</td>

                      {/* Email */}
                      <td title={row.user.email}>{row.user.email}</td>

                      {/* Address */}
                      <td title={row.address}>{row.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION FOOTER */}
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
            {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)} of{" "}
            {filteredPatients.length}
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
      </div>
    </div>
  );
}
