import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './TodoList.css';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'alphabetical', 'completion', 'time'
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'

    // Load tasks from localStorage
    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    // Save tasks to localStorage
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim() === '' || newTaskTime.trim() === '') {
            alert("Task and time cannot be empty or whitespace.");
            return;
        }
        setTasks([...tasks, { id: uuidv4(), text: newTask, time: newTaskTime, completed: false }]);
        setNewTask('');
        setNewTaskTime('');
    };

    const removeTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const sortTasks = (tasks) => {
        switch (sortOrder) {
            case 'alphabetical':
                return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
            case 'completion':
                return [...tasks].sort((a, b) => a.completed - b.completed);
            case 'time':
                return [...tasks].sort((a, b) => a.time.localeCompare(b.time));
            default:
                return tasks;
        }
    };

    const filterTasks = (tasks) => {
        switch (filter) {
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'incomplete':
                return tasks.filter(task => !task.completed);
            default:
                return tasks;
        }
    };

    const sortedFilteredTasks = sortTasks(filterTasks(tasks));

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <h3>Week 2 Task</h3>
            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={handleInputChange}
                    placeholder="Add a new task"
                />
                <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="Set time"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <div>
                <label>Sort By: </label>
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                    <option value="default">Default</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="completion">Completion Status</option>
                    <option value="time">Time</option>
                </select>

                <label>Filter: </label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>
            <ul>
                {sortedFilteredTasks.map((task) => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <span onClick={() => toggleTaskCompletion(task.id)}>{task.text}</span>
                        <span>{task.time}</span>
                        <button onClick={() => removeTask(task.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
