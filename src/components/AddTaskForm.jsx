import { useState, useRef } from "react";

function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        aria-label="Task description"
        className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:ring focus:ring-indigo-200"
      />
      <button
        type="submit"
        className="rounded bg-[rgb(6,10,109)] px-4 py-2 text-white hover:bg-indigo-700"
      >
        Add
      </button>
    </form>
  );
}

export default AddTaskForm;
