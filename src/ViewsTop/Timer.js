import React, { useState, useEffect } from 'react';
import './Timer.css';
import './ViewsTop.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const TimerView = () => {
  const [time, setTime] = useState(1500); // Initial time in seconds (25 minutes)
  const [timerLabel, setTimerLabel] = useState('Study');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);

  useEffect(() => {
    let interval;

    if (!isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPaused && time !== 0) {
      clearInterval(interval);
      sendNotification();
    }

    return () => clearInterval(interval);
  }, [isPaused, time]);

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

  const toggleTimePicker = () => {
    setTimePickerOpen(!isTimePickerOpen);
  };

  const updateTimePickerValue = (newTime) => {
    const [hours, minutes] = newTime.split(':');
    const newSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    setTime(newSeconds);
    setTimePickerOpen(false);
  };

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Timer Ended', { body: 'Your timer has ended.' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('Timer Ended', { body: 'Your timer has ended.' });
        }
      });
    }
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
          <div className="menu-dropdown-top red-accent">
            <TimePicker
              onChange={updateTimePickerValue}
              value={formatTime(time / 60)}
              clockIcon={null}
              maxDetail="minute"
              clearIcon={null}
              format="HH:mm:ss"
              hourPlaceholder="hh"
              minutePlaceholder="mm"
              showLeadingZeros={true}
              disableClock={true}
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
