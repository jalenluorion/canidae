import React, { useState, useEffect } from 'react';
import './Timer.css';
import './ViewsTop.css';
import TimePicker from 'react-time-picker'; // Import react-time-picker
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const TimerView = () => {
  const [time, setTime] = useState(1500); // Initial time in seconds (25 minutes)
  const [timerLabel, setTimerLabel] = useState('Study');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false); // State to control time picker modal

  useEffect(() => {
    let interval;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive && time === 0) {
      setTime(1500); // Reset time to 25 minutes when starting after completion
    }
    setIsActive(!isActive);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(1500); // Reset time to 25 minutes
    setTimerLabel('Study');
  };

  const toggleTimePicker = () => {
    setTimePickerOpen(!isTimePickerOpen);
  };

  const closeTimePicker = () => {
    setTimePickerOpen(false);
  };

  const updateTimePickerValue = (newTime) => {
    // Convert the selected time from the time picker to seconds and update the state
    const [hours, minutes] = newTime.split(':');
    const newSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    setTime(newSeconds);
    closeTimePicker();
  };

  const startButton = (
    <button className={`btn ${isActive ? 'btn-pause' : 'btn-start'}`} onClick={toggleTimer}>
      {isActive ? 'Pause' : 'Start'}
    </button>
  );

  const pauseResumeButtons = (
    <div className="btn-group">
      <button className="btn btn-pause" onClick={pauseTimer}>Pause</button>
      <button className="btn btn-reset" onClick={resetTimer}>Reset</button>
    </div>
  );

  return (
    <div className="container-top">
      <div className="top-bar">
        <div className="title">
          <h1>Study Timer</h1>
        </div>
        {isTimePickerOpen && (
        <div className="menu-dropdown-top red-accent">
          <TimePicker
            onChange={updateTimePickerValue}
            value={formatTime(time / 60)}
            clockIcon={null} // Disable the clock icon
            maxDetail="minute" // Limit the view to hours and minutes
            clearIcon={null}
            format="HH:mm" // Display hours and minutes in 24-hour format
            hourPlaceholder="hh"
            minutePlaceholder="mm"
            showLeadingZeros={true}
            disableClock={true} // Disable the clock view
            isOpen={true}
          />
        </div>
      )}
      </div>
      <div className="timer-body">
        <div className="timer-display" onClick={toggleTimePicker}>
          {formatTime(time)}
        </div>
        <div className="button-container">
          {isActive || isPaused ? pauseResumeButtons : startButton}
        </div>
        <div className="timer-label">
          <button className={`btn ${timerLabel === 'Study' ? 'btn-active' : ''}`} onClick={() => setTimerLabel('Study')}>Study</button>
          <button className={`btn ${timerLabel === 'Rest' ? 'btn-active' : ''}`} onClick={() => setTimerLabel('Rest')}>Rest</button>
          {/* Add custom label functionality */}
        </div>
      </div>
    </div>
  );
};

export default TimerView;
