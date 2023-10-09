import React, { Suspense, lazy, useEffect } from 'react';

import fetchData from './DataFetcher';

// Lazy load DataFetcher component
const LazyDataFetcher = lazy(() => fetchData());


// Main App component
function App() {

    useEffect(() => {
        console.log(LazyDataFetcher);
    }, []);

  return (
    <div className="App">
      <h1>Suspense Demo</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyDataFetcher />
      </Suspense>
    </div>
  );
}

export default App;
