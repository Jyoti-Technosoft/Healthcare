import React, { useEffect, useState } from 'react'; 

import DataTable from 'react-data-table-component';
import { getAllUsers } from '../Api';
import { useSelector, useDispatch } from 'react-redux';
import {
    setActiveTab,
} from '../../actions/submenuActions';
import Cookies from 'js-cookie';
export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('authToken');
    const activeTab = useSelector((state) => state.submenu.activeTab);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllUsers(token);
                setUsers(response); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
        fetchData();
         // eslint-disable-next-line
    }, []);
    const setMenu = (submenu) => {
        if(activeTab==='usersList'){
            dispatch(setActiveTab(submenu));
        }
    };

    const columns = [
        { name: 'Index', selector: (row, index) => index + 1, sortable: true },
        { name: 'User Id', selector: (row) => row.id, sortable: true },
        { name: 'Email', selector: (row) => row.email, sortable: true },
        { name: 'Role', selector: (row) => row.role, sortable: true },
    ];
    return (
        <div className='background_part mt-3'>
            <div className="container ">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="row">
                            <div className="col mb-3">
                                <div className="card border-0 mb-3 shadow  bg-white rounded">
                                    <div className="card-body">
                                        <div className="row">
                                            <>
                                                <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                                                <h6> {users.length} Users</h6>
                                                    <button type="submit" className={`btn btn-primary float-end ${activeTab === 'registerPatient' ? '' : ''}`} style={{ backgroundColor: '#1977cc' }} onClick={() => setMenu('registerUsers')}><i className="bi bi-plus" style={{ color: 'white' }}></i>Add</button>
                                                </div>
                                                <hr style={{ color: 'grey' }} />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="fw-normal text-secondary fs-4 mb-4 mt-4"><b className='contentHeadings' style={{ color: 'black' }}>Users List</b></h3>
                                                    <input type="text" className='form-control input-field w-25' placeholder="Search..."  />
                                                </div>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    <DataTable
                                                        className="users-table"
                                                        columns={columns}
                                                        data={users}
                                                        pagination
                                                        highlightOnHover
                                                        noDataComponent="No users found"
                                                    />

                                                )}
                                            </>
                                        </div>
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
