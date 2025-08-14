// src/components/KanbanCard.jsx

import React, { useState } from 'react';
import { API_BASE } from '../../services/api';
import '../../styles/Kanban/KanbanCard.css';

import { Trash2 } from 'lucide-react';

const KanbanCard = ({ card, visibleFields, onDelete }) => {
  const { orcamento } = card;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Deseja remover este card?')) {
      return;
    }

    try {
      setDeleting(true);

      if (typeof onDelete === 'function') {
        await onDelete(card);
      } else {
        const resp = await fetch(`${API_BASE}/cards/${card.id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Falha ao remover card: ${resp.status} ${txt}`);
        }

        document.dispatchEvent(new CustomEvent('kanban:cardDeleted', { detail: { id: card.id } }));
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível remover este card!');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <a href={`${API_BASE}/editar_orcamento/${orcamento?.id ?? card.id}/`} className="kanban-card">
      <button
        className="kanban-card__trash"
        aria-label="Remover card"
        title="Remover card"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 size={16} />
      </button>

      <strong>{orcamento?.id ? `Orçamento #${orcamento.id}` : 'Orçamento'}</strong>

      {visibleFields?.valor_total && orcamento?.valor_total && (
        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
          <strong>Valor:</strong> R$ {parseFloat(orcamento.valor_total).toFixed(2)}
        </p>
      )}

      {visibleFields?.paciente && orcamento?.paciente_nome && (
        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
          <strong>Paciente:</strong> {orcamento.paciente_nome}
        </p>
      )}

      {visibleFields?.data_criacao && orcamento?.data_criacao && (
        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#555' }}>
          <strong>Criado em:</strong> {orcamento.data_criacao}
        </p>
      )}

      {/* {visibleFields?.anotacao && card?.anotacao && (
        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
          <strong>Anotação:</strong> {card.anotacao}
        </p>
      )} */}

      {visibleFields?.status && orcamento?.status_nome && (
        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#555' }}>
          <strong>Status:</strong> {orcamento.status_nome}
        </p>
      )
      }
    </a >
  );
};

export default KanbanCard;