import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import './Campus.css';
import './ViewsSide.css';

const CampusView = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleUpdates = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsPopupOpen(false);
    }
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

  return (
    <div className="container">
      <div className="top-bar">
        <div className="title">
          <h1>Infinite Campus</h1>
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
              <h3>{classInfo.name}</h3>
              <p>
                <strong>Current Grade:</strong> {classInfo.currentGrade.letterGrade} ({classInfo.currentGrade.percent}%)
              </p>
              <p>
                <strong>Teacher:</strong> {classInfo.teacher.name} (
                <a href={`mailto:${classInfo.teacher.email}`}>{classInfo.teacher.email}</a>)
              </p>
              <p>
                <strong>Period:</strong> {classInfo.period}
              </p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default CampusView;
