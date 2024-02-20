export function validateRequireEmail(email) {
    return email.trim() ? "" : "Email is required";
}

export function validatePatternEmail(email) {
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
