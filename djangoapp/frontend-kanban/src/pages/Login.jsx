import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já estiver logado, não deixa ficar no login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Pulse</h2>
        <p className="login-subtitle">Acesso ao sistema</p>

        <label className="login-label" htmlFor="username">Usuário</label>
        <input
          id="username"
          type="text"
          placeholder="Digite seu usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
          autoComplete="username"
        />

        <label className="login-label" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}