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
  const navigate = useNavigate();

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
            <h2>User Information</h2>
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
          <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </CSSTransition>
  );
}

export default UserView;