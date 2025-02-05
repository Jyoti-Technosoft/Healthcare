import React from 'react';

export default function Modal({ doctor, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {doctor && (
                    <>
                        <h2>{doctor.name}</h2>
                        <p><b>Specialties:</b> {doctor.specialities}</p>
                        <p><b>Designation:</b> {doctor.designation}</p>
                    </>
                )}
            </div>
        </div>
    );
}
