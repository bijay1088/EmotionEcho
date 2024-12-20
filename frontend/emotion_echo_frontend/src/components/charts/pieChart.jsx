import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import axios from 'axios';
import Error from '../error/error';


const pieChart = () => {

  const [emotionData, setEmotionData] = useState([]);
  const [emotionDataToday, setEmotionDataToday] = useState([]);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch data from the API
  useEffect(() => {
    const token = localStorage.getItem('token');
    const date = new Date();

    if (token) {
      axios
        .post('http://localhost:3001/getEmotions', { token })
        .then((response) => {
          if (response.data.success) {
            setEmotionData(response.data.emotions);
          } else {
            setError(true);
          }
        })
        .catch((err) => {
          console.error('Error verifying token:', err);
          setError(true);
        });

      axios
        .post('http://localhost:3001/getEmotions', { token, date })
        .then((response) => {
          if (response.data.success) {
            setEmotionDataToday(response.data.emotions);
          } else {
            setError(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching today\'s emotions:', err);
          setError(true);
        });
    }
  }, []);


  return (
    <div>pieChart</div>
  )
}

export default pieChart