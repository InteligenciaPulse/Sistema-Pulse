// src/components/KanbanColumn.jsx

import React from 'react';
import { API_BASE, deleteColumn } from '../services/api';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

import { Pencil, NotebookPen, Trash2 } from 'lucide-react';

const KanbanColumn = ({
  column,
  cards,
  index,
  editingColumnId,
  columnTitleDraft,
  setEditingColumnId,
  setColumnTitleDraft,
  handleColumnRename,
  visibleFields,
  onDeleteColumn,
}) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a coluna "${column.titulo}"?\nTodos os cards dentro dela também serão removidos.`
    );
    if (!confirmar) return;

    try {
      await deleteColumn(column.id);
      onDeleteColumn(column.id);
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
      alert('Erro ao excluir a coluna.');
    }
  };

  return (
    <Droppable droppableId={column.id.toString()}>
      {(provided) => (
        <div
          className="kanban-column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="kanban-column-header">
            {editingColumnId === column.id ? (
              <input
                type="text"
                value={columnTitleDraft}
                onChange={(e) => setColumnTitleDraft(e.target.value)}
                onBlur={() => handleColumnRename(column.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleColumnRename(column.id);
                }}
                autoFocus
                className="kanban-column-input"
              />
            ) : (
              <>
                <div className='title-div'>
                  <h3 className="kanban-column-title">{column.titulo}</h3>

                  <span
                    className="kanban-column-edit"
                    title="Editar título"
                    onClick={() => {
                      setEditingColumnId(column.id);
                      setColumnTitleDraft(column.titulo);
                    }}
                  >
                    <Pencil size={16} />
                  </span>

                  <span
                    className="kanban-column-delete"
                    title="Excluir coluna"
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} />
                  </span>
                </div>

                <div className='title-div-total'>
                  <span className="kanban-column-count" title="Quantidade de cards">
                    <NotebookPen size={16} /> {cards.length}
                  </span>

                  <h4 className="kanban-column-total">
                    Total: {
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        cards.reduce((acc, c) => {
                          const raw = c.orcamento?.valor_total ?? '0';
                          const num = parseFloat(
                            typeof raw === 'string' ? raw.replace(',', '.') : raw
                          );
                          return acc + (isNaN(num) ? 0 : num);
                        }, 0)
                      )
                    }
                  </h4>
                </div>
              </>
            )}
          </div>

          <div className="kanban-column-cards">
            {cards.map((card, idx) => (
              <Draggable
                key={card.id}
                draggableId={card.id.toString()}
                index={idx}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard card={card} visibleFields={visibleFields} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>

          {/* {cards.map((card, idx) => (
            <Draggable
              key={card.id}
              draggableId={card.id.toString()}
              index={idx}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <KanbanCard card={card} />
                </div>
              )}
            </Draggable>
          ))} */}

          {provided.placeholder}

          <a
            href={`${API_BASE}/orcamentos/criar/?coluna_id=${column.id}`}
            className="kanban-column-add-card"
          >
            ➕ Novo Orçamento
          </a>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
