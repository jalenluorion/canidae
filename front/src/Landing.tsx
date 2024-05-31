import React, { useEffect, useState } from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import { EmojiRain } from './StudySpace/Components/Particles';

function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a delay to ensure the transition effect is triggered
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className={`landing-app ${isLoaded ? 'loaded' : ''}`}>
      <EmojiRain />
      <div className={`landing-content ${isLoaded ? 'loaded' : ''}`}>
        <h1 className="landing-title">Welcome to Studace</h1>
        <p className="landing-description">Virtual study rooms with practical tools for the modern digital student</p>
        <Link to="space"><button className="open-button">Enter Studace</button></Link>
      </div>
    </div>
  );
}

export default Landing;