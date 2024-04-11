import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { calculateBMI } from '../Validations';
import CloseIcon from '@mui/icons-material/Close'; // Import the CloseIcon component from Material-UI
const BMICalculator = ({ toggleForm }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBMI] = useState(null);
    const handleCalculateBMI = () => {
        const bmiValue = calculateBMI(height, weight); // Use calculateBMI function
        setBMI(bmiValue);
    };
    const classificationTable = [
        { range: "< 16", classification: "Severe Thinness" },
        { range: "16 - 17", classification: "Moderate Thinness" },
        { range: "17 - 18.5", classification: "Mild Thinness" },
        { range: "18.5 - 25", classification: "Normal" },
        { range: "25 - 30", classification: "Overweight" },
        { range: "30 - 35", classification: "Obese Class I" },
        { range: "35 - 40", classification: "Obese Class II" },
        { range: "> 40", classification: "Obese Class III" }
    ];
    return (
        <div>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <h2 style={{ color: '#1977cc' }}>BMI Calculator</h2>
                <CloseIcon onClick={toggleForm} style={{ cursor: 'pointer', color: 'grey' }} />
            </div>
            <hr style={{ color: 'grey' }} />

            <div className="row flex-lg-nowrap">
                <div className="col">
                    <div className="row">
                        <div className="col mb-3">
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
                                    <TextField
                                        label="Weight (kg)"
                                        variant="outlined"
                                        fullWidth
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        type="number"
                                        margin="normal"
                                    />
                                    <Button variant="contained" color="primary" className='mt-2' onClick={handleCalculateBMI}>
                                        Calculate BMI
                                    </Button>
                                    {bmi !== null && (
                                        <p>Your BMI: {bmi}</p>
                                    )}
                                    <hr style={{ color: 'grey', marginTop: '30px' }} />
                                    <div className='mt-5'>
                                        <h5 style={{ color: '#1977cc' }}>BMI Table</h5>
                                        <table className="table mt-4">
                                            <thead>
                                                <tr>
                                                    <th>BMI Range (kg/m²)</th>
                                                    <th>Classification</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classificationTable.map(({ range, classification }) => (
                                                    <tr key={classification}>
                                                        <td>{range}</td>
                                                        <td>{classification}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BMICalculator;
