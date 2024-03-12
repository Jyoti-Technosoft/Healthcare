import axios from 'axios';
import Cookies from 'js-cookie';
const token = Cookies.get('authToken');

export async function loginAdminApi(userData) {
    try {
        const response = await axios.post("http://localhost:8080/admin/loginAdmin", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function registerUserApi(userData) {
    try {
        
        const response = await axios.post("http://localhost:8080/admin/auth/registerUsers", userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUsersApi(userId) {
    try {
        
        const response = await axios.get(`http://localhost:8080/admin/getUser/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getDoctorsWithIdApi(userId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/getDoctor/${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });      
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function registerDoctorApi(userData, doctorImageData, token) {
    try {
        const formData = new FormData();
        formData.append('userDTOString', JSON.stringify(userData));
        formData.append('image', doctorImageData);

        const response = await axios.post("http://localhost:8080/admin/auth/registerDoctors", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getDoctorsApi() {
    try {
        
        const response = await axios.get("http://localhost:8080/admin/getAllDoctorsWithImages");
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function updateReceptionistProfileApi(userId,email,currentPassword,password,name,contact,gender,dateOfBirth,address,age,navigate) {
    try {
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }
        const userData={
            email,
            currentPassword,
            password,
            name,
            contact,
            gender,
            dateOfBirth,
            address,
            age,
        }

        const response = await axios.put(`http://localhost:8080/receptionist/auth/updateReceptionistProfile/${userId}`,userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert("Profile updated Successfully");
        return response.data;
    } catch (error) {
        alert(error);
        throw error;
    }
}

export async function updateDoctorProfileApi(userId,email,currentPassword,password,name,contact,gender,dateOfBirth,address,age,navigate) {
    try {
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }
        const userData={
            email,
            currentPassword,
            password,
            name,
            contact,
            gender,
            dateOfBirth,
            address,
            age,
        }

        const response = await axios.put(`http://localhost:8080/doctor/auth/updateDoctorProfile/${userId}`,userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert("Profile updated Successfully");
        return response.data;
    } catch (error) {
        alert(error);
        throw error;
    }
}

export async function registerPatientApi(userData) {
    try {
        
        const response = await axios.post("http://localhost:8080/admin/auth/registerPatient", userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSearchPatientsApi(query,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/receptionist/auth/searchPatient?query=${query}`, { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAllPatientsApi(token) {
    try {
        
        const response = await axios.get("http://localhost:8080/receptionist/auth/allPatientsList", { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAvailableSlots(doctorId, date,token) {
    try {
        
        
        const response = await axios.get(`http://localhost:8080/receptionist/auth/availableSlots`, {
            params: {
                doctorId,
                date: new Date(date).toISOString().split('T')[0]
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function bookAppointmentApi(doctorId,patientId,appointmentDate,appointmentTime,navigate) {
    try {
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }
        const userData={
            doctorId,
            patientId,
            appointmentDate,
            appointmentTime,
            
        }

        const response = await axios.post("http://localhost:8080/receptionist/auth/bookAppointment",userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert("Appointment booked Successfully");
        return response.data;
    } catch (error) {
        console.log(error);
        alert(error);
        throw error;
        
    }
}

export async function fetchConsultationChargeApi(patientId,doctorId,date,token){
    try{
        const response = await axios.get(`http://localhost:8080/receptionist/auth/patientConsultationCharge`, {
            params: {
                patientId,
                doctorId,
                date: new Date(date).toISOString().split('T')[0]
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(error){
        throw error;
    }
}

export async function getAllAppointmentsApi(doctorId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/new/allAppointments/${doctorId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAppointmentWithoutHealthReport(doctorId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/AppointmentWithoutHealthReport/${doctorId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAppointmentByUserId(userId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/receptionist/auth/getAppointments/${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAllAppointments(token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/receptionist/auth/getAppointments`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAllDoctors(token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/receptionist/auth/getDoctors`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getHealthreportsByAppointmentId(appointmentId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/healthReport/${appointmentId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function submitConsultationReport(appointmentId,data,token) {
    try {
        
        const response = await axios.post(`http://localhost:8080/doctor/auth/healthReport/${appointmentId}`,data,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


