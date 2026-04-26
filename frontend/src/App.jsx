import React, { useEffect, useState } from "react";

const API_BASE_URL = "";

function App() {
  const [health, setHealth] = useState(null);
  const [visits, setVisits] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function fetchHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    setHealth(data);
  }

  async function fetchVisits() {
    const response = await fetch(`${API_BASE_URL}/api/visits`);
    const data = await response.json();
    setVisits(data.visits);
  }

  async function fetchTasks() {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    const data = await response.json();
    setTasks(data);
  }

  async function createTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  }

  async function toggleTask(task) {
    await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed }),
    });

    fetchTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  }

  useEffect(() => {
    fetchHealth();
    fetchVisits();
    fetchTasks();
  }, []);

  return (
    <main className="app">
      <section className="hero">
        <p className="tag">Docker DevOps Project</p>
        <h1>Dockerized MERN DevOps Platform</h1>
        <p>
          React frontend connected with Node.js backend, MongoDB database, and
          Redis cache using Docker containers.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <h2>Backend Health</h2>
          <p>Status: {health?.status || "Loading..."}</p>
          <p>Database: {health?.database || "Checking..."}</p>
        </div>

        <div className="card">
          <h2>Redis Counter</h2>
          <p>Total Visits: {visits ?? "Loading..."}</p>
          <button onClick={fetchVisits}>Increase Visit Count</button>
        </div>
      </section>

      <section className="card">
        <h2>Task Manager</h2>

        <form onSubmit={createTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 && <p>No tasks added yet.</p>}

          {tasks.map((task) => (
            <div key={task._id} className="task-item">
              <span className={task.completed ? "completed" : ""}>
                {task.title}
              </span>

              <div>
                <button onClick={() => toggleTask(task)}>
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button className="danger" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;