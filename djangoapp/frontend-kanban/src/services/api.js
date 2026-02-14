// src/services/api.js

import axios from "axios";

export const API_BASE = process.env.REACT_APP_API_BASE;

// Instância central do Axios
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Define ou remove o token JWT no header Authorization
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Login (JWT)
export const login = (username, password) => {
  return api.post("/auth/login/", { username, password });
};

// Busca todo o board (colunas com cards)
export const getBoard = () => {
  return api.get("/kanban_board/");
};

// Move um card para outra coluna
export const moveCard = (cardId, newColumnId) => {
  return api.patch(`/cards/${cardId}/`, {
    coluna_id: newColumnId,
  });
};

// Cria nova coluna
export const createColumn = (titulo, ordem) => {
  return api.post("/columns/", {
    titulo,
    ordem,
  });
};

// Atualiza título da coluna
export const renameColumn = (columnId, novoTitulo) => {
  return api.patch(`/columns/${columnId}/`, {
    titulo: novoTitulo,
  });
};

// Exclui uma coluna
export const deleteColumn = (columnId) => {
  return api.delete(`/columns/${columnId}/`);
};

export default api;