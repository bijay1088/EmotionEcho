import React, { useState } from 'react';
import './login.css';
import Error from '../error/error'
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the Node.js server
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      if (response.data.success) {
        // Save token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('role', response.data.role);

        setError('');
        window.location.reload();

        
      } else {
        setError(response.data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className='login_wrapper'>
        <div className="login_container">
        <div className="text-center mt-4 mb-3 fs-3 title_name">Emotion Echo</div>
        <div className="text-center mt-4 mb-3 name">Login</div>
        <div className="container mt-3">
          <form className="p-3" onSubmit={handleSubmit}>
            <div className="form-field d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-field d-flex align-items-center">
              <input
                type="password"
                className="form-control"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-3">Login</button>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center fs-6 mt-3 forgot">
            <a >Forgot password? Contact your IT department.</a>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Login;
