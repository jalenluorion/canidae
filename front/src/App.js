import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
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
                <Route path="/" element={
                    <DefaultRoute /> }>
                    <Route path="login" element={<LoginView />} />
                </Route>
                <Route path="users/:userID" element={
                    <ProtectedRoute /> }
                />
            </Routes>
        </Router>
    );
}

function ProtectedRoute() {
    if (!checkIfUserIsLoggedIn()) {
      return <Navigate to="/" replace />;
    }
  
    return <StudySpace loggedIn={true} options={options} views={views}/>;
};

function DefaultRoute() {
    if (checkIfUserIsLoggedIn()) {
      return <Navigate to="users/:userID" replace />;
    }
  
    return <StudySpace loggedIn={false} options={options} views={views}/>;
}

export default App;
