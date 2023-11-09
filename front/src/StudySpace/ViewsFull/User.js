import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import './ViewsFull.css'
import { CSSTransition } from 'react-transition-group';
import { api } from '../../Helper';

function UserView({
  visible,
  setVisible,
  user,
}) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [qoute, setQoute] = useState('');
  const navigate = useNavigate();

  const qoutes = [
    "“The secret of getting ahead is getting started.”",
    "“One day, all your hard work will pay off.”",
    "“The earlier you start working on something, the earlier you will see results.”",
    "“Life is short. Live it. Fear is natural. Face it. Memory is powerful. Use it.”",
    "“Do what is right, not what is easy.”",
    "“We generate fears while we do nothing. We overcome these fears by taking action.”",
    "“If we wait until we’re ready, we’ll be waiting for the rest of our lives.”",
    "“It’s never too late to be what you might have been.”",
    "“You don’t have to be great to start. But you have to start to be great.”",
    "“Every morning you have two choices: continue to sleep with your dreams, or wake up and chase them.”",
    "“Nobody can go back and start a new beginning, but anyone can start today and make a new ending.”"
  ];

  useEffect(() => {
    if (visible) {
      setQoute(qoutes[Math.floor(Math.random() * qoutes.length)]);
    }
  // eslint-disable-next-line
  }, [visible]);

  useEffect(() => {
    api.get('/stats', { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setStatistics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && mounted) {
        setVisible(false);
      } else {
        setMounted(true);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef, setVisible, mounted]);

  const handleLogoutClick = (event) => {
    event.preventDefault();

    api.post('/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('../space');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (user == null) {
    return null;
  }

  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="alert"
      unmountOnExit
      onEntering={() => { setMounted(false); }}
    >
      <div className="user-view">
        <div className="user-container" ref={containerRef}>
          <div className="user-information">
            <h1>User Information</h1>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
          </div>
          {statistics && (
            <div className="user-statistics">
              <h1>Statistics</h1>
              <div>
                <strong>Tasks Completed:</strong> {statistics.tasksCompleted}
              </div>
              <div>
                <strong>Notes Downloaded:</strong> {statistics.notesDownloaded}
              </div>
              <div>
                <strong>Timers Finished:</strong> {statistics.timersFinished}
              </div>
            </div>
          )}
          <div className="random-qoute">
            <i>{qoute}</i>
          </div>
          <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </CSSTransition>
  );
}

export default UserView;