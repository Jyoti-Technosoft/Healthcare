import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getAllAppointmentsForPatient } from '../Api';
import Cookies from 'js-cookie';
import { dateFormatter } from '../Validations';
const PatientDetailPage = ({ patinet }) => {
  const authToken = Cookies.get("authToken");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patinetId = patinet.id;
        const data = await getAllAppointmentsForPatient(patinetId, authToken);
        setAppointments(data); // Set the fetched patients to the state
        setFilteredAppointments(data); // Initially set filtered patients same as all patients
        setLoading(false);

      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);

      }
    };
    fetchData();
  }, []);
  const columns = [
    {
      name: '', selector: (row) => (
        <div>
          <i
            className="bi bi-eye-fill reportEyeIcon"

          ></i>
        </div>
      ), sortable: true, maxWidth: '70px'
    },
    { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '70px' },
    { name: 'Appointment ID', selector: (row) => row.id, sortable: true, minWidth: '110px' },
    { name: 'Appointment Date', selector: (row) => formatAppointmentDate(row.appointmentDate), sortable: true, minWidth: '160px' },
    { name: 'Appointment time', selector: (row) => row.appointmentTime, sortable: true, minWidth: '180px' },
    { name: 'Consultancy charge', selector: (row) => row.consultationCharge, sortable: true, minWidth: '200px' },
  ];
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredData = appointments.filter((appointment) =>
      appointment.id.toString().includes(keyword)

    );
    setFilteredAppointments(filteredData);

  };

  function formatAppointmentDate(dateString) {
    return dateFormatter(dateString);
  }

  return (
    <div className='background_part'>
      <div className="container consultancyContainer">
        <div className="row flex-lg-nowrap">
          <div className="col">
            <div className="row">
              <div className="col mb-3">
                <div className="card border-0 rounded">
                  <div className="card-body">
                    <i className="bi bi-arrow-left"
                      style={{ fontSize: '25px', cursor: 'pointer', color: 'silver', fontWeight: 'bold', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s' }}
                      
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    ></i>
                    {patinet && (
                      <div className='mt-4'>
                        <h5><b className='contentHeadings' style={{ color: 'black' }}>Patient Details</b></h5>
                        <br />
                        <div className="row">
                          <div className="col-md-3">
                            <ul>
                              <li><strong>Patient ID:</strong> <span style={{ fontSize: '14px' }}> {patinet.id}</span></li>
                              <li><strong>Patient Name:</strong> <span style={{ fontSize: '14px' }}> {patinet.name}</span></li>
                              <li><strong>Contact:</strong> <span style={{ fontSize: '14px' }}> {patinet.contact}</span></li>

                            </ul>
                          </div>
                          <div className="col-md-3">
                            <ul>
                              <li><strong>Gender:</strong> <span style={{ fontSize: '14px' }}> {patinet.gender}</span></li>
                              <li><strong>Date of Birth:</strong> <span style={{ fontSize: '14px' }}> {patinet.dateOfBirth}</span></li>
                              <li><strong>Age:</strong> <span style={{ fontSize: '14px' }}> {patinet.age}</span></li>

                            </ul>
                          </div>
                        </div>

                      </div>
                    )}
                    <hr style={{ color: 'grey' }} />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Appointments</b></h3>
                      <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} />
                    </div>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <DataTable
                        columns={columns}
                        data={filteredAppointments}
                        pagination
                        highlightOnHover
                        noDataComponent="No appointments found"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default PatientDetailPage;
