export function validateRequireId(id) {
    return id.trim() ? "" : "Id required";
}

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

export function validateRequireContact(contact) {
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
export function validateRequireTimeSlot(slot) {
    if (!slot) {
        return "Please select a time slot";
    }
    return "";
}

export function validateRequireAddress(address) {
    return address.trim() ? "" : "Address is required";
}

export function validateRequireDepartment(department) {
    if (!department) {
        return "Please select department";
    }
    return "";
}

export function validateRequireDoctor(doctor) {
    if (!doctor) {
        return "Please select doctor";
    }
    return "";
}

export function validateRequireWorkingDays(days) {
    if (!days) {
        return "Please select days of working";
    }
    return "";
}
export function validateRequireShiftTime(time) {
    if (!time) {
        return "Please select shift timing";
    }
    return "";
}

export function validateRequireJoiningDate(date) {
    if (!date) {
        return "Please select joining date"
    }
}
export function validateRequireConsultancyCharge(date) {
    if (!date) {
        return "Consultancy charge require"
    }
}
export function validateRequireWeight(weight) {
    return weight.trim() ? "" : "Weight is required";
}
export function validateRequireHeight(height) {
    return height.trim() ? "" : "Height is required";
}
export function validateRequireQualification(qualification) {
    return qualification.trim() ? "" : "Qualification is required";
}
export function validateRequireDesignation(designation) {
    return designation.trim() ? "" : "Designation is required";
}
export function validateRequireSpeciality(speciality) {
    return speciality.trim() ? "" : "Specialities is required";
}


export function validateRequireMorningTime(morningTime) {
    return morningTime.trim() ? "" : "Morning Time is required";
}
export function validateRequireEveningTime(eveningTime) {
    return eveningTime.trim() ? "" : "Evening Time is required";
}
export function validateRequireVisitingDays(visitingDays) {
    return visitingDays.trim() ? "" : "Visiting Days is required";
}
export function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function dateFormatter(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate.replace(/\b(\d{1})\b/g, '0$1st').replace(/\b(\d{2})\b/g, '$1th');
}

export const calculateBMI = (height, weight) => {
    if (height && weight) {
        const heightMeters = height / 100;
        const bmiValue = weight / (heightMeters * heightMeters);
        return bmiValue.toFixed(2);
    }
    return null;
};

export const calculateIdealWeight = (height) => {
    const exactWeight = Math.round((height - 100) * 0.9);
    const minHeight = Math.round(exactWeight * 0.9); // 10% below exact weight
    const maxHeight = Math.round(exactWeight * 1.1); // 10% above exact weight

    return {
        exactWeight: exactWeight,
        weightRange: [minHeight, maxHeight]
    };
};

export const getClassificationFromBMI = (bmiValue, classificationTable) => {
    for (let i = 1; i < classificationTable.length; i++) {
        const { range, classification } = classificationTable[i];
        if (range.startsWith('<')) {
            const maxValue = parseFloat(range.substring(1));
            if (bmiValue < maxValue) {
                return classification;
            }
        } else if (range.startsWith('>')) {
            const minValue = parseFloat(range.substring(1));
            if (bmiValue > minValue) {
                return classification;
            }
        } else {
            const [min, max] = range.split(' - ').map(parseFloat);
            if (bmiValue >= min && bmiValue <= max) {
                return classification;
            }
        }
    }
    return '';
};

export const getAgeCalculator = (dateOfBirth, ageDate, setAge) => {
    if (dateOfBirth && ageDate) {
        const diff = ageDate - dateOfBirth;
        const ageDateObj = new Date(ageDate);
        const dobDateObj = new Date(dateOfBirth);

        let years = ageDateObj.getFullYear() - dobDateObj.getFullYear();
        let months = ageDateObj.getMonth() - dobDateObj.getMonth();
        let days = ageDateObj.getDate() - dobDateObj.getDate();

        // Adjust months and years
        if (days < 0) {
            months--;
            days += new Date(ageDateObj.getFullYear(), ageDateObj.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        setAge({
            years: years,
            months: months,
            days: days
        });
    }
};

// utils.js
export const handleRowSelect = (selectedRows, setSelectedRows, row) => {
    const selectedIndex = selectedRows.indexOf(row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedRows, row.id);
    } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selectedRows.slice(0, selectedIndex),
            selectedRows.slice(selectedIndex + 1)
        );
    }

    setSelectedRows(newSelected);
};

export const calculateTotalDays = (startDate, endDate, setTotalDays) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round(Math.abs((start - end) / oneDay)) + 1; // Adding 1 to include both start and end dates
    setTotalDays(totalDays);
};

export const highlightDateRange = (start, end, setHighlightedDates) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const datesToHighlight = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format date as "dd/mm/yyyy"
        datesToHighlight.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    setHighlightedDates(datesToHighlight);
};

export const getCurrentDate = () => {
    const today = new Date();
    let month = '' + (today.getMonth() + 1);
    let day = '' + today.getDate();
    const year = today.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const convertTo12HourFormat = (time) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');
    
    // Convert hours to 12-hour format
    let formattedHours = parseInt(hours, 10);
    const amPm = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;

    // Return the formatted time string
    return `${formattedHours}:${minutes} ${amPm}`;
};

export const convertTo12Hour = (timeRange) => {
    // Split the time range string into start and end times
    const [startTime, endTime] = timeRange.split(' to ');
    
    // Convert start time to 12-hour format
    const formattedStartTime = convertTo12HourFormat(startTime);
    
    // Convert end time to 12-hour format
    const formattedEndTime = convertTo12HourFormat(endTime);

    // Return the formatted time range string
    return `${formattedStartTime} to ${formattedEndTime}`;
};

export const getDayIndex = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.findIndex((day) => day.toLowerCase() === dayName.toLowerCase());
};


// Function to convert the numeric day returned by date.getDay() to the corresponding day name
export const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
};