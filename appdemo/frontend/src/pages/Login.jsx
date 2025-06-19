import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../style/Login.css"; // Asegúrate que este archivo contenga el CSS proporcionado

const Login = () => {
  const [formData, setFormData] = useState({ Correo: "", Password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar mensaje de error cuando el usuario empieza a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/usuarios/login",
        formData
      );

      const token = response.data.token;
      const userData = response.data.usuario;

      login(userData, token); // Actualiza el contexto global

      // Pequeña pausa para mostrar estado de carga
      setTimeout(() => {
        setLoading(false);
        // Redirige según tipo de usuario
        if (userData.tipo === "empleado") {
          navigate("/"); // Si es empleado, redirigimos a la página principal
        } else {
          navigate("/"); // Si es cliente, redirigimos a la página principal
        }
      }, 500);
    } catch (error) {
      setLoading(false);
      console.error(
        "Error en el login:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.mensaje ||
          "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">GOLGANA</div>
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">
          Bienvenido de nuevo. Accede a tu cuenta para gestionar tus predios y reservas.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            className="form-control"
            name="Correo"
            placeholder="tucorreo@ejemplo.com"
            value={formData.Correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            name="Password"
            placeholder="Tu contraseña"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="login-options">
        <Link to="/forgot-password" className="forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className="login-divider">
        <span className="login-divider-text">o</span>
      </div>

      <div className="register-link">
        ¿No tienes una cuenta?{" "}
        <Link to="/register">Regístrate ahora</Link>
      </div>
    </div>
  );
};

export default Login;