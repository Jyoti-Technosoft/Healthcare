import React from 'react';
import { Slide, Box } from '@mui/material';
import BMICalculator from './BMICalculator';
import IdealWeight from './IdealWeight';
const SlidePanel = ({ showForm, toggleForm, activePanel }) => {
    
    return (
        <Slide direction="left" in={showForm} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "40%",
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
                                <BMICalculator toggleForm={toggleForm}/>
                            </>
                        )}
                        {activePanel === 'IdealWeight' && (
                            <>
                                <IdealWeight toggleForm={toggleForm}/>
                            </>
                        )}
                    </div>
                </div >
            </Box>
        </Slide>
    );
};

export default SlidePanel;
