import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { getDoctorsApi } from '../Api';
import Pagination from 'react-bootstrap/Pagination';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [isGridView, setIsGridView] = useState(false); // Set default view mode to list view
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeIcon, setActiveIcon] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8); // Number of doctors per page

  useEffect(() => {
    // Fetch doctors data from API
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        console.log(response); // Log the entire response for debugging
        if (response) {
          setDoctors(response);
          setFilteredDoctors(response);
        } else {
          console.error('Empty response from the API');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();

    setIsGridView(false);
    setActiveIcon(false);
  }, []);

  const decodeBase64Image = (base64String) => {
    return `data:image/png;base64,${base64String}`;
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredData = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(keyword) ||
      doctor.user.email.toLowerCase().includes(keyword) ||
      doctor.contact.toLowerCase().includes(keyword) ||
      doctor.gender.toLowerCase().includes(keyword) ||
      doctor.address.toLowerCase().includes(keyword) ||
      doctor.specialities.toLowerCase().includes(keyword) ||
      doctor.department.toLowerCase().includes(keyword)
    );
    setFilteredDoctors(filteredData);
  };

  const handleIconClick = (viewMode) => {
    setIsGridView(viewMode);
    setActiveIcon(viewMode);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / rowsPerPage);
  const indexOfLastDoctor = page * rowsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - rowsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const columns = [
    { name: 'ID', selector: (row) => row.id, sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true, minWidth: '170px' },
    { name: 'Email', selector: (row) => row.user.email, sortable: true, minWidth: '200px' },
    { name: 'Contact', selector: (row) => row.contact, sortable: true, minWidth: '150px' },
    { name: 'Gender', selector: (row) => row.gender, sortable: true },
    { name: 'Age', selector: (row) => row.age, sortable: true },
    { name: 'Address', selector: (row) => row.address, sortable: true, minWidth: '250px' },
    { name: 'Qualification', selector: (row) => row.qualification, sortable: true },
    { name: 'Designation', selector: (row) => row.designation, sortable: true },
    { name: 'Specialities', selector: (row) => row.specialities, sortable: true },
    { name: 'Department', selector: (row) => row.department, sortable: true, minWidth: '170px' },
    { name: 'Morning Timing', selector: (row) => row.morningTiming, sortable: true, minWidth: '170px' },
    { name: 'Evening Timing', selector: (row) => row.eveningTiming, sortable: true, minWidth: '170px' },
    { name: 'Visiting days', selector: (row) => row.visitingDays, sortable: true, minWidth: '300px' },
  ];

  const handleReadMoreClick = (doctor) => {
    setSelectedDoctor(doctor);
    // Show the modal using Bootstrap's modal API
    const modal = new window.bootstrap.Modal(document.getElementById('doctorModal'));
    modal.show();
  };

  return (
    <>
      <div className='background_part mt-3 doctors'>
        <div className="container ">
          <div className="row flex-lg-nowrap">
            <div className="col">
              <div className="row">
                <div className="col mb-3">
                  <div className="card border-0 mb-3 shadow  bg-white rounded">
                    <div className="card-body">
                      <div className="">
                        <h6> {doctors.length} Doctors</h6>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <input type="text" className='form-control input-field searchDoctor' placeholder="Search..." onChange={handleSearch} />
                          <div className="btn-group border-0  rounded " role="group">
                            <button
                              className={`btn btn-link border-0 ${activeIcon === false ? 'activeIcon' : ''}`}
                              onClick={() => handleIconClick(false)}
                              style={{borderColor:'white'}}
                            >
                              <i className="bi bi-list-task"></i>
                            </button>
                            <div className="vertical-line "></div>
                            <button
                              className={`btn btn-link border-0 ${activeIcon === true ? 'activeIcon' : ''}`}
                              onClick={() => handleIconClick(true)}
                              style={{borderColor:'white'}}
                            >
                              <i className="bi bi-grid-1x2"></i>
                            </button>
                          </div>
                        </div>
                        {isGridView ? (
                          <>
                            <div className="row contact">
                              {currentDoctors.map((doctor, index) => (
                                <div className="col-lg-6 mt-4" key={index}>
                                  <div className="member d-flex align-items-start" style={{ height: "200px" }}>
                                    <img
                                      src={decodeBase64Image(doctor.doctorImageData)}
                                      className="img-fluid"
                                      alt={doctor.name}
                                      style={{ objectFit: "cover", height: "80%" }}
                                    /> 
                                    <div className="member-info" style={{ flex: 1 }}>
                                      <h4>{doctor.name}</h4>
                                      <span className="specialties-label">Specialties: {doctor.specialities}</span>
                                      {/* <p className="specialties-label">Designation: {doctor.designation}</p> */}
                                      <div className=''><button onClick={() => handleReadMoreClick(doctor)} className='read-more  mt-3'>Read more</button></div>

                                    </div>

                                  </div>
                                </div> 
                              ))}
                            </div>
                            <hr />
                            <div className="mt-4 d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <span className="me-2">Rows per page: </span>
                                <select className="form-select rowPerPage input-field" value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="30">30</option>
                                </select>
                              </div>
                              <Pagination className="custom-pagination">
                                <Pagination.First onClick={() => handlePageChange(1)} />
                                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                  </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                              </Pagination>
                            </div>

                          </>
                        ) : (
                          <>
                            <DataTable
                              columns={columns}
                              data={filteredDoctors}
                              keyField="id" // Assuming each doctor object has a unique "id" field

                              highlightOnHover
                              noHeader // Hide table header
                              className="border"
                            />
                            <hr />
                            <div className="mt-4 d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center row-Page">
                                <span className="me-2">Rows per page: </span>
                                <select className="form-select rowPerPage input-field" value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="30">30</option>
                                </select>
                              </div>
                              <Pagination className="custom-pagination">
                                <Pagination.First onClick={() => handlePageChange(1)} />
                                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                  </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                              </Pagination>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                      <div className='memberModal' style={{ padding: '50px', marginTop: '-40px' }}>
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
  );
}
