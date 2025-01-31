import React, { useState, useEffect } from 'react'; 
import Header from './Header'
import { getDoctorsApi } from "./Api";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleReadMoreClick = (doctor) => {
        setSelectedDoctor(doctor);
        const modal = new window.bootstrap.Modal(document.getElementById('doctorModal'));
        modal.show();
    };

    const decodeBase64Image = (base64String) => {
        return `data:image/png;base64,${base64String}`;
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctorsApi();
                console.log(response); 
                if (response) {
                    setDoctors(response);
                } else {
                }
            } catch (error) {
            }
        };
        fetchDoctors();
    }, []);
  
    return (
        <>
            <Header />
            <section className="breadcrumb_part breadcrumb_bg doctorStartingPart">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb_iner">
                                <div className="breadcrumb_iner_item">
                                    <h2>doctors</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="doctors" className="doctors">
                <div className="container">
                    <div className="section-title">
                        <h2>Doctors</h2>
                        <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                    </div>
                    {doctors && doctors.length > 0 ? (
                        <div className="row">
                            {doctors.map((doctor, index) => (
                                <div className="col-lg-6 mt-4" key={index}>
                                    <div className="member d-flex align-items-start" style={{ height: "200px" }}>
                                        <img
                                            src={decodeBase64Image(doctor.doctorImageData)}
                                            className="img-fluid"
                                            alt={doctor.name}
                                            style={{ objectFit: "cover", height: "100%" }}
                                        />
                                        <div className="member-info" style={{ flex: 1 }}>
                                            <h4>{doctor.name}</h4>
                                            <span className="specialties-label">Specialties: {doctor.specialities}</span>

                                            <p className="specialties-label">Designation: {doctor.designation}</p>
                                           
                                            <div><button onClick={() => handleReadMoreClick(doctor)} className='text-center ReadMoreButton mt-2'>Read more</button></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </section>
            <div className="modal" id="doctorModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            {selectedDoctor && (
                                <>
                                    <div className=" mt-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        <div className=" d-flex">
                                            <img
                                                src={decodeBase64Image(selectedDoctor.doctorImageData)}
                                                className="img-fluid-modal"
                                                alt={selectedDoctor.name}
                                            />
                                            <div style={{ padding: '50px', marginTop: '-40px' }}>
                                                <h4 style={{ color: '#2c4964', fontWeight: 'bold' }}>{selectedDoctor.name}</h4>
                                                <span className="docInfoModalLabel"><b>Department: </b> </span> {selectedDoctor.department} <br /><br />
                                                <span className="docInfoModalLabel"><b>Qualification:</b> </span> {selectedDoctor.qualification}<br /><br />

                                                <span className="docInfoModalLabel"><b>OPD Timing</b></span> <br />
                                                <span> ☀️ Morning Time: -</span> <br /> <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {selectedDoctor.morningTiming} </span> <br />
                                                <span> ⛅ Evening Time: -</span> <br /> <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedDoctor.eveningTiming} </span> <br />

                                            </div>
                                        </div>
                                        Dr. Alok Ranjan has More than 20 years of experience.
                                        Sr. Consultant Interventional Cardiologist, Surat.
                                        Consultant cardiologist in different hospitals in Ahmedabad, India
                                        Assist. Prof. In Cardiology in V S General Hospital, Ahmedabad.
                                        Fellow in cardiology in United Kingdom (UK)
                                        Worked as Cardiologist in Jaslok Hospital, Mumbai, India
                                        Experience in Detail
                                        Dr. Alok Ranjan has Catheterization Experience More than 35000 cardiac procedure as on January 2017

                                        Dr. Alok Ranjan has More than 20 years of experience.
                                        Sr. Consultant Interventional Cardiologist, Surat.
                                        Consultant cardiologist in different hospitals in Ahmedabad, India
                                        Assist. Prof. In Cardiology in V S General Hospital, Ahmedabad.
                                        Fellow in cardiology in United Kingdom (UK)
                                        Worked as Cardiologist in Jaslok Hospital, Mumbai, India
                                        Experience in Detail
                                        Dr. Alok Ranjan has Catheterization Experience More than 35000 cardiac procedure as on January 2017

                                        Dr. Alok Ranjan has More than 20 years of experience.
                                        Sr. Consultant Interventional Cardiologist, Surat.
                                        Consultant cardiologist in different hospitals in Ahmedabad, India
                                        Assist. Prof. In Cardiology in V S General Hospital, Ahmedabad.
                                        Fellow in cardiology in United Kingdom (UK)
                                        Worked as Cardiologist in Jaslok Hospital, Mumbai, India
                                        Experience in Detail
                                        Dr. Alok Ranjan has Catheterization Experience More than 35000 cardiac procedure as on January 2017

                                        Dr. Alok Ranjan has More than 20 years of experience.
                                        Sr. Consultant Interventional Cardiologist, Surat.
                                        Consultant cardiologist in different hospitals in Ahmedabad, India
                                        Assist. Prof. In Cardiology in V S General Hospital, Ahmedabad.
                                        Fellow in cardiology in United Kingdom (UK)
                                        Worked as Cardiologist in Jaslok Hospital, Mumbai, India
                                        Experience in Detail
                                        Dr. Alok Ranjan has Catheterization Experience More than 35000 cardiac procedure as on January 2017
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}