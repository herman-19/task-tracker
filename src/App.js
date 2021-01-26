import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const retrievedTasks = await fetchTasks();
      setTasks(retrievedTasks);
    };

    getTasks();
  }, []); // dependency array - if any value in the array changes, useEffect will execute

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:8000/tasks");
    const data = await res.json();
    return data;
  };

  const fetchSingleTask = async (taskId) => {
    const res = await fetch(`http://localhost:8000/tasks/${taskId}`);
    const data = await res.json();
    return data;
  };

  const addTask = async (task) => {
    const res = await fetch(`http://localhost:8000/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);
  };

  const toggleReminder = async (taskId) => {
    const task = await fetchSingleTask(taskId);
    const updatedTask = { ...task, reminder: !task.reminder };

    const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    const data = await res.json();
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    await fetch(`http://localhost:8000/tasks/${taskId}`, { method: "DELETE" });

    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleFormDisplay = () => {
    setShowForm(!showForm);
  };

  return (
    <Router>
      <div className="container">
        <Header onAdd={toggleFormDisplay} showAdd={showForm} />

        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showForm && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                <h3>No tasks.</h3>
              )}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
