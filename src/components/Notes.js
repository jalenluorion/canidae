import React, { useState, useEffect } from 'react';
import './List.css'; // Import the CSS file

const ListView = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from storage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Save tasks to storage whenever tasks state changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
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

  return (
    <div className="container">
      <h1 className="title">Notes (TO DO)</h1>
      
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
    
    </div>
  );
};

export default ListView;
