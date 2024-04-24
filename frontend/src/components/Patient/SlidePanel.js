import React from 'react';
import { Slide, Box } from '@mui/material';
import BMICalculator from './BMICalculator';
import IdealWeight from './IdealWeight';
import AgeCalculator from './AgeCalculator';
const SlidePanel = ({ showForm, toggleForm, activePanel }) => {
    
    return (
        <Slide direction="left" in={showForm} mountOnEnter unmountOnExit>
            <Box
                className='slideBox'
                sx={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "43%",
                    height: "100vh",
                    background: "#ffffff",
                    borderRadius: "0.5%",
                    zIndex: 999,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    overflowY: "auto",
                }}
            >
                <div className='background_part mt-3'>
                    <div className="container ">
                        {activePanel === 'BMI' && (
                            <>
                                <BMICalculator toggleForm={toggleForm(null)}/>
                            </>
                        )}
                        {activePanel === 'IdealWeight' && (
                            <>
                                <IdealWeight toggleForm={toggleForm(null)}/>
                            </>
                        )}
                        {activePanel === 'Age' && (
                            <>
                                <AgeCalculator toggleForm={toggleForm(null)}/>
                            </>
                        )}
                    </div>
                </div >
            </Box>
        </Slide>
    );
};

export default SlidePanel;
