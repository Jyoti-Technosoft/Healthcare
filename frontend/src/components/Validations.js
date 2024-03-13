export function validateRequireEmail(email) {
    return email.trim() ? "" : "Email is required";
}

export function validatePatternEmail(email) {
    // If email is empty, return an empty string indicating it meets the requirement
    if (email.trim() === "") {
        return "";
    }
    const emailPattern = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    return emailPattern.test(email) ? "" : "Enter valid email format";
}

export function validateRequirePassword(password) {
    return password.trim() ? "" : "Password is required";
}

export function validatePatternPassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordPattern.test(password) ? "" : "Password must contain at least six characters, including numbers, letters, and symbols!";
}


export function validateRequireName(name) {
    return name.trim() ? "" : "Name is required";
}

export function validateRequireContact(contact){
    return contact.trim() ? "" : "Contact is required";
}

export function validateRequireDob(dob) {
    if (!dob) {
        return "Please select a date of birth";
    }
    return "";
}

export function validateRequireGender(gender) {
    if (!gender) {
        return "Please select a gender";
    }
    return "";
}

export function validateRequireAddress(address){
    return address.trim() ? "" : "Address is required";
}

export function validateRequireWorkingDays(days){
    if(!days){
        return "Please select days of working";
    }
    return "";
}
export function validateRequireShiftTime(time){
    if(!time){
        return "Please select shift timing";
    }
    return "";
}

export function validateRequireJoiningDate(date){
    if(!date){
        return "Please select joining date"
    }
}
export function validateRequireConsultancyCharge(date){
    if(!date){
        return "Consultancy charge require"
    }
}
export function validateRequireWeight(weight) {
    return weight.trim() ? "" : "Weight is required";
}
export function validateRequireHeight(height) {
    return height.trim() ? "" : "Height is required";
}
export function calculateAge(dateOfBirth){
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
}

export function dateFormatter(dateString){
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate.replace(/\b(\d{1})\b/g, '0$1st').replace(/\b(\d{2})\b/g, '$1th');
}