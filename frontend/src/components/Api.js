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


