import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

const useKanbanStore = create(persist(
  (set, get) => ({
    columns: [
      { id: generateId(), title: "To Do", children: [{ id: generateId(), title: "Sample Task" }] },
      { id: generateId(), title: "In Progress", children: [] },
      { id: generateId(), title: "Done", children: [] },
    ],
    addColumn: (title) => {
      if (!title.trim()) return;
      set(state => ({
        columns: [
          ...state.columns,
          { id: generateId(), title, children: [] },
        ]
      }));
    },
    addChild: (colId, childTitle) => {
      if (!childTitle.trim()) return;
      set(state => ({
        columns: state.columns.map(col =>
          col.id === colId
            ? { ...col, children: [...col.children, { id: generateId(), title: childTitle }] }
            : col
        )
      }));
    },
    moveChild: (fromColIdx, fromChildIdx, toColIdx, toChildIdx) => {
      const columns = [...get().columns.map(col => ({ ...col, children: [...col.children] }))];
      const item = columns[fromColIdx].children[fromChildIdx];
      columns[fromColIdx].children.splice(fromChildIdx, 1);
      if (typeof toChildIdx === "number") {
        columns[toColIdx].children.splice(toChildIdx, 0, item);
      } else {
        columns[toColIdx].children.push(item);
      }
      set({ columns });
    }
  }),
  {
    name: "kanban-board-zustand"
  }
));

export default useKanbanStore;
