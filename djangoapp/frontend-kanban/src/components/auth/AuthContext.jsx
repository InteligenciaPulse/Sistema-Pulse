import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken, login as apiLogin } from "../../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // INIT — carrega token do storage
  // ===============================
  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (storedToken) {
      setAuthToken(storedToken);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ===============================
  // LOGIN
  // ===============================
  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    const access = res.data.access;

    setAuthToken(access);
    localStorage.setItem("access", access);
    setToken(access);
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("access");
    setAuthToken(null);
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ===============================
// HOOK
// ===============================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
