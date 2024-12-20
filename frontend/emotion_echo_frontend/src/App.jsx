import React, { useState, useEffect } from 'react';
import Login from './components/login/login';
import LineChart from './components/charts/lineChart';
import Dashboard from './components/dashboard/dashboard'
import Navbar from './components/navbar/navbar'
import axios from 'axios';
import './index.css'
import { Nav } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .post('http://localhost:3001/verify-token', { token })
        .then((response) => {
          if (response.data.success) {
            setIsLoggedIn(true); 
          } else {
            setIsLoggedIn(false); 
          }
        })
        .catch((err) => {
          console.error('Error verifying token:', err);
          setIsLoggedIn(false);
        });
    }
  }, []);

  return (
    <div>
      {
        isLoggedIn ?
          <>
            <Navbar/>
            <Dashboard /> 
          </>
          
          : 
          <Login />
       }
    </div>
  );
}

export default App;
