import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import { format, isWithinInterval, addDays, startOfToday, isToday, isTomorrow } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck, faSquare, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import 'react-datepicker/dist/react-datepicker.css';
import './List.css';
import './ViewsSide.css'

const Task = ({ name, completed, period, periodColor, dueDate }) => ({
  id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  name,
  completed,
  period,
  periodColor,
  dueDate,
});

const ListView = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('8');
  const [dueDate, setDueDate] = useState(null); // State for due date and time
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [buttonClicked, setButtonClicked] = useState(false);

  const popupRef = useRef(null);
  const datePickerRef = useRef(null);

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
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !buttonClicked) {
        setIsMenuOpen(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonClicked]);

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
        Task({ name: text, completed: false, period: selectedPeriod, periodColor: getPeriodColor(selectedPeriod), dueDate }),
      ]);
      setText('');
      setDueDate(null); // Reset due date after adding the task
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

  const handleSortByDueDate = () => {
    setTasks((prevTasks) =>
      prevTasks.slice().sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      })
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

  // Function to handle date and time selection
  const handleDueDateChange = (date) => {
    setDueDate(date);
    setStartDate(date);
  };

  const handlePresetButtonClick = (preset) => {
    let newDate = new Date();

    switch (preset) {
      case 'End of Today':
        newDate.setHours(23, 59, 0, 0);
        break;
      case 'End of Tomorrow':
        newDate.setDate(newDate.getDate() + 1);
        newDate.setHours(23, 59, 0, 0);
        break;
      case 'Before School Tomorrow':
        newDate.setDate(newDate.getDate() + 1);
        newDate.setHours(7, 45, 0, 0);
        break;
      case 'Before School Monday':
        // Calculate the date for the next Monday
        const daysUntilMonday = 8 - newDate.getDay();
        newDate.setDate(newDate.getDate() + daysUntilMonday);
        newDate.setHours(7, 45, 0, 0);
        break;
      default:
        break;
    }

    handleDueDateChange(newDate);

    // Close the date picker when a preset button is clicked
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  };


  const isSelectedDateInFuture = +startDate > +new Date();

  const date = new Date();
  let currentMins = date.getMinutes();
  let currentHour = date.getHours();
  if (isSelectedDateInFuture) {
    currentHour = 0;
    currentMins = 0;
  }

  const getPeriodColor = (period) => {
    switch (period) {
      case '1':
        return 'red';
      case '2':
        return 'darkorange';
      case '3':
        return 'yellow';
      case '4':
        return 'green';
      case '5':
        return 'blue';
      case '6':
        return 'indigo';
      case '7':
        return 'violet';
      case '8':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const toggleMenu = (e) => {
    setIsMenuOpen(!isMenuOpen);
    setButtonClicked(true);
  };

  const isTaskOverdue = (dueDate) => {
    return dueDate && dueDate < new Date();
  };

  const formatDueDate = (dueDate) => {
    const now = startOfToday();
    const oneWeekFromNow = addDays(now, 7);

    if (isWithinInterval(dueDate, { start: now, end: oneWeekFromNow })) {
      if (isToday(dueDate)) {
        return `Today, ${format(dueDate, 'h:mm a')}`;
      } else if (isTomorrow(dueDate)) {
        return `Tomorrow, ${format(dueDate, 'h:mm a')}`;
      } else {
        return format(dueDate, 'iiii, h:mm a');
      }
    } else {
      return format(dueDate, 'M/d, h:mm a');
    }
  };

  const CustomDatePickerInput = forwardRef(({ value, onClick }, ref) => {
    const formattedValue = value ? format(new Date(value), 'MMM. dd, h:mm aa') : 'No Due Date';

    const handleDateButtonClick = () => {
      // Check if the date picker is open
      if (datePickerRef.current && datePickerRef.current.state.open) {
        datePickerRef.current.setOpen(false); // Close the date picker
      } else {
        onClick(); // Open the date picker if it's closed
      }
    };

    return (
      <button className="date-button react-datepicker-ignore-onclickoutside" onClick={handleDateButtonClick}>
        {formattedValue}
      </button>
    );
  });


  return (
    <div className="container">
      <div className="top-bar">
        <div className="title">
          <h1>
            To-Do List
          </h1>
          <button className="menu-icon" onClick={toggleMenu} style={{ cursor: `pointer` }}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {isMenuOpen && (
          <div ref={popupRef} className="menu-dropdown orange-accent">
            <button onClick={handleMarkAllCompleted}>Mark All as Completed</button>
            <button onClick={handleClearCompleted}>Clear Completed</button>
            <button onClick={handleSortByPeriod}>Sort by Period</button>
            <button onClick={handleSortByDueDate}>Sort by Due Date</button>
          </div>
        )}
      </div>
      {tasks.length === 0 ? ( // Check if there are no tasks
        <div className="empty-message main-body">
          <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
          <p>You're all caught up!</p>
        </div>
      ) : (
        <ul className="task-list main-body">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-desc">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`task-button ${task.completed ? 'completed' : ''}`}
                >
                  {task.completed ? (
                    <FontAwesomeIcon icon={faSquareCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faSquare} />
                  )}
                </button>
                <p className={`task-name ${task.completed ? 'completed' : ''}`}>
                  {task.name}
                </p>
              </div>
              <div className="task-tags">
                <span className={`task-period`} style={{ backgroundColor: task.periodColor, color: task.periodColor === 'yellow' || task.periodColor === 'pink' ? 'black' : 'white' }}>
                  {task.period === '8' ? 'Other' : `Period ${task.period}`}
                </span>
                <span className={`task-due-date ${isTaskOverdue(new Date(task.dueDate)) && task.dueDate ? 'overdue' : ''}`}>
                  {task.dueDate ? formatDueDate(new Date(task.dueDate)) : "No Due Date"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="task-input"
          placeholder="Reading Assignment..."
        />
        <div className="input-buttons">
          <DatePicker
            selected={dueDate}
            onChange={handleDueDateChange}
            showTimeSelect
            isClearable
            timeFormat="h:mm aa"
            timeIntervals={15}
            dateFormat="MMMM d, h:mm aa"
            wrapperClassName="date-picker"
            customInput={<CustomDatePickerInput />}
            popperClassName='date-popper'
            popperPlacement="top-end"
            minDate={new Date()}
            minTime={new Date(new Date().setHours(currentHour, currentMins, 0, 0))}
            maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
            includeTimes={[
              new Date(new Date().setHours(0, 0, 0, 0)),
              new Date(new Date().setHours(7, 45, 0, 0)),
              new Date(new Date().setHours(12, 21, 0, 0)),
              new Date(new Date().setHours(15, 7, 0, 0)),
              new Date(new Date().setHours(23, 59, 0, 0))
            ]}
            injectTimes={[
              new Date(new Date().setHours(0, 0, 0, 0)),
              new Date(new Date().setHours(7, 45, 0, 0)),
              new Date(new Date().setHours(12, 21, 0, 0)),
              new Date(new Date().setHours(15, 7, 0, 0)),
              new Date(new Date().setHours(23, 59, 0, 0))
            ]}
            ref={datePickerRef} // Assign the ref here
          >
            <div className="preset-buttons">
              <div className="row">
                <button onClick={() => handlePresetButtonClick('End of Today')}>End of Today</button>
                <button onClick={() => handlePresetButtonClick('Before School Tomorrow')}>Before School Tomorrow</button>
              </div>
              <div className="row">
                <button onClick={() => handlePresetButtonClick('End of Tomorrow')}>End of Tomorrow</button>
                <button onClick={() => handlePresetButtonClick('Before School Monday')}>Before School Monday</button>
              </div>
            </div>
          </DatePicker>
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
            <option style={{ backgroundColor: getPeriodColor('8') }} value="8">Other</option>
          </select>
          <button onClick={handleAddTask} className="add-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListView;
