// src/components/KanbanCard.jsx

import React from 'react';
import './KanbanCard.css';

const KanbanCard = ({ card, visibleFields }) => {
  const { orcamento } = card;

  return (
    <a href={`http://localhost:8000/editar_orcamento/${orcamento?.id ?? card.id}`} className="kanban-card">
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