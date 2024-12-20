import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import axios from 'axios';

// Import required Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


//THIS CHART IS ONLY FOR THIS MONTH DATA
const BarChart = () => {
  const [emotionDataMonth, setemotionDataMonth] = useState([]);
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
    const month = new Date();

    if (token) {

      axios
        .post('http://localhost:3001/getEmotions', { token, date, month })
        .then((response) => {
          if (response.data.success) {
            setemotionDataMonth(response.data.emotions);
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
    if (emotionDataMonth.length > 0 ) {
      setNoData(false);
      // Count frequencies of all-time emotions
      const emotionCountsMonth = emotionDataMonth.reduce((acc, curr) => {
        acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
        return acc;
      }, {});


      // Merge labels from both datasets
      const allLabels = Array.from(
        new Set([...Object.keys(emotionCountsMonth)])
      );

      // Generate data arrays
      const allTimeData = allLabels.map((label) => emotionCountsMonth[label] || 0);

      // Update chart data
      setChartData({
        labels: allLabels,
        datasets: [
          {
            label: 'This Month Emotion Counts',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: allTimeData,
          },
        ],
      });
    }else{
      setNoData(true);
    }
  }, [emotionDataMonth]);

  return (
    <CDBContainer>
      <h3 className="mt-4">This Month Emotion Count</h3>
      {error ? (
        <p>Error loading data. Please try again later.</p>
      ) : noData ? (
        <p className='mt-3'>No data available.</p>
      ) : (
        <Bar data={chartData} options={{ responsive: true }} />
      )}
    </CDBContainer>
  );
};

export default BarChart;
