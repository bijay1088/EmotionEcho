import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { CDBContainer } from 'cdbreact';
import axios from 'axios';
import Error from '../error/error';
// Import required Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//THIS CHART IS ONLY FOR OVERALL DATA

const LineChart = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [topEmotions, setTopEmotions] = useState({ first: null, second: null });

  // Fetch data from the API
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .post('http://localhost:3001/getEmotions', { token })
        .then((response) => {
          if (response.data.success) {
            setError(false);
            setEmotionData(response.data.emotions);
          } else {
            setError(true);
          }
        })
        .catch((err) => {
          console.error('Error verifying token:', err);
          setError(true);
        });
    }
  }, []);

  // Process data and update chart data
  useEffect(() => {
    if (emotionData.length > 0) {
      setNoData(false);

      // Count frequencies of all-time emotions
      const emotionCounts = emotionData.reduce((acc, curr) => {
        acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
        return acc;
      }, {});

      // Merge labels from both datasets
      const allLabels = Array.from(new Set([...Object.keys(emotionCounts)]));

      // Generate data arrays
      const allTimeData = allLabels.map((label) => emotionCounts[label] || 0);

      // Find the top two emotions
      const sortedEmotions = Object.entries(emotionCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const firstEmotion = sortedEmotions[0] ? sortedEmotions[0][0] : null;
      const secondEmotion = sortedEmotions[1] ? sortedEmotions[1][0] : null;

      setTopEmotions({ first: firstEmotion, second: secondEmotion });

      // Update chart data
      setChartData({
        labels: allLabels,
        datasets: [
          {
            label: 'All-Time Emotion Counts',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: allTimeData,
          },
        ],
      });
    } else {
      setNoData(true);
    }
  }, [emotionData]);

  return (
    <CDBContainer>
      <h3 className="mt-4">Overall Emotion Counts</h3>
      {error ? (
        <p>Error loading data. Please try again later.</p>
      ) : noData ? (
        <p className="mt-3">No data available.</p>
      ) : (
        <>
          <Line data={chartData} options={{ responsive: true }} />
          <div className="mt-4">
            {topEmotions.first && (
              <p>
                Most of the people are <strong>{topEmotions.first}</strong>
                {topEmotions.second && (
                  <>
                    , and some are <strong>{topEmotions.second}</strong>.
                  </>
                )}
              </p>
            )}
          </div>
        </>
      )}
    </CDBContainer>
  );
};

export default LineChart;
