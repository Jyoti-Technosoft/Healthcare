import { registerPatientApi } from "../Api";
import Cookies from 'js-cookie'; 

export async function handlePatientRegistration(name, contact, email, dateOfBirth, gender, age, weight, height, address, navigate) {

    try {
        const token = Cookies.get('authToken');
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }
        const userData = {
            name,
            contact,
            email,
            dateOfBirth,
            gender,
            age,
            weight,
            height,
            address,
        };
        await registerPatientApi(userData);
        alert("Patient Registration Successfully");

    } catch (err) {
        alert("Registration failed! Please try again.");
    }
}