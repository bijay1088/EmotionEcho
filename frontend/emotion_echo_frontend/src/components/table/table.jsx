import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import Error from '../error/error';
import './table.css';

const EmotionTable = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const itemsPerPage = 15; // Number of rows per page

  // Fetch data from the API
  useEffect(() => {
    const token = localStorage.getItem('token');

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
    }
  }, []);

  // Handle sorting
  const sortedData = [...emotionData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Calculate the data to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(emotionData.length / itemsPerPage);

  // Handle column header click for sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      {error ? (
        <Error />
      ) : (
        <>
          <Table responsive bordered hover>
            <thead>
              <tr className='hover'>
                <th onClick={() => requestSort('id')}>#</th>
                <th onClick={() => requestSort('emotion')}>Emotion</th>
                <th onClick={() => requestSort('date')}>Date</th>
                <th onClick={() => requestSort('time')}>Time</th>
                <th onClick={() => requestSort('confidence')}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((emotion, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{emotion.emotion}</td>
                    <td>{new Date(emotion.date).toLocaleDateString()}</td>
                    <td>{emotion.time.split('+')[0]}</td>
                    <td>{(emotion.confidence * 100).toFixed(2) + '%'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No emotions found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage => Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => setCurrentPage(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage => Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default EmotionTable;
