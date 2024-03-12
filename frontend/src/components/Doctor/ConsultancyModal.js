import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { submitConsultationReport } from '../Api';
import Cookies from 'js-cookie';

const ConsultancyModal = ({ appointment, prescriptions, setPrescriptions, showCloseButton, setShowCloseButton, handleAddPrescription, handleCloseButtonClick }) => {
  const [prescriptionFields, setPrescriptionFields] = useState([{ medicineNameInput: '', medicineDosage: '', timing: '1-1-1' }]);
  const [medicineNameSuggestions, setMedicineNameSuggestions] = useState([]);
  const [activeFieldIndex, setActiveFieldIndex] = useState(-1);

  const token = Cookies.get('authToken');

  useEffect(() => {
    if (prescriptions && prescriptions.length === 0) {
      setPrescriptions([{ medicineName: '', dosage: '', timing: '' }]);
    }
  }, [prescriptions, setPrescriptions]);

  const handleMedicineNameInputChange = async (event, index) => {
    const inputValue = event.target.value;
    const updatedFields = [...prescriptionFields];
    updatedFields[index].medicineNameInput = inputValue;
    setPrescriptionFields(updatedFields);
    fetchSuggestions(inputValue, setMedicineNameSuggestions);
    setActiveFieldIndex(index);
  };

  const handleMedicineNameSelect = (selectedMedicine, index) => {
    const updatedFields = [...prescriptionFields];
    updatedFields[index].medicineNameInput = selectedMedicine.name;
    updatedFields[index].medicineDosage = selectedMedicine.strength;
    setPrescriptionFields(updatedFields);
    setMedicineNameSuggestions([]);
  };

  const fetchSuggestions = async (inputValue, setSuggestions) => {
    try {
      const response = await axios.get(`https://api.fda.gov/drug/drugsfda.json?search=${inputValue}&limit=5`);
      const suggestionsData = response.data.results;
      const activeIngredientsSuggestions = suggestionsData.map(result => ({
        name: result.products[0].active_ingredients[0].name,
        strength: result.products[0].active_ingredients[0].strength // Optionally, include strength if needed
      }));
      console.log("Active Ingredients Suggestions:", activeIngredientsSuggestions);
      setSuggestions(activeIngredientsSuggestions);
    } catch (error) {
      console.error('Error fetching medicine suggestions:', error);
    }
  };


  const handleRemovePrescription = (index) => {
    const updatedFields = prescriptionFields.filter((_, i) => i !== index);
    setPrescriptionFields(updatedFields);
  };

  const handleSubmit = async () => {
    try {
      const appointmentId = appointment.id;
      const prescriptions = prescriptionFields.map(prescription => ({
        medicineName: prescription.medicineNameInput,
        dosage: prescription.medicineDosage,
        timing: prescription.timing
      }));
      const notes = document.getElementById('description').value;
      const data = {
        appointmentId,
        prescriptions,
        notes
      };
      await submitConsultationReport(appointmentId, data, token);
      alert("Report submitted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal mx-auto " id="consultancyModal" tabIndex="-1" >
      <div className="modal-dialog modal-lg ">
        <div className="modal-content prescriptionModal">
          <div className="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Consultancy Form</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex justify-content-center" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px' }}>
            {appointment && (
              <>
                <div className="container">
                  <div className="col mb-3" >
                    <div className="row flex-lg-nowrap g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Patient Id</label>
                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                        <input
                          id="name"
                          type="text"
                          className="form-control input-field form-control-lg bg-light"
                          placeholder="Patient id"
                          value={appointment.patient.id}
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
                          value={appointment.patient.name}
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
                          value={appointment.appointmentDate}
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
                          value={appointment.appointmentTime}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row mt-1 flex-lg-nowrap g-3">
                      <div className="col-12">
                        <label htmlFor="name" className="form-label">Disease</label>
                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                        <input
                          id="disease"
                          type="text"
                          className="form-control input-field form-control-lg bg-light"
                          placeholder="Disease "

                        />
                      </div>
                    </div>

                    <div className="mx-auto mt-3">
                      <label htmlFor="prescriptions" className="form-label">Prescriptions</label>
                      <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                      {prescriptionFields.map((prescription, index) => (
                        <div key={index} className="mb-3 mt-3 ">
                          <label htmlFor="prescriptions" className="form-label">Prescription {index + 1}</label>
                          <div className="row g-3 ">
                            {/* <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control input-field form-control-lg bg-light"
                                placeholder="Brand Name"
                                value={prescription.brandNameInput}
                                onChange={(e) => handleBrandNameInputChange(e, index)}
                              />
                              {brandNameSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                  {activeFieldIndex === index && brandNameSuggestions.map((medicine, idx) => (
                                    <li key={idx} onClick={() => handleBrandNameSelect(medicine, index)}>
                                      {medicine.products?.[0]?.brand_name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div> */}
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control input-field form-control-lg bg-light"
                                placeholder="Medicine Name"
                                value={prescription.medicineNameInput}
                                onChange={(e) => handleMedicineNameInputChange(e, index)}
                              />
                              {medicineNameSuggestions.length > 0 && (
                                <ul className="suggestions-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                  {activeFieldIndex === index && medicineNameSuggestions.map((medicine, idx) => (
                                    <li key={idx} onClick={() => handleMedicineNameSelect(medicine, index)}>
                                      {medicine.name} - {medicine.strength} {/* Adjust according to your data structure */}
                                    </li>
                                  ))}
                                </ul>
                              )}

                            </div>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control input-field form-control-lg bg-light"
                                placeholder="Dosage"
                                value={prescription.medicineDosage}
                                onChange={(e) => {
                                  const updatedFields = [...prescriptionFields];
                                  updatedFields[index].medicineDosage = e.target.value;
                                  setPrescriptionFields(updatedFields);
                                }}
                                disabled
                              />
                            </div>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control input-field form-control-lg bg-light"
                                placeholder="Timing"
                                value={prescription.timing} // Use prescription.timing for the value
                                onChange={(e) => {
                                  // Allow only digits in the input
                                  const inputValue = e.target.value.replace(/\D/g, '');
                                  // Update the timing for the specific prescription
                                  const updatedFields = [...prescriptionFields];
                                  updatedFields[index].timing = inputValue;
                                  setPrescriptionFields(updatedFields);
                                }}
                              />
                            </div>
                            <div className="col">
                              <button type="button" className="btn " onClick={() => {
                                console.log('Trash icon clicked');
                                handleRemovePrescription(index);
                              }}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className={`btn btn-primary`}
                          style={{ backgroundColor: '#1977cc', borderColor: '#1977cc' }}
                          onClick={() => {
                            setPrescriptionFields([...prescriptionFields, { medicineNameInput: '', medicineDosage: '', timing: '' }]);
                            setShowCloseButton(true);
                          }}
                        >
                          <i className="bi bi-plus"></i>
                          Add Prescription
                        </button>

                        {showCloseButton && (
                          <button type="button" className={`btn `} onClick={() => {
                            setPrescriptionFields([{ medicineNameInput: '', medicineDosage: '', timing: '' }]);
                            setShowCloseButton(false);
                          }}>
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                    </div>
                    <div className="row mt-1 flex-lg-nowrap g-3">
                      <div className="col-12">
                        <label htmlFor="name" className="form-label">Description</label>
                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                        <textarea
                          id="description"
                          className="form-control input-field form-control-lg bg-light"
                          placeholder="Description "

                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary mt-3 mb-3 `}
                      style={{ backgroundColor: '#1977cc', borderColor: '#1977cc' }}
                      onClick={handleSubmit}
                    >

                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyModal;
