import React, { useState } from "react";
import useKanbanStore from "./kanbanStore";

export default function KanbanBoard() {
  const columns = useKanbanStore(state => state.columns);
  const addColumn = useKanbanStore(state => state.addColumn);
  const addChild = useKanbanStore(state => state.addChild);
  const moveChild = useKanbanStore(state => state.moveChild);
  const [newColTitle, setNewColTitle] = useState("");
  const [dragged, setDragged] = useState(null);

  const onDragStart = (colIdx, childIdx) => {
    setDragged({ colIdx, childIdx });
  };

  const onDragEnd = () => {
    setDragged(null);
  };

  const onDrop = (targetColIdx, targetChildIdx) => {
    if (!dragged) return;
    const { colIdx, childIdx } = dragged;
    if (colIdx === targetColIdx && childIdx === targetChildIdx) return;
    moveChild(colIdx, childIdx, targetColIdx, targetChildIdx);
    setDragged(null);
  };

  if (!columns) {
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
        <button className="btn btn-primary" onClick={() => { addColumn(newColTitle); setNewColTitle(""); }}>Add Column</button>
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
                    onDragEnd={onDragEnd}
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
                  onDragEnd={onDragEnd}
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
