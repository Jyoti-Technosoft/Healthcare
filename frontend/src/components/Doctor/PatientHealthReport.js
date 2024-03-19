import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getHealthreportsByAppointmentId } from '../Api'
import Cookies from 'js-cookie';
import { dateFormatter } from '../Validations';
import PatientDetailPage from './PatientDetailPage';
const PatientHealthReport = ({ appointment, patient }) => {
    const authToken = Cookies.get("authToken");
    const [healthReport, setHealthReport] = useState([]);
    const [activeTab, setActiveTab] = useState(true);
    const [loading, setLoading] = useState(true);
    const setBackMenu = (appointment) => {
        setActiveTab(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const appointmentId = appointment.id;
                const data = await getHealthreportsByAppointmentId(appointmentId, authToken);
                setHealthReport(data); // Set the fetched patients to the state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    function formatAppointmentDate(dateString) {
        return dateFormatter(dateString);
    }
    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, sortable: true, maxWidth: '70px' },
        { name: 'Healthreport ID', selector: (row) => row.id, sortable: true, minWidth: '110px' },
        { name: 'Disease', selector: (row) => row.disease, sortable: true, minWidth: '160px' },
        {
            name: 'Prescription',
            selector: (row) => (
                <ul className="prescription-list">
                    {row.prescriptions.map(prescription => (
                        <li key={prescription.id}  className="prescription-item">
                            <strong>{prescription.medicineName}</strong> - Dosage: {prescription.dosage}, Timing: {prescription.timing}
                        </li>
                    ))}
                </ul>
            ),
            
            minWidth: '400px'
        },
        { name: 'Note', selector: (row) => row.notes, sortable: true, minWidth: '200px' },
    ];
    return (
        <>
            {activeTab ? (
                <div className='background_part'>
                    <div className="container centerContainer">
                        <div className="row flex-lg-nowrap">
                            <div className="col">
                                <div className="row">
                                    <div className="col-md-11 mb-3">
                                        <div className="card border-0 rounded">
                                            <div className="card-body">
                                                <i className="bi bi-arrow-left"
                                                    style={{ fontSize: '25px', cursor: 'pointer', color: 'silver', fontWeight: 'bold', borderRadius: '50%', padding: '5px', transition: 'background-color 0.5s' }}
                                                    onClick={setBackMenu}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E4E2'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                > </i>
                                                {patient && (
                                                    <div className='mt-4'>
                                                        <h5><b className='contentHeadings' style={{ color: 'black' }}>Appointment Details</b></h5>
                                                        <br />
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <ul>
                                                                    <li><strong>Patient ID:</strong> <span style={{ fontSize: '14px' }}> {patient.id}</span></li>
                                                                    <li><strong>Patient Name:</strong> <span style={{ fontSize: '14px' }}> {patient.name}</span></li>
                                                                    <li><strong>Contact:</strong> <span style={{ fontSize: '14px' }}> {patient.contact}</span></li>

                                                                </ul>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <ul>
                                                                    <li><strong>Appointment date:</strong> <span style={{ fontSize: '14px' }}> {formatAppointmentDate(appointment.appointmentDate)}</span></li>
                                                                    <li><strong>Appointment time:</strong> <span style={{ fontSize: '14px' }}> {appointment.appointmentTime}</span></li>
                                                                    <li><strong>Consultancy charge:</strong> <span style={{ fontSize: '14px' }}> &nbsp;  ₹{appointment.consultationCharge}</span></li>

                                                                </ul>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                                <hr style={{ color: 'grey' }} />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>HealthReport</b></h3>
                                                    {/* <input type="text" className='form-control input-field w-25' placeholder="Search..." onChange={handleSearch} /> */}
                                                </div>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    <DataTable
                                                        columns={columns}
                                                        data={healthReport}
                                                        pagination
                                                        highlightOnHover
                                                        noDataComponent="No health report found"
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
            ) : (
                <PatientDetailPage 
                    
                />
            )}
        </>
    );

}
export default PatientHealthReport;
