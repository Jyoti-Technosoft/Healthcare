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
                        <p>Ideal Weight: {idealWeight.exactWeight} ({idealWeight.weightRange[0]} from {idealWeight.weightRange[1]}) kg </p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default IdealWeight;
