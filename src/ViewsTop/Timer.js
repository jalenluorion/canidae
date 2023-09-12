import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';
import './ViewsTop.css';

const TimerView = () => {
  const [time, setTime] = useState(1500); // Initial time in seconds (25 minutes)
  const [timerLabel, setTimerLabel] = useState('Study');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('25');
  const [seconds, setSeconds] = useState('00');

  const menuRef = useRef(null);

  useEffect(() => {
    let interval;

    if (!isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPaused && time !== 0) {
      clearInterval(interval);
    }

    // Clear the interval when the timer reaches zero
    if (!isPaused && time === 0) {
      clearInterval(interval);
      setIsActive(false);
      setIsPaused(true);
      setTimeout(() => {
        alertUser();
      }, 100); // Delay the alert for 1 second after reaching zero
    }

    return () => clearInterval(interval);
  }, [isPaused, time]);

  useEffect(() => {
    document.body.addEventListener('click', handleDocumentClick);
    return () => {
      document.body.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // This function will close the menu if a click occurs outside of it
  const handleDocumentClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setTimePickerOpen(false);
    }
  };

  const alertUser = () => {
    alert("Your timer has finished!");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(1500); // Reset time to 25 minutes
    setTimerLabel('Study');
  };

  const toggleTimePicker = (e) => {
    e.stopPropagation();
    setTimePickerOpen(!isTimePickerOpen);
  };

  const updateTimePickerValue = () => {
    const newTotalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    setTime(newTotalSeconds);
    setTimePickerOpen(false);
  };

  const pauseResumeButtons = (
    <div className="btn-group">
      <button className="btn btn-pause" onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button className="btn btn-reset" onClick={resetTimer}>Reset</button>
    </div>
  );

  const startButton = (
    <button className="btn btn-start" onClick={startTimer}>
      Start
    </button>
  );

  return (
    <div className="container-top">
      <div className="top-bar">
        <div className="title">
          <h1>Study Timer</h1>
        </div>
        {isTimePickerOpen && (
          <div ref={menuRef} className="menu-dropdown-top red-accent">
            <div className="time-picker">
              <input type="number" min="0" max="99" placeholder="hh" value={hours} onChange={(e) => setHours(e.target.value)} />
              <input type="number" min="0" max="59" placeholder="mm" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
              <input type="number" min="0" max="59" placeholder="ss" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
              <button onClick={updateTimePickerValue}>Set</button>
            </div>
          </div>
        )}
      </div>
      <div className="timer-body">
        <div className="timer-display" onClick={toggleTimePicker}>
          {formatTime(time)}
        </div>
        <div className="button-container">
          {isActive ? pauseResumeButtons : startButton}
        </div>
        <div className="timer-label">
          <button className={`btn ${timerLabel === 'Study' ? 'btn-active' : ''}`} onClick={() => setTimerLabel('Study')}>
            Study
          </button>
          <button className={`btn ${timerLabel === 'Rest' ? 'btn-active' : ''}`} onClick={() => setTimerLabel('Rest')}>
            Rest
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerView;
