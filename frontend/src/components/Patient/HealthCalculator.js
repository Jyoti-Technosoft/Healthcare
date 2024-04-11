import React, { useState } from 'react';
import { Backdrop, Box, Slide } from '@mui/material';
import SlidePanel from './SlidePanel';
export default function HealthCalculator() {
    const [showForm, setShowForm] = useState(false);
    const [activePanel, setActivePanel] = useState(null); // State to track active panel

    const toggleForm = (panel) => () => { // Modify toggleForm to accept panel parameter
        setShowForm(prevState => !prevState);
        setActivePanel(panel); // Set the active panel when toggling the form
    };
    return (
        <div>
            <Backdrop open={showForm} onClick={() => setShowForm(false)} style={{ opacity: 0 }} />
            <SlidePanel showForm={showForm} toggleForm={toggleForm} activePanel={activePanel} />


            <div className='background_part mt-3'>
                <div className="container ">
                    <div className="row flex-lg-nowrap">
                        <div className="col">
                            <div className="row">
                                <div className="col mb-3">
                                    <h1>Fitness</h1>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <Box
                                            height={180}
                                            width={180}
                                            my={4}
                                            display="flex"
                                            alignItems="center"
                                            gap={4}
                                            p={4}
                                            sx={{
                                                border: '1px solid grey', borderRadius: 3, cursor: 'pointer', '&:hover': {
                                                    backgroundColor: '#F0F8FF',
                                                },
                                            }}
                                            onClick={toggleForm('BMI')}
                                        >
                                            BMI Calculator
                                        </Box>

                                        <Box
                                            height={180}
                                            width={180}
                                            my={4}
                                            display="flex"
                                            alignItems="center"
                                            gap={4}
                                            p={4}
                                            sx={{
                                                border: '1px solid grey', borderRadius: 3, cursor: 'pointer', '&:hover': {
                                                    backgroundColor: '#F0F8FF',
                                                },
                                            }}
                                            onClick={toggleForm('IdealWeight')}
                                        >
                                            Know the ideal weight as an adult
                                        </Box>
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
