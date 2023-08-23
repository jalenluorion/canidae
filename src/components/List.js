import React, { useState, useEffect, useRef } from 'react';
import './List.css';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';

const Task = ({ name, completed, period, periodColor }) => ({
  id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  name,
  completed,
  period,
  periodColor,
});

const ListView = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const storedTasks = Cookies.get('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    handleClearCompleted();
  }, []);

  useEffect(() => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
  }, [tasks]);

  useEffect(() => {
    document.body.addEventListener('click', handleDocumentClick);
    return () => {
      document.body.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // This function will close the menu if a click occurs outside of it
  const handleDocumentClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleAddTask = () => {
    if (text.trim() !== '') {
      setTasks((prevTasks) => [
        ...prevTasks,
        Task({ name: text, completed: false, period: selectedPeriod, periodColor: getPeriodColor(selectedPeriod) }),
      ]);
      setText('');
    }
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const handleMarkAllCompleted = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        completed: true,
      }))
    );
  };

  const handleSortByPeriod = () => {
    setTasks((prevTasks) =>
      prevTasks.slice().sort((a, b) => a.period - b.period)
    );
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const getPeriodColor = (period) => {
    switch (period) {
      case '1':
        return 'red';
      case '2':
        return 'orange';
      case '3':
        return 'yellow';
      case '4':
        return 'green';
      case '5':
        return 'blue';
      case '6':
        return 'purple';
      case '7':
        return 'pink';
      default:
        return 'gray';
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the body
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container">
      <h1 className="title">
        To-Do List
        <span className="menu-icon" onClick={toggleMenu} style={{ cursor: `pointer` }}>
          <FontAwesomeIcon icon={faBars} />
        </span>
      </h1>

      {isMenuOpen && (
        <div ref={menuRef} className="menu-dropdown">
          <button onClick={handleMarkAllCompleted}>Mark All as Completed</button>
          <button onClick={handleClearCompleted}>Clear Completed</button>
          <button onClick={handleSortByPeriod}>Sort by Period</button>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <button
              onClick={() => handleToggleComplete(task.id)}
              className="task-button"
            >
              {task.completed ? '✓' : '○'}
            </button>
            <span className={`task-name ${task.completed ? 'completed' : ''}`}>
              {task.name}
            </span>
            <span className={`task-period`} style={{ backgroundColor: task.periodColor, color: task.periodColor === 'yellow' || task.periodColor === 'pink' ? 'black' : 'white' }}>
              Period {task.period}
            </span>
          </li>
        ))}
      </ul>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="task-input"
        />
        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="period-select"
          style={{ backgroundColor: getPeriodColor(selectedPeriod), color: getPeriodColor(selectedPeriod) === 'yellow' || getPeriodColor(selectedPeriod) === 'pink' ? 'black' : 'white' }}
        >
          <option style={{ backgroundColor: getPeriodColor('1') }} value="1">Period 1</option>
          <option style={{ backgroundColor: getPeriodColor('2') }} value="2">Period 2</option>
          <option style={{ backgroundColor: getPeriodColor('3') }} value="3">Period 3</option>
          <option style={{ backgroundColor: getPeriodColor('4') }} value="4">Period 4</option>
          <option style={{ backgroundColor: getPeriodColor('5') }} value="5">Period 5</option>
          <option style={{ backgroundColor: getPeriodColor('6') }} value="6">Period 6</option>
          <option style={{ backgroundColor: getPeriodColor('7') }} value="7">Period 7</option>
        </select>
        <button onClick={handleAddTask} className="add-button">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};

export default ListView;
