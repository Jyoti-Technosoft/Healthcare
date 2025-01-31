import React, { useEffect, useState } from 'react'; 
import { getAllUsers } from '../Api';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [receptionist, setReceptionist] = useState([]);
    const [doctor,setDoctor] = useState([]);
    const token = Cookies.get('authToken');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllUsers(token);
                const receptionistCount = response.filter(user => user.role === 'Receptionist');
                const doctorCount = response.filter(user => user.role === 'Doctor');
                setUsers(response); 
                setReceptionist(receptionistCount);
                setDoctor(doctorCount);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [token]);
    const todayUsersCount = () =>{
        const today = new Date().toISOString().slice(0, 10);
        return users.filter(user => user.createdTime === today).length;
    }
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center ">
                <div className="container ">
                    <div className="row row-cols-1 row-cols-md-4">
                        <div className="col mb-4">
                            <div className="card   rounded border-0 justify-content-center" style={{height:'185px'}}>
                                <div className="card-body p-4">
                                    <h1 className='text-center'>{users.length}</h1>
                                    <p className='text-center'>Total Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4">
                            <div className="card   rounded border-0 justify-content-center" style={{height:'185px'}}>
                                <div className="card-body p-4">
                                    <h1 className='text-center'>{todayUsersCount()}</h1>
                                    <p className='text-center'>Today's Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4">
                            <div className="card   rounded border-0 justify-content-center" style={{height:'185px'}} >
                                <div className="card-body p-4">
                                    <h1 className='text-center'>{receptionist.length}</h1>
                                    <p className='text-center'>Total Receptionist</p>
                                </div>
                            </div>
                        </div>
                        <div className="col mb-4">
                            <div className="card   rounded border-0 justify-content-center" style={{height:'185px'}}>
                                <div className="card-body p-4">
                                    <h1 className='text-center'>{doctor.length}</h1>
                                    <p className='text-center'>Total Doctor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
