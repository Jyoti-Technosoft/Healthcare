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

            <div className="d-flex justify-content-center align-items-center ">
                <div className="container">
                    <h1>Fitness</h1>
                    <div className="row row-cols-1 row-cols-md-3">
                        <div className="col mb-4">
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1 ">
                                    <div class="d-flex justify-content-center">
                                        <img src="img/age.jpg" class="card-img-top mt-2  rounded" style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Image 1" />
                                    </div>
                                    <p className='text-center mt-2'>Age Calculator</p>
                                    <a href="#" class="btn btn-block" style={{ backgroundColor: '#1977cc', color: 'white' }} onClick={toggleForm('Age')}>Calculate</a>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4">
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1 ">
                                    <div class="d-flex justify-content-center">
                                        <img src="img/bmi.jpg" class="card-img-top mt-2  rounded" style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Image 2" />
                                    </div>
                                    <p className='text-center mt-2'>BMI Calculator</p>
                                    <a href="#" class="btn btn-block" style={{ backgroundColor: '#1977cc', color: 'white' }} onClick={toggleForm('BMI')}>Calculate</a>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4">
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1 ">
                                    <div class="d-flex justify-content-center">
                                        <img src="img/idealWeight.jpg" class="card-img-top mt-2  rounded" style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Image 2" />
                                    </div>
                                    <p className='text-center mt-2'>Know the ideal weight</p>
                                    <a href="#" class="btn btn-block" style={{ backgroundColor: '#1977cc', color: 'white' }} onClick={toggleForm('IdealWeight')}>Calculate</a>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col mb-4">
                            <div className="card  h-100 rounded border-0 justify-content-center" >
                                <div className="card-body p-1 ">
                                    <div class="d-flex justify-content-center">
                                        <img src="img/idealWeight.jpg" class="card-img-top mt-2  rounded" style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Image 2" />
                                    </div>
                                    <p className='text-center mt-2'>Calorie calculator</p>
                                    <a href="#" class="btn btn-block" style={{ backgroundColor: '#1977cc', color: 'white' }} onClick={toggleForm('Calorie')}>Calculate</a>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
