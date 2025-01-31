import { registerUserApi, registerDoctorApi } from "../Api";
import Cookies from 'js-cookie'; 

export async function UsersAuthHelper(email,password,roles,name,contact,dateOfBirth,age,gender,address,joiningDate,dayOfWork,shiftTiming,weight,height,navigate) {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }
        const userData = {
            email,
            password,
            roles,
            name,
            contact,            
            dateOfBirth,
            age,
            gender,                        
            address,
            joiningDate,
            dayOfWork,
            shiftTiming,
            weight,
            height,
        };
        await registerUserApi(userData,token); 
    } catch (error) {
    }

}

export async function DoctorAuthHelper(email, password, roles, name, contact, dateOfBirth, age, gender, address, joiningDate, qualification, designation, specialities, department, morningTiming, eveningTiming, visitingDays, doctorImageData, consultationCharge, navigate) {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            console.log('User not authenticated. Redirecting to login...');
            navigate('/login');
            return;
        }

        const userData = {
            email,
            password,
            roles,
            name,
            contact,
            dateOfBirth,
            age,
            gender,
            address,
            joiningDate,
            qualification,
            designation,
            specialities,
            department,
            morningTiming,
            eveningTiming,
            visitingDays,
            consultationCharge,
        };

        await registerDoctorApi(userData, doctorImageData, token);
    } catch (error) {
    }
}

