import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { calculateIdealWeight } from '../Validations';
import CloseIcon from '@mui/icons-material/Close'; // Import the CloseIcon component from Material-UI
const IdealWeight = ({ toggleForm }) => {
    const [height, setHeight] = useState('');
    const [idealWeight, setIdealWeight] = useState(null);

    const handleCalculateIdealWeight = () => {
        const weightInfo = calculateIdealWeight(height); // Call the function
        setIdealWeight(weightInfo);
    };
    const handleClose = () => {
        toggleForm(); // Close the form when close button is clicked
    };
    return (
        <div>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <h2 style={{ color: '#1977cc' }}>Ideal Weight Calculator</h2>
                <CloseIcon onClick={handleClose} style={{ cursor: 'pointer', color: 'grey' }} />
            </div>
            <hr style={{ color: 'grey' }} />
            <div className="card border-0 mb-3 shadow bg-white rounded">
                <div className="card-body">
                    <TextField
                        label="Height (cm)"
                        variant="outlined"
                        fullWidth
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        type="number"
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" className='mt-2' onClick={handleCalculateIdealWeight}>
                        Calculate Ideal Weight
                    </Button>
                    {idealWeight !== null && (
                        <p className='mt-3' style={{ fontWeight: 'bold' }}>Ideal Weight: {idealWeight.exactWeight} ({idealWeight.weightRange[0]} from {idealWeight.weightRange[1]}) kg </p>
                    )}

                    <hr style={{ color: 'grey', marginTop: '30px' }} />
                    <div className='mt-4'>
                        <div>

                            <h4 style={{ color: '#1977cc', fontWeight: 'bold' }}> Interesting Facts about Ideal Body Weight</h4>

                            <p className='mt-4' style={{ textAlign: 'justify' }}>
                                Ideal weight refers to the ideal weight according to a person's height, age, gender, body composition and general health. This is determined not by the number of measurements but by many factors such as muscle mass, bone density and fat distribution.
                                Here are some interesting facts about ideal weight:
                            </p>
                        </div>

                        <div style={{ textAlign: 'justify' }}>
                            <p><span style={{ fontWeight: 'bold' }}>1. Varies from person to person: </span>
                                The ideal weight varies from person to person and depends on factors such as height, body composition, age, gender and activity level.</p>
                            <p><span style={{ fontWeight: 'bold' }}>2. Calculating BMI: </span>
                                Body Mass Index (BMI) is often used as a general measure of whether a person is overweight. However, it does not include many factors such as muscle mass or fat distribution.</p>
                            <p><span style={{ fontWeight: 'bold' }}>3. Health: </span>
                                The ideal weight generally falls within the healthy BMI range, usually between 18.5 and 24.9. However, this range may vary depending on other factors.</p>
                            <p><span style={{ fontWeight: 'bold' }}>4. Muscle vs. Fat: </span>
                                Muscle weighs more than fat, so a person with more muscle will weigh more and still have a healthy body.</p>
                            <p><span style={{ fontWeight: 'bold' }}>5. Health Risks: </span>
                                Being both underweight and overweight poses health risks. Being underweight can lead to problems such as poor muscle function and osteoporosis, while being overweight can increase the risk of diseases such as heart disease, diabetes and some cancers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IdealWeight;
