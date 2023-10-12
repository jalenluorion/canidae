import React, { Suspense } from 'react';

const fetchShows = React.lazy(() => import("./DataFetcher"));

function App() {
  const bruh = fetchShows();
 return (
   <div className="App">
     <header className="App-header">
       <h1 className="App-title">React Suspense Demo</h1>
     </header>
     <Suspense fallback={<p>loading...</p>}>
     {bruh.read()}
     </Suspense>
   </div>
 );
}

export default App;