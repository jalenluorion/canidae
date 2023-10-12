import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link, useParams, useLocation } from 'react-router-dom';
import StudySpace from './StudySpace/Space';
import LoginView from './StudySpace/ViewsFull/Login';
import { options, views } from './Data';
import axios from 'axios';

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
            
            <Route path=":userId" element={<UserRoute />} />
        </Routes>
    );
}

function GuestRoute() {
    const [userId, setUserId] = useState(null);
    const { state } = useLocation();

    useEffect(() => {
        const api = axios.create({
            baseURL: 'http://localhost:3001'
        });

        api.get('/user', { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setUserId(response.data._id);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [state]);
    
    if (userId !== null) {
        return <Navigate to={`${userId}`} replace />;
    }

    return <StudySpace loggedIn={false} options={options} views={views}/>;
}

function UserRoute() {
    let { userId } = useParams();
    const [loggedIn, setLoggedIn] = useState(true);

    useEffect(() => {
        const api = axios.create({
            baseURL: 'http://localhost:3001'
        });

        api.get('/verify?id=' + userId, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setLoggedIn(true);
                }
            })
            .catch((error) => {
                console.error(error);
                setLoggedIn(false);
            });
    }, [userId]);

    if (!loggedIn) {
        return <Navigate to=".." replace />;
    }

    return <StudySpace loggedIn={true} options={options} views={views}/>;
};

export default App;
