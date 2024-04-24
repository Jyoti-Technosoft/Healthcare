import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Button, Box } from '@mui/material';
import { getAgeCalculator } from '../Validations';
const AgeCalculator = ({ toggleForm }) => {
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [ageDate, setAgeDate] = useState(new Date());
    const [age, setAge] = useState(null);

    const handleClose = () => {
        toggleForm(); // Close the form when close button is clicked
    };

    const handleDateOfBirthChange = (date) => {
        setDateOfBirth(date); // Update Date of Birth
    };

    const handleAgeDateChange = (date) => {
        setAgeDate(date); // Update Age Date
    };

    const calculateAge = () => {
        getAgeCalculator(dateOfBirth, ageDate, setAge);
    };


    return (
        <>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <h2 style={{ color: '#1977cc' }}>Age Calculator</h2>
                <CloseIcon onClick={handleClose} style={{ cursor: 'pointer', color: 'grey' }} />
            </div>
            <hr style={{ color: 'grey' }} />

            {/* Date of Birth Picker */}
            <Box sx={{ width: '100%', marginBottom: '1rem' }}>
                <TextField
                    label="Date of Birth"
                    type="date"
                    value={dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateOfBirthChange(new Date(e.target.value))}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ width: '100%' }}
                />

                {/* Age Date Picker */}
                <TextField
                    className='mt-4'
                    label="Age at the Date of"
                    type="date"
                    value={ageDate ? ageDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleAgeDateChange(new Date(e.target.value))}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ width: '100%' }}
                />
                <Button variant="contained" color="primary" className='mt-3' onClick={calculateAge}>
                    Calculate Age
                </Button>
            </Box>

            {/* Display Age */}
            {age && (
                <div className="mt-4">
                    <h4>Age:</h4>
                    <>
                        <p> <span style={{ fontWeight: 'bold' }}> {age.years} years {age.months} months {age.days} days </span> </p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {age.years * 12 + age.months} months {age.days} days </span> </p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {Math.floor((age.years * 365 + age.months * 30.4375 + age.days) / 7)} weeks {age.days} days</span></p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {age.years * 365 + age.months * 30.4375 + age.days} days</span></p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {age.years * 365 * 24 + age.months * 30.4375 * 24 + age.days * 24} hours</span></p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {age.years * 365 * 24 * 60 + age.months * 30.4375 * 24 * 60 + age.days * 24 * 60} minutes</span></p>
                        <p>or <span style={{ fontWeight: 'bold' }}> {age.years * 365 * 24 * 60 * 60 + age.months * 30.4375 * 24 * 60 * 60 + age.days * 24 * 60 * 60} seconds</span></p>
                    </>
                </div >
            )}
        </>
    );
};

export default AgeCalculator;
