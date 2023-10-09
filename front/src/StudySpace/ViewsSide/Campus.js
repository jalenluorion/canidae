import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Campus.css';
import './ViewsSide.css';
import { CSSTransition } from 'react-transition-group';

const CampusView = ({ visible }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

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

  const handleUpdates = () => {
    setIsPopupOpen(!isPopupOpen);
    setButtonClicked(true);
  };

  // Mock class and grade update data
  const classes = [
    {
      id: 1,
      name: 'Mathematics',
      currentGrade: {
        letterGrade: 'A',
        percent: 95,
      },
      teacher: {
        name: 'John Smith',
        email: 'john.smith@example.com',
      },
      period: 1,
      room: 'A101',
    },
    {
      id: 2,
      name: 'Science',
      currentGrade: {
        letterGrade: 'B',
        percent: 85,
      },
      teacher: {
        name: 'Lisa Johnson',
        email: 'lisa.johnson@example.com',
      },
      period: 2,
      room: 'A102',
    },
    {
      id: 3,
      name: 'History',
      currentGrade: {
        letterGrade: 'C',
        percent: 75,
      },
      teacher: {
        name: 'Robert Davis',
        email: 'robert.davis@example.com',
      },
      period: 3,
      room: 'B201',
    },
    {
      id: 4,
      name: 'English Literature',
      currentGrade: {
        letterGrade: 'A',
        percent: 92,
      },
      teacher: {
        name: 'Sarah Anderson',
        email: 'sarah.anderson@example.com',
      },
      period: 4,
      room: 'B202',
    },
    {
      id: 5,
      name: 'Physical Education',
      currentGrade: {
        letterGrade: 'B',
        percent: 88,
      },
      teacher: {
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@example.com',
      },
      period: 5,
      room: 'Gymnasium',
    },
    {
      id: 6,
      name: 'Spanish',
      currentGrade: {
        letterGrade: 'A',
        percent: 94,
      },
      teacher: {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
      },
      period: 6,
      room: 'A103',
    },
    {
      id: 7,
      name: 'Computer Science',
      currentGrade: {
        letterGrade: 'A',
        percent: 91,
      },
      teacher: {
        name: 'David Lee',
        email: 'david.lee@example.com',
      },
      period: 7,
      room: 'B203',
    },
  ];

  const gradeUpdates = [
    {
      id: 1,
      classId: 1, // References the class with id 1
      date: '2023-09-01',
      description: 'Received an A on the math quiz.',
    },
    {
      id: 2,
      classId: 2, // References the class with id 2
      date: '2023-08-30',
      description: 'Submitted a science project.',
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
            <div className="menu-dropdown blue-accent" ref={popupRef}>
              <h2>Grade Updates</h2>
              <ul>
                {gradeUpdates.map((update) => (
                  <li key={update.id}>{update.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="class-cards main-body">
          {classes.map((classInfo) => (
            <div key={classInfo.id} className="class-card">
              <div className="grade">
                <span className="letter-grade">{classInfo.currentGrade.letterGrade}</span>
                <span className="percent">{classInfo.currentGrade.percent}%</span>
              </div>
              <div className="class-details">
                <h3>{classInfo.name}</h3>
                <p className="class-teacher">
                  {classInfo.teacher.name}{' '}
                  <a href={`mailto:${classInfo.teacher.email}`} className="email-link">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </p>
                <div className="class-tags">
                  <span className="period" style={{ backgroundColor: getPeriodColor(classInfo.period), color: getPeriodColor(classInfo.period) === 'yellow' || getPeriodColor(classInfo.period) === 'pink' ? 'black' : 'white' }}>
                    Period {classInfo.period}</span>
                  <span className="room">Room {classInfo.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CSSTransition>
  );
};

export default CampusView;
