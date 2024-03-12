import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getHealthreportsByAppointmentId } from '../Api';
import Cookies from 'js-cookie';

import ConsultancyModal from './ConsultancyModal';
const ConsultancyPage = ({ appointment }) => {
  debugger
  const authToken = Cookies.get("authToken");
  const appointmentId = appointment ? appointment.id : null; // Check if appointment is null
  const [healthReport, setHealthReport] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [prescriptions, setPrescriptions] = useState([]);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [prescriptionFields, setPrescriptionFields] = useState([]);

  useEffect(() => {
    // Only fetch data if appointmentId exists
    if (appointmentId) {
      const fetchData = async () => {
        try {
          const data = await getHealthreportsByAppointmentId(appointmentId, authToken);
          setHealthReport(data);
        } catch (error) {
          console.error('Error fetching health report:', error);
        }
      };
      fetchData();
    }
  }, [appointmentId, authToken]);

  const columns = [
    { name: 'Disease', selector: 'disease', sortable: true },
    { name: 'Notes', selector: 'notes', sortable: true },
    { name: 'Examination Date-Time', selector: 'examinationDateTime', sortable: true },
    { name: 'Medicine Name', selector: 'medicineName', sortable: true },
    { name: 'Dosage', selector: 'dosage', sortable: true },
    { name: 'Timing', selector: 'timing', sortable: true },

    // Add more columns as needed
  ];
  const formatDateTime = (dateTimeArray) => {
    // Assuming dateTimeArray is in the format: [year, month, day, hour, minute, second, millisecond]
    const [year, month, day, hour, minute] = dateTimeArray;
    const formattedDate = `${year}-${pad(month)}-${pad(day)}`;
    const formattedTime = `${pad(hour)}:${pad(minute)}`;
    return `${formattedDate} ${formattedTime}`;
  }
  // Function to pad single-digit numbers with leading zeros
  const pad = (num) => {
    return num.toString().padStart(2, '0');
  }

  let tableData = [];
  if (healthReport && Array.isArray(healthReport)) {
    healthReport.forEach(report => {
      report.prescriptions.forEach(prescription => {
        tableData.push({
          disease: report.disease,
          notes: report.notes,
          examinationDateTime: formatDateTime(report.examinationDateTime),
          medicineName: prescription.medicineName,
          dosage: prescription.dosage,
          timing: prescription.timing,
        });
      });
    });
  }

  const handleToggleModal = () => {

    // Show the modal using Bootstrap's modal API
    const modal = new window.bootstrap.Modal(document.getElementById('consultancyModal'));
    modal.show();
  };
  const handleAddPrescription = () => {
    setPrescriptionFields([...prescriptionFields, { brandNameInput: '', medicineNameInput: '', medicineDosage: '', timing: '' }]);
  };

  const handleCloseButtonClick = () => {
    setShowCloseButton(false);
    setPrescriptionFields([]);
  };


  return (
    <div className='background_part'>
      <div className="container consultancyContainer">
        <div className="row flex-lg-nowrap">
          <div className="col">
            <div className="row">
              <div className="col mb-3">
                <div className="card border-0 rounded">
                  <div className="card-body">
                    {healthReport && appointment && (
                      <div>
                        <h5>Patient Details</h5>
                        <div className="row">
                          <div className="col-md-3">
                            <ul>
                              <li><strong>Patient ID:</strong> <span style={{ fontSize: '14px' }}> {appointment.patient.id}</span></li>
                              <li><strong>Patient Name:</strong> <span style={{ fontSize: '14px' }}> {appointment.patient.name}</span></li>
                              <li><strong>Contact:</strong> <span style={{ fontSize: '14px' }}> {appointment.patient.contact}</span></li>

                            </ul>
                          </div>
                          <div className="col-md-4">
                            <ul>
                              <li><strong>Appointment Date:</strong> <span style={{ fontSize: '14px' }}> {appointment.appointmentDate}</span> </li>
                              <li><strong>Appointment Time:</strong> <span style={{ fontSize: '14px' }}> {appointment.appointmentTime}</span> </li>
                              <li><strong>Consultancy Charge:</strong><span style={{ fontSize: '14px' }}>  {appointment.consultationCharge}</span> </li>
                            </ul>
                          </div>
                        </div>
                        <hr style={{ color: 'grey' }} />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Consultancy Details</b></h3>
                          <button type="submit" className={`btn btn-primary float-end`} style={{ backgroundColor: '#1977cc', borderColor: '#1977cc' }} onClick={() => handleToggleModal(appointmentId)}><i class="bi bi-plus" style={{ color: 'white' }}></i>Add consultancy</button>
                        </div>

                        <DataTable
                          columns={columns}
                          data={tableData}
                          pagination
                          highlightOnHover
                          noDataComponent="No medications found"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsultancyModal
        appointment={appointment}
        showCloseButton={showCloseButton}
        setShowCloseButton={setShowCloseButton}
        handleAddPrescription={handleAddPrescription}
        //handleRemovePrescription={handleRemovePrescription}
        handleCloseButtonClick={handleCloseButtonClick}
        prescriptionFields={prescriptionFields} // Pass prescriptionFields instead of prescriptions
        setPrescriptionFields={setPrescriptionFields} // Pass setPrescriptionFields instead of setPrescriptions
      />


    </div>
  );
};

export default ConsultancyPage;
