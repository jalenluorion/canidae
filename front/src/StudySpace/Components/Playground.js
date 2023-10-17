// DataFetcher.js
import React from 'react';

const fetchData = () =>
  fetch('https://jsonplaceholder.typicode.com/posts/1').then(response =>
    response.json()
  );

const DataFetcher = () => {
  const data = fetchData();
  return <div>{data.title}</div>;
};

const DataFetcherWrapper = () => {
  const resource = fetchData();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
        <DataFetcher />
    </React.Suspense>
  );
};

export default DataFetcherWrapper;