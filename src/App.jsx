import { useState, useCallback, useMemo, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import StatsBar from "./components/StatsBar.jsx";
import "./App.css";

const uid = () => Math.random().toString(36).slice(2);

export default function App() {
  // 🔹 Initialize tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all"); // all | active | completed

  // 🔹 Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🔹 Add new task
  const addTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask = {
      id: uid(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // 🔹 Toggle task done
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  // 🔹 Delete task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // 🔹 Clear completed
  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.done));
  }, []);

  // 🔹 Edit task
  const handleEditTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText.trim() } : task
      )
    );
  };

  // 🔹 Derived values
  const remainingCount = useMemo(
    () => tasks.filter((t) => !t.done).length,
    [tasks]
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  return (
    <div className="min-h-screen  text-gray-900 overall">
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8 text-center top">
          <h1 className="text-6xl font-extrabold tracking-tight text-black heading">
          Plan Your Day
          </h1>
          <p className="mt-2 text-lg para">
            {remainingCount} task{remainingCount !== 1 ? "s" : ""} remaining
          </p>
        </header>

        {/* Main Layout: 70% Todos / 30% Graph on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left - Todos (70%) */}
          <main className="lg:col-span-7">
            <div className="rounded-xl bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
              {/* Add Task Form */}
              <AddTaskForm onAdd={addTask} />

              {/* Filter Buttons */}
              <div className="flex justify-center gap-3 my-6">
                {["all", "active", "completed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      filter === f
                        ? "bg-[rgb(6,10,109)] text-white shadow-md"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <TaskList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={handleEditTask}
              />

              {/* Empty state */}
              {tasks.length === 0 && (
                <p className="mt-10 text-center text-gray-500 text-sm italic">
                  No tasks yet — add your first one 🚀
                </p>
              )}

              {/* Clear completed */}
              {tasks.some((t) => t.done) && (
                <div className="flex justify-center">
                  <button
                    onClick={clearCompleted}
                    className="mt-8 text-lg text-#060A6D hover:text-red-600 font-medium transition"
                  >
                    🗑️ Clear Completed
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Right - Graph (30%) */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              {tasks.length > 0 && <StatsBar tasks={tasks} />}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
