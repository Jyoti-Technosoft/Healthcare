import { registerUserApi, registerDoctorApi } from "../Api";
import Cookies from "js-cookie";

export async function UsersAuthHelper(
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
  navigate
) {
  try {
    const token = Cookies.get("authToken");

    // 1. Handle Missing Token
    if (!token) {
      console.log("User not authenticated. Redirecting to login...");
      navigate("/login");
      // Throw error to stop the success toast in the component
      throw new Error("Authentication token missing. Please login again.");
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

    // 2. Await and Return the response
    const response = await registerUserApi(userData, token);
    return response;
  } catch (error) {
    // 3. CRITICAL FIX: Re-throw the error so the Component catches it!
    console.error("UsersAuthHelper Error:", error);
    throw error;
  }
}

export async function DoctorAuthHelper(
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
  doctorImageData,
  consultationCharge,
  navigate
) {
  try {
    const token = Cookies.get("authToken");

    if (!token) {
      console.log("User not authenticated. Redirecting to login...");
      navigate("/login");
      throw new Error("Authentication token missing. Please login again.");
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

    // 4. Await and Return the response
    const response = await registerDoctorApi(userData, doctorImageData, token);
    return response;
  } catch (error) {
    // 5. CRITICAL FIX: Re-throw the error
    console.error("DoctorAuthHelper Error:", error);
    throw error;
  }
}
