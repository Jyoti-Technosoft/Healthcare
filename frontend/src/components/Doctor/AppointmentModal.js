import React, { useState } from 'react';
import { Modal } from 'bootstrap'; 

const AppointmentModal = ({ appointmentId }) => {
  const [modal, setModal] = useState(null); // State for the modal

  // Function to initialize the modal when the component mounts
  const initModal = () => {
    const modalElement = document.getElementById('appointmentModal');
    setModal(new Modal(modalElement));
  };

  // Function to open the modal
  const openModal = () => {
    if (modal) {
      modal.show();
    }
  };

  // Initialize the modal when the component mounts
  React.useEffect(() => {
    initModal();
  }, []);

  return (
    <div className="modal fade" id="appointmentModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-end">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Appointment Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* Content goes here, you can display appointment details */}
            <p>Appointment ID: {appointmentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;