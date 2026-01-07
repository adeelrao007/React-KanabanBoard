# Kanban Board Package

A reusable Zustand store and Kanban board React component for Next.js and React projects.

## Installation

```
npm install kanban-board-package
```

## Usage

```jsx
import { KanbanBoard, useKanbanStore } from 'kanban-board-package';

function App() {
  return <KanbanBoard />;
}
```

## Features
- Add columns and cards
- Drag and drop cards between columns
- State persistence using Zustand

## Peer Dependencies
- React >=17
- Zustand >=4

## License
MIT
