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
        await registerUserApi(userData); 
        //alert("User Registration Successfully");
    } catch (error) {
        //alert("Registration failed! Please try again.");
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

        // Prepare user data
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

        // Call registerDoctorApi with user data and image data
        await registerDoctorApi(userData, doctorImageData, token);
        
        // Alert success message
        //alert("User Registration Successfully");
    } catch (error) {
        // Alert error message
        //alert("Registration failed! Please try again.");
    }
}

