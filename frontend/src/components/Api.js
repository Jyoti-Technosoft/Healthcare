import axios from 'axios';
import Cookies from 'js-cookie';
const token = Cookies.get('authToken');

export async function loginAdminApi(userData) {
    try {
        const response = await axios.post("http://localhost:8080/superAdmin/loginAdmin", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function registerUserApi(userData) {
    try {
        
        const response = await axios.post("http://localhost:8080/superAdmin/auth/registerUsers", userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getReceptionistApi(userId) {
    try {
        
        const response = await axios.get(`http://localhost:8080/superAdmin/getReceptionist/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getPatientApi(userId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/superAdmin/getPatient/${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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

        const response = await axios.post("http://localhost:8080/superAdmin/auth/registerDoctors", formData, {
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
        
        const response = await axios.get("http://localhost:8080/superAdmin/getAllDoctorsWithImages");
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

export async function updatePatientProfileApi(patientId,email,currentPassword,password,name,contact,gender,dateOfBirth,address,age,weight,height,navigate) {
    try {
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
            weight,
            height,
        }

        const response = await axios.put(`http://localhost:8080/patient/auth/updatePatientProfile/${patientId}`,userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        //alert("Profile updated Successfully");
        return response.data;
    } catch (error) {
        //alert(error);
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
        //alert("Profile updated Successfully");
        return response.data;
    } catch (error) {
        //alert(error);
        throw error;
    }
}

export async function registerPatientApi(userData) {
    try {
        
        const response = await axios.post("http://localhost:8080/superAdmin/auth/registerPatient", userData,{
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
 

export async function bookAppointmentApi(doctorId,patientId,appointmentDate,appointmentTime,token) {
    try {
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
        return response.data;
    } catch (error) {
        console.log(error);
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
export async function getAllHealthreports(token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/allHealthReport`,{
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
export async function getPatientsListForDoctor(doctorId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/doctor/auth/patients/${doctorId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getAllAppointmentsForPatient(patientId,token) {
    try {
        
        const response = await axios.get(`http://localhost:8080/patient/auth/new/allAppointments/${patientId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsers(token){
    try{
        const response = await axios.get("http://localhost:8080/superAdmin/auth/getUsers", {  
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(error){
        throw error;
    }
}
export async function updatePatientArrive(appointmentIds, token) {
    try {
        const appointmentIdsParam = appointmentIds.join(','); // Convert array to comma-separated string
        const response = await axios.put(`http://localhost:8080/receptionist/auth/todayAppointment?appointmentIds=${appointmentIdsParam}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function doctorLeaveRequest(fromDate,toDate,fromTime,toTime,reason,doctorId,token){
    try {       
        const userData={
            fromDate,
            toDate,
            fromTime,
            toTime,
            reason,
        } 
        const response = await axios.post(`http://localhost:8080/doctor/auth/doctorLeaveRequest/${doctorId}`,userData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getDoctorLeaveRequest(doctorId,token){
    try{
        const response = await axios.get(`http://localhost:8080/doctor/auth/getDoctorLeaveRequest/${doctorId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(error){
        throw error;
    }
}


