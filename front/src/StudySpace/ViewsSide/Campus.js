import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faSchool } from '@fortawesome/free-solid-svg-icons';
import './Campus.css';
import './ViewsSide.css';
import { api } from '../../Helper';
import { CSSTransition } from 'react-transition-group';

const CampusView = ({ visible }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !buttonClicked) {
        setIsPopupOpen(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonClicked]);

  const formDataToJson = (formData) => {
    const formDataJSON = {};

    formData.forEach((value, key) => {
      formDataJSON[key] = value;
    });
    formDataJSON.district = "Boise School District";
    formDataJSON.state = "Id";
    return formDataJSON;
  };

  const handleUpdates = () => {
    setMessage('');
    setIsLogin(false);
    setIsPopupOpen(!isPopupOpen);
    setButtonClicked(true);
  };

  const handleBSDLogin = () => {
    setMessage('');
    setIsLogin(true);
    setIsPopupOpen(!isPopupOpen);
    setButtonClicked(true);
  };

  const handleLoginFormSubmit = (e) => {
    setMessage('');
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataJSON = formDataToJson(formData);

    api.post('/campus', formDataJSON)
      .then((response) => {
        if (response.status === 200) {
          setLoggedIn(true);
          console.log(response.data);
          setGrades(response.data);
          setIsPopupOpen(false);
        }
      })
      .catch((error) => {
        setMessage("Invalid login credentials");
        console.error(error);
      });
  }

  console.log(grades)
  const gradeUpdates = [
    {
      id: 1,
      classId: 1, // References the class with id 1
      date: '2023-09-01',
      description: 'Coming soon!',
    },
    // Add more grade updates as needed
  ];

  const getPeriodColor = (period) => {
    switch (period) {
      case 1:
        return 'red';
      case 2:
        return 'darkorange';
      case 3:
        return 'yellow';
      case 4:
        return 'green';
      case 5:
        return 'blue';
      case 6:
        return 'indigo';
      case 7:
        return 'violet';
      case 8:
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="slide-right"
      unmountOnExit
    >
      <div className="container nobottom slide-left" style={{ zIndex: visible ? 1 : 0 }}>
        <div className="top-bar">
          <div className="title">
            <h1>My Classes</h1>
            <button className="menu-icon" onClick={handleUpdates} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faBell} />
            </button>
          </div>

          {isPopupOpen && (
            <>
              {!isLogin ? (
                <div className="menu-dropdown blue-accent" ref={popupRef}>
                  <h2>Grade Updates</h2>
                  <ul>
                    {gradeUpdates.map((update) => (
                      <li key={update.id}>{update.description}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="menu-dropdown blue-accent campus-login" ref={popupRef}>
                  <h1 className="login-title">Boise Independent Login</h1>
                  <form className="login-form" onSubmit={handleLoginFormSubmit}>
                    <label className="login-label">BSD Email</label>
                    <input className="login-input" required autoComplete="email" type="text" name="email" />
                    <label className="login-label">BSD Password</label>
                    <input className="login-input" required autoComplete="current-password" type="password" name="password" />
                    <button type="submit">Sign Up</button>
                  </form>
                  <div className="login-error">{message}</div>
                </div>
              )}
            </>
          )}
        </div>
        {!loggedIn ? ( // Check if there are no tasks
          <div className="empty-message main-body">
            <FontAwesomeIcon icon={faSchool} className="check-icon-blue" />
            <p>Login with your school district</p>
            <div className="login-buttons">
              <button onClick={handleBSDLogin} className="login-image"><img src="https://cdnsm5-ss8.sharpschool.com/UserFiles/Servers/Server_508222/Image/District%20Logo/DigitalUse_PrimaryLogo_FullColor%20(5).png" alt="Boise School District Logo" /></button>
            </div>
          </div>
        ) : (
          <div className="class-cards main-body">
            {grades.map((classInfo) => (
              <div key={classInfo.courseNumber} className="class-card">
                <div className="grade">
                  <span className="letter-grade">{classInfo.grades ? classInfo.grades.score : "A"}</span>
                  <span className="percent">{classInfo.grades ? classInfo.grades.percent : "0.00"}%</span>
                </div>
                <div className="class-details">
                  <h3>{classInfo.name}</h3>
                  <p className="class-teacher">
                    {classInfo.teacher}{' '}
                    <a href={`mailto:${classInfo.teacherEmail}`} className="email-link">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  </p>
                  <div className="class-tags">
                    <span className="period" style={{ backgroundColor: getPeriodColor(classInfo.placement.periodSeq - 1), color: getPeriodColor(classInfo.placement.periodSeq - 1) === 'yellow' || getPeriodColor(classInfo.placement.periodSeq - 1) === 'pink' ? 'black' : 'white' }}>
                      Period {classInfo.placement.periodSeq - 1}</span>
                    <span className="room">Room {classInfo.roomName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

export default CampusView;
