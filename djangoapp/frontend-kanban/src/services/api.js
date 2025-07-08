// src/services/api.js

import axios from 'axios';
import { getCookie } from './csrf';

const API_BASE = process.env.REACT_APP_API_BASE;

// Define o CSRF token
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Envia o token manualmente
axios.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (!config.headers['X-CSRFToken'] && csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Busca todo o board (colunas com cards)
export const getBoard = () => {
  return axios.get(`${API_BASE}/kanban_board/`);
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
