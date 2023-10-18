// LoginPopup.js

import React, { useState } from 'react';
import './Playground.css';

const LoginPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login-popup-container">
      <button className="login-button" onClick={togglePopup}>
        Login
      </button>

      {showPopup && (
        <div className="login-container">
          <h1 className="login-title">Welcome Back!</h1>

          <form className="login-form">
            <div className="login-split">
              <div className="login-split-column">
                <label className="login-label" htmlFor="username">First Name</label>
                <input className="login-input" type="text" id="username" />
              </div>
              <div className="login-split-column">
                <label className="login-label" htmlFor="username">Last Name</label>
                <input className="login-input" type="text" id="username" />
              </div>
            </div>
            <label className="login-label" htmlFor="username">Username</label>
            <input className="login-input" type="text" id="username" />
            <label className="login-label" htmlFor="password">Password</label>
            <input className="login-input" type="password" id="password" />
            <label className="login-label">
              <input
                type="checkbox"
                onChange={handleRememberMeChange}
              />
              Remember Me
            </label>
            <button type="submit">Sign In</button>
          </form>
          <div className="login-swap"><p>Don't have an account?&nbsp;</p><a>Sign Up</a></div>
          <div className="login-error">User not Found!</div>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;
