"use client";
import { useEffect, useState } from "react";

function getInitialBoard() {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("kanban-board");
    if (saved) return JSON.parse(saved);
  }
  return [
    { id: 1, title: "To Do", children: [{ id: 1, title: "Sample Task" }] },
    { id: 2, title: "In Progress", children: [] },
    { id: 3, title: "Done", children: [] },
  ];
}


export default function KanbanBoard() {
  const [columns, setColumns] = useState(null);
  const [newColTitle, setNewColTitle] = useState("");
  const [dragged, setDragged] = useState(null);

  // Only initialize board state on client after mount
  useEffect(() => {
    const saved = localStorage.getItem("kanban-board");
    if (saved) {
      setColumns(JSON.parse(saved));
    } else {
      setColumns([
        { id: generateId(), title: "To Do", children: [{ id: generateId(), title: "Sample Task" }] },
        { id: generateId(), title: "In Progress", children: [] },
        { id: generateId(), title: "Done", children: [] },
      ]);
    }
  }, []);

  useEffect(() => {
    if (columns) localStorage.setItem("kanban-board", JSON.stringify(columns));
  }, [columns]);

  function generateId() {
    // Use crypto.randomUUID if available, else fallback to Date.now + Math.random
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  const addColumn = () => {
    if (!newColTitle.trim() || !columns) return;
    setColumns([
      ...columns,
      { id: generateId(), title: newColTitle, children: [] },
    ]);
    setNewColTitle("");
  };

  const addChild = (colId, childTitle) => {
    if (!childTitle.trim() || !columns) return;
    setColumns(columns.map(col =>
      col.id === colId
        ? { ...col, children: [...col.children, { id: generateId(), title: childTitle }] }
        : col
    ));
  };

  const onDragStart = (colIdx, childIdx) => {
    setDragged({ colIdx, childIdx });
  };

  const onDrop = (targetColIdx, targetChildIdx) => {
    if (!dragged || !columns) return;
    const { colIdx, childIdx } = dragged;
    if (colIdx === targetColIdx && childIdx === targetChildIdx) return;
    const item = columns[colIdx].children[childIdx];
    let newColumns = columns.map(col => ({ ...col, children: [...col.children] }));
    newColumns[colIdx].children.splice(childIdx, 1);
    if (typeof targetChildIdx === "number") {
      newColumns[targetColIdx].children.splice(targetChildIdx, 0, item);
    } else {
      newColumns[targetColIdx].children.push(item);
    }
    setColumns(newColumns);
    setDragged(null);
  };

  if (!columns) {
    // Prevent rendering until client-side state is ready
    return null;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Kanban Board</h2>
      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          placeholder="Add column title"
          value={newColTitle}
          onChange={e => setNewColTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addColumn}>Add Column</button>
      </div>
      <div className="row flex-nowrap overflow-auto">
        {columns.map((col, colIdx) => (
          <div className="col-3 me-3" key={col.id}>
            <div className="card">
              <div className="card-header bg-secondary text-white">{col.title}</div>
              <div className="card-body" style={{ minHeight: 150 }}>
                <AddChildForm onAdd={title => addChild(col.id, title)} />
                {col.children.map((child, childIdx) => (
                  <div
                    key={child.id}
                    className="card mb-2 p-2 draggable"
                    draggable
                    onDragStart={() => onDragStart(colIdx, childIdx)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => onDrop(colIdx, childIdx)}
                    style={{ cursor: "grab" }}
                  >
                    {child.title}
                  </div>
                ))}
                <div
                  className="dropzone"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => onDrop(colIdx)}
                  style={{ minHeight: 20 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddChildForm({ onAdd }) {
  const [title, setTitle] = useState("");
  return (
    <form
      className="d-flex mb-2"
      onSubmit={e => {
        e.preventDefault();
        onAdd(title);
        setTitle("");
      }}
    >
      <input
        className="form-control form-control-sm me-2"
        placeholder="Add card title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button className="btn btn-sm btn-outline-primary" type="submit">
        Add
      </button>
    </form>
  );
}
