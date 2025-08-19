import { useState, useRef, useEffect } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  // Keep draft in sync if parent text changes
  useEffect(() => {
    if (!isEditing) setEditText(task.text);
  }, [task.text, isEditing]);

  const startEdit = () => setIsEditing(true);

  const save = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else if (!trimmed) {
      // prevent empty edits → delete instead (as you intended)
      onDelete(task.id);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  return (
    <li className="group flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-200">
      {!isEditing ? (
        <>
          <label
            htmlFor={String(task.id)}
            className="flex flex-1 items-center gap-3 cursor-pointer"
            title='Click checkbox, or double-click text to edit'
          >
            <input
              id={String(task.id)}
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
              className="h-4 w-4 accent-indigo-600"
              aria-label={`Mark "${task.text}" as ${
                task.done ? "incomplete" : "complete"
              }`}
            />
            <span
              onDoubleClick={startEdit}
              className={`flex-1 select-none ${
                task.done ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {task.text}
            </span>
          </label>

          <div className="flex items-center gap-2 transition">
            <button
              onClick={startEdit}
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm hover:bg-gray-50"
              aria-label={`Edit "${task.text}"`}
              title="Edit"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-lg border border-red-300 px-2 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50"
              aria-label={`Delete "${task.text}"`}
              title="Delete"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="flex w-full items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={save}
            aria-label={`Edit "${task.text}"`}
            placeholder="Edit task..."
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {/* prevent blur firing before click with onMouseDown */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white text-xs sm:text-sm hover:bg-indigo-700"
            aria-label="Save"
            title="Save"
          >
            Save
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancel}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm hover:bg-gray-50"
            aria-label="Cancel"
            title="Cancel"
          >
            Cancel
          </button>
        </div>
      )}
    </li>
  );
}
