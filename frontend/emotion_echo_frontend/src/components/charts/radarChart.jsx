import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import axios from 'axios';
import Error from '../error/error';

// Import required Chart.js modules
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register modules
ChartJS.register(RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


//Show the current day data
const RadarChart = () => {
  const [emotionDataToday, setEmotionDataToday] = useState([]);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(true);
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

  // Process data and update chart data
  useEffect(() => {
    if (emotionDataToday.length > 0) {
      setNoData(false);
      // Count frequencies of today's emotions
      const emotionCountsToday = emotionDataToday.reduce((acc, curr) => {
        acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
        return acc;
      }, {});

      // Merge labels from both datasets
      const allLabels = Array.from(
        new Set([...Object.keys(emotionCountsToday)])
      );

      const todayData = allLabels.map((label) => emotionCountsToday[label] || 0);

      // Update chart data
      setChartData({
        labels: allLabels,
        datasets: [
          {
            label: 'Today\'s Emotion Counts',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: todayData,
          },
        ],
      });
    }else{
        setNoData(true);
    }
  }, [ emotionDataToday]);

  return (
    <CDBContainer>
      <h3 className="mt-4">Today's Emotion Count</h3>
      {error ? (
        <p>Error loading data. Please try again later.</p>
      ) : noData ? (
        <p className='mt-3'>No data available.</p>
      ) : (
        <Radar data={chartData} options={{ responsive: true }} />
      )}
    </CDBContainer>
);

};

export default RadarChart;
