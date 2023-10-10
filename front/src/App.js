import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link } from 'react-router-dom';
import StudySpace from './StudySpace/Space';
import LoginView from './StudySpace/ViewsTop/Login';
import { options, views } from './Data';
import Cookies from "universal-cookie";

function checkIfUserIsLoggedIn() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        console.log("User is logged in")
        return true;
    }
    console.log("User is not logged in")
    return false;
}

function App() {
    // Assuming you have a function to check if the user is logged in

    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexPage /> } />
                <Route path="space/*" element={<SpacePage /> } />
            </Routes>
        </Router>
    );
}

function IndexPage() {
    return (
        <div>
            <h1>Welcome to Canidae!</h1>
            <Link to="space">Open Canidae</Link>
        </div>
    );
}

function SpacePage() {
    return (
        <Routes>
            <Route path="/" element={<GuestRoute />} >
                <Route path="login" element={<LoginView />} />
            </Route>
            
            <Route path=":userID" element={<UserRoute />} />
        </Routes>
    );
}

function GuestRoute() {
    if (checkIfUserIsLoggedIn()) {
      return <Navigate to=":userID" replace />;
    }
  
    return <StudySpace loggedIn={false} options={options} views={views}/>;
}

function UserRoute() {
    if (!checkIfUserIsLoggedIn()) {
      return <Navigate to=".." replace />;
    }
  
    return <StudySpace loggedIn={true} options={options} views={views}/>;
};

export default App;
