// src/services/api.js

import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Busca todo o board (colunas com cards)
export const getBoard = () => {
  return axios.get(`${API_BASE}/api/kanban_board/`);
};

// Move um card para outra coluna
export const moveCard = (cardId, newColumnId) => {
  return axios.patch(`${API_BASE}/cards/${cardId}/`, {
    coluna_id: newColumnId,
  });
};

// Cria nova coluna
export const createColumn = (titulo, ordem) => {
  return axios.post(`${API_BASE}/columns/`, {
    titulo,
    ordem,
  });
};

// Atualiza título da coluna
export const renameColumn = (columnId, novoTitulo) => {
  return axios.patch(`${API_BASE}/columns/${columnId}/`, {
    titulo: novoTitulo,
  });
};
