import React, { useState } from 'react'
import axios from 'axios';
import './profile.css'


const profile = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    const organisation = localStorage.getItem('organisation');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!oldPassword || !newPassword){
            setError("Input all fields.")
            
        }else{
            const token = localStorage.getItem('token');
            try {
            // Send login request to the Node.js server
            const response = await axios.post('http://localhost:3001/changePassword', {
                token,
                oldPassword,
                newPassword,
            });
            console.log(response);

            if (response.data.success) {
                setSuccess('Changed Successfully.');
                setError('');
            } else {
                setSuccess('');
                setError(response.data.error || 'Something went wrong');
            }
            } catch (err) {
                setSuccess('');

                if (err.response) {
                    setError(err.response.data.error || 'Something went wrong');
                } else if (err.request) {
                    setError('No response from server. Please try again later.');
                } else {
                    setError('An unexpected error occurred.');
                }

                console.error('Change password failed:', err);
            }

        }
        
      };



    return (
        <div className='d-flex'>

            <div className='profile_box m-5'>
                <div className="text-center fs-4 m-2">Profile</div>
                <p className='mt-4 me-3 ms-3 fs-5'>ID: {id}</p>
                <p className='mt-2 me-3 ms-3 fs-5'>Name: {name}</p>
                <p className='mt-2 me-3 ms-3 fs-5'>Username: {username}</p>
                <p className='mt-2 me-3 ms-3 fs-5'>Organisation: {organisation}</p>
                <p className='mt-2 me-3 ms-3 fs-5'>Role: {role}</p>
            </div>


            <div className='password_box m-5'>
            <div className="text-center fs-4">Change Password</div>
            <form className="p-3" onSubmit={handleSubmit}>
                <div className="form-field align-items-center m-5">
                    <input
                        type="password"
                        className="form-control m-2"
                        placeholder="old password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="form-field align-items-center m-5">
                    <input
                        type="password"
                        className="form-control m-2"
                        placeholder="new password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="password_field align-items-center">
                    <button type="submit" className="btn btn-primary">Change Password</button>
                </div>
            
            </form>
                {success && <div className="success alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

            </div>
            

        </div>
        
    )
}

export default profile