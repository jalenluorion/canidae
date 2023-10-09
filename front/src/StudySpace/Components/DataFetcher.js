import React from 'react';
// Dummy asynchronous function that simulates data fetching
const fetchData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(<h2>Data Fetcher</h2>);
      }, 2000); // Simulate a 2-second delay
    });
  };
  

  export default fetchData;