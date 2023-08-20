import React, { useState, useEffect } from 'react';
import './List.css';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Task = ({ name, completed }) => ({
  id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  name,
  completed
});

const ListView = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // Load tasks from cookies on component mount
    const storedTasks = Cookies.get('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to cookies whenever tasks state changes
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
  }, [tasks]);

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
      setTasks((prevTasks) => [...prevTasks, Task({ name: text, completed: false })]);
      setText('');
    }
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <button
              onClick={() => handleToggleComplete(task.id)}
              className="task-button"
            >
              {task.completed ? '✓' : '○'}
            </button>
            <span className="task-name">{task.name}</span>
          </li>
        ))}
      </ul>
    <div className="bottom-container">
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="task-input"
        />
        <button
          onClick={handleAddTask}
          className="add-button"
        >
          +
        </button>
      </div>

      <button
        onClick={handleClearCompleted}
        className="clear-button"
      >
        Clear Completed
      </button>
    </div>
    </div>
  );
};

export default ListView;
