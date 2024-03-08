import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getHealthreportsByAppointmentId } from '../Api';
import Cookies from 'js-cookie';

import ConsultancyModal from './ConsultancyModal';
const ConsultancyPage = ({ appointment }) => {
  const authToken = Cookies.get("authToken");
  const appointmentId = appointment[0];
  const [healthReport, setHealthReport] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [prescriptions, setPrescriptions] = useState([]);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHealthreportsByAppointmentId(appointmentId, authToken);
        console.log(data);
        setHealthReport(data);
      } catch (error) {
        console.error('Error fetching health report:', error);
      }
    };
    fetchData();
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
    const newPrescription = { medicineName: '', dosage: '', timing: '' };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  const handleRemovePrescription = (indexToRemove) => {
    const updatedPrescriptions = prescriptions.filter((_, index) => index !== indexToRemove);
    setPrescriptions(updatedPrescriptions);
  };
  const handleCloseButtonClick = () => {
    setShowCloseButton(false);
    setPrescriptions([]);
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
                              <li><strong>Patient ID:</strong> <span style={{ fontSize: '14px' }}> {appointment[1]}</span></li>
                              <li><strong>Patient Name:</strong> <span style={{ fontSize: '14px' }}> {appointment[2]}</span></li>
                              <li><strong>Contact:</strong> <span style={{ fontSize: '14px' }}> {appointment[3]}</span></li>

                            </ul>
                          </div>
                          <div className="col-md-4">
                            <ul>
                              <li><strong>Appointment Date:</strong> <span style={{ fontSize: '14px' }}> {appointment[10]}</span> </li>
                              <li><strong>Appointment Time:</strong> <span style={{ fontSize: '14px' }}> {appointment[11]}</span> </li>
                              <li><strong>Consultancy Charge:</strong><span style={{ fontSize: '14px' }}>  {appointment[12]}</span> </li>
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

      <div className="modal mx-auto" id="consultancyModal" tabIndex="-1">
        <div className="modal-dialog modal-lg ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Consultancy Form</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body d-flex justify-content-center" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {appointment && (
                <>
                  <div className="container">
                    <div className="col mb-3">
                      <div className="row flex-lg-nowrap g-3">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Patient Id</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control input-field form-control-lg bg-light"
                            placeholder="Patient id"
                            value={appointment[1]}
                            disabled
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Patient Name</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control input-field form-control-lg bg-light"
                            placeholder="Patient name"
                            value={appointment[2]}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row mt-1 flex-lg-nowrap g-3">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Appointment Date</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control input-field form-control-lg bg-light"
                            placeholder="Patient name"
                            value={appointment[10]}
                            disabled

                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Appointment Time</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control input-field form-control-lg bg-light"
                            placeholder="Patient name"
                            value={appointment[11]}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row mt-1 flex-lg-nowrap g-3">
                        <div className="col-12">
                          <label htmlFor="name" className="form-label">Disease</label>
                          <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                          <input
                            id="name"
                            type="text"
                            className="form-control input-field form-control-lg bg-light"
                            placeholder="Disease "
                            value=""
                            

                          />
                        </div>
                      </div>

                      <div className="mx-auto mt-3">
                        <label htmlFor="prescriptions" className="form-label">Prescriptions</label>
                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                        {prescriptions.map((prescription, index) => (
                          <div key={index} className="mb-3 mt-3">
                            <label htmlFor="prescriptions" className="form-label">Prescription {index + 1}</label>
                            <div className="row g-3">
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control input-field form-control-lg bg-light"
                                  placeholder="Medicine Name"
                                  value={prescription.medicineName}
                                  onChange={(e) => {
                                    const updatedPrescriptions = [...prescriptions];
                                    updatedPrescriptions[index].medicineName = e.target.value;
                                    setPrescriptions(updatedPrescriptions);
                                  }}
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control input-field form-control-lg bg-light"
                                  placeholder="Dosage"
                                  value={prescription.dosage}
                                  onChange={(e) => {
                                    const updatedPrescriptions = [...prescriptions];
                                    updatedPrescriptions[index].dosage = e.target.value;
                                    setPrescriptions(updatedPrescriptions);
                                  }}
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  className="form-control input-field form-control-lg bg-light"
                                  placeholder="Timing"
                                  value={prescription.timing}
                                  onChange={(e) => {
                                    const updatedPrescriptions = [...prescriptions];
                                    updatedPrescriptions[index].timing = e.target.value;
                                    setPrescriptions(updatedPrescriptions);
                                  }}
                                />
                              </div>
                              <div className="col">
                                <button type="button" className="btn btn-danger" onClick={() => handleRemovePrescription(index)}>
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="d-flex justify-content-end">
                          <button
                            type="submit"
                            className={`btn btn-primary`}
                            style={{ backgroundColor: '#1977cc', borderColor: '#1977cc' }}
                            onClick={() => {
                              handleAddPrescription();
                              setShowCloseButton(true); // Show the close button if prescriptions exist
                            }}
                          >
                            <i className="bi bi-plus"></i>
                            Add consultancy
                          </button>
                          {showCloseButton && (
                            <button type="button" className={`btn btn-danger`} onClick={handleCloseButtonClick}>
                              <i className="bi bi-x"></i>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ConsultancyPage;
