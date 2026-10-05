import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user?.rol === "admin" ? "/admin" : "/mis-reservas");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={handleLogin}>
        <div className="auth-brand">
          <span className="auth-badge">AeroViajes</span>
          <h2>Iniciar sesion</h2>
          <p className="form-subtitle">Accede segun tu rol de usuario.</p>
        </div>

        {error && <div className="alert alert-error">❌ {error}</div>}

        <div className="form-group">
          <label>Email</label>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        </div>

        <button className="btn-search btn-form-submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="form-footer-text">
          ¿No tienes cuenta? <Link to="/register" className="form-footer-link">Registrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
