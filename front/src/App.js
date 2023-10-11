import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link } from 'react-router-dom';
import StudySpace from './StudySpace/Space';
import LoginView from './StudySpace/ViewsTop/Login';
import { options, views } from './Data';
import axios from 'axios';

const checkIfUserIsLoggedIn = () => {
    const api = axios.create({
        baseURL: 'http://localhost:3001'
    });
    
    try {
        const response = api.get('/user', { withCredentials: true })
        if (response.status === 200) {
            return response.data._id;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
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
    const userID = checkIfUserIsLoggedIn();
    if (userID !== false) {
      return <Navigate to={`${userID}`} replace />;
    }
  
    return <StudySpace loggedIn={false} options={options} views={views}/>;
}

function UserRoute() {
    const userID = checkIfUserIsLoggedIn();
    if (userID === false) {
      return <Navigate to=".." replace />;
    }
  
    return <StudySpace loggedIn={true} options={options} views={views}/>;
};

export default App;
