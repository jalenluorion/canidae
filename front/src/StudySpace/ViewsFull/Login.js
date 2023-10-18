import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../Helper';
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
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const formDataToJson = (formData) => {
    const formDataJSON = {};

    formData.forEach((value, key) => {
      if (key === 'firstname') {
        // Check for the 'firstname' field
        if (formData.has('lastname')) {
          // Check if 'lastname' is also present
          const lastnameValue = formData.get('lastname');
          formDataJSON['name'] = value + ' ' + lastnameValue;
        } else {
          formDataJSON[key] = value;
        }
      } else if (key !== 'lastname') {
        // Skip 'lastname' field if present
        formDataJSON[key] = value;
      }
    });
    return formDataJSON;
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    api.post('/login', formDataToJson(formData), { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('../' + response.data.userId);
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
        if (error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error logging in. Please try again later.');
        }
        console.error(error);
      });
  }

  const handleRegisterFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    api.post('/register', formDataToJson(formData), { withCredentials: true })
      .then((response) => {
        if (response.status === 201) {
          setSuccess(true);
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('../' + response.data.userId);
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
        if (error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error registering in. Please try again later.');
        }
        console.error(error);
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
        {isLogin ? (
          <div className="login-container" ref={containerRef}>
            <h1 className="login-title">Welcome Back!</h1>

            <form className="login-form" onSubmit={handleLoginFormSubmit}>
              <label className="login-label">Username</label>
              <input className="login-input" required autoComplete="username" type="text" name="username" />
              <label className="login-label">Password</label>
              <input className="login-input" required autoComplete="current-password" type="password" name="password" />
              <label className="login-label">
                <input
                  type="checkbox"
                  onChange={handleRememberMeChange}
                />
                <p>Remember Me</p>
              </label>
              <button type="submit">Log In</button>
            </form>
            <div className="login-swap"><p>Don't have an account?&nbsp;</p><p className="login-link" onClick={() => { setIsLogin(!isLogin); setMessage(""); }}>Sign Up</p></div>
            {success ? <div className="login-success">{message}</div> : <div className="login-error">{message}</div>}
          </div>
        ) : (
          <div className="login-container" ref={containerRef}>
            <h1 className="login-title">Welcome to Canidae!</h1>
            <form className="login-form" onSubmit={handleRegisterFormSubmit}>
              <div className="login-split">
                <div className="login-split-column">
                  <label className="login-label">First Name</label>
                  <input className="login-input" required type="text" name="firstname" />
                </div>
                <div className="login-split-column">
                  <label className="login-label">Last Name</label>
                  <input className="login-input" required type="text" name="lastname" />
                </div>
              </div>
              <label className="login-label">Email</label>
              <input className="login-input" required type="email" name="email" />
              <label className="login-label">Username</label>
              <input className="login-input" required autoComplete="username" type="text" name="username" />
              <label className="login-label">Password</label>
              <input className="login-input" required autoComplete="new-password" type="password" name="password" />
              <label className="login-label">
                <input
                  type="checkbox"
                  onChange={handleRememberMeChange}
                />
                Remember Me
              </label>
              <button type="submit">Sign Up</button>
            </form>
            <div className="login-swap"><p>Already have an account?&nbsp;</p><p className="login-link" onClick={() => { setIsLogin(!isLogin); setMessage(""); }}>Log In</p></div>
            {success ? <div className="login-success">{message}</div> : <div className="login-error">{message}</div>}
          </div>
        )}
      </div>

    </CSSTransition>
  );
}

export default LoginView;