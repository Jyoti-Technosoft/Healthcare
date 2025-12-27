import React, { useState, useEffect } from "react";
import axios from "axios";
import { submitConsultationReport } from "../Api";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/Doctor/ConsultancyModal.css";

const ConsultancyModal = ({
  appointment,
  prescriptions,
  setPrescriptions,
  showCloseButton,
  setShowCloseButton,
  handleCloseModal, // <--- NEW PROP
}) => {
  const [prescriptionFields, setPrescriptionFields] = useState([
    { medicineNameInput: "", medicineDosage: "", timing: "1-1-1" },
  ]);
  const [medicineNameSuggestions, setMedicineNameSuggestions] = useState([]);
  const [activeFieldIndex, setActiveFieldIndex] = useState(-1);

  const token = Cookies.get("authToken");

  useEffect(() => {
    if (prescriptions && prescriptions.length === 0) {
      setPrescriptions([{ medicineName: "", dosage: "", timing: "" }]);
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
      const response = await axios.get(
        `https://api.fda.gov/drug/drugsfda.json?search=${inputValue}&limit=5`
      );
      const suggestionsData = response.data.results;
      const activeIngredientsSuggestions = suggestionsData.map((result) => ({
        name: result.products[0].active_ingredients[0].name,
        strength: result.products[0].active_ingredients[0].strength,
      }));
      setSuggestions(activeIngredientsSuggestions);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
    }
  };

  const handleRemovePrescription = (index) => {
    const updatedFields = prescriptionFields.filter((_, i) => i !== index);
    setPrescriptionFields(updatedFields);
  };

  const handleSubmit = async () => {
    try {
      const appointmentId = appointment.id;
      const prescriptions = prescriptionFields.map((prescription) => ({
        medicineName: prescription.medicineNameInput,
        dosage: prescription.medicineDosage,
        timing: prescription.timing,
      }));

      const disease = document.getElementById("disease").value;
      const notes = document.getElementById("description").value;
      const data = {
        appointmentId,
        disease,
        prescriptions,
        notes,
      };
      await submitConsultationReport(appointmentId, data, token);
      toast.success("Health Report submitted!");

      // After success, reload page to update lists
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit report!");
    }
  };

  return (
    <div
      className="modal fade show d-block custom-backdrop"
      id="consultancyModal"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content custom-modal-shadow border-0">
          {/* --- HEADER --- */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold font-poppins">
              <i className="bi bi-clipboard-pulse me-2"></i>Consultation Form
            </h5>
            {/* UPDATED CLOSE BUTTON */}
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleCloseModal} // Uses prop to close without refresh
            ></button>
          </div>

          {/* --- BODY --- */}
          <div className="modal-body custom-modal-body">
            {appointment && (
              <div className="container-fluid px-1">
                {/* 1. PATIENT DETAILS CARD */}
                <div className="patient-info-card mb-4">
                  <h6 className="section-header">Patient Summary</h6>
                  <div className="row g-3">
                    <div className="col-md-3 col-6">
                      <label className="info-label">Patient ID</label>
                      <div className="info-value">{appointment.patient.id}</div>
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="info-label">Patient Name</label>
                      <div className="info-value">
                        {appointment.patient.name}
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="info-label">Appt Date</label>
                      <div className="info-value">
                        {appointment.appointmentDate}
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <label className="info-label">Time</label>
                      <div className="info-value">
                        {appointment.appointmentTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DIAGNOSIS INPUT */}
                <div className="mb-4">
                  <label
                    htmlFor="disease"
                    className="form-label fw-bold text-primary"
                  >
                    Diagnosis / Disease <span className="text-danger">*</span>
                  </label>
                  <input
                    id="disease"
                    type="text"
                    className="form-control custom-input"
                    placeholder="Enter diagnosed disease (e.g. Viral Fever)"
                  />
                </div>

                {/* 3. PRESCRIPTION SECTION */}
                <div className="prescription-section mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold text-primary mb-0">
                      Medication Plan <span className="text-danger">*</span>
                    </label>
                  </div>

                  {prescriptionFields.map((prescription, index) => (
                    <div
                      key={index}
                      className="prescription-row card p-3 mb-2 border-0 shadow-sm bg-light"
                    >
                      <div className="row g-2 align-items-end">
                        {/* Medicine Name */}
                        <div className="col-md-4 position-relative">
                          <label className="small text-muted mb-1">
                            Medicine Name
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="Search medicine..."
                            value={prescription.medicineNameInput}
                            onChange={(e) =>
                              handleMedicineNameInputChange(e, index)
                            }
                          />
                          {/* Suggestions Dropdown */}
                          {medicineNameSuggestions.length > 0 &&
                            activeFieldIndex === index && (
                              <ul className="suggestions-dropdown list-group position-absolute w-100">
                                {medicineNameSuggestions.map(
                                  (medicine, idx) => (
                                    <li
                                      key={idx}
                                      className="list-group-item list-group-item-action"
                                      onClick={() =>
                                        handleMedicineNameSelect(
                                          medicine,
                                          index
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "13px",
                                      }}
                                    >
                                      <strong>{medicine.name}</strong>{" "}
                                      <span className="text-muted">
                                        - {medicine.strength}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                        </div>

                        {/* Dosage */}
                        <div className="col-md-3">
                          <label className="small text-muted mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="e.g. 500mg"
                            value={prescription.medicineDosage}
                            onChange={(e) => {
                              const updatedFields = [...prescriptionFields];
                              updatedFields[index].medicineDosage =
                                e.target.value;
                              setPrescriptionFields(updatedFields);
                            }}
                            disabled
                          />
                        </div>

                        {/* Timing */}
                        <div className="col-md-3">
                          <label className="small text-muted mb-1">
                            Frequency (1-0-1)
                          </label>
                          <input
                            type="text"
                            className="form-control custom-input"
                            placeholder="1-1-1"
                            value={prescription.timing}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(
                                /[^\d-]/g,
                                ""
                              );
                              const updatedFields = [...prescriptionFields];
                              updatedFields[index].timing = inputValue;
                              setPrescriptionFields(updatedFields);
                            }}
                          />
                        </div>

                        {/* Trash Button */}
                        <div className="col-md-2 text-end">
                          {prescriptionFields.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger border-0"
                              onClick={() => handleRemovePrescription(index)}
                              title="Remove Medicine"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add / Clear Buttons */}
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary fw-semibold"
                      onClick={() => {
                        setPrescriptionFields([
                          ...prescriptionFields,
                          {
                            medicineNameInput: "",
                            medicineDosage: "",
                            timing: "",
                          },
                        ]);
                        setShowCloseButton(true);
                      }}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Add Another
                      Medicine
                    </button>

                    {showCloseButton && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger text-decoration-none"
                        onClick={() => {
                          setPrescriptionFields([
                            {
                              medicineNameInput: "",
                              medicineDosage: "",
                              timing: "",
                            },
                          ]);
                          setShowCloseButton(false);
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. DESCRIPTION / NOTES */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label fw-bold text-primary"
                  >
                    Additional Notes / Instructions{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    className="form-control custom-input"
                    rows="3"
                    placeholder="Write description here..."
                  />
                </div>

                {/* 5. SUBMIT BUTTON */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg py-2 fw-bold shadow-sm"
                    style={{
                      backgroundColor: "#0150b5",
                      borderColor: "#0150b5",
                    }}
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-send-check me-2"></i> Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ConsultancyModal;
