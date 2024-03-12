
import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { getAllAppointments, getAllDoctors, getAllPatientsApi, getAllAppointmentsApi, getDoctorsWithIdApi } from '../Api';
export default function ReceptionistDashboard() {
  

  const [appointments, setAppointments] = useState([]);
  const [appointmentsDoctor, setAppointmentsDoctor] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const userId = Cookies.get("userId");
  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointment = await getAllAppointments(token);
        setAppointments(appointment);

        const doctor = await getAllDoctors(token);
        setDoctors(doctor);

        const patient = await getAllPatientsApi(token);
        setPatients(patient);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorInfo = await getDoctorsWithIdApi(userId, token);
        const fetchedDoctorId = doctorInfo.id;

        const data = await getAllAppointmentsApi(fetchedDoctorId, token);
        setAppointmentsDoctor(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, [userId, token]);

  const countTodaysAppointments = () => {
    const today = new Date().toISOString().slice(0, 10);
    return appointments.filter(appointment => appointment.appointmentDate === today).length;
  };

 
  return (
    <>

      <div className="d-flex justify-content-center align-items-center dashboardCard">
        <div className="container mr-1">
          <div className="row">
            <div className="col-md-3"> {/* Adjusted column size */}
              <div className="card mb-4 rounded border-0">
                <div className="card-body p-1">
                  <h1 className='text-center'>{appointments.length}</h1>
                  <p className='text-center'>Total Appointments</p>
                </div>
              </div>
            </div>
            <div className="col-md-3"> {/* Adjusted column size */}
              <div className="card mb-4 rounded border-0">
                <div className="card-body p-1">
                  <h1 className='text-center'>{countTodaysAppointments()}</h1>
                  <p className='text-center'>Today's Appointments</p>
                </div>
              </div>
            </div>
            <div className="col-md-3"> {/* Adjusted column size */}
              <div className="card mb-4 rounded border-0">
                <div className="card-body p-1">
                  <h1 className='text-center'>{doctors.length}</h1>
                  <p className='text-center'>Total Doctors</p>
                </div>
              </div>
            </div>
            <div className="col-md-3"> {/* Adjusted column size */}
              <div className="card mb-4 rounded border-0">
                <div className="card-body p-1">
                  <h1 className='text-center'>{patients.length}</h1>
                  <p className='text-center'>Total Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
