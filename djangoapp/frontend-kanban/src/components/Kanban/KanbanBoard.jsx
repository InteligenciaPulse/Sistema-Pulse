// src/components/KanbanBoard.jsx

import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import {
  getBoard,
  moveCard,
  createColumn,
  renameColumn,
} from '../../services/api';
import '../../styles/Kanban/KanbanBoard.css';

const KanbanBoard = ({ visibleFields }) => {
  const [columns, setColumns] = useState([]);
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [columnTitleDraft, setColumnTitleDraft] = useState('');

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const res = await getBoard();
      console.log('Resposta da API (getBoard):', res.data);
      setColumns(res.data);
    } catch (err) {
      console.error('Erro ao buscar colunas:', err);
    }
  };

  const handleDeleteColumn = (columnId) => {
    setColumns((prevColunas) => prevColunas.filter(c => c.id !== columnId));
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const cardId = parseInt(draggableId);
    const sourceColId = parseInt(source.droppableId);
    const destColId = parseInt(destination.droppableId);

    if (sourceColId === destColId && source.index === destination.index) return;

    const updated = [...columns];
    const sourceCol = updated.find((col) => col.id === sourceColId);
    const destCol = updated.find((col) => col.id === destColId);

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, movedCard);
    setColumns(updated);

    try {
      await moveCard(cardId, destColId);
    } catch (err) {
      console.error('Erro ao mover card:', err);
      fetchColumns(); // fallback
    }
  };

  const handleAddColumn = async () => {
    try {
      const maxOrder = Math.max(...columns.map((col) => col.ordem), 0);
      const res = await createColumn('Nova Coluna', maxOrder + 1);
      setColumns([...columns, res.data]);
    } catch (err) {
      console.error('Erro ao criar nova coluna:', err);
    }
  };

  const handleColumnRename = async (columnId) => {
    const trimmed = columnTitleDraft.trim();
    if (!trimmed) return;

    try {
      await renameColumn(columnId, trimmed);
      setColumns((cols) =>
        cols.map((col) =>
          col.id === columnId ? { ...col, titulo: trimmed } : col
        )
      );
    } catch (err) {
      console.error('Erro ao renomear coluna:', err);
    }

    setEditingColumnId(null);
    setColumnTitleDraft('');
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {(columns || []).map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={column.cards}
            editingColumnId={editingColumnId}
            columnTitleDraft={columnTitleDraft}
            setEditingColumnId={setEditingColumnId}
            setColumnTitleDraft={setColumnTitleDraft}
            handleColumnRename={handleColumnRename}
            visibleFields={visibleFields}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}

        <div className="kanban-column-add" onClick={handleAddColumn}>
          ➕ Adicionar Nova Coluna
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
