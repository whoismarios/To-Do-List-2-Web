"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Task {
  id: number;
  task: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const apiUrl = 'https://to-do-api.andriana-nails.com/tasks';
  const apiKey = 'thisAPIKeyIsVerySecret1234';
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const marios = ["Marios", "K314Marios"]
  const kim = ["Kim", "K314Marios"]

  const login = (username: string, password: string) => {
    if (username === "Marios" && password === "K314M" || username === "Kim" && password === "K314M") {
      setIsLoggedIn(true)
    }
  }

  useEffect(() => {
    fetch(apiUrl, {
      headers: {
        'Authorization': apiKey
      }
    })
      .then(res => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const addTask = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({ task: newTask })
    })
      .then(res => res.json())
      .then((data: { id: number }) => {
        setTasks([...tasks, { id: data.id, task: newTask }]);
        setNewTask('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const deleteTask = (id: number) => {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': apiKey
      }
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(err => console.error('Error deleting task:', err));
  };

  return isLoggedIn ? (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)} 
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button 
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Add Task
        </button>
      </div>
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id} className="flex items-center justify-between bg-gray-100 mb-2 p-2 rounded">
            <span className="text-black">{task.task}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col justify-evenly">
        <Image src="/girl_laptop.png" alt="Logo" width={200} height={200} className='m-auto' />
        <input 
          type="text" 
          value={credentials.username} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, username: e.target.value })} 
          className="m-10 shadow border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder='Username'
        />
        <input 
          type="password" 
          value={credentials.password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, password: e.target.value })} 
          className="m-10 shadow border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder='Password'
        />
        <button 
          onClick={() => login(credentials.username, credentials.password)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
