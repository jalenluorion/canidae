import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import './ViewsFull.css'
import { CSSTransition } from 'react-transition-group';

function LoginView() {
  const containerRef = useRef(null);
  const location = useLocation();
  const [buttonClicked, setButtonClicked] = useState(location.state != null && location.state.button === true);
  const navigate = useNavigate();
  const [match, setMatch] = useState(!buttonClicked);
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (buttonClicked) {
      setMatch(true);
    }
  }, [buttonClicked]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && !buttonClicked) {

        if (match === true) {
          setMatch(false);
          setTimeout(() => {
            navigate('..');
          }, 200);
        }

      } else {
        setButtonClicked(false);
        window.history.replaceState({}, document.title)
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef, navigate, buttonClicked, match]);

  const api = axios.create({
    baseURL: 'http://localhost:3001'
  })

  const formDataToJson = (formData) => {
    const formDataJSON = {};
    formData.forEach((value, key) => {
      formDataJSON[key] = value;
    });
    return formDataJSON;
  };

  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    api.post('/login', formDataToJson(formData), { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('..');
          }, 2000);
        } else {
          if (response.data && response.data.message) {
            setMessage(response.data.message);
          } else {
            setMessage('Error logging in. Please try again later.');
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
          setMessage(error.response.data.message);
        } else {
          setMessage('Error logging in. Please try again later.');
          console.error(error);
        }
      });
  }

  const handleRegisterFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    api.post('/register', formDataToJson(formData), { withCredentials: true })
      .then((response) => {
        if (response.status === 201) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('..');
          }, 2000);
        } else {
          if (response.data && response.data.message) {
            setMessage(response.data.message);
          } else {
            setMessage('Error registering. Please try again later.');
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
          setMessage(error.response.data.message);
        } else {
          setMessage('Error registering. Please try again later.');
          console.error(error);
        }
      });
  }

  return (
    <CSSTransition
      in={match}
      timeout={200}
      classNames="alert"
      unmountOnExit
    >
      <div className="login-view">
        <div className="login-container" ref={containerRef}>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>Toggle Login/Register</button>
          {isLogin ? (
            <form onSubmit={handleLoginFormSubmit} className="loginform">
              <label>
                Username:
                <input type="text" name="username" />
              </label>
              <label>
                Password:
                <input type="password" name="password" />
              </label>
              <button type="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleRegisterFormSubmit} className="loginform">
              <label>
                Name:
                <input type="text" name="name" />
              </label>
              <label>
                Username:
                <input type="text" name="username" />
              </label>
              <label>
                Email:
                <input type="email" name="email" />
              </label>
              <label>
                Password:
                <input type="password" name="password" />
              </label>
              <button type="submit">Register</button>
            </form>
          )}
          <h3 style={{ color: 'white' }}>{message}</h3>
        </div>
      </div>
    </CSSTransition>
  );
}

export default LoginView;